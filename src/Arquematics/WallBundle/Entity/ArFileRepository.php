<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\EntityRepository;

use Doctrine\ORM\Tools\Pagination\Paginator;
use Arquematics\UserBundle\Entity\UserFriend;

class ArFileRepository extends EntityRepository
{
    public function findByUser($authUser,  $hash = false, $hashSmall = false, $group = false, $currentPage = 1)
    {
        
            
        if ((!$hash) && (!$group))
        {
            //arFiles
          $query = $this->getEntityManager()->
                createQuery("
                    SELECT fi
                    FROM WallBundle:arFile fi
                    LEFT JOIN fi.wallMessage m
                    LEFT JOIN m.channels ch
                    LEFT JOIN fi.createdBy u
                    WHERE ((ch.open = 1) OR (ch.id IS NULL)) AND (
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
                    ORDER BY fi.createdAt DESC
            ")
            ->setParameter('authUser', $authUser)
            ->setParameter('status', UserFriend::ACCEPT)
            ;
        }
        else if ((!$hash) && ($group))
        {
            if ($group === 'fav')
            {
                $query = $this->getEntityManager()->
                createQuery("
                    SELECT fi
                    FROM WallBundle:arFile fi
                    LEFT JOIN fi.wallMessage m
                    LEFT JOIN m.channels ch
                    LEFT JOIN fi.createdBy u
                    LEFT JOIN fi.arFavorites fav
                    WHERE ((ch.open = 1) OR (ch.id IS NULL)) AND (fav.createdBy = :authUser) AND (
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
                    ORDER BY fi.createdAt DESC
                ")
                ->setParameter('authUser', $authUser)
                ->setParameter('status', UserFriend::ACCEPT)
                ;
            }
            else if ($group === 'all')
            {
                $query = $this->getEntityManager()->
                createQuery("
                    SELECT fi
                    FROM WallBundle:arFile fi
                    LEFT JOIN fi.wallMessage m
                    LEFT JOIN m.channels ch
                    LEFT JOIN fi.createdBy u
                    WHERE ((ch.open = 1) OR (ch.id IS NULL)) AND (
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
                    ORDER BY fi.createdAt DESC
                ")
                ->setParameter('authUser', $authUser)
                ->setParameter('status', UserFriend::ACCEPT)
                ;
            }
            else 
            {
                $query = $this->getEntityManager()->
                createQuery("
                    SELECT fi
                    FROM WallBundle:arFile fi
                    LEFT JOIN fi.wallMessage m
                    LEFT JOIN m.channels ch
                    LEFT JOIN fi.createdBy u
                    WHERE ((ch.open = 1) OR (ch.id IS NULL)) AND (fi.groupType = :group) AND (
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
                    ORDER BY fi.createdAt DESC
                ")
                ->setParameter('authUser', $authUser)
                ->setParameter('group', $group)
                ->setParameter('status', UserFriend::ACCEPT)
                ;
            }
        }
        else if (($hash) && ($group))
        {
            if ($group === 'fav')
            {
                $query = $this->getEntityManager()->
                createQuery("
                    SELECT fi
                    FROM WallBundle:arFile fi
                    LEFT JOIN fi.wallMessage m
                    LEFT JOIN m.channels ch
                    LEFT JOIN fi.createdBy u
                    LEFT JOIN fi.arFavorites fav
                    WHERE ((ch.open = 1) OR (ch.id IS NULL)) AND ((fi.hash like :hash) OR (fi.hashSmall like :hashSmall)) AND (fav.createdBy = :authUser)  AND (
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
                    ORDER BY fi.createdAt DESC
                ")
                ->setParameter('authUser', $authUser)
                ->setParameter('hash', '%'.$hash.'%')
                ->setParameter('hashSmall', '%'.$hashSmall.'%')
                ->setParameter('status', UserFriend::ACCEPT)
                ;
            }
            else if ($group === 'all')
            {
                $query = $this->getEntityManager()->
                createQuery("
                    SELECT fi
                    FROM WallBundle:arFile fi
                    LEFT JOIN fi.wallMessage m
                    LEFT JOIN m.channels ch
                    LEFT JOIN fi.createdBy u
                    WHERE ((ch.open = 1) OR (ch.id IS NULL)) AND ((fi.hash like :hash) OR (fi.hashSmall like :hashSmall)) AND (
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
                    ORDER BY fi.createdAt DESC
                ")
                ->setParameter('authUser', $authUser)
                ->setParameter('hash', '%'.$hash.'%')
                ->setParameter('hashSmall', '%'.$hashSmall.'%')
                ->setParameter('status', UserFriend::ACCEPT)
                ;
            }
            else 
            {
                $query = $this->getEntityManager()->
                createQuery("
                    SELECT fi
                    FROM WallBundle:arFile fi
                    LEFT JOIN fi.wallMessage m
                    LEFT JOIN m.channels ch
                    LEFT JOIN fi.createdBy u
                    WHERE ((ch.open = 1) OR (ch.id IS NULL)) AND ((fi.hash Like :hash) OR (fi.hashSmall Like :hashSmall)) AND (fi.groupType = :group) AND (
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
                    ORDER BY fi.createdAt DESC
                ")
                //->setParameter('list', $list)
                ->setParameter('authUser', $authUser)
                ->setParameter('hash', '%'.$hash.'%')
                ->setParameter('hashSmall', '%'.$hashSmall.'%')
                ->setParameter('group', $group)
                ->setParameter('status', UserFriend::ACCEPT)
                ;
            }
        }
        
      //echo $query->getSQL().'SQL';
      //exit();
         //
        //return $query->getResult();

        $paginator = $this->paginate($query, $currentPage);

        return $paginator;
         
    }
    
    public function paginate($dql, $page = 1, $limit = 20)
    {
        $paginator = new Paginator($dql);
        
    
        $paginator->getQuery()
            ->setFirstResult($limit * ($page - 1)) // Offset
            ->setMaxResults($limit); // Limit

        return $paginator;
    }
  
}