<?php


namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\EntityRepository;


class ArChannelRepository extends EntityRepository
{
    function findAllActive(){
        $query = $this->getEntityManager()->
        createQuery("
        	SELECT q
        	FROM WallBundle:ArChannel q
                WHERE q.open = 1
        	ORDER BY q.id ASC
        ");
        
        return $query->getResult();
    }
   
}
