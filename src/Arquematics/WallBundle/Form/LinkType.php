<?php

namespace Arquematics\WallBundle\Form;

use Doctrine\ORM\EntityRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;

use Symfony\Component\OptionsResolver\OptionsResolver;

use \Arquematics\WallBundle\Entity\WallLinkEnc;

class LinkType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $this->authUser = $options['user'];
        $this->em = $options['entity_manager'];
        
        $builder
            ->add('oembed', TextType::class, array("required" => true))
            ->add('title', TextType::class, array("required" => true))
            ->add('thumb', TextType::class, array("required" => true))
            ->add('description', TextType::class, array("required" => true))
            ->add('provider', TextType::class, array("required" => true))
            ->add('url', TextType::class, array("required" => true))
            ->add('urlquery', TextType::class, array("required" => true))
            ->add('oembedtype', TextType::class, array("required" => true)) 
            ->add('pass', TextType::class, array("required" => false, 'mapped' => false))
           
            ->addEventListener(FormEvents::POST_SUBMIT, function (\Symfony\Component\Form\FormEvent $event) {
                
                $form = $event->getForm();
                $obj = $event->getData();
                
                
                $obj->setCreatedBy($this->authUser);
                
                $pass = $form["pass"]->getData();
                
                $passData = json_decode($pass, true);
                
                //guarda la pass codificadas con el usuario y mensaje
                
                if (count($passData) > 0)
                {
                    foreach ($passData as $dataItem)
                    {
                        $wallLinkEnc = new WallLinkEnc();
                        
                        $wallLinkEnc->setContent($dataItem['data']);
                      
                        $userEnc = $this->em->getRepository('UserBundle:User')->find($dataItem['id']);
                                
                        $wallLinkEnc->setUser($userEnc);
                        
                        $wallLinkEnc->setWallLink($obj);
                        
                        $obj->addLinkEnc($wallLinkEnc);
                        
                        $this->em->persist($wallLinkEnc);
                    }
                }
                
                $event->setData($obj);
            })
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'user' => null,
            'entity_manager' => null,
            'data_class' => 'Arquematics\WallBundle\Entity\WallLink'
        ));
    }
    
    
    public function getBlockPrefix()
    {
        return 'wallLink';
    }
}