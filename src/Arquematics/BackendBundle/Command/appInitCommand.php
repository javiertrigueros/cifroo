<?php

namespace Arquematics\BackendBundle\Command;

use Arquematics\UserBundle\Entity\Profile;
use Arquematics\UserBundle\Entity\User;
use Arquematics\UserBundle\Entity\UserRole;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class appInitCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('app:init')
            ->setDefinition(array())
            ->setDescription("This command create project structure and configure it for first time.")
            ->setHelp("This command create project structure and configure it for first time.");
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();
        $em = $container->get('doctrine')->getEntityManager();

        //add default user roles
        $configurador = new UserRole; //Configurador
        $configurador->setName("Configurador");
        $configurador->setActive(true);
        
        $em->persist($configurador);

        //antes de crear cualquier usuario
        //Init list
        $command = $this->getApplication()->find('app:list');
        $command->run($input, $output);
        
        //add default user
        $admin = new User;
        $admin->setName("Administrador");
        $admin->setEmail($container->getParameter('user_admin'));
        $admin->setPassword($container->getParameter('user_password')); //Default password
        
        $encoder = $container->get('security.password_encoder');
        $encoded = $encoder->encodePassword($admin, $admin->getPassword());
        $admin->setPassword($encoded);
        
        $admin->setConfirmed(true);
        $admin->setActived(true);
        $admin->addUserRole($configurador);
        $em->persist($admin);
        $em->flush();

        $profile = new Profile;
        $profile->setName("Administrador");
        $profile->setLastname("Raf6");
        $profile->setId($admin->getId());
        $profile->setUser($admin);
        $profile->setNotify(true);
        $em->persist($profile);
        $em->flush();
        
        //Feedback
        $output->writeln('<info>Proyecto configurado con éxito. Ya puedes empezar a usar la aplicación.</info>');
    }

}