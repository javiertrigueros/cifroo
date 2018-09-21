<?php

namespace Arquematics\WallBundle\Form;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Doctrine\ORM\EntityRepository;

use Arquematics\WallBundle\Entity\ArFile;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;

use Symfony\Component\OptionsResolver\OptionsResolver;

class ArFileExplorerType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $this->authUser = $authUser = $options['user'];
        
        $builder
            ->add('guid', TextType::class, array("required" => true))
            ->add('name', TextType::class, array("required" => true))
            ->add('favorite', TextType::class, array('required' => false,'mapped' => false))  
            ->add('pass', TextType::class, array("required" => false, 'mapped' => false))
                
            //modificar los datos del objeto a guardar
            ->addEventListener(FormEvents::POST_SUBMIT, function (\Symfony\Component\Form\FormEvent $event)
            {
                $form = $event->getForm();
                $obj = $event->getData();
                
                $name = $form["name"]->getData();
                $newName = $obj->getName();
                
                if (($this->authUser->getId() !== $obj->getCreatedBy()->getId())
                    && ($name !== $newName))
                {
                   $form->get('name')->addError(
                    new FormError('No tiene permisos para cambiar el nombre del fichero')
                   ); 
                }
                
                
                $event->setData($obj);
            })
            //el metodo put se agrega como un campo
            //'method' oculto (cosas de symfony)
            ->setMethod('PUT')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'user' => null,
            'data_class' => 'Arquematics\WallBundle\Entity\ArFile'
        ));
    }
    
    public function getBlockPrefix()
    {
        return 'wallbundle_explorer';
    }
}