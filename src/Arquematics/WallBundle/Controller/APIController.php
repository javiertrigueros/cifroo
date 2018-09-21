<?php

namespace Arquematics\WallBundle\Controller;

use CloudConvert\Api;

use Arquematics\WallBundle\Entity\ArFile;
use Arquematics\WallBundle\Utils\ArRemoteMediaExtractor;
use Arquematics\BackendBundle\Utils\ArController;

use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class APIController extends ArController
{
    public function sendPublicKeyAction(Request $request)
    {
        if (($request->getMethod() !== 'POST')
            || (!$this->checkView($request)))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response; 
        }
        
        $data = $request->request->all();        
        $publicKey = $data['public_key'];
        
        $this->authUser->setPublicKey($publicKey);
        
        $this->em->persist($this->authUser);
        $this->em->flush();
        
        $response = new JsonResponse();
        $response->setData(array('public_key' => $publicKey));
            
        return $response;  
        
    }
    public function sendPublicAndPrivateKeyAction(Request $request)
    {
        if (($request->getMethod() !== 'POST')
            || (!$this->checkView($request)))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response; 
        }
        
        $mailPrivateKey = openssl_pkey_get_private(base64_decode($this->authUser->getMailPrivateKey()));
        
        $data = $request->request->all();        
        $privateKey = json_decode(base64_decode($data['private_key']), true);
        
        $keyEncode = '';
        $statusError = false;
        foreach ($privateKey as $dataItem)
        {
            //jSEncrypt.encrypt pasa el contenido a base64 aunque no digas nada
            $data64chars = base64_decode(base64_decode($dataItem['data']));
            
            $decryptData64 = '';
                  
            if (openssl_private_decrypt($data64chars, $decryptData64, $mailPrivateKey))
            {
               $keyEncode .= $decryptData64."\n";
            }
            else 
            {
                $statusError = true;
            }
        }
        openssl_free_key($mailPrivateKey);
        
        if (!$statusError)
        {
           $this->sendPrivateKeyEmail($keyEncode);
        }
        
        $response = new JsonResponse();
        $response->setData($statusError);
            
        return $response; 
    }
    
    private function sendPrivateKeyEmail($keyEncode)
    {
        $emailBody = $this->renderView(
            'WallBundle:Emails:send_private_key.html.twig',
            array(
                "pagename" => $this->container->getParameter('pagename'),
                "keyEncode" => $keyEncode
            )
        );

        $message =\Swift_Message::newInstance()
                            ->setSubject($this->get('translator')->trans("mail.private_key_subject", array('%pagename%' => $this->container->getParameter('pagename'))))
                            ->setFrom($this->container->getParameter('notifications_email'))
                            ->setTo($this->authUser->getEmail())
                            ->setBody($emailBody, "text/html");

        $this->container->get('mailer')->send($message);
    }
    
    private function generateMailKeys()
    {
    
      $config = array(
        "digest_alg" => "sha512",
        "private_key_bits" => 1024,
        "private_key_type" => OPENSSL_KEYTYPE_RSA,
      );
   
        // Create the private and public key
        $res = openssl_pkey_new($config);

        $privKey = '';
        // Extract the private key from $res to $privKey
        openssl_pkey_export($res, $privKey);

        // Extract the public key from $res to $pubKey
        $pubKey = openssl_pkey_get_details($res);
    
        openssl_pkey_free($res);
    
        return array('public' => $pubKey["key"], 'private' => $privKey);
    }
    
    public function requestPrivateKeyMailAction(Request $request)
    {
        if (($request->getMethod() !== 'POST')
            || (!$this->checkView($request)))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response; 
        }
        
        $keys = $this->generateMailKeys();
        
        $public_key = base64_encode($keys['public']);
        $this->authUser->setMailPublicKey($public_key);
        $this->authUser->setMailPrivateKey(base64_encode($keys['private']));
        
        $this->em->persist($this->authUser);
        $this->em->flush();
        
        $response = new JsonResponse();
        $response->setData(array('public_key' => $public_key));
            
        return $response;  
    }
    
    public function userinfoAction(Request $request)
    {
        if (($request->getMethod() !== 'GET')
            || (!$this->checkView($request)))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response; 
        }
        
        $friends = array_merge($this->em->getRepository('UserBundle:User')->findByFriend($this->authUser), array($this->authUser));
        $friendsData = [];
        
        foreach ($friends as $friend)
        {
           $friendsData[] = array('id' => $friend->getId(),
                                  'public_key' => $friend->getPublicKey());
        }
        
        $currenUserProfile = $this->authUser->getProfile();
        
        $info = array(
            'user' => array('id' => $this->userid,
                            'url' => $this->generateUrl('user_profile_edit'),
                            'name' => ucfirst($currenUserProfile->getName()),
                            'hasPublicKey' => ($this->authUser->getPublicKey() !== null),
                            'publicKey' => $this->authUser->getPublicKey(),
                            'public_keys' => $friendsData,
                            'completeName'  =>  ucfirst($currenUserProfile->getName()).' '.ucfirst($currenUserProfile->getLastname()),
                            'image' => ($currenUserProfile->getImage())? $this->generateUrl('user_profile_avatar', array('fileName' => $currenUserProfile->getImage())) 
                                        :  $this->get('assets.packages')
                                                ->getUrl('bundles/user/img/avatars/unknown.png', $packageName = null)
                ),
            'lang'          => $this->culture,
            'sessionname'   => $this->container->getParameter('sessionname')
        );
        
        $response = new JsonResponse();
        $response->setData($info);
        return $response;
    }

    public function filePreviewAction(Request $request, $inputformat, $outputformat)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        if (($request->getMethod() !== 'GET')
               || !(ArFile::isValidInputConversionExt($inputformat) 
                      && ArFile::isValidOutputConversionExt($outputformat)))
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response; 
        }
        
        $api = new Api($this->container->getParameter('arquematics.cloud_convert_api'));
        
        $response = new JsonResponse();
        $response->setData($api->createProcess([
                    'inputformat' => $inputformat,
                    'outputformat' => $outputformat,
                ]));
        return $response; 
        
    }
    
    public function selectSocialPageAction(Request $request, $id)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        
        if (($request->getMethod() !== 'POST'))
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response; 
        }
        
        $selectedPage = $this->em->getRepository('WallBundle:SocialPage')
                        ->findByUser($this->authUser, $id);
        
        
        if ($selectedPage && is_object($selectedPage))
        {
            foreach($this->authUser->getSocialPages() as $page)
            {
                if ($selectedPage->getSelected())
                {
                    $page->setSelected(false);
                }
                else 
                {
                    $page->setSelected($page->getId() == $selectedPage->getId());
                    //ha seleccionado la pagina
                    if ($page->getId() == $selectedPage->getId())
                    {
                      $this->get('session')
                            ->getFlashBag()
                            ->add('success', $this->get('translator')->trans("profile.linkedin_connect_as_flashbag", array('%username%' => $page->getName())));  
                    }
                    
                }
                $this->em->persist($page);
                $this->em->flush();
            }
            
            if (!$selectedPage->getSelected())
            {
               $this->get('session')
                            ->getFlashBag()
                            ->add('success', $this->get('translator')->trans("profile.linkedin_connect_as_flashbag", array('%username%' => $this->authUser->getLinkedinName())));   
            }
            
            $response = new JsonResponse();
            $response->setData($selectedPage->jsonSerialize());
            return $response; 
        }
        else
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response;   
        }
        
    }
    
    public function extractMediaAction(Request $request)
    {
        if (!$this->checkView($request))
        {
            $response = new Response();
            $response->setStatusCode(401);
            return $response;
        }
        

        if ($request->getMethod() == 'GET')
          //(($request->getMethod() == 'GET')
          // && $request->isXmlHttpRequest())
        {
            $url= ($request->query->get("url"))?trim($request->query->get("url")):false;
             
            if (!$url || (filter_var($url, FILTER_VALIDATE_URL) === false))
            {
                $response = new Response();
                $response->setStatusCode(500);
                return $response;
            }

            $remote = new ArRemoteMediaExtractor($url);
       
            if ($remote->hasRespose())
            {
                $response = new JsonResponse();
                $response->setData($remote->jsonSerialize());
                return $response;  
            }
            else
            {
                $response = new Response();
                $response->setStatusCode(500);
                return $response;
            }
            
        }
        else
        {
            $response = new Response();
            $response->setStatusCode(500);
            return $response; 
        }
    }
}
