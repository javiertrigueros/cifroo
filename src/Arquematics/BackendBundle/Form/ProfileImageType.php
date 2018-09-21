<?php

namespace Arquematics\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;


class ProfileImageType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('file', FileType::class, array("attr" => array("class" => 'input-profile-image'), "mapped" => false, "required" => true))
        ;
    }


    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Arquematics\UserBundle\Entity\Profile'
        ));
    }

    public function getBlockPrefix()
    {
        return 'backendbundle_profiletype';
    }
}