<?php

namespace Arquematics\WallBundle\Controller;

use Arquematics\WallBundle\Entity\WallComment;

use Arquematics\WallBundle\Form\CommentType;

use Arquematics\BackendBundle\Utils\ArController;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;


class VoteController extends ArController
{
    public function createAction($message_id,Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        $this->wallMessage = $this->em->getRepository('WallBundle:WallMessage')->find($message_id);
        if (! $this->wallMessage)
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
        
        
        if (($request->getMethod() == 'POST')
           && $request->isXmlHttpRequest()
           && ($this->wallMessage->canVote($this->authUser)))
        {
           
            $this->authUser->addVote($this->wallMessage);
            $this->em->persist($this->authUser);
            $this->em->flush();
            
            //actualiza los enlaces despues del flush
            $this->em->refresh($this->wallMessage);
            
            $messagesEnc = $this->em->getRepository('WallBundle:WallMessageEnc')
                                ->findByMenssage($this->wallMessage); 
                
            $dataPush = [];
            if ($messagesEnc && count($messagesEnc) > 0)
            {
                foreach ($messagesEnc as $messageEnc)
                {
                    $dataPush[$messageEnc->getUser()->getId()] = $this->processData($this->wallMessage, $messageEnc->getUser());
                }
            }
            
            $pusher = $this->container->get('gos_web_socket.wamp.pusher');
            $pusher->push($dataPush, 'vote_user', array('user_id' => $this->authUser->getId())); 
               
            $response = new JsonResponse();
            $response->setData($this->processData($this->wallMessage, $this->authUser));
            return $response;
        }
        else
        {
           $response = new Response();
           $response->setStatusCode(500);
           return $response; 
        }
    }
    
    private function processData($message, $authUser)
    {
        $translator = $this->get('translator');
        
        $messageData = $this->wallMessage->jsonSerialize();
        
        $messageData['voteURL'] = $this->generateUrl('vote', array('message_id' => $message->getId()));
        
        $messageData['voteCountReal'] = count($messageData['votes']);
        //esta en sentido inverso
        $messageData['like'] = true;
        
        if ($message->hasVote($authUser)) 
        {
            $messageData['voteCount'] = count($messageData['votes']) -1;
          
            if ($messageData['voteCount'] == 0)
            {
                $messageData['voteByMe'] = $translator->trans('wall.like_you_singular'); 
                $messageData['voteNames'] =  $message->getVotesUserNames($authUser);
            }
            else if ($messageData['voteCount'] == 1 )
            {
                $messageData['voteByMe'] = $translator->trans('wall.like_you_plural_one'); 
                $messageData['voteNames'] =  $message->getVotesUserNames($authUser);
            }
            else
            {
                $messageData['voteByMe'] =  $translator->trans('wall.like_you_plural_two', array('%count%' => $messageData['voteCount']));
                $messageData['voteNames'] =  $message->getVotesUserNames($authUser);
            }
            
            $messageData['like'] = false;
          
        }
        else if (count($messageData['votes']) == 0)
        {
          $messageData['voteCount'] = $translator->trans('wall.like_singular');   
          $messageData['voteNames'] = '';
          
        }
        else if (count($messageData['votes']) == 1)
        {
           $messageData['voteCount'] = $translator->trans('wall.like_plural_one');
           $messageData['voteNames'] =  $message->getVotesUserNames($authUser);
        }
        else
        {
           $messageData['voteCount'] = $translator->trans('wall.like_plural_two', array('%count%' => count($messageData['votes'])));
           $messageData['voteNames'] = $message->getVotesUserNames($authUser);
        }
        
        return $messageData;
    }
    
    public function deleteAction($message_id,Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
        
        $this->wallMessage = $this->em->getRepository('WallBundle:WallMessage')->find($message_id);
        if (! $this->wallMessage)
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
        
        if (($request->getMethod() == 'DELETE') 
            && $request->isXmlHttpRequest())
        {
            if ($this->wallMessage->hasVote($this->authUser))
            {
                $this->authUser->removeVote($this->wallMessage);
                
                $this->em->persist($this->authUser);
                $this->em->flush();
                
                //actualiza los enlaces despues del flush
                $this->em->refresh($this->wallMessage);
                
                $messagesEnc = $this->em->getRepository('WallBundle:WallMessageEnc')
                                ->findByMenssage($this->wallMessage); 
                $dataPush = [];
                if ($messagesEnc && count($messagesEnc) > 0)
                {
                    foreach ($messagesEnc as $messageEnc)
                    {
                        $dataPush[$messageEnc->getUser()->getId()] = $this->processData($this->wallMessage, $messageEnc->getUser());
                    }
                }
                
                $pusher = $this->container->get('gos_web_socket.wamp.pusher');
                $pusher->push($dataPush, 'vote_user', array('user_id' => $this->authUser->getId())); 
             
                

                $response = new JsonResponse();
                $response->setData($this->processData($this->wallMessage, $this->authUser));
            
                return $response;
            }
            else 
            {
               $response = new Response();
               $response->setStatusCode(401);
               return $response;  
            }
        }
        else 
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
    }
    
    
}
