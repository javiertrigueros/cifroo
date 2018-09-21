<?php

namespace Arquematics\WallBundle\Event;

use Arquematics\WallBundle\Entity\WallMessage;

use Symfony\Component\EventDispatcher\Event;

class WallMessageEvent  extends Event
{
    private $message;
    private $authUser;
    
    public function __construct ()
    {

    } 
    
    public function setUser($user)
    {
        $this->authUser = $user;
    }
    
    public function getUser()
    {
        return $this->authUser;
    }
    
    
    public function setMessage(WallMessage $obj)
    {
        $this->message = $obj;
    }
 
    public function getMessage()
    {
        return $this->message;
    }
}