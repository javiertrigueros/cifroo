<?php

namespace Arquematics\WallBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;

use Symfony\Component\OptionsResolver\OptionsResolver;

class ArFilePreviewType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $this->arFile = $options['arFile'];
        
        $builder
            ->add('src', TextType::class, array("required" => true))
            ->add('docType', TextType::class, array("required" => true))
            ->add('style', TextType::class, array("required" => true))
            ->add('guid', TextType::class, array("required" => true))
            ->add('size', TextType::class, array("required" => true))
            ->add('pass', TextType::class, array(
                            'required' => false,
                            'mapped' => false))
            //modificar los datos del objeto a guardar
            ->addEventListener(FormEvents::POST_SUBMIT, function (\Symfony\Component\Form\FormEvent $event)
            {
                //$form = $event->getForm();
                $obj = $event->getData();
                
                $obj->setArFile($this->arFile);
                
                $event->setData($obj);
            })
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'arFile' => null,
            'data_class' => 'Arquematics\WallBundle\Entity\ArFilePreview'
        ));
    }

    public function getBlockPrefix()
    {
        return 'wallbundle_file_preview';
    }
}