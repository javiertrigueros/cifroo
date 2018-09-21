<?php

namespace Arquematics\UserBundle\Entity;

use Doctrine\ORM\Mapping\AttributeOverrides;
use Doctrine\ORM\Mapping\AttributeOverride;

use Doctrine\ORM\Mapping\AssociationOverrides;
use Doctrine\ORM\Mapping\AssociationOverride;

use Doctrine\ORM\Mapping\JoinTable;
use Doctrine\ORM\Mapping\JoinColumn;

use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\ManyToOne;

use Doctrine\Common\Collections\ArrayCollection;

use Gedmo\Mapping\Annotation as Gedmo;
use Arquematics\UserBundle\Validator\Constraints as PasswordAssert;
use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;
use Serializable;


use Doctrine\ORM\Mapping\InheritanceType;
use Symfony\Bridge\Doctrine\Validator\Constraints as DoctrineAssert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

use Symfony\Component\Security\Core\User\AdvancedUserInterface;

use Symfony\Component\Validator\Constraints as Assert;


use Arquematics\UserBundle\Entity\BaseUser;
use Arquematics\UserBundle\Entity\UserFriend;

use Arquematics\WallBundle\Entity\SocialPage;


//use FOS\UserBundle\Model\User as FOSUBUser;

/**
 *
 * @ORM\Table(name="User")
 * @ORM\Entity(repositoryClass="Arquematics\UserBundle\Entity\UserRepository")
 * @UniqueEntity(fields="email", message="User.email_unique")
 */
class User extends BaseUser implements JsonSerializable, AdvancedUserInterface, Serializable
{
    /**
     * @var integer $id
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string $email
     *
     * @ORM\Column(name="email", type="string", length=255, unique=true)
     * @Assert\Email()
     * @Assert\NotBlank(message="User.email_not_blank")
     */
    protected $email;
    
    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    protected $name;
    
    
    /**
     * @var string
     *
     * @ORM\Column(name="username_canonical", type="string", length=255)
     */
    protected $usernameCanonical;
    
    
    /**
     * @var string
     *
     * @ORM\Column(name="email_canonical", type="string", length=255)
     */
    protected $emailCanonical;
    
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
    
    
    /**
    * @var string
    *
    * @ORM\Column(name="public_key", type="text", columnDefinition="LONGTEXT", nullable=true)
    */
    private $publicKey;
    
    public function getPublicKey()
    {
        return $this->publicKey;
    } 
    
    /**
     * 
     * @param type $data
     * @return $this
     */
    public function setPublicKey($data)
    {
        $this->publicKey = $data;
        return $this;
    }
    
    /**
    * @var string
    *
    * @ORM\Column(name="mail_public_key", type="text", columnDefinition="LONGTEXT", nullable=true)
    */
    private $mailPublicKey;
    
    public function getMailPublicKey()
    {
        return $this->mailPublicKey;
    } 
    
    /**
     * 
     * @param type $data
     * @return $this
     */
    public function setMailPublicKey($data)
    {
        $this->mailPublicKey = $data;
        return $this;
    }
    
    /**
    * @var string
    *
    * @ORM\Column(name="mail_private_key", type="text", columnDefinition="LONGTEXT", nullable=true)
    */
    private $mailPrivateKey;
    
    public function getMailPrivateKey()
    {
        return $this->mailPrivateKey;
    } 
    
    /**
     * 
     * @param type $data
     * @return $this
     */
    public function setMailPrivateKey($data)
    {
        $this->mailPrivateKey = $data;
        return $this;
    }
    
    
    /**
     * @var string $password
     *
     * @ORM\Column(name="password", type="string", length=255, nullable=true)
     * @PasswordAssert\PasswordConstraint(groups={"password_required"})
     */
    protected $password;

    /**
     * @var string $salt
     *
     * @ORM\Column(name="salt", type="string", length=255, nullable=true)
     */
    protected $salt;    

    /**
     * @var string $confirmation_hash
     *
     * @ORM\Column(name="confirmation_hash", type="string", length=255, nullable=true)
     */
    protected $confirmation_hash;    

    /**
     * @var smallint $confirmed
     *
     * @ORM\Column(name="confirmed", type="smallint")
     */
    protected $confirmed;

    /**
     * @var smallint $actived
     *
     * @ORM\Column(name="actived", type="smallint")
     */
    private $actived;

    

    /**
     * @var \DateTime $created_at
     *
     * @ORM\Column(name="created_at", type="datetime")
     */
    private $created_at;
    
    
    /**
     * @var \Doctrine\Common\Collections\Collection|SocialPage[]
     *
     * @ORM\OneToMany(targetEntity="Arquematics\WallBundle\Entity\SocialPage", mappedBy="createdBy",cascade={"persist", "remove"}, orphanRemoval=TRUE)
     */
    protected $socialPages;
    
    /**
     * Add User
     *
     * @param Arquematics\WallBundle\Entity\SocialPage $socialPage
     * @return User
     */
    public function addSocialPage(\Arquematics\WallBundle\Entity\SocialPage $socialPage)
    {
        $this->socialPages[] = $socialPage;

        return $this;
    }
    

    /**
     * Remove message
     *
     * @param Arquematics\WallBundle\Entity\SocialPage $socialPage
     */
    public function removeSocialPage(\Arquematics\WallBundle\Entity\SocialPage $socialPage)
    {
        $this->socialPages->removeElement($socialPage);
    }

    /**
     * Get wallMessages
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getSocialPages()
    {
        return $this->socialPages;
    }
    
    public function setSocialPages($socialPage)
    {
        $this->socialPages = $socialPage;
        return $this;
    }
    
    public function getListNoSocial()
    {
        $ret = array();
        foreach ($this->list as $list)
        {
            if (!$list->getSocialType())
            {
                $ret[] =  $list;  
            }
        }
        return $ret;
    }
    
    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Arquematics\UserBundle\Entity\UserFriend", mappedBy="user")
     */
    protected $users;
    
    public function addUser($friend)
    {
        $this->users[] = $friend;
        return $this;
    }
    
    public function removeUser($friend)
    {
        $this->users->removeElement($friend);
    }

    public function getUsers()
    {
        return $this->users;
    }
    
    public function setUsers($messages)
    {
        $this->users = $messages;
        return $this;
    }
    
    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Arquematics\UserBundle\Entity\UserFriend", mappedBy="friend")
     */
    protected $friends;
    
    public function addFriend($friend)
    {
        $this->friends[] = $friend;
        return $this;
    }
    
    public function isFriendAccept($user)
    {
        $ret = false;
        
        if (count($this->users) > 0)
        {
            foreach ($this->users as $friend)
            {
                $ret = (($friend->getFriend()->getId() == $user->getId())
                        && ($friend->getStatus() === UserFriend::ACCEPT));
                if ($ret)
                {
                    break;
                }
            }
        }
      
        return $ret;
    }
    
    public function isFriendRequest($user)
    {
        $ret = false;
        
        if (count($this->users) > 0)
        {
            foreach ($this->users as $friend)
            {
                $ret = (($friend->getFriend()->getId() == $user->getId())
                        && ($friend->getStatus() === UserFriend::REQUEST));
                if ($ret)
                {
                    break;
                }
            }
        }
      
        return $ret;
    }
    
    public function isFriendIgnore($user)
    {
        $ret = false;
        
        if (count($this->users) > 0)
        {
            foreach ($this->users as $friend)
            {
                $ret = (($friend->getFriend()->getId() == $user->getId())
                        && ($friend->getStatus() === UserFriend::IGNORE));
                if ($ret)
                {
                    break;
                }
            }
        }
      
        return $ret;
    }
    
    public function removeFriend($friend)
    {
        $this->friends->removeElement($friend);
    }

    public function getFriends()
    {
        return $this->friends;
    }
    
    public function setFriends($messages)
    {
        $this->friends = $messages;
        return $this;
    }
    
    /**
     * @var \Doctrine\Common\Collections\Collection|WallMessage[]
     *
     * @ORM\OneToMany(targetEntity="Arquematics\WallBundle\Entity\WallMessage", mappedBy="createdBy")
     */
    protected $wallMessages;
    
    /**
     * Add User
     *
     * @param Arquematics\WallBundle\Entity\WallMessage $message
     * @return User
     */
    public function addMessage(\Arquematics\WallBundle\Entity\WallMessage $message)
    {
        $this->wallMessages[] = $message;

        return $this;
    }
    

    /**
     * Remove message
     *
     * @param Arquematics\WallBundle\Entity\WallMessage $message
     */
    public function removeMessage(\Arquematics\WallBundle\Entity\WallMessage $message)
    {
        $this->wallMessages->removeElement($message);
    }

    /**
     * Get wallMessages
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getWallMessages()
    {
        return $this->wallMessages;
    }
    
    public function setWallMessages($messages)
    {
        $this->wallMessages = $messages;
        return $this;
    }
    
    /**
     * @var \Doctrine\Common\Collections\Collection|wallMessage[]
     *
     * @ORM\ManyToMany(targetEntity="\Arquematics\WallBundle\Entity\WallMessage", inversedBy="users")
     * @ORM\JoinTable(
     *  name="user_votes",
     *  joinColumns={
     *      @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     *  },
     *  inverseJoinColumns={
     *      @ORM\JoinColumn(name="menssage_id", referencedColumnName="id")
     *  }
     * )
     */
    protected $votes;
    
    /**
     * Add vote
     *
     * @param \Arquematics\WallBundle\Entity\WallMessage $wallMessage
     * @return User
     */
    public function addVote(\Arquematics\WallBundle\Entity\WallMessage $wallMessage)
    {
        $this->votes[] = $wallMessage;

        return $this;
    }
    
   
    /**
     * Remove user_roles
     *
     * @param \Arquematics\WallBundle\Entity\WallMessage $wallMessage
     */
    public function removeVote(\Arquematics\WallBundle\Entity\WallMessage $wallMessage)
    {
        $this->votes->removeElement($wallMessage);
    }

    /**
     * Get Votes
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getVotes()
    {
        return $this->votes;
    }
    
    public function setVotes(\Doctrine\Common\Collections\Collection $votes)
    {
        $this->votes = $votes;
        return $this;
    }
    
    /**
     * @var \Doctrine\Common\Collections\Collection|UserRole[]
     *
     * @ORM\ManyToMany(targetEntity="UserRole", inversedBy="users")
     * @ORM\JoinTable(
     *  name="user_userroles",
     *  joinColumns={
     *      @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     *  },
     *  inverseJoinColumns={
     *      @ORM\JoinColumn(name="userrole_id", referencedColumnName="id")
     *  }
     * )
     */
    protected $userRoles;
    
    /**
     * Add user_roles
     *
     * @param \Arquematics\UserBundle\Entity\UserRole $userRoles
     * @return User
     */
    public function addUserRole($userRoles)
    {
        $this->userRoles[] = $userRoles;

        return $this;
    }
    

    /**
     * Remove user_roles
     *
     * @param \Arquematics\UserBundle\Entity\UserRole $userRoles
     */
    public function removeUserRole(\Arquematics\UserBundle\Entity\UserRole $userRoles)
    {
        $this->userRoles->removeElement($userRoles);
    }

    /**
     * Get user_roles
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getUserRoles()
    {
        return $this->userRoles;
    }
    
    public function setUserRoles($roles)
    {
        $this->userRoles = $roles;
        return $this;
    }
    
    /**
     * @var \Arquematics\UserBundle\Entity\Profile $profile
     *
     * @ORM\OneToOne(targetEntity="\Arquematics\UserBundle\Entity\Profile", mappedBy="user", cascade={"persist", "remove"})
     */
    protected $profile;
    
     /**
     * @var \Doctrine\Common\Collections\Collection|WallMessage[]
     *
     * @ORM\ManyToMany(targetEntity="\Arquematics\WallBundle\Entity\WallList", mappedBy="users", cascade={"persist"})
     * @ORM\JoinTable(name="User_List")
     */
    protected $list;
    
    public function addList($list)
    {
        $this->list[] = $list;
        return $this;
    }

    public function removeList($list)
    {
        $this->list->removeElement($list);
    }

    public function getlist()
    {
        return $this->list;
    }
   
    public function setlist(\Doctrine\Common\Collections\Collection $list)
    {
        $this->list = $list;
        return $this;
    }
    
    public function __construct()
    {
        parent::__construct();
        
        $this->list = new ArrayCollection();
        $this->friends = new ArrayCollection();
        $this->userRoles = new ArrayCollection();
        $this->socialPages = new ArrayCollection();
        $this->wallMessages = new ArrayCollection();
        $this->votes = new ArrayCollection();
        $this->created_at = new \DateTime;
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
     * Set email
     *
     * @param string $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * Get email
     *
     * @return string 
     */
    public function getEmail()
    {
        return $this->email;
    }
    
    /**
     * Set name
     *
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
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
     * Set password
     *
     * @param string $password
     */
    public function setPassword($password)
    {
        $this->password = $password;
    }

    /**
     * Get password
     *
     * @return string 
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Set salt
     *
     * @param string $salt
     */
    public function setSalt($salt)
    {
        $this->salt = $salt;
    }

    /**
     * Get salt
     *
     * @return string 
     */
    public function getSalt()
    {
        return $this->salt;
    }

    /**
     * Set confirmation_hash
     *
     * @param string $confirmation_hash
     */
    public function setConfirmationHash($confirmation_hash)
    {
        $this->confirmation_hash = $confirmation_hash;
    }

    /**
     * Get confirmation_hash
     *
     * @return string 
     */
    public function getConfirmationHash()
    {
        return $this->confirmation_hash;
    }

    /**
     * Set confirmed
     *
     * @param smallint $confirmed
     */
    public function setConfirmed($confirmed)
    {
        $this->confirmed = $confirmed;
    }

    /**
     * Get confirmed
     *
     * @return smallint 
     */
    public function getConfirmed()
    {
        return $this->confirmed;
    }

    /**
     * Set actived
     *
     * @param smallint $actived
     */
    public function setActived($actived)
    {
        $this->actived = $actived;
    }

    /**
     * Get actived
     *
     * @return smallint
     */
    public function getActived()
    {
        return $this->actived;
    }
    
    
    /**
     * ojo hereda getLastLogin y setLastLogin
     * 
     * @var \DateTime $lastLogin
     *
     * @ORM\Column(name="last_login", type="datetime", nullable=true)
     */
    protected $lastLogin;
    
    /**
     * Set created_at
     *
     * @param \DateTime $createdAt
     * @return User
     */
    public function setCreatedAt($createdAt)
    {
        $this->created_at = $createdAt;
    
        return $this;
    }

    /**
     * Get created_at
     *
     * @return \DateTime 
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    public function __toString(){
        return $this->getEmail();
    }

    function equals(\Symfony\Component\Security\Core\User\UserInterface $user)
    {
        return $this->getEmail() == $user->getEmail();
    }

    

    /**
     * devuelve los roles para symfony 
     * esto son credenciales del sistema
     * 
     * @return array
     */
    function getRoles()
    {
        $roles = $this->getUserRoles();
        $ret = array();
        
        foreach ($roles as $role)
        {        
          if ($role->getId() == UserRole::ROLE_CONFIG)
          {
             $ret[] =  'ROLE_ADMIN'; 
          }
        }
        
        $ret[] =  'ROLE_USER';
        
        return $ret;
    }

    function getUsername()
    {
        return $this->getEmail();
    }

    public function serialize()
    {
       return serialize($this->getId());
    }
    
    public function unserialize($data)
    {
        $this->id = unserialize($data);
    }

    

    /**
     *
     * @param \Arquematics\UserBundle\Entity\Profile $profile
     */
    public function setProfile(\Arquematics\UserBundle\Entity\Profile $profile)
    {
        $this->profile = $profile;
    }

    /**
     * Get profile
     *
     * @return \Arquematics\UserBundle\Entity\Profile
     */
    public function getProfile()
    {
        return $this->profile;
    }
    

    /** @ORM\Column(name="facebook_name", type="string", length=255, nullable=true) */
    protected $facebook_name;
    /** @ORM\Column(name="facebook_id", type="string", length=255, nullable=true) */
    protected $facebook_id;

    /** @ORM\Column(name="facebook_access_token", type="text",  nullable=true) */
    protected $facebook_access_token;
    
    /** @ORM\Column(name="facebook_secret_token", type="text", nullable=true) */
    protected $facebook_secret_token;
    
     /** @ORM\Column(name="facebook_refresh_token", type="text", nullable=true) */
    protected $facebook_refresh_token;
    
    /** @ORM\Column(name="facebook_expires_in", type="string", length=255, nullable=true) */
    protected $facebook_expires_in;
    
    /**
     *
     * @ORM\Column(name="facebook_enable", type="boolean")
     */
    protected $facebook_enable = true;    
    /** @ORM\Column(name="linkedin_name", type="string", length=255, nullable=true) */
    protected $linkedin_name;
    /** @ORM\Column(name="linkedin_id", type="string", length=255, nullable=true) */
    protected $linkedin_id;
    /** @ORM\Column(name="linkedin_expires_in", type="string", length=255, nullable=true) */
    protected $linkedin_expires_in;
    /**
     * @var boolean
     *
     * @ORM\Column(name="linkedin_enable", type="boolean")
     */
    protected $linkedin_enable = true;

    /** @ORM\Column(name="linkedin_access_token", type="text", nullable=true) */
    protected $linkedin_access_token;
    
    /** @ORM\Column(name="linkedin_secret_token", type="text", nullable=true) */
    protected $linkedin_secret_token;
    
     /** @ORM\Column(name="linkedin_refresh_token", type="text", nullable=true) */
    protected $linkedin_refresh_token;
    
    /** @ORM\Column(name="twitter_name", type="string", length=255, nullable=true) */
    protected $twitter_name;
    /** @ORM\Column(name="twitter_id", type="string", length=255, nullable=true) */
    protected $twitter_id;

    /** @ORM\Column(name="twitter_access_token", type="text", nullable=true) */
    protected $twitter_access_token;
    
    /** @ORM\Column(name="twitter_secret_token", type="text", nullable=true) */
    protected $twitter_secret_token;
    
     /** @ORM\Column(name="twitter_refresh_token", type="text", nullable=true) */
    protected $twitter_refresh_token;
    
    /** @ORM\Column(name="twitter_expires_in", type="string", length=255, nullable=true) */
    protected $twitter_expires_in;
    /**
     *
     * @ORM\Column(name="twitter_enable", type="boolean")
     */
    protected $twitter_enable = true;

    
    public function setFacebookName($facebookID) 
    {
        $this->facebook_name = $facebookID;

        return $this;
    }

    public function getFacebookName() {
        return $this->facebook_name;
    }
   
    public function hasFacebook()
    {
        return ($this->facebook_id != null);
    }
    
    public function setFacebookEnable($facebookID) 
    {
        $this->facebook_enable = $facebookID;

        return $this;
    }

    public function getFacebookEnable() {
        return $this->facebook_enable;
    }

    public function setFacebookId($facebookID) 
    {
        $this->facebook_id = $facebookID;

        return $this;
    }

    public function getFacebookId() {
        return $this->facebook_id;
    }
    
    public function setFacebookExpiresIn($expiresIn) 
    {
        $this->facebook_expires_in = $expiresIn;

        return $this;
    }

    public function getFacebookExpiresIn()
    {
        return $this->facebook_expires_in;
    }
    
    public function setFacebookAccessToken($facebookAccessToken) {
        $this->facebook_access_token = $facebookAccessToken;

        return $this;
    }

    public function getFacebookAccessToken() {
        return $this->facebook_access_token;
    }
    
    
    public function setFacebookSecretToken($facebookSecretToken) {
        $this->facebook_secret_token = $facebookSecretToken;
        return $this;
    }
    
    public function getFacebookSecretToken() {
        return $this->facebook_secret_token;
    }
    
    public function setFacebookRefreshToken($facebookRefreshToken) {
        $this->facebook_refresh_token = $facebookRefreshToken;

        return $this;
    }
    
    public function getFacebookRefreshToken() {
        return $this->facebook_refresh_token;
    }
    
    public function setLinkedinName($linkedinID) 
    {
        $this->linkedin_name = $linkedinID;

        return $this;
    }
    
    public function getLinkedinName() {
        return $this->linkedin_name;
    }
    
    public function setLinkedinId($linkedinID) 
    {
        $this->linkedin_id = $linkedinID;

        return $this;
    }
    
    public function setLinkedinEnable($facebookID) 
    {
        $this->linkedin_enable = $facebookID;

        return $this;
    }

    public function getLinkedinEnable() {
        return $this->linkedin_enable;
    }
    
    public function hasLinkedin()
    {
        return ($this->linkedin_id != null);
    }
    
    public function getLinkedinId() {
        return $this->linkedin_id;
    }

    public function setLinkedinAccessToken($linkedinAccessToken) {
        $this->linkedin_access_token = $linkedinAccessToken;

        return $this;
    }

    public function getLinkedinAccessToken() {
        return $this->linkedin_access_token;
    }
    
    public function setLinkedinSecretToken($linkedinSecretToken) 
    {
        $this->linkedin_secret_token = $linkedinSecretToken;

        return $this;
    }

    public function setLinkedinExpiresIn($expiresIn) 
    {
        $this->linkedin_expires_in = $expiresIn;

        return $this;
    }

    public function getLinkedinExpiresIn()
    {
        return $this->linkedin_expires_in;
    }
    
    public function getLinkedinSecretToken() {
        return $this->linkedin_secret_token;
    }
    
    public function setLinkedinRefreshToken($linkedinRefreshToken) {
        $this->linkedin_refresh_token = $linkedinRefreshToken;

        return $this;
    }
    
    public function getLinkedinRefreshToken() {
        return $this->linkedin_refresh_token;
    }
    
    //twitter
    public function setTwitterName($twitterID) 
    {
        $this->twitter_name = $twitterID;

        return $this;
    }
    
    public function hasTwitter()
    {
        return ($this->twitter_id != null);
    }
    
    public function setTwitterExpiresIn($expiresIn) 
    {
        $this->twitter_expires_in = $expiresIn;

        return $this;
    }

    public function getTwitterExpiresIn()
    {
        return $this->twitter_expires_in;
    }

    public function getTwitterName() {
        return $this->twitter_name;
    }
    
    public function setTwitterId($twitterID) 
    {
        $this->twitter_id = $twitterID;

        return $this;
    }
    
     public function setTwitterEnable($facebookID) 
    {
        $this->twitter_enable = $facebookID;

        return $this;
    }

    public function getTwitterEnable() {
        return $this->twitter_enable;
    }

    public function getTwitterId() {
        return $this->twitter_id;
    }

    public function setTwitterSecretToken($twitterSecretToken) {
        $this->twitter_secret_token = $twitterSecretToken;

        return $this;
    }
    
    public function getTwitterSecretToken() {
        return $this->twitter_secret_token;
    }
    
    public function setTwitterRefreshToken($twitterRefreshToken) {
        $this->twitter_refresh_token = $twitterRefreshToken;

        return $this;
    }
    
    public function getTwitterRefreshToken() {
        return $this->twitter_refresh_token;
    }

    public function setTwitterAccessToken($twitterAccessToken) {
        $this->twitter_access_token = $twitterAccessToken;

        return $this;
    }
    
    public function getTwitterAccessToken() {
        return $this->twitter_access_token;
    }

    public function getUserRolesAsIdArray(){
        $ids = array();
        foreach ($this->roles as $user_rol) {
            $ids[]=$user_rol->getId();
        }
        return $ids;
    }

    public function hasRoleId($roleId)
    {
        $rolesIds[] = array();

        $userRoles = $this->getUserRoles();
        if ($userRoles && (count($userRoles) > 0))
        {
            foreach($userRoles as $userRole){
                $rolesIds[] = $userRole->getId();
            }
        }

        return in_array($roleId, $rolesIds);
    }

    public function isConfigurador()
    {
        return $this->hasRoleId(UserRole::ROLE_CONFIG);
    }

    public function isEnabled()
    {
        return $this->actived;
    }

    public function isAccountNonExpired()
    {
        return true;
    }

    public function isAccountNonLocked()
    {
        return true;
    }

    public function isCredentialsNonExpired()
    {
        return true;
    }
    
    public function getConnectAsLinkedinPageName()
    {
        if ($this->hasSelectedLinkedinPage())
        {
            return $this->getSelectedLinkedinPage()->getName();
        }
        else
        {
            return $this->getLinkedinName();
        }
    }
    
    public function hasSelectedLinkedinPage()
    {
        $ret = false;
        if (count($this->getSocialPages()) > 0)
        {
            foreach ($this->getSocialPages() as $page)
            {
                $ret = $ret || ($page->getSelected() && ($page->getSocialType() === SocialPage::LINKEDIN));
            }
        }
        return $ret;
    }
    
    public function getSelectedLinkedinPage()
    {
        $ret = false;
        if (count($this->getSocialPages()) > 0)
        {
            foreach ($this->getSocialPages() as $page)
            {
                if ($page->getSelected() 
                   && ($page->getSocialType() === SocialPage::LINKEDIN))
                {
                    $ret = $page;
                }
            }
        }
        
        return $ret;
    }

    public function getNameComplete()
    {
         $profile = $this->getProfile();
         return ucfirst($profile->getName()).' '.ucfirst($profile->getLastname());
    }
    
    /**
    * @ORM\Column(name="lock_status", type="boolean", options={"default":"0"})
    */
    private $lock = false;
    /**
     * Set status
     *
     * @param integer $status
     * @return User
     */
    public function setLock($status)
    {
        $this->lock = $status;

        return $this;
    }
    /**
     * Get status
     *
     * @return integer 
     */
    public function getLock()
    {
        return $this->lock;
    }
    
    public function jsonSerialize()
    {
        $profile = $this->getProfile();
                
        return [
            'image'         =>  $profile->getImage(),
            'completeName'  =>  ucfirst($profile->getName()).' '.ucfirst($profile->getLastname()),
            'id'            =>  $this->getId(),
            'name'          =>  $this->getName(),
            'slug'          =>  $this->getSlug()
        ];
    }
}
