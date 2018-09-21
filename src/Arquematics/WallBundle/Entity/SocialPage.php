<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

use JsonSerializable;

/**
 * Class WallTag
 *
 * @ORM\Table(name="SocialPage")
 * @ORM\Entity(repositoryClass="Arquematics\WallBundle\Entity\SocialPageRepository")
 */
class SocialPage implements JsonSerializable
{
    const TWITTER = 1;
    const FACEBOOK = 2;
    const LINKEDIN = 3;
   
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
     * @var string
     *
     * @ORM\Column(name="identification", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $identification;
    
    /**
    * @ORM\Column(name="social_type", type="integer")
    */
    private $socialType;
    
    /**
     * @ORM\Column(name="selected", type="boolean")
     */
    protected $selected = false;
    
    public function setSelected($selected) 
    {
        $this->selected = $selected;

        return $this;
    }

    public function getSelected() {
        return $this->selected;
    }
    

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
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }
    
    
    public function getIdentification()
    {
        return $this->identification;
    } 
    
    /**
     * Set content data
     *
     * @param text $data
     * @return WallTag
     */
    public function setIdentification($data)
    {
        $this->identification = $data;

        return $this;
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
    }
    
    /**
     * @var \Arquematics\UserBundle\Entity\User $createdBy
     * 
     * @ORM\ManyToOne(targetEntity="Arquematics\UserBundle\Entity\User", inversedBy="socialPages")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=FALSE)
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
    
    
    public function jsonSerialize()
    {
        return [
            'id'            =>  $this->getId(),
            'name'          =>  $this->getName(),
            'identification'=>  $this->getIdentification(),
            'selected'      =>  $this->getSelected(),
            'socialType'    =>  $this->getSocialType()
        ];
    }
    
    

}
