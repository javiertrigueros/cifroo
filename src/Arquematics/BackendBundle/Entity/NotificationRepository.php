<?php

namespace Arquematics\BackendBundle\Entity;

use Doctrine\ORM\EntityRepository;

/**
 * Notification repository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class NotificationRepository extends EntityRepository
{
    
    public function findLastNotifications($user, $limit = 10)
    {
        $query = $this->getEntityManager()->
        	createQuery("
        		SELECT n 
        		FROM BackendBundle:Notification n 
        		WHERE n.user = :user
        		ORDER BY n.createdAt DESC
        ");
        $query->setParameter('user', $user);
        $query->setMaxResults($limit);

        return $query->getResult();
    }

    public function getNumberOfNoViewedNotifications($user){
    	$query = $this->getEntityManager()->
        	createQuery("
        		SELECT COUNT(n) 
        		FROM BackendBundle:Notification n 
        		WHERE n.user = :user
        		AND n.viewed = false
        ");
        $query->setParameter('user', $user);

        return $query->getSingleScalarResult();
    }
    
    public function findFriendNotification($user, $friend)
    {
        $query = $this->getEntityManager()->
            createQuery("
                SELECT n 
                FROM BackendBundle:Notification n 
                WHERE ((n.user = :user) AND (n.friend = :friend))
                ORDER BY n.createdAt DESC
        ")
        ->setParameter('user', $user)
        ->setParameter('friend', $friend)
        ;

        return $query->getOneOrNullResult();
    }

    public function findNotificationsByUser($user)
    {
        $query = $this->getEntityManager()->
            createQuery("
                SELECT n 
                FROM BackendBundle:Notification n 
                WHERE n.user = :user
                ORDER BY n.createdAt DESC
        ");
        $query->setParameter('user', $user);

        return $query->getResult();
    }

    public function findNotificationsNotViewed($user, $limit = false)
    {
        $query = $this->getEntityManager()->
            createQuery("
                SELECT n 
                FROM BackendBundle:Notification n 
                WHERE n.user = :user
                AND n.viewed = false
                ORDER BY n.createdAt DESC
        ");
        $query->setParameter('user', $user);
        
        if ($limit &&  ($limit > 0))
        {
           $query->setMaxResults($limit);  
        }
       

        return $query->getResult();
    }

}
