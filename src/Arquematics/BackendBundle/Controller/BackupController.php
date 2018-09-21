<?php

namespace Arquematics\BackendBundle\Controller;

use Arquematics\BackendBundle\Utils\ArController;

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;

use Symfony\Component\Filesystem\Exception\IOExceptionInterface;

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class BackupController extends ArController
{
    
    private function getLastYearRestorepoints()
    {
        $path =  $this->container->getParameter('backup_path').DIRECTORY_SEPARATOR.$this->container->getParameter('database_name').DIRECTORY_SEPARATOR.'backup';
        
        $ret = array();
        $finder = new Finder();
        $finder->files()
               ->in($path)
               ->depth('== 0')
               ->directories()
               ->sort(
                    function ($a, $b) {
                        return ($b->getMTime() - $a->getMTime());
                    }
                );
        
        if (count($finder) > 0)
        {
          $currentYear = date("Y");
          
          foreach ($finder as $file) 
          {
              
               $data = explode("-", basename($file));
              
               $year    = $data[0];
               $mo      = $data[1];
               $day     = $data[2];
               $hour    = $data[3];
               $min     = $data[4];
               $seg     = $data[5];
               
               $type = false;
               if (isset($data[6]))
               {
                 $type =  $data[6]; 
               }
               
               if (($currentYear == $year)
                 && ($type && ($type == 'bkp')))
               {
                $ret[] =  array(
                   'name' => basename($file),
                   'friend_name' => $year.'-'.$mo.'-'.$day.' '.$hour.':'.$min.':'.$seg
                );  
              }
               
          }
        }
        
        return $ret;
        
    }
    
    private function getRestorepoints()
    {
        $path =  $this->container->getParameter('backup_path').DIRECTORY_SEPARATOR.$this->container->getParameter('database_name').DIRECTORY_SEPARATOR.'backup';
        
        $ret = array();
        $finder = new Finder();
        $finder->files()
               ->in($path)
               ->depth('== 0')
               ->directories()
               ->sort(
                    function ($a, $b) {
                        return ($b->getMTime() - $a->getMTime());
                    }
                );
        
        if (count($finder) > 0)
        {
            
          foreach ($finder as $file) 
          {
              
               $data = explode("-", basename($file));
              
               $year    = $data[0];
               $mo      = $data[1];
               $day     = $data[2];
               $hour    = $data[3];
               $min     = $data[4];
               $seg     = $data[5];
               
               $type = false;
               if (isset($data[6]))
               {
                 $type =  $data[6]; 
               }
               
               if ($type && ($type == 'bkp'))
               {
                  $ret[] =  array(
                   'name' => basename($file),
                   'isUser' => true,
                   'friend_name' => $year.'-'.$mo.'-'.$day.' '.$hour.':'.$min.':'.$seg
                 );  
               }
               /*else
               {
                  $ret[] =  array(
                   'name' => basename($file),
                   'isUser' => false,
                   'friend_name' => $year.'-'.$mo.'-'.$day.' '.$hour.':'.$min.':'.$seg
                 );   
               }   */
          }
        }
        
        return $ret;
    }
    
    
    public function deleteAllAction(Request $request)
    {
        if (!$this->checkView($request) 
            || !$this->authUser->isConfigurador())
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        if ($request->getMethod() == 'GET')
        {
            $directories = $this->getRestorepoints();
            
            if (count($directories) > 0)
            {
                $hasErrors = false;
                
                try 
                { 
                    foreach ($directories as $directoryData) 
                    {
                        //solo borrar los puntos de restauración
                        //de usuario
                        if ((!$hasErrors) && $directoryData['isUser'])
                        {
                            $hasErrors = !$this->deleteFile($directoryData['name']);
                        }
                        else if ($hasErrors)
                        {
                            break; 
                        }
                    }
                    
                    if (!$hasErrors)
                    {
                        $this->get('session')
                        ->getFlashBag()
                        ->add('success', $this->get('translator')->trans("backup.delete_mensaje_all"));   
                    }
                    else
                    {
                        $this->get('session')
                        ->getFlashBag()
                        ->add('danger', $this->get('translator')->trans("backup.delete_mensaje_error_all"));   
                    }
                
                } catch (IOExceptionInterface $ex) {
                       $this->get('session')
                       ->getFlashBag()
                       ->add('danger', $this->get('translator')->trans("backup.delete_mensaje_error_all"));  
                }
            }
        }
        
        return $this->redirect($this->generateUrl('system_backup'));
    }
    
    
    public function restoreAction($backup_date, Request $request)
    {
        
        if (!$this->checkView($request) || !$this->authUser->isConfigurador())
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        if ($request->getMethod() == 'POST')
        {
            list($year, $mo, $day, $hour, $min, $seg) =  explode("-", basename($backup_date));
            
            $data = explode("-", basename($backup_date));
              
            $year    = $data[0];
            $mo      = $data[1];
            $day     = $data[2];
            $hour    = $data[3];
            $min     = $data[4];
            $seg     = $data[5];
               
            if (isset($data[6]))
            {
               $type = $data[6]; 
               $backup_date = $year.'-'.$mo.'-'.$day.'-'.$hour.'-'.$min.'-'.$seg.'-'.$type;
            }
            else
            {
              $backup_date = $year.'-'.$mo.'-'.$day.'-'.$hour.'-'.$min.'-'.$seg;     
            }

            $backup_date_mensaje = $year.'-'.$mo.'-'.$day.' '.$hour.':'.$min.':'.$seg;
            
            $kernel = $this->get('kernel');
            $application = new Application($kernel);
            $application->setAutoExit(false);

            $input = new ArrayInput(array(
            'command' => 'app:restore',
             'date' => $backup_date
            ));
            
            $output = new NullOutput();
            $application->run($input, $output);
            
            $this->get('session')
                    ->getFlashBag()
                    ->add('success', $this->get('translator')->trans("backup.restore_mensaje"). '&nbsp;'. $backup_date_mensaje);
            
            $response = new JsonResponse();
            $response->setData(array());
            
            return $response;
        }
        else
        {
           $response = new Response();
           $response->setStatusCode(404);
           return $response;
        }
    }
    
    public function downloadAction($backup_date, Request $request)
    {
        if (!$this->checkView($request) 
            || !$this->authUser->isConfigurador())
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        if ($request->getMethod() == 'GET')
        {
            $data = explode("-", basename($backup_date));
              
            $year    = $data[0];
            $mo      = $data[1];
            $day     = $data[2];
            $hour    = $data[3];
            $min     = $data[4];
            $seg     = $data[5];
               
            if (isset($data[6]))
            {
               $type = $data[6]; 
               $backup_date = $year.'-'.$mo.'-'.$day.'-'.$hour.'-'.$min.'-'.$seg.'-'.$type;
            }
            else
            {
              $backup_date = $year.'-'.$mo.'-'.$day.'-'.$hour.'-'.$min.'-'.$seg;     
            }
            
            
            $basePath = $this->container->getParameter('backup_path').DIRECTORY_SEPARATOR.$this->container->getParameter('database_name');
            $path = $basePath.DIRECTORY_SEPARATOR.'backup'.DIRECTORY_SEPARATOR.$backup_date;
        
            $fs = new Filesystem();
            try 
            {
                if ($fs->exists($path))
                {

                    $fileName = $path.DIRECTORY_SEPARATOR.'mysql.sql';
                    
                    
                    $response = new Response();

                    // Set headers
                    $response->headers->set('Cache-Control', 'private');
                    $response->headers->set('Content-type', mime_content_type($fileName));
                    $response->headers->set('Content-Disposition', 'attachment; filename="' . $backup_date . '.mysql.sql";');
                    $response->headers->set('Content-length', filesize($fileName));

                    // Send headers before outputting anything
                    $response->sendHeaders();

                    $response->setContent(file_get_contents($fileName ));
                  
                    return $response;
                }
            } 
            catch (IOExceptionInterface $e)
            {
                
            }
        }
        
        return $this->redirect($this->generateUrl('system_backup'));
    }
    
    private function deleteFile ($backup_date)
    {
        $ret = false;
        
        list($year, $mo, $day, $hour, $min, $seg) =  explode("-", basename($backup_date));
            
        $backup_date = $year.'-'.$mo.'-'.$day.'-'.$hour.'-'.$min.'-'.$seg;
        $basePath = $this->container->getParameter('backup_path').DIRECTORY_SEPARATOR.$this->container->getParameter('database_name');
        $path = $basePath.DIRECTORY_SEPARATOR.'backup'.DIRECTORY_SEPARATOR.$backup_date.'-bkp';
        
        $fs = new Filesystem();
        
        if ($fs->exists($path))
        {
            $fs->remove($path);
            $ret = true;
        }
        
        return $ret;
    }
    
    
    public function deleteAction($backup_date, Request $request)
    {
        if (!$this->checkView($request) || !$this->authUser->isConfigurador())
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        if ($request->getMethod() == 'GET')
        {
            try 
            {
                if ($this->deleteFile($backup_date))
                {
                  $this->get('session')
                    ->getFlashBag()
                    ->add('success', $this->get('translator')->trans("backup.delete_mensaje"));
                } 
                else 
                {
                   $this->get('session')
                    ->getFlashBag()
                    ->add('danger', $this->get('translator')->trans("backup.delete_mensaje_error")); 
                }
            } catch (IOExceptionInterface $e) {
                $this->get('session')
                    ->getFlashBag()
                    ->add('danger', $this->get('translator')->trans("backup.delete_mensaje_error")); 
            }
        }
        
        return $this->redirect($this->generateUrl('system_backup'));
    }
    
    public function listAction(Request $request)
    {
        if (!$this->checkView($request) || !$this->authUser->isConfigurador())
        {
          return $this->redirect($this->generateUrl('homepage'));  
        }
        
        $maxRestorePoint = $this->container->getParameter('arquematics.max_restore_points');
        $lastYearRestorepoints = count($this->getLastYearRestorepoints());
        $canMakeRestorePoint = $lastYearRestorepoints < $maxRestorePoint; 
        
        if ($canMakeRestorePoint && 
            $request->getMethod() == 'POST')
        {
            $kernel = $this->get('kernel');
            $application = new Application($kernel);
            $application->setAutoExit(false);

            $input = new ArrayInput(array(
            'command' => 'app:backup'
            ));
            $output = new NullOutput();
            $application->run($input, $output);
            
            $this->get('session')
                    ->getFlashBag()
                    ->add('success', $this->get('translator')->trans("backup.add_mensaje"));

            $lastYearRestorepoints++;
            
            if ($lastYearRestorepoints >= $maxRestorePoint)
            {
               $this->get('session')
                    ->getFlashBag()
                    ->add('danger', $this->get('translator')->trans("backup.limit_last_restore"));
  
            }
            
            $response = new JsonResponse();
            $response->setData(array());
            
            return $response;
        }
        
       

        return $this->render('BackendBundle:Backup:list.html.twig',
                array(
                    "directories" => $this->getRestorepoints(),
                    'canMakeRestorePoint' => $canMakeRestorePoint,
                    "menuItem" => 'backup',
                    "menuSection" => 'control_panel'
                ));
    }
   

}
