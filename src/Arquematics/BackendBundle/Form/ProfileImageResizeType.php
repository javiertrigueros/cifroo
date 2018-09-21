<?php

namespace Arquematics\BackendBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;


class ProfileImageResizeType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        
         $builder
            ->add('image_data',  HiddenType::class, array("attr" => array("class" => 'image-resize-data'), "mapped" => false, "required" => true))
            ->add('image',  HiddenType::class, array("attr" => array("class" => 'image-name'), "required" => true))
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