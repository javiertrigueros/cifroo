<?php

namespace Arquematics\WallBundle\Controller;

use Arquematics\BackendBundle\Utils\ArController;
use Arquematics\WallBundle\Entity\ArFile;

use Arquematics\WallBundle\Form\ArFileType;

use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class UploadController extends ArController
{
    
    public function deleteAction(Request $request, $guid = false)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        if ($request->getMethod() != 'DELETE')
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
        
        $this->arFile = $this->em->getRepository("WallBundle:ArFile")
                                ->findOneBy(array('guid' => $guid));
        if(!$this->arFile)
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
        
        if ($this->aUser->getId() !== $this->arFile->getCreatedBy()->getId())
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        //borra de la session si esta en ella
        $session = $this->get("session");   
        $arFiles = $session->get("arFiles");            
        if ($arFiles && (count($arFiles) > 0))
        {
            $wallLinks = array_diff( $arFiles, [$this->arFile->getId()] );
            $session->set("arFiles", $wallLinks);
        }
        
        $data = $this->parseFile($this->arFile);
        
        $this->em->remove($this->arFile);
        $this->em->flush();
            
        $response = new JsonResponse();
        $response->setData($data);
        return $response;
    }
    
    public function viewAction(Request $request, $guid = false)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        $this->arFile = $this->em->getRepository("WallBundle:ArFile")
                                ->findOneBy(array('guid' => $guid));
        
        if(!$this->arFile)
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
        
        if ($request->getMethod() == 'PUT')
        {     
            if ($this->aUser->getId() !== $this->arFile->getCreatedBy()->getId())
            {
                $response = new Response();
                $response->setStatusCode(401);
                return $response;
            }
            
            $this->arFile->setReady(true);
                    
            $this->em->persist($this->arFile);
            $this->em->flush();
            
            $response = new JsonResponse();
            $response->setData($this->parseFile($this->arFile));
            return $response;
        }
        else
        {
            $response = new JsonResponse();
            $response->setData($this->parseFile($this->arFile));
            return $response; 
        }
    
    }
    
    private function parseFile($arFile)
    {
        $ret = $arFile->jsonSerialize();
        
        $ret['parts'] = $this->em->getRepository("WallBundle:ArFileChunk")->count($arFile);
        $ret['chunks'] = ($ret['parts'] == 0)?json_decode($arFile->getSrc(), TRUE): [];
      
        $ret['url'] = $this->generateUrl('file_view', array('guid' => $arFile->getGuid()));
       
        
        return $ret;
    }
    
    public function createAction(Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        $this->arFile = new ArFile();
        $formFile = $this->createForm(ArFileType::class, $this->arFile, ['entity_manager' => $this->getDoctrine()->getManager(),'user' => $this->authUser]);
        $formFile->handleRequest($request);
          
        if (($request->getMethod() == 'POST')
           //&& $request->isXmlHttpRequest()
           && $formFile->isSubmitted() 
           && $formFile->isValid())
        {
            /*$pass = $formFile->get("pass")->getData();
            echo $pass;
            exit();*/
                    
            $this->em->persist($this->arFile);
            $this->em->flush();
            
            $this->saveToSession('arFiles', $this->arFile->getId());
            
            $response = new JsonResponse();
            $response->setData($this->parseFile($this->arFile));
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
