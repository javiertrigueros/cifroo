/*global define*/
define([
    'underscore',
    'jquery',
    'arquematics',
    'libs/utils'
], function (_, $, arquematics, Utils) {
    'use strict';
    
    var instance = null;

    function ArSyncNote() {
        
        var that = this;
        
        this.formOptions = {
           form_notes: '#form-arFile',
           
           input_guid:      "#wallbundle_explorer_guid",
           input_name:      "#wallbundle_explorer_name",
           input_favorite:  "#wallbundle_explorer_favorite",
           input_pass:      "#wallbundle_explorer_pass",
           input_token:     "#wallbundle_explorer__token"
        };
        
        this._gui = false;
      
        this.sync = function (method, model, options) {
                var done = $.Deferred()
                , resp;
                
                switch (method) {
                    case 'auth':
                        
                    break;
                    case 'read':
                       if (model instanceof Backbone.Collection) {
                         resp = that.findAll(model, options); 
                       }
                       else
                       {
                         resp = that.find(model, options);
                       }
                    break;
                    case 'create':
                      resp = that.create(model, options);
                    break;
                    case 'update':
                      resp = that.update(model, options);
                    break;
                    case 'delete':
                       resp = that.destroy(model, options); 
                    break;
                }
                
                
                function callMethod (method, res) {
                    if (options && _.has(options, method)) {
                        options[method](res);
                    }
                }

                resp.then(function(res) {
                    callMethod('success', res);
                    callMethod('complete', res);
                    done.resolve(res);
                }, function(res) {
                    callMethod('error', res);
                    callMethod('complete', res);
                    done.reject(res);
                });
                
                //return Backbone.sync(method, model, options);
                return done;
            };
        
        //this.collectionCloud.sync = sync;
    }

    ArSyncNote.prototype = {
            
        S4: function () {
            /*jslint bitwise: true */
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        },

        /**
        * Generate a pseudo-GUID by concatenating random hexadecimal.
        */
        guid: function () {
            return (this.S4()+this.S4()+'-'+this.S4()+'-'+this.S4()+'-'+this.S4()+'-'+this.S4()+this.S4()+this.S4());
        },
            
        _setFormData: function (modelData, isEnCrypt)
        {      
                var formOptions = this.formOptions;
                
                if (isEnCrypt)
                {
                    $(formOptions.input_pass).val(modelData.pass);
                }
                console.log('_setFormData');

                $(formOptions.input_guid).val(modelData.guid);
                $(formOptions.input_name).val(modelData.title);
                $(formOptions.input_favorite).val(modelData.isFavorite);
                
                console.log('_setFormData');
          },

          destroy: function(model, options)
          {
                var d = $.Deferred() 
                , optionsClone = options? _(options).clone(): {error: false, success: false};
                
                var error = optionsClone.error;
                optionsClone.error = function(jqXHR, status, errorThrown) {
                         d.reject();
                        //aqui se pueden hacer cosillas con el error
                        if(error)
                            error(jqXHR, status, errorThrown);
                };
                      
                var success = optionsClone.success;
                optionsClone.success = function(data, status, xhr) {
                    data = model.parseData(data, arquematics.crypt); 
                    data = model.set(data).encrypt();
                    
                    if(success)
                    {
                        success(data, status, xhr);
                    }
                    d.resolve(data);
                };
               
               optionsClone.url = '/explorer/note/' + model.get('id');
                
                
               var params = {
                 type: "DELETE",
                 datatype: 'json',
                 contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                 cache: false
               };
                
               $.ajax(_.extend(params, optionsClone));
               
               return d;
            },
            find: function(model, options) 
            {
               var d = $.Deferred()
               , optionsClone = options? _(options).clone(): {error: false, success: false};
                
               var error = optionsClone.error;
               optionsClone.error = function(jqXHR, status, errorThrown) {
                        d.reject();
                        //aqui se pueden hacer cosillas con el error
                        if(error)
                            error(jqXHR, status, errorThrown);
               };
                      
               var success = optionsClone.success;
               optionsClone.success = function(data, status, xhr) {
                   data = model.parseData(data, arquematics.crypt);
                   
                   data = model.set(data).encrypt();
                   
                   if(success)
                   {
                       success(data, status, xhr);
                   }
                   d.resolve(data);
               };
               
               optionsClone.url = '/explorer/note/' + model.get('id');
               
               var params = {
                 type: 'GET',
                 datatype: 'json',
                 contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                 cache: false
               };
              
               $.ajax(_.extend(params, optionsClone));
               
               return d;
            },
          
            findAll: function(model, options) 
            {
               var d = $.Deferred()
               , optionsClone = options? _(options).clone(): {error: false, success: false};
                
               var error = optionsClone.error;
               optionsClone.error = function(jqXHR, status, errorThrown) {
                        d.reject();
                        //aqui se pueden hacer cosillas con el error
                        if(error)
                            error(jqXHR, status, errorThrown);
               };
                      
               var success = optionsClone.success;
               optionsClone.success = function(data, status, xhr) {
                            var items = [];
                            if (data && data.contents && (data.contents.length > 0))
                            {
                                for (var i = 0, item; i < data.contents.length; i++)
                                {
                                    item = data.contents[i];
                                     
                                    items.push({
                                        id : item.guid,
                                        updated: Utils.parseDate(item.modified)
                                      });
                                }
                                
                                if(success)
                                {
                                    success(items, status, xhr);      
                                }
                                
                                d.resolve(items);
                            }
                            else
                            {
                             
                              if(success)
                              {
                                success(items, status, xhr);      
                              }
                              d.resolve(items);
                            }          
               };
               
               optionsClone.url = '/explorer/note?page=' + model.state.currentPage;
               
               var params = {
                 type: 'GET',
                 datatype: 'json',
                 contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                 cache: false
               };
              
              $.ajax(_.extend(params, optionsClone)); 
              
              return d;
            },
            
            create: function (model)
            {
              var d = $.Deferred() 
              , optionsClone = model
               , $form = $(this.formOptions.form_notes)
              , $pass = $(this.formOptions.input_note_pass);
              
              this._setFormData(optionsClone, arquematics.crypt);
              if (arquematics.crypt)
              {
                 $.when(arquematics.utils.encryptForm($form, $pass))
                 .then(function (data){
                     d.resolve(data);
                  });   
              }
              else
              {
                 var data = $form.find('input, select, textarea').serialize();
                 d.resolve(data);
              }
              
              return d;
            },
           
            update: function(model)
            {
                
                var d = $.Deferred()  
                , optionsClone = model
                , $form = $(this.formOptions.form_notes)
                , $pass = $(this.formOptions.input_pass);
              

              this._setFormData(optionsClone, arquematics.crypt);
                
              if (arquematics.crypt)
              {
                  $.when(arquematics.utils.encryptForm($form, $pass))
                 .then(function (data){
                     d.resolve(data);
                  });  
              }
              else
              {
                 var data = $form.find('input, select, textarea').serialize();
                 d.resolve(data);   
              }
              
              return d;
            }
    };

    return (instance = (instance || new ArSyncNote()));
});
