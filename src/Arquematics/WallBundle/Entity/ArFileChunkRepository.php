<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\EntityRepository;

class ArFileChunkRepository extends EntityRepository
{
    
    public function count($arFile)
    {
        return $this->getEntityManager()->
                createQuery("
                        SELECT count(fileChunk.id)
                        FROM WallBundle:ArFileChunk fileChunk
                        LEFT JOIN fileChunk.arFile f
                        WHERE (f = :arFile)
                ")
                ->setParameter('arFile', $arFile)
                ->getSingleScalarResult();
        
    }
  
}