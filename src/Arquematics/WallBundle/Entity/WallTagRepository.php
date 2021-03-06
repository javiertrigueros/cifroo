<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\EntityRepository;

use Doctrine\ORM\Tools\Pagination\Paginator;

use Arquematics\UserBundle\Entity\UserFriend;
/**
 * Notification repository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class WallTagRepository extends EntityRepository
{
    
    public function findByHashOne( $hash, $user = false)
    {
        if (!$user)
        {
           $query = $this->getEntityManager()->
                createQuery("
                    SELECT tag
                    FROM WallBundle:WallTag tag
                    WHERE (tag.hash like :hash)
                ")
            ->setParameter('hash', $hash)
            ;
        }
        else
        {
            $query = $this->getEntityManager()->
                createQuery("
                    SELECT tag
                    FROM WallBundle:WallTag tag
                    LEFT JOIN tag.messages m
                    LEFT JOIN m.createdBy u
                    WHERE (tag.hash like :hash) 
                ")
            ->setParameter('hash', $hash)
            ;
            
        }
        
        return $query->getOneOrNullResult();
    }
    
    public function findByHash( $hash, $hashSmall, $name, $channel, $user = false, $authUser = false)
    {
        if ($user)
        {
            $query = $this->getEntityManager()->
            createQuery("
                SELECT tag
        	FROM WallBundle:WallTag tag
                LEFT JOIN tag.messages mm
                WHERE ((tag.name like :name) OR (tag.hash like :hash) OR (tag.hashSmall like :hashSmall)) 
                    AND mm.id in (
        	 SELECT m.id
                    FROM WallBundle:WallMessage m
                    LEFT JOIN m.wallEncs me
                    LEFT JOIN me.user ue
                    LEFT JOIN m.createdBy u
                    LEFT JOIN m.channels ch
                    WHERE (u = :user) AND (ue = :authUser) AND (ch = :channel) AND (
                                (u = :authUser) OR (u.id in 
                                    (
                                        SELECT uu.id
                                        FROM UserBundle:User uu
                                        LEFT JOIN uu.friends f
                                        LEFT JOIN uu.users uuu
                                        WHERE 
                                            (
                                                (f.status = :status) AND ((f.friend = :authUser) OR (f.user = :authUser))
                                            ) 
                                            OR 
                                            (
                                                (uuu.status = :status) AND ((uuu.user = :authUser) OR (uuu.friend = :authUser)) 
                                            )
                                    )
                                )
                            )
                )
                GROUP BY tag.id
           ")
          ->setParameter('authUser', $authUser)
          ->setParameter('user', $user)
          ->setParameter('status', UserFriend::ACCEPT)
          ->setParameter('channel', $channel)
          ->setParameter('name', '%'.$name.'%')
          ->setParameter('hash', $hash)
          ->setParameter('hashSmall', $hashSmall)
          ->setMaxResults(12)
        ;
        }
        else
        {
          $query = $this->getEntityManager()->
           createQuery("
                SELECT tag
        	FROM WallBundle:WallTag tag
                LEFT JOIN tag.messages mm
                WHERE ((tag.name like :name) OR (tag.hash like :hash) OR (tag.hashSmall like :hashSmall)) 
                    AND mm.id in (
        	 SELECT m.id
                    FROM WallBundle:WallMessage m
                    LEFT JOIN m.wallEncs me
                    LEFT JOIN me.user ue
                    LEFT JOIN m.createdBy u
                    LEFT JOIN m.channels ch
                    WHERE (ue = :authUser) AND (ch = :channel) AND (
                                (u = :authUser) OR (u.id in 
                                    (
                                        SELECT uu.id
                                        FROM UserBundle:User uu
                                        LEFT JOIN uu.friends f
                                        LEFT JOIN uu.users uuu
                                        WHERE 
                                            (
                                                (f.status = :status) AND ((f.friend = :authUser) OR (f.user = :authUser))
                                            ) 
                                            OR 
                                            (
                                                (uuu.status = :status) AND ((uuu.user = :authUser) OR (uuu.friend = :authUser)) 
                                            )
                                    )
                                )
                            )
                )
                GROUP BY tag.id
        ")
        ->setParameter('authUser', $authUser)
        ->setParameter('status', UserFriend::ACCEPT)
        ->setParameter('channel', $channel)
        ->setParameter('name', '%'.$name.'%')
        ->setParameter('hash', $hash)
        ->setParameter('hashSmall', $hashSmall)
        ->setMaxResults(12)
        ;  
        }
        
        return $query->getResult();

    }
    
    public function countRecent($channel, $authUser)
    {
       $results = $this->getEntityManager()->
        createQuery("
                SELECT tag.id as countTags,
                       count(tag.id) AS countMessages
        	FROM WallBundle:WallTag tag
                LEFT JOIN tag.messages mm
                WHERE mm.id in (

        	 SELECT m.id
                    FROM WallBundle:WallMessage m
                    LEFT JOIN m.wallEncs me
                    LEFT JOIN me.user ue
                    LEFT JOIN m.createdBy u
                    LEFT JOIN m.channels ch
                    WHERE (ue = :authUser) AND (ch = :channel) AND (
                                (u = :authUser) OR (u.id in 
                                    (
                                        SELECT uu.id
                                        FROM UserBundle:User uu
                                        LEFT JOIN uu.friends f
                                        LEFT JOIN uu.users uuu
                                        WHERE 
                                            (
                                                (f.status = :status) AND ((f.friend = :authUser) OR (f.user = :authUser))
                                            ) 
                                            OR 
                                            (
                                                (uuu.status = :status) AND ((uuu.user = :authUser) OR (uuu.friend = :authUser)) 
                                            )
                                    )
                                )
                            )
                )
                GROUP BY tag.id
                HAVING  (countMessages > 0) 
        ")
        ->setParameter('authUser', $authUser)
        ->setParameter('status', UserFriend::ACCEPT)
        ->setParameter('channel', $channel)
        ->getResult();
        
        if ($results)
        {
            return count($results);
        }
        else {
            return 0;
        }
    }
    public function findByRecent($channel, $authUser, $currentPage = 1, $limit = 20)
    {
        //exit();
        $query = $this->getEntityManager()->
        createQuery("
                SELECT tag.id as id,
                       tag.name as name,
                       tag.hash as hash,
                       count(tag.id) AS countMessages
        	FROM WallBundle:WallTag tag
                LEFT JOIN tag.messages mm
                WHERE mm.id in (

        	 SELECT m.id
                    FROM WallBundle:WallMessage m
                    LEFT JOIN m.wallEncs me
                    LEFT JOIN me.user ue
                    LEFT JOIN m.createdBy u
                    LEFT JOIN m.channels ch
                    WHERE (ue = :authUser) AND (ch = :channel) AND (
                                (u = :authUser) OR (u.id in 
                                    (
                                        SELECT uu.id
                                        FROM UserBundle:User uu
                                        LEFT JOIN uu.friends f
                                        LEFT JOIN uu.users uuu
                                        WHERE 
                                            (
                                                (f.status = :status) AND ((f.friend = :authUser) OR (f.user = :authUser))
                                            ) 
                                            OR 
                                            (
                                                (uuu.status = :status) AND ((uuu.user = :authUser) OR (uuu.friend = :authUser)) 
                                            )
                                    )
                                )
                            )
                )
                GROUP BY tag.id
                HAVING  (countMessages > 0) 
                ORDER BY countMessages DESC
        ")
         ->setParameter('authUser', $authUser)
         ->setParameter('status', UserFriend::ACCEPT)
         ->setParameter('channel', $channel)
        ;
        /*
        echo $query->getSQL().'SQL';
        exit();*/
       
        $paginator = $this->paginate($query, $currentPage, $limit);

        return $paginator;
        
    }
    
    /**
    *
    * //configuracion del servidor
    * SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
    *
    * Pass through a query object, current page & limit
    * the offset is calculated from the page and limit
    * returns an `Paginator` instance, which you can call the following on:
    *
    *     $paginator->getIterator()->count() # Total fetched (ie: `5` posts)
    *     $paginator->count() # Count of ALL posts (ie: `20` posts)
    *     $paginator->getIterator() # ArrayIterator
    *
    * @param Doctrine\ORM\Query $dql   DQL Query Object
    * @param integer            $page  Current page (defaults to 1)
    * @param integer            $limit The total number per page (defaults to 5)
    *
    * @return \Doctrine\ORM\Tools\Pagination\Paginator
    */
    public function paginate($dql, $page = 1, $limit = 20)
    {
        $paginator = new Paginator($dql);
        
        $paginator->setUseOutputWalkers(false);
       
        $paginator->getQuery()
            ->setFirstResult($limit * ($page - 1)) // Offset
            ->setMaxResults($limit); // Limit

        
        
        return $paginator;
    }
    
    
    public function findByMessage($channel, $authUser, $message)
    {
        $query = $this->getEntityManager()->
        createQuery("
        	SELECT tag.id as id,
                       tag.name as name,
                       tag.hash as hash,
                       count(m.id) AS countMessages
        	FROM WallBundle:WallTag tag
                LEFT JOIN tag.messages m
                LEFT JOIN m.channels ch
                LEFT JOIN m.createdBy u
                WHERE (m = :message) AND (ch = :channel) AND (
                                (u = :authUser) OR (u.id in 
                                    (
                                        SELECT uu.id
                                        FROM UserBundle:User uu
                                        LEFT JOIN uu.friends f
                                        LEFT JOIN uu.users uuu
                                        WHERE 
                                            (
                                                (f.status = :status) AND ((f.friend = :authUser) OR (f.user = :authUser))
                                            ) 
                                            OR 
                                            (
                                                (uuu.status = :status) AND ((uuu.user = :authUser) OR (uuu.friend = :authUser)) 
                                            )
                                    )
                                )
                            )
                GROUP BY tag.id
                HAVING countMessages > 0
                ORDER BY countMessages DESC
        ")
        ->setParameter('channel', $channel)
        ->setParameter('authUser', $authUser)
        ->setParameter('message', $message)
        ->setParameter('status', UserFriend::ACCEPT)
        ;
        
        return $query->getResult();

    }
    
    public function findByUser($channel, $authUser, $user)
    {
        $query = $this->getEntityManager()->
        createQuery("
        	SELECT tag.id as id,
                       tag.name as name,
                       tag.hash as hash,
                       count(tag.id) AS countMessages
        	FROM WallBundle:WallTag tag
                LEFT JOIN tag.messages m
                LEFT JOIN m.wallEncs me
                LEFT JOIN me.user ue
                LEFT JOIN m.channels ch
                LEFT JOIN m.createdBy u
                WHERE (ch = :channel) AND (ue = :authUser) AND (u = :user)
                GROUP BY tag.id
                HAVING countMessages > 0
        ")
        ->setParameter('authUser', $authUser)
        ->setParameter('user', $user)
        ->setParameter('channel', $channel)
        ;
        
        return $query->getResult();

    }
}
