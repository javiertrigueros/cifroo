<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\EntityRepository;

class ArFavoriteRepository extends EntityRepository
{
    
    public function findOneByFileAndUser( $file, $user)
    {
        $query = $this->getEntityManager()->
                createQuery("
                    SELECT f
                    FROM WallBundle:arFavorite f
                    LEFT JOIN f.arFile file
                    LEFT JOIN f.createdBy u
                    WHERE (file = :file) AND (u = :user)
                ")
            ->setParameter('file', $file)
            ->setParameter('user', $user)
            ;
        
        return $query->getOneOrNullResult();
    }
}