<?php

namespace Arquematics\BackendBundle\Command;

use BackupManager\Filesystems\Destination;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;

use Symfony\Component\Console\Input\InputInterface;

use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;

use Symfony\Component\Filesystem\Filesystem;


class appRestoreCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('app:restore')
            ->setDefinition(array())
            ->addArgument('date', InputArgument::REQUIRED, '')
            ->setDescription("This command restore backup point.")
            ->setHelp("This command restore backup point.");
    }
    
   
    
    protected function copyDir($source, $dest)
    {
        @mkdir($dest, 0755);
        foreach ($iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($source, \RecursiveDirectoryIterator::SKIP_DOTS),\RecursiveIteratorIterator::SELF_FIRST) as $item) 
        {
            if ($item->isDir()) {
                @mkdir($dest . DIRECTORY_SEPARATOR . $iterator->getSubPathName());
            } else {
                @copy($item, $dest . DIRECTORY_SEPARATOR . $iterator->getSubPathName());
            }
        }
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();

        $currentDate = $input->getArgument('date');
        $basePath = $container->getParameter('backup_path').DIRECTORY_SEPARATOR.$container->getParameter('database_name');
        $path = $basePath.DIRECTORY_SEPARATOR.'backup'.DIRECTORY_SEPARATOR.$currentDate;
        
        $fs = new Filesystem();
        
        try 
        {
            if (!$fs->exists($basePath))
            {
                $fs->mkdir($basePath, 0770);
                $fs->chown($basePath, 'www-data', true);
                $fs->chgrp($basePath, 'www-data', true);
            }
            
            if (!$fs->exists($path))
            {
                $fs->mkdir($path, 0770);
                $fs->chown($path, 'www-data', true);
                $fs->chgrp($path, 'www-data', true);
            }
               

            $mysqlFilePath = $container->getParameter('database_name').DIRECTORY_SEPARATOR.'backup'.DIRECTORY_SEPARATOR.$currentDate.DIRECTORY_SEPARATOR.'mysql.sql';
          
            
            $container->get('backup_manager')->makeRestore()->run('local', $mysqlFilePath, 'development', 'null');
            
            $fs->chown($path, 'www-data', true);
            $fs->chgrp($path, 'www-data', true);
            $output->writeln('<info>Backup restaurado con éxito.</info>');
            
        } catch (IOExceptionInterface $e) {

            $output->writeln('<info>An error occurred while creating Backup</info>');
        }
    }

}