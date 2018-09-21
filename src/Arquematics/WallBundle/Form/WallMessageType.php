<?php

namespace Arquematics\WallBundle\Form;


use \Arquematics\WallBundle\Entity\WallMessageEnc;

use Doctrine\ORM\EntityRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvents;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;

use Symfony\Component\OptionsResolver\OptionsResolver;

use Doctrine\ORM\EntityManagerInterface;

class WallMessageType extends AbstractType
{
    private $list;
    private $authUser;
    
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $this->authUser = $authUser = $options['user'];
        $this->channel = $channel = $options['channel'];
        $this->em = $options['entity_manager'];
        
        $builder
            ->add('content', TextType::class, array("required" => true, "attr" => array("maxlength" => 800)))
            ->add('pass', TextType::class, array("required" => false, 'mapped' => false))
                
            //modificar los datos del objeto a guardar
            ->addEventListener(FormEvents::POST_SUBMIT, function (\Symfony\Component\Form\FormEvent $event) use ($authUser, $channel)
            {  
                $form = $event->getForm();
                $obj = $event->getData();
                
                $pass = $form["pass"]->getData();
                
                $passData = json_decode($pass, true);
                
                if (count($passData) > 0)
                {
                    foreach ($passData as $dataItem)
                    {
                        $wallMessageEnc = new WallMessageEnc(); 
                        
                        $wallMessageEnc->setContent($dataItem['data']);
                      
                        $userEnc = $this->em->getRepository('UserBundle:User')->find($dataItem['id']);
                                
                        $wallMessageEnc->setUser($userEnc);
                        
                        $wallMessageEnc->setWallMessage($obj);
                        
                        $obj->addWallEnc($wallMessageEnc);
                        
                        $this->em->persist($wallMessageEnc);
                    }
                }
                
                $channel->addMessage($obj);
                $obj->addChannel($channel);
                $this->em->persist($channel);
               
                $obj->setCreatedBy($this->authUser);
                
                $event->setData($obj);
            })
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'user' => null,
            'channel' => null,
            'entity_manager' => null,
            'data_class' => 'Arquematics\WallBundle\Entity\WallMessage',
        ));
    }
    
   
    
    
    public function getBlockPrefix()
    {
        return 'wallbundle_wall';
    }
}