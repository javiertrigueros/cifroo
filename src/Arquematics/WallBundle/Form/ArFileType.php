<?php

namespace Arquematics\WallBundle\Form;

use Arquematics\WallBundle\Utils\ARMimeTypes;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;

use \Arquematics\WallBundle\Entity\ArFileEnc;

use Symfony\Component\Form\FormError;


use Symfony\Component\OptionsResolver\OptionsResolver;

class ArFileType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $this->authUser = $authUser = $options['user'];
        $this->em = $options['entity_manager'];
        
        $builder
            ->add('src', TextType::class, array("required" => true))
            ->add('name', TextType::class, array("required" => true))
            ->add('docType', TextType::class, array("required" => true))
            ->add('guid', TextType::class, array("required" => true))
            ->add('size', TextType::class, array("required" => true))
            ->add('hash', TextType::class, array("required" => true))
            ->add('hashSmall', TextType::class, array("required" => true))
            ->add('pass', TextType::class, array("required" => false, 'mapped' => false))
            ->add('document', FileType::class, array('required' => false,'mapped' => false))   
                
            //modificar los datos del objeto a guardar
            ->addEventListener(FormEvents::POST_SUBMIT, function (\Symfony\Component\Form\FormEvent $event)
            {
                $form = $event->getForm();
                $obj = $event->getData();
                $obj->setGroupType(ARMimeTypes::toGroup($obj->getDocType()));
                $obj->setCreatedBy($this->authUser);
                
                $pass = $form->get('pass')->getData();
                
                $passData = json_decode($pass, true);
                
                if (is_array($passData) &&  count($passData) > 0)
                {
                    foreach ($passData as $dataItem)
                    {
                        $arFileEnc = new ArFileEnc();
                        $arFileEnc->setContent($dataItem['data']);
                      
                        $userEnc = $this->em->getRepository('UserBundle:User')->find($dataItem['id']);     
                        $arFileEnc->setUser($userEnc);
                        
                        $arFileEnc->setArFile($obj);
                        
                        $obj->addArFileEncs($arFileEnc);
                        
                        $this->em->persist($arFileEnc);
                    }
                    
                    $event->setData($obj);
                }
                else
                {
                    $form->get('pass')->addError(new FormError('error no pass field'));
                }
                
                
            })
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'user' => null,
            'entity_manager' => null,
            'data_class' => 'Arquematics\WallBundle\Entity\ArFile'
        ));
    }
    
   
    
    
    public function getBlockPrefix()
    {
        return 'wallbundle_file';
    }
}