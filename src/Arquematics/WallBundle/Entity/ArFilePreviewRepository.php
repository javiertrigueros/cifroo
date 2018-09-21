<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\EntityRepository;

class ArFilePreviewRepository extends EntityRepository
{
    public function findByGuidStyle($guid, $style)
    {
        $q = $this->getEntityManager()->
                createQuery("
                        SELECT arFilePreview
                        FROM WallBundle:ArFilePreview arFilePreview
                        LEFT JOIN arFilePreview.arFile arFile
                        WHERE (arFile.guid = :guid) AND (arFilePreview.style = :style)
                ")
                ->setParameter('guid', $guid)
                ->setParameter('style', $style);
         
        return $q->getOneOrNullResult();
    }
  
}