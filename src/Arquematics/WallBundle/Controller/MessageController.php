<?php

namespace Arquematics\WallBundle\Controller;



use Arquematics\WallBundle\Entity\ArFileEnc;
use Arquematics\WallBundle\Entity\WallLinkEnc;
use Arquematics\WallBundle\Entity\WallTagEnc;


use Arquematics\WallBundle\Entity\DirectMessage;


use Arquematics\WallBundle\Form\LinkType;
use Arquematics\WallBundle\Form\TagType;
use Arquematics\WallBundle\Form\DirectMessageType;
use Arquematics\WallBundle\Form\ArFileType;
use Arquematics\WallBundle\Form\ArFilePreviewType;


use Arquematics\BackendBundle\Utils\ArController;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;


class MessageController extends ArController
{
    private function processMessage($message, $authUser)
    {
        $messageData = $message->jsonSerialize();
        
        //imagen    
        $messageData['user']['image'] = ($messageData['user']['image'])? $this->generateUrl('user_profile_avatar', array('fileName' => $messageData['user']['image'])) 
                                :  $this->get('assets.packages')
                                        ->getUrl('bundles/user/img/avatars/unknown.png', $packageName = null);
        
        if ($authUser->getId() == $message->getCreatedBy()->getId())
        {
          $messageData['pass'] = $message->getUserPass();  
        }
        else 
        {
          $messageData['pass'] = $message->getSendToPass();    
        }
        
        if (count($message->getArFiles()) > 0)
        {
            $i = 0;
            foreach ($message->getArFiles() as $file) 
            {
                $wallMessageEnc = $this->em->getRepository('WallBundle:ArFileEnc')->findByArFileUser($file, $authUser);
                $messageData['files'][$i]['pass'] = $wallMessageEnc->getContent();
        
                $messageData['files'][$i]['url'] = $this->generateUrl('file_view', array('guid' => $file->getGuid()));
                if ($messageData['files'][$i]['preview'])
                {
                   $messageData['files'][$i]['urlPreview'] =  $this->generateUrl('preview_view', array('guid' => $file->getGuid(), 'style' => 'normal' ));
                }
                
                $i++;
            }
        }
        
        $videos = 0;
        $photos = 0;
        $links = 0;
        $richs = 0;
        foreach ($message->getWallLinks() as $link) 
        { 
          $wallLinkEnc = $this->em->getRepository('WallBundle:WallLinkEnc')->findByLinkUser($link, $authUser);
          if ($link->getOembedtype() == 'video')
          {
            $messageData['wallLinks']['videos'][$videos]['pass'] = $wallLinkEnc->getContent(); 
            
            $videos++;
          }
          else if ($link->getOembedtype() == 'photo')
          {
            $messageData['wallLinks']['photos'][$photos]['pass'] = $wallLinkEnc->getContent(); 
          
            $photos++;
          }
          else if ($link->getOembedtype() == 'link')
          {
            $messageData['wallLinks']['links'][$links]['pass'] = $wallLinkEnc->getContent(); 
          
            $links++;
          }
          else if ($link->getOembedtype() == 'rich')
          {
            $messageData['wallLinks']['richs'][$richs]['pass'] = $wallLinkEnc->getContent();  
          
            $richs++;
          }
        }
        
        
        return $messageData;
    }
   
    public function indexAction($usename_slug = null, Request $request)
    {
        if (!$this->checkView($request))
        {
            return $this->redirect($this->generateUrl('user_login'));
        }
        
        $this->currenUser =  $this->em->getRepository('UserBundle:User')
                                ->findOneBy(array('slug' => $usename_slug ));
        
        if (!$this->currenUser)
        {
            
        }
        
        $this->directMessage = new DirectMessage();
                
        
        $form = $this->createForm(DirectMessageType::class, $this->directMessage , ['entity_manager' => $this->getDoctrine()->getManager(), 'send_to' => $this->currenUser, 'user' => $this->authUser]);
        $formLink = $this->createForm(LinkType::class,null, ['entity_manager' => $this->getDoctrine()->getManager(),'user' => $this->authUser]);
        $formTag = $this->createForm(TagType::class, null, ['entity_manager' => $this->getDoctrine()->getManager()]);
        $formFile = $this->createForm(ArFileType::class, null,['entity_manager' => $this->getDoctrine()->getManager(),'user' => $this->authUser]);
        $formPreview = $this->createForm(ArFilePreviewType::class, null,['arFile' => null]);
        
        if ($request->getMethod() == 'POST')
        {
            $form->handleRequest($request);

            if($form->isSubmitted() && $form->isValid())
            {   
                $this->em->persist($this->directMessage);
                $this->em->flush();
                
                //actualiza los enlaces despues del flush
                $this->em->refresh($this->directMessage);
                
                $data = $this->processMessage($this->directMessage, $this->authUser);
                
                $dataPush = array();
                $dataPush[$this->authUser->getId()] = $this->processMessage($this->directMessage, $this->authUser);
                $dataPush[$this->currenUser->getId()] = $this->processMessage($this->directMessage, $this->currenUser);
                  
                $pusher = $this->container->get('gos_web_socket.wamp.pusher');
                $pusher->push($dataPush, 'direct_message', array('user_id' => $this->authUser->getId())); 
                 
                
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
        else if (($request->getMethod() == 'GET') 
                    && $request->isXmlHttpRequest())
        {
            $pag = ($request->query->get("pag"))?(int)$request->query->get("pag"):1;
            
            
            $messages = $this->em->getRepository('WallBundle:DirectMessage')
                                ->findByUser($this->authUser, $this->currenUser, (int)$pag); 
            
            
            if ($messages && (count($messages) > 0))
            {
                $totalItems = count($messages);
                $pagesCount = ceil($totalItems / 20);
                
                foreach ($messages->getIterator() as $message) 
                {
                    $data['messages'][] =  $this->processMessage($message, $this->authUser);
                }
                
                $data['isLastPage']  = ($pagesCount == $pag); 
            }
            else
            {
              $data['isLastPage']  = true; 
            }
            
            $data['isLastPage']  = true; 
            
            $response = new JsonResponse();
            $response->setData($data);
            
            return $response;
        }
        else
        {
            return $this->render('WallBundle:Wall:messages.html.twig', 
                array(
                    'menuSection'           => 'dd',
                    'currentSubscriberId'   => $this->currenUser->getId(),
                    'max_file_size'         => $this->container->getParameter('arquematics.max_file_size'),
                    'bytes_per_chunk'       => $this->container->getParameter('arquematics.bytes_per_chunk'),
                    'extensions_allowed'    => implode("','",$this->container->getParameter('arquematics.extensions_allowed')),
                    'image_width_sizes'     => implode("','",$this->container->getParameter('arquematics.image_width_sizes')),
                    'form'                  => $form->createView(),
                    'formLink'              => $formLink->createView(),
                    'formTag'               => $formTag->createView(),
                    'formFile'              => $formFile->createView(),
                    'formPreview'           => $formPreview->createView(),
                    'culture'               => $this->culture,
                    'currenUser'            => $this->currenUser,
                    'friends'               => array_merge($this->em->getRepository('UserBundle:User')->findByFriend($this->authUser), array($this->authUser)),
                    'websocketMethod'       => $this->container->getParameter('websocket_method'),
                    'websocketHost'         => $this->container->getParameter('websocket_host'),
                    'websocketPort'         => $this->container->getParameter('websocket_port'),
                    'sessionname'           => $this->container->getParameter('sessionname'),
                    'authUser'              => $this->authUser));
        }
        
    }
 
   
}
