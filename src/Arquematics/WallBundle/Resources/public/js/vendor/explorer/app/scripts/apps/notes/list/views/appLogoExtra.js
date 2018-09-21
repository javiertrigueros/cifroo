/*global define*/
define([
    'underscore',
    'app',
    'marionette',
    'helpers/uri',
    'text!apps/notes/list/templates/appLogoExtra.html'
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

        initialize: function (options)
        {       
           this.isEdit = options.isNewNote;
           console.log(this.isEdit);
        },
        
        onRender: function () {
          if (!$('body').hasClass('mmc'))
          {
            //siempre con Logo extra en pequeño
            $('body').addClass('mmc');      
          } 
          
          $('body').removeClass('loading');
        },
        
        serializeData: function () {

           var data = {
             isEdit    : this.isEdit
           };
           
           return data;
        },

        templateHelpers: function () {
            return {
                i18n: $.t
            };
        }

    });

    return View;
});
