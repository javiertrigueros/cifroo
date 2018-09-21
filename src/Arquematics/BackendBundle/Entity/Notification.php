<?php

namespace Arquematics\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Notification
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="Arquematics\BackendBundle\Entity\NotificationRepository")
 */
class Notification
{
    const FRIEND                    = 0;
    
       
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var integer
     *
     * @ORM\Column(name="type", type="integer")
     */
    private $type;

    /**
     * @var integer
     *
     * @ORM\Column(name="status", type="integer")
     */
    private $status;
    
    
     /**
     * @var string
     *
     * @ORM\Column(name="url", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $url;

    /**
     * @var string
     *
     * @ORM\Column(name="short_message", type="string", length=255)
     */
    private $shortMessage;

    /**
     * @var string
     *
     * @ORM\Column(name="message", type="string", length=255)
     */
    private $message;

    /**
     * @ORM\ManyToOne(targetEntity="Arquematics\UserBundle\Entity\User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $user;
    
    /**
     * @ORM\ManyToOne(targetEntity="Arquematics\UserBundle\Entity\User")
     * @ORM\JoinColumn(name="friend_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $friend;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime")
     */
    private $createdAt;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated_at", type="datetime")
     */
    private $updatedAt;

    /**
     * @var boolean
     *
     * @ORM\Column(name="viewed", type="boolean")
     */
    private $viewed;

    /**
     * @var string
     *
     * @ORM\Column(name="year", type="string", length=32, nullable=true)
     */
    private $year;

    /**
     * @var integer
     *
     * @ORM\Column(name="periodicity", type="integer", nullable=true)
     */
    private $periodicity;
    
    /**
     * @var string
     *
     * @ORM\Column(name="content", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $content;
    
    public function setContent($content)
    {
        $this->content = $content;

        return $this;
    }

    public function getContent()
    {
        return $this->content;
    }

    public function __construct(){
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
        $this->viewed = false;
        $this->status = 0; // 0 - Abierta ; 1 - En progreso; 2 - Cerrada
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
    
    

    /**
     * Set type
     *
     * @param integer $type
     * @return Notification
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return integer 
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set status
     *
     * @param integer $status
     * @return Notification
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return integer 
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return Notification
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime 
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     * @return Notification
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime 
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * Set viewed
     *
     * @param boolean $viewed
     * @return Notification
     */
    public function setViewed($viewed)
    {
        $this->viewed = $viewed;

        return $this;
    }

    /**
     * Get viewed
     *
     * @return boolean 
     */
    public function getViewed()
    {
        return $this->viewed;
    }

    
    /**
     * Set user
     *
     * @param \Arquematics\UserBundle\Entity\User $user
     * @return Notification
     */
    public function setUser(\Arquematics\UserBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \Arquematics\UserBundle\Entity\User 
     */
    public function getUser()
    {
        return $this->user;
    }
    
    /**
     * Set user
     *
     * @param \Arquematics\UserBundle\Entity\User $user
     * @return Notification
     */
    public function setFriend(\Arquematics\UserBundle\Entity\User $user = null)
    {
        $this->friend = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \Arquematics\UserBundle\Entity\User 
     */
    public function getFriend()
    {
        return $this->friend;
    }
    
    public function getUrl()
    {
        return $this->url;
    } 
    
    /**
     * 
     * @param type $url
     * @return $this
     */
    public function setUrl($url)
    {
        $this->url = $url;
        return $this;
    }

    /**
     * Set message
     *
     * @param string $message
     * @return Notification
     */
    public function setMessage($message)
    {
        $this->message = $message;

        return $this;
    }

    /**
     * Get message
     *
     * @return string 
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * Set year
     *
     * @param string $year
     * @return Notification
     */
    public function setYear($year)
    {
        $this->year = $year;

        return $this;
    }

    /**
     * Get year
     *
     * @return string 
     */
    public function getYear()
    {
        return $this->year;
    }

    /**
     * Set periodicity
     *
     * @param integer $periodicity
     * @return Notification
     */
    public function setPeriodicity($periodicity)
    {
        $this->periodicity = $periodicity;

        return $this;
    }

    /**
     * Get periodicity
     *
     * @return integer 
     */
    public function getPeriodicity()
    {
        return $this->periodicity;
    }

    /**
     * Set shortMessage
     *
     * @param string $shortMessage
     * @return Notification
     */
    public function setShortMessage($shortMessage)
    {
        $this->shortMessage = $shortMessage;

        return $this;
    }

    /**
     * Get shortMessage
     *
     * @return string 
     */
    public function getShortMessage()
    {
        return $this->shortMessage;
    }
}
