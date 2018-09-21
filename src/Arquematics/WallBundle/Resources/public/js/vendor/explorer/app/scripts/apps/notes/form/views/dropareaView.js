/* global define */
define([
    'underscore',
    'jquery',
    'app',
    'backbone',
    'marionette',
    'text!apps/notes/form/templates/droparea.html',
    'dropzone'
], function (_, $, App, Backbone, Marionette, Templ, Dropzone) {
    'use strict';

    var View = Marionette.ItemView.extend({
        template: _.template(Templ),


        initialize: function () {
            this.images = [];
            //this.imageLink = null;
            this.on('shown.modal', this.showDroparea, this);
            //this.on('shown.modal', this.bindEvents, this);
        },

        getImage: function (file, done) {
            var reader = new FileReader(),
                self = this;

            if (file.size > self.dropzone.options.maxSize * 1024 * 1024 ) {
                
                if (file)
                {
                    file.status = Dropzone.CANCELED;
                    self.dropzone.emit("canceled", file);
                    self.dropzone.processQueue();
                        
                    self.dropzone.removeFile(file);
                    
                }
                
                $('.wall-default-drop-inner').hide();
                $('.error-file-message')
                    .removeClass('hide')
                    .show();
                
                //return done(self.dropzone.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", self.dropzone.options.maxSize));
            } else if (!Dropzone.isValidFile(file, self.dropzone.options.arFiles)) {
                
                if (file)
                {
                    file.status = Dropzone.CANCELED;
                    self.dropzone.emit("canceled", file);
                    self.dropzone.processQueue();
                        
                    self.dropzone.removeFile(file);
                }
                
                $('.wall-default-drop-inner').hide();
                $('.error-file-message')
                    .removeClass('hide')
                    .show();
                
                //return done(this.options.dictInvalidFileType);
            } else if ((self.dropzone.options.maxFiles != null) 
                && (self.images.length >= self.dropzone.options.maxFiles)) {
               
               if (file)
               {
                    file.status = Dropzone.CANCELED;
                    self.dropzone.emit("canceled", file);
                    self.dropzone.processQueue();
                        
                    self.dropzone.removeFile(file);
               }
               
               $('.wall-default-drop-inner').hide();
               $('.error-file-message')
                    .removeClass('hide')
                    .show();
        
            } else {
                
                reader.onload = function (event) {
                    var image = new Image()
                    , w , h;
                    
                    image.src = event.target.result;
                    w = image.width;
                    h = image.height;
                    image.width = 250; // a fake resize
                
                    self.images.push({
                        w: w,
                        h: h,
                        src: event.target.result,
                        type: file.type
                    });
                    
                };

                reader.readAsDataURL(file);
            }
        },

        showDroparea: function () {
            _.bindAll(this, 'getImage')
            , self = this;
            
            this.dropzone =  new Dropzone('.dropzone', {
                dictInvalidFileType: $.t("You can't upload files of this type."),
                dictRemoveFile: $.t("Remove file"),
                url: '/#notes',
                accept: this.getImage,
                arFiles: "image/jpeg,image/gif,image/png,image/svg+xml",
                uploadMultiple: false,
                maxFiles: 1,
                maxSize: 2,  
                thumbnailWidth: 100,
                thumbnailHeight: 100,
                previewTemplate: '<div class=\"dz-preview dz-file-preview\">\n <div class=\"dz-details\">\n <img data-dz-thumbnail class="img-responsive img-thumbnail" />\n  </div>\n </div>\n'
            });
        },

        templateHelpers: function() {
            return {
                i18n: $.t
            };
        }
    });

    return View;
});
