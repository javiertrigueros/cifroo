<?php

namespace Arquematics\BackendBundle\Service;

class NotificationService
{
	protected $twig;
	protected $mailer;
        protected $container;

	public function __construct($twig, $mailer, $container, $notificationsEmail){
		$this->twig = $twig;
		$this->mailer = $mailer;
                $this->container = $container;
		$this->notificationEmail = $notificationsEmail;
	}

	public function sendNotificationTo(\Arquematics\BackendBundle\Entity\Notification $notification)
        {
            $mailer = $this->mailer;
            $twig = $this->twig;
                
            $message = \Swift_Message::newInstance()
                ->setSubject($this->container->get('translator')->trans("mail.alert_subject"))
                ->setFrom($this->notificationEmail)
                ->addTo($notification->getUser()->getEmail())
                ->setBody($twig->render("BackendBundle:Emails:notification.html.twig",array("notification" => $notification)))
                ->setContentType("text/html");
                
            $mailer->send($message);
   		
	}
}