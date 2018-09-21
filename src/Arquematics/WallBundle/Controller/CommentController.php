<?php

namespace Arquematics\WallBundle\Controller;

use Arquematics\WallBundle\Entity\WallComment;

use Arquematics\WallBundle\Form\CommentType;

use Arquematics\BackendBundle\Utils\ArController;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;


class CommentController extends ArController
{
    public function createAction($channel_slug, $message_id,Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        $this->wallMessage = $this->em->getRepository('WallBundle:WallMessage')->find($message_id);
        //aqui podrian estar los permisos $wallMessage->canComment($user)
        if (! $this->wallMessage)
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
        
          
        
        $this->wallComment = new WallComment();
        
        $form = $this->createForm(CommentType::class, $this->wallComment,['entity_manager' => $this->getDoctrine()->getManager(), 'message' => $this->wallMessage, 'user' => $this->authUser]);
        
        if ($request->getMethod() == 'POST')
        {
            $form->handleRequest($request);

            if($form->isSubmitted() 
               && $form->isValid())
            {
                $this->em->persist($this->wallComment);
                $this->em->flush();
                
                $this->currentChannel = $this->em->getRepository('WallBundle:ArChannel')
                                        ->findOneBy(array('slug' => $channel_slug)); 
                
                $data = $this->wallComment->jsonSerialize();
                
                $wallCommentEnc = $this->em->getRepository('WallBundle:WallCommentEnc')->findByCommentUser($this->wallComment, $this->authUser);
                $data['pass'] = $wallCommentEnc->getContent();
                
                $data['user']['image'] = ($data['user']['image'])? $this->generateUrl('user_profile_avatar', array('fileName' => $data['user']['image'])) 
                                :  $this->get('assets.packages')
                                        ->getUrl('bundles/user/img/avatars/unknown.png', $packageName = null);
                
                $data['user']['url'] = $this->generateUrl('wall', array('channel_slug' => $this->currentChannel->getSlug(),  'usename_slug' => $this->wallComment->getCreatedBy()->getSlug()));

                $data['commentDeleteURL'] = $this->generateUrl('comment_delete', array('message_id' => $this->wallMessage->getId(), 'id' => $this->wallComment->getId()));
                
                $response = new JsonResponse();
                $response->setData($data);
                return $response;
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
           $response = new Response();
           $response->setStatusCode(500);
           return $response; 
        }
        
        
    }
    
    public function deleteAction($message_id, $id,Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
        
        
        if (($request->getMethod() == 'DELETE') 
            && $request->isXmlHttpRequest())
        {
            
            $wallComment = $this->em->getRepository('WallBundle:WallComment')->find($id);
            
            if ($wallComment && $wallComment->canDelete($this->authUser))
            {
                $data = $wallComment->jsonSerialize();
                $this->em->remove($wallComment);
                $this->em->flush();

                $response = new JsonResponse();
                $response->setData($data);
            
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
