<?php

namespace Arquematics\UserBundle\Controller;

use Arquematics\BackendBundle\Utils\ArController;


use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


use Arquematics\UserBundle\Form\UserType;

use Arquematics\UserBundle\Entity\Profile;
use Arquematics\UserBundle\Entity\User;


use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class UserAdminController extends ArController
{
    public function usersAction(Request $request)
    {
        if (!$this->checkView($request) 
            || !$this->authUser->isConfigurador())
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }

        $maxUsers = $this->container->getParameter('max_users_limit');
        
        $allUsers = $this->em->getRepository('UserBundle:User')->findAllUsersNotCurrent($this->aUser);
        
        $maxUsersToGo =  $maxUsers - count($allUsers);
        
        
        return $this->render('UserBundle:UserAdmin:list.html.twig', array( 
            "menuItem" => 'company_users',
            "menuSection" => 'control_panel',
            "maxUsersToGo" => $maxUsersToGo,
            "maxUsers" => $maxUsers,
            "countUsers" =>  count($allUsers),
            "show_add_user" => $maxUsersToGo > 0,
            "contactEmail" => $this->container->getParameter('contact_email'),
            "users" => $allUsers
        ));
    }
    
    public function userCreateAction(Request $request)
    {
        if (!$this->checkView($request) 
            || !$this->authUser->isConfigurador())
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        $maxUsers = $this->container->getParameter('max_users_limit');
        
        $totalUsers = $this->em->getRepository('UserBundle:User')->findAllUsersNotCurrent($this->aUser);

        if (count($totalUsers) > $maxUsers)
        {
            $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans("control_panel.error_pass_company_users_limit"));
            return $this->redirect($this->generateUrl('company_users'));
        }

        $new_user = new User();

        $form = $this->createForm(UserType::class, $new_user);

        if ($request->getMethod() == 'POST')
        {
            $form->handleRequest($request);
            
            if ($form->isSubmitted() 
               && $form->isValid())
            {
                $this->em->persist($new_user);
                $this->em->flush();
                
                $user_profile = new Profile();
                $user_profile->setId($new_user->getId());
                $user_profile->setName(trim($form['name']->getData()));
                $user_profile->setLastname(trim($form['lastname']->getData()));
                $user_profile->setNotify(true);
                $user_profile->setUser($new_user);
                
                $this->em->persist($user_profile);
                $this->em->flush();
                
                // send email
                $emailBody = $this->renderView('UserBundle:Emails:hello.html.twig',
                    array(
                        "pagename" => $this->container->getParameter('pagename'),
                        "url" => $this->generateUrl('user_register', array("code" => $new_user->getConfirmationHash()), UrlGeneratorInterface::ABSOLUTE_URL)
                    )
                );
   
                $message =\Swift_Message::newInstance()
                    ->setSubject($this->get('translator')->trans("control_panel.email_alta_subject", array('%pagename%' => $this->container->getParameter('pagename'))))
                    ->setFrom($this->container->getParameter('notifications_email'))
                    ->addTo($new_user->getEmail())
                    ->setBody($emailBody, "text/html");
                
               

                $this->container->get('mailer')->send($message);
                
                
                $totalUsers = $this->em->getRepository('UserBundle:User')->findAllUsersNotCurrent($this->aUser);
                
                if(count($totalUsers) === $maxUsers)
                {
                    $linkUrl = $this->renderView(
                                '::link.html.twig',
                                array(
                                    "url" => $this->generateUrl('contact'),
                                    "caption" => $this->container->getParameter('contact_email')
                                ));
                    $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans("control_panel.has_pass_company_users_limit", array ('%url%' => $linkUrl)));
                }
                else
                {
                     $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans("control_panel.user_created"));
                }

               
                return $this->redirect($this->generateUrl('company_users'));
            }
        }

        return $this->render('UserBundle:UserAdmin:user_create.html.twig', array(
            "form" => $form->createView(),
            "menuItem" => 'company_users',
            "menuSection" => 'control_panel'
        ));
    }

    public function userEditAction($user_id, Request $request)
    {
        if (!$this->checkView($request) || !$this->authUser->isConfigurador())
        {
            return $this->redirect($this->generateUrl('homepage'));  
        }
        
        $edit_user = $this->em->getRepository('UserBundle:User')->find($user_id);
        if(!$edit_user){
            $this->get('session')
                 ->getFlashBag()
                 ->add('danger', $this->get('translator')->trans("users.err_not_found"));
            
            return $this->redirect($this->generateUrl('company_users'));
        }
        
        $form = $this->createForm(UserType::class, $edit_user);
        
        if ($request->getMethod() == 'POST')
        {
            $form->handleRequest($request);
            if ($form->isSubmitted() 
               && $form->isValid())
            {
                $this->em->persist($edit_user);
                $this->em->flush();
                
                $user_profile = $edit_user->getProfile();
                $user_profile->setName(trim($form['name']->getData()));
                $user_profile->setLastname(trim($form['lastname']->getData()));
                $this->em->persist($edit_user);
                $this->em->flush();
                
                $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans("control_panel.user_edit"));
                return $this->redirect($this->generateUrl('company_users'));
            }
        }
        
        $form->get('lastname')->setData($edit_user->getProfile()->getLastname());
        
        return $this->render('UserBundle:UserAdmin:user_edit.html.twig',
            array(
                "user" => $edit_user,
                "menuItem" => 'company_users',
                "menuSection" => 'control_panel',
                "form" => $form->createView()
            )
        );
    } 
    
    public function userDeleteAction($user_id, Request $request)
    {

        if (!$this->checkView($request) || !$this->authUser->isConfigurador())
        {
            return $this->redirect($this->generateUrl('homepage'));  
        }

        $delete_user = $this->em->getRepository('UserBundle:User')->find($user_id);

        if(!$delete_user){
            $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans("users.err_not_found"));
            return $this->redirect($this->generateUrl('company_users'));
        }

        if($delete_user->getId() == $this->authUser->getId()){
            $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans("users.err_no_delete_me"));
            return $this->redirect($this->generateUrl('company_users'));
        }

        //borra los votos
        foreach($delete_user->getVotes() as $wallMessage)
        {
            $delete_user->removeVote($wallMessage);
            $this->em->persist($delete_user);
        }
        $this->em->flush();
        
        //borra los mensajes de usuario
        foreach($delete_user->getWallMessages() as $wallMessage)
        {
           $this->em->remove($wallMessage); 
        }
        $this->em->flush();
       
        
        foreach($delete_user->getUserRoles() as $role)
        {
            $delete_user->removeUserRole($role);
        }
        
        foreach($delete_user->getFriends() as $friend)
        {
            $delete_user->removeFriend($friend);
        }
        
        foreach($delete_user->getUsers() as $user)
        {
            $delete_user->removeUser($user);
        }
        
        
        $mailTo = $delete_user->getEmail();
        
        $this->em->persist($delete_user);
        $this->em->flush();
       
        //error en los indices al borrar
        //lo borro con sql nativo
        $this->em->getRepository('UserBundle:User')
                ->deleteUser($delete_user);

        $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans("users.err_user_delete"));

        $emailFrom = $this->container->getParameter('notifications_email');
        
        $emailBody = $this->renderView(
            'UserBundle:Emails:user_deleted.html.twig',
             array("pagename" => $this->container->getParameter('pagename'))
        );
         
        $message =\Swift_Message::newInstance()
            ->setSubject($this->get('translator')->trans("users.user_delete_email_subject", array('%pagename%' => $this->container->getParameter('pagename'))) )
            ->setFrom($emailFrom)
            ->setTo($mailTo)
            ->setBody($emailBody, "text/html");

        $this->container->get('mailer')->send($message);

        return $this->redirect($this->generateUrl('company_users'));
    }

    public function userEnableDisableAction($user_id, Request $request)
    {
        if (!$this->checkView($request) || !$this->authUser->isConfigurador())
        {
            return $this->redirect($this->generateUrl('homepage'));  
        }
        
        $user_to_change = $this->em->getRepository('UserBundle:User')->find($user_id);
        if(!$user_to_change){
            $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans("users.err_not_found"));
            return $this->redirect($this->generateUrl('company_users'));
        }

        if($user_to_change->getActived())
        {
            $user_to_change->setActived(false);
            $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans('users.lock'));
        }
        else
        {
            $user_to_change->setActived(true);
            $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans('users.unlock'));
        }
        
        $this->em->persist($user_to_change);
        $this->em->flush();

        return $this->redirect($this->generateUrl('company_users'));
    }
}