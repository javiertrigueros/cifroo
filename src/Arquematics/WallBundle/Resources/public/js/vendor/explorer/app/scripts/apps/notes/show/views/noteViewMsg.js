/*global define*/
/*global Markdown*/
define([
    'underscore',
    'app',
    'marionette',
    'text!apps/notes/show/templates/noteViewMsg.html'
], function (_, App, Marionette, Template) {
    'use strict';

    var View = Marionette.ItemView.extend({
        template: _.template(Template),

        className: 'content-notes',

 
        initialize: function(options) {
            
            this.options = options;
        },

        onRender: function (){
         
        },
        
        onClose: function () {
            
        },
        
        serializeData: function () {
          
          if ((this.options.filter == 'trashed') 
              || (this.options.filter == 'favorite'))
          {
            this.options.docType = this.options.filter;      
          }
          
          return this.options;
        },
       
        templateHelpers: function() {
            return {
                i18n: $.t
            };
        }

    });

    return View;
});
