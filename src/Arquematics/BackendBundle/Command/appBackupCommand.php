<?php

namespace Arquematics\BackendBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;

use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;

use Symfony\Component\Filesystem\Filesystem;

use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;


class appBackupCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('app:backup')
            ->setDefinition(array())
            ->setDescription("This command create backup point.")
            ->setHelp("This command create backup point.");
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
    
    private function getDumpCommandLine($outputPath) {
    	
        $container = $this->getContainer();
         
    	$command = 'mysqldump --max_allowed_packet=2G --routines --single-transaction --host=%s --port=%s --user=%s --password=%s %s > %s';
        return sprintf($command,
            $container->getParameter('database_host'),
            $container->getParameter('database_port'),
            $container->getParameter('database_user'),
            $container->getParameter('database_password'),
            $container->getParameter('database_name'),
            $outputPath
        );
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $container = $this->getContainer();

        $currentDate = date("Y-m-d-H-i-s");
        $basePath = $container->getParameter('backup_path').DIRECTORY_SEPARATOR.$container->getParameter('database_name');
        $path = $basePath.DIRECTORY_SEPARATOR.'backup'.DIRECTORY_SEPARATOR.$currentDate.'-bkp';
        
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
                
                        
            $mysqlFilePath = $path.DIRECTORY_SEPARATOR.'mysql.sql';
            
            $process = new Process($this->getDumpCommandLine($mysqlFilePath));
            
            $process->run();

            // executes after the command finishes
            if (!$process->isSuccessful()) {
                throw new ProcessFailedException($process);
            }
            
            //$container->get('backup_manager')->makeBackup()->run('development', [new Destination('local', $mysqlFilePath)], 'null');
            
            $fs->chown($mysqlFilePath, 'www-data', true);
            $fs->chgrp($mysqlFilePath, 'www-data', true);
            $output->writeln('<info>Backup realizado con éxito:</info> '.$mysqlFilePath);
            
        } catch (IOExceptionInterface $e) {
            $output->writeln('<info>An error occurred while creating Backup</info>');
            $output->writeln("<info>$path</info>");
        }
        catch (ProcessFailedException $e) {
           $output->writeln('<info>An error occurred while exec mysqldump</info>'); 
           $output->writeln('<info>'.$this->getDumpCommandLine($mysqlFilePath).'</info>'); 
        }
    }

}