<?php

namespace Arquematics\UserBundle\Controller;

use Arquematics\BackendBundle\Form\ChangeUserPasswordType;
use Arquematics\BackendBundle\Form\ProfileImageResizeType;
use Arquematics\BackendBundle\Form\ProfileImageType;
use Arquematics\BackendBundle\Form\ProfileType;

use Arquematics\BackendBundle\Utils\ArController;

use Arquematics\UserBundle\Validator\Constraints\PasswordConstraint as PasswordAssert;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\HttpFoundation\ResponseHeaderBag;

use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\SecurityContext;

use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

use Arquematics\UserBundle\Form\UserType;

class UserController extends ArController
{
    
    public function autologinAction(Request $request)
    {
        
        if (!$this->checkView($request) || ($this->authUser->getPublicKey() !== null))
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        
        return $this->render('UserBundle:User:autologin.html.twig', array(
            "menuSection" => 'profileView',
            "user" => $this->authUser,
            "profile" => $this->authUser->getProfile(),
            'sessionname' => $this->container->getParameter('sessionname')
        ));
        
    }
    
    public function loginAction(Request $request)
    {
        if ($this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')) {
            return $this->redirect($this->generateUrl('homepage'));
        }
        
        $authUtils = $this->get('security.authentication_utils');
        
        // last username entered by the user
        $lastUsername = $authUtils->getLastUsername();
        
         // get the login error if there is one
        $error = $authUtils->getLastAuthenticationError();


        return $this->render('UserBundle:User:login.html.twig', array(
            'sessionname' => $this->container->getParameter('sessionname'),
            'last_username' => $lastUsername,
            'loginerror' => $error
        ));

    }

    
    public function profileViewAction(Request $request, $channel_slug, $usename_slug)
    {
        if (!$this->checkView($request))
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        $this->currenUser =  $this->em->getRepository('UserBundle:User')
                            ->findOneBy(array('slug' =>$usename_slug ));
        
        $this->currentChannel = $this->em->getRepository('WallBundle:ArChannel')
                                        ->findOneBy(array('slug' => $channel_slug));
                

        if (!$this->currenUser || !$this->currentChannel)
        {
           return $this->redirect($this->generateUrl('homepage'));  
        }
        
        return $this->render('UserBundle:User:profile_view.html.twig', array(
            "menuSection" => 'profileView',
            "user" => $this->currenUser,
            "profile" => $this->currenUser->getProfile(),
            "channel" => $this->currentChannel
        ));
        
        
        
    }
    
   

    public function logoutAction()
    {
        $this->get('security.token_storage')->setToken(null);
        $this->get('request')->getSession()->invalidate();

        return $this->redirect($this->generateUrl('user_login'));
    }

    public function registerAction($code,Request $request)
    {

        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository('UserBundle:User')->findUserByConfirmationCode($code);

        if($user && $user->getConfirmationHash() != null)
        {
            // show form
            if ($request->getMethod() == 'POST') 
            {
                $password = $request->request->has("password") ? trim($request->request->get("password")) : null;
                $password2 = $request->request->has("password2") ? trim($request->request->get("password2")) : null;
                $passwordConstraint = new PasswordAssert();
                $errors = $this->get('validator')->validate($password,$passwordConstraint);

                if($password == null || $password2 == null){
                    $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans("login.password_two_times"));
                }
                else if($password != $password2){
                    $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans("login.password_equal"));
                }
                else if(count($errors) > 0){
                    $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans("login.password_error"));
                }
                else
                {
                    $encoder = $this->get('security.password_encoder');
                    $encoded = $encoder->encodePassword($user, $password);
                    

                    $sendEmail = $user->getConfirmed() == 1 ? false : true;

                    $user->setPassword($encoded);
                    $user->setConfirmationHash(null);
                    $user->setConfirmed(1);
                    $user->setLastLogin(new \DateTime('now'));
                    $em->persist($user);
                    $em->flush();
                    

                    if($sendEmail){
                        // Wellcome email
                        $emailBody = $this->renderView(
                            'UserBundle:Emails:wellcome.html.twig',
                            array(
                                "pagename" => $this->container->getParameter('pagename'),
                                "url" => $this->generateUrl('user_login', array(), UrlGeneratorInterface::ABSOLUTE_URL)
                            )
                        );

                        $message =\Swift_Message::newInstance()
                            ->setSubject($this->get('translator')->trans("login.wellcome_subject", array('%pagename%' => $this->container->getParameter('pagename'))))
                            ->setFrom($this->container->getParameter('notifications_email'))
                            ->setTo($user->getEmail())
                            ->setBody($emailBody, "text/html");

                        $this->container->get('mailer')->send($message);
                    }
                    
                    $providerKey = 'main'; // your firewall name
                    $token = new UsernamePasswordToken($user, null, $providerKey, $user->getRoles());

                    $this->container->get('security.token_storage')->setToken($token);
                    
                    // Autologin
                    
                    return $this->redirect($this->generateUrl('user_autologin', array(), UrlGeneratorInterface::ABSOLUTE_URL));
                }
            }

            return $this->render('UserBundle:User:register.html.twig', array("code" => $code, "isConfirmed" => $user->getConfirmed()));
        }
        else{
            // error
            $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans("login.error_register_code"));
            return $this->redirect($this->generateUrl('user_login', array(), UrlGeneratorInterface::ABSOLUTE_URL));
        }

    }


    public function resetpasswordAction(Request $request)
    {

        if ($request->getMethod() == 'POST') 
        {
            $email = $request->request->has("username") ? trim($request->request->get("username")) : null;

            $em = $this->getDoctrine()->getManager();
            $user = $em->getRepository('UserBundle:User')->findOneByEmail($email);

            if ($user) 
            {
                $confirmationHash = md5(time() + rand());
                $user->setConfirmationHash($confirmationHash);
                $em->persist($user);
                $em->flush();

                $emailBody = $this->renderView(
                    'UserBundle:Emails:resetpassword.html.twig',
                    array(
                        "pagename" => $this->container->getParameter('pagename'),
                        "url" => $this->generateUrl('user_register', array("code" => $confirmationHash),  UrlGeneratorInterface::ABSOLUTE_URL)
                    )
                );
 
                $message = \Swift_Message::newInstance()
                    ->setSubject($this->get('translator')->trans("login.reset_password_subject"))
                    ->setFrom($this->container->getParameter('notifications_email'))
                    ->setTo($user->getEmail())
                    ->setBody($emailBody, "text/html");

                $this->container->get('mailer')->send($message);

                $this->get('session')
                        ->getFlashBag()
                        ->add('info', $this->get('translator')->trans('users.mail_to_reset_pass'));

                return $this->render('UserBundle:User:resetconfirm.html.twig');
            }
            else{
                $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans('users.no_mail'));
            }
        }

        return $this->render('UserBundle:User:resetpassword.html.twig');
    }
    
   
    
    private function sendImageResponse($fileName, $dataImg, $mime) 
    {     
        $dataImg = preg_replace('#^data:image/\w+;base64,#i', '', $dataImg);
        $img = str_replace(' ', '+',$dataImg);
        $data = base64_decode($img);
        
        $response = new Response();
        
        $disposition = $response->headers->makeDisposition(ResponseHeaderBag::DISPOSITION_INLINE, $fileName);
        $response->headers->set('Content-Disposition', $disposition);
        $response->headers->set('Cache-Control', 'private');
        $response->headers->set('Content-type', $mime);
        
        
        $response->setStatusCode(200);
        $response->sendHeaders();
        $response->setContent($data);
        return $response;
    }
    
    public function profileAvatarAction($fileName,Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(404);
            return $response;
        }
        
        $profile = $this->em->getRepository('UserBundle:Profile')->findOneBy(array('image' => $fileName));

        if(!$profile){
            $response = new Response();
            $response->setStatusCode(500);
            return $response;
        }
        
        return $this->sendImageResponse($profile->getImage(), $profile->getImageData(), $profile->getMimeType());
    }
    
    public function resizeProfileImageAction(Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(404);
            return $response;
        }
        
        
        if ($request->getMethod() === 'POST') 
        {
            $formImage = $this->createForm(ProfileImageResizeType::class, $this->aUserProfile);
            
            $formImage->handleRequest($request);

            if ($formImage->isValid())
            {
                $imageAvatar = $this->get('image_base64')
                                ->create($formImage->get('image_data')->getData());
                
                if ($imageAvatar['isImage'])
                {
                   $this->aUserProfile->setImage($imageAvatar['fileName']);
                   $this->aUserProfile->setMimeType($imageAvatar['mime']);
                   $this->aUserProfile->setImageData($imageAvatar['content']);
                   
                   $this->em->persist($this->aUserProfile);
                   $this->em->flush();
                  
                   $response = new Response(); 
                   $response->setStatusCode(200);
                   $response->setContent($this->generateUrl('user_profile_avatar', array('fileName' => $imageAvatar['fileName'])));
                   return $response;
                }
            }
        }
        
        $response = new Response();
        $response->setStatusCode(500);
        return $response; 
    }
    
   
    
    public function profileEditAction(Request $request)
    {
        if (!$this->checkView($request))
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        $form = $this->createForm(ProfileType::class, $this->aUserProfile, ['translator' => $this->container->get('translator'), 'request' => $request]);
        //formulario a quitar seguramente
        $formImage = $this->createForm(ProfileImageType::class, $this->aUserProfile);
        
        $formImageResize = $this->createForm(ProfileImageResizeType::class, $this->aUserProfile);
        
        $formPass = $this->createForm(ChangeUserPasswordType::class, $this->authUser);
        
        if ($request->getMethod() == 'POST') 
        {
            $form->handleRequest($request);

            if ($form->isValid())
            {
                
                $notifGeneral = $request->request->has("notif_general") ? true : false;
                
                $this->aUserProfile->setNotify($notifGeneral);
                
                $this->em->persist($this->aUserProfile);
                $this->em->flush();
                
                $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans("Perfil actualizado correctamente"));
                return $this->redirect($this->generateUrl('user_profile_edit'));
                
            }
            
        }
        
        $hasSelectSocial = ($request->query->get("tab") == 'social');
        
        return $this->render('UserBundle:User:profile_edit.html.twig', array(
            "menuSection" => 'profileView',
            "form" => $form->createView(),
            "formImage" => $formImage->createView(),
            "formImageResize" => $formImageResize->createView(),
            "formPass" => $formPass->createView(),
            "hasSelectSocial" => $hasSelectSocial,
            "user" => $this->authUser,
            "profile" => $this->aUserProfile,
            'sessionname' => $this->container->getParameter('sessionname')
        ));
         
    }
    
     public function connectAction(Request $request, $socialname)
    {
        if (!$this->checkView($request))
        {
            //error 404
            $response = new Response();
            $response->setStatusCode(404);
            return $response;
        }
        
        if ($request->getMethod() == 'GET') 
        {
            
            if (($socialname == 'twitter') 
                || ($socialname == 'facebook')
                || ($socialname == 'linkedin'))
            {
                $setter = 'set' . ucfirst($socialname);
                $setter_enable = $setter.'Enable';
                

                $this->authUser->$setter_enable(true);
                
                $this->em->persist($this->authUser);
                $this->em->flush();
                
                
                $response = new Response();
                $response->setStatusCode(200);
                return $response;
            }
            else
            {
                $response = new Response();
                $response->setStatusCode(500);
                return $response;
            }
            
           
        }
        
         //error 500
        $response = new Response();
        $response->setStatusCode(500);
        return $response;
         
    }
    
    public function disconnectAction(Request $request, $socialname)
    {
        if (!$this->checkView($request))
        {
            //error 404
            $response = new Response();
            $response->setStatusCode(404);
            return $response;
        }
        
        if ($request->getMethod() == 'POST') 
        {
            if (($socialname == 'twitter') 
                || ($socialname == 'facebook')
                || ($socialname == 'linkedin'))
            {
                $setter = 'set' . ucfirst($socialname);
                $setter_id = $setter.'Id';
                $setter_token = $setter.'AccessToken';
                $setter_name = $setter.'Name';
                $setter_enable = $setter.'Enable';
               
                $this->authUser->$setter_id(null);
                $this->authUser->$setter_token(null);
                $this->authUser->$setter_name(null);
                $this->authUser->$setter_enable(false);
                
                $this->em->persist($this->authUser);
                $this->em->flush();
                
                
                $this->get('fos_user.user_manager')->updateUser($this->authUser);
                
                /*
                switch ($socialname) {
                    case "twitter":
                         $this->container->get('session')
                            ->getFlashBag()
                            ->add('danger', $this->container->get('translator')->trans("profile.social_disconnec_twitter"));
                    break;
                    case "facebook":
                         $this->container->get('session')
                            ->getFlashBag()
                            ->add('danger', $this->container->get('translator')->trans("profile.social_disconnec_facebook"));
                    break;
                    case "linkedin":
                        $this->container->get('session')->getFlashBag()->add('danger', $this->container->get('translator')->trans("profile.social_disconnec_linkedin"));
                    break;
                }*/
                
                $response = new Response();
                $response->setStatusCode(200);
                return $response;
            }
            else
            {
                $response = new Response();
                $response->setStatusCode(500);
                return $response;
            }
            
           
        }
        
         //error 500
        $response = new Response();
        $response->setStatusCode(500);
        return $response;
         
    }
    
    public function updatePassAction(Request $request)
    {
        if (!$this->checkView($request))
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        if ($request->getMethod() == 'POST') 
        {
            $formPass = $this->createForm(ChangeUserPasswordType::class, $this->authUser);
        
            $formPass->handleRequest($request);

            if ($formPass->isValid())
            {
                /*
                $encoder = $this->get('security.encoder_factory')->getEncoder($this->authUser);

                $passwordHash = $encoder->encodePassword(
                                $this->authUser->getPassword(),
                                $this->authUser->getSalt()
                        );
                    
                $this->authUser->setPassword($passwordHash);
                   
                 * 
                 */
                $encoder = $this->get('security.password_encoder');
                $encoded = $encoder->encodePassword($this->authUser, $this->authUser->getPassword());
                $this->authUser->setPassword($encoded);
                
                $this->em->persist($this->authUser);
                $this->em->flush();
                 
                $response = new Response();
                $response->setStatusCode(200);
                return $response;
            }
            
        }
        //error 500
        $response = new Response();
        $response->setStatusCode(500);
        return $response;

    }
}
