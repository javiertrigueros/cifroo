<?php

namespace Arquematics\BackendBundle\Utils;

use Arquematics\UserBundle\Entity\UserRole;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\Form\Form;

class ArController extends Controller
{
    
  protected function getErrorMessages(Form $form) {
    $errors = array();
	
    foreach ($form->getErrors(true, false) as $key => $error) {
        if ($form->isRoot()) {
            $errors['#'.$key][] = $error->current()->getMessage();
        } else {
		
            $errors[$key] = $error->current()->getMessage();
        }
    }

    foreach ($form->all() as $child) {
        if (!$child->isValid()) {
            $errors[$child->getName()] = $this->getErrorMessages($child);
        }
    }

    return $errors;
  }
 
  public function checkView(Request $request, $loadUser = true)
  {
      $this->aUser = $this->getUser();
      $this->isAuth =  $this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY');

      if ($this->isAuth && $loadUser)
      {
         $this->loadUser($request);
      }
      
      return $this->isAuth;
  }
  
  public function loadUser(Request $request)
  { 
      $this->authUser = $this->getUser();
      $this->culture = $request->getLocale();
      $this->userid =  $this->authUser->getId();
      $this->aUserProfile = $this->authUser->getProfile();
      //$this->arRoles = $this->authUser->getUserRolesAsIdArray();
      $this->em = $this->getDoctrine()->getManager();
  }
  
  public function isUserRole($roles)
  {
      return in_array(UserRole::ROLE_USER, $roles);
  }
  
  public function checkRoles($roles)
  { 
      if ((count($this->arRoles) > 0)
         && (count($roles) > 0))
      {
        foreach ($this->arRoles as $userRoleId) 
        {
          if (in_array($userRoleId, $roles)){
            return true;
          }
        } 
      }
      
      return (in_array(UserRole::ROLE_USER, $roles));
  }
  
  /**
   * 
   * @param <array $params> : 
   * 
   * @return <booleam>
   */
  public function hasAuthUserRol( $params = array())
  { 
      return false;
  }
  
  protected function saveToSession($paramName, $id)
  {
    $session = $this->get("session");
     
    $objectIds = $session->get($paramName);
                        
    if ($objectIds && (count($objectIds) > 0))
    {
        $objectIds[] =  $id; 
    }
    else 
    {
        $objectIds = array();
        $objectIds[] =  $id;
    }
                
    $session->set($paramName, $objectIds);
    
    return $objectIds;
  }
  
  protected function getTotalUsedQuota()
  {
      /*
   
        $userFolder = $this->em->getRepository('BackendBundle:Folder')
                            ->findUserFolder();
        
        $sgiFolder = $this->em->getRepository('BackendBundle:Folder')    
                        ->findSistemasGestionFolder();
        
        $coorFolder = $this->em->getRepository('BackendBundle:Folder')
                        ->findCoorporativosFolder();
        
        $acumClientSize = ($userFolder != null)? $userFolder->getFolderSize():0;
        $acumClientSize += ($sgiFolder != null)? $sgiFolder->getFolderSize():0;
        $acumClientSize += ($coorFolder != null)? $coorFolder->getFolderSize():0;
        
        return $acumClientSize;
       * 
       */
      return 0;
  }
  
}
