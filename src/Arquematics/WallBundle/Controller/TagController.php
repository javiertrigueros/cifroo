<?php

namespace Arquematics\WallBundle\Controller;

use Arquematics\WallBundle\Entity\WallTag;
use Arquematics\WallBundle\Entity\WallTagEnc;
use Arquematics\WallBundle\Form\TagType;

use Arquematics\BackendBundle\Utils\ArController;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class TagController extends ArController
{
    private function processTag($tagSerialize, $user, $hash = false, $noslug = false)
    {
        
        $wallTagEnc = $this->em->getRepository('WallBundle:WallTagEnc')->findByTagIdUser($tagSerialize['id'], $this->authUser);
        $tagSerialize['pass'] = $wallTagEnc->getContent();
        $tagSerialize['name'] = $wallTagEnc->getName();
                
        if (isset($tagSerialize['countMessages']))
        {
            $tagSerialize['count'] = $tagSerialize['countMessages'];   
            unset($tagSerialize['countMessages']);
        }
          
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
    
    public function moreAction(Request $request, $channel_slug, $usename_slug = false)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        $this->currenUser = $this->authUser;
        $noslug = true;
        //valida el usuario
        if ($usename_slug)
        {
            $this->currenUser = $this->em->getRepository('UserBundle:User')
                                ->findOneBy(array('slug' => $usename_slug ));
            if (!$this->currenUser)
            {
                $response = new Response();
                $response->setStatusCode(500);
                return $response;
            }
            
            $noslug = false;
        }
        
        
         
        
        if (($request->getMethod() != 'GET')
             || !($request->isXmlHttpRequest()))
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
        
        $pag = ($request->query->get("page"))?(int)$request->query->get("page"):1;
        $hash = ($request->query->get("hash"))?$request->query->get("hash"):'';
        
        $data = [];
        $tagsData = [];
        
        $this->currentChannel = $this->em->getRepository('WallBundle:ArChannel')
                                        ->findOneBy(array('slug' => $channel_slug));   
        
        //tag selecccionado
        $selectTag = $this->em->getRepository('WallBundle:WallTag')
                 ->findByHashOne($hash, $this->currenUser);
        $data['selectTag'] = false;
        if ($selectTag)
        {
            $tagSerialize = $selectTag->jsonSerialize();
            $tagSerialize['count'] = $this->em->getRepository('WallBundle:WallTag')
                                                ->count($selectTag, $this->currenUser);  
            $data['selectTag'] = $this->processTag($tagSerialize, $this->currenUser, $hash, $noslug) ; 
        }
        
        
        $tags = $this->em->getRepository('WallBundle:WallTag')
                    ->findByRecent($this->currentChannel, $this->currenUser, $pag, $this->container->getParameter('arquematics.max_wall_tags'));  
        
        
        $iterator = $tags->getIterator();
        if ($tags && ($iterator->count() > 0))
        {
            $totalItems = $this->em->getRepository('WallBundle:WallTag')->countRecent($this->currentChannel, $this->currenUser);
            $pagesCount = ceil($totalItems / $this->container->getParameter('arquematics.max_wall_tags'));
        
            foreach ($iterator as $tagSerialize) 
            {
                $tagsData[] = $this->processTag($tagSerialize, $this->currenUser, $hash, $noslug) ; 
            }
            
            $data['tags']  = $tagsData;
            if ($pag <  $pagesCount)
            {
              $data['isLastPage']  = false;   
            }
        }
        else 
        {
            $data['tags']  = $tagsData;
        }
        
        $response = new JsonResponse();
        $response->setData($data);
            
        return $response;
    }
    
    public function searchAction(Request $request, $channel_slug, $usename_slug = false)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        
        $this->currenUser = false;
        //valida el usuario
        if ($usename_slug)
        {
            $this->currenUser = $this->em->getRepository('UserBundle:User')
                                ->findOneBy(array('slug' => $usename_slug ));
            
            if (!$this->currenUser)
            {
                $response = new Response();
                $response->setStatusCode(500);
                return $response;
            }
        }
        
        $this->currentChannel = $this->em->getRepository('WallBundle:ArChannel')
                                        ->findOneBy(array('slug' => $channel_slug));
        
        if (!$this->currentChannel)
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
        
        if (($request->getMethod() != 'GET')
             || !($request->isXmlHttpRequest()))
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
        
        $term = ($request->query->get("term"))?$request->query->get("term"):'';
        $hash = ($request->query->get("hash"))?$request->query->get("hash"):'';
        $hashSmall = ($request->query->get("hashSmall"))?$request->query->get("hashSmall"):'';

        $wallTags = $this->em->getRepository('WallBundle:WallTag')
                        ->findByHash($hash, $hashSmall, $term, $this->currentChannel, $this->currenUser, $this->authUser);
        
        $data = [];
        if ($wallTags && (count($wallTags) > 0))
        {
           foreach($wallTags as $tag)
           { 
              $itemData = $tag->jsonSerialize();  
              $wallTagEnc = $this->em->getRepository('WallBundle:WallTagEnc')->findByTagIdUser($tag->getId(), $this->authUser);
              $itemData['pass'] = $wallTagEnc->getContent();
              $itemData['name'] = $wallTagEnc->getName();
                      
              $data[] = $itemData; 
           } 
        }
        
        $response = new JsonResponse();
        $response->setData($data);
            
        return $response;
    }
    
    private function saveUserTags(& $findTag, $pass, $name)
    {
        $passData = json_decode($pass, true);
        if (count($passData) > 0)
        {       
            foreach ($passData as $dataItem)
            {
                 $userEnc = $this->em->getRepository('UserBundle:User')->find($dataItem['id']); 
                 
                 $encodedTag = $this->em->getRepository('WallBundle:WallTagEnc')
                         ->findByTagAndUser( $findTag, $userEnc );
                
                 
                 if (!$encodedTag)
                 {
                    $wallTagEnc = new WallTagEnc(); 
                        
                    $wallTagEnc->setContent($dataItem['data']);
                    $wallTagEnc->setUser($userEnc);
                    $wallTagEnc->setWallTag($findTag);
                    $wallTagEnc->setName($name);
                        
                    $this->em->persist($wallTagEnc);
                    $this->em->flush(); 
                 }
            }
        }
    }
    
    public function indexAction(Request $request, $hash = false)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        $this->wallTag = new WallTag();
        
        $form = $this->createForm(TagType::class, $this->wallTag, ['entity_manager' => $this->getDoctrine()->getManager()]);
        
        if ($request->getMethod() == 'POST')
        {
            
            $params = $request->request->all();
            
            $hash = $params['wallTag']['hash'];
            $pass = $params['wallTag']['pass'];
            $name = $params['wallTag']['name'];

          
            $findWallTag = $this->em->getRepository('WallBundle:WallTag')
                                ->findOneBy(['hash' => $hash]);
            
            if ($findWallTag)
            {
                $this->wallTag =  $findWallTag;
                
                $this->saveUserTags($this->wallTag, $pass, $name);
                
                $this->saveToSession('wallTags', $this->wallTag->getId());
                
                $response = new JsonResponse();
                $response->setData($this->wallTag->jsonSerialize());
            
                return $response;
            }
            else 
            {
                $form->handleRequest($request);
                
                if($form->isSubmitted() && $form->isValid())
                {
                    $this->em->persist($this->wallTag);
                    $this->em->flush();  

                    $this->saveToSession('wallTags', $this->wallTag->getId());
                
                    $response = new JsonResponse();
                    $response->setData($this->wallTag->jsonSerialize());
            
                    return $response;
                }
                else
                {
                    $response = new Response();
                    $response->setStatusCode(500);
                    return $response;
                }
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
