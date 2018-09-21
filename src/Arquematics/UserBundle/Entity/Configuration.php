<?php

namespace Arquematics\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * Company
 *
 * @ORM\Table(name="Configuration")
 * @ORM\Entity(repositoryClass="Arquematics\UserBundle\Entity\ConfigurationRepository")
 * @UniqueEntity(fields="key", message="Configuration.unique_key")
 */
class Configuration
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
     * @var string
     *
     * @ORM\Column(name="`key`", type="string", length=255)
     */
    private $key;
    
    
    /**
     * @var \Arquematics\UserBundle\Entity\User $createdBy
     *
     * @ORM\ManyToOne(targetEntity="\Arquematics\UserBundle\Entity\User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $createdBy;
    
    /**
     * Set createdBy
     *
     * @param \Arquematics\UserBundle\Entity\User $createdBy
     * @return Configuration
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
     * @param string $data
     * @return Company
     */
    public function setKey($data)
    {
        $this->key = $data;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getKey()
    {
        return $this->key;
    }
    
    /**
     * @var blob
     *
     * @ORM\Column(name="`value`", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $value;
    
    public function getValue()
    {
        return $this->value;
    } 
    
    /**
     * Set data
     *
     * @param text $data
     * @return Company
     */
    public function setValue($data)
    {
        $this->value = $data;

        return $this;
    }
}