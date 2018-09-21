<?php

namespace Arquematics\WallBundle\Listener;

use Happyr\LinkedIn\LinkedIn;

class SocialLinkedin
{
    protected $container;
    protected $em;
    
    protected $authUser;
    
    protected $connection;

    public function __construct($container, $em)
    {
	$this->container = $container;
        $this->em = $em;
    }

    public function canPublish($user)
    {
        $consumerKey = $this->container->getParameter('linkedin_client_id');
        $consumerSecret = $this->container->getParameter('linkedin_client_secret');
        
        $linkedinToken = $user->getLinkedinAccessToken();
        $linkedinSecretToken = $user->getLinkedinSecretToken();
                
        try {
           $this->connection = new LinkedIn(
                $consumerKey,
                $consumerSecret);
           
           $this->connection->setAccessToken($linkedinToken);
           //$this->connection->setAccessToken($linkedinSecretToken);
           
           return $this->connection->isAuthenticated();
            
        } catch (Exception $ex) {
            return false;
        }
    }
    
    public function publishPage($event)
    {
        $message = $event->getMessage();
        $socialPage = $event->getUser()->getSelectedLinkedinPage();
        
        try {
            $post = $this->connection->post('v1/companies/' . $socialPage->getIdentification(). '/shares', $this->processContentMessage($message));
            
            $ret = $post && isset($post['updateKey']);
            
            if ($ret)
            {
                $message->setLinkedinId($post['updateKey']);
                
                $this->em->persist($message);
                $this->em->flush();
            }
            
            return $ret;
        } catch (Exception $e) {
            return false;
        }
    }
    
    private function processContentMessage($message)
    {
        
        if ($message->hasMainLink())
        {
           $wallMainLink = $message->getMainLink();
             
           $options = array('json'=>
                array(
                    'comment' => $message->getFilterContent(),
                    'content' => array(
                        'submitted-url' => $wallMainLink->getUrl()
                    ),
                    'visibility' => array(
                        'code' => 'anyone'
                    )
                )
            );
        }
        else 
        {
            $options = array('json'=>
                array(
                    'comment' => $message->getContent(),
                    'visibility' => array(
                        'code' => 'anyone'
                    )
                )
            );
     
        }
        
        if (count($message->getWallLinks()) > 0)
        {
            $wallLinks = $message->getWallLinks();
            $wallMainLink = $wallLinks[0];
            $prefixUrl =  $wallMainLink->getUrlquery();
            
            $str =  trim($message->getContent());
            //quita la url del principio
            if (substr($str, 0, strlen($prefixUrl)) == $prefixUrl) {
                $str = substr($str, strlen($prefixUrl));
            } 
            
            
        }
        else {
            
        }
        
        return $options;
    }
    
    public function publishSimple($event)
    {
        $message = $event->getMessage();
        
        try {
            
            $post = $this->connection->post('v1/people/~/shares',  $this->processContentMessage($message));

            $ret = $post && isset($post['updateKey']);
            
            if ($ret)
            {
                $message->setLinkedinId($post['updateKey']);
                
                $this->em->persist($message);
                $this->em->flush();
            }
            
            return $ret;
        } catch (Exception $e) {
            return false;
        }
    }
    
    //mirar
    //https://github.com/zoonman/linkedin-api-php-client
    //
    //mirar https://developer.linkedin.com/docs/guide/v2/shares/share-update-and-delete-api#delete 
    public function unPublish($event)
    {
        return true;
        /*
        $message = $event->getMessage();
        
       // try {
       
        
            $data = explode("-",  $message->getLinkedinId());
            
           
            $ret = $this->connection->get('v2/shares?ids=urn:li:share:'.$data[2], array());
            print_r($ret);
            //https://api.linkedin.com/v2/activities?ids=urn:li:activity:6252923622642540544
            
            
            $ret = $this->connection->api('DELETE', 'v2/shares/urn:li:share:'.$data[2], array());
            //$ret = $this->connection->api('DELETE', 'v2/shares/urn:li:share:6357644134081191936', array());
            //
           
            print_r($ret);
            exit();
            return true;
       // } catch (Exception $e) {
       //     return false;
       // }*/
    }
    
        
    public function onDestroy($event)
    {
        $message = $event->getMessage();

        if ($message->hasLinkedin())
        {
            if (!$this->canPublish($event->getUser()))
            {
                //error ya mirare que hacer
                return;
            }
        
            if (!$this->unPublish($event))
            {
                //error ya mirare que hacer
                return;
            }
        }
    }

    public function onPublish($event)
    {
        $message = $event->getMessage();
        
        if ($message->hasLinkedin())
        {
            if (!$this->canPublish($event->getUser()))
            {
                //error ya mirare que hacer
                return;
            }
            
            if ($event->getUser()->hasSelectedLinkedinPage()
                && (!$this->publishPage($event)))
            {
                //error ya mirare que hacer
                return;
            }
            else if (!$this->publishSimple($event))
            {
                //error ya mirare que hacer
                return;
            }
        }
    }
}