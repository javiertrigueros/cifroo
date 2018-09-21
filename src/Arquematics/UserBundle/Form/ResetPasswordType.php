<?php

namespace Arquematics\UserBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\FormBuilderInterface;

class ResetPasswordType extends AbstractType
{
        public function buildForm(FormBuilderInterface $builder, array $options)
        {
            $builder->add('email', EmailType::class);
        }

        public function getBlockPrefix()
        {
            return 'userbundle_resetpasswordtype';
        }
}