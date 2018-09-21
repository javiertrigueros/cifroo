<?php

namespace Arquematics\WallBundle\Controller;

use Arquematics\BackendBundle\Utils\ArController;

use Symfony\Component\HttpFoundation\Request;


use Arquematics\WallBundle\Form\ArChannelType;

use Arquematics\WallBundle\Entity\ArChannel;

class ChannelController extends ArController
{
    public function showListAction($menuSection, $currentChannelId = -1)
    {
        $this->em = $this->getDoctrine()->getManager();
        $channels = $this->em->getRepository('WallBundle:ArChannel')->findAllActive();
        
        return $this->render('WallBundle:Channel:showList.html.twig', array(
            "channels" => $channels,
            "menuSection" => $menuSection,
            "currentChannelId" => $currentChannelId
        ));
    }
    public function listAction(Request $request)
    {
        if (!$this->checkView($request)
            || !$this->aUser->isConfigurador())
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        $maxChannels = $this->container->getParameter('arquematics.max_channels');
        $channels = $this->em->getRepository('WallBundle:ArChannel')->findAll();
        
        return $this->render('WallBundle:Channel:list.html.twig', array(
            "projects" => $channels,
            "show_add" => count($channels) < $maxChannels,
            "menuItem" => 'company_channel',
            "menuSection" => 'control_panel'
        ));
    }
   
    public function createAction(Request $request)
    {
        if (!$this->checkView($request)
            || !$this->aUser->isConfigurador())
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        $maxChannels = $this->container->getParameter('arquematics.max_channels');
        $channels = $this->em->getRepository('WallBundle:ArChannel')->findAll();
        
        if (count($channels) >= $maxChannels)
        {
           return $this->redirect($this->generateUrl('homepage'));   
        }
        
        $this->channel = new ArChannel();

        $form = $this->createForm(ArChannelType::class, $this->channel);
        
        if ($request->getMethod() == 'POST')
        {
            $form->handleRequest($request);

            if($form->isSubmitted()  
              && $form->isValid())
            {
                $this->em->persist($this->channel);
                $this->em->flush();
                
                $channels = $this->em->getRepository('WallBundle:ArChannel')->findAll();
                if (count($channels) >= $maxChannels)
                {
                   $this->get('session')
                            ->getFlashBag()
                            ->add('danger', $this->get('translator')->trans("channel.msg_max"));
                }
                else
                {
                     $this->get('session')
                            ->getFlashBag()
                            ->add('success', $this->get('translator')->trans("channel.success_save"));
                }
                
                return $this->redirect($this->generateUrl('channels'));
            }
        }

        return $this->render('WallBundle:Channel:create.html.twig', array(
            "menuItem" => 'company_channel',
            "menuSection" => 'control_panel',
            "form" => $form->createView()
        ));
    }


    public function editAction($channel_id, Request $request)
    {
        if (!$this->checkView($request)
            || !$this->aUser->isConfigurador())
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        $this->channel = $this->em->getRepository('WallBundle:ArChannel')
                                  ->find($channel_id);

        if(!$this->channel)
        {
            $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans("channel.error_no_channel"));
            return $this->redirect($this->generateUrl('channels'));
        }
        
        if (!$this->channel->canDelete())
        {
             $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans("channel.error_no_delete"));
            return $this->redirect($this->generateUrl('channels'));
        }
        
        $form = $this->createForm(ArChannelType::class, $this->channel);
        
        if ($request->getMethod() == 'POST') 
        {
            $form->handleRequest($request);

            if($form->isSubmitted()
              && $form->isValid())
            {
                $this->em->persist($this->channel);
                $this->em->flush();
                
                $this->get('session')
                            ->getFlashBag()
                            ->add('success', $this->get('translator')->trans("channel.success_edit"));
                
                return $this->redirect($this->generateUrl('channels'));
            }
        }
        
        
        return $this->render('WallBundle:Channel:edit.html.twig', array(
            "form" => $form->createView(),
            "menuItem" => 'company_channel',
            "menuSection" => 'control_panel',
            "project" => $this->channel
        ));
    }


    public function deleteAction($channel_id, Request $request)
    {
        if (!$this->checkView($request)
            || !$this->aUser->isConfigurador())
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        $this->channel = $this->em->getRepository('WallBundle:ArChannel')
                        ->find($channel_id);

        if(!$this->channel)
        {
            $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans("channel.error_no_channel"));
            return $this->redirect($this->generateUrl('channels'));
        }
        
        if (!$this->channel->canDelete())
        {
           return $this->redirect($this->generateUrl('homepage'));   
        }
        
        $this->em->remove($this->channel);
        $this->em->flush();
        
        $this->get('session')
                ->getFlashBag()
                ->add('success', $this->get('translator')->trans("channel.success_delete"));

        return $this->redirect($this->generateUrl('channels'));
    }
    
   

}
