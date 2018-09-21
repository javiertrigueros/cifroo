/**
 * @package: arquematicsPlugin
 * @version: 0.1
 * @Autor: Arquematics 2010 
 *         by Javier Trigueros Martínez de los Huertos
 *         
 * dependencias con:
 * https://github.com/mervick/emojionearea
 */

(function ( $, emojione, arquematics) {
 
/**
 * 
 * @param {jQuery} $
 * @param {arquematics} arquematics
 * @returns 
 */
$.widget( "arquematics.textbox", {
	options: {
            form:           '.form-control-message',
            limit: 280,
            cmd_emojionearea_button: '.emojionearea-button',
            
            content_all_area: '.emojionearea',
            content_editor: '.emojionearea-editor',
            content_expanding: '.expanding-input',
            content_button_expanding: '.expanding-content',
            content_item_message_content: '.message-content-text',
            
            cmd_file:       '.emojionearea-button-file',
            cmd_file_extra: '.emojionearea-button-file-extra',
          
            //emojionearea-editor
            resetControl: function(e, that) 
            {
                   
            },
            
            resetControlError: function(e, that) 
            {
             
            }
	},
        
        showPlaceholder: true,
        
        _create: function() 
        {
            this._configure();
            this._loadDOM();
            this._initControlHandlers();
            
            this.updateCounter();
            this.updatePlaceholder();
	},
        lockExpandControl: false,
        isMovile: false,
        _configure: function()
        {
            this.isMovile = ($(window).width() <= 400);
            
            this.socialControl = $(this.element).data('arquematics-social');
        },
        
        hasInitControl: false,
        _initControlHandlers: function () 
        {
            var options = this.options
            , that = this;
            
            if (this.isMovile)
            {
                this.$uiControlTextForm.emojioneArea({
                    buttonTitle: options.tab_label,
                    tones: false,
                    standalone: false,
                    filters: {
                       recent: {
                            title: options.emo_labels.recent
                       },
                       smileys_people: {
                            title: options.emo_labels.smileys_people 
                       },
                       animals_nature: {
                            title: options.emo_labels.nature 
                       },
                       food_drink: {
                            title: options.emo_labels.food_drink 
                        },
                        activity: {
                            title: options.emo_labels.activity 
                        },
                        travel_places: {
                            title: options.emo_labels.travel_places 
                        },
                        objects: {
                            title: options.emo_labels.objects 
                        },
                        symbols: {
                            title: options.emo_labels.symbols 
                        },
                        flags : false
                    },
                    attributes: {
                        spellcheck : true,
                        autocomplete   : "off"
                    },
                    container: "#message-emoji",
                    hideSource: true,
                    pickerPosition: "bottom",
                    tonesStyle: "radio",
                    search: false,
                    recentEmojis: true,
                    hidePickerOnBlur: true,
                    saveEmojisAs: 'unicode'
                });
            }
            else
            {
                  this.$uiControlTextForm.emojioneArea({
                    buttonTitle: options.tab_label,
                    tones: false,
                    standalone: false,
                    filters: {
                       recent: {
                            title: options.emo_labels.recent
                       },
                       smileys_people: {
                            title: options.emo_labels.smileys_people 
                       },
                       animals_nature: {
                            title: options.emo_labels.nature 
                       },
                       food_drink: {
                            title: options.emo_labels.food_drink 
                        },
                        activity: {
                            title: options.emo_labels.activity 
                        },
                        travel_places: {
                            title: options.emo_labels.travel_places 
                        },
                        objects: {
                            title: options.emo_labels.objects 
                        },
                        symbols: {
                            title: options.emo_labels.symbols 
                        },
                        flags : {
                            title: options.emo_labels.flags 
                        }
                    },
                    attributes: {
                        spellcheck : true,
                        autocomplete   : "off"
                    },
                    container: "#message-emoji",
                    hideSource: true,
                    pickerPosition: "bottom",
                    tonesStyle: "radio",
                    search: false,
                    recentEmojis: true,
                    hidePickerOnBlur: true,
                    saveEmojisAs: 'unicode'
                });
            }
          
            
            this.emojiControl = this.$uiControlTextForm.data('emojioneArea');
            
            if ($(this.emojiControl).scrollArea !== undefined){
		$(this.emojiControl).scrollArea.on("focus", function(evt) { that.emojiControl.showPicker(); });
            }
            
            $('.emojionearea-button-open').attr({contenteditable:  false});
            $('.emojionearea-button-close').attr({contenteditable:  false});
            $('.emojionearea-button').attr({contenteditable:  false});
           
            $('.emojionearea')
                    .removeClass('hide')
                    .show();
            
            this._addCounter();
            
            function placeCaretAtEnd(el) {
                if (typeof window.getSelection != "undefined"
                    && typeof document.createRange != "undefined") 
                {
                    var range = document.createRange();
                        range.selectNodeContents(el);
                        range.collapse(false);
                        
                    var sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                } 
                else if (typeof document.body.createTextRange != "undefined") 
                {
                    var textRange = document.body.createTextRange();
                    textRange.moveToElementText(el);
                    textRange.collapse(false);
                    textRange.select();
                }
 
            }
            
            this.emojiControl.on("click", function (e) 
            {
                that.expandControl();
                
                $(this).focus();
                
                that.emojiControl.setFocus();
                
                that._repositionCounter(0);
                

                if (!that.hasInitControl)
                {
                    setTimeout(function(){
                        that.emojiControl.editor.focus();
                        placeCaretAtEnd(that.emojiControl.editor[0]);
                        that.hasInitControl = true;
                    }, 5); 
                }
            })
            .on("blur", function (emojiControl, event) {
                var src = $.trim(that.emojiControl.getText())
                , $cmd = $(event.relatedTarget).parents(that.options.form);
                //si se hace click dentro de la zona 
                // del formulario no cierra 
              
                if (($cmd.length <= 0) 
                    && (src.length <= 0)
                    && (!that.lockExpandControl)
                    ) 
                {
                    that.reset();  
                }
               
            })
            .on("keydown", function (emojiControl, event) {
                that.cutString(emojiControl, event);
                that.updateCounter();
                that.expandControl();
                
                that.emojiControl.hidePicker();
            })
            .on("keyup", function (emojiControl, event) {
                that.updateCounter();
            })
            .on("paste", function (emojiControl, event) {
                that.pasteAndCut(emojiControl, event);
                that.updateCounter();
                that.expandControl();
                
                that.emojiControl.hidePicker();
            })
            .on("emojibtn.click", function (btn, event) {
                
                that.expandControl();
                that.cutString(null, event);   
                that.updateCounter();
                
                $(this).focus();
                
            })
            .on("picker.show", function (emojiControl) {
                 var  limit = that.options.limit
                , src = $.trim(that.emojiControl.getText())
                , chars = src.length;
                
                if (chars >= limit) 
                {
                    that.emojiControl.hidePicker();
                    that.emojiControl.button.hide();
                }
            });
            
            $('body').bind('expandControl', function (e, data)
            {
                that.lockExpandControl = data;
                if (that.lockExpandControl)
                {
                  that.expandControl();  
                }
            }); 
        },

        _addCounter: function()
        {
            var  options = this.options
            ,limit = options.limit
            ,ccinputWidth = this.emojiControl.editor.innerWidth()
            ,ccinputHeight = this.emojiControl.editor.innerHeight()
            ,ccinputLineHeight = parseInt(this.emojiControl.editor.css('line-height').replace('px',''))+parseInt(this.emojiControl.editor.css('padding-top').replace('px',''))+parseInt(this.emojiControl.editor.css('padding-bottom').replace('px',''))
            ,ccinputPos = this.emojiControl.editor.position()
            //,top = ccinputPos.top + ccinputHeight - 3 * ccinputLineHeight
            ,left = ccinputWidth - ccinputLineHeight;
            
            /*
            if (options.enable_social)
            {
                var socialNets = this.socialControl.getSocial()
                , addSocialText = '';
            
                if (socialNets.twitter)
                {
                    addSocialText = '<span class="cmd-twiter cmd-network-select-buttom disabled"><i class="fa fa-twitter-square"></i></span>';
                }
            
                if (socialNets.facebook)
                {
                    addSocialText += '<span class="cmd-facebook cmd-network-select-buttom disabled"><i class="fa fa-facebook-official"></i></span>';
                }
            
                if (socialNets.linkedin)
                {
                    addSocialText += '<span class="cmd-linkedin cmd-network-select-buttom disabled"><i class="fa fa-linkedin-square"></i></span>';
                }
            }*/
            
            this.$counterDiv = $('<div class="ccinput-counter" style="opacity: 0.6; position:absolute;color:#000; z-index:5; left:'+ left +'px; top:0; width:'+ ccinputLineHeight +'px; line-height:'+ ccinputLineHeight +'px;"><span style="display:block;clear:both;" class="counter-limit">'+ limit +'</span></div>');
            
            this.emojiControl.editor.parent().append(this.$counterDiv);
            
            this.$counterText = $('.counter-limit');
            
            if (options.enable_social)
            {
                //inicializa el control
                this.socialControl.reset();
                this.socialControl.addHanlers();
            }
        },
        
        lastLeftPosition: 0,
        
        _repositionCounter: function(toEnd)
        {
             var  limit = this.options.limit
            ,ccinputWidth = this.emojiControl.editor.innerWidth()
            ,ccinputHeight = this.emojiControl.editor.innerHeight()
            ,ccinputLineHeight = parseInt(this.emojiControl.editor.css('line-height').replace('px',''))+parseInt(this.emojiControl.editor.css('padding-top').replace('px',''))+parseInt(this.emojiControl.editor.css('padding-bottom').replace('px',''))
            ,ccinputPos = this.emojiControl.editor.position()
            ,top = ccinputPos.top + ccinputHeight  - this.$counterDiv.innerHeight()
            ,left = ccinputWidth - ccinputLineHeight
            //5 pixels - por desviacion
            ,correction = left + 10 * (limit.toString().length -  toEnd.toString().length);
            
            if (this.emojiControl.button.position().left > 0)
            {
               this.lastLeftPosition =  this.emojiControl.button.position().left - 8;
            }
            /*
            $('.emojionearea-button-file-extra')
                .removeClass('hide')
                .show();
            
            $('.emojionearea-button-twitter-extra')
                .removeClass('hide')
                .show();*/
            
            this.$counterDiv.css('top', top);
            this.$counterDiv.css('left', this.lastLeftPosition);
        },
        
        expandControl: function()
        {
            this.$uiExpandingControls
                    .removeClass('hide')
                    .show();
                
            this.emojiControl.editor
                    .css({'height':'38mm'})
                ;
            
            this.emojiControl.editor
                        .find('.editor-placeholder')
                        .remove();
            
            $('.emojionearea-button-file')
                .hide();
            
            $('.emojionearea-button-file-extra')
                .removeClass('hide')
                .show();
        },
        
        updatePlaceholder: function()
        {
            
            if (this.showPlaceholder)
            {
                this.emojiControl.editor.empty();
                this.emojiControl.setText('');
                this.$counterDiv.hide();
                this.emojiControl.editor.html('&nbsp;<span class="editor-placeholder">' + this.options.placeholder + '<span>');
                this.emojiControl.editor.css({'min-height':0, 'height':'auto'});
            }
        },
        
        updateCounter: function()
        {
             var  limit = this.options.limit
            , src = $.trim(this.emojiControl.getText())
            , chars = src.length
            , ccinputPercent = parseFloat((chars / limit));
            
            this.$counterDiv.show();
            this.showPlaceholder = false;
           
            ccinputPercent = ccinputPercent.toFixed(2);
            
            if (chars  === 0)
            {
                this.$counterDiv.hide();
                this.showPlaceholder = true;
            }
            else if (ccinputPercent * 10 <= 3)
            {
                ccinputPercent = 0.3;
                this.$counterText.css({'color':'#000'});
            }
            else if (ccinputPercent * 10 >= 8)
            {
                this.$counterText.css({'color':'red'});
            }
            else
            {
                this.$counterText.css({'color':'red'}); 
            }
            
            if (limit - chars < 0)
            {
                //mirar esto otra vez
                this._repositionCounter(0);
              
                this.$counterText.text(0);
            }
            else
            {
                this._repositionCounter(limit - chars);
                //this.$counterDiv.text(limit - chars);
                this.$counterText.text(limit - chars);
            }
            
            this.$counterText.css({'color':'red'}); 
        },
        
        pasteAndCut: function(emojiControl, event)
        {
            var  limit = this.options.limit
            , src = $.trim(this.emojiControl.getText())
            , chars = src.length;
            
            if (chars >= limit) 
            {
                this.emojiControl.setText(src.substr(0, limit));
            }
            
        },
        cutString: function(emojiControl, event)
        {
             var  limit = this.options.limit
            , src = $.trim(this.emojiControl.getText())
            , chars = src.length;

            if (event)
            {
                 var hasKeyCode = ((event.keyCode === 8)
                 || (event.keyCode === 9)
                 || (event.keyCode === 38)
                 || (event.keyCode === 40)
                 || (event.keyCode === 46)
                 || (event.keyCode === 37) 
                 || (event.keyCode === 39));
            
                if ((chars >= limit) 
                && !hasKeyCode)
                {
                    event.preventDefault();
                    chars = limit;
                    this.emojiControl.hidePicker();
                    this.emojiControl.button.hide();
                }
                else
                {
                    this.emojiControl.button.show();
                }
            }
           
        },
        reset: function()
        {
            this.updateCounter();
            this.showPlaceholder = true;
            this.hasInitControl = false;
            this.updatePlaceholder();
            this.$uiExpandingControls.hide();
            this.emojiControl.hidePicker();
            this.emojiControl.button.show();
            
            //this.$cmdFile.show();
            //this.$cmdFileExtra.hide();
            
            this.lockExpandControl = false;
             
            $('.emojionearea-button-file')
                .show();
        
            $('.emojionearea-button-file-extra')
                .hide();
            
        },
        update: function(message) 
        {  
            if (message instanceof arquematics.wall.message)
            {
              if (message.getState() === arquematics.wall.messageStatus.ready)
              {
                this.reset();
              }
            }
        },
        controlName: function()
        {
          return 'textbox';
        },
        _loadDOM: function()
        {
           this.$uiControlTextForm = $(this.element); 
           
           this.$uiExpanding = this.$uiControlTextForm.parents(this.options.content_expanding);
           
           this.$uiArea = this.$uiExpanding.find(this.options.content_all_area);
           
           this.$uiExpandingControls = this.$uiExpanding.find(this.options.content_button_expanding);
           
           this.$uiEditor =  this.$uiExpanding.find(this.options.content_editor);
           
           this.$cmdEmojiButton =  this.$uiExpanding.find(this.options.cmd_emojionearea_button);
           
           this.$form = this.$uiControlTextForm.parents(this.options.form);
           
           this.$cmdFile =          $(this.options.cmd_file);
           this.$cmdFileExtra =     $(this.options.cmd_file_extra);
        }
            
});  
    
}( jQuery, emojione, arquematics || {}));
