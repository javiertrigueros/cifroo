<?php

namespace Arquematics\WallBundle\Controller;

use Arquematics\BackendBundle\Utils\ArController;
use Arquematics\WallBundle\Entity\ArFilePreview;
use Arquematics\WallBundle\Form\ArFilePreviewType;

use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class PreviewController extends ArController
{
    public function viewAction(Request $request, $guid = false, $style = false)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        $this->arFilePreview = $this->em->getRepository("WallBundle:ArFilePreview")
                                                        ->findByGuidStyle( $guid, $style);
        if(!$this->arFilePreview)
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
        $response = new JsonResponse();
        $response->setData($this->parseFile($this->arFilePreview));
        return $response;
    
    }
    
    private function parseFile($arFilePreview)
    {
        $ret = $arFilePreview->jsonSerialize(); 
        
        $ret['parts'] = $this->em->getRepository("WallBundle:ArFilePreviewChunk")->count($arFilePreview);
        $ret['chunks'] = ($ret['parts'] == 0)?json_decode($arFilePreview->getSrc(), TRUE): [];
        
        $ret['url'] = $this->generateUrl('preview_view', array('guid' => $arFilePreview->getArFile()->getGuid(), 'style' => $arFilePreview->getStyle()));
        return $ret;
    }
    
    public function createAction(Request $request, $guid = false)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        $this->arFile = $this->em->getRepository("WallBundle:ArFile")
                                ->findOneBy(array('guid' => $guid));
         
        if ((!$this->arFile)
           || ($this->arFile->getCreatedBy()->getId() != $this->authUser->getId()))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        $this->arFilePreview = new ArFilePreview();
        $formFile = $this->createForm(ArFilePreviewType::class, $this->arFilePreview, ['arFile' => $this->arFile]);
        $formFile->handleRequest($request);
          
        if (($request->getMethod() == 'POST')
           //&& $request->isXmlHttpRequest()
           && $formFile->isSubmitted() 
           && $formFile->isValid())
        {
            $this->em->persist($this->arFilePreview);
            $this->em->flush();
            
            $response = new JsonResponse();
            $response->setData($this->parseFile($this->arFilePreview));
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
