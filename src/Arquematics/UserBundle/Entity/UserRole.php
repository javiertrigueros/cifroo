<?php

namespace Arquematics\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * UserRole
 *
 * @ORM\Table(name="UserRole")
 * @ORM\Entity(repositoryClass="Arquematics\UserBundle\Entity\UserRoleRepository")
 * @UniqueEntity(
 *     fields={"name"},
 *     errorPath="name",
 *     message="UserRole.name_unique_error"
 * )
 */
class UserRole
{
    const ROLE_CONFIG = 1;
    
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
    * @Assert\Length(min = 3, max = 40, minMessage = "UserRole.name_min_error")
    */
    private $name;


    /**
     * @var boolean
     *
     * @ORM\Column(name="deletable", type="boolean")
     */
    private $deletable = true;

    /**
     * @var boolean
     *
     * @ORM\Column(name="active", type="boolean")
     */
    private $active = true;
    
   
    /**
     * @var \Doctrine\Common\Collections\Collection|User[]
     *
     * @ORM\ManyToMany(targetEntity="User", mappedBy="userRoles")
     * @ORM\JoinTable(name="user_userroles")
     */
    protected $users;

    

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
     * @return UserRole
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
     * Set deletable
     *
     * @param boolean $deletable
     * @return UserRole
     */
    public function setDeletable($deletable)
    {
        $this->deletable = $deletable;

        return $this;
    }

    /**
     * Get deletable
     *
     * @return boolean 
     */
    public function getDeletable()
    {
        return $this->deletable;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->users = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add users
     *
     * @param \Arquematics\UserBundle\Entity\User $users
     * @return UserRole
     */
    public function addUser(\Arquematics\UserBundle\Entity\User $users)
    {
        $this->users[] = $users;

        return $this;
    }

    /**
     * Remove users
     *
     * @param \Arquematics\UserBundle\Entity\User $users
     */
    public function removeUser(\Arquematics\UserBundle\Entity\User $users)
    {
        $this->users->removeElement($users);
    }

    /**
     * Get users
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getUsers()
    {
        return $this->users;
    }
    
    public function __toString(){
        return $this->getName();
    }


    /**
     * Set active
     *
     * @param boolean $active
     * @return UserRole
     */
    public function setActive($active)
    {
        $this->active = $active;

        return $this;
    }

    /**
     * Get active
     *
     * @return boolean 
     */
    public function getActive()
    {
        return $this->active;
    }
}
