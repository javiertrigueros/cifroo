    /**
 * @package: arquematicsPlugin
 * @version: 0.1
 * @Autor: Arquematics 2010 
 *         by Javier Trigueros Martínez de los Huertos
 *         
 *  depende de:
 *  - jquery.ajaxQueue.js
 *  
 */

/**
 * 
 * @param {type} $
 * @param {type} arquematics
 */
(function (Mustache, $, arquematics) {

arquematics.link =  {
	options: {
             //elementos en la session
            sessionLinks: [],
            //elementos eliminados
            sessionDeletedLinks: [],
            cancel_url:             '',
            
            input_control_message:      '.emojionearea-editor',
            
            template_link:       '#template-link',
            template_video:      '#template-video',
            
            form: "#link_create",
            
            content: '#content',
            content_preview: '#link-preview-container',
            content_video_static:       '.wall-link-video-static',

            content_dinamic:            '.wall-link-dinamic',
            content_item:               '.wall-link-item',
            content_image:              '.link-image',
            content_image_container:    '.wall-link-image-container',

            
            cmd_link_image:     '.cmd-wall-link-image',       
            cmd_cancel:         '.cmd-remove-link',
            
            tool_focus:             '#wallLink_url',
            tool_handler:           '#arLink',
            tool_container:         '#link-control',
            has_content:            false,
            show_tool:              true
	},
        
        //resetea el contenido del control y lo activa para usar
        reset: function() 
        {
           $(this.options.content_preview).empty();
           $(this.options.tool_container).hide();
           //borra los elementos de sesion
           this.options.sessionLinks = [];
           
           this.options.sessionDeletedLinks = [];
        },
        resetError: function() 
        {
             
        },
            
        hasContent: function()
        {
          return (this.options.sessionLinks.length > 0);   
        },
       
        init: function (options)
        {

           this.options = $.extend({}, this.options, options);
           
           this._initControlHandlers();
        },
        
        findLink: function(url)
        {
            var findInSession = -1;
            
            if (this.options.sessionLinks.length > 0)
            {
                for (var i = 0; ((findInSession < 0) 
                        && (i < this.options.sessionLinks.length)); i++) 
                {
                    findInSession = url.indexOf(this.options.sessionLinks[i]);
                }
            }

            var findInSessionDeleted = -1;
            
            if (this.options.sessionDeletedLinks.length > 0)
            {
                for (var i = 0; ((findInSession < 0) 
                        && (i < this.options.sessionDeletedLinks.length)); i++) 
                {
                    findInSessionDeleted = url.indexOf(this.options.sessionDeletedLinks[i]);
                }
            }
            
            //la busqueda de hace manual mejor que con indexOf
            // por la forma en que hace ereg
            //var findInSession = this.options.sessionLinks.indexOf(url)
            //var findInSessionDeleted = this.options.sessionDeletedLinks.indexOf(url);
            
            return ((findInSession < 0) && (findInSessionDeleted < 0));
        },
        removeLink: function(url)
        {
            var i = this.options.sessionLinks.indexOf(url);
            
            if (i >= 0)
            {
                this.options.sessionLinks.splice(i, 1);
            }
            
            this.options.sessionDeletedLinks.push(url);
        },
        
        waitForContent: false,
        /**
         * inicializa controles estaticos
         * que no necesitan agregarse a nuevos elementos
         */
        _initControlHandlers: function () 
        {
           var that = this,
               options = this.options,
               $controlInput = $(options.input_control_message);
          
           var backspaceKey =   8,
               deleteKey =      46,
               spaceKey  =      32;

          
           $controlInput.on("keyup", function(e){
             
               var code = (e.keyCode ? e.keyCode : e.which);
               
               if ((!that.waitForContent) && 
                     ((code === backspaceKey) 
                   || (code === deleteKey)
                   || (code === spaceKey)))
               {
                 that.waitForContent = true;
                 that.sendContent(true);     
               }
           });
           
           $controlInput.on("paste", function(e){
         
               setTimeout(function (){
                   if (!that.waitForContent)
                   {
                       that.waitForContent = true;
                       that.sendContent(true);       
                   }
               }, 100);
               
           });
           
            $('body').bind('changeScrollContent', function (e, data)
            {
                for (var i = 0, l = Object.keys(data.messages).length ; i < l; i++) 
                {
                    var $child = $('[data-message-id="' + data.messages[i].id + '"]');
                    that.addNodeHandlers($child);
                }
              
            }); 
            
            //that._initDOM($(options.content_preview));
            
        },
        _addCancelHandlers: function($node) {
    
            var options = this.options
            , that = this;
    
            $node.find(options.cmd_cancel).click( function (e) 
            {
                e.preventDefault();
             
                var $cmd = $(e.currentTarget)
                , linkId = $cmd.data('link-id');
                
                $cmd.off('click');
                
                $.ajax({
                        type: "DELETE",
                        url: options.cancel_url + '/' + linkId,
                        datatype: "json",
                        data: '',
                        cache: false,
                        success: function(dataJSON)
                        {
                            var $node = $('#link-' + dataJSON.id);
                           
                            that.removeLink($node.data('url'));
                            $node.remove();      
                          
                        }
                 });
            });
             
        },
        
        controlName: function()
        {
          return 'link';
        },
        
        _callNextLogic: function (previewMode, endIndex)
        {
           if (endIndex <= 0)
           {
               if (previewMode && (this.options.sessionLinks.length > 0))
               {
                    $(this.options.tool_container).removeClass('hide');
                    $(this.options.tool_container).show();
               }
               else if (!previewMode)
               {
                 arquematics.wall.context.next();      
               }
               //desbloquea las acciones
               this.waitForContent = false;
           }
        },

        encryptData: function(dataObject)
        {
          var passKey = arquematics.utils.randomKeyString(50)
          , dataEncryptObject = arquematics.simpleCrypt.encryptObj(passKey, dataObject);
         
          dataEncryptObject['wallLink[pass]'] = arquematics.crypt.encryptMultipleKeys(passKey);
          return {
            pass:passKey,
            data: dataEncryptObject
          };
        },
        decryptData: function(dataJson, pass)
        {
            dataJson.description = arquematics.simpleCrypt.decryptHex(pass, dataJson.description);
            dataJson.oembed  = arquematics.simpleCrypt.decryptHex(pass, dataJson.oembed);
            dataJson.provider = arquematics.simpleCrypt.decryptHex(pass, dataJson.provider);
            dataJson.thumb = arquematics.simpleCrypt.decryptHex(pass, dataJson.thumb);
            dataJson.title = arquematics.simpleCrypt.decryptHex(pass, dataJson.title);
            dataJson.url = arquematics.simpleCrypt.decryptHex(pass, dataJson.url);

            return  dataJson;
        },
        
        extractMedia: function(url)
        {
            var options = this.options
            , d = $.Deferred();
          
            $.ajax({
                type: "GET",
                url:  options.url_link + '?url=' + url,
                datatype: "json",
                cache: false})
            .done(function(dataJson) {
               //agrega el enlace a la lista
               options.sessionLinks.push(url);
               options.sessionLinks.push(dataJson.url);
               
               d.resolve(dataJson);   
            })
            .fail(function() {
                d.reject();       
            });  
    
            return d;
        },
  
        sendContent: function (previewMode)
        {
           var that = this
           ,  options = this.options
           ,  searchText = $.trim($(options.input_control_message).text())
           ,  currentUrl = ''
           //, LINK_DETECTION_REGEX = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi
           //, LINK_DETECTION_REGEX = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi
           //, LINK_DETECTION_REGEX = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
           , LINK_DETECTION_REGEX = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/gi
// urls will be an array of URL matches
            //, urls = searchText.match(/((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi);
           , urls = searchText.match(LINK_DETECTION_REGEX);
           
            if ((urls !==null) && (urls.length > 0))
            {
                //urls unicas
                var uniqueUrls = urls.filter(function(elem, pos) {
                    return ((urls.indexOf(elem) === pos) 
                            && (that.findLink(elem)));
                });
                
                if (uniqueUrls.length > 0)
                {
                    for (var i = 0,  
                          count = uniqueUrls.length,
                          endIndex = uniqueUrls.length;(i < count); i++) 
                    {
                        currentUrl = uniqueUrls[i];
                        
                        options.sessionLinks.push(currentUrl);
                        
                        $.when(this.extractMedia(currentUrl)) 
                        .then(function (dataJson){
                           
              
                            options.sessionLinks.push(dataJson.url);
                           
                            var oemtype = (dataJson.type)?dataJson.type:''
                                , embedlyData = { 'wallLink[oembed]': (dataJson.html) ? arquematics.codec.Base64.encode(dataJson.html): '',
                                                  'wallLink[title]': (dataJson.title)?dataJson.title:'',
                                                  'wallLink[thumb]': (dataJson.thumb) ? dataJson.thumb : '',
                                                  'wallLink[description]': (dataJson.description) ? dataJson.description : '',
                                                  'wallLink[provider]': (dataJson.provider) ?  dataJson.provider  : '',
                                                  'wallLink[urlquery]': dataJson.urlquery,
                                                  'wallLink[url]': dataJson.url
                                            }
                                , sendataAndPass
                                , sendData
                                , pass;


                                //encripta los datos si esta activa la criptografía
                                
                                if (arquematics.crypt)
                                {
                                   sendataAndPass = that.encryptData(embedlyData);
                                   sendData = sendataAndPass.data;
                                   pass = sendataAndPass.pass;
                                }
                                else
                                {
                                  sendData = embedlyData;
                                }

                                //el tipo de dato no esta encriptado
                                sendData['wallLink[oembedtype]'] = oemtype;
                                //tokem _csrf_token                     
                                sendData['wallLink[_token]'] = $.trim($("#wallLink__token").val());

                                $.ajaxQueue({
                                    type: "POST",
                                    url: $(options.form).attr('action'),
                                    cache: false,
                                    data: sendData,
                                    dataType: "json",
                                    success: function(dataJSON) 
                                    {
                                      
                                      if (previewMode)
                                      {
                                       
                                        var $contentNode;
                                        
                                        dataJSON = $.extend({}, dataJSON, {preview: true});
                                        
                                        
                                        if ((dataJSON.oembedtype    === 'rich')
                                           || (dataJSON.oembedtype  === 'video'))
                                        {
                                            $contentNode = $(Mustache.render( $(options.template_video).html(), that.decryptData(dataJSON, pass))); 
                                        }
                                        else
                                        {
                                            $contentNode = $(Mustache.render( $(options.template_link).html(), that.decryptData(dataJSON, pass))); 
                                        }
              
                                        $(options.content_preview).prepend($contentNode);

                                        if (arquematics.crypt)
                                        {
                                            $contentNode.data('content',sendataAndPass.pass);
                                        }

                                        $contentNode.show();
                                        
                                        that.addNodeHandlers($contentNode);
                                      }
                                      
                                      endIndex--;
                                      
                                      that._callNextLogic(previewMode, endIndex);
                                    },
                                    error: function() 
                                    {
                                       endIndex--;
                                       that._callNextLogic(previewMode, endIndex);
                                    }
                                });
                           
                        },
                        function (){
                           endIndex--;
                           that._callNextLogic(previewMode, endIndex);  
                        }); 
                             
                    }
                }
                else
                {
                   that._callNextLogic(previewMode, 0);      
                }
            }
            else
            {
                that._callNextLogic(previewMode, 0);            
            }
            
        },

        addNodeHandlers: function ($node){
            var that = this;
            var options = this.options;
            
            $node.find(options.cmd_link_image).click( function (e) 
            {
                e.preventDefault();
                
                var $cmd = $(e.currentTarget);
                var $item = $cmd.parents(options.content_item);
                   
                var frameString = arquematics.codec.Base64.toString($item.data('oembed_html'))
                   , $dinamicContent = $item.find(options.content_dinamic);
                 
                //ocultar imagen y texto de imagen
                $cmd.parents(options.content_video_static).remove();
 
                $dinamicContent.removeClass('hide');
                $dinamicContent.show();
                $dinamicContent.animate({'backgroundColor':'#ffff'},200);
                
                var $frameNode = $(frameString);

                //se trata de un dispositivo movil
                if ($dinamicContent.width() <= 300)
                {
                   $frameNode.attr('width','100%');
                   $frameNode.attr('height', '200px');     
                }
                else
                {
                   $frameNode.attr('width','100%');
                   $frameNode.attr('height', '370px');     
                }
               
                $dinamicContent.append($frameNode);
           });
           
           this._addCancelHandlers($node);
        },
        
        /**
         * el control tiene contenido esperando ser procesado
         * 
         * @return <boolean>: true tiene contenido
         */
        _hasContent: function (item) {
           return (item && (item.length > 0));
        },
         
        _validateURL: function(data){
          var RegExPattern = /^((http|https|ftp):\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
          return RegExPattern.test(data);
        },
        /**
         * el control tiene contenido que puede ser válido
         * @return <boolean>: true tiene contenido valido
         */
        validate: function(){
            var item = $.trim(this.element.val());

            return (this._hasContent(item) && this._validateURL(item));
        },
       
        update: function(message) 
        {
          var that = this;
         
          if (message instanceof arquematics.wall.message)
          {
              if (message.getState() === arquematics.wall.messageStatus.ready)
              {
                var dataJson = message.getContent()
                , $node = $('[data-message-id="' + dataJson.id + '"]');
                
                that.addNodeHandlers($node);
                 
                //resetea el control
                this.reset();
              }
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
            ret.push(new arquematics.link.sendLinkContent());

            return ret;
        }
};

arquematics.link.sendLinkContent = function () 
{
    this.name = 'sendLinkContent';

    this.go = function (params)
    {
        if (!arquematics.link.waitForContent)
        {
          arquematics.link.sendContent(false);      
        }
        else
        {
          //espera 1/2 segundo y vuelve a intentar
          setTimeout($.proxy(function() {
            this.go(params);
          }, this), 500);    
        }
        
    };
};

}( Mustache, jQuery, arquematics || {}));