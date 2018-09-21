<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\EntityRepository;

use Arquematics\WallBundle\Entity\WallList;

class WallListRepository extends EntityRepository
{
    public function findGeneral()
    {
        $query = $this->getEntityManager()->
                createQuery("
                    SELECT l
                    FROM WallBundle:WallList l
                    WHERE (l.id = :id)
                ")
            ->setParameter('id', WallList::GENERAL);
        return $query->getOneOrNullResult();
    } 
    
    public function findByUser($user)
    {
        $query = $this->getEntityManager()->
                createQuery("
                    SELECT l
                    FROM WallBundle:WallList l
                    LEFT JOIN l.users u
                    WHERE (u = :user)
                ")
            ->setParameter('user', $user);
        
        return $query->getResult();
    }  
}
