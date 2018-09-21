<?php

namespace Arquematics\WallBundle\Form;

use Doctrine\ORM\EntityRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;

use Symfony\Component\OptionsResolver\OptionsResolver;

use Arquematics\WallBundle\Entity\WallTagEnc;

class TagType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $this->em = $options['entity_manager'];
        
        $builder
            ->add('name', TextType::class, array("required" => true))
            ->add('hash', TextType::class, array("required" => true))
            ->add('hash_small', TextType::class, array("required" => true))
            ->add('pass', TextType::class, array("required" => false, 'mapped' => false))
                
            ->addEventListener(FormEvents::POST_SUBMIT, function (\Symfony\Component\Form\FormEvent $event) {
                
                $form = $event->getForm();
                $obj = $event->getData();
                
                $pass = $form["pass"]->getData();
                
                $passData = json_decode($pass, true);
                if (count($passData) > 0)
                {
                    foreach ($passData as $dataItem)
                    {
                        $wallTagEnc = new WallTagEnc(); 
                        
                        $wallTagEnc->setContent($dataItem['data']);
                      
                        $userEnc = $this->em->getRepository('UserBundle:User')->find($dataItem['id']);
                                
                        $wallTagEnc->setUser($userEnc);
                        
                        $wallTagEnc->setName($form["name"]->getData());
                        
                        $wallTagEnc->setWallTag($obj);
                        
                        $obj->addTagEnc($wallTagEnc);
                        
                        $this->em->persist($wallTagEnc);
                    }
                }
                
            })
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'entity_manager' => null,
            'data_class' => 'Arquematics\WallBundle\Entity\WallTag'
        ));
    }
    
    
    public function getBlockPrefix()
    {
        return 'wallTag';
    }
}