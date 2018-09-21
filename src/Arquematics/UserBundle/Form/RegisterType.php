<?php

namespace Arquematics\UserBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RegisterType extends AbstractType
{
	public function buildForm(FormBuilderInterface $builder, array $options)
	{
		$builder
			->add('email', RepeatedType::class, array(
				'type'				=> 'email',
				'invalid_message'	=> 'El email tiene que coincidir',
				'required' => true
			))
			->add('password', RepeatedType::class, array(
					'type' => 'password',
					'invalid_message' => 'Las dos contraseñas deben coincidir.',
					'required' => true,
					'options' => array('label' => 'Contraseña')
				)
			)
			;
	}

	public function configureOptions(OptionsResolver $resolver)
	{
		$resolver->setDefaults(array(
			'data_class' => 'Selene\UserBundle\Entity\User'
		));
	}

	public function getBlockPrefix()
	{
		return 'userbundle_registertype';
	}
}