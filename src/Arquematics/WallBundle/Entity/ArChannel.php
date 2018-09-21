<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

use JsonSerializable;

use Gedmo\Mapping\Annotation as Gedmo;

/**
 * Project
 *
 * @ORM\Table(name="ArChannel")
 * @ORM\Entity(repositoryClass="Arquematics\WallBundle\Entity\ArChannelRepository")
 * @UniqueEntity(
 *     fields={"name"},
 *     errorPath="name",
 *     message="ArChannel.name_unique_error"
 * )
 */
class ArChannel implements JsonSerializable
{
    const GENERAL = 1;
    
    public function canDelete()
    {
        return ($this->getId() !== ArChannel::GENERAL);
    }
    
    /**
    * @ORM\Column(type="boolean", length=1)
    */
    private $open = true;
    /**
     * Set status
     *
     * @param integer $status
     * @return Project
     */
    public function setOpen($status)
    {
        $this->open = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return integer 
     */
    public function getOpen()
    {
        return $this->open;
    }
    
    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="WallMessage", inversedBy="channels", cascade={"persist"})
     * @ORM\JoinTable(
     *  name="ArChannel_WallMessage",
     *  joinColumns={
     *      @ORM\JoinColumn(name="channel_id", referencedColumnName="id")
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
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

  
    /**
    * @var string $name
    *
    * @ORM\Column(name="name", type="string", length=255, unique=true)
    * @Assert\NotNull()
    * @Assert\Length(min = 3, max = 30, minMessage = "ArChannel.name_min_error")
    */
    private $name;
    
    /**
     * Set id
     * 
     * @param int $id
     * @return Project
     */
    public function setId($id)
    {
        $this->id = $id;
        
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
     * Set name
     *
     * @param string $name
     * @return Project
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }
    
    /**
    * @var string
    * 
    * @Gedmo\Slug(fields={"name"}, separator="-", updatable=true)
    * @ORM\Column(name="slug", type="string", length=255, unique=true)
    */
    private $slug;
    
    /**
     * Set slug
     *
     * @param string $name
     */
    public function setSlug($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * Get slug
     *
     * @return string 
     */
    public function getSlug()
    {
        return $this->slug;
    }


    public function __toString(){
        return $this->getName();
    }
    
    public function __construct()
    {
        $this->messages = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    public function jsonSerialize()
    {
        return [
            'id'      =>  $this->getId(),
            'name'    =>  $this->getName(),
            'open'    =>  $this->getOpen(),
            'slug'    =>  $this->getSlug(),
        ];
    }
}
