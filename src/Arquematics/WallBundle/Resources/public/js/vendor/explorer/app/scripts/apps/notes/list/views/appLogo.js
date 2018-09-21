/*global define*/
define([
    'underscore',
    'app',
    'marionette',
    'helpers/uri',
    'text!apps/notes/list/templates/appLogo.html'
], function(_, App, Marionette, URI, Template) {
    'use strict';

    var View = Marionette.ItemView.extend({
        template            : _.template(Template),
        className           :   'app-logo',
        keyboardEvents      :   {},
        ui                  :   {},
        collectionEvents    : {
            'change'      : 'render'
        },

        initialize: function () {
           
           
        },
        
        onRender: function () {
            
            if (this.collection && 
                (this.collection.length == 0))
            {
                if (!$('body').hasClass('mmc'))
                {
                    //lo mensajes en pequeño
                    $('body').addClass('mmc');      
                }    
            }
            else
            {
                if ($('body').hasClass('mmc'))
                {
                    $('body').removeClass('mmc');      
                }   
            }
            
            $('body').removeClass('loading');
        },

        serializeData: function () {

           var data = {
             docType    : this.collection.docType,
             trash      : this.collection.trash,
             isFavorite : this.collection.isFavorite
           };
           
           return data;
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
