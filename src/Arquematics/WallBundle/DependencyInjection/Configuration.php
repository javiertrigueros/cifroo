<?php

namespace Arquematics\WallBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritdoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('wall');

        $rootNode->children()
                ->scalarNode('cloud_convert_api')
                ->end()
                ->integerNode('max_wall_tags')
                ->end()
                ->integerNode('max_channels')
                ->end()
                ->integerNode('max_wall_comments')
                ->end()
                ->integerNode('max_file_size')
                ->end()
                ->integerNode('bytes_per_chunk')
                ->end()
                ->arrayNode('extensions_allowed')
                    ->requiresAtLeastOneElement()
                    ->prototype('enum')
                        ->values(['txt', 'pdf', 'epub', 'stl', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pps', 'odc', 'odp', 'ods', 'odt', 'gif', 'png', 'jpeg','jpg','jpe','jfif','jp2','jpx','xcf','pic','bmp','svg','tiff','tif','psd','dwg','dxf','rar','zip'])
                    ->end()
                ->end()
                ->arrayNode('image_width_sizes')
                    ->requiresAtLeastOneElement()
                    ->prototype('enum')
                        ->values(['mini', 'small', 'normal', 'big'])
                    ->end()
                ->end()
                ;
        // Here you should define the parameters that are allowed to
        // configure your bundle. See the documentation linked above for
        // more information on that topic.

        return $treeBuilder;
    }
}
