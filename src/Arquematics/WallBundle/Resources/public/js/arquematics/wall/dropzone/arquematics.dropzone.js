    /**
 * @package: arquematicsPlugin
 * @version: 0.1
 * @Autor: Arquematics 2010 
 *         by Javier Trigueros Martínez de los Huertos
 *  
 *  arquematics.dropzone
 *  ---------------------
 *                 
 *  depende de:
 *  - arquematics.mime.js
 *  
 */
/**
 * 
 * @param {type} $
 * @param {type} arquematics
 */

var arquematics = (function ($, arquematics, PhotoSwipe, PhotoSwipeUI_Default,  window) {

var crypto;

if (window.crypto && window.crypto.getRandomValues) {
  crypto = window.crypto;
} else if (window.msCrypto && window.msCrypto.getRandomValues) {
  crypto = window.msCrypto;
}  

     
arquematics.dropzone =  {
	options: {
            imageDefault:{  mini:     {name: 'mini',    w: 200, h:150}, 
                            small:    {name: 'small',   w: 470, h:250},
                            normal:   {name: 'normal',  w: 800, h:500},
                            big:      {name: 'big',     w: 960, h:720}},
            extensions: [],
            culture: '',
            //tiene archivos validos en la sesion para enviar
            hasSessionFiles: false,
            //API de Cloud Convert
            cloud_convert_key: '',
             //archivos en la session
            sessionFiles: 0,
            // 0.25MB chunk sizes.
            BYTES_PER_CHUNK: 256 * 1024,

            //controles token fichero completo 
            input_control_csrf_token:         '#wallbundle_file__token',
            input_control_chunk_csrf_token:   '#ar_drop_file_chunk__csrf_token',
            //controles token de previsualizaciones
            input_control_preview_csrf_token:         '#wallbundle_file_preview__token',
            input_control_preview_chunk_csrf_token:   '#ar_drop_file_chunk_preview__csrf_token',
            
            //controles conversion
            input_control_cloud_convert:    '#cloud-convert-apikey',
            content:                        '#content',
            //formularios envio fichero completo
            
            form_drop:              '#arquematics-upload',
            form_chunk:             '#arquematics-upload-chunk',
            form_cloud_convert:     '#cloud-convert',
            //formularios envio previsualizaciones
            form_drop_preview:      '#arquematics-upload-preview',
            form_chunk_preview:     '#arquematics-upload-chunk-preview',
            
            content_wrapper:         '#content-wrapper,#main-menu,#main-menu-bg',

            content_item:            '.document-file-item',
            content_item_visor:      '.document-file-visor',
            
            content_container:       '.list-files',
            content_item_text:       '.file-text',
            
            
            
            content_preview_container: '#drop-preview-container',
            
            content_files_preview:       '.list-files-preview',
            content_files_preview_nofiles: '.default-message-nofiles',
            content_files_preview_item:  '.dropzone-file',
            content_files_preview_image: '.dropzone-file-image',
            content_files_preview_name:  '.dropzone-file-name',
            
            content_files_cancel_all: '.dropzone-line-controls',
            
            template_file:               '#preview-file-drop-template',
            template_no_files:           '#nofiles-template',
                  
            cmd_cancel:                  '.dz-remove',
            cmd_cancel_all:              '.cmd-remove-drop',
            
            tool_focus:             '#dropzone',
            tool_handler:           '.emojionearea-button-file, .emojionearea-button-file-extra',
            tool_container:         '#dropzone',
            has_content:            false,
            show_tool:              true
	},
        
        //resetea el contenido del control y lo activa para usar
        reset: function() 
        {
          $(this.options.content_files_preview).empty();
          $(this.options.tool_container).hide();
           
          this.dropzone.removeAllFiles(true);
          this.dropzone.emit("reset");
          //borra los elementos de sesion
          this.options.sessionFiles = 0;
        },
        resetError: function() 
        {
             
        },
            
        hasContent: function()
        {
          return (this.options.sessionFiles > 0) || this.options.hasSessionFiles;    
        },
        
        waitForContent: false,
        dropzone: false,
        mimeTypesAllowed: [],
         
        init: function (options)
        {
           this._configure(options);
           
           this._initControlHandlers();
           
           this._prepareContentNodes();
        },
        
        _configure: function(options)
        {
           this.options = $.extend({}, this.options, options);
           
           this.mimeTypesAllowed = arquematics.mime.getMimeTypesByAllExtensions(this.options.extensions);
        },
        
        /**
         * inicializa controles estaticos
         */
        _initControlHandlers: function () 
        {
           var that = this,
               options = this.options;
       
               Dropzone.confirm  = function(question, accepted, rejected){};
               
               this.dropzone = new Dropzone(options.content_preview_container, {
                                            dictDefaultMessage:  options.dictDefaultMessage,
                                            dictFallbackMessage: options.dictFallbackMessage,
                                            dictFallbackText:    options.dictFallbackText,
                                            dictFileTooBig:      options.dictFileTooBig,
                                            dictInvalidFileType: options.dictInvalidFileType,
                                            dictResponseError:   options.dictResponseError,
                                            dictCancelUpload:    options.dictCancelUpload,
                                            dictUploadCanceled:  options.dictUploadCanceled,
                                            dictCancelUploadConfirmation: options.dictCancelUploadConfirmation,
                                            dictRemoveFile: options.dictRemoveFile,
                                            dictMaxFilesExceeded: options.dictMaxFilesExceeded,
                                            previewTemplate: $(options.preview_file_drop_template).html(),
                                            parallelUploads: 10,
                                            clickable: true,
                                            thumbnailHeight: 120,
                                            thumbnailWidth: 120,
                                           // previewsContainer: options.content_files_preview,
                                            //tamaño max
                                            maxFilesize: options.max_file_size,
                                            maxFiles: 7,
                                            url: '/',
                                            filesizeBase: 1024,
                                            thumbnail: this.getThumbnail});
                                        
             
              this.dropzone.uploadFiles = this.uploadFiles;
              

              $(options.cmd_cancel_all).click(function (e)
              {
                  e.preventDefault();
                  
                  if ($(options.tool_container)
                          .find(options.content_files_preview_item)
                          .length === 0)
                 {
                    $(options.tool_container).hide(); 
                 }
              });
              
              $(options.tool_handler).click(function (e) 
              {
                e.preventDefault();
                e.stopPropagation();

                $(that.dropzone.clickableElements[0]).trigger("click");
              });

              $('body').bind('changeScrollContent', function (e, data)
              {
                  for (var i = 0, l = Object.keys(data.messages).length ; i < l; i++) 
                  {
                    var $node = $('[data-message-id="' + data.messages[i].id + '"]')
                    , $files = $node.find(options.content_item);
                    
                    $files.each(function() {
                        that._prepareNode($(this));
                    });
                  }
              }); 
        },

        _prepareContentNodes: function() 
        {
            var options = this.options
            , $files = $(options.content_item)
            , that = this;
           
           $files.each(function() {
                 that._prepareNode($(this));
           });
	},

        _setIconForFile: function(file, fileType)
        {
            var node = file.previewElement.querySelectorAll("[data-dz-thumbnail]")
            , nodeNoPreview =  file.previewElement.querySelectorAll(".dz-nopreview")
            , nodeSuccessMark = file.previewElement.querySelectorAll(".dz-success-mark")
            , icon = arquematics.mime.getInputIconByNameType(fileType);
            
            $(nodeSuccessMark).addClass('dz-success-file-mark');
            $(nodeNoPreview).addClass('hide');
            
            if (icon !== false)
            {
              if (this.options.defIconImage.indexOf('?'))
              {
                var baseURL = this.options.defIconImage.substr(0,this.options.defIconImage.indexOf('?'));
                var extraURL = this.options.defIconImage.substr(this.options.defIconImage.indexOf('?'), this.options.defIconImage.length);
                $(node).attr('src', baseURL + '/' + icon + '.svg' + extraURL);   
              }
              else
              {
                $(node).attr('src', this.options.defIconImage + '/' + icon + '.svg'); 
              }
              
              $(node).addClass(icon + ' doc-icon');
            }
        },
        
        hideWaitIcon: function (file)
        {
            var nodeWait = file.previewElement.querySelectorAll(".dz-wait-mark");
            $(nodeWait).addClass('hide');
        },
        
        _preparePreviewNodeHandlersError: function($node, file)
        {
            var options = this.options
            , that = this;
            
            $node.find(options.cmd_cancel).on("click",function(e)
            {
               e.preventDefault();
               e.stopPropagation();
               
               var $elem = $(e.currentTarget)
               , $parent = $elem.parents(options.content_files_preview_item);
               
               //animacion
               $parent.animate({'backgroundColor':'#fb6c6c'},300);
               
               $parent.remove();
                       //si no nenemos ningun fichero
                       // mostramos el texto por defecto para enviar nuevos ficheros
               if ($(options.tool_container)
                                .find(options.content_files_preview_item)
                                .length <= 0)
               {
                        // si no existe agrega el control
                        $(options.content_files_cancel_all).show(); 
                        
                        if ($(options.content_files_preview_nofiles).length === 0)
                        {
                           $(options.tool_container)
                            .find(options.content_files_preview).append(document.querySelector(options.template_no_files).innerHTML);     
                        }
                        
                        $(options.content_files_preview_nofiles).removeClass('hide');
                        $(options.content_files_preview_nofiles).show();
                        $(options.content_files_preview_nofiles).css('display','flex');    
               }
                       
               if (file)
               {
                    file.status = Dropzone.CANCELED;
                    that.dropzone.emit("canceled", file);
                    that.dropzone.processQueue();
               }
               
               return false;
            });
            
        },
        _preparePreviewStartNodeHandlers: function($node, file, worker)
        {
            file = file || false;
            worker = worker || false;
            
            var options = this.options
            , that = this;
            
            $node.find(options.cmd_cancel).off();
            $node.find(options.cmd_cancel).on("click",function(e)
            {
               e.preventDefault();
               e.stopPropagation();
               
               file.status = Dropzone.CANCELED;
               that.dropzone.emit("canceled", file);
               that.dropzone.processQueue();
               worker.postMessage(JSON.stringify({'cmd': 'stop'}));
               
               that.dropzone.removeFile(file);
            });
        },
        _preparePreviewNodeHandlers: function($node, file, worker)
        {
            file = file || false;
            worker = worker || false;
            
            var options = this.options
            , that = this;
            
            $node.find(options.cmd_cancel).off();
            $node.find(options.cmd_cancel).on("click",function(e)
            {
               e.preventDefault();
               e.stopPropagation();
               
               var $elem = $(e.currentTarget);
               
               $.when($.ajax({
                        type: "DELETE",
                        url: $elem.data('url'),
                        datatype: "json",
                        cache: false}))
                    .done(function (){
                        
                        //expandControl
                        $('body').trigger("expandControl", false);
                        
                       if (file && worker)
                       {
                            file.status = Dropzone.CANCELED;
                            that.dropzone.emit("canceled", file);
                            that.dropzone.processQueue();
                            worker.postMessage(JSON.stringify({'cmd': 'stop'}));
                       }
                       
                    })
                    .fail(function (dataJSON){
                        
                    });
               
               return false;
            });
             
        },
        
        _getSizeAndShowWait: function ()
        {
           var usedSizes = this.options.image_sizes
           ,  findSizeByWidth = function (width)
            { 
                 var ret = usedSizes[0];
                
                 for ( var i = 0; (i < usedSizes.length); i++ )
                 {
                     ret = ((usedSizes[i].width > ret.width) 
                            && (usedSizes[i].width < width * 0.8))?usedSizes[i]:ret;
                 }
                 return ret;
            };

           $('#modal-full-screen').modal('show');
           
           return findSizeByWidth(Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
        },
       
        _showPhotoSwipe: function(galleryItems, galleryOptions, hideToolBar)
        {
             var  pswpElement = document.querySelectorAll('.pswp')[0]
             , that = this 
             , options = this.options;

             function loadFilesRelated(item)
             {
              var files = item.filesGuids
              , filesLoaded = []
              , d = $.Deferred();
                          
              if (files && (files.length > 0))
              {
                for ( var i = files.length -1, end = files.length;(i >= 0); --i)
                {
                  $.when(arquematics.loader.getFileObject('/doc/note/' + item.guid  + '/file/' + files[i], files[i], item.pass))
                  .done(function (dataObj){

                    filesLoaded.push(dataObj);
                                               
                    end--;
                    if (end === 0)
                    {
                       d.resolve(filesLoaded);
                    }
                  });
                }
              }
              else {
                  d.resolve(filesLoaded);
              }

              return d;
            }
                 
            
            if (this.gallery)
            {
              this.gallery.close();
            }

            var gallery = this.gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, galleryItems, galleryOptions);      

            
            gallery.listen('gettingData', function( index, item ) 
            {
                
            });
            

            gallery.listen('imageLoadComplete', function(index, item)
            {
               
                $("#cmd-download-image").off();
                $("#cmd-download-image").click(function (e) 
                {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    var index = gallery.getCurrentIndex()
                    , item = gallery.currItem
                    , extension = arquematics.mime.findExtensionByMimeType(item.documentType)
                    , link;
                   
                   if (item.inline)
                   {
                      if (arquematics.document.isRawchartType(item.documentType)
                          && (arquematics.codec.Base64.isBase(item.image)))
                      {
                          link = document.createElement('a');
                          link.href =  item.image;
                          link.download = item.name + '.' + extension;
                          link.target = '_back';

                          if (document.createEvent) 
                          {
                            var customEvent = document.createEvent('MouseEvents');
                            customEvent.initEvent('click', true, true);
                            link.dispatchEvent(customEvent);
                          }  
                      }
                      else if (arquematics.mime.isTextType(item.documentType))
                      {
                        $.when(loadFilesRelated(item))
                        .done(function (filesRelated){
                          
                          for (var i = filesRelated.length -1;(i >= 0); --i)
                          {
                              if (item.file && item.file.replace)
                              {
                                item.file = item.file.replace(new RegExp( '\\!\\['  + filesRelated[i].gui.replace('\\-','\\-') + '\\]\\(\\)', 'g'),'!['+ filesRelated[i].gui + '](' + filesRelated[i].blob + ')');      
                              } 
                          }

                          link = document.createElement('a');
                          link.href = 'data:text/plain;charset=utf-8,' + arquematics.codec.encodeURIData(item.file);
                          link.download = item.name + '.md';
                          link.target = '_back';
      
                          if (document.createEvent) 
                          {
                            var customEvent = document.createEvent('MouseEvents');
                            customEvent.initEvent('click', true, true);
                            link.dispatchEvent(customEvent);
                          }  
                        });

                      }
                      else if (arquematics.mime.isSvgImageType(item.documentType))
                      {
                        link = document.createElement('a');
                        link.href = 'data:image/svg+xml;charset=utf-8,' + arquematics.codec.encodeURIData(item.file);
                        link.download = item.name + '.' + extension;
                        link.target = '_back';

                        if (document.createEvent) 
                        {
                            var customEvent = document.createEvent('MouseEvents');
                            customEvent.initEvent('click', true, true);
                            link.dispatchEvent(customEvent);
                        }  
                      }
                      else if (extension && arquematics.codec.isDataURL(item.file))
                      {
                        link = document.createElement('a');
                        link.href = item.file;
                        link.download = item.name + '.' + extension;
                        link.target = '_back';
      
                        if (document.createEvent) 
                        {
                          var customEvent = document.createEvent('MouseEvents');
                          customEvent.initEvent('click', true, true);
                          link.dispatchEvent(customEvent);
                        }      
                      }
                   }
                   else
                   {
                    $.when(that._loadFullFile(item.load_url, item.pass))
                      .done(function (restoredFile)
                    {
                       $.when(arquematics.loader.getBase64String(restoredFile, item.documentType))
                        .done(function (base64String)
                        {
                            
                            link = document.createElement('a');
                            
                            link.href = 'data:' + item.documentType + ';base64,' + base64String;
                            link.download = item.name;
                            link.target = '_back';
      
                            if (document.createEvent) 
                            {
                                var customEvent = document.createEvent('MouseEvents');
                                customEvent.initEvent('click', true, true);
                                link.dispatchEvent(customEvent);
                            }
                        });
                        
                     });      
                   }
                   return false;
                });  

                
                if (arquematics.document.isRawchartType(item.documentType))
                {
                    setTimeout(function(){
                            var appFrame = $('#appViewer-' + item.id)[0];
                                appFrame.onload = function() 
                                {
                                    if (appFrame.contentWindow.view)
                                    {
                                      
                                      appFrame.contentWindow.view(item.file, options.culture );      
                                    }
                                };
                    },20); 
                }
                else if (arquematics.mime.isMimeVisorType(item.documentType))
                {
                    //tipos para visor de PDF
                     if (arquematics.mime.isPDFType(item.documentType)
                        || arquematics.mime.isOfficeType(item.documentType)
                        || arquematics.mime.isOpenOfficeType(item.documentType))
                     {
                       setTimeout(function(){

                           var appFrame = $('#appViewer-' + item.id)[0];
                              appFrame.onload = function()
                              {
                                appFrame.contentWindow.PDFViewerApplication.open(item.file);
                                
                                $(this).contents().find('.toolbar').hide();  
                              };
                        },2); 
                    }
                    else if (arquematics.mime.isCompressedType(item.documentType))
                    {
                        setTimeout(function(){
                            var appFrame = $('#appViewer-' + item.id)[0];
                                appFrame.onload = function() 
                                {
                                    if (appFrame.contentWindow.extract)
                                    {
                                      appFrame.contentWindow.extract(item.file, item.documentType, options.culture );      
                                    }
                                };
                        },20); 
                            
                    }
                    else if (arquematics.mime.isSvgImageType(item.documentType))
                    {
                        setTimeout(function(){
                          var appFrame = $('#appViewer-' + item.id)[0];

                          appFrame.onload = function() 
                          {
                            var myImage = new Image();
                            myImage.src = item.file;
                            
                            $(this)
                              .contents()
                              .find('#svg-content')
                              .append(myImage);
                          }; 

                        },10); 
                        /*
                        var rollMyFile = new RollMyFile('Ky26i43M7b0zHItO4d02uYhoK5nzoORESZW5L2po');
                        rollMyFile.openFileByUrl("https://upload.wikimedia.org/wikipedia/en/2/22/Heckert_GNU_white.svg");
                        
                        */
                        
                    }
                    else if (arquematics.mime.isTextType(item.documentType))
                    {
                      setTimeout(function(){
                        var appFrame = $('#appViewer-' + item.id)[0];

                        appFrame.onload = function() 
                        {
                            if (appFrame.contentWindow.loadDoc)
                            {
                                appFrame.contentWindow.loadDoc(item.file, item.files);      
                            }
                        }; 
                      },20); 
                       
                    }
                   else if (arquematics.mime.is3DSTL(item.documentType))
                   {
                       setTimeout(function(){
                       var appFrame = $('#appViewer-' + item.id)[0];
                       appFrame.onload = function() 
                       {
                          appFrame.contentWindow.load3DDoc( item.file, appFrame.contentWindow);
                       };
                      },2);  
                   }
                }
            });
            
            gallery.listen('afterInit', function() {
               //quita la segunda barra
               $(options.content_wrapper)
                            .hide(); 
             
                if (hideToolBar)
                {
                  $('.pswp__top-bar').addClass('hide');     
                }
                else
                {
                  $('.pswp__top-bar').removeClass('hide');     
                }
            });
            
            gallery.listen('close', function() {
                clearInterval(window.photoswipeSlideshow);
                $('button.pswp__button--slideshow' ).off('click');
                $('.pswp').addClass('hide').hide();

                $('#modal-full-screen').modal('hide');
                
                
                $(options.content_wrapper)
                    .show()
                    .removeClass('hide');

            });
            
            // beforeResize event fires each time size of gallery viewport updates
            gallery.listen('beforeResize', function() {
            
            });
            
                  
            gallery.init();
                  
        },
        
        _addGalleryNodeHandlers: function ($node)
        {
            var options = this.options
            , that = this;
           
            $node.on("click",function(e)
            {
               e.preventDefault();
               var $elem = $(e.currentTarget)
               , docId = $elem.data('id')
               , $galleryNode = $elem.parents(options.content_container)
               , $contentItems =  $galleryNode.find(options.content_item_visor)
               , $contentItem
               //tamaño a cargar para los elementos
               , galleryItems = []
               , i = 0
               , start = new Date().getTime()
               , galleryOptions = {index:i,
                                   jQueryMobile: true}
                               
               , addToGallery = function(item)
               {
                  galleryItems.push(item);
                  
                  var ret = (galleryItems.length >= $contentItems.length);
                  if (ret)
                  {
                      $galleryNode.data('loaded', true);
                  }
                  return ret;
               };
               
               if (($contentItems.length > 0) && !$galleryNode.data('loaded'))
               {
                  var usedSize = that._getSizeAndShowWait()
                  , entropy = new Uint32Array(32)
                  , itemsToLoad = $contentItems.length
                  , workrsRun = 0
                  , workrQueue = [];
                        
                        crypto.getRandomValues(entropy);
                        
                        $contentItems.each(function() 
                        {
                            var $contentItem = $(this);
                            if ($contentItem.data('inline'))
                            {
                               if (arquematics.document.isRawchartType($contentItem.data('document-type')))
                               {
                                   $contentItem.data('dataFile',$contentItem.data('src'));
                                   itemsToLoad--;
                                   if ((itemsToLoad === 0)
                                        && (workrQueue.length === 0))
                                   {
                                        $galleryNode.data('loaded', true);
                                        $elem.click();
                                   }
                               }
                               else if (arquematics.mime.isImageType($contentItem.data('document-type')))
                               {
                                   $.when(arquematics.loader.getObjectURLFromDataURL($contentItem.data('src')))
                                    .done(function (blobURLOBJ){
                                        
                                        $contentItem.data('dataFile', $contentItem.data('src'));
                                        $contentItem.attr('href', blobURLOBJ);
                                        
                                        itemsToLoad--;
                                        if ((itemsToLoad === 0)
                                        && (workrQueue.length === 0))
                                        {
                                            $galleryNode.data('loaded', true);

                                            $elem.click();
                                        }
                                    });
                               }
                               else if (arquematics.mime.isTextType($contentItem.data('document-type')))
                               {
                                  
                                   $contentItem.data('dataFile', $contentItem.data('src'));
                                   
                                   var files = $contentItem.data('files');
                                 
                                   if (files && (files.length > 0))
                                   {
                                        for ( var i = files.length -1, end = files.length;(i >= 0); --i)
                                        {
                                            $.when(arquematics.loader.getFileObjectURL('/doc/note/' + $contentItem.data('guid')  + '/file/' + files[i],$contentItem.data('guid'), files[i], $contentItem.data('content')))
                                            .done(function (dataObj){
                                                var $noteNode = $galleryNode.find(options.content_item_visor + "[data-guid='" + dataObj.gui +"']")
                                                , filesLoaded = $noteNode.data('files-loaded');
                                                
                                                filesLoaded.push(dataObj);
                                                $noteNode.data('files-loaded', filesLoaded);

                                                end--;
                                                if (end === 0)
                                                {
                                                  itemsToLoad--;
                                                }
                                                
                                                if ((end === 0)
                                                    && (itemsToLoad === 0)
                                                    && (workrQueue.length === 0))
                                                {
                                                    $galleryNode.data('loaded', true); 
                                                    
                                                    $elem.click();  
                                                }
                                            });
                                        }
                                   }
                                   else
                                   {
                                        itemsToLoad--;
                                        if ((itemsToLoad === 0)
                                            && (workrQueue.length === 0))
                                        {
                                            $galleryNode.data('loaded', true); 
                                            
                                            $elem.click();
                                        }
                                   }
                               }
                            }
                            else
                            {  
                                var worker = new Worker(options.downloadBase64URL);

                                worker.addEventListener('message', function(e) {
                                    var data = e.data;
                                    if (data && data.byteLength) //ok tiene datos
                                    {
                                        var $node = $galleryNode.find(options.content_item_visor + "[data-id='" + worker.workerId +"']");
                                        //si es una imagen la carga en memoria
                                        if (arquematics.mime.isSvgImageType($node.data('document-type')))
                                        {
                                            $.when(arquematics.loader.getBase64String(data, $node.data('document-type')))
                                            .done(function (data){
                                                //alert('data:image/svg+xml;base64,' + data);
                                                $node.data('dataFile', 'data:image/svg+xml;base64,' + data);
                                                worker.postMessage({'cmd': 'stop'});  
                                            }); 
                                        }
                                        else if (arquematics.mime.isImageType($node.data('document-type')))
                                        {
                                          $.when(arquematics.loader.getObjectURL(data, $node.data('document-type')))
                                            .done(function (blobURLOBJ){
                                                $node.attr('href', blobURLOBJ);
                                                worker.postMessage({'cmd': 'stop'});  
                                          }); 
                                        }
                                        else if (arquematics.mime.isDxf($node.data('document-type'))
                                            || arquematics.mime.isDwg($node.data('document-type'))
                                            || arquematics.mime.isPsd($node.data('document-type')))
                                        {
                                            $.when(arquematics.loader.getObjectURL(data, 'image/png'))
                                            .done(function (blobURLOBJ){
                                                $node.attr('href', blobURLOBJ);
                                                worker.postMessage({'cmd': 'stop'});  
                                            });
                                        }
                                        else if (arquematics.mime.isPDFType($node.data('document-type'))
                                              || arquematics.mime.isOfficeType($node.data('document-type'))
                                              || arquematics.mime.isOpenOfficeType($node.data('document-type')))
                                        {
                                            //los documentos office estan en PDF
                                            $.when(arquematics.loader.getUint8Array(data, 'application/pdf'))
                                            .done(function (data){
                                                $node.data('dataFile', data);
                                                worker.postMessage({'cmd': 'stop'});  
                                            });     
                                        }
                                        else if (arquematics.mime.isCompressedType($node.data('document-type')))
                                        {
                                            $.when(arquematics.loader.getBlob(data, $node.data('document-type')))
                                            .done(function (data){
                                                $node.data('dataFile', data);
                                                worker.postMessage({'cmd': 'stop'});  
                                            });    
                                        }
                                        else if (arquematics.mime.is3DSTL($node.data('document-type')))
                                        {
                                            $.when(arquematics.loader.getBinaryString(data))
                                            .done(function (data){
                                                $node.data('dataFile', data);
                                                worker.postMessage({'cmd': 'stop'});  
                                            }); 
                                        }
                                        else if (arquematics.mime.isTextType($contentItem.data('document-type')))
                                        {
                                             $.when(arquematics.loader.getBase64String(data, $node.data('document-type')))
                                            .done(function (data){
                                                $node.data('dataFile', arquematics.codec.Base64.b64DecodeUnicode(data));
                                                worker.postMessage({'cmd': 'stop'});  
                                            }); 
                                        }
                                        else
                                        {
                                          $node.data('dataFile', data);
                                          worker.postMessage({'cmd': 'stop'});  
                                        }
                                    }
                                    else
                                    {
                                        switch (data.cmd) {
                                            case 'ready':
                                            //identificacion del worker                                           
                                            worker.workerId = $contentItem.data('id');
                                            if (workrsRun > 2)
                                            {
                                                workrQueue.push(worker);      
                                            }
                                            else
                                            {
                                              //inicia el worker
                                              worker.postMessage(JSON.stringify({'cmd': 'start'}));
                                            }
                                        break;
                                        case 'start':
                                           // worker.start = true;
                                            workrsRun++;
                                        break;
                                        case 'debug':
                                            if (console)
                                            {
                                                console.log(data);   
                                            }
                                        break;
                                        case 'err':
                                            if (console)
                                            {
                                                console.log('error');
                                            }
                                        break;
                                    
                                        case 'stop':
                                            itemsToLoad--;
        
                                            if (workrQueue.length > 0)
                                            {
                                                var workrQueueItem = workrQueue.shift();
                                                //inicia el worker
                                                workrQueueItem.postMessage(JSON.stringify({'cmd': 'start'}));
                                            }       
                                            else if ((itemsToLoad === 0)
                                                && (workrQueue.length === 0))
                                            {
                                                $galleryNode.data('loaded', true);
                                                
                                                var end = new Date().getTime();
                                                var time = end - start;
                                                
                                                if (console)
                                                {
                                                  console.log('Execution time: ' + time);      
                                                }
        
                                                //muestra las imagenes
                                                $elem.click();
                                           
                                            }
                                            else
                                            {
                                                workrsRun--;
                                            }
                                            break;
                                          }      
                                        }
                                
                                    }, false);
                                //inicializacion del worker
                                worker.postMessage({
                                        cmd: 'entropy',
                                        value: entropy,
                                        size: 1024,
                                        crypt: (arquematics.crypt)?true:false,
                                        source: 'crypto.getRandomValues',
                                        url: $contentItem.data('load-url'),
                                        pass:$contentItem.data('content')
                                });  
                            }
                        });

               }
               else if (($contentItems.length > 0) && $galleryNode.data('loaded'))
               {
                   $contentItems.each(function() 
                   {
                        var $contentItem = $(this);
                      
                        if (docId == $contentItem.data('id'))
                        {
                          galleryOptions.index = i;
                        }
                        i++;
                        
                        if (arquematics.document.isRawchartType($contentItem.data('document-type')))
                        {
                          if (addToGallery({
                                        ext: $contentItem.data('ext'),
                                        guid: $contentItem.data('guid'),
                                        editUrl: $contentItem.data('load-url'),
                                        inline: $contentItem.data('inline'),
                                        load_url: $contentItem.data('load-url'),
                                        hasPrev: ($contentItems.length === 1) ? false: true,
                                        hasNext: ($contentItems.length === 1) ? false: true,
                                        name: $contentItem.data('name'),
                                        image: $contentItem.data('image'),
                                        id: $contentItem.data('id'),
                                        html: '<iframe id="appViewer-' + $contentItem.data('id') + '" src="/arquematicsPlugin/js/components/rawchart/index.html" style="width: 100%; height: 100%;" allowfullscreen="" webkitallowfullscreen=""></iframe>',
                                        documentType: $contentItem.data('document-type'),
                                        pass: $contentItem.data('content'),
                                        file: $contentItem.data('dataFile')
                                 }))
                             {
                                  that._showPhotoSwipe(galleryItems, galleryOptions, false);  
                             }
                        }
                        else if (arquematics.mime.isPDFType($contentItem.data('document-type'))
                           || arquematics.mime.isOfficeType($contentItem.data('document-type'))
                           || arquematics.mime.isOpenOfficeType($contentItem.data('document-type')))
                        {
                            if (addToGallery({
                                        ext: $contentItem.data('ext'),
                                        guid: $contentItem.data('guid'),
                                        editUrl: false,
                                        inline: $contentItem.data('inline'),
                                        load_url: $contentItem.data('load-url'),
                                        hasPrev: ($contentItems.length === 1) ? false: true,
                                        hasNext: ($contentItems.length === 1) ? false: true,
                                        name: $contentItem.data('name'),
                                        id: $contentItem.data('id'),
                                        html: '<iframe id="appViewer-' + $contentItem.data('id') + '" src="/bundles/wall/js/vendor/pdf/build/generic/web/viewer.html" style="width: 100%; height: 100%;" allowfullscreen="" webkitallowfullscreen=""></iframe>',
                                        documentType: $contentItem.data('document-type'),
                                        pass: $contentItem.data('content'),
                                        file: $contentItem.data('dataFile')
                                 }))
                            {
                                  that._showPhotoSwipe(galleryItems, galleryOptions, false);  
                            }    
                        }
                        else if (arquematics.mime.isTextType($contentItem.data('document-type')))
                        {
                        
                          if (addToGallery({
                                        ext: $contentItem.data('ext'),
                                        guid: $contentItem.data('guid'),
                                        editUrl: false,
                                        inline: $contentItem.data('inline'),
                                        load_url: $contentItem.data('load-url'),
                                        hasPrev: ($contentItems.length === 1) ? false: true,
                                        hasNext: ($contentItems.length === 1) ? false: true,
                                        name: $contentItem.data('name'),
                                        id: $contentItem.data('id'),
                                        html: '<iframe id="appViewer-' + $contentItem.data('id') + '" src="/bundles/wall/js/vendor/markdown/index.html" style="width: 100%; height: 100%;" allowfullscreen="" webkitallowfullscreen=""></iframe>',
                                        documentType: $contentItem.data('document-type'),
                                        pass: $contentItem.data('content'),
                                        filesGuids: $contentItem.data('files'),
                                        files: $contentItem.data('files-loaded'),
                                        file: $contentItem.data('dataFile')
                                 }))
                                {
                                   that._showPhotoSwipe(galleryItems, galleryOptions, false);  
                                }
                        }
                        else if (arquematics.mime.isSvgImageType($contentItem.data('document-type')))
                        {
                          if (addToGallery({
                                        ext: $contentItem.data('ext'),
                                        guid: $contentItem.data('guid'),
                                        editUrl: false,
                                        inline: $contentItem.data('inline'),
                                        load_url: $contentItem.data('load-url'),
                                        hasPrev: ($contentItems.length === 1) ? false: true,
                                        hasNext: ($contentItems.length === 1) ? false: true,
                                        name: $contentItem.data('name'),
                                        id: $contentItem.data('id'),
                                        html: '<iframe id="appViewer-' + $contentItem.data('id') + '" src="/bundles/wall/js/vendor/svg/index.html" style="width: 100%; height: 100%;" allowfullscreen="" webkitallowfullscreen=""></iframe>',
                                        documentType: $contentItem.data('document-type'),
                                        pass: $contentItem.data('content'),
                                        file: $contentItem.data('dataFile')
                                 }))
                             {
                                  that._showPhotoSwipe(galleryItems, galleryOptions, false);  
                             }
                        }
                        else if (arquematics.mime.isCompressedType($contentItem.data('document-type')))
                        {
                            if (addToGallery({
                                        ext: $contentItem.data('ext'),
                                        guid: $contentItem.data('guid'),
                                        editUrl: false,
                                        inline: $contentItem.data('inline'),
                                        load_url: $contentItem.data('load-url'),
                                        hasPrev: ($contentItems.length === 1) ? false: true,
                                        hasNext: ($contentItems.length === 1) ? false: true,
                                        name: $contentItem.data('name'),
                                        id: $contentItem.data('id'),
                                        html: '<iframe id="appViewer-' + $contentItem.data('id') + '" src="/bundles/wall/js/vendor/ViewCompressed/index.html" style="width: 100%; height: 100%;" allowfullscreen="" webkitallowfullscreen=""></iframe>',
                                        documentType: $contentItem.data('document-type'),
                                        pass: $contentItem.data('content'),
                                        file: $contentItem.data('dataFile')
                                 }))
                                {
                                  that._showPhotoSwipe(galleryItems, galleryOptions, false);  
                                }
                        }
                        else if (arquematics.mime.isOpenOfficeType($contentItem.data('document-type')))
                        {
                            if (addToGallery({
                                        ext: $contentItem.data('ext'),
                                        guid: $contentItem.data('guid'),
                                        editUrl: false,
                                        inline: $contentItem.data('inline'),
                                        load_url: $contentItem.data('load-url'),
                                        hasPrev: ($contentItems.length === 1) ? false: true,
                                        hasNext: ($contentItems.length === 1) ? false: true,
                                        name: $contentItem.data('name'),
                                        id: $contentItem.data('id'),
                                        html: '<iframe id="appViewer-' + $contentItem.data('id') + '" src="/arquematicsPlugin/js/components/ViewerJS/index.html" style="width: 100%; height: 100%;" allowfullscreen="" webkitallowfullscreen=""></iframe>',
                                        documentType: $contentItem.data('document-type'),
                                        pass: $contentItem.data('content'),
                                        file: $contentItem.data('dataFile')
                                 }))
                                {
                                  that._showPhotoSwipe(galleryItems, galleryOptions, false); 
                                }
                        }
                        else if (arquematics.mime.is3DSTL($contentItem.data('document-type')))
                        {
                            if (addToGallery({
                                        ext: $contentItem.data('ext'),
                                        guid: $contentItem.data('guid'),
                                        editUrl: false,
                                        inline: $contentItem.data('inline'),
                                        load_url: $contentItem.data('load-url'),
                                        hasPrev: ($contentItems.length === 1) ? false: true,
                                        hasNext: ($contentItems.length === 1) ? false: true,
                                        name: $contentItem.data('name'),
                                        id: $contentItem.data('id'),
                                        html: '<iframe id="appViewer-' + $contentItem.data('id') + '" src="/bundles/wall/js/vendor/stlviewer/index.html" style="width: 100%; height: 100%;" allowfullscreen="" webkitallowfullscreen=""></iframe>',
                                        documentType: $contentItem.data('document-type'),
                                        pass: $contentItem.data('content'),
                                        file: $contentItem.data('dataFile')
                                 }))
                                {
                                  that._showPhotoSwipe(galleryItems, galleryOptions, false);
                                }
                        }
                        else if (arquematics.mime.isDxf($contentItem.data('document-type'))
                              || arquematics.mime.isDwg($contentItem.data('document-type'))
                              || arquematics.mime.isPsd($contentItem.data('document-type')))
                        {
                            var image  = new Image();
                             image.onload = function() {
                                
                                if (addToGallery({
                                    ext: $contentItem.data('ext'),
                                    guid: $contentItem.data('guid'),
                                    editUrl: false,
                                    inline: $contentItem.data('inline'),
                                    load_url: $contentItem.data('load-url'),
                                    hasPrev: ($contentItems.length === 1) ? false: true,
                                    hasNext: ($contentItems.length === 1) ? false: true,
                                    name: $contentItem.data('name'),
                                    id: $contentItem.data('id'),
                                    documentType: 'image/png',
                                    pass: $contentItem.data('content'),
                                    src: $contentItem.attr('href'),
                                    file: $contentItem.data('dataFile'),
                                    w: this.width, // image width
                                    h: this.height // image height
                                }))
                                {
                                  that._showPhotoSwipe(galleryItems, galleryOptions, false);    
                                }
                                
                            };
                            
                            image.src = $contentItem.attr('href');
                        }
                        else if (arquematics.mime.isImageType($contentItem.data('document-type')))
                        {
                             var image  = new Image();
                             image.onload = function() {
                                
                                if (addToGallery({
                                    ext: $contentItem.data('ext'),
                                    inline: $contentItem.data('inline'),
                                    editUrl: false,
                                    load_url: $contentItem.data('load-url'),
                                    hasPrev: ($contentItems.length === 1) ? false: true,
                                    hasNext: ($contentItems.length === 1) ? false: true,
                                    name: $contentItem.data('name'),
                                    id: $contentItem.data('id'),
                                    documentType: $contentItem.data('document-type'),
                                    pass: $contentItem.data('content'),
                                    file: $contentItem.data('dataFile'),
                                    src: $contentItem.attr('href'),
                                    w: this.width, // image width
                                    h: this.height // image height
                                }))
                                {
                                   that._showPhotoSwipe(galleryItems, galleryOptions, false);
                                }
                                
                            };
                            
                            image.onerror = function(e){
                                //display error
                                if (console)
                                {
                                   console.log(e);      
                                }
                            };

                            image.src = $contentItem.attr('href');
                        } 
                    });
               }
            });
        },
        
        _loadFullFile: function(url, pass)
        {
           var worker = new Worker(this.options.downloadBase64URL)
           , entropy = new Uint32Array(32)
           , d = $.Deferred();
            
           worker.addEventListener('message', function(e) {
                var data = e.data;
                //esto posiblemente tenga que cambiarlo por compatibilidad
                if (data && data.byteLength) //ok tiene datos
                {
                   d.resolve(data);                 
                }
                else
                {
                    switch (data.cmd) {
                        case 'ready':
                            //inicia el worker
                            worker.postMessage(JSON.stringify({'cmd': 'start'}));    
                        break;
                        case 'start':
                        break;
                        case 'debug':
                            if (console)
                            {
                              console.log(data);  
                            }
                        break;
                        case 'err':
                            d.reject(data); 
                        break;
                        case 'stop':
                        break;
                    }
                }
           }, false);
           
           crypto.getRandomValues(entropy);
           //inicializacion del worker
           worker.postMessage({
                cmd: 'entropy',
                value: entropy,
                crypt: (arquematics.crypt)?true:false,
                size: 1024,
                source: 'crypto.getRandomValues',
                url: url,
                pass: pass
           });
           
           return d;
        },
        
        _prepareNode: function($node)
        {
             var imageClass = this.options.content_item_visor.replace(/\./g, '');
             
             if ($node.hasClass(imageClass))
             {
               this._addGalleryNodeHandlers($node);      
             }
             
        },
        
        getThumbnail: function(file, dataUrl)
        {
            if (file.previewElement)
            {
                var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
                
                file.previewElement.classList.remove("dz-file-preview");
                
                for (var ii = 0; ii < images.length; ii++)
                {
                        var $thumbnailElement = $(images[ii]);
                        
                        $thumbnailElement.attr('alt',file.name);
                        $thumbnailElement.attr('src', dataUrl);
                }
                setTimeout(function() { file.previewElement.classList.add("dz-image-preview"); }, 1);
            }
            //genera el nuevo elemento de icono
        },
        
        uploadThumbnails: function(data, file, pass)
        {
            var self = this
            ,  d = $.Deferred()
            ,  imageSizes = this.options.image_sizes
            ,  imageSize;
                   
            for ( var i = imageSizes.length -1, countItems = imageSizes.length; i >= 0; --i )
            {
               imageSize = imageSizes[i];
               
               $.when(arquematics.graphics.createThumbnailFromDataUrl(data.src , file.type, imageSize.name, imageSize.width, imageSize.height))
               //$.when(self.dropzone.createThumbnailFromUrlNoEvents(data.src,imageSize.width, imageSize.height, imageSize.name))
                 .done(function (dataUrl, name){
                      $.when(self.sendFilePreview({
                                   size: function ()
                                   {
                                     return this.src.length;  
                                   }, 
                                   src: dataUrl,
                                   type: data.type, 
                                   dropFileId: data.fileId,
                                   style: name
                        },pass))
                      .done(function (){
                            
                            countItems--;
                            //actualiza la barra de progreso
                            self.dropzone.emit("uploadprogress", file, 100 * ((imageSizes.length - 1) - countItems) / (imageSizes.length - 1));
                            if (countItems <= 0)
                            {
                                d.resolve(true);     
                            }        
                        })
                      .fail(function (){
                        d.reject();          
                        });
                 })
                .fail(function (){
                     d.reject();         
                });
            }
            
            return d;
        },
        
        getMimeType: function(file)
        {
            var fileMimeType = arquematics.mime.findRealMimeType(file.type);
            if (fileMimeType === '')
            {
                fileMimeType = arquematics.mime.findRealMimeTypeByFileName(file.name); 
            }
            return fileMimeType;
        },
        
        
        
        uploadFiles: function (files) 
        {
            var that = this  
            , reader = new FileReader()
            , dropzone = arquematics.dropzone
            , options = dropzone.options
            
            //, pass = dropzone.randomGenerator.get()
            
            , itemsToSave = files.length
            , workrsRun = 0
            , workrQueue = []
            , fileMimeType = '';

            //oculta la ventana predetermina para cuando no tiene
            //archivos si no esta oculta ya
            $(options.content_files_preview_nofiles).hide();
            
            options.sessionFiles += itemsToSave;
            
            //espera a que termine la peticion anterior
            arquematics.dropzone.waitForContent = true;
            
            function parseOptions(options){
                return JSON.stringify({
                   BYTES_PER_CHUNK: options.BYTES_PER_CHUNK,
                   sendURL:  $(options.form_drop).attr('action'),
                   csrfTokenSend: $(options.input_control_csrf_token).val(),
                   sendPreviewURL: $(options.form_drop_preview).attr('action'),
                   csrfTokenPreview: $(options.input_control_preview_csrf_token).val(), 
                   chunkPreviewURL: $(options.form_chunk_preview).attr('action'),
                   csrfTokenChunkPreview: $(options.input_control_preview_chunk_csrf_token).val(),
                   chunkURL: $(options.form_chunk).attr('action'),
                   csrfTokenChunk: $(options.input_control_chunk_csrf_token).val(),
                   sizes: options.image_sizes
                });
            }
            
            if (files.length > 0)
            {
              //expandControl con bloqueo
              $('body').trigger("expandControl", true);
                
              //ocultar el boton de ocultar todo el control
              $(options.content_files_cancel_all).hide();
              
              for (var i = 0, file; i < files.length; i++)
              {
                file =  files[i];
                file.id = i;
                
                reader.onload = function (event) {

                   fileMimeType = dropzone.getMimeType(file);
                   
                   if ((fileMimeType.length > 0) 
                       && (arquematics.mime.isFileType(fileMimeType, dropzone.mimeTypesAllowed)))
                   {
                       
                       var entropy = new Uint32Array(32)
                       , worker = new Worker(options.uploadBase64URL);
                        
                        worker.addEventListener('message', function(e) {
                                var data = e.data
                                , endFile;
                           
                                switch (data.cmd) {
                                    case 'ready':
                                     //identificacion del worker 
                                     // con la id del index del fichero 
                                     worker.workerId = file.id;
                                     worker.data = arquematics.codec.ArrayBuffer.toBase64String(event.target.result, fileMimeType);
                                     worker.type = fileMimeType;
                                     worker.name = file.name;
                                     worker.size = file.size;
                                     worker.pass = arquematics.utils.randomKeyString(50);
                                     worker.url = '';
                                     
                                     
                                     endFile = files[worker.workerId];
                                     
                                     var $cmdCancel = $(endFile.previewElement).find(options.cmd_cancel)
                                        , $parent = $cmdCancel.parent();
                                     dropzone._preparePreviewStartNodeHandlers($parent, endFile, worker);
                                     
                                     if (!arquematics.mime.isImageType(worker.type))
                                     {
                                         //esto lo hago asi porque
                                         //endFile.type es de solo lectura y puede
                                         //no estar bien la detección del tipo mime 
                                         dropzone._setIconForFile(endFile, worker.type);       
                                     }
                                     
                                     if (workrsRun >= 3)
                                     {
                                       workrQueue.push(worker);      
                                     }
                                     else
                                     {
                                        //inicia el worker
                                        worker.postMessage(
                                              {
                                                cmd: 'start',
                                                type: worker.type,
                                                name: worker.name,
                                                size: worker.size,
                                                pass: (arquematics.crypt)?worker.pass:false,
                                                crypt: (arquematics.crypt)?true:false,
                                                options: parseOptions(options),
                                                fileArrayBuf: worker.data
                                              }
                                        );
                                     }
                                    break;
                                    case 'start':
                                        worker.start = true;
                                        workrsRun++;
                                    break;
                                    case 'fileCreated':
                                        endFile = files[worker.workerId];
                                                                   
                                        var $cmdCancel = $(endFile.previewElement).find(options.cmd_cancel)
                                        , $parent = $cmdCancel.parent(); 
                                        
                                        $cmdCancel.data('url', data.url);
                                        
                                        dropzone._preparePreviewNodeHandlers($parent, endFile, worker);
                                        
                                        
                                    break;
                                    case 'debug':
                                        if (console)
                                        {
                                          console.log(data);    
                                        }
                                        
                                    break;
                                    case 'err':
                                        if (console)
                                        {
                                            console.log('error');        
                                        }
                                        endFile = files[worker.workerId];

                                        endFile.status = Dropzone.ERROR;
                                        that.emit("error", endFile, 'error', null);
                                        that.emit("complete", endFile);
                                        that.processQueue();
                                        
                                        options.sessionFiles--;
                                        itemsToSave--;
                                        
                                         //se han guardado todos los ficheros
                                        if ((itemsToSave === 0)
                                            && (workrQueue.length === 0)
                                            && (options.sessionFiles === 0))
                                        {
                                            //ha terminado 
                                            arquematics.dropzone.waitForContent = false;
                                        }
                                    break;
                                    case 'createThumbnails':
                                        var images = []
                                        , fileData = data.extraContent? data.fileData:worker.data
                                        , fileType = data.extraContent? data.dataType:worker.type;
                                        
                                        for ( var i = options.image_sizes.length -1, thumbnailCount = 0; i >= 0; --i )
                                        {
                                            
                                            var imageSize = options.imageDefault[options.image_sizes[i]];
                                            $.when(arquematics.graphics.createThumbnailFromDataUrl(fileData , fileType, imageSize.name, imageSize.w, imageSize.h))
                                            .done(function (dataUrl, name, mimeType){
                                              
                                                images.push({name: name, src: dataUrl, type: mimeType});
                                                
                                                thumbnailCount++;
                                                if (thumbnailCount === options.image_sizes.length)
                                                {
                                                   worker.postMessage({cmd: 'sendThumbnails',
                                                                     fileId: data.fileId,
                                                                     //URL del fichero no dataURL
                                                                     url: data.url,
                                                                     type: worker.type,
                                                                     name: worker.name,
                                                                     images: JSON.stringify(images),
                                                                     crypt: (arquematics.crypt)?true:false,
                                                                     pass: (arquematics.crypt)?worker.pass:false,
                                                                     options: parseOptions(options)});     
                                                }
                                            });
                                        }  
                                    break;
                                    case 'uploadprogress':

                                        var progressFile = files[worker.workerId];
                                        that.emit("uploadprogress", progressFile, data.progress);
                                    break;
                                    case 'stop':
                                        //termina el hilo
                                        worker.start = false;
                                        //mensaje a Dropzone para que de por terminada
                                        //la descarga
                                        endFile = files[worker.workerId];

                                        endFile.status = Dropzone.SUCCESS;
                                        
                                        dropzone.hideWaitIcon(endFile);
                                        
                                        that.emit("uploadprogress", endFile, 100 );
                                        that.emit("success", endFile, 'success', null);
                                        that.emit("complete", endFile);
                                        that.processQueue();

                                        options.sessionFiles--;
                                        itemsToSave--;
                                        //se han guardado todos los ficheros
                                        if ((itemsToSave === 0)
                                             && (workrQueue.length === 0)
                                             && (options.sessionFiles === 0) 
                                        )
                                        {
                                          //ha terminado 
                                          arquematics.dropzone.waitForContent = false;
                                        }
                                        //lanza el primer work de la cola 
                                        else if (workrQueue.length > 0)
                                        {
                                            
                                           var workrQueueItem = workrQueue.shift();
                                            //inicia el worker
                                            workrQueueItem.postMessage(
                                              {
                                                cmd: 'start',
                                                type: worker.type,
                                                name: worker.name,
                                                size: worker.size,
                                                crypt: (arquematics.crypt)?true:false,
                                                pass:  (arquematics.crypt)?workrQueueItem.pass: false,
                                                options: parseOptions(options),
                                                fileArrayBuf: worker.data
                                              }
                                            );
                                        }
                                        else
                                        {
                                           workrsRun--;
                                        }
                                    break;
                                   }      
                                
                            }, false);
                            
                        
                        //inicializacion del worker
                        if (arquematics.crypt)
                        { 
                            crypto.getRandomValues(entropy);
                            worker.postMessage({
                                cmd: 'initCrypt',
                                value: entropy,
                                size: 1024,
                                crypt: true,
                                source: 'crypto.getRandomValues',
                                privPublic: arquematics.crypt.getData(),
                                keys: JSON.stringify(arquematics.crypt.getPublicEncKeys())
                            });
               
                        }
                        else
                        {
                            worker.postMessage({
                                cmd: 'initCrypt',
                                value: entropy,
                                size: 1024,
                                crypt: false,
                                source: 'crypto.getRandomValues',
                                privPublic: false,
                                keys: false
                            });
                        }
                        
                   }
                   //error el tipo mime no esta bien
                   else
                   {   
                     file.status = Dropzone.ERROR;
                     that.emit("error", file, 'error', null);
                     that.emit("complete", file);
                     that.processQueue();

                     options.sessionFiles--;
                     itemsToSave--;
                     
                     //se han guardado todos los ficheros
                     if ((itemsToSave === 0)
                        && (workrQueue.length === 0)
                        && (options.sessionFiles === 0))
                     {
                       //ha terminado 
                       arquematics.dropzone.waitForContent = false;
                     }
                     
                      var $cmdCancel = $(file.previewElement).find(options.cmd_cancel)
                     , $parent = $cmdCancel.parent(); 
                     
                     dropzone._preparePreviewNodeHandlersError($parent, file);
                   }  
                };

                reader.readAsArrayBuffer(file);
              }   
            }
        },

        controlName: function()
        {
          return 'drop';
        },
        
        removeAllCancel: function()
        {
            var options = this.options;
            
            $( options.cmd_cancel ).each(function( index ) {
                $(this).remove();
            });
        },
        
        sendContent: function ()
        {
          if (this.options.sessionFiles === 0)
          {
             arquematics.wall.context.next(); 
             //desbloquea las acciones
             this.waitForContent = false;
             //no tiene archivos en la sesion
             this.options.hasSessionFiles = false;
          }
        },
            
        /**
         * lista de estados disponibles para ejecutar
         * 
         * @returns {array}
         */       
        getAvailableToolStatus: function()
        {
            var ret = [];
            ret.push(new arquematics.dropzone.sendDropContent());

            return ret;
        },
        
        update: function(message) 
        {
          var that = this
          , options = this.options;

          if (message instanceof arquematics.wall.message)
          {
              if (message.getState() === arquematics.wall.messageStatus.ready)
              {
                 var dataJson = message.getContent()
                , $node = $('[data-message-id="' + dataJson.id + '"]')
                , $files = $node.find(options.content_item);
                    
                $files.each(function() {
                        that._prepareNode($(this));
                });
              }
          }
          //resetea el control
          this.reset();
	}
};

arquematics.dropzone.sendDropContent = function () 
{
    this.name = 'sendDropContent';

    this.go = function (param)
    {
        //borra todos los bottones de cancelar
        arquematics.dropzone.removeAllCancel();
        
        if (!arquematics.dropzone.waitForContent)
        {
          arquematics.dropzone.sendContent();      
        }
        else
        {
          //$('body').addClass('loading');
          //espera 1/2 segundo y vuelve a intentar
          setTimeout($.proxy(function() {
            this.go(param);
          }, this), 500);    
        }
        
    };
};

return arquematics;

}(jQuery, arquematics || {}, PhotoSwipe, PhotoSwipeUI_Default,  window));