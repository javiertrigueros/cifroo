<?php

namespace Arquematics\BackendBundle\Utils;

use Arquematics\BackendBundle\Utils\ARMimeTypes;
use Arquematics\BackendBundle\Utils\ARUtil;


abstract class AbstracFile
{
    
    public function getHumanSize($bytes = 0, $decimals = 2) 
    {
        return ARUtil::getHumanSize($bytes, $decimals);
    }
    
    /**
     * Set documentPath
     *
     * @param string $documentPath
     * @return IdeaPerformance
     */
    public function setDocumentPath($documentPath)
    {
        $this->documentPath = $documentPath;

        return $this;
    }

    /**
     * Get documentPath
     *
     * @return string
     */
    public function getDocumentPath()
    {
        return $this->documentPath;
    }
    
   
    public function getAbsolutePath()
    {
        return null === $this->documentPath
            ? null
            : $this->getUploadRootDir().'/'.$this->documentPath;
    }

    public function getWebPath()
    {
        return null === $this->documentPath
            ? null
            : $this->getUploadDir().'/'.$this->documentPath;
    }

    public function getUploadRootDir()
    {
        return __DIR__.'/../../../../web/'.$this->getUploadDir();
    }

    public function getUploadDir()
    {
        return 'uploads/idea_documents';
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Document
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
     * Set documentMimeType
     *
     * @param string $documentMimeType
     * @return IdeaPerformance
     */
    public function setDocumentMimeType($documentMimeType)
    {
        $this->documentMimeType = $documentMimeType;

        return $this;
    }

    /**
     * Get documentMimeType
     *
     * @return string
     */
    public function getDocumentMimeType()
    {
        return $this->documentMimeType;
    }
    

    /**
     * Set realName
     *
     * @param string $realName
     * @return Document
     */
    public function setRealName($realName)
    {
        $this->realName = $realName;

        return $this;
    }

    /**
     * Get realName
     *
     * @return string 
     */
    public function getRealName()
    {
        return $this->realName;
    }

  
    public function isWord()
    {
         $data = $this->getExtensionAsString();

         return ARMimeTypes::isWord($this->getDocumentMimeType(), $this->getAbsolutePath())
            || ($data === 'doc')
            || ($data === 'docx');  
    }
    
    public function isExcel()
    {
        $data = $this->getExtensionAsString();
        
        return ARMimeTypes::isExcel($this->getDocumentMimeType(), $this->getAbsolutePath())
            || ($data === 'xls')
            || ($data === 'xlsx');  
    }
    
    public function isPPT()
    {
       $data = $this->getExtensionAsString();
       return ARMimeTypes::isPPT($this->getDocumentMimeType(), $this->getAbsolutePath()
               || ($data === 'ppt')
               || ($data === 'pptx'));  
    }
    
    public function isOdt()
    {
        $data = $this->getExtensionAsString();
        return ARMimeTypes::isOdt($this->getDocumentMimeType(), $this->getAbsolutePath())
            || ($data === 'odt');  
    }
    
    public function isOds()
    {
      $data = $this->getExtensionAsString();
      return ARMimeTypes::isOds($this->getDocumentMimeType(), $this->getAbsolutePath())
            || ($data === 'ods');  
    }
    
    public function isPdf()
    {
       $data = $this->getExtensionAsString();
       return ARMimeTypes::isPdf($this->getDocumentMimeType(), $this->getAbsolutePath())
            || ($data === 'pdf');
    }
    
    public function isJPG()
    {
       $data = $this->getExtensionAsString();
       return ARMimeTypes::isJPG($this->getDocumentMimeType(), $this->getAbsolutePath())
            || ($data === 'jpg');
    }
    
    public function isPNG()
    {
       $data = $this->getExtensionAsString();
       return ARMimeTypes::isPNG($this->getDocumentMimeType(), $this->getAbsolutePath())
            || ($data === 'png');
    }
    
    public function isGIF()
    {
       $data = $this->getExtensionAsString();
       return ARMimeTypes::isGIF($this->getDocumentMimeType(), $this->getAbsolutePath())
            || ($data === 'gif');
    }
    
    public function isZIP()
    {
       $data = $this->getExtensionAsString();
       return ARMimeTypes::isZIP($this->getDocumentMimeType(), $this->getAbsolutePath())
            || ($data === 'zip');
    }
    
    public function is7z()
    {
       $data = $this->getExtensionAsString();
       return ARMimeTypes::is7z($this->getDocumentMimeType(), $this->getAbsolutePath())
            || ($data === '7z');
    }
    
    public function isRAR()
    {
       $data = $this->getExtensionAsString();
       return ARMimeTypes::isRAR($this->getDocumentMimeType(), $this->getAbsolutePath())
            || ($data === 'rar');
    }
    
    public function getExtensionAsString() {
        return pathinfo($this->getAbsolutePath(), PATHINFO_EXTENSION);
    }
}