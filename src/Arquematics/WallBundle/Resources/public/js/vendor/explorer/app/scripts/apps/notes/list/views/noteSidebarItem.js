/*global define*/
/*global Markdown*/
define([
    'underscore',
    'app',
    'marionette',
    'helpers/uri',
    'text!apps/notes/list/templates/sidebarListItem.html'
], function(_, App, Marionette, URI, Template) {
    'use strict';

    var View = Marionette.ItemView.extend({
        template: _.template(Template),
        className: 'px-nav-item',
        tagName: 'li',

        ui: {
            favorite : '.favorite'
        },

        events: {
            'click @ui.favorite': 'favorite'
        },

        modelEvents: {
            'change'       : 'render',
            'change:trash' : 'remove',
            'changeFocus'  : 'changeFocus',
            'change:isFavorite': 'changeFavorite'
        },
        
        initialize: function()
        {

            
        },
      
        changeFavorite: function ()
        {

            var $content = $('.main[data-id="' + this.model.get('id') + '"] .favorite i')
            , $sideBarNode =$('.list-group-item[data-id="' + this.model.get('id') + '"]')
            , $listGroup =$('.list-group-item.active');
            
            if ($listGroup.length <= 0)
            {
               $sideBarNode.addClass('active');
            }
            
            if (this.model.get('isFavorite') === 1)
            {
                $content.removeClass('fa-star-o');
                $content.addClass('fa-star');
            }
            else
            {
                $content.removeClass('fa-star');
                $content.addClass('fa-star-o');
            }
        },
        
        favorite: function () {
            this.model.trigger('setFavorite');
            return false;
        },
        
        changeFocus: function () {
            var $listGroup =$('.list-group-item[data-id="' + this.model.get('id') + '"]');
            
            if (!$listGroup.hasClass('active'))
            {
               $('.list-group-item.active').removeClass('active');
               $listGroup.addClass('active');
            }
        },

        serializeData: function () {
            var data = _.extend(this.model.toJSON(), {
                args    : this.options.args
            });
            
            data.currentId = URI.getCurrentId();
            
            return data;
        },

        templateHelpers: function () {
            return {
                getContent: function (text) {
                    // Pagedown
                    // var converter = Markdown.getSanitizingConverter();
                    var converter = new Markdown.Converter();
                    var content = converter.makeHtml(text);
                    content = content.replace(/<(?:.|\n)*?>/gm, '').substring(0, 50);

                    return content;
                },
                
                hasToolTip: function (title) {
                    return (title.length > 22); 
                },

                getTitle: function (title) {
                    return title.replace(/<(?:.|\n)*?>/gm, ''); 
                },
                
                getText: function (title, leng) {
                    return title.replace(/<(?:.|\n)*?>/gm, '').substring(0,leng);
                },

                // Generate link
                link: function ()
                {
                    if (this.diagramType === 'note')
                    {
                      return URI.doc(this.args, this);      
                    }
                    else
                    {
                       return URI.vector(this.args, this);     
                    }
                }
            };
        }

    });

    return View;
});
