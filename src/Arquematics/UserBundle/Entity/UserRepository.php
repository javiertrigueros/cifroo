<?php

namespace Arquematics\UserBundle\Entity;

use Doctrine\ORM\EntityRepository;

use Arquematics\UserBundle\Entity\UserRole;

use Arquematics\UserBundle\Entity\UserFriend;

/**
 * UserRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class UserRepository extends EntityRepository
{
    public function findByFriendAccept($user)
    {
       $dql = '
            SELECT u
            FROM UserBundle:User u
            LEFT JOIN u.friends f
            LEFT JOIN u.users uu
            WHERE (u != :user) AND (((f.user = :user) OR (f.friend = :user)) OR ((uu.user = :user) OR (uu.friend = :user))) AND ((f.status = :statusAc) OR (uu.status = :statusAc))'
            ;
        
        $query = $this->getEntityManager($dql)
                ->createQuery($dql)
                ->setParameter("user",$user)
                ->setParameter("statusAc",UserFriend::ACCEPT)
        ; 
        
        return $query->getResult();
    }
    
    public function findByFriend($user)
    {
        $dql = '
            SELECT u
            FROM UserBundle:User u
            LEFT JOIN u.friends f
            LEFT JOIN u.users uu
            WHERE (u != :user) AND (((f.user = :user) OR (f.friend = :user)) OR ((uu.user = :user) OR (uu.friend = :user))) AND ((f.status = :statusRq) OR (uu.status = :statusRq) OR (f.status = :statusAc) OR (uu.status = :statusAc))'
            ;
        
        $query = $this->getEntityManager($dql)
                ->createQuery($dql)
                ->setParameter("user",$user)
                ->setParameter("statusAc",UserFriend::ACCEPT)
                ->setParameter("statusRq",UserFriend::REQUEST)
        ;
                
        /*
        echo $query->getSQL().'SQL';
        exit();
        */
        
        return $query->getResult();
    }
    
    public function deleteUser($user)
    {
        $sql = "delete from User where User.id = :id";
        $params = array('id'=> $user->getId());

        $em = $this->getEntityManager();
        $stmt = $em->getConnection()->prepare($sql);
        $stmt->execute($params);
    }
    
    public function findByMainConfigurator($user)
    {
        $dql = "SELECT u
            FROM UserBundle:User u
            JOIN u.roles r
            WHERE ((r.id = :rol)
                AND (u <> :user))
            ORDER BY u.id DESC";
        

        return $this->getEntityManager($dql)
                ->createQuery($dql)
                ->setParameter("rol",UserRole::ROLE_CONFIG)
                ->setParameter("user",$user)
                ->getSingleResult();
        
    }
    /**
     * Get user by confirmation code
     *
     * @param string $confirmationHash Confirmation Hash
     */
    public function findUserByConfirmationCode($confirmationHash)
    {
        return $this->getEntityManager()->getRepository('UserBundle:User')
            ->findOneBy(array('confirmation_hash' => $confirmationHash));
    }


    public function findOneByEmailOrId($user)
    {
        $query = $this->getEntityManager()->
            createQuery("SELECT u FROM UserBundle:User u WHERE u.id = :user_id OR u.email = :user_email");
        $query->setParameter('user_id', $user);
        $query->setParameter('user_email', $user);
        
        return $query->getSingleResult();
    } 

    public function findAllUsersNotCurrent($currentUser)
    {
        $qb = $this->createQueryBuilder('u');
        $qb->where('u != :currentUser')
            ->setParameter('currentUser', $currentUser);

        return $qb->getQuery()
            ->getResult();
        
    }


    public function findAllUsers()
    {
        return $this->getEntityManager()->getRepository('UserBundle:User')
            ->findBy(array());
    }
    
    
    public function findAllUsersNotAdmin()
    {
        $qb = $this->createQueryBuilder('u');
        $qb->where('u.id != :identifier')
            ->setParameter('identifier', 1);

        return $qb->getQuery()
            ->getResult();
    }
    
    public function findAllUsersNotUserNotIgnore($user)
    {
        
        $query = $this->getEntityManager()->
                createQuery("
                    SELECT u
                    FROM UserBundle:User u
                    LEFT JOIN u.users f
                    WHERE (u != :authUser) AND (u.publicKey IS NOT NULL)
                    ORDER BY u.name ASC
                ")
            ->setParameter('authUser', $user)
            ;
        /*
        echo $query->getSQL().'SQL';
        exit();
         */
         
        
        return $query->getResult();
    }
    
    public function findAllUsersNotUser($user)
    {
        $qb = $this->createQueryBuilder('u');
        $qb->where('u. != :user')
            ->setParameter('user', $user);

        return $qb->getQuery()
            ->getResult();
    }
            
    public function findUsersByRol($rol) {
        $dql = "
            SELECT u
            FROM UserBundle:User u
            JOIN u.roles r
            WHERE r.id = :rol
                AND u.actived = true
        ";

        return $this->getEntityManager($dql)
                    ->createQuery($dql)
                    ->setParameter("rol",$rol)
                    ->getResult()
        ;        
    }

    
    public function findUserByIdAndMail($userId, $email)
    {
        $dql = "
           SELECT u 
           FROM UserBundle:User u 
           WHERE ((u.email = :user_email)
                 AND (u.id != :user_id))
        ";

        return $this->getEntityManager($dql)->createQuery($dql)
                    ->setParameter('user_id', $userId)
                    ->setParameter('user_email', $email)
                    ->getOneOrNullResult();        

    }
}