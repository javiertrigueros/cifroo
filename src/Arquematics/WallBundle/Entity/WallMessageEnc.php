<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

/**
 * Class WallTag
 *
 * @ORM\Table(name="WallMessageEnc")
 * @ORM\Entity(repositoryClass="Arquematics\WallBundle\Entity\WallMessageEncRepository")
 */
class WallMessageEnc implements JsonSerializable
{
   
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;
    
    /**
     * @var \DateTime
     *
     * @ORM\Column(name="createdAt", type="datetime")
     */
    private $createdAt;

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
     * @var blob
     *
     * @ORM\Column(name="content", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $content;
    
    
    public function getContent()
    {
        return $this->content;
    }
    
    /**
     * Set content data
     *
     * @param text $data
     * @return Company
     */
    public function setContent($data)
    {
        $this->content = $data;

        return $this;
    }
    
    
    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return WallTag
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
     * Constructor
     */
    public function __construct()
    {
        $this->createdAt = new \DateTime();
        
    }
    
    
    /**
     * @var \Arquematics\UserBundle\Entity\User $user
     * 
     * @ORM\ManyToOne(targetEntity="Arquematics\UserBundle\Entity\User", inversedBy="wallMessages", cascade={"persist"})
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="CASCADE")
     * 
     */
    private $user;
    
    /**
     * Set user
     *
     * @param \Arquematics\UserBundle\Entity\User $createdBy
     * @return WallMessage
     */
    public function setUser(\Arquematics\UserBundle\Entity\User $createdBy = null)
    {
        $this->user = $createdBy;

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
     * @var WallMessage $wallMessage
     * 
     * @ORM\ManyToOne(targetEntity="WallMessage", inversedBy="wallEncs",  cascade={"persist"})
     * @ORM\JoinColumn(name="wall_message_id", referencedColumnName="id", nullable=true, onDelete="CASCADE")
     * 
     */
    private $wallMessage;
    
    /**
     * Set WallMessage
     *
     * @param WallMessage $wallMessage
     * @return WallLink
     */
    public function setWallMessage(WallMessage $wallMessage = null)
    {
        $this->wallMessage = $wallMessage;

        return $this;
    }

    /**
     * Get WallMessage
     *
     * @return WallMessage 
     */
    public function getWallMessage()
    {
        return $this->wallMessage;
    }
    
    public function jsonSerialize()
    {
        return [
            'id'            =>  $this->getId(),
            'createdAt'     =>  $this->getCreatedAt()->format("Y-m-d").' '.$this->getCreatedAt()->format("H:i:s")
        ];
    }

}
