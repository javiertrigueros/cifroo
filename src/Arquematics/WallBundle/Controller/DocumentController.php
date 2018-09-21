<?php

namespace Arquematics\WallBundle\Controller;

use Arquematics\WallBundle\Form\ArFileType;
use Arquematics\WallBundle\Form\ArFileExplorerType;

use Arquematics\WallBundle\Entity\ArFavorite ;

use Arquematics\WallBundle\Entity\ArFilePreview;

use Arquematics\BackendBundle\Utils\ArController;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class DocumentController extends ArController
{
    public function viewAction($type, $id, Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        if (($request->getMethod() !== 'GET')
           || !$request->isXmlHttpRequest())
        {
           $response = new Response();
           $response->setStatusCode(500);
           return $response;
        }
        
        $this->arFile = $this->em->getRepository("WallBundle:ArFile")
                                ->findOneBy(array('id' => $id));
        
        if (!$this->arFile)
        {
           $response = new Response();
           $response->setStatusCode(500);
           return $response;
        }

        $item = $this->processDocView($this->arFile);
         
        $response = new JsonResponse();
        $response->setData($item);
        return $response;
        
    }
    
     public function editAction($type, $id, Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        if (($request->getMethod() !== 'PUT')
           || !$request->isXmlHttpRequest())
        {
           $response = new Response();
           $response->setStatusCode(500);
           return $response;
        }
        
        $this->arFile = $this->em->getRepository("WallBundle:ArFile")
                                ->findOneBy(array('id' => $id));
        
        if (!$this->arFile)
        {
           $response = new Response();
           $response->setStatusCode(500);
           return $response;
        }
        
        $form = $this->createForm(ArFileExplorerType::class, $this->arFile, ['user' => $this->authUser]);
        
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid())
        {
            $this->em->persist($this->arFile);
            $this->em->flush();
                
            $favorite = $form->get('favorite')->getData();
            $arFavorite = $this->em->getRepository("WallBundle:ArFavorite")
                                ->findOneByFileAndUser($this->arFile, $this->authUser);
       
            if ($favorite && (!$arFavorite))
            {
                  $arFavorite = new ArFavorite();
                  $arFavorite->setArFile($this->arFile);
                  $arFavorite->setCreatedBy($this->authUser);
                  
                  $this->em->persist($arFavorite);
                  $this->em->flush();
            }
            else if ((!$favorite) && ($arFavorite))
            {
                $this->em->remove($arFavorite);
                $this->em->flush();
            }
        }
        else
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response; 
        }
        
        $item = $this->processDocView($this->arFile);
         
        $response = new JsonResponse();
        $response->setData($item);
        return $response;
        
    }
    
    private function processDocView($doc)
    {
        $data = $doc->jsonSerialize();
        //si el preview es distinto json mostrará el preview
        if ($data['previewExt'] !== $data['ext'])
        {
            
            $filePreview = $this->em->getRepository("WallBundle:ArFilePreview")
                            ->findByGuidStyle($doc->getGuid(), ArFilePreview::NORMAL);
            
            $data['json'] = $filePreview->getSrc(); 
        }
        else {
            $data['json'] = $doc->getSrc(); 
        }
        
        $wallMessageEnc = $this->em->getRepository('WallBundle:ArFileEnc')->findByArFileUser($doc, $this->authUser);
        $data['pass']  = $wallMessageEnc->getContent();
        
        
        $favorite  = $this->em->getRepository("WallBundle:ArFavorite")
                                ->findOneByFileAndUser($doc, $this->authUser);
        
        $data['canEdit']  = ($this->authUser->getId() === $doc->getCreatedBy()->getId());  
        $data['isFavorite']  = ($favorite)?true:false;
         
        return $data;
    }
    
    private function processDoc($doc)
    {
        $data = $doc->jsonSerialize();
        $favorite  = $this->em->getRepository("WallBundle:ArFavorite")
                                ->findOneByFileAndUser($doc, $this->authUser);
        
        $wallMessageEnc = $this->em->getRepository('WallBundle:ArFileEnc')->findByArFileUser($doc, $this->authUser);
        $data['pass']  = $wallMessageEnc->getContent();
        
        $data['isFavorite']  = ($favorite)?true:false;
        $data['canEdit']  = ($this->authUser->getId() === $doc->getCreatedBy()->getId());  
                
        return $data;
    }
    
    public function listAction($type = null, Request $request)
    {
        if (!$this->checkView($request))
        {
           return $this->redirect($this->generateUrl('homepage')); 
        }
        
        if (($request->getMethod() == 'GET')
           && $request->isXmlHttpRequest())
        {
            
        $hash = ($request->query->get("searchHash"))?$request->query->get("searchHash"):false;
        $hashSmall = ($request->query->get("searchHashSmall"))?$request->query->get("searchHashSmall"):false;
        $page = ($request->query->get("page"))?(int)$request->query->get("page"):1;
        $group = ($request->query->get("docType"))?$request->query->get("docType"):false;    
             

        
        $documents = $this->em->getRepository('WallBundle:ArFile')
                                ->findByUser(
                                        $this->authUser,  
                                        $hash,
                                        $hashSmall,
                                        $group,
                                        (int)$page); 
        
        $totalDocsCount = count($documents);
        $pagesCount = ceil($totalDocsCount / 20);
        $items = array();
        
        if ($documents && (count($documents) > 0))
        {
            foreach ($documents->getIterator() as $doc) 
            {
                $items[] =  $this->processDoc($doc);
            }   
        }
           
        $info = array(
            'current_page' => (int)$page,
            'total_pages' => $pagesCount,
            'total_count' => (int)$totalDocsCount,
            'items' => $items);
              
            $response = new JsonResponse();
            $response->setData($info);
            return $response;
        }
        
        $form = $this->createForm(ArFileExplorerType::class, null, ['user' => $this->authUser]);

        return $this->render('WallBundle:Document:list.html.twig', array(
            'menuSection'           => 'document',
            'form'                  => $form->createView()
        )); 
       
    }
    
}
