(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simditor-arup', ["jquery","simditor"], function (a0,b1) {
      return (root['ArupButton'] = factory(a0,b1));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),require("Simditor"));
  } else {
    root['SimditorArup'] = factory(jQuery,Simditor);
  }
}(this, function ($, Simditor) {

var ArupButton,
  that = this,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

ArupButton = (function(superClass) {
  extend(ArupButton, superClass);
  
  ArupButton.i18n = {
    'es': {
      arup: 'Insertar imagen'
    },
    'en': {
      arup: 'Insert Image'
    }
  };
 
  ArupButton.prototype.name = 'arup';

  ArupButton.prototype.icon = 'picture-o';

  ArupButton.prototype.menu = false;

  ArupButton.prototype.buttonMenu = true;

  function ArupButton() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ArupButton.__super__.constructor.apply(this, args);
    $.merge(this.editor.formatter._allowedAttributes['img'], ['id', 'class', 'alt']);
  }
  
  ArupButton.prototype.setImageAttr = function($img, hasChangeSize) {
      
      hasChangeSize = hasChangeSize || false;
      
      var $content = this.editor.body
      , percentW = parseInt(Math.round($img.width() / $content.width() * 100).toFixed(0), 10);
      
      if (percentW > 90)
      {
         percentW = 100;                         
      }
      
      $img.data('width_p', percentW);
      $img.data('height_p', $img.height());
      
      $img.data('size_change', hasChangeSize);
  }
  
  ArupButton.prototype.loadImage = function(image, docMaxW, model) {
      
      var url = window.URL || window.webkitURL
      , src = model.get('src');
     
      if ((image) && (image.nodeName.toLowerCase() === 'img'))
      {
         image.onload = function() {
            var $imageNode = $(this);
            
             $imageNode.height('auto');
             $imageNode.width('100%');
             
             if (model.get('w') && model.get('w') != 0)
             {
               $imageNode.width(model.get('w') + '%');
             }
             else
             {
                $imageNode.width(docMaxW);  
             }  
         }      
         image.src =  url.createObjectURL(src);            
     }
  }
   
  ArupButton.prototype._init = function() {
    var that = this;
    
    if (this.editor.util.os.mac)
    {
      this.title = that._t('image');
    } else {
      this.title = that._t('image');
    }
    
    /**
    * Él evento se da también la primera vez que se 
    * visualiza el contenido del editor
    */
    this.editor.on('valuechanged', function(e){
        var  files = that.editor.opts.arup.files
        , $content = that.editor.body
        , imageModel
        , $parent
        , $image;
       
        if (files && (files.length > 0))
        {
            for (var i = 0; i < files.length; ++i)
            {
               imageModel = files.at(i);
               
               if (imageModel.get('id'))
               {
                  $image = $content.find('img[alt="' + imageModel.get('id') + '"]');

                  that.loadImage($image.get(0), that.editor.body.width(), imageModel);
                  
                  that.setImageAttr($image, false);
                  
                  //si no se han añadido ya los handlers
                  if (!$image.hasClass('imageHandler'))
                  {
                     $image.addClass('imageHandler');
                     //activa los menus
                     $image.on( "click",function(e){
                        e.stopPropagation();
                        e.preventDefault();
                       
                        var $imageBox = $(this)
                        , $span_cmd;
                        
                        if (!$imageBox.hasClass('box-selected'))
                        {
                            $imageBox.addClass('box-selected');
                         
                            $( "<span class='img-cmd cmd-minus'></span>" ).insertBefore($imageBox);
                            $( "<span class='img-cmd cmd-plus'></span>" ).insertBefore($imageBox);
                        }
                        else
                        {
                           $parent = $imageBox.parent();
                           $parent.find('span').remove();
                           $imageBox.removeClass('box-selected');    
                        }
                        
                        $parent = $imageBox.parent();
                        $span_cmd  = $parent.find('span'); 
                        
                        $span_cmd.on( "click",function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            
                            var $cmd = $(this)
                            , $img = $(this).parent().find('img')
                            , percentW = parseInt(Math.round($img.width() / $content.width() * 100).toFixed(0), 10);
                            
                            $cmd.removeAttr('_moz_activated');
                            
                            if ($cmd.hasClass('cmd-minus'))
                            {
                              percentW = (percentW - 10  <= 25)? 25: percentW - 10;
                              
                               percentW = 10 * parseInt(Math.round(percentW / 10).toFixed(0), 10);
                              
                              $img.width(percentW + '%'); 
                            }
                            else if ($cmd.hasClass('cmd-plus'))
                            {
                              percentW += 10;
                              percentW = 10 * parseInt(Math.round(percentW / 10).toFixed(0), 10);
                             
                                
                              if (percentW > 99)
                              {
                                 percentW = 100; 
                                 $img.width($content.width());
                              }
                              else
                              {
                                $img.width(percentW + '%');       
                              }
                            }
                            
                            that.setImageAttr($img, true);
                            // height = 0 es decir height = auto
                            that.editor.trigger('imagechanged', {image: $img, w: percentW, h: 0});
                            
                            $imageBox.click();
                            $imageBox.click();
                        });
                     });
                  }
               }
                
            }
        }
    });
    
    this.editor.on('attachImages', function(e, model){

        var image = new Image()
        , $img, range, $insertPar, $boxContainer;
        
        if (!that.editor.inputManager.focused) {
            that.editor.focus();
        }
        range = that.editor.selection.range();
        range.deleteContents();
        that.editor.selection.range(range);
    
        $img = $(image);
        
        $insertPar = $('<p><br /></p>');
        
        $img.attr('alt', model.get('id'))
            .attr('title', model.get('id'))
            .attr('class', 'editor-image full-size');
            
        that.loadImage(image, that.editor.body.width(), model);

        range.insertNode($insertPar[0]);
        range.insertNode($img[0]);
        
        that.editor.selection.setRangeAfter($img, range);
        
        //esto se llama al meter la imagen
        //pero el evento tambien se da al inicializar
        that.editor.trigger('valuechanged');   
    });
    
    return ArupButton.__super__._init.call(this);
  };
  
 
  
  ArupButton.prototype.command = function()
  {
      /*
    document.execCommand('italic');
    if (!this.editor.util.support.oninput) {
      this.editor.trigger('valuechanged');
    }
    return $(document).trigger('selectionchange');*/
    //openDroparea
      
    this.editor.opts.arup.openDroparea();
  };


  ArupButton.prototype.status = function() {
    
  };
  
  ArupButton.prototype.addImageModel = function(model) {
   
  };
  

  return ArupButton;

})(Simditor.Button);

Simditor.Toolbar.addButton(ArupButton);

return ArupButton;

}));
