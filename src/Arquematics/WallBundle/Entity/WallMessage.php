<?php

namespace Arquematics\WallBundle\Entity;

use Arquematics\WallBundle\Entity\WallComment;


use Arquematics\WallBundle\Entity\WallLink;
use Arquematics\WallBundle\Entity\WallList;

use Doctrine\ORM\Mapping as ORM;

use JsonSerializable;
/**
 * Class WallMessage
 *
 * @ORM\Table(name="WallMessage", options={"collate":"utf8mb4_unicode_ci", "charset":"utf8mb4", "engine":"INNODB"})
 * @ORM\Entity(repositoryClass="Arquematics\WallBundle\Entity\WallMessageRepository")
 */
class WallMessage implements JsonSerializable
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
    * @var integer
    *
    * @ORM\Column(name="twitter_id", type="string", length=255, nullable=true)
    */
    private $twitterId;
    
    /**
    * @var integer
    *
    * @ORM\Column(name="facebook_id", type="string", length=255, nullable=true)
    */
    private $facebookId;
    
    /**
    * @var integer
    *
    * @ORM\Column(name="linkedin_id", type="string", length=255, nullable=true)
    */
    private $linkedinId;
    
    /**
     * Get id
     *
     * @return integer 
     */
    public function getTwitterId()
    {
        return $this->twitterId;
    }
    
    public function setTwitterId($id)
    {
        $this->twitterId = $id;
        
        return $this;
    }
    
    /**
     * Get id
     *
     * @return integer 
     */
    public function getLinkedinId()
    {
        return $this->linkedinId;
    }
    
    public function setLinkedinId($id)
    {
        $this->linkedinId = $id;
        
        return $this;
    }
    
    /**
     * Get id
     *
     * @return integer 
     */
    public function getFacebookId()
    {
        return $this->twitterId;
    }
    
    public function setFacebookId($id)
    {
        $this->facebookId = $id;
        
        return $this;
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
     * @var \DateTime
     *
     * @ORM\Column(name="createdAt", type="datetime")
     */
    private $createdAt;
    
    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return WallMessage
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
     * @ORM\ManyToOne(targetEntity="Arquematics\UserBundle\Entity\User", inversedBy="wallMessages", cascade={"persist"})
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
     * Comment
     * 
     * @ORM\OneToMany(targetEntity="\Arquematics\WallBundle\Entity\WallComment", mappedBy="message")
     * 
     */
    private $comments;
    
    /**
     * Add comment
     *
     * @param \Arquematics\WallBundle\Entity\WallComment $comment
     * @return Comment
     */
    public function addComment(WallComment $comment)
    {
        $this->comments[] = $comment;

        return $this;
    }

    /**
     * Remove comment
     *
     * @param \Arquematics\WallBundle\Entity\WallComment $comment
     */
    public function removeComment(WallComment $comment)
    {
        $this->comments->removeElement($comment);
    }

    /**
     * Get comments
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getComments()
    {
        return $this->comments;
    }
    
    
    /**
    * @ORM\Column(name="is_publish",type="boolean", length=1)
    */
    private $isPublish = true;

    
    /**
     * Set Publish status
     *
     * @param integer $isPublish
     * @return WallMessage
     */
    public function setPublish($isPublish)
    {
        $this->isPublish = $isPublish;

        return $this;
    }

    /**
     * Get Publish status
     *
     * @return integer 
     */
    public function getPublish()
    {
        return $this->isPublish;
    }
    
    
    /**
     * @var \Doctrine\Common\Collections\Collection|WallLink[]
     *
     * @ORM\OneToMany(targetEntity="Arquematics\WallBundle\Entity\WallLink", mappedBy="wallMessage")
     */
    protected $wallLinks;
    
    /**
     * Add headquarter
     *
     * @param WallLink $wallLink
     * @return WallMessage
     */
    public function addWallLink(WallLink $wallLink)
    {
        $this->wallLinks[] = $wallLink;

        return $this;
    }

    /**
     * Remove wallLink
     *
     * @param WallLink $wallLink
     */
    public function removeWallLink(WallLink $wallLink)
    {
        $this->wallLinks->removeElement($wallLink);
    }

    /**
     * Get wallLinks
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getWallLinks()
    {
        return $this->wallLinks;
    }
    
    /**
     * set wallLinks
     * 
     * @param \Doctrine\Common\Collections\Collection
     * 
     * @return  WallMessage  
     */
    public function setWallLinks(\Doctrine\Common\Collections\ArrayCollection $wallLinks)
    {
        $this->wallLinks = $wallLinks;
         
        return $this;
    }
    
    
    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="Arquematics\WallBundle\Entity\WallMessageEnc", mappedBy="wallMessage")
     */
    protected $wallEncs;
    
    
    public function addWallEnc($wallEnc)
    {
        $this->wallEncs[] = $wallEnc;

        return $this;
    }

    public function removeWallEnc($wallEnc)
    {
        $this->wallEncs->removeElement($wallEnc);
    }

    /**
     * Get wallLinks
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getWallEncs()
    {
        return $this->wallEncs;
    }
    
    /**
     * 
     * @param \Doctrine\Common\Collections\ArrayCollection $wallEncs
     * @return $this
     */
    public function setWallEncs(\Doctrine\Common\Collections\ArrayCollection $wallEncs)
    {
        $this->wallEncs = $wallEncs;
         
        return $this;
    }
    
    
    
    /**
     * @var \Doctrine\Common\Collections\Collection|ArFile[]
     *
     * @ORM\OneToMany(targetEntity="Arquematics\WallBundle\Entity\ArFile", mappedBy="wallMessage")
     */
    protected $arFiles;
    
    public function addArFile($dropFile)
    {
        $this->arFiles[] = $dropFile;

        return $this;
    }

    public function removeArFile($wallLink)
    {
        $this->arFiles->removeElement($wallLink);
    }

    /**
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getArFiles()
    {
        return $this->arFiles;
    }
    
    /**
     * 
     * @param \Doctrine\Common\Collections\Collection
     * 
     */
    public function setArFiles(\Doctrine\Common\Collections\ArrayCollection $dropFiles)
    {
        $this->arFiles = $dropFiles;
         
        return $this;
    }
    
    /**
    * @var \Doctrine\Common\Collections\Collection|User[]
    *
    * @ORM\ManyToMany(targetEntity="\Arquematics\UserBundle\Entity\User", mappedBy="votes")
    * @ORM\JoinTable(name="user_votes")
    */
    protected $users;
    
    /**
     * Add users
     *
     * @param \Arquematics\UserBundle\Entity\User $user
     * @return WallMessage
     */
    public function addUser(\Arquematics\UserBundle\Entity\User $user)
    {
        $this->users[] = $user;

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
    
    public function hasVote($user)
    {
        $idsToFilter = array($user->getId());
        $ret = $this->getUsers()->filter( function($entry) use ( $idsToFilter) {
            return in_array($entry->getId(), $idsToFilter);
        });
        
        return (count($ret) !== 0);
    }
    
    public function canVote($user)
    {   
      return !$this->hasVote($user);
    }
    
    public function hasTwitter()
    {
        return $this->hasList(WallList::TWITTER);
    }
    
    public function hasLinkedin() 
    {
        return $this->hasList(WallList::LINKEDIN);
    }
    
    public function hasFacebook() 
    {
        return $this->hasList(WallList::FACEBOOK);
    }

    public function hasList($listId)
    {
        $listIds[] = array();

        $messageLists = $this->getLists();
        if ($messageLists && (count($messageLists) > 0))
        {
            foreach($messageLists as $list){
                $listIds[] = $list->getId();
            }
        }

        return in_array($listId, $listIds);
    }
    
    /**
     * @var \Doctrine\Common\Collections\Collection|WallMessage[]
     *
     * @ORM\ManyToMany(targetEntity="\Arquematics\WallBundle\Entity\WallList", mappedBy="messages", cascade={"persist"})
     * @ORM\JoinTable(name="WallList_WallMessage")
     */
    protected $lists;
    
    /**
     * Add tag
     *
     * @param \Arquematics\WallBundle\Entity\WallList $list
     * @return WallMessage
     */
    public function addList(\Arquematics\WallBundle\Entity\WallList $list)
    {
        $this->lists[] = $list;

        return $this;
    }

    /**
     * Remove list
     *
     * @param \Arquematics\WallBundle\Entity\WallList $list
     */
    public function removeList(\Arquematics\WallBundle\Entity\WallList $list)
    {
        $this->lists->removeElement($list);
    }

    /**
     * Get tags
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getLists()
    {
        return $this->lists;
    }
    
    /**
     * Get tags
     * 
    * @param \Doctrine\Common\Collections\ArrayCollection
     * 
     * @return  WallMessage
     */
    public function setLists(\Doctrine\Common\Collections\ArrayCollection $list)
    {
        $this->lists = $list;
         
        return $this;
    }
    
    
    /**
     * @var \Doctrine\Common\Collections\Collection|WallMessage[]
     *
     * @ORM\ManyToMany(targetEntity="\Arquematics\WallBundle\Entity\ArChannel", mappedBy="messages", cascade={"persist"})
     * @ORM\JoinTable(name="ArChannel_WallMessage")
     */
    protected $channels;
    
    /**
     * Add tag
     *
     * @param \Arquematics\WallBundle\Entity\WallList $list
     * @return WallMessage
     */
    public function addChannel(\Arquematics\WallBundle\Entity\ArChannel $channel)
    {
        $this->channels[] = $channel;

        return $this;
    }

    /**
     * Remove list
     *
     * @param \Arquematics\WallBundle\Entity\WallList $list
     */
    public function removeChannel(\Arquematics\WallBundle\Entity\ArChannel $channel)
    {
        $this->channels->removeElement($channel);
    }

    /**
     * Get tags
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getChannels()
    {
        return $this->channels;
    }
    
    /**
     * Get tags
     * 
    * @param \Doctrine\Common\Collections\ArrayCollection
     * 
     * @return  WallMessage
     */
    public function setChannels(\Doctrine\Common\Collections\ArrayCollection $list)
    {
        $this->channels = $list;
         
        return $this;
    }
    
    
    /**
     * @var \Doctrine\Common\Collections\Collection|WallMessage[]
     *
     * @ORM\ManyToMany(targetEntity="\Arquematics\WallBundle\Entity\WallTag", mappedBy="messages")
     * @ORM\JoinTable(name="WallTag_WallMessage")
     */
    protected $tags;
    
    /**
     * Add tag
     *
     * @param \Arquematics\WallBundle\Entity\WallTag $tag
     * @return WallTag
     */
    public function addTag(\Arquematics\WallBundle\Entity\WallTag $tag)
    {
        $this->tags[] = $tag;

        return $this;
    }

    /**
     * Remove tag
     *
     * @param \Arquematics\WallBundle\Entity\WallTag $tag
     */
    public function removeTag(\Arquematics\WallBundle\Entity\WallTag $tag)
    {
        $this->tag->removeElement($tag);
    }

    /**
     * Get tags
     *
     * @return \Doctrine\Common\Collections\ArrayCollection 
     */
    public function getTags()
    {
        return $this->tags;
    }
    
    /**
     * Get tags
     * 
    * @param \Doctrine\Common\Collections\ArrayCollection
     * 
     * @return  WallMessage
     */
    public function setTags(\Doctrine\Common\Collections\ArrayCollection $tags)
    {
        $this->tags = $tags;
         
        return $this;
    }
    
    
    
    public function canDelete($user)
    {
      return ($this->getCreatedBy()->getId() === $user->getId());
    }
    
    /**
     * @var blob
     *
     * @ORM\Column(name="content", type="text", columnDefinition="LONGTEXT", nullable=true)
     */
    private $content;
    
    
    public function getContent()
    {
        return $this->content;
    }
    
    /**
     * Set content data
     *
     * @param text $data
     * @return Company
     */
    public function setContent($data)
    {
        $this->content = $data;

        return $this;
    }
    
    
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->channels = new \Doctrine\Common\Collections\ArrayCollection();
        $this->wallEncs = new \Doctrine\Common\Collections\ArrayCollection();
        $this->comments = new \Doctrine\Common\Collections\ArrayCollection();
        $this->wallLinks = new \Doctrine\Common\Collections\ArrayCollection();
        $this->tags = new \Doctrine\Common\Collections\ArrayCollection();
        $this->users = new \Doctrine\Common\Collections\ArrayCollection();
        $this->lists = new \Doctrine\Common\Collections\ArrayCollection();
        $this->arFiles = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    
    public function getVotesUserNames($authUser)
    {
        $ret = false;
        $messageData = $this->jsonSerialize();
        $hasVoteUser = $this->hasVote($authUser);
        $hasContent = false;

        if ($hasVoteUser)
        {
            $iComaHelp = count($messageData['votes']) -2;
        }
        else
        {
            $iComaHelp = count($messageData['votes']) -1;
        }
            
        for ($i = count($messageData['votes']) -1 ; $i >= 0; $i--)
        {
            $iComaHelp--;
            if ($messageData['votes'][$i]['id'] != $authUser->getId())
            {
               $hasContent = true;
               $ret .=  $messageData['votes'][$i]['completeName'];
               
               if ($iComaHelp >= 0)
               {
                   $ret .= ',';
               }
            }
        }
        
        if ($hasVoteUser && $hasContent)
        {
             $ret =  ucfirst($authUser->getProfile()->getName()). ' '. ucfirst($authUser->getProfile()->getLastname()).','.$ret;
        }
        else if ($hasVoteUser)
        {
            $ret =  ucfirst($authUser->getProfile()->getName()). ' '. ucfirst($authUser->getProfile()->getLastname());
        }
        
        return $ret;
    }
    
    /*
    public function hasMainLink()
    {
        return (count($this->getWallLinks()) > 0);
    }*/
    /*
    public function getMainLink()
    {
       $ret = '';
       if (count($this->getWallLinks()) > 0)
       {
            $wallLinks = $this->getWallLinks();
            $wallMainLink = $wallLinks[0]; 
            $ret =  $wallMainLink;
       }
       
       return $ret;
    }*/
    /*
    public function getFilterContent()
    {
        //borra la url si empieza por una
        if ($this->hasMainLink())
        {
          return trim(ARUtil::removeRLText(
                                    $this->getContent(),
                                     $this->getMainLink()->getUrlquery()));  
        }
        else  
        {
           return trim($this->getContent());
        }
    }*/
            
    public function jsonSerialize()
    {
        $tags = array();
        foreach ($this->tags as $tag) {
          $tags[] = $tag->jsonSerialize(); 
        }
        
        //'video' 'photo' 'link' 'rich'
             
        $wallLinks = [
           'all' => [],
           'videos' => [],
           'photo' => [],
           'link' => [],
           'rich' => [],
           'files' => [],
        ];
        
        foreach ($this->wallLinks as $link) 
        {
          $wallLinks['all'][] = $link->jsonSerialize();
          if ($link->getOembedtype() == 'video')
          {
            $wallLinks['videos'][] = $link->jsonSerialize(); 
          }
          else if ($link->getOembedtype() == 'photo')
          {
            $wallLinks['photos'][] = $link->jsonSerialize();  
          }
          else if ($link->getOembedtype() == 'link')
          {
            $wallLinks['links'][] = $link->jsonSerialize(); 
          }
          else if ($link->getOembedtype() == 'rich')
          {
            $wallLinks['richs'][] = $link->jsonSerialize();   
          }
        }
        
        $comments = array();
        foreach ($this->comments as $comment) {
          $comments[] = $comment->jsonSerialize(); 
        }
        
        $votes = array();
        foreach ($this->users as $user) {
          $votes[] = $user->jsonSerialize(); 
        }
        
        $files = array();
        foreach ($this->arFiles as $arFile) {
          $files[] = $arFile->jsonSerialize(); 
        }
       
        $channels = array();
        foreach ($this->channels as $channel) {
          $channels[] = $channel->jsonSerialize(); 
        }
        
        $userProfile = $this->getCreatedBy()->getProfile();
        
        return [
            'id'            =>  $this->getId(),
            'createdAt'     =>  $this->getCreatedAt()->format("Y-m-d").' '.$this->getCreatedAt()->format("H:i:s"),
            'user'          => [
                                'id'   => $userProfile->getId(),
                                'name' => $userProfile->getName(). ' '. $userProfile->getLastName(),
                                'image' => $userProfile->getImage(), 
                            ],
            'content'       =>  trim($this->getContent()),
            'isPublish'     =>  $this->getPublish(), 
            'channel'       =>  $channels,
            'tags'          =>  $tags,
            'wallLinks'     =>  $wallLinks,
            'votes'         =>  $votes,
            'comments'      =>  $comments,
            'files'         =>  $files
        ];
    }
    
    
}
