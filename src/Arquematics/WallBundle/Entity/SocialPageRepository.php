<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\EntityRepository;

use Doctrine\ORM\Tools\Pagination\Paginator;


class SocialPageRepository extends EntityRepository
{
    public function findByUser($user, $id)
    {
        $query = $this->getEntityManager()
                ->createQuery("
                    SELECT page
                    FROM WallBundle:SocialPage page
                    LEFT JOIN page.createdBy u
                    WHERE ((u = :user) AND (page.id = :id))
                ")
                ->setParameter('user', $user)
                ->setParameter('id', $id)
        ;
        
        //echo $query->getSQL().'SQL';
        //print_r($query->getParameters()->toArray());
        //exit();

        return $query->getOneOrNullResult();
        
        //return $query->getResult();
    }
    
}
