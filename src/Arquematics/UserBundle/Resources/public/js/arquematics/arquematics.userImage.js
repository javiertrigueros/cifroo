 /**
 * @package: arquematics
 * @version: 0.1
 * @Autor: Arquematics 2010 
 *         by Javier Trigueros Martínez de los Huertos
 *         
 *  mirar https://codepen.io/asrulnurrahim/pen/WOyzxy
 *  
 * depende de croppie https://foliotek.github.io/Croppie/
 */

/**
 * 
 * @param {type} arquematics
 * @param {type} jQuery
 * @returns {arquematics}
 */
var arquematics = (function (arquematics , jQuery) {

arquematics.userImage =  {
	options: {
            form: "#form_profile_image_resize",
            
            input_file: ".input-profile-image",
            input_resize: ".image-resize-data",
            input_file_data: ".image-name",   
            
            crop_image_pop: '#cropImagePop',
            upload_demo: '#upload-demo',
            
            image_icon: '.profile-image-icon',
            
            cmd_image:  ".btn-image",
            cmd_crop_image: '#cropImageBtn',
            
            alert_size_and_type: '#alert-image-type-and-size-error',
            alert_size: '#alert-image-size-error',
            alert_type:  '#alert-image-type-error',
            
            width: 150,
            height: 150
	},
       isMovile: false,
       configure: function(options)
       {
            if (!options){
               options = {};
            }
            
            this.options = $.extend({}, this.options, options);
            this.isMovile = ($(window).width() <= 400);
            
            if (this.isMovile)
            {
               this.options.content_col = this.options.content_col_movile;
            }
            
       },
       init: function (options)
       {
           this.configure(options);

           this._initControlHandlers();
	},
        
        _saveImage: function (imageBase64String, source)
        {
            var options = this.options;
            
            $(options.input_resize).val(imageBase64String);
            $(options.input_file_data).val(source.split(/(\\|\/)/g).pop());
                           
            var form = $(options.form)
            , formData = form.find('input, select, textarea').serialize();  
                            
            $.ajax({type: "POST",
                                url: form.attr('action'),
                                datatype: "json",
                                data: formData,
                                cache: false})
            .done(function(data){
                $(options.image_icon).attr('src', imageBase64String);
                $(options.crop_image_pop).modal('hide');
                $('body').removeClass('loading');
            })
            .fail(function() {
                $('body').removeClass('loading');
                $('#cropImagePop').modal('hide');
            });
        },
        
        _hideAlerts: function()
        {
            $(this.options.alert_size_and_type)
                            .removeClass('hide')
                            .hide();
               
            $(this.options.alert_size)
                        .removeClass('hide')
                        .hide();
                
             
            $(this.options.alert_type)
                     .removeClass('hide')
                                .hide();
        },
        _isOkFile(file)
        {
             var allowedFiles = [".gif", ".jpg", ".jpeg", ".png"];
             var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$");
             var max = 1024 * 1024 * 3;
             var ret = true;
             var options = this.options;
             
            if ((file.size > max) && (!(/^image\/\w+$/.test(file.type))))
            {
               //no tiene un tamaño valido ni el tipo 
                $(options.alert_size_and_type)
                                .removeClass('hide')
                                .show(); 
                        
               return false;
                        
            }
            else if (file.size > max) {
                //no tiene un tamaño valido
                $(options.alert_size)
                                .removeClass('hide')
                                .show(); 
               return false;
            }
            else if (!(/^image\/\w+$/.test(file.type))) 
            {
               //no es una imagen valida
               $(this.options.alert_type)
                                .removeClass('hide')
                                .show();
                        
                return false;
            }
            if (!regex.test(file.type.toLowerCase())) 
            {
                             //no es una imagen valida de nuestros tipos
                $(this.options.alert_type)
                    .removeClass('hide')
                    .show();
                return false;
            }
            
            return ret;
        },
        
        _initControlHandlers: function () 
        {
            var options = this.options
            , $uploadCrop
            , rawImg
            , that = this;
            
            $(options.cmd_image).click(function(e){
                e.preventDefault();
                e.stopPropagation();
                
                $(options.input_file).trigger('click');
            });
            
            $(options.crop_image_pop).on('shown.bs.modal', function(){
               $uploadCrop.croppie('bind', {
                    url: rawImg
		}).then(function(){
                    
		});             
            });
            
            
            $uploadCrop = $(options.upload_demo).croppie({
		viewport: {
                    width: options.width,
                    height: options.height
		},
		enforceBoundary: false,
		enableExif: true
	    });
            
            $(options.input_file).change(function () {
                var fileReader = new FileReader(),
                            files = this.files,
                            file;

                if (!files.length) {
                    return;
                }

                file = files[0];
                
                that._hideAlerts();
                
                if (that._isOkFile(file))
                {
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function () { 
                        $(options.crop_image_pop).modal('show');   
                        rawImg = this.result;
                    };  
                }
            });
            
            $(options.cmd_crop_image).on('click', function (ev) {
                
                $('body').addClass('loading');
                
		$uploadCrop.croppie('result', {
			type: 'base64',
			format: 'jpeg',
			size: {width: 150, height: 150}
		}).then(function (resp) {
                    that._saveImage(resp, rawImg);
		});
            });
            
        }
};

return arquematics;

}( arquematics || {}, jQuery));