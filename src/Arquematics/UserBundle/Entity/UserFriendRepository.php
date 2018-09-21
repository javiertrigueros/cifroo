<?php

namespace Arquematics\UserBundle\Entity;

use Doctrine\ORM\EntityRepository;

class UserFriendRepository extends EntityRepository
{
    public function findByUserAndFriend($user, $friend)
    {
        $dql = '
            SELECT f
            FROM UserBundle:UserFriend f
            WHERE ((f.user = :user) AND (f.friend = :friend))
                  OR ((f.user = :friend) AND (f.friend = :user))'
            ;
        
        return $this->getEntityManager($dql)
                ->createQuery($dql)
                ->setParameter("user",$user)
                ->setParameter("friend",$friend)
                ->getOneOrNullResult();
        
    }
}