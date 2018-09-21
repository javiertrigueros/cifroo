<?php

namespace Arquematics\UserBundle\Form;

use Doctrine\ORM\EntityRepository;
use Arquematics\UserBundle\Entity\UserRole;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;

use Arquematics\UserBundle\Entity\Profile;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, array(
                    "attr"      => array(
                        "label" => "user_form.name",
                        "minlength"     => 2,
                        "maxlength"     => 35
                    )
                ))
            ->add('lastname', TextType::class, array(
                    'mapped' => false,
                    "required"  => true,
                    "attr"      => array(
                        "label" => "user_form.lastname",
                        "minlength"     => 2,
                        "maxlength"     => 50
                    )
                
                ))
            ->add('email', EmailType::class, array(
                "label" => "user_form.email",
                'required' => true
                ))
            ->add('user_roles', 
                EntityType::class, 
                array(
                    'label' => "user_form.roles",
                    'expanded' => false,
                    'multiple' => true,
                    'required' => false,
                    'class' => 'UserBundle:UserRole',
                    'query_builder' => function(EntityRepository $er) {
                        return $er->createQueryBuilder('p')
                        ->where("p.active = true")
                        ->orderBy('p.id', 'ASC')
                        ;
                    }
                ))
                    
            ->addEventListener(FormEvents::POST_SUBMIT, function (\Symfony\Component\Form\FormEvent $event)
            {  
                $form = $event->getForm();
                $obj = $event->getData();
             
                //$obj->setName(trim($form["name"]->getData()));
                $obj->setConfirmationHash(md5(time() + rand()));
                $obj->setConfirmed(0);
                $obj->setActived(true);
                $obj->setCreatedAt(new \DateTime('now'));
                $obj->setSlug($form["name"]->getData());
                
                $event->setData($obj);
            })
        ;
    }
    
    

    public function getBlockPrefix()
    {
        return 'backendbundle_usertype';
    }
}