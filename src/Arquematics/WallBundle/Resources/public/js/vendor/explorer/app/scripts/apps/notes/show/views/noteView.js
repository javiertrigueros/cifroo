/*global define*/
/*global Markdown*/
define([
    'underscore',
    'app',
    'marionette',
    'helpers/uri',
    'text!apps/notes/show/templates/noteView.html',
    'libs/utils',
    'arquematics',
    'marked',
    'backbone.mousetrap'
], function (_, App, Marionette, URI, Template,  Utils, arquematics, marked ) {
    'use strict';

    var View = Marionette.ItemView.extend({
        template: _.template(Template),

        className: 'content-notes',

        ui: {
            header: 'header',
            favorite : '.favorite i',
            title:      '#title',
            cmd_save:   '.cmd-save'
        },

        events: {
            'click @ui.cmd_save': 'onClickInput',
            'keyup @ui.title'   : 'onChangeInput',
            'click .favorite'   : 'favorite'
        },

        keyboardEvents: {
            'up'   : 'scrollTop',
            'down' : 'scrollDown'
        },

        initialize: function(options) {
            this.files = options.files;
            
            this.clickEnabled = true;

            // Setting shortcuts
            var configs = App.settings;
            this.keyboardEvents[configs.actionsRotateStar] = 'favorite';

            // Model events
            this.listenTo(this.model, 'change:isFavorite', this.changeFavorite);
            this.listenTo(this.model, 'changed:name', this.onChangedName, this);
            
            this.listenTo(this.model, 'disableControls', this.disableControls, this);
            this.listenTo(this.model, 'enableControls', this.enableControls, this);
            
        },
        
        disableControls: function()
        {
            this.clickEnabled = false;
            
            $.buttonControlStatus(this.ui.cmd_save, false);
        },
        enableControls: function()
        {
            
            this.clickEnabled = true;
            
            $.buttonControlStatus(this.ui.cmd_save, true);
        },
        onChangedName: function ()
        {
            
            var $content = $('#note-' + this.model.get('id')).find('.px-nav-label')
            ,title = Utils.removeExtension(this.model.get('title')) + '.' + Utils.getExtension( this.model.get('name'))
            ,titleS = title.replace(/<(?:.|\n)*?>/gm, '').substring(0,20);
            
           
            if (title.length > titleS.length)
            {
              titleS += '...';   
            }
            
            $content.text(titleS);
        },
        
        onClickInput: function(event)
        {
            event.preventDefault();
            event.stopPropagation();
            
            var $inputControl = $(event.currentTarget)
                .parents('.input-group')
                .find('.form-control');
            
            
            var inputSearch = $.trim($inputControl.val());
            
            if (this.clickEnabled && ((inputSearch.length >= 3) || (inputSearch.length === 0)))
            {
                this.model.set('title', inputSearch);
                this.model.trigger('setTitle'); 
            }
        },
        onChangeInput: function(event)
        {
            event.preventDefault();
            event.stopPropagation();
            
            var inputSearch = $.trim($(event.currentTarget).val());
            
            if (this.clickEnabled && (((event.which === 13) || (event.keyCode === 13)) 
                 &&  ((inputSearch.length >= 3) || (inputSearch.length === 0))))
            {
                this.model.set('title', inputSearch);
                this.model.trigger('setTitle'); 
            }
        },
        
        onShow: function (){
          
            if (this.model.get('previewExt') === 'pdf')
            {
               var data= arquematics.codec.Base64.toBinary(this.model.dataImage)
                , appFrame = $('#appViewer-pdf').get(0);

                appFrame.onload = function()
                {
                    appFrame.contentWindow.PDFViewerApplication.open(data);
                    //quitar el toolbar                
                    //  $(this).contents().find('.toolbar').hide(); 
                    App.trigger('doc:loaded');
                };    
            }
            else if (arquematics.mime.is3DSTL(this.model.get('doctype')))
            {
                $.when(arquematics.loader.getBinaryString(arquematics.codec.Base64.toArrayBuffer(this.model.dataImage)))
                    .done(function (data){
                     var appFrame = $('#appViewer-3DSTL').get(0);
                
                    appFrame.onload = function() 
                    {
                        appFrame.contentWindow.load3DDoc( data);
                        App.trigger('doc:loaded');
                    };                           
                });
            }   
            else if (arquematics.mime.isCompressedType(this.model.get('doctype')))
            {
                var doctype = this.model.get('doctype');
                $.when(arquematics.loader.getBlob(arquematics.codec.Base64.toArrayBuffer(this.model.dataImage), doctype))
                  .done(function (data){
                   
                    var appFrame = $('#appViewer-zip').get(0); 
                    appFrame.onload = function() 
                    {        
                        appFrame.contentWindow.extract(data, doctype, App.settings.appLang );
                        App.trigger('doc:loaded');        
                    };
                });  
            }
            else if ((this.model.get('previewExt') === 'png')
                    || (this.model.get('previewExt') === 'jpg')
                    || (this.model.get('previewExt') === 'gif')
                    || arquematics.mime.isImageType(this.model.get('doctype')))
            {
                 var URL = window.URL || window.webkitURL
                 , blob = arquematics.codec.Base64.toBlob(this.model.dataImage, this.model.doctype)
                 , blobUrl = URL.createObjectURL(blob)
                 ,image = new Image();
                 
                image.src = blobUrl;
                image.onload = function()
                {
                   var $image = $(this);
                   if (this.width > $('.article-content').width())
                   {
                       $image.width('100%');
                       $image.height('auto');
                   }
                   
                   $('.article-content').append($image);
                   
                   App.trigger('doc:loaded'); 
                };
            }

            this.ui.title.focusTextToEnd();            
        },
        
        serializeData: function () {
            
            var data = {
                id: this.model.id,
                dataImage: this.model.dataImage,
                title: this.model.get('title'),
                isFavorite: this.model.get('isFavorite'),
                previewExt: this.model.get('previewExt'),
                created: this.model.get('created'),
                doctype: this.model.get('doctype'),
                canEdit: this.model.get('canEdit'),
                name: this.model.get('name')
            };
            
            return data;
        },

        changeFavorite: function ()
        {
            
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
         *  Add note item to your favorite notes list
         * @param {type} e
         * @returns {Boolean}
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
                
                getTitle: function()
                {
                    return Utils.removeExtension(this.name);
                },

                getContent: function()
                {
                    if (this.diagramType === 'note')
                    {
                      return marked(this.content);       
                    }
                    else return '';
                },
                createdDate: function() {
                    return Utils.formatDate(this.created, $.t('DateFormat'));
                }
            };
        }

    });

    return View;
});
