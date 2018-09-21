<?php

namespace Arquematics\WallBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

use Arquematics\WallBundle\Entity\WallList;
use Arquematics\WallBundle\Entity\ArChannel;

class appListCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('app:list')
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

        //inicio lista wall
        //el orden es importante
        $wallList = new WallList;
        $wallList->setId(WallList::TWITTER);
        $wallList->setName('Twitter');
        $wallList->setSocialType(true);
        $em->persist($wallList);
        
        $wallList = new WallList;
        $wallList->setId(WallList::FACEBOOK);
        $wallList->setName('Facebook');
        $wallList->setSocialType(true);
        $em->persist($wallList);
        
        $wallList = new WallList;
        $wallList->setId(WallList::LINKEDIN);
        $wallList->setName('Linkedin');
        $wallList->setSocialType(true);
        $em->persist($wallList);
        
        $wallList = new WallList;
        $wallList->setId(WallList::GENERAL);
        $wallList->setName('Main');
        $wallList->setSocialType(false);
        $em->persist($wallList);
        
        $em->flush();
        
        $wallList = new ArChannel();
        $wallList->setId(WallList::GENERAL);
        $wallList->setName('channel.main');
        $em->persist($wallList);
        
        $em->flush();
        
        

        //Feedback
        $output->writeln('<info>Listas Inicializadas.</info>');
    }

}