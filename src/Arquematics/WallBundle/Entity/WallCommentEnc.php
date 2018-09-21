<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

use JsonSerializable;
/**
 * Class WallComment
 *
 * @ORM\Table(name="WallCommentEnc", options={"collate":"utf8mb4_unicode_ci", "charset":"utf8mb4", "engine":"INNODB"})
 * @ORM\Entity(repositoryClass="Arquematics\WallBundle\Entity\WallCommentEncRepository")
 */
class WallCommentEnc implements JsonSerializable
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
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }
    
    /**
     * @var \DateTime
     *
     * @ORM\Column(name="createdAt", type="datetime")
     */
    private $createdAt;
    
    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return Folder
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
     * @ORM\ManyToOne(targetEntity="\Arquematics\WallBundle\Entity\WallComment", inversedBy="commentEncs")
     * @ORM\JoinColumn(name="comment_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $comment;
    
    public function setComment($comment)
    {
        $this->comment = $comment;

        return $this;
    }

    public function getComment()
    {
        return $this->comment;
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
     * Constructor
     */
    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }
    
    public function jsonSerialize()
    {
        return [
            'id'            =>  $this->getId(),
            'createdAt'     =>  $this->getCreatedAt()->format("Y-m-d").' '.$this->getCreatedAt()->format("H:i:s"),
            'content'       =>  $this->getContent()
        ];
    }
    

}
