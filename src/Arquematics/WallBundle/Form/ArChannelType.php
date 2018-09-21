<?php

namespace Arquematics\WallBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;


class ArChannelType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, array(
                "attr"      => array(
                    "maxlength"     => 20
                 ),
                'required' => true))
                
           ->add('open', CheckboxType::class, array(
                'label'    => 'system.status_label',
                'required' => false))    
            
        ;

    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Arquematics\WallBundle\Entity\ArChannel'
        ));
    }

    public function getBlockPrefix()
    {
        return 'backendbundle_channel';
    }
}
