<?php

namespace Arquematics\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ChangeUserPasswordType extends AbstractType
{
        public function buildForm(FormBuilderInterface $builder, array $options)
        {
                $builder
                ->add('password', RepeatedType::class, array(
                                
                                'invalid_message' => 'Las dos contraseñas deben coincidir',
                                'options' => array('label' => 'Password'),
                                'required' => false
                        )
                );

        }

        public function configureOptions(OptionsResolver $resolver)
        {
            $resolver->setDefaults(array(
               'data_class' => "Arquematics\UserBundle\Entity\User"
            ));
        }

        public function getBlockPrefix()
        {
            return 'backendbundle_profiletype';
        }
        
        
}