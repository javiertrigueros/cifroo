<?php

namespace Arquematics\UserBundle\Controller;

use Arquematics\UserBundle\Entity\User;
use Arquematics\UserBundle\Form\ConfirmResetPasswordType;
use Arquematics\UserBundle\Form\RegisterType;
use Arquematics\UserBundle\Form\ResetPasswordType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\SecurityContext;


class DefaultController extends Controller
{
    /*
    public function registerAction(Request $request)
    {
        if ($this->get('security.context')->getToken()->getUser() !== 'anon.') {
            return $this->redirect($this->generateUrl('homepage'));
        }

        $user = new User();

        $userForm = $this->createForm(new RegisterType(), $user);
        
        if ($request->getMethod() == 'POST') {
            $em  = $this->getDoctrine()->getManager();

            if ($request->request->get($userForm->getName())) 
            {
                $userForm->handleRequest($request);

                if ($em->getRepository('UserBundle:User')->findOneByEmail($user->getEmail())) {
                    // Email en uso
                    $userForm['email']['first']->addError(new FormError('Este email ya está en uso'));
                }

                if ($userForm->isValid()) {
                    $encoder = $this->get('security.encoder_factory')->getEncoder($user);

                    $user->setSalt(md5(time()));

                    $passwordHash = $encoder->encodePassword(
                        $user->getPassword(),
                        $user->getSalt()
                    );

                    $user->setPassword($passwordHash);
                    $user->setRol(1);
                    $user->setConfirmationHash(md5(time() + rand()));
                    $user->setConfirmed(0);                    
                    $user->setCreatedAt(new \DateTime());

                    $em->persist($user);
                    $em->flush();  

                    $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans("Register completed. Confirm your email."));
                    return $this->redirect($this->generateUrl('user_login'));
                }
            }

        }
        
        return $this->render('UserBundle:User:register.html.twig', array(
            'userForm'  => $userForm->createView(),
        ));
    }

    */

    public function userConfirmAction($code)
    {

        if($this->get('security.context')->getToken()->getUser() != 'anon.'){
            return $this->redirect($this->generateUrl('homepage'));
        }               

        $request = $this->getRequest();

        $em = $this->getDoctrine()->getManager();
        $user = $em->getRepository('UserBundle:User')->findUserByConfirmationCode($code);

        if($user && $user->getConfirmed() == 0){
            $user->setConfirmed(1);
            $user->setConfirmationHash("");

            $em->persist($user);
            $em->flush();

            // Send email ?

            $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans("User confirmed"));
             
        }
        else{
            $this->get('session')->getFlashBag()->add('error', $this->get('translator')->trans("Confirmation code is not valid"));
        }

        return $this->redirect($this->generateUrl('user_login'));

    } 


    public function resetPasswordAction()
    {
        if($this->get('security.context')->getToken()->getUser() != 'anon.'){
            return $this->redirect($this->generateUrl('homepage'));
        }               

        $request = $this->getRequest();
        $em = $this->getDoctrine()->getManager();

        if($request->query->has('code')){
            // return from email

            $code = $request->query->get('code');
            $user = $em->getRepository('UserBundle:User')->findUserByConfirmationCode($code);          

            if($user){
                
                $reset_password_form = $this->createForm(new ConfirmResetPasswordType());

                if ($request->getMethod() == 'POST') {

                    $reset_password_form->handleRequest($request);

                    if ($reset_password_form->isValid()) {

                        $postData = $request->request->get('userbundle_confirmresetpasswordtype');
                        $password = $postData['password']['first'];             
                        
                        $encoder = $this->get('security.encoder_factory')->getEncoder($user);

                        $user->setSalt(md5(time() + rand()));

                        $passwordHash = $encoder->encodePassword(
                                $password,
                                $user->getSalt()
                        );

                        $user->setPassword($passwordHash);
                        $user->setConfirmationHash("");
                        $em->persist($user);
                        $em->flush();

                        // password modified
                        $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans("Password has been modified"));
                        return $this->redirect($this->generateUrl('user_login'));                                               
                    }
                }                       

            }
            else{
                // Incorrect code
                $this->get('session')->getFlashBag()->add('error', $this->get('translator')->trans("Invalid code"));              
                return $this->redirect($this->generateUrl('user_reset_password'));
            }

            $reset_password_form = $reset_password_form->createView();

            return $this->render('UserBundle:User:confirmresetpassword.html.twig', array("code" => $code, "reset_password_form" => $reset_password_form));

        }
        else{

            $reset_password_form = $this->createForm(new ResetPasswordType());

            if ($request->getMethod() == 'POST') {

                $reset_password_form->handleRequest($request);

                if ($reset_password_form->isValid()) {

                    $postData = $request->request->get('userbundle_resetpasswordtype');
                    $email = $postData['email'];

                    $user = $em->getRepository('UserBundle:User')->findOneBy(array('email' => $email));     

                    if($user){

                        if($user->getConfirmed() == 1){
                            // El usuario está confirmado

                            // Generamos otro confirmation_hash (deberia estar vacio por que el usuario esta confirmado)
                            $user->setConfirmationHash(md5(time()+rand()));
                            $em->persist($user);
                            $em->flush();                                           

                            // Enviar email de confirmación

                            $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans("An email including instructions for activation of your account has been sended"));                        

                        }
                        else{
                            // El usuario no esta confirmado, primero debe confirmar la cuenta
                            $this->get('session')->getFlashBag()->add('error', $this->get('translator')->trans("The user is not confirmed"));     
                            return $this->redirect($this->generateUrl('user_login'));
                        }

                    }
                    else{

                        // No existe ningún usuario con ese email
                        $this->get('session')->getFlashBag()->add('error', $this->get('translator')->trans("There isn't any user with this email"));                          

                    }                       

                }                       
            }               

        }       

        return $this->render('UserBundle:User:resetpassword.html.twig', array("reset_password_form" => $reset_password_form->createView()));
    } 

}
