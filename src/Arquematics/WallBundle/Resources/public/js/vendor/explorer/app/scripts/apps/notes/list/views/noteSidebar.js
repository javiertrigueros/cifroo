/*global define*/
define([
    'underscore',
    'app',
    'marionette',
    'helpers/uri',
    'apps/notes/list/views/noteSidebarItem',
    'text!apps/notes/list/templates/sidebarList.html',
    'backbone.mousetrap'
], function(_, App, Marionette, URI, NoteSidebarItem, Template) {
    'use strict';

    var View = Marionette.CompositeView.extend({
        template           :  _.template(Template),
        className          :  'sidebar-notes',
        childView          :  NoteSidebarItem,
        childViewContainer :  '.notes-list',
        childViewOptions   :  { },

        keyboardEvents     :  { },

        
        ui: {
            more             : '#more-page',
            scrollList       : '#scroll-list',
            sidebar          : '#sidebar',
            prevPage         : '#prevPage',
            nextPage         : '#nextPage'
        },

        collectionEvents: {
            'changeFocus' : 'changeFocus',
            'change'      : 'render',
            'nextPage'    : 'toNextPage',
            'prevPage'    : 'toPrevPage'
        },

        initialize: function () {
            _.bindAll(this, 'scrollDetect','showMore','hideMore');
            
            this.$body = $('body');
            // Navigation with keys
            this.keyboardEvents[App.settings.navigateBottom] = 'navigateBottom';
            this.keyboardEvents[App.settings.navigateTop] = 'navigateTop';

            this.listenTo(this.collection, 'showMore', this.showMore, this);
            this.listenTo(this.collection, 'onFinishedLoad', this.hideMore, this);
            // Options to childView
            this.childViewOptions.args = this.options.args;
            
        },
        
        scrollDetect: function()
        {
            console.log('scrollDetect');
            var $contentNode = $(document)
            , docTop = $contentNode.scrollTop()
            , docHeight = $contentNode.height()
            //50% de la pantalla (para moviles)
            , triggerPoint = 40;
            
            if ((Math.round((docHeight - docTop) * 100  /  docHeight ) 
                > triggerPoint ))
            {
               //no controla si se ha
               //disparado el evento anteriormente
               //eso se hace en el controlador
               this.collection.trigger('loadNextPage');     
            }    
        },
        
        showMore: function ()
        {
          $(this.ui.more)
            .removeClass('hide')
            .show();  
        },
        hideMore: function ()
        {
           $(this.ui.more)
            .removeClass('hide')
            .hide();    
        },
        
        
        onRender: function () {
            
           
           $(window).scroll(this.scrollDetect);
           
           $(this.el).find('.active').each( function(){
               $(this).removeClass('active');
           });
           
        },

        toNextPage: function () {
            App.navigate(this.ui.nextPage.attr('href'), true);
        },

        toPrevPage: function () {
            App.navigate(this.ui.prevPage.attr('href'), true);
        },

        navigateBottom: function () {
            this.collection.trigger('navigateBottom');
        },

        navigateTop: function () {
            this.collection.trigger('navigateTop');
        },

        
        changeFocus: function (note) {
            
            if ( typeof(note) === 'string') {
                note = this.collection.get(note);
            }
            
            if (note) {
                note.trigger('changeFocus');
                this.collection.trigger('setSelected',note.get('id'));
            }
            else
            {
              this.collection.trigger('setSelected',null);      
            }
        },

        serializeData: function () {
            var viewData = {
                title       : this.options.title,
                args        : this.options.args,
                pagination  : this.collection.length >= App.settings.pagination
            };
            return viewData;
        },

        templateHelpers: function () {
            return {
                i18n: $.t,

                // Generates the pagination url
                pageUrl: function (page) {
                    //page = page || 0;
                    return '#' + URI.doc(this.args);
               }
            };
        }

    });

    return View;
});
