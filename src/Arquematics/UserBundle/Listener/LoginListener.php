<?php
namespace Arquematics\UserBundle\Listener;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;

use Doctrine\ORM\EntityManager;
use Arquematics\UserBundle\Entity\User;

class LoginListener
{
        protected $em;
        protected $request;

        public function __construct(EntityManager $em, RequestStack $request) {

            $this->em = $em;
            $this->request = $request;
        }
	
	public function onSecurityInteractiveLogin(InteractiveLoginEvent $event)
	{
            /*
            $user = $event->getAuthenticationToken()->getUser();
            // No esta confirmado
            if($user->getConfirmed() == 0)
            {
                $this->session->invalidate();
                $this->security->setToken(null);
                $this->dispatcher->addListener(KernelEvents::RESPONSE, array($this, 'onKernelResponse'));
            }
            else
            {
                $user->setLastLogin(new \DateTime());
                $this->em->persist($user);
                $this->em->flush();
            }*/
            
            $user = $event->getAuthenticationToken()->getUser();

            if ($user instanceof User) 
            {
                if($this->request->getCurrentRequest()->hasSession()) 
                {
                    $user->setLastLogin(new \DateTime('now'));
                    $this->em->persist($user);
                    $this->em->flush();
                }
            }
	}
}
