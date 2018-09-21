<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * Class WallTag
 *
 * @ORM\Table(name="WallTag")
 * @ORM\Entity(repositoryClass="Arquematics\WallBundle\Entity\WallTagRepository")
 * @UniqueEntity("hash")
 */
class WallTag implements JsonSerializable
{

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;
    
    //mirar https://stackoverflow.com/questions/8545561/unique-constraints-in-doctrine-2-symfony-2
    //@ORM\UniqueConstraint(name="search_idx", columns={"name", "email"})})
    
    /**
     * @var \DateTime
     *
     * @ORM\Column(name="createdAt", type="datetime")
     */
    private $createdAt;
    
    /**
     * @var string
     *
     * @ORM\Column(name="name", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $name;
    
    /**
     * @var string
     *
     * @ORM\Column(name="hash", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $hash;
    
    
    /**
     * @var string
     *
     * @ORM\Column(name="hash_small", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $hashSmall;
    
    
    /**
     * @var \Doctrine\Common\Collections\Collection|UserRole[]
     *
     * @ORM\ManyToMany(targetEntity="WallMessage", inversedBy="tags")
     * @ORM\JoinTable(
     *  name="WallTag_WallMessage",
     *  joinColumns={
     *      @ORM\JoinColumn(name="tag_id", referencedColumnName="id")
     *  },
     *  inverseJoinColumns={
     *      @ORM\JoinColumn(name="message_id", referencedColumnName="id",onDelete="CASCADE")
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
    
    public function getHashSmall()
    {
        return $this->hashSmall;
    } 
    
    /**
     * Set content data
     *
     * @param text $data
     * @return WallTag
     */
    public function setHashSmall($data)
    {
        $this->hashSmall = $data;
        return $this;
    }
    
    
    public function getHash()
    {
        return $this->hash;
    } 
    
    /**
     * Set content data
     *
     * @param text $data
     * @return WallTag
     */
    public function setHash($data)
    {
        $this->hash = $data;
        return $this;
    }
    
    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Arquematics\WallBundle\Entity\WallTagEnc", mappedBy="wallTag")
     */
    protected $tagEncs;
    
    
    public function addTagEnc($tagEnc)
    {
        $this->tagEncs[] = $tagEnc;

        return $this;
    }

    public function removeTagEnc($tagEnc)
    {
        $this->tagEncs->removeElement($tagEnc);
    }

    /**
     * Get wallLinks
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getTagEncs()
    {
        return $this->tagEncs;
    }
    
    /**
     * 
     * @param \Doctrine\Common\Collections\ArrayCollection $tagEncs
     * @return $this
     */
    public function setTagEncs(\Doctrine\Common\Collections\ArrayCollection $tagEncs)
    {
        $this->tagEncs = $tagEncs;
         
        return $this;
    }
   
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->messages = new \Doctrine\Common\Collections\ArrayCollection();
        $this->tagEncs = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    public function jsonSerialize()
    {
        return [
            'id'            =>  $this->getId(),
            'createdAt'     =>  $this->getCreatedAt()->format("Y-m-d").' '.$this->getCreatedAt()->format("H:i:s"),
            //'createdAt'     =>  $this->getCreatedAt()->getTimestamp(),
            'name'          =>  $this->getName(),
            'hash'          =>  $this->getHash(),
            'hashSmall'     =>  $this->getHashSmall()
        ];
    }

}
