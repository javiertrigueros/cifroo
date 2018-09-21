<?php

namespace Arquematics\BackendBundle\Controller;

use Arquematics\BackendBundle\Utils\ArController;
//use Symfony\Component\Validator\Constraints\Null;

use Arquematics\UserBundle\Entity\UserRole;


use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class AjaxController extends ArController
{
   
    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function notificationsToViewedAction(Request $request)
    {
        if (!$this->checkView($request))
        {
           $response = new Response();
           $response->setStatusCode(404);
           return $response;
        }
      
        $lastNotifications = $this->em->getRepository("BackendBundle:Notification")->findNotificationsNotViewed($this->authUser);
        foreach ($lastNotifications as $notification) {
            $notification->setViewed(true);
            $this->em->persist($notification);
        }
        $this->em->flush();
        
        $response = new Response();
        $response->setStatusCode(200);
        $response->setContent(json_encode(true));
        return $response;
    }
}
