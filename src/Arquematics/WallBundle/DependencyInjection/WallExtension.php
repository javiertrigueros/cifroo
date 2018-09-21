<?php

namespace Arquematics\WallBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;

/**
 * This is the class that loads and manages your bundle configuration
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class WallExtension extends Extension
{
    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);
       
        $loader = new Loader\YamlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.yml');
        
        $container->setParameter('arquematics.max_channels', $config['max_channels']);
        $container->setParameter('arquematics.max_wall_tags', $config['max_wall_tags']);
        $container->setParameter('arquematics.max_wall_comments', $config['max_wall_comments']);
        $container->setParameter('arquematics.max_file_size', $config['max_file_size']);
        $container->setParameter('arquematics.bytes_per_chunk', $config['bytes_per_chunk']);
        $container->setParameter('arquematics.extensions_allowed', $config['extensions_allowed']);
        $container->setParameter('arquematics.image_width_sizes', $config['image_width_sizes']);
        $container->setParameter('arquematics.cloud_convert_api', $config['cloud_convert_api']);
    }
}
