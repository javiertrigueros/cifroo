<?php

namespace Arquematics\WallBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

/**
 * Class WallMessage
 *
 * @ORM\Table(name="ArFilePreviewChunk")
 * @ORM\Entity(repositoryClass="Arquematics\WallBundle\Entity\ArFilePreviewChunkRepository")
 */
class ArFilePreviewChunk implements JsonSerializable
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
    * @var integer
    *
    * @ORM\Column(name="pos", type="integer")
    */
    private $pos;
    
    public function getPos()
    {
        return $this->pos;
    }

    public function setPos($pos)
    {
        $this->pos = $pos;
        return $this;
    }
    /**
    * @var string
    *
    * @ORM\Column(name="chunk_data", type="text", columnDefinition="LONGTEXT", nullable=true)
    */
    private $chunkData;
    
    public function getChunkData()
    {
        return $this->chunkData;
    } 
    
    /**
     * 
     * @param type $data
     * @return $this
     */
    public function setChunkData($data)
    {
        $this->chunkData = $data;
        return $this;
    }
    
    /**
     * @ORM\ManyToOne(targetEntity="\Arquematics\WallBundle\Entity\ArFilePreview", inversedBy="arFilePreviewChunks")
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
     * Constructor
     */
    public function __construct()
    {
        
    }
    
    public function jsonSerialize()
    {
       return [
            'id'            =>  $this->getId()
        ];
    }

}
