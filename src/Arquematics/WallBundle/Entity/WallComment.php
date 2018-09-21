<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

use JsonSerializable;
/**
 * Class WallComment
 *
 * @ORM\Table(name="WallComment", options={"collate":"utf8mb4_unicode_ci", "charset":"utf8mb4", "engine":"INNODB"})
 * @ORM\Entity
 */
class WallComment implements JsonSerializable
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
     * @var \Arquematics\UserBundle\Entity\User $createdBy
     * 
     * @ORM\ManyToOne(targetEntity="Arquematics\UserBundle\Entity\User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="CASCADE")
     * 
     */
    private $createdBy;
    
    /**
     * Set createdBy
     *
     * @param \Arquematics\UserBundle\Entity\User $createdBy
     * @return Document
     */
    public function setCreatedBy(\Arquematics\UserBundle\Entity\User $createdBy = null)
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    /**
     * Get createdBy
     *
     * @return \Arquematics\UserBundle\Entity\User 
     */
    public function getCreatedBy()
    {
        return $this->createdBy;
    }
    
    
     /**
     * @ORM\ManyToOne(targetEntity="\Arquematics\WallBundle\Entity\WallMessage", inversedBy="comments")
     * @ORM\JoinColumn(name="message_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $message;
    
    /**
     * Set message
     *
     * @param \Arquematics\WallBundle\Entity\WallMessage $message
     * @return WallComment
     */
    public function setMessage(\Arquematics\WallBundle\Entity\WallMessage $message)
    {
        $this->message = $message;

        return $this;
    }

    /**
     * Get message
     *
     * @return \Arquematics\WallBundle\Entity\WallMessage 
     */
    public function getMessage()
    {
        return $this->message;
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
    
    public function canDelete($user)
    {
        return ($this->getCreatedBy()->getId() == $user->getId())
              || ($this->getMessage()->getCreatedBy()->getId() == $user->getId())
        ;
    }
    
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->commentEncs = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    
    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Arquematics\WallBundle\Entity\WallCommentEnc", mappedBy="comment")
     */
    protected $commentEncs;
    
    
    public function addCommentEnc($commentEnc)
    {
        $this->commentEncs[] = $commentEnc;

        return $this;
    }

    public function removeCommentEnc($commentEnc)
    {
        $this->commentEncs->removeElement($commentEnc);
    }

    /**
     * Get wallLinks
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getCommentEncs()
    {
        return $this->commentEncs;
    }
    
    /**
     * 
     * @param \Doctrine\Common\Collections\ArrayCollection $wallEncs
     * @return $this
     */
    public function setCommentEncs(\Doctrine\Common\Collections\ArrayCollection $commentEncs)
    {
        $this->commentEncs = $commentEncs;
         
        return $this;
    }
    
    
    public function jsonSerialize()
    {
        $userProfile = $this->getCreatedBy()->getProfile();
        
        return [
            'id'            =>  $this->getId(),
            'createdAt'     =>  $this->getCreatedAt()->format("Y-m-d").' '.$this->getCreatedAt()->format("H:i:s"),
            //'createdAt'     =>  $this->getCreatedAt()->getTimestamp() * 1000,
            'user'          => [
                                'id'   => $userProfile->getId(),
                                'name' => $userProfile->getName(). ' '. $userProfile->getLastName(),
                                'image' => $userProfile->getImage(), 
                            ],
            'content'       =>  $this->getContent()
        ];
    }
    

}
