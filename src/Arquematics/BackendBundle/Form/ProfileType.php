<?php

namespace Arquematics\BackendBundle\Form;

use Arquematics\BackendBundle\Form\ChangePasswordType;
use libphonenumber\PhoneNumberFormat;
use Misd\PhoneNumberBundle\Form\Type\PhoneNumberType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormError;
use Symfony\Component\Form\FormEvent;

use Symfony\Component\Form\FormEvents;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class ProfileType extends AbstractType
{
    private $request;
    private $translator;
    private $strPhone;


    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $this->request =  $options['request'];
        $this->translator = $options['translator'];

        $builder
            
            ->add('cargo', TextType::class, array(
                "label" => "profile.cargo",
                "required" => false,
                "attr"      => array(
                        "maxlength"     => 40
                    )
                ))
                
            ->add('departament', TextType::class, array(
                "label" => "profile.departament",
                "required" => false,
                "attr"      => array(
                        "maxlength"     => 40
                    )
                ))
            ->add('phones', 
                    PhoneNumberType::class, 
                    array(
                        'label' => 'profile.phones',
                        'invalid_message' => 'system.phone',
                        'default_region' => 'ES',
                        'required' => false,
                        'format' => PhoneNumberFormat::NATIONAL))
           
        ;  
        
        
        $builder->addEventListener(FormEvents::PRE_SUBMIT, function(FormEvent $event){
            $form = $event->getForm();
            $data = $event->getData();
            
            try 
            {
                $formRequestValues  = $this->request->get('backendbundle_profiletype');
        
                $this->strPhone = trim($formRequestValues['phones']);
                
                if (preg_match('/([a-zA-Z]{1})/', $this->strPhone, $matches)
                    && (count($matches) > 0))
                {
                        $form->get('phones')->addError(
                            new FormError($this->translator->trans('system.phone_error'))
                        );
                    
                }
                else if (preg_match('/([\(\)\#\-\_]{1})/', $this->strPhone, $matches)
                    && (count($matches) > 0))
                {
                    
                    $form->get('phones')->addError(
                            new FormError($this->translator->trans('system.phone_error'))
                        ); 
                }
                
                
                if (count($form->get('phones')->getErrors()) > 0)
                {

                    $form->remove('phones');
                    $form->add('phones', 
                        PhoneNumberType::class, 
                        array(
                            'label' => 'error',
                            "attr"      => array(
                                "hasError" => true,
                                "originalData"     => $this->strPhone
                            ),
                            'invalid_message' => 'system.phone',
                            'default_region' => 'ES',
                            'required' => false,
                            'format' => PhoneNumberFormat::NATIONAL));
                   
                    $form->get('phones')->setData($this->strPhone);
                    
                    $form->get('phones')->addError(
                            new FormError($this->translator->trans('system.phone_error'))
                        ); 
                }
            } 
            catch (Exception $ex) {
                /*
               $form->get('phones')->addError(
                        new FormError($this->translator->trans('system.phone_error'))
                );*/
            }
            
        });
        
    }
    
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'request' => false,
            'translator' => false,
            'data_class' => 'Arquematics\UserBundle\Entity\Profile'
        ));
    }

    /*
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Arquematics\UserBundle\Entity\Profile'
        ));
    }*/
    
    

    public function getBlockPrefix()
    {
        return 'backendbundle_profiletype';
    }
}