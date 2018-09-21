<?php

namespace Arquematics\WallBundle\Listener;


use Abraham\TwitterOAuth\TwitterOAuth;

class SocialTwitter
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
        $consumerKey = $this->container->getParameter('twitter_client_id');
        $consumerSecret = $this->container->getParameter('twitter_client_secret');
        
        $twitterToken = $user->getTwitterAccessToken();
        $twitterSecretToken = $user->getTwitterSecretToken();
        
        try {
           $this->connection = new TwitterOAuth(
                $consumerKey,
                $consumerSecret ,
                $twitterToken,
                $twitterSecretToken);
        
            $this->connection->setTimeouts(10, 15);
        
            $this->connection->get("account/verify_credentials");
        
            return $this->connection->getLastHttpCode() == 200;  
            
        } catch (Exception $ex) {
            return false;
        }
    }
    
    public function publish($event)
    {
        $message = $event->getMessage();
        
        try {
            $post = $this->connection->post('statuses/update', ['status' => $message->getContent(), 'trim_user' => true]);
            
            $ret = !empty($post->id_str);
            
            if ($ret)
            {
               
                $message->setTwitterId($post->id_str);
                
                $this->em->persist($message);
                $this->em->flush();
            }
            
            return $ret;
        } catch (Exception $e) {
            return false;
        }
        
    }
    
    public function unPublish($event)
    {
        $message = $event->getMessage();
        
        try {
            $this->connection->post('statuses/destroy/'.$message->getTwitterId(), array());

            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
        
    public function onDestroy($event)
    {
        $message = $event->getMessage();
        

        if ($message->hasTwitter())
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
        
        if ($message->hasTwitter())
        {
            if (!$this->canPublish($event->getUser()))
            {
                //error ya mirare que hacer
                return;
            }
        
            if (!$this->publish($event))
            {
                //error ya mirare que hacer
                return;
            }
        }
    }
 
    
     //($twitteroauth->getLastHttpCode() != 200) 
        
        /*
        use Abraham\TwitterOAuth\TwitterOAuth;
 
$twData = array(
    'consumer_key' => consumer_key,
    'consumer_secret' => consumer_secret,
    'callback_url' => 'callback.php'
);
 
$tw = new TwitterOAuth($twData['consumer_key'], $twData['consumer_secret']);
$content = $tw->get("account/verify_credentials");
 
$request_token = $tw->oauth("oauth/request_token", array("oauth_callback" => $twData['callback']));
 
$_SESSION['oauth_token'] = $token = $request_token['oauth_token'];
$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];
 

$url = $tw->url("oauth/authorize", array("oauth_token" => $token));
 
header('Location: ' . $url);
exit;*/
}