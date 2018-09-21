<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

use JsonSerializable;

/**
 * Class WallTag
 *
 * @ORM\Table(name="WallList")
 * @ORM\Entity(repositoryClass="Arquematics\WallBundle\Entity\WallListRepository")
 */
class WallList implements JsonSerializable
{
    const TWITTER = 1;
    const FACEBOOK = 2;
    const LINKEDIN = 3;
    const GENERAL = 4;
   
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;
    
    public function setId($id)
    {
       $this->id = $id;
       return $this;
    }
    
    /**
     * @var string
     *
     * @ORM\Column(name="name", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $name;
    
    /**
    * @ORM\Column(name="social_type", type="boolean", length=1)
    */
    private $socialType = false;

    /**
     * Set socialType
     *
     * @param integer $socialType
     * @return WallList
     */
    public function setSocialType($socialType)
    {
        $this->socialType = $socialType;

        return $this;
    }

    /**
     * Get socialType
     *
     * @return integer 
     */
    public function getSocialType()
    {
        return $this->socialType;
    }
   
    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Arquematics\UserBundle\Entity\UserFriend", mappedBy="list")
     */
    protected $friends;
    
    public function addFriend($user)
    {
        $this->friends[] = $user;

        return $this;
    }

    public function removeFriend($user)
    {
        $this->friends->removeElement($user);
    }

    public function getFriends()
    {
        return $this->friends;
    }
   
    public function setFriends(\Doctrine\Common\Collections\Collection $users)
    {
        $this->friends = $users;
         
        return $this;
    }
    
    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="WallMessage", inversedBy="lists", cascade={"persist"})
     * @ORM\JoinTable(
     *  name="WallList_WallMessage",
     *  joinColumns={
     *      @ORM\JoinColumn(name="list_id", referencedColumnName="id")
     *  },
     *  inverseJoinColumns={
     *      @ORM\JoinColumn(name="message_id", referencedColumnName="id")
     *  }
     * )
     */
    protected $messages;
    /**
     * Add message
     *
     * @param \Arquematics\WallBundle\Entity\WallMessage $message
     * @return WallTag
     */
    public function addMessage(\Arquematics\WallBundle\Entity\WallMessage $message)
    {
        $this->messages[] = $message;

        return $this;
    }

    /**
     * Remove message
     *
     * @param \Arquematics\WallBundle\Entity\WallMessage $message
     */
    public function removeMessage(\Arquematics\WallBundle\Entity\WallMessage $message)
    {
        $this->messages->removeElement($message);
    }

    /**
     * Get messages
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getMessages()
    {
        return $this->messages;
    }
    
    /**
     * Get messages
    * @param \Doctrine\Common\Collections\Collection
     * 
     * @return  WallTag 
     */
    public function setMessages(\Doctrine\Common\Collections\Collection $messages)
    {
        $this->messages = $messages;
         
        return $this;
    }
    
    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }
    
    
    
    public function getName()
    {
        return $this->name;
    } 
    
    /**
     * Set content data
     *
     * @param text $data
     * @return WallTag
     */
    public function setName($data)
    {
        $this->name = $data;

        return $this;
    }
    
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->messages = new ArrayCollection();
        $this->friends = new ArrayCollection();
    }
    
    public function jsonSerialize()
    {
        return [
            'id'            =>  $this->getId(),
            'name'          =>  $this->getName()
        ];
    }

}
