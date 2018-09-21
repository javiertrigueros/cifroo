<?php

namespace Arquematics\WallBundle\Listener;

use \Arquematics\UserBundle\Entity\User;


use Symfony\Component\HttpFoundation\Session\Session;
use Doctrine\ORM\Event\LifecycleEventArgs;


class UserPostPersist
{
    protected  $session;
    
    //hack javier 3.3
    public function __construct (Session $session)
    {
        $this->session = $session;
    }
    
    /**
     * doPostPersist
     * 
     * @param LifecycleEventArgs $args
     */
    public function postPersist(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();
        $entityManager = $args->getEntityManager();

        if ($entity instanceof User)
        {
            /*
            $wallList = $entityManager->getRepository('WallBundle:WallList')->findGeneral();
            $wallList->addUser($entity);
            
            $entityManager->persist($wallList);
            $entityManager->flush(); 
            
             */
        }
    }
}