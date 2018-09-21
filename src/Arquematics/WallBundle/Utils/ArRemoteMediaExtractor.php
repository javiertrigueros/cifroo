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

use JsonSerializable;

/**
 * mirar tambien componente "essence/essence": "^3.4" 
 */
class ArRemoteMediaExtractor implements JsonSerializable
{
    private $respose;
    
    private $isOpenGraph = false;
    
    private $url = false;
    
    public function __construct($url = false)
    {
        $this->url = trim($url);
        $this->respose = Embed::create($this->url);
        
        if (!$this->respose)
        {
            $this->isOpenGraph = true;
            $this->respose = $this->loadOpenGraph($this->url);
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
    /**
     * type devuelve 'video' 'photo' 'link' 'rich'
     * 
     * @return array
     */
    public function jsonSerialize()
    {
           
        // configuraciones para el autoplay en los videos
        if ($this->respose && !$this->isOpenGraph)
        {
          if ($this->respose->providerName == 'YouTube')
          {
            return [
               'html'           =>      str_replace("?", "?autoplay=1&", $this->respose->code),
               'title'          =>      $this->respose->title,
               'thumb'          =>      $this->respose->image,
               'description'    =>      $this->respose->description,
               'provider'       =>      $this->respose->providerName,
               'urlquery'       =>      $this->url,
               'url'            =>      $this->respose->url,
               'type'           =>      $this->respose->type
            ]; 
          }
          else if ($this->respose->providerName == 'Vimeo')
          {
              return [
               'html'           =>      str_replace('" width="', '?autoplay=1" width=', $this->respose->code),
               'title'          =>      $this->respose->title,
               'thumb'          =>      $this->respose->image,
               'description'    =>      $this->respose->description,
               'provider'       =>      $this->respose->providerName,
               'urlquery'       =>      $this->url,
               'url'            =>      $this->respose->url,
               'type'           =>      $this->respose->type
            ]; 
          }
          else 
          {
             return [
               'html'           =>      $this->respose->code,
               'title'          =>      $this->respose->title,
               'thumb'          =>      $this->respose->image,
               'description'    =>      $this->respose->description,
               'provider'       =>      $this->respose->providerName,
               'urlquery'       =>      $this->url,
               'url'            =>      $this->respose->url,
               'type'           =>      $this->respose->type
            ]; 
          }
            
           
        }
        else if ($this->respose && $this->isOpenGraph)
        {
           
            if ($this->respose->images 
               && (count($this->respose->images) > 0))
            {
                $image = $this->respose->images[0];
                
                return [
                    'html'           =>      false,
                    'title'          =>      $this->respose->title,
                    'thumb'          =>      $image->url,
                    'description'    =>      $this->respose->description,
                    'provider'       =>      $this->respose->siteName,
                    'urlquery'       =>      $this->url,
                    'url'            =>      $this->respose->url,
                    'type'           =>      'link'
                ]; 
            }
            else
            {
               return [
                'html'           =>      false,
                'title'          =>      $this->respose->title,
                'thumb'          =>      false,
                'description'    =>      $this->respose->description,
                'provider'       =>      $this->respose->siteName,
                'urlquery'       =>      $this->url,
                'url'            =>      $this->respose->url,
                'type'           =>      'link'
               ]; 
            } 
        }
        
        return [];
    }
   
}