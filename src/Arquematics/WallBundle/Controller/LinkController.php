<?php

namespace Arquematics\WallBundle\Controller;

use Arquematics\WallBundle\Entity\WallLink;
use Arquematics\WallBundle\Entity\WallMessage;

use Arquematics\WallBundle\Form\LinkType;
use Arquematics\WallBundle\Form\WallMessageType;

use Arquematics\BackendBundle\Utils\ArController;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class LinkController extends ArController
{
    
    public function createAction(Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        
        $this->wallLink = new WallLink();
        
        $form = $this->createForm(LinkType::class,$this->wallLink, ['entity_manager' => $this->getDoctrine()->getManager(),'user' => $this->authUser]);
        
        if ($request->getMethod() == 'POST')
        {
            $form->handleRequest($request);

            if($form->isSubmitted() && $form->isValid())
            {
                $this->em->persist($this->wallLink);
                $this->em->flush();
                
                $this->saveToSession('wallLinks', $this->wallLink->getId()); 
                
                $data = $this->wallLink->jsonSerialize();
               
                $response = new JsonResponse();
                $response->setData($data);
            
                return $response;
            }
            // ha habido un error procesando el formulario
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
    
    public function deleteAction($id, Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        
        if ($request->getMethod() == 'DELETE')
        {

            $wallLink = $this->em->getRepository('WallBundle:WallLink')->find($id);
            if($wallLink && ($wallLink->getCreatedBy() == $this->authUser))
            {
                $session = $this->get("session");
                
                $wallLinks = $session->get("wallLinks");
                        
                if ($wallLinks && (count($wallLinks) > 0))
                {
                    $wallLinks = array_diff( $wallLinks, [$id] );
                    $session->set("wallLinks", $wallLinks);
                }
                
                $data = $wallLink->jsonSerialize();
               
                $response = new JsonResponse();
                $response->setData($data);
                
                $this->em->remove($wallLink);
                $this->em->flush();
            
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
