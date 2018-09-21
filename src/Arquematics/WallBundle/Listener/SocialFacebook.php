<?php

namespace Arquematics\WallBundle\Listener;


use Arquematics\WallBundle\Entity\SocialPage;

use Facebook\Facebook;
use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;

class SocialFacebook
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
    
     
    public function hasSelectedFacebookPage()
    {
        $ret = false;
        if (count($this->getSocialPages()) > 0)
        {
            foreach ($this->getSocialPages() as $page)
            {
                $ret = $ret || ($page->getSelected() && ($page->getSocialType() === SocialPage::FACEBOOK));
            }
        }
        return $ret;
    }
    
    public function getSelectedFacebookPage()
    {
        $ret = false;
        if (count($this->getSocialPages()) > 0)
        {
            foreach ($this->getSocialPages() as $page)
            {
                if ($page->getSelected() 
                   && ($page->getSocialType() === SocialPage::FACEBOOK))
                {
                    $ret = $page;
                }
            }
        }
        
        return $ret;
    }
    
    public function canPublish($user)
    {
        $consumerKey = $this->container->getParameter('facebook_client_id');
        $consumerSecret = $this->container->getParameter('facebook_client_secret');
        
        $facebookToken = $user->getFacebookAccessToken();
        $facebookSecretToken = $user->getFacebookSecretToken();

       
        try {
           $this->connection = new Facebook([
                            'app_id' => $consumerKey,
                            'app_secret' => $consumerSecret,
                            'default_graph_version' => 'v2.10',
                            //'default_access_token' => $facebookToken, // optional
            ]);
           
          
 
           /*
            $this->connection->setTimeouts(10, 15);
        
            $this->connection->get("account/verify_credentials");
            
            return $this->connection->getLastHttpCode() == 200;  
            * 
            */
           
           return true;
            
        } catch (Exception $ex) {
           return false;
       }
    }
    
    public function publish($event)
    {
        $message = $event->getMessage();
        $user = $event->getUser();
         
        $linkData = [
            'link' => 'http://www.example.com',
            'message' => $message->getContent()
        ];

        //try {
            // Returns a `Facebook\FacebookResponse` object
            //$response = $this->connection->post('/me/feed', $linkData, '{access-token}');
            $response = $this->connection->post('/me/feed', $linkData, $user->getFacebookAccessToken());
          
           
            
            //return true;
        /*} catch(FacebookResponseException $e) {
            return false;
        } catch(FacebookSDKException $e) {
             return false;
        }*/
        
        /*
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
        }*/
        
    }
    
    public function unPublish($event)
    {
        /*
        $message = $event->getMessage();
        
        try {
            $this->connection->post('statuses/destroy/'.$message->getTwitterId(), array());

            return true;
        } catch (Exception $e) {
            return false;
        }*/
    }
    
        
    public function onDestroy($event)
    {
        /*
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
        }*/
    }
    
        
    public function onPublish($event)
    {
        $message = $event->getMessage();
        
       
       
        if ($message->hasFacebook())
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
}


/*
 * publish in the profile
 * <?php
// require Facebook PHP SDK
// see: https://developers.facebook.com/docs/php/gettingstarted/
require_once("/YOUR_PATH_TO/facebook_php_sdk/facebook.php");
 
// initialize Facebook class using your own Facebook App credentials
// see: https://developers.facebook.com/docs/php/gettingstarted/#install
$config = array();
$config['appId'] = 'YOUR_APP_ID';
$config['secret'] = 'YOUR_APP_SECRET';
$config['fileUpload'] = false; // optional
 
$fb = new Facebook($config);
 
// define your POST parameters (replace with your own values)
$params = array(
  "access_token" => "YOUR_ACCESS_TOKEN", // see: https://developers.facebook.com/docs/facebook-login/access-tokens/
  "message" => "Here is a blog post about auto posting on Facebook using PHP #php #facebook",
  "link" => "http://www.pontikis.net/blog/auto_post_on_facebook_with_php",
  "picture" => "http://i.imgur.com/lHkOsiH.png",
  "name" => "How to Auto Post on Facebook with PHP",
  "caption" => "www.pontikis.net",
  "description" => "Automatically post on Facebook with PHP using Facebook PHP SDK. How to create a Facebook app. Obtain and extend Facebook access tokens. Cron automation."
);
 
// post to Facebook
// see: https://developers.facebook.com/docs/reference/php/facebook-api/
try {
  $ret = $fb->api('/YOUR_FACEBOOK_ID/feed', 'POST', $params);
  echo 'Successfully posted to Facebook';
} catch(Exception $e) {
  echo $e->getMessage();
}
?>
 */