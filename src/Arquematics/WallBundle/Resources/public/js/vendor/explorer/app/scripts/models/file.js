/* global define */
define([
    'underscore',
    'backbone',
    'helpers/sync/arSyncNote',
    'libs/utils',
    'arquematics',
    'toBlob',
    'blobjs'
], function (_, Backbone, ArSyncFile, Utils, arquematics, toBlob) {
    'use strict';

    /**
     * Files model
     */
    var File = Backbone.Model.extend({
        idAttribute: 'id',
        //se pone al inicializar
        urlRoot: '',
    
        defaults: {
            'id'           : undefined,
            'src'          : '',
            'pass'         : '',
            'type'         : '',
            'w'            : '',
            'h'            : '',
            'created'       :  Date.now(),
            'updated'       :  Date.now()
        },
        
        initialize: function (props){
            this.urlRoot = (props && props.urlRoot)? props.urlRoot : this.urlRoot;
            this.set('pass', (props && props.pass)? props.pass : '');
        },

        validate: function (attrs) {
            var errors = [];
            if (attrs.src === '') {
                errors.push('src');
            }
            if (attrs.type === '') {
                errors.push('type');
            }
            if (errors.length > 0) {
                return errors;
            }
        },
       
        updateDate: function () {
            this.set('updated', Date.now());
        },
        
        parse : function(data)
         {
            
            data = _.extend(this.toJSON(), data);
            data = this.decrypt(data);
            
            //toBlob() method creates a Blob object representing 
            //the image contained in the canvas
            data.src = toBlob(data.src);
            
            data.created = Utils.parseDate(data.created);
            data.updated = Utils.parseDate(data.updated);
    
            
            return data;
         },
        
        decrypt: function (data) 
        {
           
            var dataClone = data || this.toJSON();

            dataClone.src = arquematics.simpleCrypt.decryptBase64(data.pass , data.src);       

            return dataClone;
        },
        encrypt: function (data) {
            var dataClone = data || this.toJSON();

            dataClone.src   = arquematics.simpleCrypt.encryptBase64(dataClone.pass , dataClone.src);
     
            return dataClone;
        }
        
        ,sync: function (method, model, options)
        {

          if ((method === 'create') || (method === 'update'))
          {
            options.data = ArSyncFile.prepareFormData(model.encrypt(), method);
             
            return Backbone.sync(method, model, options); 
          }
          else
          {
            return Backbone.sync(method, model, options);      
          }         
        }
        

        /**
         * Saves model's id for sync purposes, then destroys it
         */
        /*
        destroySync: function () {
            return new Removed().newObject(this, arguments);
        }*/

    });

    return File;
});
