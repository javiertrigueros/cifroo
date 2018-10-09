<?php

namespace Arquematics\WallBundle\Entity;



use Arquematics\WallBundle\Entity\WallMessage;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

/**
 * Class WallLink
 *
 * @ORM\Table(name="WallLink")
 * @ORM\Entity
 */
class WallLink implements JsonSerializable
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
     * @var \Arquematics\UserBundle\Entity\User $createdBy
     * 
     * @ORM\ManyToOne(targetEntity="Arquematics\UserBundle\Entity\User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="CASCADE")
     * 
     */
    private $createdBy;
    
    
    
    
    
    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $description;
    
    
    /**
     * @var string
     *
     * @ORM\Column(name="oembed", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $oembed;
    
    /**
     * @var string
     *
     * @ORM\Column(name="title", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $title;
    
    /**
     * @var string
     *
     * @ORM\Column(name="thumb", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $thumb;
    
     /**
     * @var string
     *
     * @ORM\Column(name="url", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $url;
    
     /**
     * @var string
     *
     * @ORM\Column(name="urlquery", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $urlquery;
    
    /**
     * @var string
     *
     * @ORM\Column(name="provider", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $provider;
    
    /**
     * @var string
     *
     * @ORM\Column(name="oembedtype", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $oembedtype;
    
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
     * @return WallMessage
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
     * Set createdBy
     *
     * @param \Arquematics\UserBundle\Entity\User $createdBy
     * @return WallMessage
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
     * @var DirectMessage $directMessage
     * 
     * @ORM\ManyToOne(targetEntity="DirectMessage", inversedBy="wallLinks")
     * @ORM\JoinColumn(name="direct_message_id", referencedColumnName="id", nullable=true, onDelete="CASCADE")
     * 
     */
    private $directMessage;
    
    public function setDirectMessage($directMessage = null)
    {
        $this->directMessage = $directMessage;

        return $this;
    }

    /**
     * Get WallMessage
     *
     * @return WallMessage 
     */
    public function getDirectMessage()
    {
        return $this->directMessage;
    }
    
    /**
     * @var WallMessage $wallMessage
     * 
     * @ORM\ManyToOne(targetEntity="WallMessage", inversedBy="wallLinks")
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
    
    
    public function getDescription()
    {
        return $this->description;
    } 
    
    /**
     * Set content data
     *
     * @param text $data
     * @return WallLink
     */
    public function setDescription($data)
    {
        $this->description = $data;

        return $this;
    }
    
    
    
    public function getOembed()
    {
        return $this->oembed;
    } 
    
    /**
     * Set content data
     *
     * @param text $data
     * @return WallLink
     */
    public function setOembed($data)
    {
        $this->oembed = $data;
        return $this;
    }
    
    
    
    
    public function getTitle()
    {
        return $this->title;
    } 
    
    /**
     * Set content data
     *
     * @param text $data
     * @return WallLink
     */
    public function setTitle($data)
    {
        $this->title = $data;
        return $this;
    }
    
    
    
    
    public function getThumb()
    {
        return $this->thumb;
    } 
    
    /**
     * Set content data
     *
     * @param text $data
     * @return WallLink
     */
    public function setThumb($data)
    {
        $this->thumb = $data;
        return $this;
    }
    
    
    
    
    public function getProvider()
    {
        return $this->provider;
    } 
    
    /**
     * Set content data
     *
     * @param text $data
     * @return WallLink
     */
    public function setProvider($data)
    {
        $this->provider = $data;
        return $this;
    }
    
   
    public function getUrlquery()
    {
        return $this->urlquery;
    } 
    
    public function setUrlquery($data)
    {
        $this->urlquery = $data;
        return $this;
    }
    
    public function getUrl()
    {
        return $this->url;
    } 
    
    /**
     * Set content data
     *
     * @param text $data
     * @return WallLink
     */
    public function setUrl($data)
    {
        $this->url = $data;
        return $this;
    }
    
    

    public function getOembedtype()
    {
        return $this->oembedtype;
    } 
    
    /**
     * Set content data
     *
     * @param text $data
     * @return WallLink
     */
    public function setOembedtype($data)
    {
        $this->oembedtype = $data;
        return $this;
    }
    
    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Arquematics\WallBundle\Entity\WallLinkEnc", mappedBy="wallLink")
     */
    protected $linkEncs;
    
    
    public function addLinkEnc($linkEnc)
    {
        $this->linkEncs[] = $linkEnc;

        return $this;
    }

    public function removeLinkEnc($linkEnc)
    {
        $this->linkEncs->removeElement($linkEnc);
    }

    /**
     * Get wallLinks
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getLinkEncs()
    {
        return $this->linkEncs;
    }
    
    /**
     * 
     * @param \Doctrine\Common\Collections\ArrayCollection $wallEncs
     * @return $this
     */
    public function setLinkEncs(\Doctrine\Common\Collections\ArrayCollection $linkEncs)
    {
        $this->linkEncs = $linkEncs;
         
        return $this;
    }
    
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->createdAt = new \DateTime();
        
        $this->linkEncs = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    public function jsonSerialize()
    {
        return [
            'id'            =>  $this->getId(),
            'createdAt'     =>  $this->getCreatedAt()->format("Y-m-d").' '.$this->getCreatedAt()->format("H:i:s"),
            'createdBy'     =>  $this->getCreatedBy()->getId(),
            'description'   =>  $this->getDescription(),
            'oembed'        =>  $this->getOembed(),
            'title'         =>  $this->getTitle(),
            'thumb'         =>  $this->getThumb(),
            'url'           =>  $this->getUrl(),
            'provider'      =>  $this->getProvider(),
            'oembedtype'    =>  $this->getOembedtype()
        ];
    }

}
