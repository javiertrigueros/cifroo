<?php

namespace Arquematics\WallBundle\Utils;

/**
 * funciones generales
 * 
 * Arquematics 
 *  
 */
use Embed\Embed;

use Fusonic\OpenGraph\Consumer;

class ArSocialPages 
{
    private $respose;
    
    private $isOpenGraph = false;
    
    public function __construct($url = false)
    {
        $this->respose = Embed::create($url);
        
        if (!$this->respose)
        {
            $this->isOpenGraph = true;
            $this->respose = $this->loadOpenGraph($url);
            if ($this->respose
               && (strlen(trim($this->respose->title)) == 0))
            {
              $this->respose = false;   
            }
        }
    }
    
    private function loadOpenGraph($url)
    {
        $consumer = new Consumer();
        return $consumer->loadUrl($url);
    }
    
    public function hasRespose()
    {
        //return true;
        return ($this->respose && is_object($this->respose)); 
    }
    
}