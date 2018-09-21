<?php

namespace Arquematics\WallBundle\Entity;

use Arquematics\WallBundle\Utils\ARMimeTypes;

use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

/**
 * Class WallMessage
 *
 * @ORM\Table(name="ArFileRollApp")
 * @ORM\Entity(repositoryClass="Arquematics\WallBundle\Entity\ArFileRollAppRepository")
 * @UniqueEntity(
 *     fields={"guid"}
 * )
 */
class ArFileRollApp implements JsonSerializable
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
     * @ORM\ManyToOne(targetEntity="\Arquematics\WallBundle\Entity\ArFile", inversedBy="fileRollSessions")
     * @ORM\JoinColumn(name="file_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $arFile;
    
    public function setArFile($arFile)
    {
        $this->arFile = $arFile;

        return $this;
    }

    public function getArFile()
    {
        return $this->arFile;
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
    * @var string
    *
    * @ORM\Column(name="access_token", type="string", length=255, nullable=true)
    */
    private $accessToken;
    
    public function getAccessToken()
    {
        return $this->accessToken;
    } 
    
    /**
     * 
     * @param type $data
     * @return $this
     */
    public function setAccessToken($data)
    {
        $this->accessToken = $data;

        return $this;
    }
    
    /**
    * @ORM\Column(name="ready",type="boolean", length=1)
    */
    private $ready = false;

    public function setReady($ready)
    {
        $this->ready = $ready;

        return $this;
    }

    public function getReady()
    {
        return $this->ready;
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
            'guid'          =>  $this->getGuid(),
            'createdAt'     =>  $this->getCreatedAt()->format("Y-m-d").' '.$this->getCreatedAt()->format("H:i:s")
        ];
    }
}
