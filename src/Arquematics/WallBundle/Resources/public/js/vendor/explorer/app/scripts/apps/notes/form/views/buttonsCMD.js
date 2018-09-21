/*global define*/
define([
    'underscore',
    'app',
    'marionette',
    'helpers/uri',
    'text!apps/notes/form/templates/buttonsCMD.html'
], function(_, App, Marionette, URI, Template) {
    'use strict';

    var View = Marionette.ItemView.extend({
        template            : _.template(Template),
        tagName             : 'ul',
        className           : 'nav navbar-nav pull-right navbar-right',
        keyboardEvents      : {},

        ui: {
            saveCMD        : '.cmd-save',
            shareCMD        : '.cmd-share',
            editCMD         : '.cmd-edit',
            restoreCMD      : '.cmd-restore',
            removeCMD       : '.cmd-remove'
        },

        events: {
            'click @ui.shareCMD'        : 'shareCMD',
            'click @ui.editCMD'         : 'editCMD',
            'click @ui.restoreCMD'      : 'restoreCMD',
            'click @ui.removeCMD'       : 'removeCMD'
        },

        initialize: function () {
           this.clickEnabled = true;
           
           this.listenTo(this.model, 'change:share', this.disableControls, this);
           
           this.listenTo(this.model, 'disableControls', this.disableControls, this);
        },
        
        shareCMD: function (e)
        {
            e.preventDefault();
            
            if (this.clickEnabled)
            {
              this.model.trigger('setShare');      
            }
            
            return false;
        },
       
        editCMD: function (e)
        {
            var $node = this.ui.editCMD;
            
            if (this.clickEnabled)
            {
               if ($node.data('diagram-type') === 'note')
               {
                    e.preventDefault();
                    App.navigate(this.ui.editCMD.attr('href'), true);
                }
                else
                {
                    this.model.trigger('disableControls');       
                }    
            }
        },
        
        restoreCMD: function (e) {
            e.preventDefault();
            if (this.clickEnabled)
            {
              this.model.trigger('setRestoreFromTrash'); 
            } 
        },
        
        removeCMD: function(e)
        {
            App.navigate(this.ui.removeCMD.attr('href'), true);
        },
        
        /**
         * deshabilita controles, botones ...
         */
        disableControls: function()
        {
           this.clickEnabled = false; 
        },
        
        onRender: function () {
          
        },

        serializeData: function () {
           var data = this.model.toJSON();
           
           if (data.id != undefined )
           {
                data.documentURL = '#' + URI.objURL(data);       
           }
           else
           {
                data.documentURL = '';   
           }

           return data;
        },

        templateHelpers: function () {
            return {
                i18n: $.t,
               
                // Generates the pagination url
                pageUrl: function (page) {
                    return '#' + URI.doc(this.args);
               }
            };
        }

    });

    return View;
});
