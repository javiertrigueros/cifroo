/*global define*/
define([
    'underscore',
    'app',
    'marionette',
    'text!apps/notes/form/templates/buttonsCMD.html'
], function(_, App, Marionette, Template) {
    'use strict';

    var View = Marionette.ItemView.extend({
        template            : _.template(Template),
        tagName             : 'ul',
        className           : 'nav navbar-nav pull-right navbar-right',
        keyboardEvents      : {},

        ui: {
            saveCMD        : '.cmd-save',
            cancelCMD      : '.cmd-cancel'
        },

        events: {
            'click @ui.saveCMD'        : 'saveCMD',
            'click @ui.cancelCMD'      : 'cancelCMD'
        },

        initialize: function () {
           this.clickEnabled = true;
           
           this.listenTo(this.model, 'change:share', this.disableControls, this);
           //activa desactiva los controles
           this.listenTo(this.model, 'disableControls', this.disableControls, this);
           this.listenTo(this.model, 'enableControls', this.enableControls, this);
           
        },
       
        
        saveCMD: function (e)
        {
            e.preventDefault();
            
            if (this.clickEnabled)
            {
              this.model.trigger('saveShare');
            }

            return false;
        },
       
        cancelCMD: function (e)
        {
            e.preventDefault();
            
            console.log('entra en cancelCMD');
            if (this.clickEnabled)
            {
               this.model.trigger('disableControls');
               this.model.trigger('confirmCancel'); 
            }
        },
        
        /**
         * deshabilita controles, botones ...
         */
        disableControls: function()
        {
           this.clickEnabled = false; 
        },
        
        enableControls: function()
        {
           this.clickEnabled = true; 
        },
        
        
        serializeData: function () {
           var data = this.model.toJSON();
           
           data.cancelURL = App.userInfo.wall_url;   

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
