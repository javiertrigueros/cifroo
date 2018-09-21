<?php

namespace Arquematics\BackendBundle\Controller;

use Arquematics\BackendBundle\Form\ContactType;
use Arquematics\BackendBundle\Model\ImageUpload;

use Arquematics\BackendBundle\Utils\ArController;

use Arquematics\UserBundle\Entity\UserRole;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends ArController
{
    public function activityAction(Request $request)
    {
        if (!$this->checkView($request))
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        return $this->render('BackendBundle:Default:activity.html.twig', array(
            "menuSection" => "home",
            "notifications" => $this->em->getRepository('BackendBundle:Notification')->findNotificationsByUser($this->authUser)
        ));
    }

    public function recentNotificationsAction(Request $request)
    {
        if (!$this->checkView($request))
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
       
        $lastNotifications = $this->em->getRepository("BackendBundle:Notification")->findLastNotifications($this->aUser,4);
        $noViewedNotifications = $this->em->getRepository("BackendBundle:Notification")->getNumberOfNoViewedNotifications($this->aUser);

        return $this->render('::Includes/recent_notifications.html.twig', array(
                "countNotifications" => $noViewedNotifications,
                "notifications" => $lastNotifications
        )); 
    }
    
    public function listNoViewNotificationsAction(Request $request)
    {
        if (!$this->checkView($request))
        {
           $response = new Response();
           $response->setStatusCode(404);
           return $response; 
        }
        
        $noViewedNotifications = $this->em->getRepository("BackendBundle:Notification")
                                        ->getNumberOfNoViewedNotifications($this->authUser);
            
            
        $lastNotifications = $this->em->getRepository("BackendBundle:Notification")->findLastNotifications($this->authUser,4);
            

        $respose = array("count"  => $noViewedNotifications,
                             "HTML" => $this->render('::Includes/recent_notifications_simple.html.twig', array(
                                        "countNotifications" => $noViewedNotifications,
                                        "notifications" => $lastNotifications
                                        ))->getContent());
            
        $response = new JsonResponse();
        $response->setData($respose);
            
         return $response; 
    }

    public function dashboardNotificationsAction(Request $request)
    {
        if (!$this->checkView($request))
        { 
           return $this->redirect($this->generateUrl('homepage'));   
        }
        
        $lastNotifications = $this->em->getRepository("BackendBundle:Notification")->findLastNotifications($this->authUser,4);

        return $this->render('BackendBundle:Default:Includes/activity.html.twig', array(
            "notifications" => $lastNotifications,
        ));
    }

    public function deleteNotificationAction($id, Request $request)
    {
        if (!$this->checkView($request))
        { 
           return $this->redirect($this->generateUrl('homepage'));   
        }
        
        $notification = $this->em->getRepository("BackendBundle:Notification")->find($id);
        if(!$notification) {
            $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans('control_panel.notification_not_found'));
            return $this->redirect($this->generateUrl('activity'));
        }

        if($this->authUser != $notification->getUser()) {
            $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans('control_panel.notification_not_own'));
            return $this->redirect($this->generateUrl('activity'));
        }

        $this->em->remove($notification);
        $this->em->flush();

        $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans('control_panel.notification_delete'));
        return $this->redirect($this->generateUrl('activity'));
    }


    public function deleteAllNotificationsAction(Request $request)
    {
        if (!$this->checkView($request))
        { 
           return $this->redirect($this->generateUrl('homepage'));   
        }
        
        $notifications = $this->em->getRepository('BackendBundle:Notification')->findNotificationsByUser($this->authUser);
        foreach($notifications as $notification){
            $this->em->remove($notification);
        }
        $this->em->flush();

        $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans('control_panel.notification_delete_all'));
        return $this->redirect($this->generateUrl('activity'));
    }

}
