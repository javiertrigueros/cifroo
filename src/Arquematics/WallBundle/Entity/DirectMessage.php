<?php

namespace Arquematics\WallBundle\Entity;

use Arquematics\WallBundle\Entity\WallLink;

use Doctrine\ORM\Mapping as ORM;

use JsonSerializable;
/**
 * Class DirectMessage
 *
 * @ORM\Table(name="DirectMessage", options={"collate":"utf8mb4_unicode_ci", "charset":"utf8mb4", "engine":"INNODB"})
 * @ORM\Entity(repositoryClass="Arquematics\WallBundle\Entity\DirectMessageRepository")
 */
class DirectMessage implements JsonSerializable
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
     * @var \Arquematics\UserBundle\Entity\User $sendTo
     * 
     * @ORM\ManyToOne(targetEntity="Arquematics\UserBundle\Entity\User", cascade={"persist"})
     * @ORM\JoinColumn(name="send_to_id", referencedColumnName="id", onDelete="CASCADE")
     * 
     */
    private $sendTo;
    
    /**
     * Set createdBy
     *
     * @param \Arquematics\UserBundle\Entity\User $createdBy
     * @return WallMessage
     */
    public function setSendTo(\Arquematics\UserBundle\Entity\User $createdBy = null)
    {
        $this->sendTo = $createdBy;

        return $this;
    }

    /**
     * Get createdBy
     *
     * @return \Arquematics\UserBundle\Entity\User 
     */
    public function getSendTo()
    {
        return $this->sendTo;
    }
    
    /**
     * @var \Arquematics\UserBundle\Entity\User $createdBy
     * 
     * @ORM\ManyToOne(targetEntity="Arquematics\UserBundle\Entity\User", cascade={"persist"})
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="CASCADE")
     * 
     */
    private $createdBy;
    
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
     * @var \Doctrine\Common\Collections\Collection|WallLink[]
     *
     * @ORM\OneToMany(targetEntity="Arquematics\WallBundle\Entity\WallLink", mappedBy="directMessage")
     */
    protected $wallLinks;
    
    /**
     * Add headquarter
     *
     * @param WallLink $wallLink
     * @return WallMessage
     */
    public function addWallLink(WallLink $wallLink)
    {
        $this->wallLinks[] = $wallLink;

        return $this;
    }

    /**
     * Remove wallLink
     *
     * @param WallLink $wallLink
     */
    public function removeWallLink(WallLink $wallLink)
    {
        $this->wallLinks->removeElement($wallLink);
    }

    /**
     * Get wallLinks
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getWallLinks()
    {
        return $this->wallLinks;
    }
    
    /**
     * set wallLinks
     * 
     * @param \Doctrine\Common\Collections\Collection
     * 
     * @return  WallMessage  
     */
    public function setWallLinks(\Doctrine\Common\Collections\ArrayCollection $wallLinks)
    {
        $this->wallLinks = $wallLinks;
         
        return $this;
    }
    
    /**
     * @var \Doctrine\Common\Collections\Collection|ArFile[]
     *
     * @ORM\OneToMany(targetEntity="Arquematics\WallBundle\Entity\ArFile", mappedBy="directMessage")
     */
    protected $arFiles;
    
    public function addArFile($dropFile)
    {
        $this->arFiles[] = $dropFile;

        return $this;
    }

    public function removeArFile($wallLink)
    {
        $this->arFiles->removeElement($wallLink);
    }

    /**
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getArFiles()
    {
        return $this->arFiles;
    }
    
    /**
     * 
     * @param \Doctrine\Common\Collections\Collection
     * 
     */
    public function setArFiles(\Doctrine\Common\Collections\ArrayCollection $dropFiles)
    {
        $this->arFiles = $dropFiles;
         
        return $this;
    }
    
    /**
     * @var blob
     *
     * @ORM\Column(name="send_to_pass", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $sendToPass;
    
    public function getSendToPass()
    {
        return $this->sendToPass;
    }
    
    /**
     * Set content data
     *
     * @param text $data
     * @return Company
     */
    public function setSendToPass($data)
    {
        $this->sendToPass = $data;

        return $this;
    }
    
    /**
     * @var blob
     *
     * @ORM\Column(name="user_pass", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $userPass;
    
    public function getUserPass()
    {
        return $this->userPass;
    }
    
    /**
     * Set content data
     *
     * @param text $data
     * @return Company
     */
    public function setUserPass($data)
    {
        $this->userPass = $data;

        return $this;
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
        $this->wallLinks = new \Doctrine\Common\Collections\ArrayCollection();
        $this->arFiles = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
         
    public function jsonSerialize()
    {
        //'video' 'photo' 'link' 'rich'
             
        $wallLinks = [
           'all' => [],
           'videos' => [],
           'photo' => [],
           'link' => [],
           'rich' => [],
           'files' => [],
        ];
        
        foreach ($this->wallLinks as $link) 
        {
          $wallLinks['all'][] = $link->jsonSerialize();
          if ($link->getOembedtype() == 'video')
          {
            $wallLinks['videos'][] = $link->jsonSerialize(); 
          }
          else if ($link->getOembedtype() == 'photo')
          {
            $wallLinks['photos'][] = $link->jsonSerialize();  
          }
          else if ($link->getOembedtype() == 'link')
          {
            $wallLinks['links'][] = $link->jsonSerialize(); 
          }
          else if ($link->getOembedtype() == 'rich')
          {
            $wallLinks['richs'][] = $link->jsonSerialize();   
          }
        }
        
        
        $files = array();
        foreach ($this->arFiles as $arFile) {
          $files[] = $arFile->jsonSerialize(); 
        }
       
        
        $userProfile = $this->getCreatedBy()->getProfile();
        
        return [
            'id'            =>  $this->getId(),
            'createdAt'     =>  $this->getCreatedAt()->format("Y-m-d").' '.$this->getCreatedAt()->format("H:i:s"),
            'user'          => [
                                'id'   => $userProfile->getId(),
                                'name' => $userProfile->getName(). ' '. $userProfile->getLastName(),
                                'image' => $userProfile->getImage(), 
                            ],
            'content'       =>  trim($this->getContent()),
            'wallLinks'     =>  $wallLinks,
            'files'         =>  $files
        ];
    }
    
    
}
