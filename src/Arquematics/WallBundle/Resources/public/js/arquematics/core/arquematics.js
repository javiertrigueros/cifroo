
/**
 * Arquematics
 * 
 * @author Javier Trigueros Martínez de los Huertos
 * 
 * Copyright (c) 2014
 * Licensed under the MIT license.
 * 
 */
/*Variables globales jquey, document, window */

/**
 * Focus al finalizar el texto del control.
 * 
 * @param {jQuery} $
 */
(function($){
    $.fn.focusTextToEnd = function(){
        this.focus();
        var $thisVal = this.val();
        this.val('').val($thisVal);
        return this;
    };
}(jQuery));
/**
 * 
 * @param {type} $
 * @param {type} window
 *  @param {type} arquematics
 */
var arquematics = (function($, window, arquematics) {
    
var matched, browser;

$.uaMatch = function( ua ) {
    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    return {
        browser: match[ 1 ] || "",
        version: match[ 2 ] || "0"
    };
};

matched = $.uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
    browser[ matched.browser ] = true;
    browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
    browser.webkit = true;
} else if ( browser.webkit ) {
    browser.safari = true;
}

$.browser = browser;

/**
 * cambia el estado de un boton (arreglos firefox)
 * @param {jquery} $btnNode
 * @param {boolean} enabled
 */
$.buttonControlStatus = function ($btnNode, enabled)
{
             if (enabled)
             {
               $btnNode.button('reset');
                //arreglo del bug de firefox
                setTimeout(function () {
                    $btnNode.removeClass('disabled');
                    $btnNode.removeAttr('disabled');
                }, 1);       
             }
             else
             {
               $btnNode.button('loading');     
             }      
};


arquematics = {
  //configuracion del usuario
  config: {},

  /** @namespace crypt  */
  crypt: false,

  lang: 'es',

  /** clave de cifrado en local  */
  storeKey: false,
  /** @namespace Utilidades, libreria estática  */
  utils: {},
  /** @namespace vistas de documentos  */
  docviews: {},
  /** @namespace ecc  */
  ecc: false,
  /** @namespace store  */        
  store: false,
  
  /**
   * @namespace Codificador / Decodificador cadenas de texto, libreria estática .
   */
  codec: {},
  
  getClassFromString:function(str)
  {
        var arr = str.split(".");

        var fn = (window || this);
        for (var i = 0, len = arr.length; i < len; i++) {
            fn = fn[arr[i]];
        }

        if (typeof fn !== "function") {
            throw new Error("function not found");
        }
        return  fn;
  },
  /**
   * inicializa el objeto que implementa Codificador / Decodificador
   * :TODO otro parametro para seleccionar mas ti
   * 
   * @param {int} userId
   * @param {string} storeKey
   * @returns {obj crypt}
   */        
  initEncrypt: function(userId, storeKey)
  {
          try{
             arquematics.crypt = arquematics.utils.read(
                        userId + '-key',
                        'arquematics.ecc',
                        storeKey);
                     
             arquematics.storeKey = storeKey;
           }
           catch (err)
           {
               
              try{
                //la clave esta sin encriptar
                //se produce en login con fichero de clave
                arquematics.crypt = arquematics.utils.read(
                        userId + '-key',
                        'arquematics.ecc');
                
                //encripta la clave
                arquematics.utils.store(
                        userId + '-key',
                        arquematics.crypt, 
                        storeKey);
                        
                arquematics.storeKey = storeKey;
              }
              catch (err2)
              {
               
              }
           }
           
                  
           if (!arquematics.crypt)
           {
             throw("ecc: read key: No cookie");       
           }
   },
   decryptNodeText: function ($mainNode)
   {       
            var $arrNodes =  $mainNode.find('.content-text'),
                $arrNodesData =  $mainNode.find('.content-data'),
                $arrControls =  $mainNode.find('.control-crypt'),
                $node,
                $control,
                $children,
                nodeHexText = '',
                plainText = '';
            
            if (!arquematics.crypt)
            {
             throw("decryptNodeText: No arquematics.crypt init");       
            }
            else
            {
                $.each($arrNodes, function (encodeLineBreaksToHTML) {
                try {
                   $node = $(this);
                   $children = $node.children(); 
    
                   nodeHexText = $.trim($node.data('encrypt-text'));
                   if (nodeHexText.length > 0)
                   {
                      plainText = arquematics.crypt.decryptHexToString(nodeHexText);
                      
                      plainText = plainText.replace(/&/g, '&amp;')
                                         .replace(/>/g, '&gt;')
                                         .replace(/</g, '&lt;');
                                 
                      plainText = plainText.replace(new RegExp('(\r?\n)+','g'), '<br /><br />');
                               
                      $node.html(plainText);
                      
                      $node.append($children);
                   }
                  
                 } 
                 catch(e) 
                 {
                    throw("decryptNodeText: ->decryptHexToString");
                 }
                });
                
                $.each($arrControls, function () {
                    try {
                         $control = $(this);
                        nodeHexText = $.trim($control.data('encrypt-text'));
                        if (nodeHexText.length > 0)
                        {
                            plainText = arquematics.crypt.decryptHexToString(nodeHexText);
                           
                            $control.val(plainText);
                        }
                    } catch(e) {throw("decryptNodeText: ->decryptHexToString");}
                });
 
                $.each($arrNodesData, function () {
                    try {
                        $control = $(this);

                        nodeHexText = $.trim($control.data('content-enc'));
                        
                        if (nodeHexText.length > 0)
                        {
                            plainText = arquematics.crypt.decryptHexToString(nodeHexText);
                            plainText = plainText.replace(/&/g, '&amp;')
                                         .replace(/>/g, '&gt;')
                                         .replace(/</g, '&lt;');
                                         
                            $control.data('content', plainText);
                            //asegurarse que en la propiedad son correctos los datos
                            $control.attr('data-content', plainText);
                        }
                    } catch(e) {throw("decryptNodeText: ->decryptHexToString");}
                });
                
                
                
                if ($mainNode.hasClass('content-data'))
                {
                    
                     try {
                        nodeHexText = $.trim($mainNode.data('content-enc'));
                        
                        if (nodeHexText.length > 0)
                        {
                            plainText = arquematics.crypt.decryptHexToString(nodeHexText);
                            plainText = plainText.replace(/&/g, '&amp;')
                                         .replace(/>/g, '&gt;')
                                         .replace(/</g, '&lt;');

                            $mainNode.data('content', plainText);
                            //asegurarse que en la propiedad son correctos los datos
                            $mainNode.attr('data-content', plainText);
                        }
                    } catch(e) {
                        throw("decryptNodeText: ->decryptHexToString");
                    }    
                }
                
                
            }  
   },
  
  /** @namespace Exceptions. */
  exception: {
   
    /**
     * 
     * @param {String} message
     * @returns {obj}
     */
    invalid: function(message) {
      this.toString = function() { return "INVALID: "+this.message; };
      this.message = message;
    },
    
    /**
     * Bug o sin funcionalidad
     * @param {String} message
     * @returns {obj}
     */
    bug: function(message) {
      this.toString = function() { return "BUG: "+this.message; };
      this.message = message;
    },

    /**
     * No se ha cargado la funcionalidad
     * 
     * @param {type} message
     * @returns {obj}
     */
    notReady: function(message) {
      this.toString = function() { return "NOT READY: "+this.message; };
      this.message = message;
    }
  }
};

arquematics.randomGenerator = function()
{
    this.value = arquematics.utils.randomKeyString(50);
};

arquematics.randomGenerator.prototype = {
    get: function()
    {
      return this.value;
    },
    set: function(val)
    {
       this.value = val;
    },
    generate: function()
    {
       this.value = arquematics.utils.randomKeyString(50); 
    }
};

arquematics.context = function(defState)
{
    this.currentState = false;
    this.currentIndex = -1;
    this.lock = false;
    this.states = [];
    this.defState = defState;
};

arquematics.context.prototype = {
            add: function(state)
            {
               this.states.push(state);   
            },
            
            getParams: function ()
            {
              return this.params;  
            },
            
            setParams: function (param)
            {
               this.params = param; 
            },
            
            findState: function(state)
            {
               var ret = -1,
                   i = 0;
               if (this.states.length > 0)
               {
                   for (i = 0; i < this.states.length; i++) 
                   {
                        if (this.states[i].name === state.name) 
                            return i;
                   }
               }
               return ret;
            },
            change: function (state) 
            {
                this.currentState = state;
                this.currentIndex = this.findState(state);
                this.currentState.go(this.params);
            },
            next: function()
            {
                
                if ((this.currentIndex + 1) < this.states.length)
                {
                   this.currentIndex++;
                   this.currentState = this.states[this.currentIndex];
               
                   this.currentState.go(this.params);
                }
                // por defecto 
                else 
                {
                   this.change(this.defState);    
                }   
            },
            start: function ()
            {
               if (!this.lock)
               {
                  this.lock = true;
                  
                  if (this.states.length > 0)
                  {
                    this.currentIndex = 0;
                    this.currentState = this.states[this.currentIndex];
                    this.currentState.go(this.params);
                  }
                  // por defecto aunque no tengamos ningun estado cargado
                  else 
                  {
                     this.change(this.defState);        
                  }     
               }
            }
   };

   return arquematics;
}(jQuery, window, arquematics || {}));
