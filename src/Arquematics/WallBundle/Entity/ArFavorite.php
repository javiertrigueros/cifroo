<?php

namespace Arquematics\WallBundle\Entity;

use Arquematics\WallBundle\Utils\ARMimeTypes;

use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

/**
 * Class WallMessage
 *
 * @ORM\Table(name="ArFavorite")
 * @ORM\Entity(repositoryClass="Arquematics\WallBundle\Entity\ArFavoriteRepository")
 */
class ArFavorite implements JsonSerializable
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
     * set id
     * 
     * @param type $id
     * @return $this
     */
    public function setGetId($id)
    {
        $this->id = $id;
        return $this;
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
     * @var \Arquematics\UserBundle\Entity\ArFile $arFile
     * 
     * @ORM\ManyToOne(targetEntity="Arquematics\WallBundle\Entity\ArFile", inversedBy="arFavorites")
     * @ORM\JoinColumn(name="file_id", referencedColumnName="id", onDelete="CASCADE")
     * 
     */
    private $arFile;
    
    /**
     * Set file
     *
     * @param \Arquematics\UserBundle\Entity\ArFile $file
     * @return ArFavorite
     */
    public function setArFile( $file = null)
    {
        $this->arFile = $file;

        return $this;
    }

    /**
     * Get file
     *
     * @return Arquematics\WallBundle\Entity\ArFile 
     */
    public function getArFile()
    {
        return $this->arFile;
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
            'created'     =>  $this->getCreatedAt()->format("Y-m-d").' '.$this->getCreatedAt()->format("H:i:s")
        ];
    }
    
    
}
