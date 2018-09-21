<?php

namespace Arquematics\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Arquematics\BackendBundle\Utils\ARUtil;
use Misd\PhoneNumberBundle\Validator\Constraints\PhoneNumber as AssertPhoneNumber;

use Symfony\Component\Validator\Constraints as Assert;

use Symfony\Component\Validator\ExecutionContextInterface;
/**
 * CUser
 *
 * @ORM\Table(name="Profile")
 * @ORM\Entity()
 */
class Profile
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $id;

    /**
     * @var \Arquematics\UserBundle\Entity\User $user
     *
     * @ORM\OneToOne(targetEntity="\Arquematics\UserBundle\Entity\User", inversedBy="profile", cascade={"persist"})
     * @ORM\JoinColumn(name="id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $user;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="lastname", type="string", length=255)
     */
    private $lastname;
    /**
     * @var string
     *
     * @ORM\Column(name="area", type="string", length=255, nullable=true)
     */
    private $area;

    /**
     * @var string
     *
     * @ORM\Column(name="cargo", type="string", length=255, nullable=true)
     */
    private $cargo;

    /**
     * @var string
     *
     * @AssertPhoneNumber(defaultRegion="ES")
     * @ORM\Column(type="phone_number", nullable=true)
     */
    private $phones;

    /**
     * @var string
     *
     * @ORM\Column(name="departament", type="string", length=255, nullable=true)
     */
    private $departament;

    /**
     * @var string
     *
     * @ORM\Column(name="extension", type="string", length=255, nullable=true)
     */
    private $extension;

    /**
     * @var string
     *
     * @ORM\Column(name="image", type="string", length=255, nullable=true)
     */
    private $image;

    /**
     * @ORM\ManyToOne(targetEntity="\Arquematics\UserBundle\Entity\User")
     * @ORM\JoinColumn(name="responsable_id", referencedColumnName="id")
     */
    private $responsable;

    /**
    * @ORM\Column(type="boolean", length=1)
    */
    private $notify = true;

    /**
     * Set status
     *
     * @param integer $status
     * @return Profile
     */
    public function setNotify($status)
    {
        $this->notify = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return integer 
     */
    public function getNotify()
    {
        return $this->notify;
    }
    /**
     * @var string
     *
     * @ORM\Column(name="mimetype", type="string", length=255, nullable=true)
     */
    private $mimeType;
    
    /**
     * Set MimeType
     *
     * @param string $mimeType
     * @return Company
     */
    public function setMimeType($mimeType)
    {
        $this->mimeType = $mimeType;

        return $this;
    }

    /**
     * Get MimeType
     *
     * @return string 
     */
    public function getMimeType()
    {
        return $this->mimeType;
    }
    
    
    /**
     * @var blob
     *
     * @ORM\Column(name="imageData", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $imageData;
    
    
    public function getImageData()
    {
        return $this->imageData;
    } 
    
    /**
     * Set data
     *
     * @param text $data
     * @return Company
     */
    public function setImageData($data)
    {
        $this->imageData = $data;

        return $this;
    }
    


    /**
     * Set id
     *
     * @param integer $id
     */
    public function setId($id)
    {
        $this->id = $id;
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
     * 
     * @param type $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * 
     * @return type
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Profile
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
    
    public function getNameTruncate()
    {
        return ARUtil::truncate($this->name, 7); 
    }
    
    public function isTruncateNameAndLast()
    {
       return (strlen($this->name.' '.$this->lastname) > 24); 
    }
    
    public function getTruncateNameAndLast()
    {
       return ARUtil::truncate($this->name.' '.$this->lastname, 24); 
    }
    
    public function getTruncateNameAndLastU()
    {
       return ARUtil::truncate(ucfirst($this->name).' '.ucfirst($this->lastname), 24); 
    }
    
    public function getNameAndLastU()
    {
        
        return ucfirst($this->name).' '.ucfirst($this->lastname);
    }
    
    public function getNameAndLast()
    {
        return $this->name.' '.$this->lastname;
    }
    /**
     * Set lastname
     *
     * @param string $lastname
     * @return Profile
     */
    public function setLastname($lastname)
    {
        $this->lastname = $lastname;

        return $this;
    }

    /**
     * Get lastname
     *
     * @return string
     */
    public function getLastname()
    {
        return $this->lastname;
    }
    
    public function getLastnameTruncate()
    {
        return ARUtil::truncate($this->lastname, 5); 
    }
    
    

    public function __toString(){
        return $this->getName() . " " . $this->getLastname();
    }


    /**
     * Set responsable
     *
     * @param \Arquematics\UserBundle\Entity\User $ce
     * @return Profile
     */
    public function setResponsable(\Arquematics\UserBundle\Entity\User $responsable = null)
    {
        $this->responsable = $responsable;

        return $this;
    }

    /**
     * Get responsable
     *
     * @return \Arquematics\UserBundle\Entity\User
     */
    public function getResponsable()
    {
        return $this->responsable;
    }

    


    /**
     * Set area
     *
     * @param string $area
     * @return Profile
     */
    public function setArea($area)
    {
        $this->area = $area;

        return $this;
    }

    /**
     * Get area
     *
     * @return string 
     */
    public function getArea()
    {
        return $this->area;
    }

    /**
     * Set cargo
     *
     * @param string $cargo
     * @return Profile
     */
    public function setCargo($cargo)
    {
        $this->cargo = $cargo;

        return $this;
    }

    /**
     * Get cargo
     *
     * @return string 
     */
    public function getCargo()
    {
        return $this->cargo;
    }

    /**
     * Set phones
     *
     * @param string $phones
     * @return Profile
     */
    public function setPhones($phones)
    {
        $this->phones = $phones;

        return $this;
    }

    /**
     * Get phones
     *
     * @return string 
     */
    public function getPhones()
    {
        return $this->phones;
    }

    /**
     * Set departament
     *
     * @param string $departament
     * @return Profile
     */
    public function setDepartament($departament)
    {
        $this->departament = $departament;

        return $this;
    }

    /**
     * Get departament
     *
     * @return string 
     */
    public function getDepartament()
    {
        return $this->departament;
    }

    /**
     * Set extension
     *
     * @param string $extension
     * @return Profile
     */
    public function setExtension($extension)
    {
        $this->extension = $extension;

        return $this;
    }

    /**
     * Get extension
     *
     * @return string
     */
    public function getExtension()
    {
        return $this->extension;
    }

    /**
     * Set image
     *
     * @param string $image
     * @return Profile
     */
    public function setImage($image)
    {
        $this->image = $image;

        return $this;
    }

    /**
     * Get image
     *
     * @return string
     */
    public function getImage()
    {
        return $this->image;
    }
 
}
