/* global define */
define([
    'underscore',
    'jquery',
    'app',
    'marionette',
    'helpers/uri',
    'collections/files',
    'models/note',
    //'checklist',
    'apps/notes/form/views/editView',
    'apps/notes/form/views/editExcelView',
    'apps/notes/form/views/buttonsCMDAddNote',
    'apps/notes/form/views/buttonsCMDShareNote',
    'apps/notes/form/views/buttonsCMDEditNote',
    
    'apps/notes/list/views/appLogoExtra'
    
], function (_, $, App, Marionette, URI,  FilesCollection, NoteModel,  EditView, EditExcelView, ButtonsCMDAddNote, ButtonsCMDShareNote, ButtonsCMDEditNote,  AppLogoExtra) {
    'use strict';

    var Form = App.module('AppNote.Form');

    Form.Controller = Marionette.Controller.extend({
        initialize: function () {
            _.bindAll(this, 'addNote', 'addExcel',  'shareNote', 'editNote',  'show', 'fetchImages', 'redirect', 'confirmCancel', 'imageChanged');
            
            //redirecciones la aplicacion despues de afterSync
            this.redirecOut = App.hasRedirOut;

            this.action = '';
            
            this.imagesToUpdate = [];
        },
        
        /**
         * Add a new note to share
         */
        addExcel: function () {
            var model = this.model = new NoteModel()
            , id = model.generateId();
            
            //sale de la aplicación al guardar
            this.redirecOut = true;
            
            this.files = new FilesCollection({  url: '/doc/note/' + id + '/file' });

            //borra Navbar
            App.AppNavbar.trigger('resetNavbar', this.args);
            
            var args = {
                model     : this.model,
                files     : this.files,
                //esta editando un nuevo documento o no
                isNewNote    : true
            };
            
            
            this.view = new EditExcelView(args);

            App.content.show(this.view);
            
            App.toolButtoms.show(new ButtonsCMDAddNote(args));
            
            //view
            this.view.on('uploadImages', this.uploadImages, this);
            //model
            this.model.on('saveShare', this.saveShare, this);
            this.model.on('confirmCancel', this.confirmCancel, this);
            //this.model.on('afterUpdateSync', this.afterSyncOut, this);
            this.model.on('imageChanged', this.imageChanged, this); 
            this.model.on('modelSaveEnd', this.afterSyncOut, this);
            
            var appLogo = new AppLogoExtra(args);

            App.logo.show(appLogo);
            
            this.view.trigger('shown');
        },
       
         /**
         * Add a new note to share
         */
        addNote: function () {
            var model = this.model = new NoteModel()
            , id = model.generateId();
            
            //sale de la aplicación al guardar
            this.redirecOut = true;
            
            this.files = new FilesCollection({  url: '/doc/note/' + id + '/file' });

            //borra Navbar
            App.AppNavbar.trigger('resetNavbar', this.args);
            
            var args = {
                model     : this.model,
                files     : this.files,
                //esta editando un nuevo documento o no
                isNewNote    : true
            };
            
            
            this.view = new EditView(args);

            App.content.show(this.view);
            
            App.toolButtoms.show(new ButtonsCMDAddNote(args));
            
            //view
            this.view.on('uploadImages', this.uploadImages, this);
            //model
            this.model.on('saveShare', this.saveShare, this);
            this.model.on('confirmCancel', this.confirmCancel, this);
            //this.model.on('afterUpdateSync', this.afterSyncOut, this);
            this.model.on('imageChanged', this.imageChanged, this); 
            this.model.on('modelSaveEnd', this.afterSyncOut, this);
            
            var appLogo = new AppLogoExtra(args);

            App.logo.show(appLogo);
            
            this.view.trigger('shown');
        },
        
        /**
         * Edit y compartir
         */
        shareNote: function (args)
        {
            var model = this.model = new NoteModel({ id : args.id });
            this.files = new FilesCollection({  url: function (){
                                                     return '/doc/note/' + model.get('id') + '/file'
                                                 }});
            
            //sale de la aplicación al guardar
            this.redirecOut = true;
            
            $.when(
                this.model.fetch()
            ).done(this.fetchImages);
        },
        
        editNote: function (args)
        {
            var model = this.model = new NoteModel({ id : args.id });
            this.files = new FilesCollection({  url: function (){
                                                     return '/doc/note/' + model.get('id') + '/file'
                                                 }});
            
            //borra Navbar
            App.AppNavbar.trigger('resetNavbar', this.args);
 
            this.action = 'editNote';
            
            $.when(
                this.model.fetch()
            ).done(this.fetchImages);
        },
        

        fetchImages: function () {
            $.when(this.files.fetchImages(this.model.get('images'),this.model.get('pass')))
             .done(this.show)
             .fail(this.show);
        },
        
        
        show: function () {
            
             var args = {
                model     : this.model,
                //esta editando un nuevo documento o no
                isNewNote   : false,
                files     : this.files
            };
            
            this._modelAttributes = _.extend({}, this.model.attributes);
            
            this.view = new EditView(args);

            App.content.show(this.view);
            
            if (this.action === 'editNote')
            {
               App.toolButtoms.show(new ButtonsCMDEditNote(args));     
            }
            else
            {
              App.toolButtoms.show(new ButtonsCMDShareNote(args));      
            }
            
            var appLogo = new AppLogoExtra(args);

            App.logo.show(appLogo);
            //listem
            this.listenTo(this.model, 'change:isFavorite', this.changeFavorite);
            this.listenTo(this.model, 'autoSave', this.autoSave);
            //sale de la aplicacion 

            //view
            this.view.on('uploadImages', this.uploadImages, this);
            //model
            this.model.on('saveShare', this.saveShare, this);
            this.model.on('confirmCancel', this.confirmCancel, this);
            this.model.on('imageChanged', this.imageChanged, this); 
            
            //De momento esto no para mirar que salva
            //this.model.on('afterUpdateSync', this.afterSyncIn, this);
            this.model.on('modelSaveEnd', this.afterSyncIn, this); 
            
            this.view.trigger('shown');
        },

        uploadImages: function (imgs) {
            var self = this;
            //controles de toda la app en espera
            App.trigger('doc:loading');
            
            $.when(this.files.uploadImages(imgs.images, this.model.get('pass')))
            .done(function (data)
            {   
               self.model.trigger('attachImages', {images: data});
               App.trigger('doc:loaded');
               
            });
        },
        
        imageChanged: function (data)
        {
            var find = false;
           
            for (var i = this.imagesToUpdate.length -1; (!find) && (i >= 0); i--)
            {
               find = (this.imagesToUpdate[i].id == data.id);
               if (find)
               {
                 this.imagesToUpdate[i] = data; 
                 
                 this.files.each(function (imgModel) {
                    if (imgModel.get('id') !== undefined 
                        && (imgModel.get('id') == data.id))
                    {
                       imgModel.set('w', data.w);
                       imgModel.set('h', data.h); 
                    }
                 });
                 
               }    
            }
            
            if (!find)
            {
              this.imagesToUpdate.push(data);  
            }
        },
        
        changeFavorite: function ()
        {
            
        },

        prepareContent: function()
        {

          var data = { title: this.view.ui.title.val().trim(),
                     dataImage: '',
                     content: '',
                     images: []
                   };

          //si el titulo esta en blanco
          if (data.title === '') {
            data.title = $.t('Unnamed');
          }
          //prepara las imagenes
          this.files.each(function (img) {
                if (img.get('id') !== undefined)
                {
                   data.images.push(img.get('id'));      
                }
          });

          var dataEditorContent = this.view.getEditorContent();
          
          data.dataImage = ''; //de momento no quiero usar esto
          data.content = dataEditorContent;
          
          return data;
        },
        
        autoSave: function ()
        {
           var that = this
           , data = this.prepareContent();
  
              if (that.hasChangeContent())
              {
               // Encryption
               that.model.set(data);
               // Save
               that.model.trigger('update:any');
               
               $.when(that.model.save())
                   .done(function (){
                       
                    setTimeout(function () {
                        $.when(that.files.updateImages(that.imagesToUpdate))
                        .done(function (){
                            // ya no tenemos imagenes a actualizar
                            that.imagesToUpdate = []; 
                            
                            that.afterSyncRedirect = false;
                            that.model.trigger('autoSaveEnd');
                        }); 
                    }, 200);
                   
               });   
              } 
            
             
        },

        saveShare: function ()
        {
          var that = this
          , data = this.prepareContent();
          
          App.trigger('doc:loading');
          
          if (that.hasChangeContent())
          {
               // Encryption
               that.model.set(data);
               // Save
               that.model.trigger('update:any');
            
               $.when(that.model.save())
                 .done(function (){
                     
                   setTimeout(function () {
                      $.when(that.files.updateImages(that.imagesToUpdate))
                        .done(function (){
                            // ya no tenemos imagenes a actualizar
                            that.imagesToUpdate = []; 
                            that.afterSyncRedirect = that.redirecOut;

                            that.model.trigger('modelSaveEnd');
                     });  
                   }, 200);
                });      
           }
           else 
           {
                that.afterSyncRedirect = that.redirecOut;
                that.model.trigger('modelSaveEnd');
           }    
        },
        
        hasChangeContent: function () {
            var data = {
              title:this.view.ui.title.val().trim(),
              content: this.view.getEditorContent()
            };
            
            return (this.imagesToUpdate.length > 0) 
                || this.model.hasChangeContent(data);
        },
        
        confirmCancel: function () {
            
            var self = this;
            if (this.hasChangeContent())
            {
                App.Confirm.show({
                    content : $.t('Are you sure? You have unsaved changes'),
                    error: function ()
                    {
                      self.model.trigger('enableControls');
                      self.afterSyncRedirect = true;
                      self.model.trigger('modelSaveEnd');
                    },
                    success : function () {
                       self.model.set(self._modelAttributes);
                       
                       $.when(self.model.save())
                        .done(function (){
                            
                           $.when(self.files.updateImages(self.imagesToUpdate))
                            .done(function (){
                                // ya no tenemos imagenes a actualizar
                                self.imagesToUpdate = []; 
                                self.afterSyncRedirect = true;

                                self.model.trigger('modelSaveEnd');
                            });
                       });  
                    }
                });  
            }
            else
            {
               self.afterSyncRedirect = true;
               self.model.trigger('modelSaveEnd');
            }
        },
        
        /**
         * redireccion a fuera de la aplicacion
         */
        afterSyncOut: function()
        {
            if (this.afterSyncRedirect)
            {
               //App.trigger('doc:loaded');
               setTimeout(function () {
                   window.location = App.userInfo.wall_url;            
               }, 500);
            }     
        },

        afterSyncIn: function()
        {
          //App.trigger('notes:added', this.model);
          if (typeof this.model.get('id') !== 'undefined')
          {
            App.trigger('notes:list');
            App.navigate(URI.link('/note/show/' + this.model.get('id')), {trigger: true});        
          }
        },
        
        redirect: function ()
        {
            if (this.redirecOut)
            {
                this.afterSyncOut();     
            }
            else
            {
                this.afterSyncIn();  
            }
        }

    });

    return Form.Controller;
});
