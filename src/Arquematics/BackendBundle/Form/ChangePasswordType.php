<?php

namespace Arquematics\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ChangePasswordType extends AbstractType
{
        public function buildForm(FormBuilderInterface $builder, array $options)
        {
                
                $builder
                ->add('password', RepeatedType::class, array(
                                'type' => 'password',
                                'invalid_message' => 'Las dos contraseñas deben coincidir',
                                'options' => array('label' => 'Password'),
                                'required' => false
                        )
                );

        }

        public function configureOptions(OptionsResolver $resolver) {
                $resolver->setDefaults(array(
                    'validation_groups' => function(FormInterface $form) {
                        $data = $form->getData();
                        if($data->getPassword() != "") {
                            return array('password_required');
                        }
                    },
                ));
        }

        public function getBlockPrefix()
        {
                return 'userbundle_confirmresetpasswordtype';
        }
}