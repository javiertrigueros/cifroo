<?php

namespace Arquematics\UserBundle\Entity;

use Doctrine\ORM\EntityRepository;

class ConfigurationRepository extends EntityRepository
{
   public function findByKeyAndUser($key, $user = false)
   {
       if ($user)
       {
            $query = $this->getEntityManager()->
                createQuery("
                    SELECT c
                    FROM UserBundle:Configuration c
                    LEFT JOIN c.createdBy u
                    WHERE (u = :user) AND (c.key = :key)
            ")
            ->setParameter('user', $user)
            ->setParameter('key', $key)
            ;
       }
       else
       {
            $query = $this->getEntityManager()->
                createQuery("
                    SELECT c
                    FROM UserBundle:Configuration c
                    LEFT JOIN c.createdBy u
                    WHERE (c.key = :key)
            ")
            ->setParameter('key', $key)
            ;
           
       }
       
       $ret = $query->getOneOrNullResult();
       
       return ($ret === null)? false: $ret;
   }
}