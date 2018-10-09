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

class DirectMessageType extends AbstractType
{
    private $authUser;
    private $sendTo;
    
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $this->authUser = $authUser = $options['user'];
        $this->sendTo = $sendTo = $options['send_to'];
        $this->em = $options['entity_manager'];
        
        $builder
            ->add('content', TextType::class, array("required" => true, "attr" => array("maxlength" => 800)))
            ->add('pass', TextType::class, array("required" => false, 'mapped' => false))
                
            //modificar los datos del objeto a guardar
            ->addEventListener(FormEvents::POST_SUBMIT, function (\Symfony\Component\Form\FormEvent $event) use ($authUser, $sendTo)
            {  
                $form = $event->getForm();
                $obj = $event->getData();
                
                $pass = $form["pass"]->getData();
                
                $passData = json_decode($pass, true);
                
                if (count($passData) > 0)
                {
                    foreach ($passData as $dataItem)
                    {
                        $userEnc = $this->em->getRepository('UserBundle:User')->find($dataItem['id']);
                        if ($userEnc->getId() == $authUser->getId())
                        {      
                            $obj->setUserPass($dataItem['data']);
                        }
                        else if ($userEnc->getId() == $sendTo->getId()) 
                        {
                            $obj->setSendToPass($dataItem['data']);
                        }
                        
                    }
                }
                
                $obj->setSendTo($sendTo);
                $obj->setCreatedBy($this->authUser);
                
                $event->setData($obj);
            })
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'user' => null,
            'send_to' => null,
            'entity_manager' => null,
            'data_class' => 'Arquematics\WallBundle\Entity\DirectMessage',
        ));
    }
    
   
    
    
    public function getBlockPrefix()
    {
        return 'wallbundle_wall';
    }
}