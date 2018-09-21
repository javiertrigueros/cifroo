<?php

namespace Arquematics\BackendBundle\Controller;

use Arquematics\BackendBundle\Entity\Activo;
use Arquematics\BackendBundle\Entity\Calendar;



use Arquematics\BackendBundle\Entity\Folder;
use Arquematics\BackendBundle\Entity\Headquarter;
use Arquematics\BackendBundle\Entity\SystemCategory;
use Arquematics\BackendBundle\Entity\SystemSystemCategory;

use Arquematics\BackendBundle\Form\ActivoType;

use Arquematics\BackendBundle\Form\CalendarType;
use Arquematics\BackendBundle\Form\CompanyImageType;
use Arquematics\BackendBundle\Form\HeadquarterType;

use Arquematics\BackendBundle\Form\SystemCategoryType;
use Arquematics\BackendBundle\Form\SystemType;
use Arquematics\BackendBundle\Form\UserType;
use Arquematics\BackendBundle\Form\UserEditType;

use Arquematics\BackendBundle\Model\ImageUpload;
use Arquematics\BackendBundle\Utils\ArController;
use Arquematics\UserBundle\Entity\Profile;

use Arquematics\UserBundle\Entity\User;
use Arquematics\UserBundle\Entity\UserRole;

use Arquematics\UserBundle\Entity\Configuration;

use Arquematics\UserBundle\Form\UserRoleType;
use Symfony\Component\Form\FormError;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\Routing\Generator\UrlGeneratorInterface;


use Symfony\Component\HttpFoundation\ResponseHeaderBag;


use Symfony\Component\Asset\Package;
use Symfony\Component\Asset\VersionStrategy\EmptyVersionStrategy;

class CompanyController extends ArController
{
    private function getImageBase64Respose($dataBase64, $mime)
    {
        $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $dataBase64));
        
        $response = new Response();
        $response->headers->set('Cache-Control', 'private');
        $response->headers->set('Content-type', $mime);   
        
        $response->setStatusCode(200);
        $response->sendHeaders();
        $response->setContent($data);
        
        return $response;
    }
    
    private function getImageAssetRespose($asset, $download = false)
    {
        $package = new Package(new EmptyVersionStrategy());
        $filename = $package->getUrl($asset);
            
        $response = new Response();

        $response->headers->set('Cache-Control', 'private');
        $response->headers->set('Content-type', mime_content_type($filename));
        
        if ($download)
        {
          $response->headers->set('Content-Disposition', 'attachment; filename="' . basename($filename) . '";');  
        }
        
        $response->headers->set('Content-length', filesize($filename));

        $response->setStatusCode(200);
        
        $response->sendHeaders();

        $response->setContent(file_get_contents($filename));
        
        return $response;
    }
    
    public function avatarViewAction(Request $request)
    {
        if (!$this->checkView($request))
        {
           $response = new Response;
           $response->setStatusCode(404);
           return $response;
        }
        
        $configuration = $this->em->getRepository('UserBundle:Configuration')
                        ->findByKeyAndUser('company.logo');
        
        if (!$configuration)
        {
           return  $this->getImageAssetRespose('bundles/design/img/logo-inline.png');
        }
        
        $image = json_decode($configuration->getValue(), true);

        return  $this->getImageBase64Respose($image['content'], $image['mime']);
    }
    
    public function avatarAction(Request $request)
    {
        if (!$this->checkView($request) || !$this->authUser->isConfigurador())
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        $form = $this->createForm(CompanyImageType::class);
        
        if ($request->getMethod() == 'POST')
        {
            $form->handleRequest($request);
            
            if ($form->isSubmitted() 
               && $form->isValid())
            {
                $imageAvatar = $this->get('image_base64')
                                ->create($form->get('image_avatar')->getData());
                
                if ($imageAvatar  && $imageAvatar['isImage'])
                {
                    $configuration = $this->em->getRepository('UserBundle:Configuration')
                        ->findByKeyAndUser('company.logo');
                    
                    if (!$configuration)
                    {
                       $configuration = new Configuration(); 
                       $configuration->setKey('company.logo');
                    }
                    
                    $configuration->setValue(json_encode($imageAvatar));
                    $configuration->setCreatedBy($this->authUser);
                    $this->em->persist($configuration);
                    $this->em->flush();
                    
                    $response = new Response();
                    $response->setStatusCode(200);
                    $response->setContent($this->generateUrl('company_avatar_view'));
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
        
        return $this->render('BackendBundle:Company:avatar.html.twig',
                array(
                    "menuItem" => 'company_avatar',
                    "menuSection" => 'control_panel',
                    "form" => $form->createView()
                ));
    }
    


}
