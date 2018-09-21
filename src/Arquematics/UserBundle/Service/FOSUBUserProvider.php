<?php

namespace Arquematics\UserBundle\Service;

use Symfony\Component\DependencyInjection\ContainerInterface;

use HWI\Bundle\OAuthBundle\OAuth\Response\UserResponseInterface;
use HWI\Bundle\OAuthBundle\Security\Core\User\FOSUBUserProvider as BaseClass;
use Symfony\Component\Security\Core\User\UserInterface;

use Arquematics\WallBundle\Entity\SocialPage;

use Doctrine\Common\Collections\ArrayCollection;

use Happyr\LinkedIn\LinkedIn;

class FOSUBUserProvider extends BaseClass 
{
    private $container;
    
    private function getExpiredTime($expiredTime)
    {
        return gmdate('Y-m-d H:i:s', time() + $expiredTime);
    }
    /**
     * Constructor.
     *
     * @param UserManagerInterface $userManager FOSUB user provider.
     * @param array                $properties  Property mapping.
     * @param ContainerInterface   $container.
     */
    public function __construct( $userManager, $properties,ContainerInterface $container)
    {
       /*
        if (defined('CURLOPT_IPRESOLVE') && defined('CURL_IPRESOLVE_V4')){
            curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
        }*/
        parent::__construct($userManager, $properties);
                
        $this->container = $container;
    }
    
    private function canLinkedInPublish($user)
    {
        $consumerKey = $this->container->getParameter('linkedin_client_id');
        $consumerSecret = $this->container->getParameter('linkedin_client_secret');
        
        $linkedinToken = $user->getLinkedinAccessToken();
                
        try {
           $this->connection = new LinkedIn(
                $consumerKey,
                $consumerSecret);
           
           $this->connection->setAccessToken($linkedinToken);
           
           return $this->connection->isAuthenticated();
            
        } catch (Exception $ex) {
            return false;
        }
    } 
    
    private function addPageCompanies(& $user)
    {
        try {

          $companies = $this->connection
                ->get('v1/companies?format=json&is-company-admin=true', array());
            
          if ($companies 
             && isset($companies["values"])
             && count($companies["values"]) > 0)
          {
              $user->getSocialPages()->clear();
              
              foreach ($companies["values"] as $pageInfo)
              {
                $socialPage = new SocialPage();
                $socialPage->setSocialType(SocialPage::LINKEDIN);
                $socialPage->setIdentification($pageInfo['id']);
                $socialPage->setName($pageInfo['name']);
                $socialPage->setCreatedBy($user);
                
                $user->addSocialPage($socialPage);
              }
          }
            
        } catch (Exception $ex) {

        }
    }
    
    public function connect( UserInterface $user, UserResponseInterface $response) 
    {
       
        $property = $this->getProperty($response);
        
        $username = $response->getUsername();
        
        // On connect, retrieve the access token and the user id
        $service = $response->getResourceOwner()->getName();
        
        $setter = 'set' . ucfirst($service);
        $getter = 'get' . ucfirst($service);
        $setter_id = $setter . 'Id';
        $setter_token = $setter . 'AccessToken';
        $setter_name = $setter . 'Name';
        $getter_enable = $getter . 'Enable';
        
        $setter_secret_token = $setter . 'SecretToken';
        $setter_refresh_token = $setter . 'RefreshToken';
        $setter_expires_in = $setter . 'ExpiresIn';
        
        //getTwitterRefreshToken
        
        $data = $response->getResponse();
        $userNameInService = ($service === 'linkedin')?$data['formattedName']:$data['name'];
       
        
        // Disconnect previously connected users
        if (null !== $previousUser = $this->userManager->findUserBy(array($property => $username))) {
            $previousUser->$setter_id(null);
            $previousUser->$setter_token(null);
            $previousUser->$setter_name(null);
            $previousUser->$setter_secret_token(null);
            $previousUser->$setter_refresh_token(null);
            $previousUser->$setter_expires_in(null);
            
            $previousUser->getSocialPages()->clear();

            $this->userManager->updateUser($previousUser);
        }
        
        if ($user->$getter_enable())
        {
             // Connect using the current user
            $user->$setter_name($userNameInService);
            $user->$setter_id($username);
            $user->$setter_token($response->getAccessToken());
            $user->$setter_secret_token($response->getTokenSecret());
            $user->$setter_refresh_token($response->getRefreshToken());
            $user->$setter_expires_in($response->getExpiresIn());
            
            if (($service === 'linkedin')
              && $this->canLinkedInPublish($user))
            {
               $this->addPageCompanies($user);
            }
        }
       
        
        $this->userManager->updateUser($user);
    }

    public function loadUserByOAuthUserResponse(UserResponseInterface $response) 
    {

        
        $service = $response->getResourceOwner()->getName();
      
        //$isAuth =  $this->container->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY');
        //solo es para usuario ya autentificados
        //if ($isAuth)
        //{
            $user = $this->container->get('security.token_storage')->getToken()->getUser();
            
            $setter = 'set' . ucfirst($service);
            $getter = 'get' . ucfirst($service);
            $setter_id = $setter . 'Id';
            $getter_id = $getter . 'Id';
            $setter_token = $setter . 'AccessToken';
            $getter_token = $getter . 'AccessToken';
            
            $setter_secret_token = $setter . 'SecretToken';
            $setter_refresh_token = $setter . 'RefreshToken';
            
            $setter_name =  $setter . 'Name';
            $getter_enable = $getter . 'Enable';
            
            $setter_expires_in = $setter . 'ExpiresIn';

            if ((($user->$getter_id() != $response->getUsername()) 
               || ($user->$getter_token() != $response->getAccessToken()))
                && $user->$getter_enable())
            {
                $data = $response->getResponse();

                if (isset($data['formattedName']) || isset($data['name']))
                {
                    $userNameInService = ($service === 'linkedin')?$data['formattedName']:$data['name'];
                
               
                    $user->$setter_name($userNameInService);
                }
                
                $user->$setter_id($response->getUsername());
                $user->$setter_token($response->getAccessToken());
                
                $user->$setter_secret_token($response->getTokenSecret());
                $user->$setter_refresh_token($response->getRefreshToken());
                $user->$setter_expires_in($response->getExpiresIn());
                
                if (($service === 'linkedin')
                    && $this->canLinkedInPublish($user))
                {
                    $this->addPageCompanies($user);
                }
                
                $this->userManager->updateUser($user);
                /*
                switch ($service) {
                    case "twitter":
                         $this->container->get('session')
                            ->getFlashBag()
                            ->add('success', $this->container->get('translator')->trans("profile.social_connected_twitter"));
                    break;
                    case "facebook":
                         $this->container->get('session')
                            ->getFlashBag()
                            ->add('success', $this->container->get('translator')->trans("profile.social_connected_facebook"));
                    break;
                    case "linkedin":
                        $this->container->get('session')
                            ->getFlashBag()
                            ->add('success', $this->container->get('translator')->trans("profile.social_connected_linkedin"));
                    break;
                }*/
                
                return $user;
            }
        //}
        // If the user exists, use the HWIOAuth
        //$user = parent::loadUserByOAuthUserResponse($response);
        
        //$serviceName = $response->getResourceOwner()->getName();
        
        //$setterAccessToken = 'set' . ucfirst($serviceName) . 'AccessToken';
        
        // Update the access token
        $user->$setter_token($response->getAccessToken());
        $user->$setter_secret_token($response->getTokenSecret());
        $user->$setter_refresh_token($response->getRefreshToken());
        $user->$setter_expires_in($response->getExpiresIn());
        
        return $user;
    }
    
    /**
     * Generates a random username with the given 
     * e.g 12345_github, 12345_facebook
     * 
     * @param string $username
     * @param type $serviceName
     * @return type
     */
    private function generateRandomUsername($username, $serviceName)
    {
        if(!$username){
            $username = "user". uniqid((rand()), true) . $serviceName;
        }
        
        return $username. "_" . $serviceName;
    }
}