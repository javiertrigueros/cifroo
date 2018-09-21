<?php

namespace Arquematics\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;



/**
 * Arquematics\UserBundle\Entity\UserFriend
 *
 * @ORM\Table(name="UserFriend")
 * @ORM\Entity(repositoryClass="Arquematics\UserBundle\Entity\UserFriendRepository")
 */
class UserFriend
{
    const ACCEPT    = 1;
    const IGNORE    = 2;
    const REQUEST   = 3;
    
    /**
     * @var integer $id
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;
    
    /**
     * @var \DateTime $created_at
     *
     * @ORM\Column(name="created_at", type="datetime")
     */
    private $created_at;
    
    
    /**
     * Set created_at
     *
     * @param \DateTime $createdAt
     * @return User
     */
    public function setCreatedAt($createdAt)
    {
        $this->created_at = $createdAt;
    
        return $this;
    }

    /**
     * Get created_at
     *
     * @return \DateTime 
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @var smallint $confirmed
     *
     * @ORM\Column(name="status", type="smallint")
     */
    protected $status;
    
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    public function getStatus()
    {
        return $this->status;
    }
    
     /**
     * @var \Arquematics\UserBundle\Entity\User $friend
     * 
     * @ORM\ManyToOne(targetEntity="Arquematics\UserBundle\Entity\User", inversedBy="users", cascade={"persist"})
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="CASCADE")
     * 
     */
    private $user;
    
    /**
     * Set createdBy
     *
     * @param \Arquematics\UserBundle\Entity\User $user
     * @return \Arquematics\UserBundle\Entity\UserFriend 
     */
    public function setUser(\Arquematics\UserBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get createdBy
     *
     * @return \Arquematics\UserBundle\Entity\User 
     */
    public function getUser()
    {
        return $this->user;
    }
    
    /**
     * @var \Arquematics\UserBundle\Entity\User $friend
     * 
     * @ORM\ManyToOne(targetEntity="Arquematics\UserBundle\Entity\User", inversedBy="friends", cascade={"persist"})
     * @ORM\JoinColumn(name="friend_id", referencedColumnName="id", onDelete="CASCADE")
     * 
     */
    private $friend;
    
     /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToOne(targetEntity="\Arquematics\WallBundle\Entity\WallList", inversedBy="friends", cascade={"persist"})
     * @ORM\JoinColumn(name="list_id", referencedColumnName="id", onDelete="CASCADE")
     */
    protected $list;
    
    public function getlist()
    {
        return $this->list;
    }
   
    public function setlist($list)
    {
        $this->list = $list;
        return $this;
    }
    
    /**
     * Set createdBy
     *
     * @param \Arquematics\UserBundle\Entity\User $user
     * @return \Arquematics\UserBundle\Entity\UserFriend 
     */
    public function setFriend(\Arquematics\UserBundle\Entity\User $user = null)
    {
        $this->friend = $user;

        return $this;
    }

    /**
     * Get createdBy
     *
     * @return \Arquematics\UserBundle\Entity\User 
     */
    public function getFriend()
    {
        return $this->friend;
    }
    
    public function __construct()
    {
        $this->created_at = new \DateTime;
    }
}