<?php

namespace Arquematics\WallBundle\Controller;


use Arquematics\WallBundle\Entity\WallMessageEnc;
use Arquematics\WallBundle\Entity\WallCommentEnc;
use Arquematics\WallBundle\Entity\ArFileEnc;
use Arquematics\WallBundle\Entity\WallLinkEnc;
use Arquematics\WallBundle\Entity\WallTagEnc;


use Arquematics\WallBundle\Entity\WallMessage;
use Arquematics\WallBundle\Entity\ArChannel;

use Arquematics\WallBundle\Event\TwitterPublishEvent;
use Arquematics\WallBundle\Event\TwitterUnPublishEvent;

use Arquematics\WallBundle\Event\FacebookPublishEvent;
use Arquematics\WallBundle\Event\FacebookUnPublishEvent;


use Arquematics\WallBundle\Event\LinkedinPublishEvent;
use Arquematics\WallBundle\Event\LinkedinUnPublishEvent;

use Arquematics\WallBundle\Form\CommentType;
use Arquematics\WallBundle\Form\LinkType;
use Arquematics\WallBundle\Form\TagType;
use Arquematics\WallBundle\Form\WallMessageType;
use Arquematics\WallBundle\Form\ArFileType;
use Arquematics\WallBundle\Form\ArFilePreviewType;


use Arquematics\BackendBundle\Utils\ArController;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;


class WallController extends ArController
{
    private function processTag($tagSerialize, $authUser, $user, $hash = false, $noslug = false)
    {
        $wallTagEnc = $this->em->getRepository('WallBundle:WallTagEnc')->findByTagIdUser($tagSerialize['id'], $authUser);
        $tagSerialize['pass'] = $wallTagEnc->getContent();
        $tagSerialize['name'] = $wallTagEnc->getName();
        
        $tagSerialize['count'] = $tagSerialize['countMessages'];   
        unset($tagSerialize['countMessages']);
                
        if ($tagSerialize['hash'] == $hash)
        {
            $tagSerialize['selected'] = true;
            if (!$noslug)
            {
                $tagSerialize['href'] = $this->generateUrl('wall', array('channel_slug' => $this->currentChannel->getSlug())); 
            }
            else
            {
                $tagSerialize['href'] = $this->generateUrl('wall', array('channel_slug' => $this->currentChannel->getSlug(), 'usename_slug' => $user->getSlug()));   
            }
        }
        else if (!$noslug)
        {
            $tagSerialize['href'] = $this->generateUrl('wall', array('channel_slug' => $this->currentChannel->getSlug())).'?tag='.$tagSerialize['hash'];   
        }
        else
        {
            $tagSerialize['href'] = $this->generateUrl('wall', array('channel_slug' => $this->currentChannel->getSlug(), 'usename_slug' => $user->getSlug())).'?tag='.$tagSerialize['hash'];   
        }
        
        return $tagSerialize;
    }
    
    private function getRecentTags($user, $hash = false, $noslug = false, $page = 1)
    {
        $tagsData = [];
        
        $tags = $this->em->getRepository('WallBundle:WallTag')
                    ->findByRecent($this->currentChannel, $user, $page, $this->container->getParameter('arquematics.max_wall_tags'));  
        
        
        
        $iterator = $tags->getIterator();
        
        if ($tags && $iterator && ($iterator->count() > 0))
        {
            foreach ($iterator as $tagSerialize) 
            {
                  $tagsData[] = $this->processTag($tagSerialize, $this->authUser, $this->currenUser, $hash, $noslug) ;   
            }
        }
        
        return $tagsData;
    }
    
    private function getUserTags($user, $hash = false, $noslug = false)
    {
        $tagsData = array();
        
        $tags = $this->em->getRepository('WallBundle:WallTag')
                                ->findByUser($this->currentChannel, $this->aUser, $user); 
        
        if ($tags && (count($tags) > 0))
        {
            foreach ($tags as $tagSerialize) 
            {
                    $tagSerialize['count'] = $tagSerialize['countMessages'];
                    $wallTagEnc = $this->em->getRepository('WallBundle:WallTagEnc')->findByTagIdUser($tagSerialize['id'], $this->authUser);
                    $tagSerialize['pass'] = $wallTagEnc->getContent();
                    $tagSerialize['name'] = $wallTagEnc->getName();
                
                    if ($tagSerialize['hash'] == $hash)
                    {
                        $tagSerialize['selected'] = true;
                        if (!$noslug)
                        {
                            $tagSerialize['href'] = $this->generateUrl('wall', array('channel_slug' => $this->currentChannel->getSlug())); 
                        }
                        else
                        {
                            $tagSerialize['href'] = $this->generateUrl('wall', array('channel_slug' => $this->currentChannel->getSlug(), 'usename_slug' => $this->currenUser->getSlug()));   
                        }
                    }
                    else if (!$noslug)
                    {
                        $tagSerialize['href'] = $this->generateUrl('wall', array('channel_slug' => $this->currentChannel->getSlug())).'?tag='.$tagSerialize['hash'];   
                    }
                    else
                    {
                        $tagSerialize['href'] = $this->generateUrl('wall', array('channel_slug' => $this->currentChannel->getSlug(), 'usename_slug' => $this->currenUser->getSlug())).'?tag='.$tagSerialize['hash'];   
                    }
                
                    $tagsData[] = $tagSerialize;   
            }
        }

        return $tagsData;
    }
    
    private function getProfileData($user, $hash = false, $noslug = false)
    {
        $currenUserProfile = $user->getProfile();
        
        $totalItems = $this->em->getRepository('WallBundle:WallTag')->countRecent($this->currentChannel, $this->currenUser);
        $pagesCount = ceil($totalItems / $this->container->getParameter('arquematics.max_wall_tags'));
        
        //tag selecccionado
        $selectTag = $this->em->getRepository('WallBundle:WallTag')
                 ->findByHashOne($hash, $this->currenUser);
       
        if ($selectTag)
        {
            $selectTag = $selectTag->getHash();
        }
        else
        {
             $selectTag = false;
        }
        
 
        return [
            //todos los tags
            'tagsRecent' => $this->getRecentTags($user, $hash, $noslug),
            'isLastPage' => ($pagesCount <= 1),
            'selectTagHash'   => $selectTag,
            //son los tags del usuario
            'tags' => $this->getUserTags($user, $hash, $noslug),
            'name' => ucfirst($currenUserProfile->getName()),
            'completeName'  =>  ucfirst($currenUserProfile->getName()).' '.ucfirst($currenUserProfile->getLastname()),
            //'count' => count($user->getWallMessages()),
            'image' => ($currenUserProfile->getImage())? $this->generateUrl('user_profile_avatar', array('fileName' => $currenUserProfile->getImage())) 
                                        :  $this->get('assets.packages')
                                                ->getUrl('bundles/user/img/avatars/unknown.png', $packageName = null)
            ]; 
       

        
    }
    
    private function processMessageRaw($message)
    {
        $messageData = $message->jsonSerialize();
        
        $wallMessageEnc = $this->em->getRepository('WallBundle:WallMessageEnc')->findByMenssageUser($message, $this->authUser);
        $messageData['pass'] = $wallMessageEnc->getContent();
        
        
        $i = 0;
        $iCount = 0;
        if (count($message->getComments()) > 0)
        {
            foreach ($message->getComments() as $comment) 
            {
                $wallCommentEnc = $this->em->getRepository('WallBundle:WallCommentEnc')->findByCommentUser($comment, $this->authUser);
                $messageData['comments'][$i]['pass'] = $wallCommentEnc->getContent();

                $i++;
            }
        }
                    
        $messageData['count'] = $i;
                    
        if (count($message->getArFiles()) > 0)
        {
            $i = 0;
            foreach ($message->getArFiles() as $file) 
            {
                $wallMessageEnc = $this->em->getRepository('WallBundle:ArFileEnc')->findByArFileUser($file, $this->authUser);
                $messageData['files'][$i]['pass'] = $wallMessageEnc->getContent();
                $i++;
            }
        }
        
        if (count($message->getTags()) > 0)
        {
            $i = 0;
            foreach ($message->getTags() as $tag) 
            {
                $wallTagEnc = $this->em->getRepository('WallBundle:WallTagEnc')
                                ->findByTagAndUser($tag, $this->authUser);
                $messageData['tags'][$i]['name'] = $wallTagEnc->getName();
                $messageData['tags'][$i]['pass'] = $wallTagEnc->getContent();
                $i++;
            }
        }
        
        $videos = 0;
        $photos = 0;
        $links = 0;
        $richs = 0;
        $i = 0;
        foreach ($message->getWallLinks() as $link) 
        { 
          $wallLinkEnc = $this->em->getRepository('WallBundle:WallLinkEnc')->findByLinkUser($link, $this->authUser);
          
          
          $messageData['wallLinks']['all'][$i]['pass'] =  $wallLinkEnc->getContent(); 
          $i++;
          
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
    
    private function addUpdateTags(& $data, $authUser)
    {
        $tagsData = [];
        // nuevos datos a actualizar en los controles
        $updateTags = $this->em->getRepository('WallBundle:WallTag')
                       ->findByMessage($this->currentChannel , $authUser, $this->wallMessage);
                
        if ($updateTags && count($updateTags) > 0)
        {
            foreach ($updateTags as $tagSerialize) 
            {
               $tagsData[] = $this->processTag($tagSerialize, $authUser, $authUser) ; 
            }

            $data['updateTags'] =  $tagsData;
        }
        else
        {
            $data['updateTags'] = $tagsData;
        }
        return $data;
    }






    private function processMessage($message, $authUser,  $user = false)
    {
        $translator = $this->get('translator');
         
        $messageData = $message->jsonSerialize();
        
        //password encriptado para decodificar
        $wallMessageEnc = $this->em->getRepository('WallBundle:WallMessageEnc')->findByMenssageUser($message, $authUser);
        $messageData['pass'] = $wallMessageEnc->getContent();
        
        //imagen    
        $messageData['user']['image'] = ($messageData['user']['image'])? $this->generateUrl('user_profile_avatar', array('fileName' => $messageData['user']['image'])) 
                                :  $this->get('assets.packages')
                                        ->getUrl('bundles/user/img/avatars/unknown.png', $packageName = null);
              
        if ($user)
        {
           $messageData['user']['url'] = $this->generateUrl('user_profile_view', array('channel_slug' => $this->currentChannel->getSlug(), 'usename_slug' => $user->getSlug())); 
        }
        else {
           $messageData['user']['url'] = $this->generateUrl('wall', array('channel_slug' => $this->currentChannel->getSlug(), 'usename_slug' => $message->getCreatedBy()->getSlug()));
        }
        
        
        if ($message->canDelete($authUser))
        {
            $messageData['deleteURL'] = $this->generateUrl('wall_delete', array('channel_slug' => $this->currentChannel->getSlug(), 'id' => $message->getId()));
        }
                    
        $messageData['commentURL'] = $this->generateUrl('comment', array('channel_slug' => $this->currentChannel->getSlug(),'message_id' => $message->getId()));
        $messageData['voteURL'] = $this->generateUrl('vote', array('message_id' => $message->getId()));
        
        $messageData['like'] = true;
        
        $messageData['voteCountReal'] = count($messageData['votes']);
        
        if ($message->hasVote($authUser))
        {
          $messageData['voteCount'] = count($messageData['votes']) -1;
          
          if ($messageData['voteCount'] == 0)
          {
            $messageData['voteByMe'] = $translator->trans('wall.like_you_singular'); 
          }
          else if ($messageData['voteCount'] == 1 )
          {
            $messageData['voteByMe'] = $translator->trans('wall.like_you_plural_one'); 
          }
          else
          {
            $messageData['voteByMe'] =  $translator->trans('wall.like_you_plural_two', array('%count%' => $messageData['voteCount']));   
          }
          
          $messageData['like'] = false;

          $messageData['voteNames'] =  $message->getVotesUserNames($authUser);
        }
        else if (count($messageData['votes']) == 0)
        {
          $messageData['voteCount'] = $translator->trans('wall.like_singular');   
        }
        else if (count($messageData['votes']) == 1)
        {
           $messageData['voteCount'] = $translator->trans('wall.like_plural_one');     
           $messageData['voteNames'] =  $message->getVotesUserNames($authUser);
        }
        else
        {
           $messageData['voteCount'] = $translator->trans('wall.like_plural_two', array('%count%' => count($messageData['votes'])));  
           $messageData['voteNames'] =  $message->getVotesUserNames($authUser);
        }
        
        $i = 0;
        $iCount = 0;
        if (count($message->getComments()) > 0)
        {
            $hideCount = count($message->getComments()) - $this->container->getParameter('arquematics.max_wall_comments');
            foreach ($message->getComments() as $comment) 
            {
                $wallCommentEnc = $this->em->getRepository('WallBundle:WallCommentEnc')->findByCommentUser($comment, $authUser);
                $messageData['comments'][$i]['pass'] = $wallCommentEnc->getContent();
                
                $messageData['comments'][$i]['user']['image'] = ($messageData['comments'][$i]['user']['image'])? $this->generateUrl('user_profile_avatar', array('fileName' => $messageData['comments'][$i]['user']['image'])) 
                                :  $this->get('assets.packages')
                                        ->getUrl('bundles/user/img/avatars/unknown.png', $packageName = null);
                
                $messageData['comments'][$i]['user']['url'] = $this->generateUrl('wall', array('channel_slug' => $this->currentChannel->getSlug(),'usename_slug' => $comment->getCreatedBy()->getSlug()));
                  //exit();      
                if ($comment->canDelete($authUser))
                {
                    $messageData['comments'][$i]['commentDeleteURL'] = $this->generateUrl('comment_delete', array('message_id' => $message->getId(), 'id' => $comment->getId()));
                }
                
                            
                if ($i < $hideCount)
                {
                    $messageData['comments'][$i]['hide'] = true;
                    $iCount++;
                }
                $i++;
            }
        }
                    
        $messageData['count'] = $i;
                    
        if ($iCount > 0)
        {
             $messageData['countText'] = ($iCount == 1)?
                            $translator->trans('wall.comment_more_singular')
                           :$translator->trans('wall.comment_more_plural', array('%count%' => $iCount));
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
    
    /**
     * borra algunos de los objetos de session que
     * no tiene sentido que esten si se ha
     * vuelto a recargar la página
     */
    private function deleteWallSessionObjects()
    {
        $this->session = $this->get("session");

        $wallTags = $this->session->get("wallTags");
        if ($wallTags && (count($wallTags) > 0))
        {
            $wallTags = $this->em->getRepository('WallBundle:WallTag')->findById($wallTags);
            foreach ($wallTags as $wallTag) 
            {
                $this->em->remove( $wallTag);
                $this->em->flush(); 
            }
            $this->session->set("wallTags", array());
        }
        
        $wallLinks = $this->session->get("wallLinks");
        if ($wallLinks && (count($wallLinks) > 0))
        {
            $wallLinks = $this->em->getRepository('WallBundle:WallLink')->findById($wallLinks);
            foreach ($wallLinks as $wallLink) 
            {
                $this->em->remove($wallLink);
                $this->em->flush(); 
            }
            
            $this->session->set("wallLinks", array());
        }
        
        $arFiles = $this->session->get("arFiles");
        if ($arFiles && (count($arFiles) > 0))
        {
            foreach ($this->em->getRepository('WallBundle:ArFile')
                            ->findById($arFiles) as $arFile) 
            {  
                $this->em->remove($arFile);
                $this->em->flush(); 
            }
            $this->session->set("arFiles", array());
        }
    }
    
    
    public function messagesCountAction( Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        $messages = $this->em->getRepository('WallBundle:WallMessage')
                ->findByUserAll($this->authUser, 1);
        
        if ($messages && (count($messages) > 0))
        {
                $totalItems = count($messages);
                $pagesCount = ceil($totalItems / 20);
                
                $data['pagesCount']  = $pagesCount; 
        }
        else
        {
           $data['pagesCount']  = false; 
        }
        
        $response = new JsonResponse();
        $response->setData($data);
            
        return $response;
           
    }
    
    public function messagesLockAction( Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
   
        $this->authUser->setLock(!$this->authUser->getLock());
        $this->em->persist($this->authUser);
        $this->em->flush(); 
      
        
        $messages = $this->em->getRepository('WallBundle:WallMessage')
                ->findByUserAll($this->authUser, 1);
        
        if ($messages && (count($messages) > 0))
        {
                $totalItems = count($messages);
                $pagesCount = ceil($totalItems / 20);
                
                $data['pagesCount']  = $pagesCount; 
        }
        else
        {
           $data['pagesCount']  = false; 
        }
        
        $response = new JsonResponse();
        $response->setData($data);
            
        return $response;
    }
    
    public function messagesAction( Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        $pag = ($request->query->get("pag"))?(int)$request->query->get("pag"):1;
        
        
        $messages = $this->em->getRepository('WallBundle:WallMessage')
                ->findByUserAll($this->authUser, $pag);
        
        if ($messages && (count($messages) > 0))
        {
                $totalItems = count($messages);
                $pagesCount = ceil($totalItems / 20);
                
                foreach ($messages->getIterator() as $message) 
                {
                    $data['messages'][] =  $this->processMessageRaw($message);
                }
                
                $data['isLastPage']  = ($pagesCount == $pag); 
        }
        else
        {
           $data['messages']  = false;
           $data['isLastPage'] = true;
        }
        
        $response = new JsonResponse();
        $response->setData($data);
            
        return $response;
    }
    
    public function messagesUpdateAction($messageId, Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        $wallMessage = $this->em->getRepository('WallBundle:WallMessage')
                                        ->find($messageId); 
        
        if (!$wallMessage || ($wallMessage->getCreatedBy()->getId() != $this->authUser->getId() ))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        $params = $request->request->all();
        $data = $params['data'];
        
        $reencodeData = json_decode($data, true);
        
        $passData = json_decode($reencodeData['pass'], true);
        
        if ($passData && count($passData) > 0)
        {
            foreach ($passData as $dataItem)
            {
                $user = $this->em->getRepository('UserBundle:User')
                                        ->find($dataItem['id']); 
                
                if (!$this->em->getRepository('WallBundle:WallMessageEnc')
                    ->findByMenssageUser( $wallMessage, $user))
                {
                    $wallMessageEnc = new WallMessageEnc();
                    
                    $wallMessageEnc->setUser($user);
                    $wallMessageEnc->setContent($dataItem['data']);
                    $wallMessageEnc->setWallMessage($wallMessage);
                    $this->em->persist($wallMessageEnc);
                }
            }
        }
        
        if ($reencodeData['comments'] && count($reencodeData['comments']) > 0)
        {
            foreach ($reencodeData['comments'] as $comment)
            {
                $passData = json_decode($comment['pass'], true);
                if ($passData && count($passData) > 0)
                {
                    foreach ($passData as $dataItem)
                    {
                        $user = $this->em->getRepository('UserBundle:User')
                                        ->find($dataItem['id']);
                        
              
                        $commentObj = $this->em->getRepository('WallBundle:WallComment')
                                        ->find($comment['id']);
                        
                        if (($commentObj->getCreatedBy()->getId() == $this->authUser->getId()) &&
                                !($this->em->getRepository('WallBundle:WallCommentEnc')
                                    ->findByCommentUser( $commentObj, $user)))
                        {
                            $wallCommentEnc = new WallCommentEnc();
                            $wallCommentEnc->setUser($user);
                            $wallCommentEnc->setContent($dataItem['data']);
                            $wallCommentEnc->setComment($commentObj);
                            
                            $this->em->persist($wallCommentEnc);
                        }
                        
                    }
                }
                
            }
        }
        
        if ($reencodeData['files'] && count($reencodeData['files']) > 0)
        {
            foreach ($reencodeData['files'] as $file)
            {
                $passData = json_decode($file['pass'], true);
                if ($passData && count($passData) > 0)
                {
                    foreach ($passData as $dataItem)
                    {
                        $user = $this->em->getRepository('UserBundle:User')
                                        ->find($dataItem['id']);
                        $fileObj = $this->em->getRepository('WallBundle:ArFile')
                                        ->find($file['id']);
                        
                        if (($fileObj->getCreatedBy()->getId() == $this->authUser->getId()) &&
                             !($this->em->getRepository('WallBundle:ArFileEnc')
                                ->findByArFileUser( $fileObj, $user)))
                        {
                            
                            $arFileEnc = new ArFileEnc();
                            $arFileEnc->setUser($user);
                            $arFileEnc->setContent($dataItem['data']);
                            $arFileEnc->setArFile($fileObj);
                            
                            $this->em->persist($arFileEnc);
                        }
                        
                    }
                }
            } 
        }
        
        if ($reencodeData['wallLinks'] && $reencodeData['wallLinks']['all'] && count($reencodeData['wallLinks']['all']) > 0)
        {
            foreach ($reencodeData['wallLinks']['all'] as $wallLink)
            {
                $passData = json_decode($wallLink['pass'], true);
               
                if ($passData && count($passData) > 0)
                {
                    foreach ($passData as $dataItem)
                    {
                         $user = $this->em->getRepository('UserBundle:User')
                                        ->find($dataItem['id']);
                         
                         $wallLinkObj = $this->em->getRepository('WallBundle:WallLink')
                                        ->find($wallLink['id']);
                         
                         if (($wallLinkObj->getCreatedBy()->getId() == $this->authUser->getId()) &&
                                 !($this->em->getRepository('WallBundle:WallLinkEnc')
                                    ->findByLinkUser( $wallLinkObj, $user)))
                         {
                             $wallLinkEnc = new WallLinkEnc();
                             $wallLinkEnc->setUser($user);
                             $wallLinkEnc->setContent($dataItem['data']);
                             $wallLinkEnc->setWallLink($wallLinkObj);
                             
                             $this->em->persist($wallLinkEnc);
                         }  
                    }
                }
                
            }
              
        }
        
        
        if ($reencodeData['tags'] && count($reencodeData['tags']) > 0)
        {
            foreach ($reencodeData['tags'] as $tag)
            {
                $passData = json_decode($tag['pass'], true);
                if ($passData && count($passData) > 0)
                {
                    foreach ($passData as $dataItem)
                    {
                        $user = $this->em->getRepository('UserBundle:User')
                                        ->find($dataItem['id']);
                        
                        $tagObj = $this->em->getRepository('WallBundle:WallTag')
                                        ->find($tag['id']);
                        
                        if (!$this->em->getRepository('WallBundle:WallTagEnc')
                            ->findByTagAndUser( $tagObj, $user))
                         {
                             $wallTagEnc = new WallTagEnc();
                             $wallTagEnc->setUser($user);
                             $wallTagEnc->setContent($dataItem['data']);
                             $wallTagEnc->setName($tag['name']);
                             $wallTagEnc->setWallTag($tagObj);
                             
                             $this->em->persist($wallTagEnc);
                         }  
                        
                    }
                    
                }
                
            }
             
        }
        
        $this->em->flush();
       
        $response = new JsonResponse();
        $response->setData(array('status' => 'ok'));
            
        return $response;
        
        
    }
    
    
    /**
     * pagina web por defecto
     * 
     * @param type $channel_slug
     * @param type $usename_slug
     * @param Request $request
     * @return Response|JsonResponse
     */
    public function indexAction($channel_slug = null, $usename_slug = null, Request $request)
    {
        if (!$this->checkView($request))
        {
            return $this->redirect($this->generateUrl('user_login'));
        }
        
        //usuario actual
        $this->currenUser =  (!$usename_slug)? $this->authUser 
                : $this->em->getRepository('UserBundle:User')
                            ->findOneBy(array('slug' => $usename_slug ));
                

       
        
        if (!$channel_slug)
        {
          $this->currentChannel = $this->em->getRepository('WallBundle:ArChannel')
                                        ->find(ArChannel::GENERAL); 
        }
        else
        {
          $this->currentChannel = $this->em->getRepository('WallBundle:ArChannel')
                                        ->findOneBy(array('slug' => $channel_slug));   
           
        }
        
        
        $this->wallMessage = new WallMessage();
                
        /*
        $form = $this->createForm(new WallMessageType($this->authUser), $this->wallMessage );
        $formLink = $this->createForm(new LinkType($this->authUser));
        $formTag = $this->createForm(new TagType());
        $formComment = $this->createForm(new CommentType(['message' => null, 'user' => $this->authUser]));
        */
       
        $form = $this->createForm(WallMessageType::class, $this->wallMessage , ['entity_manager' => $this->getDoctrine()->getManager(), 'user' => $this->authUser,'channel' => $this->currentChannel]);
        $formLink = $this->createForm(LinkType::class,null, ['entity_manager' => $this->getDoctrine()->getManager(),'user' => $this->authUser]);
        $formTag = $this->createForm(TagType::class, null, ['entity_manager' => $this->getDoctrine()->getManager()]);
        $formComment = $this->createForm(CommentType::class, null,['entity_manager' => $this->getDoctrine()->getManager(), 'message' => null, 'user' => $this->authUser]);
        $formFile = $this->createForm(ArFileType::class, null,['entity_manager' => $this->getDoctrine()->getManager(),'user' => $this->authUser]);
        $formPreview = $this->createForm(ArFilePreviewType::class, null,['arFile' => null]);
        
        
        if ($request->getMethod() == 'POST')
        {
            $form->handleRequest($request);

            if($form->isSubmitted() && $form->isValid())
            {     
                $this->em->persist($this->wallMessage);
                $this->em->flush();
                
                //actualiza los enlaces despues del flush
                $this->em->refresh($this->wallMessage);
                //twitter
                $eventDispatcher = $this->get('event_dispatcher');
                $event = new TwitterPublishEvent();
                $event->setMessage($this->wallMessage);
                $event->setUser($this->authUser);
                $eventDispatcher->dispatch('custom.event.twitter_publish_event', $event);
  
                //facebook
                /*
                $event = new FacebookPublishEvent();
                $event->setMessage($this->wallMessage);
                $event->setUser($this->authUser);
                $eventDispatcher->dispatch('custom.event.facebook_publish_event', $event);
                 * 
                 */
                //Linkedin
                $event = new LinkedinPublishEvent();
                $event->setMessage($this->wallMessage);
                $event->setUser($this->authUser);
                $eventDispatcher->dispatch('custom.event.linkedin_publish_event', $event);
                

                $response = new JsonResponse();
                
                $data = $this->processMessage($this->wallMessage, $this->authUser);
                
                $this->addUpdateTags($data, $this->authUser);
                      
                
                $messagesEnc = $this->em->getRepository('WallBundle:WallMessageEnc')
                                ->findByMenssage($this->wallMessage); 
                
                $dataPush = [];
                if ($messagesEnc && count($messagesEnc) > 0)
                {
                    foreach ($messagesEnc as $messageEnc)
                    {
                           $dataPush[$messageEnc->getUser()->getId()] = $this->processMessage($this->wallMessage, $messageEnc->getUser());
                           
                           $this->addUpdateTags($dataPush[$messageEnc->getUser()->getId()], $messageEnc->getUser());
                    }
                }
                
                
                $pusher = $this->container->get('gos_web_socket.wamp.pusher');
                $pusher->push($dataPush, 'message_user', array('channel_slug' => $this->currentChannel->getSlug(), 'user_id' => $this->authUser->getId())); 

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
        else if (($request->getMethod() == 'GET') 
                    && $request->isXmlHttpRequest())
        {
            $user = (!$usename_slug)? false: $this->currenUser;
            $hash = ($request->query->get("tag"))?$request->query->get("tag"):false;
            $pag = ($request->query->get("pag"))?(int)$request->query->get("pag"):1;
            
            
            $data = [
                'session' => array(),
                'messages' => array(),
                'lastTag' => $hash,
                'profile' => $this->getProfileData($this->currenUser, $hash, $usename_slug)
            ];
            
            
                    
            $messages = $this->em->getRepository('WallBundle:WallMessage')
                                ->findByUser(
                                        $this->currentChannel, 
                                        $this->authUser, $user, $hash, (int)$pag); 
               

            if ($messages && (count($messages) > 0))
            {
                $totalItems = count($messages);
                $pagesCount = ceil($totalItems / 20);
                
                foreach ($messages->getIterator() as $message) 
                {
                    $data['messages'][] =  $this->processMessage($message, $this->authUser,  $user);
                }
                
                $data['isLastPage']  = ($pagesCount == $pag); 
            }
            else
            {
              $data['isLastPage']  = true; 
            }

            $response = new JsonResponse();
            $response->setData($data);
            
            return $response;
        }
        else
        {
            $this->deleteWallSessionObjects();
            
                 
            return $this->render('WallBundle:Wall:index.html.twig', 
                array(
                    'menuSection'           => 'wall',
                    'channel'               => $this->currentChannel,
                    'currentChannelId'      => $this->currentChannel->getId(),
                    'max_file_size'         => $this->container->getParameter('arquematics.max_file_size'),
                    'bytes_per_chunk'       => $this->container->getParameter('arquematics.bytes_per_chunk'),
                    'extensions_allowed'    => implode("','",$this->container->getParameter('arquematics.extensions_allowed')),
                    'image_width_sizes'     => implode("','",$this->container->getParameter('arquematics.image_width_sizes')),
                    'form'                  => $form->createView(),
                    'formLink'              => $formLink->createView(),
                    'formTag'               => $formTag->createView(),
                    'formComment'           => $formComment->createView(),
                    'formFile'              => $formFile->createView(),
                    'formPreview'           => $formPreview->createView(),
                    'showSendControls'      => ($usename_slug == false),
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
    
    public function deleteAction( $channel_slug, $id,  Request $request)
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
            $this->wallMessage = $this->em->getRepository('WallBundle:WallMessage')->find($id);
            
            if ($this->wallMessage && $this->wallMessage->canDelete($this->authUser))
            {
                
                   
                
                $eventDispatcher = $this->get('event_dispatcher');
                $event = new TwitterUnPublishEvent();
                $event->setMessage($this->wallMessage);
                $event->setUser($this->authUser);
                $eventDispatcher->dispatch('custom.event.twitter_un_publish_event', $event);
                
                
                $event = new LinkedinUnPublishEvent();
                $event->setMessage($this->wallMessage);
                $event->setUser($this->authUser);
                $eventDispatcher->dispatch('custom.event.linkedin_un_publish_event', $event);
                
                $tagsData = [];
                $this->currentChannel = $this->em->getRepository('WallBundle:ArChannel')
                                        ->findOneBy(array('slug' => $channel_slug));
                // nuevos datos a actualizar en los controles
                $updateTags = $this->em->getRepository('WallBundle:WallTag')
                       ->findByMessage($this->currentChannel ,$this->authUser, $this->wallMessage);
                
                if ($updateTags && count($updateTags) > 0)
                {
                    foreach ($updateTags as $tagSerialize) 
                    {
                        $tagsData[] = $this->processTag($tagSerialize, $this->authUser, $this->authUser) ; 
                    }

                    $data['updateTags'] =  $tagsData;
                }
                else
                {
                  $data['updateTags'] = $tagsData;
                }
                

                $tags = $this->wallMessage->getTags();
                $idsRemove = [];
                if ($tags && (count($tags) > 0))
                {
                    foreach($tags as $tag)
                    {
                       if (count($this->em->getRepository('WallBundle:WallMessage')->findByTag($tag)) <= 1)
                       {
                          $idsRemove[] = $tag->getId();
                       }
                    }
                }
                
                
                $wallMessageId = $this->wallMessage->getId();
                $this->em->remove($this->wallMessage);
                $this->em->flush();
                
                if (count($idsRemove) > 0) 
                {
                  $tagsToDelete = $this->em->getRepository('WallBundle:WallMessage')->findById($idsRemove);  
                  foreach($tagsToDelete as $tag)
                  {
                      $this->em->remove($tag);
                  }
                  
                  $this->em->flush();
                }
                
                $data = array(
                            'userRequest' => $this->authUser->getId(),
                            'counTags' => count($tags),
                            'message' => $wallMessageId,
                            'updateTags' => ($tagsData && count($tagsData) > 0)?$tagsData:[]
                        );
                
                $pusher = $this->container->get('gos_web_socket.wamp.pusher');
                $pusher->push($data, 'message_user', array('channel_slug' => $this->currentChannel->getSlug(), 'user_id' => $this->authUser->getId())); 

                
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
