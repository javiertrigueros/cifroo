<?php

namespace Arquematics\WallBundle\Entity;


use Arquematics\WallBundle\Utils\ARMimeTypes;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

/**
 *
 * @ORM\Table(name="ArFilePreview")
 * @ORM\Entity(repositoryClass="Arquematics\WallBundle\Entity\ArFilePreviewRepository")
 */
class ArFilePreview implements JsonSerializable
{
    const BIG = 'big';
    const NORMAL = 'normal';
    const SMALL = 'small';
    const MINI = 'mini';
    
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
    * @var integer
    *
    * @ORM\Column(name="size", type="integer")
    */
    private $size;
    
    public function getSize()
    {
        return $this->size;
    }

    public function setSize($size)
    {
        $this->size = $size;
        return $this;
    }
    
    
    /**
    * @var string
    *
    * @ORM\Column(name="guid", type="string", length=255)
    */
    private $guid;
    
    public function getGuid()
    {
        return $this->guid;
    } 
    
    public function setGuid($data)
    {
        $this->guid = $data;

        return $this;
    }
    
    
     /**
    * @var string
    *
    * @ORM\Column(name="style", type="string", length=255)
    */
    private $style;
    
    public function getStyle()
    {
        return $this->style;
    } 
    
    public function setStyle($data)
    {
        $this->style = $data;

        return $this;
    }

    /**
    * @var string
    *
    * @ORM\Column(name="src", type="text", columnDefinition="LONGTEXT", nullable=true)
    */
    private $src;
    
    public function getSrc()
    {
        return $this->src;
    } 
    
    /**
     * 
     * @param type $data
     * @return $this
     */
    public function setSrc($data)
    {
        $this->src = $data;
        return $this;
    }
    
    /**
    * @var string
    *
    * @ORM\Column(name="doc_type", type="string", length=255, nullable=true)
    */
    private $docType;
    
    public function getDocType()
    {
        return $this->docType;
    } 
    
    /**
     * 
     * @param type $data
     * @return $this
     */
    public function setDocType($data)
    {
        $this->docType = $data;

        return $this;
    }
    
    /**
     * 
     * @ORM\ManyToOne(targetEntity="ArFile")
     * @ORM\JoinColumn(name="file_id", referencedColumnName="id", onDelete="CASCADE")
     * 
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
     * 
     * @ORM\OneToMany(targetEntity="\Arquematics\WallBundle\Entity\ArFilePreviewChunk", mappedBy="arFile")
     * 
     */
    private $arFilePreviewChunks;
    
    public function addArFilePreviewChunk($fileChunk)
    {
        $this->arFilePreviewChunks[] = $fileChunk;

        return $this;
    }

    public function removeArFilePreviewChunk($fileChunk)
    {
        $this->arFilePreviewChunks->removeElement($fileChunk);
    }

    /**
     * Get comments
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getArFilePreviewChunks()
    {
        return $this->arFilePreviewChunks;
    }
    
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->arFilePreviewChunks = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    public function jsonSerialize()
    {
       $arFile = $this->getArFile();
       return [
            'id'            =>  $this->getId(),
            'name'          =>  $arFile ->getName(),
            'preview'       =>  ARMimeTypes::hasPreview($this->getDocType()),
            'icon'          =>  ARMimeTypes::toExtension($this->getDocType()),
            'doctype'       =>  $this->getDocType(),
            'style'         =>  $this->getStyle()
        ];
    }

}
