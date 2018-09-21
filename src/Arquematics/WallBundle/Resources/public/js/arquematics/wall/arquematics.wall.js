/**
 * @package: arquematicsPlugin
 * @version: 0.1
 * @Autor: Arquematics 2010 
 *         by Javier Trigueros Martínez de los Huertos
 *         
 * dependencias con:
 *  - arquematics.infinite.js
 *  - timeago:  http://timeago.yarp.com/
 *  - autosize: https://github.com/jackmoore/autosize.git
 *  
 * 
 * @param {jQuery} $
 * @param {arquematics} arquematics
 */

var arquematics = (function(Mustache, $, arquematics) {
  
arquematics.wall = {
        options: {
            
            elemTab:                    '#arWall',
            content:                    '#content',
            content_loader:             '.wall-loader',
            
            
            form_wall:                  '#wall_send_content',
            
            cmd_update_button:          '.cmd-update-button-arWall',
            
            cmd_show_input_control:     '#wall_send_content',
            
            input_control_select_group: '#wallbundle_wall_lists',
            input_control_message:      '#wallMessage_message',
            input_control_pass:         '#wallMessage_pass',
            
            template_comment_form:      '#comment-form-template',
            template_wall_message:      '#template-message',
            template_comment:           '#template-comment',
            
            tools: []
	},
        
        isMovile: false,
        
        reset: function(e, that) 
        { 
            var options = this.options;
                
                var $control = $(options.input_control_message);
                $control.parent().removeClass('error');
                
                //genera un nuevo pass
                this.randomAdmin.generate();
                //contenido texto en blanco y gana el foco
                $control.val('');
                $control.css('height', 'auto').css('height', 50);
                $control.focus(); 
        },
            
        resetError: function(e, that) 
        {
             var options = this.options;
            
               var $control = $(options.input_control_message);
               $control.parent().addClass('error');
      
               $control.focus();
        },
             
        _jQueryExtensions : function() {
            // jQuery extensions
            $.fn.extend({
                scrollToMe: function () {
                    var x = $(this).offset().top - 100;
                    $('html,body').animate({scrollTop: x}, 500);
            }});	
	},
            
        changeContent: function() {
                          
        },
        getLock: function()
        {
            return arquematics.wall.context.lock;
        },
        lock: function()
        {
           arquematics.wall.context.lock = true;
        },
        unlock: function()
        {
           arquematics.wall.context.lock = false;
        },
        
        hasContent: function()
        {
          var textControl = $.trim($(this.options.input_control_message).val());
          
          return (textControl.length > 0);   
        },
        
        configure: function(options)
        {
            if (!options){options = {};}
            this.options = $.extend(options, this.options,options);
            this.isMovile = ($(window).width() <= 400);
        },
        
        init: function(options)
        {
            this.configure(options);
           
            this.context = new arquematics.context(new arquematics.wall.sendContent());
                
            this.randomAdmin = new arquematics.randomGenerator();
                
            this._jQueryExtensions();
            this._initControlHandlers();
	},
         
        update: function(enableTabFuntions)
        {
            $.buttonControlStatus($(this.options.cmd_update_button),enableTabFuntions);
        },
        
        parseComment: function (comment)
        {
            //comment.createdAtTimeStamp =  comment.createdAt * 1000;
            //comment.createdAt = $.timeago(new Date(comment.createdAt *1000));
            
            var options = this.options                    
            , $contentNode = $(Mustache.render( $(options.template_comment).html(), this.decodeComment (comment))); 
            
            return $contentNode;
        },
        
        //parsea mensaje con comentarios
        parseData: function (message)
        {
            var options = this.options 
            , $contentNode = $(Mustache.render( $(options.template_wall_message).html(), this.decodeMessage(message))); 
            
            $contentNode.removeClass('hide');
            $contentNode.show();
        
            return $contentNode;
        },
        
        decodeComment: function(comment)
        {
            if (comment.pass)
            {
               var simetricKey = arquematics.crypt.decryptHexToString(comment.pass);
               comment.content = arquematics.simpleCrypt.decryptHex(simetricKey, comment.content); 
            }

            return comment; 
        },
        decodeMessage: function(message)
        {
            if (message.pass)
            {
              var simetricKey = arquematics.crypt.decryptHexToString(message.pass);
              message.content = arquematics.simpleCrypt.decryptHex(simetricKey, message.content);
              
              if (message.comments && (message.comments.length > 0))
              {
                for (var i = message.comments.length -1; (i >= 0); --i)
                {
                    simetricKey = arquematics.crypt.decryptHexToString(message.comments[i].pass);
                    message.comments[i].content = arquematics.simpleCrypt.decryptHex(simetricKey, message.comments[i].content);
                }
              }
              
              if (message.files && (message.files.length > 0))
              {
                  for (var i = message.files.length -1; (i >= 0); --i)
                  {
                        message.files[i].simetricKey = arquematics.crypt.decryptHexToString(message.files[i].pass);
                        message.files[i].name = arquematics.simpleCrypt.decryptBase64(message.files[i].simetricKey, message.files[i].name);
                  }
              }
              
              if (message.wallLinks && (message.wallLinks.videos.length > 0 ))
              {
                  for (var i = message.wallLinks.videos.length -1; (i >= 0); --i)
                  {
                    message.wallLinks.videos[i] = this.decryptWallLink(
                            message.wallLinks.videos[i], 
                            arquematics.crypt.decryptHexToString(message.wallLinks.videos[i].pass));
                   
                  }
              }
              
              if (message.wallLinks && (message.wallLinks.rich.length > 0 ))
              {
                  for (var i = message.wallLinks.rich.length -1; (i >= 0); --i)
                  {
                    message.wallLinks.rich[i] = this.decryptWallLink(
                            message.wallLinks.rich[i], 
                            arquematics.crypt.decryptHexToString(message.wallLinks.rich[i].pass));
                   
                  }
              }
              
              if (message.wallLinks && (message.wallLinks.photo.length > 0 ))
              {
                  for (var i = message.wallLinks.photo.length -1; (i >= 0); --i)
                  {
                    message.wallLinks.photo[i] = this.decryptWallLink(
                            message.wallLinks.photo[i], 
                            arquematics.crypt.decryptHexToString(message.wallLinks.photo[i].pass));
                   
                  }
                  
              }
              
              if (message.wallLinks && (message.wallLinks.link.length > 0 ))
              {
                  for (var i = message.wallLinks.link.length -1; (i >= 0); --i)
                  {
                    message.wallLinks.link[i] = this.decryptWallLink(
                            message.wallLinks.link[i], 
                            arquematics.crypt.decryptHexToString(message.wallLinks.link[i].pass));
                   
                  }
                  
              }
              
              if (message.wallLinks && (message.wallLinks.files.length > 0 ))
              {
                  for (var i = message.wallLinks.files.length -1; (i >= 0); --i)
                  {
                    message.wallLinks.files[i] = this.decryptWallLink(
                            message.wallLinks.files[i], 
                            arquematics.crypt.decryptHexToString(message.wallLinks.files[i].pass));
                   
                  }
                  
              }
            }
            
            return message;
        },
        decryptWallLink: function(dataJson, pass)
        {
            dataJson.description = arquematics.simpleCrypt.decryptHex(pass, dataJson.description);
            dataJson.oembed  = arquematics.simpleCrypt.decryptHex(pass, dataJson.oembed);
            dataJson.provider = arquematics.simpleCrypt.decryptHex(pass, dataJson.provider);
            dataJson.thumb = arquematics.simpleCrypt.decryptHex(pass, dataJson.thumb);
            dataJson.title = arquematics.simpleCrypt.decryptHex(pass, dataJson.title);
            dataJson.url = arquematics.simpleCrypt.decryptHex(pass, dataJson.url);

            return  dataJson;
        },
        
        addLikeHandlers: function ($node)
        {
            var that = this;
            
            $node.find('.cmd-like-message, .cmd-like-message-movile').on("click",function(e)
            {
                e.preventDefault();
                
                var  $cmd = $(e.currentTarget);
                //poner esto para los errores
                //$cmd.unbind('click');

                $.ajax({
                        type: $cmd.data('like')?"POST":"DELETE",
                        url:  $cmd.attr('href'),
                        datatype: "json",
                        cache: false})
                .done(function(dataJson) {
                    
                    if (that.isMovile)
                    {
                        $node = $('#like-control-movile-' + dataJson.id);
                        var $nodeText = $('#like-control-movile-text-' + dataJson.id);
                        if (dataJson.voteByMe)
                        {
                            $nodeText.html(dataJson.voteByMe); 
                        }
                        else 
                        {
                            $nodeText.html(dataJson.voteCount);
                        }
                    }
                    else
                    {
                       $node = $('#like-control-' + dataJson.id); 
                       if (dataJson.voteByMe)
                       {
                            $node.html('<i class="fa fa-thumbs-o-up"></i>&nbsp' + dataJson.voteByMe); 
                       }
                       else 
                       {
                            $node.html('<i class="fa fa-thumbs-o-up"></i>&nbsp' + dataJson.voteCount);
                       }
                    }
                    
                    $node.data('like', !$node.data('like'));
                    //oculta todos los tooltips
                    $('.cmd-like-message').popover('hide');

                    $node.attr('href',dataJson.voteURL);
      
                    if (dataJson.voteCountReal > 0)
                    {
                      $node.removeAttr('data-content');
                      $node.removeAttr('data-vote-count-real');
                      $node.data('content', dataJson.voteNames);
                      $node.data('vote-count-real', dataJson.voteCountReal);
                      that.addPopoverHandlers($node);
                    }
                    else
                    {
                        $node.removeClass('tool-votes');
                        $node.popover('destroy');
                        $node.off("mouseover");
                        $node.off("mouseout");
                        $node.removeAttr('data-content');
                        $node.data('vote-count-real', dataJson.voteCountReal);
                    }
                    
                })
                .fail(function() {
                       
                });
                
            });
            
            $node.find('.tool-votes').each(function( index ) {
                that.addPopoverHandlers($(this));
            });
            
            $node.find('.cmd-like-message-movile-text').on('click', function(e) {
                var $elemTarget = $(e.target);
                
                e.preventDefault();
                e.stopPropagation();

                $node = $('#like-control-movile-' + $elemTarget.data('id'));
                $node.trigger('click');
            });
        },
        
        addPopoverHandlers: function ($node)
        {
            var content = $node.data('content')
            ,  contentBr = content.replace(/,/g,'<br />')
            , that = this; 
            
            if (!$node.hasClass('tool-votes'))
            {
               $node.addClass('tool-votes');   
            }
                      
            $node.popover('destroy');
            
            $node.off("mouseover");
            $node.off("mouseout");
            
            $node.removeAttr('data-placement');
            $node.data('placement','bottom');
            
            $node.removeAttr('data-content');
            $node.attr('data-content', contentBr);
            
            $node.data('content', contentBr);
            
            $node.removeAttr('data-html');
            $node.attr('data-html', true);
            $node.data('html', true);
 
            if (this.isMovile 
                && $node.hasClass('cmd-like-message-movile'))
            {
                $node.popover({content: contentBr,
                           placement: 'bottom',
                           trigger: 'manual',
                           html: true})
                .on('mouseover', function(e) {
                
                    $(this).popover('show');  
                
                    $(this)
                        .next('.popover')
                        .addClass('popover-danger');
                })
                .on('mouseout', function(e) {
                   $(this).popover('hide');  
                }); 
                
                var $nodeItem = $node.parents('.message-item');
                $nodeItem.on('click', function(e) {
                    
                    var $elemTarget = $(e.target)
                    , $elemItem = $(e.target).parents('.message-item');
                    
                    if ($elemTarget.hasClass('message-item'))
                    {
                        $elemItem = $elemTarget;
                    }
                    
                    var $parentItemInteractive = $elemTarget.parents('.interactive-zone')
                    , $parentItemInteractiveForm =  $elemTarget.parents('.formControl')
                    , isItemInteractive = $parentItemInteractive?$parentItemInteractive.length > 0:false
                    , isItemInteractiveForm = $parentItemInteractiveForm?$parentItemInteractiveForm.length > 0:false
                      //negado de xor
                    ,xOrItem =  (!(( isItemInteractive || isItemInteractiveForm ) && (!( isItemInteractive && isItemInteractiveForm ))));
                  
                    $('.selected-item').removeClass('selected-item');
                    $elemItem.addClass('selected-item'); 
                    
                    if (xOrItem)
                    {
                        $('.cmd-like-message-movile').each(function( index ) {
                            if (($(this).data('id') ===  $node.data('id'))
                                && ($node.data('vote-count-real') > 0))
                            {
                               $node.trigger('mouseover');
                               $node.scrollToMe();
                            }
                            else
                            {
                               $(this).popover('hide');  
                            }
                        });
                        
                    }
                    else 
                    {
                        $('.cmd-like-message-movile').popover('hide');
                    }
                    
                });  
       
               
            }
            else
            {
                $node.popover({content: contentBr,
                           placement: 'bottom',
                           trigger: 'manual',
                           html: true})
                .on('mouseover', function(e) {
                
                    $(this).popover('show');  
                
                    $(this)
                        .next('.popover')
                        .addClass('popover-danger');
                })
                .on('mouseout', function(e) {
                   $(this).popover('hide');  
                });  
            }
        },
        
        addNodeHandlers: function ($node)
        {
            var that = this
            , options = this.options;
            
            //timeago
            $node.find("span.mytime").each(function( index ) {
                $(this).timeago();
            });  
            
            // borra un message    
            $node.find('.cmd-message-delete').on("click",function(e)
            {
                e.preventDefault();
                e.stopPropagation();
                
                var elem = $(e.currentTarget)
                ,   ID = elem.data('message-id')
                ,   $node = $('div[data-message-id="' + ID + '"]');
                
                $node.animate({'backgroundColor':'#fb6c6c'},300);
                
                elem.unbind('click');
                
                $.ajax({
                    type: "DELETE",
                    datatype: "json",
                    url: elem.data('delete-url'),
                    cache: false,
                    success: function(dataJson)
                    {
                            var $contenNode =  $('div[data-message-id="' + dataJson.message + '"]')
                            ,   message = new arquematics.wall.message(dataJson);
                            

                            message.setState(arquematics.wall.messageStatus.del);
                            
                            arquematics.wall.notify(message);
                            
                            $contenNode.fadeOut(300,function(){
                                $('[data-message-id="' + dataJson.message + '"]').remove();
                            });
                    },
                    statusCode: {
                            404: function() 
                            {
                               $node.find('.message-content-text').animate({'backgroundColor':'#ff0000'},300);
                            },
                            500: function() 
                            {
                               $node.find('.message-content-text').animate({'backgroundColor':'#ff0000'},300);
                            }
                        },
                    error: function(dataJSON)
                    {
                      $node.find('.message-content-text').animate({'backgroundColor':'#ff0000'},300);
                    }
                });
                
                return false;
            });
            
            $node.find('.cmd-show-form-comment').on("click",function(e)
            {
                e.preventDefault();
                
                var $cmdNode = $(e.currentTarget)
                ,   $form = $('#wall-send-comment-' + $cmdNode.data('id'))
                ,   $inputControl =$form.find('.form-control') ;
                         
                $form.removeClass('hide');
                
                $inputControl.autosize();
                $inputControl.scrollToMe();
                $inputControl.focus();
            });
            
            $node.find('.cmd-show-comment').on("click",function(e)
            {
                e.preventDefault();
                e.stopPropagation();
                
                var $cmdNode = $(e.currentTarget);
                var $messageNode = $cmdNode.parents('.message');
                
                $messageNode.find('.comments-list div.widget-tree-comments-item').each(function( index ) {
                    $(this)
                        .removeClass('hide')
                        .show();
                });
                
                $cmdNode.hide();
                
                $('.cmd-like-message').popover('hide');
            });
            
            $node.find('.cmd-comment').on("click",function(e)
            {
                e.preventDefault();
                e.stopPropagation();
                
                var  $button = $(e.currentTarget)
                , $form = $button.parents('.formControl')     
                , $inputControl = $form.find('.widget-tree-comments-input')
                , $inputControlPass = $form.find('.form-control-pass')
                , $containerNode = $button.parents('.message').find('.comments-list')
                , comment = $.trim($inputControl.val());
                 
                if(comment.length > 0)
                {
                    $button.button('loading');
                    
                    var callBack = function ($form, formData) {
                    
                        $.ajax({
                            type: "POST",
                            url: $form.attr('action'),
                            datatype: "json",
                            cache: false,
                            data:  formData })
                        .done(function(dataJson) {
                    
                            var $contentNode = that.parseComment(dataJson);
                    
                            $button.button('reset');
                            $inputControl.val('');
                            $inputControlPass.val('');
                      
                            $inputControl.css('height', 'auto').css('height', 50);
                    
                            $containerNode.append($contentNode);
                   
                            that.addNodeHandlers($contentNode);
                        })
                        .fail(function() {
                            $button.button('reset');
                        }); 
                    };
                    
                    if (arquematics.crypt)
                    { 
                        $inputControlPass.val(arquematics.utils.randomKeyString(60));
               
                        $.when(arquematics.wall.encryptForm($form, $inputControl, $inputControlPass)) 
                        .then(function (formData){
                            callBack($form, formData);
                        }); 
                    }
                    else
                    {
                        callBack($form, $form.find( "input, textarea, select" ).serialize());
                    }
                
                    
                }
                else
                {
                    $inputControl.val('');
                    $inputControl.scrollToMe();
                    $inputControl.focus();
                }
            });
            
            $node.find('.cmd-comment-delete').on("click",function(e)
            {
               
                e.preventDefault();
                e.stopPropagation();
                
                var  $node = $(e.currentTarget);
                
                $("#comments-item-" + $node.data('comment-id'))
                        .animate({'backgroundColor':'#fb6c6c'},200);
                
   
                $node.unbind('click');
                
                $.ajax({
                    type: "DELETE",
                    url: $node.data('delete-url'),
                    datatype: "json",
                    cache: false
                })
                .done(function(dataJson) {

                    $('#comments-item-' + dataJson.id).fadeOut(300,function(){
                        $('#comments-item-' + dataJson.id).remove();
                        //oculta los popups moviles
                        $('.cmd-like-message-movile').popover('hide');
                    });
                })
                .fail(function() {
                   
                });
            });
            
            
            this.addLikeHandlers($node);
        },
        
        _initControlHandlers: function () {
           
            var that = this;
            var options = this.options;
            
            //$(options.input_control_message).autosize();
            
            //$(options.input_control_message).characterCounter($(options.input_control_message).attr('maxlength'));
            
            // mirar
            //https://github.com/ro31337/jquery.ns-autogrow
            //$('.emoji-wysiwyg-editor').autosize();
            
            /*
            window.emojiPicker = new EmojiPicker({
                                        assetsPath: '/bundles/wall/js/vendor/jquery/plugins/emoji-picker-master/lib/img',
                                        popupButtonClasses: 'fa fa-smile-o'
             }).discover();
            
           */
          
          
            $(options.input_control_select_group).select2({
                placeholder: 'Select value'
            })
            .on("change", "select", function (e) {
                var selectedOption = $(e.target)
                                        .children('option')
                                        .filter(function() { return $(this).prop('defaultSelected');});
                var defaultValue = selectedOption[0] && selectedOption[0].value;
                $(e.target).toggleClass("text-changed", e.target.value !== defaultValue);
            });
            ;

            $(options.cmd_update_button).on("click", function (e) 
            {
               e.preventDefault();
               //si no esta bloqueado
               if (!that.context.lock 
                   && that.hasToolsContent())
               {
                 //bloquea todos los controles antes de nada
                 $('body').trigger('changeTabStatus', [false] );
                 //sin parametros de momento
                 that.context.setParams(false);
                    
                 that.context.start();
               }
            });
            
            $('body').bind('changeScrollContent', function (e, data)
            {
                that.generateDOM(data.messages);
            });
            
        },
           
        hasToolsContent: function(){
            var observerCount = this.options.tools.length
            , ret = this.hasContent();
            
            for(var i = 0; (i < observerCount) && (!ret); i++)
            {
                if (typeof this.options.tools[i].hasContent === 'function')
                {
                   ret  = this.options.tools[i].hasContent(); 
                }
            }
            
            return ret;
        },
        
        notify: function($contextNode){
            var observerCount = this.options.tools.length;
            
            for(var i = 0; i < observerCount; i++){
                this.options.tools[i].update($contextNode);
            }
        },
        
        /**
         * agrega una herramienta 
         * @param {type} tool
         */
        subscribeTool: function(tool) 
        {
            if (tool)
            {
              this.options.tools.push(tool);
              
              if (typeof tool.getAvailableToolStatus === 'function')
              {
                var statusList = tool.getAvailableToolStatus();
           
                if (statusList && (statusList.length > 0))
                {
                    for (var i = 0; i < statusList.length; i++) 
                    {
                        this.context.add(statusList[i]);  
                    }  
                }
              }
              
              //si necesita el servicio y es una funcion lo envia
              if (typeof tool.addRandomGenerator === 'function')
              {
                 tool.addRandomGenerator(this.randomAdmin);
              }
            }
	},
        
        encryptForm: function ($form, $encField, $passField)
        {
            var  d = $.Deferred()
            , passEncode = $passField.val().replace(/^\s+|\s+$/gm,'')
            , textToEncode = $encField.val().replace(/^\s+|\s+$/gm,'')
            , encNameFields = [$passField.attr("name"), $encField.attr("name")]
            , formDataArr = $form.find('input, select, textarea').serializeArray()
            , formData;
            
            formData = '&' + $encField.attr("name") + '=' + arquematics.simpleCrypt.encryptHex(passEncode, textToEncode);       
            formData += '&' + $passField.attr("name") + '=' + arquematics.crypt.encryptMultipleKeys(passEncode);
            
            for (var i = 0, count = formDataArr.length; i < count; i++)
            {
                if ($.inArray( formDataArr[i].name, encNameFields ) < 0)
                {
                    formData += '&' + formDataArr[i].name + '=' + formDataArr[i].value.replace(/^\s+|\s+$/gm,'');        
                }
            }
            
            d.resolve(formData );
            
            return d;
        },
        
        encryptForm2: function ($form, $encField, $passField)
        {
            console.log('encryptForm');
            console.log($encField);
            console.log($passField);
            var  d = $.Deferred()
            , encNameFields = [$passField.attr("name"), $encField.attr("name")]
            , formData = ''
            ,  formDataArr = $form.find('input, select, textarea').serializeArray()
            ,  textToEncode;
        
            textToEncode = $encField.val().replace(/^\s+|\s+$/gm,'');
            console.log('textToEncode');
            console.log(textToEncode);
            arquematics.crypt.encryptAsynMultipleKeys(textToEncode,
                function (textEncode)
                {
                    textEncode= textEncode
                        .replace(/\"$/, '')
                        .replace(/^\"/, '')
                        .replace(/\\/g, '')
                        .replace(/\s+/g, '');
                        
                     formData += '&' + $encField.attr("name") + '=' + textEncode;       
                
                     var passEncode = $passField.val().replace(/^\s+|\s+$/gm,'');
                     
                     arquematics.crypt.encryptAsynMultipleKeys(passEncode,
                        function (textEncode)
                        {
                            console.log('textEncode');
                            console.log(textEncode);
                            formData += '&' + $passField.attr("name") + '=' + textEncode;
                            
                            for (var i = 0, count = formDataArr.length; i < count; i++)
                            {
                                if ($.inArray( formDataArr[i].name, encNameFields ) < 0)
                                {
                                    formData += '&' + formDataArr[i].name + '=' + formDataArr[i].value.replace(/^\s+|\s+$/gm,'');        
                                }
                            }
                            
                            d.resolve(formData );
                        });
                }
            );
            
            return d;
        },
        
        getElement: function ()
        {
          return $(this.options.elemTab);  
        },
                
        controlName: function()
        {
          return 'wall';
        },
       
        getContentNode: function()
        {
            return $(this.options.content + ' div:first');
        },
       
       
        generateDOM: function(messages) 
        {
            var that = this
            ,options = this.options;
           
            for (var i = 0, count = Object.keys(messages).length ; i < count; i++) 
            {
                var $contentNode = that.parseData(messages[i]);
                $contentNode.insertBefore($(options.content)
                    .find(options.content_loader));
                
                that.addNodeHandlers($contentNode);
            }
	}
    };
    
   
    
    arquematics.wall.messageStatus =
    {
        ready: 0, // listo  
        del: 1, // borrandose del DOM
        reset: 2 // reseteando tools al estado inicial
    };
    
    arquematics.wall.message = function ($domContent)
    {
        if(!(this instanceof arquematics.wall.message))
        {
           throw new arquematis.exception.invalid("arquematics.wall.message:Constructor called as a function");
        }
        
        this.state = arquematics.wall.messageStatus.ready;
        
        this.$domContent = $domContent;
    };
    
    arquematics.wall.message.prototype = {
        setContent: function($domContent)
        {
           this.$domContent = $domContent;  
        },
        getContent: function()
        {
            return this.$domContent;
        },
        getState: function()
        {
            return this.state;
        },
        setState: function(state)
        {
            this.state = state;
        }
    };
    
   /**
    * sendContent es un estado especial que se activa siempre 
    * al terminar con las acciones del contexto arquematics.wall.context 
    */
   arquematics.wall.sendContent = function () 
   {
       var options = arquematics.wall.options;
       
       this.name = 'sendContent';

       this.go = function (params)
       {
           var $form = $(options.form_wall)
            , passKey = params
            , $inputControl = $(options.input_control_message)
            , $inputControlPass = $(options.input_control_pass);
           
           
           var callBack = function (formData, pass) {
               

               pass = false || pass;
               
                           $.ajax({
                            type: "POST",
                            url: $form.attr('action'),
                            datatype: "json",
                            data: formData,
                            cache: false,
                            success: function(dataJSON)
                            {
                                var $contentNode = arquematics.wall.parseData(dataJSON);
                        
                                $(options.content).prepend($contentNode);
                        
                                arquematics.wall.addNodeHandlers($contentNode);
                                
                                $contentNode.find('.message').animate({'backgroundColor':'#ffff'},200);
                                //se ha agregado contenido a wall
                                //y lo notifica
                                arquematics.wall.notify(new arquematics.wall.message(dataJSON));
                        
                                arquematics.wall.reset();
                        
                                arquematics.wall.unlock();
                                //desbloqueo de controles
                                $('body').trigger('changeTabStatus', [true] );
                                
                    },
                    statusCode: {
                        404: function() {
                            arquematics.wall.resetError();
                       
                            arquematics.wall.unlock();
                            //desbloqueo de controles
                            $('body').trigger('changeTabStatus', [true] );
                       
                        },
                        500: function() {
                            arquematics.wall.resetError();
                       
                            arquematics.wall.unlock();
                             //desbloqueo de controles
                            $('body').trigger('changeTabStatus', [true] );
                        }
                    },
                    error: function(dataJSON)
                    {
                        arquematics.wall.resetError();
                  
                        arquematics.wall.unlock();
                        //desbloqueo de controles
                        $('body').trigger('changeTabStatus', [true] );
                    }
                }); 
           };
           
           if (arquematics.crypt)
           { 
               $inputControlPass.val(arquematics.utils.randomKeyString(60));
               
               $.when(arquematics.wall.encryptForm($form, $inputControl, $inputControlPass)) 
                  .then(function (formData){
                      callBack(formData, passKey);
              }); 
           }
           else
           {
                arquematics.utils.prepareFormAndSend($form, callBack);    
           }
       };
   };
   
   return arquematics;
   
}(Mustache, jQuery, arquematics || {}));