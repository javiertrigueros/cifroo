<?php

namespace Arquematics\WallBundle\Entity;

use Arquematics\WallBundle\Utils\ARMimeTypes;
use Arquematics\WallBundle\Utils\ARUtil;

use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

/**
 * Class WallMessage
 *
 * @ORM\Table(name="ArFile")
 * @ORM\Entity(repositoryClass="Arquematics\WallBundle\Entity\ArFileRepository")
 * @UniqueEntity(
 *     fields={"guid"}
 * )
 */
class ArFile implements JsonSerializable
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
     * @ORM\Column(name="name", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $name;
    
    public function getName()
    {
        return $this->name;
    } 
    
    /**
     * 
     * @param type $data
     * @return $this
     */
    public function setName($data)
    {
        $this->name = $data;

        return $this;
    }
    
    /**
     * @var string
     *
     * @ORM\Column(name="hash", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $hash;
    
    public function getHash()
    {
        return $this->hash;
    } 
    
    /**
     * 
     * @param type $data
     * @return $this
     */
    public function setHash($data)
    {
        $this->hash = $data;

        return $this;
    }
    
    /**
     * @var string
     *
     * @ORM\Column(name="hash_small", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $hashSmall;
    
    public function getHashSmall()
    {
        return $this->hashSmall;
    } 
    
    /**
     * 
     * @param type $data
     * @return $this
     */
    public function setHashSmall($data)
    {
        $this->hashSmall = $data;

        return $this;
    }
    
    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Arquematics\WallBundle\Entity\ArFileRollApp", mappedBy="arFile")
     */
    protected $fileRollSessions;
    
    
    public function addFileRollSession($file)
    {
        $this->fileRollSessions[] = $file;

        return $this;
    }

    public function removeFileRollSession($file)
    {
        $this->fileRollSessions->removeElement($file);
    }

    public function getFileRollSessions()
    {
        return $this->fileRollSessions;
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
    * @var string
    *
    * @ORM\Column(name="group_type", type="string", length=255, nullable=false)
    */
    private $groupType;
    
    public function getGroupType()
    {
        return $this->groupType;
    } 
    /**
     * 
     * @param type $data
     * @return $this
     */
    public function setGroupType($data)
    {
        $this->groupType = $data;

        return $this;
    }
    
    /**
    * @ORM\Column(name="trash",type="boolean", length=1)
    */
    private $trash = false;
    
    /**
     * 
     * @param type $trash
     * @return $this
     */
    public function setTrash($trash)
    {
        $this->trash = $trash;

        return $this;
    }
    
    /**
     * 
     * @return boolean
     */
    public function getTrash()
    {
        return $this->trash;
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
     * @var DirectMessage $directMessage
     * 
     * @ORM\ManyToOne(targetEntity="DirectMessage", inversedBy="arFiles")
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
     * @ORM\ManyToOne(targetEntity="WallMessage", inversedBy="arFiles")
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
    
    /**
     * 
     * @ORM\OneToMany(targetEntity="\Arquematics\WallBundle\Entity\ArFavorite", mappedBy="arFile")
     * 
     */
    private $arFavorites;
     /**
     * Add comment
     *
     * @param \Arquematics\WallBundle\Entity\ArFileChunk $fileChunk
     * @return Comment
     */
    public function addFavorite($fav)
    {
        $this->arFavorites[] = $fav;

        return $this;
    }

    /**
     * Remove comment
     *
     * @param \Arquematics\WallBundle\Entity\ArFileChunk $fileChunk
     */
    public function removeFavorite($fav)
    {
        $this->arFavorites->removeElement($fav);
    }

    /**
     * Get comments
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getFavorites()
    {
        return $this->arFavorites;
    }
    
    public function setFavorites($favs)
    {
        $this->arFavorites = $favs;
        return $this;
    }
    
    /**
     * 
     * @ORM\OneToMany(targetEntity="\Arquematics\WallBundle\Entity\ArFileChunk", mappedBy="arFile")
     * 
     */
    private $arFileChunks;
    
    /**
     * Add comment
     *
     * @param \Arquematics\WallBundle\Entity\ArFileChunk $fileChunk
     * @return Comment
     */
    public function addArFileChunk($fileChunk)
    {
        $this->arFileChunks[] = $fileChunk;

        return $this;
    }

    /**
     * Remove comment
     *
     * @param \Arquematics\WallBundle\Entity\ArFileChunk $fileChunk
     */
    public function removeArFileChunk($fileChunk)
    {
        $this->arFileChunks->removeElement($fileChunk);
    }

    /**
     * Get comments
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getArFileChunks()
    {
        return $this->arFileChunks;
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
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Arquematics\WallBundle\Entity\ArFileEnc", mappedBy="arFile")
     */
    protected $arFileEncs;
    
    
    public function addArFileEncs($arFileEnc)
    {
        $this->arFileEncs[] = $arFileEnc;

        return $this;
    }

    public function removeArFileEncs($arFileEnc)
    {
        $this->arFileEncs->removeElement($arFileEnc);
    }

    /**
     * Get wallLinks
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getArFileEncs()
    {
        return $this->arFileEncs;
    }
    
    /**
     * 
     * @param \Doctrine\Common\Collections\ArrayCollection $wallEncs
     * @return $this
     */
    public function setArFileEncs(\Doctrine\Common\Collections\ArrayCollection $wallEncs)
    {
        $this->arFileEncs = $wallEncs;
         
        return $this;
    }
    
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->createdAt = new \DateTime();
        
        $this->arFileEncs = new \Doctrine\Common\Collections\ArrayCollection();
        $this->arFileChunks = new \Doctrine\Common\Collections\ArrayCollection();
        $this->fileRollSessions = new \Doctrine\Common\Collections\ArrayCollection();
        $this->arFavorites = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    public function __toString() {
        return $this->name;
    }
    
    public function jsonSerialize()
    {
       return [
            'id'            =>  $this->getId(),
            'name'          =>  $this->getName(),
            'size'          =>  ARUtil::getHumanSize($this->getSize()),
            'preview'       =>  ARMimeTypes::hasPreview($this->getDocType()),
            'previewExt'    =>  ARMimeTypes::toPreview($this->getDocType()),
            'ext'           =>  ARMimeTypes::toExtension($this->getDocType()),
            'doctype'       =>  $this->getDocType(),
            'guid'          =>  $this->getGuid(),
            'created'     =>  $this->getCreatedAt()->format("Y-m-d").' '.$this->getCreatedAt()->format("H:i:s")
        ];
    }
    
    public static $inputExt = array(
        'dxf', 'dwg', 'docx','doc', 'ppt','pptx','xls', 'xlsx', 'odt', 'ods', 'odp', 'psd'
    );
    public static $outExt = array(
        'pdf','csv', 'png', 'svg'
    );
    
    public static function isValidInputConversionExt($style)
    {
       return in_array($style, ArFile::$inputExt); 
    }
    
    public static function isValidOutputConversionExt($style)
    {
       return in_array($style, ArFile::$outExt); 
    }
}