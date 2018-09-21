<?php

namespace Arquematics\BackendBundle\Service;

use Arquematics\WallBundle\Utils\ARMimeTypes;

class ImageBase64
{
    
    private function getFileExtension($content)
    {
        $imgdata = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $content));
        $f = finfo_open();
        return finfo_buffer($f, $imgdata, FILEINFO_MIME_TYPE);
    }

    public function create($content)
    {
        $type = $this->getFileExtension($content);
       
        if ($type && ARMimeTypes::isImage($type))
        {
            $extension = ARMimeTypes::toExtension($type);
        
            $fileName = md5(uniqid()).'.'.$extension;
            
            return array(
                    'isImage' => true,
                    'ext' => $extension,
                    'mime' =>  ARMimeTypes::extensionToMime($extension),
                    //'content' =>  base64_encode(preg_replace('#^data:image/\w+;base64,#i', '', $content)),
                    'content' =>   $content,
                    'fileName' => $fileName
                );
        }
        else
        {
            return array('isImage' => false); 
        }
        
    }
}