<?php

namespace Arquematics\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;


class CompanyImageType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
         $builder
            ->add('image_src',  HiddenType::class, array("attr" => array("class" => 'image-control-src'), "mapped" => false, "required" => true))
            ->add('image_avatar',  HiddenType::class, array("attr" => array("class" => 'image-control-avatar'), "mapped" => false, "required" => true))
        ;
       
    }

    public function getBlockPrefix()
    {
        return 'backendbundle_companyimagetype';
    }
}