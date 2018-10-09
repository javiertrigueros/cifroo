<?php

namespace Arquematics\WallBundle\Listener;

use Arquematics\WallBundle\Entity\DirectMessage;

use Symfony\Component\HttpFoundation\Session\Session;

use Doctrine\ORM\Event\LifecycleEventArgs;

// mirar para el despues de publicado 
// https://stackoverflow.com/questions/11661057/how-to-create-custom-event-in-symfony2
// y esto mejor https://victorroblesweb.es/2016/12/03/crear-eventos-symfony3/

class DirectMessagePostPersist
{
    protected  $session;
    
    //hack javier 3.3
    public function __construct (Session $session)
    {
        $this->session = $session;
    }
    
    private function saveWallLinks($entityManager, $entity)
    {
        $wallLinks = $this->session->get("wallLinks");
        
        if ($wallLinks && (count($wallLinks) > 0))
        {
            foreach ($entityManager->getRepository('WallBundle:WallLink')->findById($wallLinks) as $wallLink) 
            {
                   $wallLink->setDirectMessage($entity);
                   $entityManager->persist($wallLink);
                   $entityManager->flush();
            }
            $this->session->set("wallLinks", array());
        }
    }
    
    
    private function saveArFiles($entityManager, $entity)
    {
        $arFiles = $this->session->get("arFiles");
        
        if ($arFiles && (count($arFiles) > 0))
        {
            foreach ($entityManager->getRepository('WallBundle:ArFile')->findById($arFiles) as $arFile) 
            {
                   $arFile->setDirectMessage($entity);
                   $entityManager->persist($arFile);
                   $entityManager->flush();
            }
            $this->session->set("arFiles", array());
        }
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
        
        if ($entity instanceof DirectMessage)
        {    
            $this->saveWallLinks($entityManager, $entity); 
            $this->saveArFiles($entityManager, $entity); 
        }
    }
}