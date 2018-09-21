<?php

namespace Arquematics\WallBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;

use Symfony\Component\OptionsResolver\OptionsResolver;

use Arquematics\WallBundle\Entity\WallCommentEnc;

class CommentType extends AbstractType
{
    /*
    public function __construct ($optionsArray)
    {
        $this->authUser = $optionsArray['user'];
        $this->message = $optionsArray['message'];
    }*/

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $this->authUser = $options['user'];
        $this->message =  $options['message'];
        $this->em = $options['entity_manager'];
 
        $builder
            ->add('content', TextType::class, array("required" => true, "attr" => array("maxlength" => 280)))
            ->add('pass', TextType::class, array("required" => false, 'mapped' => false))
            //aqui para modificar los datos
            /*
            ->addEventListener(FormEvents::PRE_SUBMIT, function (\Symfony\Component\Form\FormEvent $event) {
                
                $form = $event->getForm();
                $obj = $event->getData();
                
                
                $obj->setCreatedBy($this->authUser);
                
                $event->setData($obj);
                
                
            })*/
            //modificar los datos del objeto a guardar
            ->addEventListener(FormEvents::POST_SUBMIT, function (\Symfony\Component\Form\FormEvent $event) {
                
                $form = $event->getForm();
                $obj = $event->getData();
                
                $pass = $form["pass"]->getData();
                
                $passData = json_decode($pass, true);
                
                if (count($passData) > 0)
                {
                    foreach ($passData as $dataItem)
                    {
                        $wallCommentEnc = new WallCommentEnc();
                           
                        $wallCommentEnc->setContent($dataItem['data']);
                      
                        $userEnc = $this->em->getRepository('UserBundle:User')->find($dataItem['id']);
                                
                        $wallCommentEnc->setUser($userEnc);
                        
                        $wallCommentEnc->setComment($obj);
                        
                        $obj->addCommentEnc($wallCommentEnc);
                        
                        $this->em->persist($wallCommentEnc);
                    }
                    
                }
                
                $obj->setCreatedBy($this->authUser);
                $obj->setMessage($this->message);

                $event->setData($obj);
            })
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'user' => null,
            'message'  => null,
            'entity_manager' => null,
            'data_class' => 'Arquematics\WallBundle\Entity\WallComment'
        ));
    }
    
    
    public function getBlockPrefix()
    {
        return 'wallbundle_comment';
    }
}