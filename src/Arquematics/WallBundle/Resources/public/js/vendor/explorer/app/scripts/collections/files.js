/*global define*/
define([
    'underscore',
    'jquery',
    'backbone',
    'models/file'
], function (_, $, Backbone, File) {
    'use strict';

    /**
     * Files collection
     */
    var Files = Backbone.Collection.extend({
        model: File,
        idAttribute: 'id',

        //id del documento que tiene el archivo
        /*noteId: '',
        url: function()
        {
          return '/doc/note/' + this.noteId + '/file'  
        },*/
    
        //se sobreescribe al inicializar
        url:function(){
          return '/doc/note/..noteid../file';
        },
            
        
        initialize: function(props){ 
            this.url = (props && props.url)? props.url : this.url();
            this.set('pass',  (props && props.pass)? props.pass: '');
        },

        fetchImages: function (images, pass) {
            var d = $.Deferred(),
                self = this,
                model;
            
            if (!images || images.length === 0) {
                self.reset();
                d.resolve(self);
            }

            _.forEach(images, function (img, index)
            {
                model = new File({id: img,
                                  pass: pass,
                                  urlRoot: self.url });

                model.fetch({
                    success: function (model)
                    {
                        self.add(model);
                        
                        if (index === 0 ) {
                            d.resolve(self);
                        }
                    },

                    error: function (e) {
                        d.reject(e);
                    }
                });
            });

            return d;
        },
        
        updateImages: function (files) {
           var d = $.Deferred()
           , self = this
           , model
           , count = 0;
           
           if (files.length > 0)
           {
             this.each(function(model) {
                _.forEach(files, function (file, index) {
                    if (model.get('id') == file.id)
                    {
                        model.set('w', file.w);
                        model.set('h', file.h);
                        
                        self.create(model, {
                            success: function (m) {
                                count++;
                                if (count === files.length)
                                {
                                  d.resolve(true);        
                                }
                            },
                            error: function (e) {
                                d.reject(e);
                            }
                        });
                    }
                });
             }, this);   
           }
           else
           {
              d.resolve(true);  
           }
           
           return d;
        },

        uploadImages: function (imgs, pass) {
            var d = $.Deferred(),
                self = this,
                models = [],
                model;

            _.forEach(imgs, function (img, index) {
                model = new File({pass: pass, urlRoot: self.url});
                model.set(img);
                
                self.create(model, {
                    success: function (m) {
                        models.push(m);
                        if (index === ( imgs.length - 1 ))
                        {
                            d.resolve(models);
                        }
                    },
                    error: function (e) {
                        d.reject(e);
                    }
                });
            });
            return d;
        }
    });

    return Files;
});
