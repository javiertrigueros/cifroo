<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\EntityRepository;

class ArFilePreviewChunkRepository extends EntityRepository
{
    public function count($arFilePreview)
    {
        return $this->getEntityManager()->
                createQuery("
                        SELECT count(previewChunk.id)
                        FROM WallBundle:ArFilePreviewChunk previewChunk
                        LEFT JOIN previewChunk.arFile fp
                        WHERE (fp = :arFilePreview)
                ")
                ->setParameter('arFilePreview', $arFilePreview)
                ->getSingleScalarResult();
        
    }
  
}