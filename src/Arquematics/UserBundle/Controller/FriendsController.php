<?php

namespace Arquematics\UserBundle\Controller;

use Arquematics\BackendBundle\Utils\ArController;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


use Arquematics\UserBundle\Entity\UserFriend;

use Arquematics\BackendBundle\Entity\Notification;

class FriendsController extends ArController
{
    
    public function indexAction(Request $request)
    {
        if (!$this->checkView($request))
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        if (($request->getMethod() == 'GET') 
           && $request->isXmlHttpRequest())
        {
            $users = $this->em->getRepository('UserBundle:User')->findAllUsersNotUserNotIgnore($this->authUser);
            
            $data = [];
            
            foreach ($users as $user)
            {
                $data[] = $this->processFriendUser($user, $this->authUser);
            }
            
            $response = new JsonResponse();
            $response->setData($data); 
            
            return $response;
        }
        else if ($request->getMethod() == 'GET') 
        {
          return $this->render('UserBundle:User:list.html.twig', array(
            'websocketMethod'       => $this->container->getParameter('websocket_method'),
            'websocketHost' => $this->container->getParameter('websocket_host'),
            'websocketPort' => $this->container->getParameter('websocket_port'),
            'friends'    => array_merge($this->em->getRepository('UserBundle:User')->findByFriend($this->authUser), array($this->authUser)),
            'sessionname' => $this->container->getParameter('sessionname'),
            'authUser'    => $this->authUser,
            "menuSection" => "lists"
           ));  
        }
        
        $response = new Response();
        $response->setStatusCode(500);
        return $response;     
        
    }
    
    private function processFriendUser($user, $authUser)
    {
        $data = $user->jsonSerialize();
        
        $data['authUserId'] = $authUser->getId();
        
        $data['image'] = ($data['image'])? $this->generateUrl('user_profile_avatar', array('fileName' => $data['image'])) 
                                :  $this->get('assets.packages')
                                        ->getUrl('bundles/user/img/avatars/unknown.png', $packageName = null);
        
        $friendOf =  $this->em->getRepository('UserBundle:UserFriend')
                                ->findByUserAndFriend(
                                        $authUser,
                                        $user);

        if ($friendOf != null)
        {
            if ($friendOf->getStatus() == UserFriend::ACCEPT)
            {
                $data['accept'] = true;
                $data['url'] = $this->generateUrl('user_friend_remove', array('slug' => $user->getSlug()));  
            }
            else if ($friendOf->getStatus() == UserFriend::REQUEST)
            {
                if ($authUser->getId() === $friendOf->getUser()->getId())
                {
                    $data['request'] = true;
                    $data['url'] = $this->generateUrl('user_friend_request', array('slug' => $user->getSlug())); 
                }
                else
                {
                   $data['requestWait'] = true;
                   $data['url'] = $this->generateUrl('user_friend_accept', array('slug' => $user->getSlug()));  
                }
            }
            else if ($friendOf->getStatus() == UserFriend::IGNORE)
            {
                
                if ($authUser->getId() === $friendOf->getUser()->getId())
                {
                   $data['ignoreAll'] = true;
                   $data['url'] = '#';
                }
                else
                {
                   $data['ignore'] = true;
                   $data['url'] = $this->generateUrl('user_friend_accept', array('slug' => $user->getSlug()));
                }
                
            }
            
            $data['status'] = $friendOf->getStatus();
        }
        else
        {
            $data['none'] = true;
            $data['url'] = $this->generateUrl('user_friend_request', array('slug' => $user->getSlug()));
        }
        
 
        return $data;
    }
    
    
    private function addFriendNotification($user, $friend)
    {
        
        $translator =  $this->get('translator');
        
        $completeName = ucfirst($user->getProfile()->getName()).' '.ucfirst($user->getProfile()->getLastname());
                              
        $notification = new Notification;
        $notification->setType(Notification::FRIEND);
        $notification->setShortMessage($translator->trans("notification.friend.short_message", array('%username%' => $completeName)));
        $notification->setMessage($translator->trans("notification.friend.message", array('%username%' => $completeName))); 
           
        $notification->setUser($friend);
        $notification->setFriend($user);

        $this->em->persist($notification);       
        $this->em->flush();
        
        return $notification;
    }
    
    private function checkFriend(Request $request, $slug = false)
    {
        if (!$this->checkView($request))
        {
           $response = new Response();
           $response->setStatusCode(404);
           return $response;
        }
        
        $this->currenUser =  $this->em->getRepository('UserBundle:User')
                                ->findOneBy(array('slug' => $slug ));
        if (!$this->currenUser)
        {
           $response = new Response();
           $response->setStatusCode(500);
           return $response;
        }
        
        $this->friend = $this->em->getRepository('UserBundle:UserFriend')
                                ->findByUserAndFriend(
                                        $this->authUser,
                                        $this->currenUser);
        if (!$this->friend)
        {
           $response = new Response();
           $response->setStatusCode(500);
           return $response;
        }
    }
    
    public function friendBlockAction(Request $request, $slug = false)
    {
        $this->checkFriend($request, $slug);
        
        if (($this->friend->getStatus() === UserFriend::REQUEST)
           && ($this->friend->getFriend()->getId() === $this->authUser->getId()))
        {

            $this->friend->setStatus(UserFriend::IGNORE);
            $this->em->persist($this->friend);
            
            $notification = $this->em->getRepository('BackendBundle:Notification')
                                    ->findFriendNotification($this->friend->getFriend(), $this->friend->getUser());
            
            if ($notification)
            {
                //$this->pushNotification($notification, Notification::IGNORE_ALL);
                $this->em->remove($notification);
            }
            $this->em->flush();
 
            $response = new JsonResponse();
            $response->setData($this->processFriendUser($this->currenUser, $this->authUser));
            
            $pusher = $this->container->get('gos_web_socket.wamp.pusher');
            $pusher->push($this->processFriendUser($this->authUser, $this->currenUser) , 'notification_user');
            
            return $response;       
        }
        else
        {
           $response = new Response();
           $response->setStatusCode(500);
           return $response;
        }
        
    }
    
    public function friendRemoveAction(Request $request, $slug = false)
    {
        $this->checkFriend($request, $slug);
        
        if ((($this->friend->getStatus() === UserFriend::ACCEPT)
                && ($this->friend->getFriend()->getId() === $this->authUser->getId()))
          || (($this->friend->getStatus() === UserFriend::ACCEPT)
                && ($this->friend->getUser()->getId() === $this->authUser->getId())))
        {
            $this->em->remove($this->friend);
            
            $this->em->flush();

            $response = new JsonResponse();
            $response->setData($this->processFriendUser($this->currenUser, $this->authUser));
            
            $pusher = $this->container->get('gos_web_socket.wamp.pusher');
            $pusher->push($this->processFriendUser($this->authUser, $this->currenUser) , 'notification_user');
            
            return $response;
        }
        else
        {
           $response = new Response();
           $response->setStatusCode(500);
           return $response;
        }
        
    }
    
    public function friendAcceptAction(Request $request, $slug = false)
    {
        $this->checkFriend($request, $slug);
        
        if (($this->friend->getStatus() === UserFriend::IGNORE)
           && ($this->friend->getFriend()->getId() === $this->authUser->getId()))
        {
            
            $notification = $this->em->getRepository('BackendBundle:Notification')
                                    ->findFriendNotification($this->friend->getFriend(), $this->friend->getUser());
            
            if ($notification)
            {
                $this->em->remove($notification);
            }
            
            $this->em->remove($this->friend);
            $this->em->flush();
            
            $pusher = $this->container->get('gos_web_socket.wamp.pusher');
            $pusher->push($this->processFriendUser($this->authUser, $this->currenUser) , 'notification_user');
            
            $response = new JsonResponse();
            $response->setData($this->processFriendUser($this->currenUser, $this->authUser));
            
            return $response;
        }
        else if (($this->friend->getStatus() === UserFriend::REQUEST)
           && ($this->friend->getFriend()->getId() === $this->authUser->getId()))
        {
                $this->friend->setlist($this->em->getRepository('WallBundle:WallList')->findGeneral());
                $this->friend->setStatus(UserFriend::ACCEPT);
                $this->em->persist($this->friend);
                
                $notification = $this->em->getRepository('BackendBundle:Notification')
                                    ->findFriendNotification($this->friend->getFriend(), $this->friend->getUser());
                
                if ($notification)
                {
                    $this->em->remove($notification);
                }
                
                $this->em->flush();
                
                $pusher = $this->container->get('gos_web_socket.wamp.pusher');
                $pusher->push($this->processFriendUser($this->authUser, $this->currenUser) , 'notification_user');
                
                $response = new JsonResponse();
                $response->setData($this->processFriendUser($this->currenUser, $this->authUser));
            
                return $response;
        }
        else
        {
           $response = new Response();
           $response->setStatusCode(500);
           return $response;
        }
        
    }
    
    public function friendRequestAction(Request $request, $slug = false)
    {
        if (!$this->checkView($request))
        {
           $response = new Response();
           $response->setStatusCode(404);
           return $response;
        }
        
        $this->currenUser =  $this->em->getRepository('UserBundle:User')
                                ->findOneBy(array('slug' => $slug ));
        if (!$this->currenUser)
        {
           $response = new Response();
           $response->setStatusCode(500);
           return $response;
        }
        
        $this->friend = $this->em->getRepository('UserBundle:UserFriend')
                                ->findByUserAndFriend(
                                        $this->authUser,
                                        $this->currenUser);
        if ($this->friend)
        {
            if (($this->friend->getStatus() === UserFriend::REQUEST)
               && ($this->friend->getUser()->getId() === $this->authUser->getId()))
            {
                $this->em->remove($this->friend);
                
                
                $notification = $this->em->getRepository('BackendBundle:Notification')
                                    ->findFriendNotification($this->currenUser,$this->aUser);
                
                if ($notification)
                {   
                    $this->em->remove($notification);
                }
                
                $this->em->flush();
            } 
            else 
            {
                $response = new Response();
                $response->setStatusCode(500);
                return $response;
            }
        }
        else
        {
            $friend = new UserFriend();
            $friend->setUser($this->aUser);
            $friend->setFriend($this->currenUser);
            $friend->setStatus(UserFriend::REQUEST);
            $this->em->persist($friend);

            $this->aUser->addFriend($friend);
            $this->em->persist($this->aUser);
            $this->em->flush();
            
            //borra la notificación antigua y hace una nueva
            $notification = $this->em->getRepository('BackendBundle:Notification')
                                    ->findFriendNotification($this->currenUser,$this->aUser);
            
            if ($notification)
            {
                $this->em->remove($notification);
                $this->em->flush();
            }
            
            $this->addFriendNotification($this->aUser, $this->currenUser);
            
        }
        
        $pusher = $this->container->get('gos_web_socket.wamp.pusher');
        $pusher->push($this->processFriendUser($this->authUser, $this->currenUser) , 'notification_user');
        
        $response = new JsonResponse();
        $response->setData($this->processFriendUser($this->currenUser, $this->authUser));
            
        return $response;
    }
}