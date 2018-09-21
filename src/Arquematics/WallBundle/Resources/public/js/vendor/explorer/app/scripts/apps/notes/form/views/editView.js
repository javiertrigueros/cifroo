/*global define*/
/*global Markdown*/
define([
    'underscore',
    'app',
    'marionette',
    'helpers/uri',
    'text!apps/notes/form/templates/editView.html',
    'checklist',
    //'libs/images',
    'libs/utils',
    'apps/notes/form/views/dropareaView',
    'jquery',
    //'html2canvas',
    //'arquematics',
    'to-markdown',
    'marked',
    //'toBlob', 
    //'blobjs',
    
    'jquery-resizable',
    'simple-module',
    'simditor-arup',
    'simple-hotkeys',
    'simple-uploader',
    /*'simditor-markdown',*/
    'simditor',
    //'jquery-notebook',
    //'rangy',
    //'hallo',
    //'popline',
    //'marked',
    //'lepture',


    'backbone.mousetrap',
], function (_, App, Marionette, URI, Template, Checklist, /* Img,*/ Utils, DropareaView, $, /*html2canvas, arquematics,*/ toMarkdown,  marked ) {
    'use strict';

    var View = Marionette.ItemView.extend({
        //template: _.template(Template),
        template: _.template(Template),

        className: 'content-notes',

        ui: {
            favorite : '.favorite i',
            title:      'input[name="title"]',
            content:    'input[name="editor"]',
            progress : '.progress-bar',
            percent  : '.progress-percent'
        },

        events: {
            'click .favorite'               : 'favorite',
            'click .task [type="checkbox"]' : 'toggleTask'
        },

        keyboardEvents: {
            'up'   : 'scrollTop',
            'down' : 'scrollDown'
        },

        initialize: function(options)
        {     
            //colection files
            this.files = options.files;
            //this.imgHelper = new Img();
            
            this.clickEnabled = true;
            
            // Setting shortcuts
            var configs = App.settings;
            this.keyboardEvents[configs.actionsRotateStar] = 'favorite';

            // Model events
            this.listenTo(this.model, 'change:isFavorite', this.changeFavorite);
            this.listenTo(this.model, 'change:taskCompleted', this.taskProgress);
            //view events
            //el autosave solo funciona cuando se ha creado el documento
            if (!options.isNewNote)
            {
              this.on('autoSave', this.autoSave, this);      
            }
            
            this.model.on('attachImages', this.attachImages, this);
        },
        
        attachImages: function (data)
        {
            var that = this;
            
            _.forEach(data.images, function (model)
            {
                that.simditor.trigger('attachImages', model);
            });
        },
        
        onShow: function(){
            var that = this;
            /*
            //si tiene mmc el menu esta en pequeño
            if (!$('body').hasClass('mmc'))
            {
              //la edicion siempre es en pequeño
              $('body').addClass('mmc');      
            }*/
          
            //el lenguaje del editor se pone de forma estatica
            Simditor.locale = App.settings.appLang;
              
            this.simditor = new Simditor({
                    upload: true,
                    toolbarFloat: true,
                    toolbarFloatOffset: 46,
                    toolbar: ['title', '|', 'bold', 'italic', 'underline', '|', 'alignment', '|',  'ol', 'ul',  'table', '|', 'indent', 'outdent', 'blockquote', '|', 'link', 'arup'],
                    textarea: $('#editor'),
                    arup: {
                        files     : that.files,
                        openDroparea: function()
                        {
                            var View = new DropareaView();
                            App.Confirm.show({
                                title: $.t('Insert image'),
                                content : View,
                                success: function () {
                                    if (View.images.length > 0) {
                                        that.trigger('uploadImages', {images: View.images});
                                    }
                                },
                                error: function () {
                                                                       
                                }
                            });
                        }
                    }
                });
                   
            //cambios en el editor
            this.simditor.on('valuechanged',
                    function(e){
                        
                        if (typeof that.timeOut === 'number') {
                            clearTimeout(that.timeOut);
                        }
                        // 20 segundos para  autosave
                        that.timeOut = setTimeout(function () {
                                that.trigger('autoSave');
                        }, 20 * 1000);
                    });
            
            this.simditor.on('imagechanged',function(e, data){
                  that.model.trigger('imageChanged', {id: data.image.attr("alt"), w: data.w, h: data.h}); 
            });
                    
            
            //cambios en el titulo
            this.ui.title.bind("change paste keyup",function() {
                
                if (that.ui.title.val().trim() !== that.model.get('title'))
                {
                     if (typeof that.timeOut === 'number') {
                            clearTimeout(that.timeOut);
                      }
                    
                     that.timeOut = setTimeout(function () {
                          that.trigger('autoSave');
                     }, 800);   
                }
                
            });
            
            setTimeout(function () {
              if (that.ui && that.ui.title
                 && (typeof that.ui.title.focus === "function"))
              {
                 that.ui.title.focus();     
              }
            }, 10);  
        },
        
        autoSave: function ()
        {
            if (App.Confirm.active)
            {
                clearTimeout(this.timeOut);
                return;
            }
            
            App.log('Note has been automatically saved');
            this.model.trigger('autoSave');
        },
        
        getEditorContent: function()
        {
            var editorContent = this.simditor.getValue()
            , $content = $(editorContent)
            , content = '';
            
            if ($content.find('p').length === 1)
            {
              content = toMarkdown($content.find('p').html()); 
            }
            else
            {
              content  = toMarkdown(editorContent);      
            }
            
            var urlRegex =/(\b(blob:https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

            return content.replace(urlRegex, '');
        },
        
        onDestroy: function() {
            this.undelegateEvents();
            this.stopListening();
        },


        onRender: function () {
    
        },

        onClose: function () {
            //this.imgHelper.clean();
        },
       
       
        serializeData: function () {
            //var data = _.extend(this.model.toJSON(), this.options.decrypted),
            var data = this.model.toJSON(),
                self = this;
                // Convert from markdown to HTML
                // converter = Markdown.getSanitizingConverter();
                //converter = new Markdown.Converter();
                //Markdown.Extra.init(converter);
            

            /*
            if (data.diagramType === 'note')
            {
                // Customize markdown converter
                converter.hooks.chain('postNormalization', function (text) {
                    text = new Checklist().toHtml(text);
                    //text = new Tags().toHtml(text);
                    return self.imgHelper.toHtml(text, self.options.files);
                });
              
                data.content = converter.makeHtml(data.content);
            }*/
            
            //this.simditor.setValue(data.content);
            
             //datos de usuario
            data.isAdmin = App.userInfo.cms_admin;
            //data.userMenu = App.userInfo.HTML;

            data.uri = URI.link('/');
            
            URI.setCurrentId(data.id);
            
            return data;
        },

        changeFavorite: function () {
            var sidebar = $('#note-' + this.model.get('id') + ' .favorite');
            if (this.model.get('isFavorite') === 1) {
                this.ui.favorite.removeClass('fa-star-o');
                sidebar.removeClass('fa-star-o');
               
                this.ui.favorite.addClass('fa-star');
                sidebar.addClass('fa-star');
            } else {
                
                this.ui.favorite.removeClass('fa-star');
                sidebar.removeClass('fa-star');
                
                this.ui.favorite.addClass('fa-star-o');
                sidebar.addClass('fa-star-o');
            }
        },

        /**
         * Add note item to your favorite notes list
         */
        favorite: function (e) {
            e.preventDefault();
            
            if (this.clickEnabled)
            {
              this.model.trigger('setFavorite'); 
            }
            
            return false;
        },

        /**
         * Toggle task status
         */
        toggleTask: function (e) {
            
            if (this.clickEnabled)
            {
               var task = $(e.target),
                taskId = parseInt(task.attr('data-task'), null),
                //content = this.model.decrypt().content,
                content = this.model.content,
                text = new Checklist().toggle(content, taskId);

                // Save result
                this.model.trigger('updateTaskProgress', text);  
            }
        },

        /**
         * Shows percentage of completed tasks
         */
        taskProgress: function () {
            var percent = Math.floor(this.model.get('taskCompleted') * 100 / this.model.get('taskAll'));
            this.ui.progress.css({width: percent + '%'}, this.render, this);
            this.ui.percent.html(percent + '%');
        },

        /**
         * Scroll page to top when user hits up button
         */
        scrollTop: function () {
            var Top = this.$('.ui-body').scrollTop();
            this.$('.ui-body').scrollTop(Top - 50);
        },

        /**
         * Scroll page down when user hits down button
         */
        scrollDown: function () {
            var Top = this.$('.ui-body').scrollTop();
            this.$('.ui-body').scrollTop(Top + 50);
        },

        templateHelpers: function() {
            return {
                i18n: $.t,

                getProgress: function() {
                    return Math.floor(this.taskCompleted * 100 / this.taskAll);
                },

                getContent: function()
                {
                    return marked(this.content);
                },
                createdDate: function() {
                    return Utils.formatDate(this.created, $.t('DateFormat'));
                }
            };
        }

    });

    return View;
});
