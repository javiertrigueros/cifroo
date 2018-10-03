
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
/**
 * Arquematics Codec. Utilidades codificacion / decodificación 
 *                    con cadenas
 * 
 * @author Javier Trigueros Martínez de los Huertos
 * 
 * Copyright (c) 2014
 * Licensed under the MIT license.
 * 
 * dependencias:
 * - 
 */
var arquematics = (function( arquematics) {

arquematics.codec = {
   encodeURIData: function(s,  skipDataType)
   {
    skipDataType = skipDataType || true;
       
    if (skipDataType)
    {
        s = s.replace(new RegExp('^data:(.*);base64,'), "")
              .replace(new RegExp('^data:(.*);charset\=utf\-8,'), "");
    }
       
    return encodeURIComponent(s).replace(/\-/g, "%2D").replace(/\_/g, "%5F").replace(/\./g, "%2E").replace(/\!/g, "%21").replace(/\~/g, "%7E").replace(/\*/g, "%2A").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29");
   },
   
   decodeURIData: function(s, skipDataType)
   {
       skipDataType = skipDataType || true;
       
       if (skipDataType)
       {
         s = s.replace(new RegExp('^data:(.*);base64,'), "")
              .replace(new RegExp('^data:(.*);charset\=utf\-8,'), "");
       }
       
        try{
            return decodeURIComponent(s.replace(/\%2D/g, "-").replace(/\%5F/g, "_").replace(/\%2E/g, ".").replace(/\%21/g, "!").replace(/\%7E/g, "~").replace(/\%2A/g, "*").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")"));
        }catch (e) {
           return ""; 
        }
    },
    
    isDataURL: function(dataURL)
    {
          var regex = /^\s*data:([a-z]+\/[a-z0-9\-\+]+(;[a-z\-]+\=[a-z0-9\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

          return !!dataURL.match(regex);
    },
    
   ArrayBuffer: {
       
        toBase64String: function (arrayBuffer, mimeType)
        {
            //mirar funcion en https://gist.github.com/jonleighton/958841
            // si btoa no funciona
            mimeType = mimeType || false;

            var binary = '';
            var bytes = new Uint8Array( arrayBuffer );
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode( bytes[ i ] );
            }
            return (!mimeType)? btoa(binary) :'data:' + mimeType + ';base64,' + btoa(binary);
        },
        stringToArrayBuffer: function(str)
        {
            var buf = new ArrayBuffer(str.length*2); // 2 bytes por cada char
            var bufView = new Uint16Array(buf);
            for (var i=0, strLen=str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return buf;
        }
   },
   Base64: {
       toArrayBuffer: function(base64, skipDataType) {
                skipDataType = skipDataType || true;
            
                if (skipDataType)
                {
                    base64 = base64.replace(new RegExp('^data:(.*);base64,'), "");
                }
                
                var binary_string =  arquematics.codec.Base64.toByteCharacters(base64);
                var len = binary_string.length;
                var bytes = new Uint8Array( len );
                for (var i = 0; i < len; i++)        {
                    bytes[i] = binary_string.charCodeAt(i);
                }
                return bytes.buffer;
        },
       isBase: function (b64Data, skipDataType)
       {
          skipDataType = skipDataType || true;
          var base64Rejex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/i;  
            
          if (skipDataType)
          {
             b64Data = b64Data.replace(new RegExp('^data:(.*);base64,'), "");
          }
            
          return base64Rejex.test(b64Data);
       },
        /**
        *   ejemlo de uso
        *
        *   var blob = arquematics.codec.Base64.toBlob(b64Data, contentType);
        *   var blobUrl = URL.createObjectURL(blob);
        *   window.location = blobUrl;
        */
        toBlob: function(b64Data, contentType, sliceSize)
        {
            return new Blob(arquematics.codec.Base64.toBytesArray(b64Data, true, sliceSize), {type: contentType});
        },
        /**
         * igual que la funcion atob pero mas robusta

         */
        toByteCharacters: function(b64Data)
        {
            function decodeBase64(s) {
                 var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
                var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                for(i=0;i<64;i++){e[A.charAt(i)]=i;}
                for(x=0;x<L;x++){
                    c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
                    while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
                }
                return r;
            }
           
            try {
               return atob(b64Data);
            }
            catch (e) {
               return decodeBase64(b64Data); 
            }
        },
        
        toBytesArray: function(b64Data,  skipDataType, sliceSize)
        {
            sliceSize = sliceSize || 512
            skipDataType = skipDataType || true;
            
            if (skipDataType)
            {
                b64Data = b64Data.replace(new RegExp('^data:(.*);base64,'), "");
            }

            var byteCharacters = arquematics.codec.Base64.toByteCharacters(b64Data)
                ,   byteArrays = [];
                
            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize)
            {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }
            
            return byteArrays;
        },
        
        toBinary: function(b64Data, skipDataType)
        {
            skipDataType = skipDataType || true;
            
            if (skipDataType)
            {
                b64Data = b64Data.replace(new RegExp('^data:(.*);base64,'), "");
            }
            
            var raw =  arquematics.codec.Base64.toByteCharacters(b64Data)
            , uint8Array = new Uint8Array(raw.length);
            
            for (var i = 0; i < raw.length; i++) {
            
                uint8Array[i] = raw.charCodeAt(i);
            }
            return uint8Array;
        },
        
        // private property
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        b64DecodeUnicode: function (str) {
            return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        },
        b64EncodeUnicode: function (str) {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
                return String.fromCharCode(parseInt(p1, 16));
            }));
        },

    /**
    *
    * @param {String} input
    * @returns {String}
    */
    encode : function (input) {
        try {
            return btoa(input);
        }
        catch (e) {

            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = arquematics.codec.Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        }
    },
    /**
    * public method for decoding base64 to normal string
    *
    * @param {String} input
    * @returns {String}
    */
    toString : function (input, skipDataType) {
       skipDataType = skipDataType || false;
            
       if (skipDataType)
       {
         input = input.replace(new RegExp('^data:(.*);base64,'), "");
       }

        try {
            return atob(input);
        }
        catch (e) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = arquematics.codec.Base64._utf8_decode(output);

            return output;

            }

        },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) 
        {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while ( i < utftext.length )
            {
                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }

            return string;
        }
    },
   HEX: {
      d2h: function(d) {
        return d.toString(16);
      },
      h2d: function(h) {
        return parseInt(h, 16);
      },
      /**
       * Convierte (string) -> (string de caracteres hexadecimales)
       * 
       * @param {String} strTmp
       * @returns {String}
       */        
      encode: function(strTmp) {
        var strRet = '',
            i = 0,
            tmp_len = strTmp.length,
            c;
            
          for (; i < tmp_len; i ++) {
                c = strTmp.charCodeAt(i);
                strRet += c.toString(16);
          }
          return strRet;
      },
      /**
       * Convierte (string de caracteres hexadecimales) -> (string)
       * 
       * @param {String} strTmp
       * @returns {String}
       */     
      toString: function(strTmp) {
          
         strTmp = strTmp || '';
         
         var strRet = '';
         
         if (strTmp && (strTmp.length> 0))
         {
             var arr = strTmp.match(/.{1,2}/g)
            , arr_len = arr.length
            , i = 0
            , c;
            
            for (; i < arr_len; i ++)
            {
                c = String.fromCharCode( parseInt(arr[i],16 ) );
                strRet += c;
            }
         }
        return strRet;
    }
  },
   BIN: {
        toBase64Encode: function(binaryRespose) {
            var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var out = "", i = 0, len = binaryRespose.length, c1, c2, c3;
            while (i < len) {
                c1 = binaryRespose.charCodeAt(i++) & 0xff;
                 if (i == len) {
                    out += CHARS.charAt(c1 >> 2);
                    out += CHARS.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = binaryRespose.charCodeAt(i++);
                if (i == len) {
                    out += CHARS.charAt(c1 >> 2);
                    out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                    out += CHARS.charAt((c2 & 0xF) << 2);
                    out += "=";
                    break;
            }
        c3 = binaryRespose.charCodeAt(i++);
        out += CHARS.charAt(c1 >> 2);
        out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += CHARS.charAt(c3 & 0x3F);
            }
            return out;
        },
        /**
         * entero a array Binario
         * 
         * @param {type} nMask :entre -2147483648 and 2147483647
         * @returns {aFromMask} : array of Boolean
         */
        toBitArr: function(nMask){
            // nMask must be between -2147483648 and 2147483647
            if (nMask > 0x7fffffff || nMask < -0x80000000) { throw new TypeError("arrayFromMask - out of range"); }
            for (var nShifted = nMask,
                    aFromMask = [];
                    nShifted;
                    aFromMask.push(Boolean(nShifted & 1)),
                    nShifted >>>= 1)
               
            return aFromMask;
        },
                
        /**
         * entero a cadena binaria ej: 11 => devuelve 1011
         * 
         * @param {int} nMask :entre -2147483648 and 2147483647
         * @returns {String}
         */        
        encode: function(nMask) {
            var nShifted = nMask,
                sMask = "";
            
            for (var nFlag = 0;
               //condicion
               (nFlag < 32);
               //incrementos
               nFlag++,sMask += String(nShifted >>> 31),
               nShifted <<= 1)
               
            return sMask;
        }
    }
  };
  
  return arquematics;
  
}(arquematics || {}));/**
 * arquematics.mime
 * 
 * @author Javier Trigueros Martínez de los Huertos
 * 
 * Copyright (c) 2014
 * Licensed under the MIT license.
 * 
 * dependencias:
 * - 
 */
var arquematics = (function(arquematics) {

arquematics.mime = {
   // Mirar http://webdesign.about.com/od/multimedia/a/mime-types-by-content-type.htm
   // fuente http://help.dottoro.com/lapuadlp.php
   ///tipo principal es [0] los demas on alias
   mimeTypesMap:{
    '323':['text/h323'],
    'epub': ['application/epub+zip'],
    'aac':['audio/aac'],
    'abw':['application/abiword'],
    'acx':['application/internet-property-stream'],
    'ai':['application/illustrator'],
    'aif':['audio/aiff','audio/aifc','audio/x-aiff'],
    'aifc':['audio/aiff','audio/aifc','audio/x-aiff'],
    'aiff':['audio/aiff','audio/aifc','audio/x-aiff'],
    'asf':['video/x-ms-asf'],
    'asp':['application/x-asp','text/asp'],
    'asr':['video/x-ms-asf'],
    'asx':['video/x-ms-asf'],
    'au':['audio/basic','audio/au','audio/x-au','audio/x-basic'],
    'avi':['video/avi','application/x-troff-msvideo','image/avi','video/msvideo','video/x-msvideo','video/xmpg2'],
    'axs':['application/olescript'],
    'bas':['text/plain'],
    'bin':['application/octet-stream','application/bin','application/binary','application/x-msdownload'],
    'bmp':['image/bmp','application/bmp','application/x-bmp','image/ms-bmp','image/x-bitmap','image/x-bmp','image/x-ms-bmp','image/x-win-bitmap','image/x-windows-bmp','image/x-xbitmap'],
    'bz2':['application/x-bzip2','application/bzip2','application/x-bz2','application/x-bzip'],
    'c':['text/x-csrc'],
    'c++':['text/x-c++src'],
    'cab':['application/vndms-cab-compressed','application/cab','application/x-cabinet'],
    'cat':['application/vndms-pkiseccat'],
    'cct':['application/x-director'],
    'cdf':['application/cdf','application/x-cdf','application/netcdf','application/x-netcdf','text/cdf','text/x-cdf'],
    'cer':['application/x-x509-ca-cert','application/pkix-cert','application/x-pkcs12','application/keychain_access'],
    'cfc':['application/x-cfm'],
    'cfm':['application/x-cfm'],
    'class':['application/x-java','application/java','application/java-byte-code','application/java-vm','application/x-java-applet','application/x-java-bean','application/x-java-class','application/x-java-vm','application/x-jinit-bean','application/x-jinit-applet'],
    'clp':['application/x-msclip'],
    'cmx':['image/x-cmx','application/cmx','application/x-cmx','drawing/cmx','image/x-cmx'],
    'cod':['image/cis-cod'],
    'cp':['text/x-c++src'],
    'cpio':['application/x-cpio'],
    'cpp':['text/x-c++src', 'text/x-c'],
    'crd':['application/x-mscardfile'],
    'crt':['application/x-x509-ca-cert','application/pkix-cert','application/x-pkcs12','application/keychain_access'],
    'crl':['application/pkix-crl'],
    'csh':['application/x-csh'],
    'css':['text/css','application/css-stylesheet'],
    'cst':['application/x-director'],
    'csv':['text/csv','application/csv','text/comma-separated-values','text/x-comma-separated-values'],
    'cxt':['application/x-director'],
    'dcr':['application/x-director'],
    'der':['application/x-x509-ca-cert','application/pkix-cert','application/x-pkcs12','application/keychain_access'],
    'dib':['image/bmp','application/bmp','application/x-bmp','image/ms-bmp','image/x-bitmap','image/x-bmp','image/x-ms-bmp','image/x-win-bitmap','image/x-windows-bmp','image/x-xbitmap'],
    'diff':['text/x-patch'],
    'dir':['application/x-director'],
    'dll':['application/x-msdownload','application/octet-stream','application/x-msdos-program'],
    'dms':['application/octet-stream'],
    'doc':['application/vndms-word','application/doc','application/msword','application/msword-doc','application/vndmsword','application/winword','application/word','application/x-msw6','application/x-msword','application/x-msword-doc'],
    'docm':['application/vnd.ms-word.document.macroEnabled.12'],
    'docx':['application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-word.document.12', 'application/vnd.openxmlformats-officedocument.word'],
    'dot':['application/msword'],
    'dotm':['application/vnd.ms-word.template.macroEnabled.12'],
    'dotx':['application/vnd.openxmlformats-officedocument.wordprocessingml.template'],
    'dta':['application/x-stata'],
    'dv':['video/x-dv'],
    'dvi':['application/x-dvi'],
    'dwg':['image/x-dwg','application/acad','application/autocad_dwg','application/dwg','application/x-acad','application/x-autocad','application/x-dwg','image/vnddwg'],
    'dxf':['application/x-autocad','application/dxf','application/x-dxf','drawing/x-dxf','image/vnddxf','image/x-autocad','image/x-dxf'],
    'dxr':['application/x-director'],
    'elc':['application/x-elc'],
    'eml':['message/rfc822'],
    'enl':['application/x-endnote-library','application/x-endnote-refer'],
    'enz':['application/x-endnote-library','application/x-endnote-refer'],
    'eps':['application/postscript','application/eps','application/x-eps','image/eps','image/x-eps'],
    'etx':['text/x-setext','text/anytext'],
    'evy':['application/envoy','application/x-envoy'],
    'exe':['application/x-msdos-program','application/dos-exe','application/exe','application/msdos-windows','application/x-sdlc','application/x-exe','application/x-winexe'],
    'fif':['application/fractals','image/fif'],
    'flr':['x-world/x-vrml'],
    'fm':['application/vndframemaker','application/framemaker','application/maker','application/vndmif','application/x-framemaker','application/x-maker','application/x-mif'],
    'fqd':['application/x-director'],
    'gif':['image/gif'],
    'gtar':['application/tar','application/x-gtar','application/x-tar'],
    'gz':['application/gzip','application/gzip-compressed','application/gzipped','application/x-gunzip','application/x-gzip'],
    'h':['text/x-chdr'],
    'hdf':['application/x-hdf'],
    'hlp':['application/winhlp','application/x-helpfile','application/x-winhelp'],
    'hqx':['application/binhex','application/mac-binhex','application/mac-binhex40'],  
    'hta':['application/hta'],
    'htc':['text/x-component'],
    'htm':['text/html','application/xhtml+xml'],
    'html':['text/html','application/xhtml+xml'],
    'htt':['text/webviewhtml'],
    'ico':['image/x-ico'],
    'ics':['text/calendar'],
    'ief':['image/ief'],
    'iii':['application/x-iphone'],
    'indd':['application/x-indesign'],
    'ins':['application/x-internet-signup'],
    'isp':['application/x-internet-signup'],
    'jad':['text/vndsunj2meapp-descriptor'],
    'jar':['application/java-archive'],
    'java':['text/x-java','java/*','text/java','text/x-java-source'],
    'jfif':['image/jpeg','image/pjpeg'],
    'jpe':['image/jpeg','image/pjpeg'],
    'jpeg':['image/jpeg','image/pjpeg'],
    'jpg':['image/jpeg','image/pjpeg'],
    'jp2':['image/jp2'],
    'fh': ['image/x-freehand'],
    'fhc': ['image/x-freehand'],
    'fh4': ['image/x-freehand'],
    'fh5': ['image/x-freehand'],
    'fh7': ['image/x-freehand'],
    'svgz': ['image/svg+xml'],
    'svg': ['image/svg+xml'],
    'jpx':['image/jp2'],
    'xcf': ['image/x-xcf'],
    'djvu': ['image/vnd.djvu'],
    'djv': ['image/vnd.djvu'],
    'js':['text/javascript','application/javascript','application/x-javascript','application/x-js'],
    'kml':['application/vndgoogle-earthkml+xml'],
    'kmz':['application/vndgoogle-earthkmz'],
    'latex':['application/x-latex','text/x-latex'],
    'lha':['application/x-lha','application/lha','application/lzh','application/x-lzh','application/x-lzh-archive'],
    'lib':['application/x-endnote-library','application/x-endnote-refer'],
    'llb':['application/x-labview','application/x-labview-vi'],
    'log':['text/x-log'],
    'lsf':['video/x-la-asf'],
    'lsx':['video/x-la-asf'],
    'lvx':['application/x-labview-exec'],
    'lzh':['application/x-lha','application/lha','application/lzh','application/x-lzh','application/x-lzh-archive'],
    'm':['text/x-objcsrc'],
    'm1v':['video/mpeg'],
    'm2v':['video/mpeg'],
    'm3u':['audio/x-mpegurl','application/x-winamp-playlist','audio/mpegurl','audio/mpeg-url','audio/playlist','audio/scpls','audio/x-scpls'],
    'm4a':['audio/m4a','audio/x-m4a'],
    'm4v':['video/mp4','video/mpeg4','video/x-m4v'],
    'ma':['application/mathematica'],
    'mail':['message/rfc822'],
    'man':['application/x-troff-man'],
    'mcd':['application/x-mathcad','application/mcad'],
    'mdb':['application/vndms-access','application/mdb','application/msaccess','application/vndmsaccess','application/x-mdb','application/x-msaccess'],
    'me':['application/x-troff-me'],
    'mfp':['application/x-shockwave-flash','application/futuresplash'],
    'mht':['message/rfc822'],
    'mhtml':['message/rfc822'],
    'mid':['audio/x-midi','application/x-midi','audio/mid','audio/midi','audio/soundtrack'],
    'midi':['audio/x-midi','application/x-midi','audio/mid','audio/midi','audio/soundtrack'],
    'mif':['application/vndframemaker','application/framemaker','application/maker','application/vndmif','application/x-framemaker','application/x-maker','application/x-mif'],
    'mny':['application/x-msmoney'],
    'mov':['video/quicktime'],
    'mp2':['video/mpeg','audio/mpeg','audio/x-mpeg','audio/x-mpeg-2','video/x-mpeg','video/x-mpeq2a'],
    'mp3':['audio/mpeg','audio/mp3','audio/mpeg3','audio/mpg','audio/x-mp3','audio/x-mpeg','audio/x-mpeg3','audio/x-mpg'],
    'mpa':['video/mpeg'],
    'mpe':['video/mpeg'],
    'mpeg':['video/mpeg'],
    'mpg':['video/mpeg'],
    'mpp':['application/vndms-project','application/mpp','application/msproj','application/msproject','application/x-dos_ms_project','application/x-ms-project','application/x-msproject'],
    'mpv2':['video/mpeg'],
    'mqv':['video/quicktime'],
    'ms':['application/x-troff-ms'],
    'mvb':['application/x-msmediaview'],
    'mws':['application/x-maple','application/maple-v-r4'],
    'nb':['application/mathematica'],
    'nws':['message/rfc822'],
    'oda':['application/oda'],
    'odc':['application/vnd.oasis.opendocument.chart'],
    'odf':['application/vnd.oasis.opendocument.formula'],
    'odg':['application/vnd.oasis.opendocument.graphics'],
    'odp':['application/vnd.oasis.opendocument.presentation'],
    'ods':['application/vnd.oasis.opendocument.spreadsheet'],
    'ots':['application/vnd.oasis.opendocument.spreadsheet-template'],
    'ott':['application/vnd.oasis.opendocument.text-template'],
    'odt':['application/vnd.oasis.opendocument.text'],
    'ogg':['application/ogg','application/x-ogg','audio/x-ogg'],
    'one':['application/msonenote'],
    'p12':['application/x-x509-ca-cert','application/pkix-cert','application/x-pkcs12','application/keychain_access'],
    'patch':['text/x-patch'],
    'pbm':['image/x-portable-bitmap','image/pbm','image/portable-bitmap','image/x-pbm'],
    'pcd':['image/x-photo-cd','image/pcd'],
    'pct':['image/x-pict','image/pict','image/x-macpict'],
    'pdf':['application/pdf','application/acrobat','application/nappdf','application/x-pdf','application/vndpdf','text/pdf','text/x-pdf'],
    'pfx':['application/x-pkcs12'],
    'pgm':['image/x-portable-graymap','image/x-pgm'],
    'php':['application/x-php','application/php','text/php','text/x-php'],
    'pic':['image/x-pict','image/pict','image/x-macpict'],
    'pict':['image/x-pict','image/pict','image/x-macpict'],
    'pjpeg':['image/jpeg','image/pjpeg'],
    'pl':['application/x-perl','text/x-perl'],
    'pls':['audio/x-mpegurl','application/x-winamp-playlist','audio/mpegurl','audio/mpeg-url','audio/playlist','audio/scpls','audio/x-scpls'],
    'pko':['application/yndms-pkipko'],
    'pm':['application/x-perl','text/x-perl'],
    'pmc':['application/x-perfmon'],
    'png':['image/png','image/x-png'],
    'pnm':['image/x-portable-anymap'],
    'pod':['text/x-pod'],
    'potm':['application/vndms-powerpointtemplatemacroEnabled12'],
    'potx':['application/vndopenxmlformats-officedocumentpresentationmltemplate'],
    'ppam':['application/vndms-powerpointaddinmacroEnabled12'],
    'ppm':['image/x-portable-pixmap','application/ppm','application/x-ppm','image/x-ppm'],
    'pps':['application/vndms-powerpoint','application/ms-powerpoint','application/mspowerpoint','application/powerpoint','application/ppt','application/vnd-mspowerpoint','application/vnd_ms-powerpoint','application/x-mspowerpoint','application/x-powerpoint'],
    'ppsm':['application/vnd.ms-powerpoint.slideshow.macroEnabled.12'],
    'ppsx':['application/vnd.openxmlformats-officedocument.presentationml.slideshow'],
    'ppt':['application/vnd.ms-powerpoint','application/ms-powerpoint','application/mspowerpoint','application/powerpoint','application/ppt','application/vnd-mspowerpoint','application/vnd_ms-powerpoint','application/x-mspowerpoint','application/x-powerpoint'],
    'pptm':['application/vnd.ms-powerpoint.presentation.macroEnabled.12'],
    'pptx':['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    'prf':['application/pics-rules'],
    'ps':['application/postscript','application/eps','application/x-eps','image/eps','image/x-eps'],
    'psd':['application/photoshop','application/psd','application/x-photoshop','image/photoshop','image/psd','image/x-photoshop','image/x-psd'],
    'pub':['application/vndms-publisher','application/x-mspublisher'],
    'py':['text/x-python'],
    'qt':['video/quicktime'],
    'ra':['audio/vndrn-realaudio','audio/vndpn-realaudio','audio/x-pn-realaudio','audio/x-pn-realaudio-plugin','audio/x-pn-realvideo','audio/x-realaudio'],
    'ram':['audio/vndrn-realaudio','audio/vndpn-realaudio','audio/x-pn-realaudio','audio/x-pn-realaudio-plugin','audio/x-pn-realvideo','audio/x-realaudio'],
    'rar':['application/rar','application/x-rar-compressed'],
    'ras':['image/x-cmu-raster'],
    'rgb':['image/x-rgb','image/rgb'],
    'rm':['application/vndrn-realmedia'],
    'rmi':['audio/mid'],
    'roff':['application/x-troff'],
    'rpm':['audio/vndrn-realaudio','audio/vndpn-realaudio','audio/x-pn-realaudio','audio/x-pn-realaudio-plugin','audio/x-pn-realvideo','audio/x-realaudio'],
    'rtf':['application/rtf','application/richtext','application/x-rtf','text/richtext','text/rtf'],
    'rtx':['application/rtf','application/richtext','application/x-rtf','text/richtext','text/rtf'],
    'rv':['video/vndrn-realvideo','video/x-pn-realvideo'],
    'sas':['application/sas','application/x-sas','application/x-sas-data','application/x-sas-log','application/x-sas-output'],
    'sav':['application/spss'],
    'scd':['application/x-msschedule'],
    'scm':['text/x-scriptscheme','text/x-scheme'],
    'sct':['text/scriptlet'],
    'sd2':['application/spss'],
    'sea':['application/x-sea'],
    'sh':['application/x-sh','application/x-shellscript'],
    'shar':['application/x-shar'],
    'shtml':['text/html','application/xhtml+xml'],
    'sit':['application/stuffit','application/x-sit','application/x-stuffit'],
    'smil':['application/smil','application/smil+xml'],
    'snd':['audio/basic','audio/au','audio/x-au','audio/x-basic'],
    'spl':['application/x-shockwave-flash','application/futuresplash'],
    'spo':['application/spss'],
    'sql':['text/x-sql','text/sql'],
    'src':['application/x-wais-source'],
    'sst':['application/vndms-pkicertstore'],
    'stl':['application/sla'],
    'stm':['text/html'],
    'swa':['application/x-director'],
    'swf':['application/x-shockwave-flash','application/futuresplash'],
    'sxw':['application/vndsunxmlwriter'],
    't':['application/x-troff'],
    'tar':['application/tar','application/x-gtar','application/x-tar'],
    'tcl':['application/x-tcl','text/x-scripttcl','text/x-tcl'],
    'tex':['application/x-tex','text/x-tex'],
    'tga':['image/x-targa','application/tga','application/x-targa','application/x-tga','image/targa','image/tga','image/x-tga'],
    'tgz':['application/gzip','application/gzip-compressed','application/gzipped','application/x-gunzip','application/x-gzip'],
    'tif':['image/tiff','application/tif','application/tiff','application/x-tif','application/x-tiff','image/tif','image/x-tif','image/x-tiff'],
    'tiff':['image/tiff','application/tif','application/tiff','application/x-tif','application/x-tiff','image/tif','image/x-tif','image/x-tiff'],
    'tnef':['application/ms-tnef'],
    'torrent': ['application/x-bittorrent'],
    'tfm': ['application/x-tex-tfm'],
    'tr':['application/x-troff'],
    'trm':['application/x-msterminal'],
    'tsv':['text/tsv','text/tab-separated-values','text/x-tab-separated-values'],
    'twb':['application/twb','application/twbx','application/x-twb'],
    'twbx':['application/twb','application/twbx','application/x-twb'],
    'text': ['text/plain'],
    'conf': ['text/plain'],
    'def': ['text/plain'],
    'list': ['text/plain'],
    'in': ['text/plain'],
    'txt':['text/plain'],
    'dsc': ['text/prs.lines.tag'],
    'uls':['text/iuls'],
    'ustar':['application/x-ustar'],
    'vcf':['text/x-vcard'],
    'vrml':['x-world/x-vrml'],
    'vsd':['application/vndvisio','application/visio','application/visiodrawing','application/vsd','application/x-visio','application/x-vsd','image/x-vsd'],
    'w3d':['application/x-director'],
    'war':['application/x-webarchive'],
    'wav':['audio/wav','audio/s-wav','audio/wave','audio/x-wav'],
    'wcm':['application/vndms-works'],
    'wdb':['application/vndms-works','application/x-msworks-wp'],
    'wks':['application/vndms-works','application/x-msworks-wp'],
    'wma':['audio/x-ms-wma'],
    'wmf':['image/x-wmf','application/wmf','application/x-msmetafile','application/x-wmf','image/wmf','image/x-win-metafile'],
    'wmv':['video/x-ms-wmv'],
    'wmz':['application/x-ms-wmz'],
    'wpd':['application/wordperfect','application/wordperf','application/wpd'],
    'wps':['application/vndms-works','application/x-msworks-wp'],
    'wri':['application/x-mswrite'],
    'wrl':['x-world/x-vrml'],
    'wrz':['x-world/x-vrml'],
    'xbm':['image/x-xbitmap'],
    'cc': ['text/x-c'],
    'cxx': ['text/x-c'],
    'hh': ['text/x-c'],
    'dic': ['text/x-c'],
    'xhtml':['text/html','application/xhtml+xml'],
    'xla':['application/vndms-excel'],
    'xlam':['application/vndms-exceladdinmacroEnabled12'],
    'xlc':['application/vndms-excel'],
    'xll':['application/vndms-excel','application/excel','application/msexcel','application/msexcell','application/x-dos_ms_excel','application/x-excel','application/x-ms-excel','application/x-msexcel','application/x-xls','application/xls'],
    'xlm':['application/vndms-excel'],
    'xls':['application/vndms-excel','application/excel','application/msexcel','application/msexcell','application/x-dos_ms_excel','application/x-excel','application/x-ms-excel','application/x-msexcel','application/x-xls','application/xls'],
    'xlsb':['application/vnd.ms-excel.sheet.binary.macroEnabled.12'],
    'xlsm':['application/vnd.ms-excel.sheet.macroEnabled.12'],
    'xlsx':['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    'xlt':['application/vndms-excel'],
    'xltm':['application/vndms-exceltemplatemacroEnabled12'],
    'xltx':['application/vndopenxmlformats-officedocumentspreadsheetmltemplate'],
    'xlw':['application/vndms-excel'],
    'xml':['text/xml','application/x-xml','application/xml'],
    'xpm':['image/x-xpixmap','image/x-xpm','image/xpm'],
    'xps':['application/vndms-xpsdocument'],
    'xsl':['text/xsl'],
    'xwd':['image/x-xwindowdump','image/xwd','image/x-xwd','application/xwd','application/x-xwd'],
    '7z':['application/x-7z-compressed'],
    'z':['application/x-compress','application/z','application/x-z'],
    'zip':['application/zip','application/x-compress','application/x-compressed','application/x-zip','application/x-zip-compressed','application/zip-compressed','application/x-7zip-compressed']
   },
  
   //tipos mime , icono y extension a convertir
   mimeTypesAndExt: {
         'text/plain': {icon: 'txt', convertType: 'txt'},
         
         'application/x-autocad': {icon: 'dxf', convertType: 'dxf'},
         'image/x-dwg': {icon: 'dwg', convertType: 'dwg'},
         
         'application/pdf': {icon: 'pdf', convertType: 'pdf'},
         'application/sla': {icon: 'stl', convertType: 'stl'},
         
         'application/zip': {icon: 'zip', convertType: 'zip'},
         'application/rar': {icon: 'zip', convertType: 'rar'},
         'application/photoshop': {icon: 'psd', convertType: 'psd'},
         //OpenOffice
         'application/vnd.oasis.opendocument.text': {icon: 'odt', convertType: 'odt'},
         'application/vnd.oasis.opendocument.presentation': {icon: 'odp', convertType: 'odp'},
         'application/vnd.oasis.opendocument.spreadsheet': {icon: 'ods', convertType: 'ods'},
         //Office 
         //word docx
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document':  {icon: 'doc', convertType: 'docx'},
         'application/vnd.ms-word.document.12':  {icon: 'doc', convertType: 'docx'},
         //word doc
         'application/vndms-word': {icon: 'doc', convertType:'doc'},
         'application/doc': {icon: 'doc', convertType:'doc'},
         'application/msword': {icon: 'doc', convertType:'doc'},
         'application/msword-doc': {icon: 'doc', convertType:'doc'},
         'application/vndmsword': {icon: 'doc', convertType:'doc'},
         'application/winword': {icon: 'doc', convertType:'doc'},
         'application/word': {icon: 'doc', convertType:'doc'},
         'application/x-msw6': {icon: 'doc', convertType:'doc'},
         'application/x-msword': {icon: 'doc', convertType:'doc'},
         'application/x-msword-doc': {icon: 'doc', convertType:'doc'},
         //powerpoint pptx
         'application/vnd.openxmlformats-officedocument.presentationml.slideshow': {icon: 'odp', convertType:'pptx'},
         'application/vnd.openxmlformats-officedocument.presentationml.presentation': {icon: 'odp',convertType:'pptx'},
          //powerpoint ppt
         'application/ms-powerpoint': {icon: 'ppt', convertType:'ppt'},
         'application/mspowerpoint': {icon: 'ppt', convertType:'ppt'},
         'application/powerpoint': {icon: 'ppt', convertType:'ppt'},
         'application/ppt': {icon: 'ppt', convertType:'ppt'},
         'application/vnd-mspowerpoint': {icon: 'ppt', convertType:'ppt'},
         'application/vnd_ms-powerpoint': {icon: 'ppt', convertType:'ppt'},
         'application/x-mspowerpoint': {icon: 'ppt', convertType:'ppt'},
         'application/x-powerpoint': {icon: 'ppt', convertType:'ppt'},
         'application/vnd.ms-powerpoint': {icon: 'ppt', convertType:'ppt'},
         //excel xls
         'application/vndms-excel': {icon: 'xls', convertType:'xls'},
         'application/excel': {icon: 'xls', convertType:'xls'},
         'application/msexcel': {icon: 'xls', convertType:'xls'},
         'application/msexcell': {icon: 'xls', convertType:'xls'},
         'application/x-dos_ms_excel': {icon: 'xls', convertType:'xls'},
         'application/x-excel': {icon: 'xls', convertType:'xls'},
         'application/x-ms-excel': {icon: 'xls', convertType:'xls'},
         'application/x-msexcel': {icon: 'xls', convertType:'xls'},
         'application/x-xls': {icon: 'xls', convertType:'xls'},
         'application/xls': {icon: 'xls', convertType:'xls'},
         //excel xlsx
         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {icon: 'xls', convertType:'xlsx'}},
     
    
    getMimeTypesByExtensions: function (fileExtensions)
    {
        var ret = [];
        
        for ( var i = fileExtensions.length - 1;(i >= 0); --i)
        {
          ret.push(this.mimeTypesMap[fileExtensions[i]][0]);
        }
        
        return ret;
    },
    
    getMimeTypesByAllExtensions: function (fileExtensions)
    {
        var ret = [];
        
        for ( var i = fileExtensions.length - 1;(i >= 0); --i)
        {
           for (var ii = this.mimeTypesMap[fileExtensions[i]].length -1;(ii >= 0); --ii)
           {
              ret.push(this.mimeTypesMap[fileExtensions[i]][ii]); 
           }
        }
        return ret;
    },
    
    /**
     * devuelve el tipo mime real no el alias
     * 
     * @param {string}: mimeType
     * 
     *  @return {string}: false 
     */
    findRealMimeType: function(mimeType)
    {
        var ret = false
        , keys = [];
        
        if (mimeType && (mimeType.length > 0))
        {
            mimeType = mimeType.toLowerCase(); 
            
            for (var k in this.mimeTypesMap)
            {
                keys.push(k);
            }
        
            for ( var i = keys.length - 1;(!ret &&  (i > 0)); --i)
            {
                ret =  this.isFileType(mimeType, this.mimeTypesMap[keys[i]]); 
          
                if (ret)
                {
                    ret = this.mimeTypesMap[keys[i]][0];
                }  
            }   
        }
        return (!ret)?'':ret;
    },
    
    findExtensionByMimeType: function (mimeType) 
    {
        var realMimeType = this.findRealMimeType(mimeType)
        , keys = []
        , ret = false;
        
        if (realMimeType && (realMimeType.length > 0))
        {
            for (var k in this.mimeTypesMap)
            {
                keys.push(k);
            }
            
            for ( var i = keys.length - 1;(!ret &&  (i > 0)); --i)
            {
                ret =  (this.mimeTypesMap[keys[i]][0] === realMimeType); 
                if (ret)
                {
                    ret = keys[i];
                }  
            } 
        }
        
        return ret;
    },

    findRealMimeTypeByFileName: function(fileName)
    {
        var ret = ''
        , extension;
        if (fileName.length > 0)
        {
          extension = fileName.split('.').pop(); 
          if (extension && (extension.length > 0))
          {
             extension = extension.toLowerCase();
             ret = this.mimeTypesMap[extension]?this.mimeTypesMap[extension][0]: '';
          }
        }
        
        return ret;
    },
    
    isFileType: function(fileType, mimeTypes)
    {
       return (mimeTypes.indexOf(fileType) >= 0); 
    },
    
    isMimeVisorType:function (fileType)
    {
        return (this.isOfficeType(fileType) 
            || this.isPDFType(fileType) 
            || this.isSvgImageType(fileType) 
            || this.isOpenOfficeType(fileType)
            || this.is3DSTL(fileType)
            || this.isPsd(fileType)
            || this.isCompressedType(fileType)
            || this.isTextType(fileType));
    },

    isTextType: function(fileType)
    {
        return (this.isFileType(fileType, this.mimeTypesMap.txt));
    },
    
    isPDFType: function(fileType)
    {
        return (this.isFileType(fileType, this.mimeTypesMap.pdf));
    },
    
    isCompressedType: function(fileType)
    {
        return (this.isFileType(fileType, this.mimeTypesMap.zip.concat(
                                                this.mimeTypesMap.rar.concat(
                                                   this.mimeTypesMap.gz))));
    },
    
    isDxf: function(fileType)
    {
      return this.isFileType(fileType, this.mimeTypesMap.dxf);  
    },
    
    isDwg: function(fileType)
    {
      return this.isFileType(fileType, this.mimeTypesMap.dwg);  
    },
    
    isPsd: function(fileType)
    {
      return this.isFileType(fileType, this.mimeTypesMap.psd);  
    },
    
    isZip: function(fileType)
    {
      return this.isFileType(fileType, this.mimeTypesMap.zip);  
    },
    
    isRar: function(fileType)
    {
      return this.isFileType(fileType, this.mimeTypesMap.rar);  
    },
    
    
    isOpenOfficeType: function(fileType)
    {
        return (this.isFileType(fileType, ['application/vnd.oasis.opendocument.text',
                                           'application/vnd.oasis.opendocument.presentation',
                                           'application/vnd.oasis.opendocument.spreadsheet']));
    },
    
    isOfficeType: function(fileType)
    {
        
        return (this.isFileType(fileType, ['application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                           'application/msword',
                                            //powerpoint
                                           'application/vnd.ms-powerpoint',
                                           //'application/vnd.exemplification-officedocument.presentationml.presentation',
                                           'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                           //'application/mspowerpoint',
                                           //'application/powerpoint',
                                           'application/x-mspowerpoint',
                                            //excel
                                            'application/excel',
                                            'application/vnd.ms-excel'
                                           ]));
    },
    
    is3DSTL: function (fileType)
    {
        return (this.isFileType(fileType, this.mimeTypesMap.stl));
    },
    
    getInputConvertNameType: function (fileType)
    {
        return (this.mimeTypesAndExt[fileType])?this.mimeTypesAndExt[fileType].convertType: false;
    },
    
    getInputIconByNameType: function (fileType)
    {
        return (this.mimeTypesAndExt[fileType])?this.mimeTypesAndExt[fileType].icon: false;
    },
    
    
    isImageType: function(fileType)
    {
        return (this.isFileType(fileType, ['image/x-portable-bitmap',
                                'image/jpg',
                                'image/jpeg',
                                'image/pjpeg',
                                'image/jpe',
                                'image/svg+xml',
                                'image/vnd.djvu',
                                'image/x-xcf',
                                'image/jfif',
                                'image/gif',
                                'image/jp2',
                                'image/png',
                                'image/bmp',
                                'image/tiff',
                                'image/tif'])); 
    },
    isSvgImageType: function(fileType)
    {
        return (this.isFileType(fileType, ['image/svg+xml'])); 
    }
  };
  
  return arquematics;
  
}(arquematics || {}));/**
 * arquematics.loader
 * 
 * @author Javier Trigueros Martínez de los Huertos
 * 
 * Copyright (c) 2014
 * Licensed under the MIT license.
 * 
 * dependencias:
 * - 
 */

if (FileReader.prototype.readAsBinaryString === undefined) {
    FileReader.prototype.readAsBinaryString = function (fileData) {
        var binary = "";
        var pt = this;
        var reader = new FileReader();
        reader.onload = function (e) {
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            //pt.result  - readonly so assign content to another property
            pt.content = binary;
            pt.onload(); // thanks to @Denis comment
        };
        reader.readAsArrayBuffer(fileData);
    };
}

var arquematics = (function(arquematics, blobUtil, window) {

//readAsBinaryString polify
if (!FileReader.prototype.readAsBinaryString) {
    FileReader.prototype.readAsBinaryString = function (fileData) {
        var binary = "";
        var pt = this;
        var reader = new FileReader();      
        reader.onload = function (e) {
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            //pt.result  - readonly so assign binary
            pt.content = binary;
            $(pt).trigger('onload');
        };
        reader.readAsArrayBuffer(fileData);
    };
}

arquematics.loader = {
    
    getFileObject: function (url, gui, pass)
    {
            var d = $.Deferred()
             , data;
           
           $.ajax({
                url: url,
                type : 'GET',
                dataType : 'json'
            }).done(function(json) {

               data = arquematics.simpleCrypt.decryptBase64(pass, json.src);

               d.resolve({gui: gui,
                          blob: data});
            })
            .fail(function (){
                d.reject(); 
            });
           
           return d;
     },

    getFileObjectURL: function (url, gui, guiFile, pass)
    {
            var URL = window.URL || window.webkitURL
             , d = $.Deferred()
             , data;
           
           $.ajax({
                url: url,
                type : 'GET',
                dataType : 'json'
            }).done(function(json) {

               data = arquematics.simpleCrypt.decryptBase64(pass, json.src);

               d.resolve({ gui: gui,
                           guiFile: guiFile,
                           h:  json.h,
                           w:  json.w,
                           blob:  URL.createObjectURL(arquematics.codec.Base64.toBlob(data, json.type))});
            })
            .fail(function (){
                d.reject(); 
            });
           
           return d;
     },
    
    getBlob: function (arrayBuffer, documentType)
    {
            var d = $.Deferred();
             
            blobUtil.arrayBufferToBlob(arrayBuffer, documentType)
              .then(function (blob) {
                  d.resolve(blob);                  
           }); 
           return d;
     },
    getObjectURL: function (arrayBuffer, documentType)
    {
            var URL = window.URL || window.webkitURL
             , d = $.Deferred();
             
            blobUtil.arrayBufferToBlob(arrayBuffer, documentType)
              .then(function (blob) {
                  d.resolve(URL.createObjectURL(blob));                  
           }); 
           return d;
     },
     
    getObjectURLRAW: function (arrayBuffer, documentType)
    {
        var URL = window.URL || window.webkitURL
        , base64 = arquematics.codec.ArrayBuffer.toBase64String(arrayBuffer, documentType);
        return URL.createObjectURL(new Blob([base64], {type: documentType}));
     },
     
     getObjectURLFromRAWData: function (data, documentType)
     {
           var URL = window.URL || window.webkitURL
           , documentType = documentType || 'image/svg+xml;charset=utf-8';
           return URL.createObjectURL(new Blob([arquematics.codec.decodeData(data)], {type: documentType}));
      },
     
     getObjectURLFromDataURL: function (dataURL)
     {
            var URL = window.URL || window.webkitURL
             , d = $.Deferred();
             
            blobUtil.dataURLToBlob(dataURL)
               .then(function (blob){
                d.resolve(URL.createObjectURL(blob));    
            }); 
             
           return d;
      },
      //se usa el el lector de PDFs
      getUint8Array: function (arrayBuffer, documentType)
      {
        var d = $.Deferred();
            
            blobUtil.arrayBufferToBlob(arrayBuffer, documentType)
              .then(function (blob) {
                   blobUtil.blobToBase64String(blob)
                      .then(function (base64String) {
                                               
                   d.resolve(arquematics.codec.Base64.toBinary('data:' + documentType + ';base64,' + base64String, false));  
                   
                });
            });
            
        return d;
    },
    
    getBase64String: function (arrayBuffer, documentType)
    {
       var d = $.Deferred();
            
       blobUtil.arrayBufferToBlob(arrayBuffer, documentType)
        .then(function (blob) {
           blobUtil.blobToBase64String(blob)
            .then(function (base64String) {                       
               d.resolve(base64String);  
            });
      });
            
      return d;
   },
   //se usa en 3D  
   getBinaryString: function (arrayBuffer, documentType)
   {
            var d = $.Deferred();

            blobUtil.arrayBufferToBlob(arrayBuffer, documentType)
              .then(function (blob) {
                 var reader = new FileReader();
                 reader.onload = (function(e){
                     d.resolve(e.target.result); 
		  });
              //:note readAsBinaryString IE deprecated
              reader.readAsBinaryString(blob);
            });
      return d;
    }
  };
  
  return arquematics;
  
}(arquematics || {}, blobUtil, window));

(function(window, arquematics ) {
   
   arquematics.storage = (function () {
        /**
         * almacena datos en cookies
         * 
         * objStore implementa write, read, remove y hasItem
         * 
         * @returns {objStore}
         */
        function getTypeCookie()
        {
            return  {
          
                parseCookieValue: function(s) {
                    if (s.indexOf('"') === 0) {
			         // This is a quoted cookie as according to RFC2068, unescape...
			         s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                    }

                    try {
                        var pluses = /\+/g;
                        // Replace server-side written pluses with spaces.
                        // If we can't decode the cookie, ignore it, it's unusable.
                        // If we can't parse the cookie, ignore it, it's unusable.
                        return decodeURIComponent(s.replace(pluses, ' '));
                    } catch(e) {}
                },
        
           
                write: function(key, value, hasExpire)
                {
                    hasExpire = hasExpire || false;
                 
                    if (hasExpire)
                    {
                        var t = new Date();
                        t.setTime(t - 1  * 864e+5);
                    }
                                    
                    return (document.cookie = [
                                encodeURIComponent(key), '=', value,
				hasExpire ? '; expires=' + t.toUTCString() : '; expires=Fri, 31 Dec 9999 23:59:59 GMT', // use expires attribute, max-age is not supported by IE
				'; path=/',
				'; domain=' + document.domain
			].join(''));
                },
        
                read: function(key)
                {
                 
                    var result = key ? undefined : {};

                    // To prevent the for loop in the first place assign an empty array
                    // in case there are no cookies at all. Also prevents odd result when
                    // calling $.cookie().
                    var cookies = document.cookie ? document.cookie.split('; ') : [];

                
                    for (var i = 0, l = cookies.length; i < l; i++)
                    {
			             var parts = cookies[i].split('='),
                            name = decodeURIComponent(parts.shift()),
                            cookie = parts.join('=');

			             if (key && key === name)
                         {
				            // If second argument (value) is a function it's a converter...
                                result = this.parseCookieValue(cookie);
				            break;
			             }

			             // Prevent storing a cookie that we couldn't decode.
			             if (!key)
                        {
                            cookie = this.parseCookieValue(cookie);
                            if  (cookie !== undefined) {
				                result[name] = cookie;
                            }
			             }
                    }

                    return result;
                },
                remove: function (key) {
                    if (this.read(key) === undefined) {
			return false;
                    }

                    // Must not alter options, thus extending a fresh object...
                    this.write(key, '', true);
                    return !this.read(key);
                },
        
                hasItem: function(sKey) {
                    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
                }
            };
        }
        /**
         * almacena datos en window.localStorage
         * 
         * objStore implementa write, read, remove y hasItem
         * 
         * @returns {objStore}
         */
        function getTypeLocal()
        {
            return {

                write: function(key, value)
                {
                    return window.localStorage.setItem(key, value);
                },
                read: function(key)
                {
                    return window.localStorage.getItem(key);
                },
                remove: function (key) {
                    window.localStorage.removeItem(key);
                },
                hasItem: function(key) 
                {
                    return (this.read(key) !== null);
                }
            };
        }
        
        var instance;
        return {
            
            /**
             * devuelve un singleton de objStore según 
             * las capacidades del navegador
             * 
             * @returns {objStore}
             */
            getInstance: function () {
                if (!instance) {
                    if (window.localStorage && window.localStorage !== null)
                    {
                        instance = getTypeLocal();
                    }
                    else
                    {
                       instance = getTypeCookie();     
                    }
                }

                return instance;
            }
        };
      
    })();

   /**
    * singleton de objStore 
    */
    arquematics.store = arquematics.storage.getInstance();
    
})(window, arquematics);/**
 * Arquematics Utils. Utilidades varias
 * 
 * @author Javier Trigueros Martínez de los Huertos
 * 
 * Copyright (c) 2014
 * Licensed under the MIT license.
 * 
 * dependencias:
 * - arquematics.store
 * - arquematics.crypt
 * - arquematics.codec
 * 
 * - sjcl: libreria sjc
 * 
 * 
 * @param {object} sjcl :
 * @param {object} arquematics :
 */
(function(sjcl, arquematics) {

arquematics.utils = {
    initEncrypt: function(plainDataPublicPrivKey, publicEncKeys)
    {
        arquematics.crypt = new arquematics.ecc();
        arquematics.crypt.setData(plainDataPublicPrivKey); 
        arquematics.crypt.setPublicEncKeys(publicEncKeys);
    },
   
   /**
    * guarda un objeto iStoreObject que implementa .getData() .setData
    * 
    * @param {String} cookieId
    * @param {object} iStoreObject
    * @param {String} [storeKey] : si no se introduce, no encripta los
    *                              datos con un pass
    * 
    * @returns {String} : cookie
    */
   store: function(cookieId,  iStoreObject, storeKey) 
   {
       if (!storeKey)
       {
          return arquematics.store.write(cookieId, arquematics.codec.HEX.encode(iStoreObject.getData()));     
       }
       else
       {
         var dataHexEncode = arquematics.simpleCrypt.encryptHex(storeKey, iStoreObject.getData());
         return arquematics.store.write(cookieId, dataHexEncode);     
       }
   },
  
   read: function(cookieId, objName, storeKey) 
   {
      
       var ret = arquematics.store.hasItem(cookieId);
       if (ret)
       {
            var encryptedDataHex = arquematics.store.read(cookieId);

            var   plainData = (!storeKey)?
                                arquematics.codec.HEX.toString(encryptedDataHex):
                                arquematics.simpleCrypt.decryptHex(storeKey, encryptedDataHex);
                     
            if (objName === 'arquematics.ecc')
            {
                 ret = new arquematics.ecc();
                 ret.setData(plainData); 
            }
            else
            {
                throw new Error("Missing Obj Type: " + objName);      
            }
             
       }
       return ret;
    },
    wordwrap: function(str, width) {
        width = width || 64;
        if (!str)
            return str;
        var regex = '(.{1,' + width + '})( +|$\n?)|(.{1,' + width + '})';
        return str.match(RegExp(regex, 'g'));
    },
            
    readKeyForUser: function (iStoreObject, plainText)
    {
           var dataHex = arquematics.codec.HEX.encode(iStoreObject.getData()),
               key = this.wordwrap(dataHex),
               plainText = plainText || false;
          
           key.unshift('-----BEGIN KEY-----');
           key.push('-----END KEY-----');
           
           return (plainText)?
                        key.join('\n'):
                        key.join('<br />');
                                
    },
    storeKeyForUser: function (userId, dataKey)
    {
        var dataHexEncode =  dataKey.toUpperCase()
                    .replace(/(\r\n|\n|\r)/gm,'')
                    .replace(/-/g,'')
                    .replace(/BEGIN KEY/,'')
                    .replace(/END KEY/,'')
                    .replace(/^[A-F0-9]$/gm,'')
                    .replace(/\s+/g,'');
        return arquematics.store.write(userId, dataHexEncode); 
    },
    _randomKey: function(nChars, chars) 
    {
        nChars = nChars || 64; 

        var length = nChars
        , ret = ''
        , rand;
        
        for (var i = length; i > 0; --i){
                rand = sjcl.random.randomWords(1, 10);
                rand = rand[0];
                
                if(rand < 0){
                   rand = rand * (-1);
                }
                rand = "0."+rand;
                rand = parseFloat(rand);
                ret += chars[Math.round(rand * (chars.length - 1))];
        }
        return ret;
    },

   /**
    * Algoritmo criptografico http://en.wikipedia.org/wiki/SHA-1
    * SHA-1 
    * @param {string} message
    * @returns {string hex} hex string. 
    */
   sha1: function(message)
   {
      var bitArray = sjcl.hash.sha1.hash(message);  
      return sjcl.codec.hex.fromBits(bitArray);    
   },    
   /**
    * Algoritmo criptografico http://en.wikipedia.org/wiki/SHA-2
    * SHA-2 SHA-256 
    * 
    * @param {string} message
    * @returns {string hex} hex string. 
    */
   sha256: function(message)
   {
      var bitArray = sjcl.hash.sha256.hash(message);  
      return sjcl.codec.hex.fromBits(bitArray);   
   },
   /**
    * Quita la extensión del archivo
    * 
    * @param {string} filename
    * @returns {String}
    */
   removeExtension: function(filename)
   {
          return filename.split(".").slice(0,-1).join(".") || filename + "";
   },
   
   getFileExtension: function(filename)
   {
        return filename.split('.').pop();
   },
        
   encryptDataAndSend: function (data, callback, fieldEncrypt, fieldHash )
   {
       var fieldEnc = fieldEncrypt || false,
           fieldH   = fieldHash || false,
           textToEncode = '',
           formData = '';
       
       if (fieldEnc && fieldH)
       {
           for (var key in data)
           {
               if ((key !== fieldEnc)
                || (fieldH && (key !== fieldH)))
                {
                  formData += '&' + key + '=' + data[key];  
                }
           }
            
           textToEncode = data[fieldEnc];
         
           formData += '&' + fieldH + '=' + arquematics.utils.sha256(textToEncode);
        }
        else 
        {
           for (var key in data)
           {
               if (key !== fieldEnc)
               {
                  formData += '&' + key + '=' + data[key];  
               }
               
           }

           textToEncode = data[fieldEnc];
        }

        arquematics.crypt.encryptAsynMultipleKeys(textToEncode,
            function (textEncode)
            {
                textEncode = textEncode
                        .replace(/\"$/, '')
                        .replace(/^\"/, '')
                        .replace(/\\/g, '')
                        .replace(/\s+/g, '');
                
                formData += '&' + fieldEnc + '=' + textEncode;
                
                if (callback && typeof(callback) === "function")
                {
                   callback(formData);     
                }
            }
        );
    },
    
   encryptForm: function ($form, $fieldEnc)
   {
        var  d = $.Deferred() 
        , formData = ''
        ,  formDataArr = $form.find('input, select, textarea').serializeArray()
        ,  textToEncode;
        
        for (var i = 0, count = formDataArr.length; i < count; i++)
        {
            if (formDataArr[i].name !== $fieldEnc.attr("name"))
            {
                formData += '&' + formDataArr[i].name + '=' + formDataArr[i].value.replace(/^\s+|\s+$/gm,'');        
            }
        }
        
        textToEncode = $fieldEnc.val().replace(/^\s+|\s+$/gm,'');
        arquematics.crypt.encryptAsynMultipleKeys(textToEncode,
            function (textEncode)
            {
                textEncode= textEncode
                        .replace(/\"$/, '')
                        .replace(/^\"/, '')
                        .replace(/\\/g, '')
                        .replace(/\s+/g, '');
                
                formData += '&' + $fieldEnc.attr("name") + '=' + textEncode;       
                
                d.resolve(formData );
            }
        );
            
        return d;
   },
   
   encryptArrayAndSend: function (formDataArr, callback, $fieldEncrypt, $fieldHash )
   {
           ///^\s+|\s+$/gm como trim pero compatible js <1.8
        
    var $fieldEnc = $fieldEncrypt || false,
        $fieldH   = $fieldHash || false,
        textToEncode = '',
        formData = '',
        i = 0,
        count;

    if ($fieldEnc && $fieldHash)
    {
        
        for (i = 0, count = formDataArr.length; i < count; i++)
        {
            if ((formDataArr[i].name !== $fieldEnc.attr("name"))
                || ($fieldH && (formDataArr[i].name !== $fieldH.attr("name"))))
             {
                formData += '&' + formDataArr[i].name + '=' + formDataArr[i].value.replace(/^\s+|\s+$/gm,'');        
             }
        }
        
        textToEncode = $fieldEnc.val().replace(/^\s+|\s+$/gm,'');
         
        formData += '&' + $fieldH.attr("name") + '=' + arquematics.utils.sha256(textToEncode);
        
    }
    else 
    {
        for (i = 0, count = formDataArr.length; i < count; i++)
        {
            if (formDataArr[i].name !== $fieldEnc.attr("name"))
            {
                formData += '&' + formDataArr[i].name + '=' + formDataArr[i].value.replace(/^\s+|\s+$/gm,'');        
            }
        }

        textToEncode = $fieldEnc.val().replace(/^\s+|\s+$/gm,'');
    }
    
     arquematics.crypt.encryptAsynMultipleKeys(textToEncode,
            function (textEncode)
            {

                textEncode= textEncode
                        .replace(/\"$/, '')
                        .replace(/^\"/, '')
                        .replace(/\\/g, '')
                        .replace(/\s+/g, '');

                
                formData += '&' + $fieldEncrypt.attr("name") + '=' + textEncode;       
                
                if (callback && typeof(callback) === "function")
                {
                   callback(formData);     
                }
            }
     ); 
   },
   
   /**
    * encripta un formulario y llama a la funcion callBack
    * con los datos preparados para enviar
    * 
    * @param {jQuery from} $form
    * @param {function} callback : se llama con los datos ya preparados para enviar
    * @param {jQuery input} $fieldEncrypt : campo encriptado
    * @param {jQuery input} $fieldHash :campo en el que se mete un hash sha256 del contenido encriptado
    */        
   encryptFormAndSend: function ($form, callback, $fieldEncrypt, $fieldHash )
   {
       arquematics.utils.encryptArrayAndSend(
            $form.find('input, select, textarea').serializeArray()
            , callback, $fieldEncrypt, $fieldHash
        );
   },
   /**
    * 
    * @param {type} $form
    * @param {type} callback
    * @param {type} $fieldDataHash
    * @param {type} $fieldHash
    */ 
   prepareFormAndSend: function ($form, callback, $fieldDataHash, $fieldHash )
   {
    var $fieldData = $fieldDataHash || false,
        $fieldH   = $fieldHash || false,
        textToEncode = '',
        formData = '';

    if ($fieldData && $fieldHash)
    {
        var formDataArr = $form.find('input, select, textarea').serializeArray();
         
        for (var i = 0, count = formDataArr.length; i < count; i++)
        {
           if (formDataArr[i].name !== $fieldH.attr("name"))
           {
                formData += '&' + formDataArr[i].name + '=' + formDataArr[i].value.replace(/^\s+|\s+$/gm,'');        
           }
        }
         
        textToEncode = $fieldData.val().replace(/^\s+|\s+$/gm,'');
         
        formData += '&' + $fieldH.attr("name") + '=' + arquematics.utils.sha256(textToEncode);
        
    }
    else 
    {
       formData = $form.find('input, select, textarea').serialize();
    }
    
    if (callback && typeof(callback) === "function")
    {
        callback(formData);     
    }
    
   },
    
   /**
    * devuelve una cadena aleatoria de texto nChars caracteres
    * 
    * @param {String} nChars :  por defecto son 64 caracteres
    * @return {String}
    */
    randomKeyString: function(nChars)
    {
        return this._randomKey(nChars, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    },
     /**
     * devuelve una cadena aleatoria hexadecimal de texto de 
     * nChars caracteres
     * 
     * @param {String} nChars :  por defecto son 64 caracteres
     * @return {String}
     */
    randomKeyHexString: function(nChars)
    {
        return this._randomKey(nChars, '012345678abcdef');
    },
   
    /**
     * devuelve el valor de un parametro en una url
     * 
     * @param {string} url : nombre del parametro
     * @param {string} paramName :
     * @returns {string}
     */
    getParamFromUrl: function (url, paramName)
    {
       return decodeURIComponent((new RegExp('[?|&]' + paramName + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null;
    },
    /**
     * devuelve el valor de un parametro en la url actual
     * 
     * @param {string} paramName : nombre del parametro
     * @returns {string}
     */
    getParamUrl: function(paramName) {
        return arquematics.utils.getParamFromUrl(location.search, paramName);
    },
            
    /**
     * devuelve un objeto con los parametros de la URL
     * 
     * @param {string} url
     * @returns {
     *  return {
     *      protocol: parser.protocol,
     *       host: parser.host,
     *       hostname: parser.hostname,
     *       port: parser.port,
     *       pathname: parser.pathname,
     *       search: parser.search,
     *       searchObject: searchObject,
     *       hash: parser.hash
     *   }
     * 
     */        
    parseURL: function(url) {
        var parser = document.createElement('a'),
            searchObject = {},
            queries, split, i;
        // Let the browser do the work
        parser.href = url;
        // Convert query string to object
        queries = parser.search.replace(/^\?/, '').split('&');
        for( i = 0; i < queries.length; i++ ) {
            split = queries[i].split('=');
            searchObject[split[0]] = split[1];
        }
        return {
            protocol: parser.protocol,
            host: parser.host,
            hostname: parser.hostname,
            port: parser.port,
            pathname: parser.pathname,
            search: parser.search,
            searchObject: searchObject,
            hash: parser.hash
        };
    },
            
    inArray: function(value, key, searchArr)
    {
               var ret = -1,
                   i = 0;
               if (searchArr.length > 0)
               {
                   for (i = 0; i < searchArr.length; i++) 
                   {
                      for (key in searchArr[i]) 
                      {
                          if (this[key] === value)
                          {
                            return i;      
                          }
                              
                      }
                       
                   }
               }
               return ret;
      },
      
      showSpin: function($spinIcon, $iconSave, $spinText)
      {
         var cIndex    = 0,
             cXpos     = 0,
             FPS = Math.round(100/9),
             SECONDS_BETWEEN_FRAMES = 1 / FPS;
     
         $iconSave.hide();
         $spinIcon.show();
         $spinText.css('color','#FFF');
         
         function startAnimation()
         {
            setInterval(function() {
          
           //24 pixels por frame
            cXpos += 24;
		
            cIndex += 1;
            //total frames 18
            if (cIndex >= 18) 
            {
                cXpos =0;
		cIndex=0;
            }
				
            $spinIcon.css('backgroundPosition', - cXpos +'px 0');
            
            }, SECONDS_BETWEEN_FRAMES*1000); 
         }
         
         startAnimation();
      }
};

}(sjcl, arquematics));
(function( sjcl, arquematics) {

var elg = loadECCAPI('elGamal'),
    dsa = loadECCAPI('ecdsa'),
    sha256 = loadHashAPI('sha256');

arquematics.ecc = function() {
        if(!(this instanceof arquematics.ecc))
        {
           throw new arquematis.exception.invalid("arquematics.ecc:Constructor called as a function");
        }
        
        //claves publica, privada, ver y sing como string hex
        this.keys = false;
        this.encryptKeys = false;
        this.cache = {enc: {}, dec: {}, sig: {}, ver: {}};
    };

arquematics.ecc.prototype = {
 /**
 * genera las claves para codificar/decodificar verificar/firmar
 * 
 * @param {curve} curve : opciones de configuración
 * 
 *                  curve = 192 | 224 | 256 |384 
 *                  
 *                  Solo 192 es estable en moviles y
 *                  dispositivos con pocos recursos.
 *                  Si el programa va a correr en Firefox o Chrome,
 *                  el mejor modo es 384.
 *                  
 *                  * Comparación equivalencias fortaleza de claves 
 *                  en los diferentes algorítmos:
 *                  
 *                   ECC    | RSA      | AES
 *                   192    | 1024     | -
 *                   224    | 2048     | -
 *                   256    | 3072     | 128
 *                   384    | 7680     | 192
 *                   521    | 15360    | 256
 * 
 * @returns {obj}
 */
 generate: function(curve) {
  
  var keysGeneral, keysSig; 
  
  this.curve = curve || 192;

  keysGeneral = elg.generate(this.curve);
  keysSig = dsa.generate(this.curve);
  
  this.keys = {
      pub: exportPublic(keysGeneral.pub),
      sec: exportSecret(keysGeneral.sec),
      ver: exportPublic(keysSig.pub),
      sig: exportSecret(keysSig.sec)
  };
  
  return this.keys;
},
        
/**
 * Codifica la cadena content de forma asincrona 
 * para las claves publicas encryptKeys y 
 * llama a la funcion callback cuando termina.
 * 
 * @param {string} content
 * @param {function} callback (dataString) : dataString tiene el contenico codificado para enviar
 * @param {array} encryptKeys : por defecto las claves publicas ya cargadas
 * @param {int} itemsTo : número de elementos a procesar por iteration
 */
encryptAsynMultipleKeys: function (content,  callback,  encryptKeys, itemsTo)
{
    var that = this,
        contentArr = [],
        encKeys = encryptKeys || this.encryptKeys,
        itemsToProcess = itemsTo || 15; // por defecto
    
    function performTask(processItem) {
        var pos = 0;
        
        function iteration() {
            var j = Math.min(pos + itemsToProcess, encKeys.length);
          
            for (var i = pos; i < j; i++) {
                processItem(content, encKeys, i);
            }
            pos += itemsToProcess;
            // continua si tenemos más que procesar
            if (pos < encKeys.length)
            {
              setTimeout(iteration, 20); // Wait 20 ms      
            }
            else if (callback && typeof(callback) === "function")
            {
               callback(JSON.stringify(contentArr));    
            }
        }
        iteration();
     }
     
     performTask(
         function processItem(content, encKeys, i)
          {
            var encrypted = that.encrypt(content, encKeys[i].public_key),
                dataHexString = arquematics.codec.HEX.encode(JSON.stringify(encrypted));
          
            contentArr.push({id: encKeys[i].id,
                             data: dataHexString});
          } 
     );
     
},

/**
 * Codifica el mismo contenido varias veces
 * con diferentes claves publicas y las devuelve en un array.
 * 
 * Por los problemas con la codificación JSON en los
 * diferentes navegadores lo que hago es convertir 
 * stringJSON -> hexString. 
 * 
 * :TODO: Mirarlo un poco mejor, no estoy nada convencido.
 * 
 * @param {String} content
 * @param {array} encKeys  : lista de claves publicas 
 *                                [{id:UsuarioId1, publickey:valor1},{id:UsuarioId2, publickey:valor2} ]
 *                                
 * @returns {String JSON} : [{id:UsuarioId1, data: stringToHex},{id:UsuarioId2, data: stringToHex}]
 */
encryptMultipleKeys: function(content, encKeys)
{
    var contentArr = []
    , encryptKeys = encKeys || this.encryptKeys ;
    if ((typeof encryptKeys !=='undefined')
            && encryptKeys
            && (typeof content !=='undefined') 
            && (encryptKeys.length > 0)
            && (content.length > 0))
    {
            var encrypted = {};
            var dataHexString = '';
        
            for (var i = 0, count = encryptKeys.length; i < count; i++)
            {
                encrypted = this.encrypt(content, encryptKeys[i].public_key);
                dataHexString = arquematics.codec.HEX.encode(JSON.stringify(encrypted));
                contentArr.push({id: encryptKeys[i].id,
                             data: dataHexString});
            }
    }
            
    return JSON.stringify(contentArr);
},
 /**
  * Codifica texto plano
  * 
  * @param {string} plaintext : texto a codificar
  * @param {string} enckey : clave pública que usamos para codificar.
  *                           Si no especificamos, es la creada con
  *                           generate.
  * @returns {obj}
  */      
 encrypt: function(plaintext, enckey) {
  
  enckey = enckey || this.keys.pub;
  
  var kem = this.cache.enc[enckey]; 
  
  if (!kem)
  {
    //javier: cachear kem debilita el algoritmo, pero mejora el rendimiento
    //yo que se... prefiero rendimiento.
    kem = this.cache.enc[enckey] = elg.importPublicHex(enckey,this.curve).kem();
    kem.tagHex = sjcl.codec.hex.fromBits(kem.tag);
  }
  
  var obj = sjcl.encrypt(kem.key,plaintext);
  
  obj.tag = kem.tagHex;
  return obj;
},



/**
 * Decodifica un objeto clipher con la clave privada
 * 
 * @param {obj} clipherObj
 * @param {String} deckey : clave privada, por defecto la generada
 * @returns {String} : texto plano
 */
decrypt: function(clipherObj, deckey) {
  deckey = deckey || this.keys.sec;

  var kem = this.cache.dec[deckey];
  
  if (!kem)
  {
    kem = this.cache.dec[deckey] = elg.importSecretHex(deckey,this.curve);
    kem.$keys = {};
  }

  var key = kem.$keys[clipherObj.tag];
  
  if(!key)
    key = kem.$keys[clipherObj.tag] = kem.unkem(sjcl.codec.hex.toBits(clipherObj.tag));
  
  return sjcl.decrypt(key, clipherObj);
  
},
/**
 * Decodifica a texto plano un string de caracteres hexadecimales
 * 
 * @param {String} ciphertextHexString : string de caracteres hexadecimales
 * @param {String} deckey : clave privada, por defecto la generada
 * @returns {String} string en texto plano
 */
decryptHexToString: function(ciphertextHexString, deckey) {
    var ciphertext = arquematics.codec.HEX.toString(ciphertextHexString);
    return this.decrypt(JSON.parse(ciphertext), deckey);
},
        
/**
 * 
 * @param {String} text : texto plano
 * @param {String} sigkey : clave privada, por defecto la generada
 * @param {String} hash : por defecto hace sha256.hash del texto si no se indica
 * 
 * @return {obj}
 */
sign: function(text, sigkey, hash) {
  sigkey = sigkey || this.keys.sig;

  var key = this.cache.sig[sigkey];
  if(!key)
    key = this.cache.sig[sigkey] = dsa.importSecretHex(sigkey, this.curve);

  //hash first
  if(hash !== false)
    text = sha256.hash(text);

  return key.sign(text);
},

/**
 * @param {String} signature : 
 * @param {String} text : texto plano
 * @param {String} verkey : clave publica, por defecto la generada
 * @param {String} hash : por defecto hace sha256.hash del texto si no se indica
 * 
 * @return {Boolean}
 */
verify: function(signature, text, verkey, hash) {
  verkey = verkey || this.keys.ver;
  var key = this.cache.ver[verkey];
  if(!key)
    key = this.cache.ver[verkey] = dsa.importPublicHex(verkey, this.curve);

  if(hash !== false)
    text = sha256.hash(text);

  try {
    return key.verify(text, signature);
  } catch(e) {
    return false;
  }
},
        
getPublicKey: function()
{
   return this.keys.pub;  
},

getPrivatekey: function()
{
    return this.keys.sec;
},

getVerifykey: function()
{
    return this.keys.ver;
},

getSigkey: function()
{
    return this.keys.sig;
},

/**
 * 
 * Array con las claves publicas en las que se
 * encriptará el contenido en la funcion encryptMultipleKeys
 */       
getPublicEncKeys: function()
{
    return this.encryptKeys;
},
/**
 * 
 * @param {array} value
 */
setPublicEncKeys: function(value)
{
   this.encryptKeys = value; 
},

getData: function ()
{
    return this.curve + '|' + this.keys.pub + '|' + this.keys.sec + '|' + this.keys.ver + '|' + this.keys.sig;
},

setData: function (dataStr)
{
    var keyStrArr = dataStr.split("|");
    
    if (this.isArray(keyStrArr) && (keyStrArr.length >= 4))
    {
        this.curve = parseInt(keyStrArr[0]);
        
        this.keys = {
           pub: keyStrArr[1],
           sec: keyStrArr[2],
           ver: keyStrArr[3],
           sig: keyStrArr[4]
        };     
    }
    else
    {
      throw new Error("Error setData: " + objName);      
    }
   
},
isArray: function (value)
{
  return Object.prototype.toString.call(value) === '[object Array]';
}
};

arquematics.simpleCrypt = {
    /**
    * Decodifica texto -> JSON -> AES-CCM-256
    * y devuelve el texto plano
    *
    * @param {String} passKey  : clave
    * @param {String} encryptedData  : texto JSON codificado
    * 
    * @return {String} : texto plano
    */
    decrypt: function (passKey, encryptedData)
    {
        if ( !encryptedData || encryptedData.length === 0) {
          return encryptedData;
        }
        
        return sjcl.decrypt(passKey, JSON.parse(encryptedData));
    },

    /**
    * Decodifica un objeto AES-CCM-256 
    *
    * @param {String} passKey  : clave
    * @param {object} object  : object
    * 
    * @return {obj} : objeto decodificado
    */
    decryptObj: function (passKey, object)
    {
      for (var k in object){
        if (object.hasOwnProperty(k)) {
            object[k] = arquematics.simpleCrypt.decryptHex(passKey, object[k]);
        }
      }

      return object;
    },

    /**
    * Decodifica texto Hexadecimal -> JSON -> AES-CCM-256
    * y devuelve el texto plano
    *
    * @param {String} passKey  : clave
    * @param {String} dataHex  : texto Plano
    */
    decryptHex: function (passKey, dataHex)
    {
        if ( !dataHex || dataHex.length === 0) {
          return dataHex;
        }
        //console.log(dataHex);
        
        //console.log(arquematics.codec.HEX.toString(dataHex).trim());
        var encryptedObj = JSON.parse(arquematics.codec.HEX.toString(dataHex));
        //console.log(encryptedObj);
        //var encryptedObj = JSON.parse(sjcl.codec.utf8String.fromBits(sjcl.codec.hex.toBits(dataHex)));

        return sjcl.decrypt(passKey, encryptedObj);
    },

    decryptBase64: function (passKey, dataBase64)
    {
        if ( !dataBase64 || dataBase64.length === 0) {
          return dataBase64;
        }
       
        return sjcl.decrypt(passKey, JSON.parse(arquematics.codec.Base64.toString(dataBase64)));
    },

            
    /**
    * Encripta un texto como AES-CCM-256 y devuelve el texto 
    * JSON cofificado como una cadena Hexadecimal. 
    *
    * @param {array} passKey   : clave
    * @param {array} plainText  : texto Plano
    * 
    * @return {String} : cadena Json codificada 
    */
    encryptHex: function (passKey, plainText)
    {
        var salt = sjcl.codec.hex.fromBits(sjcl.random.randomWords('10','0')),
            encryptedText = JSON.stringify(sjcl.encrypt(passKey, plainText,{count:2048,salt:salt,ks:256}));
    
        return arquematics.codec.HEX.encode(encryptedText);
    },

    encryptBase64: function (passKey, plainText)
    {
        var salt = sjcl.codec.hex.fromBits(sjcl.random.randomWords('10','0'))
        , encryptedText = JSON.stringify(sjcl.encrypt(passKey, plainText,{count:2048,salt:salt,ks:256}));
    
        return arquematics.codec.Base64.encode(encryptedText);
    },


    
    /**
    * Encripta un texto como AES-CCM-256 y devuelve el texto 
    * JSON. 
    *
    * @param {String} passKey  : clave
    * @param {String} plainText  : texto Plano
    * 
    * @return {String} : cadena Json
    */
    encrypt: function (passKey, plainText)
    {
        var salt = sjcl.codec.hex.fromBits(sjcl.random.randomWords('10','0'));
        
        return JSON.stringify(sjcl.encrypt(passKey, plainText,{count:2048,salt:salt,ks:256}));
    },

    /**
    * Encripta un objeto como AES-CCM-256 
    *
    * @param {String} passKey  : clave
    * @param {object object  : object
    * 
    * @return {obj} : objeto encriptado
    */
    encryptObj: function (passKey, object)
    {
      for (var k in object){
        if (object.hasOwnProperty(k)) {
            object[k] = arquematics.simpleCrypt.encryptHex(passKey, object[k]);
        }
      }

      return object;
    }
    
};

/**
 * 
 * Utilidades funciones criptográficas
 * 
 **/


/**
 * esta cargada la librería, si lo esta lo devuelve
 * 
 * @param {String} algoName : sha256
 * 
 * @throws {arquematis.exception.notReady} description
 * @returns {sjcl.hash[elGamal | ecdsa | sha256]}
 */
function loadHashAPI(algoName) {
  var algo = sjcl.hash[algoName];
  if(!algo)
    throw new arquematis.exception.notReady("Missing hash algorithm: " + algoName);
  return {
    hash: function(input) {
      return algo.hash(input);
    }
  };
}
/**
 * @param {String} algoName : elGamal | ecdsa 
 * 
 * @returns {keys}
 */
function loadECCAPI(algoName) {
  var algo = sjcl.ecc[algoName];
  if(!algo)
    throw new Error("Missing ECC algorithm: " + algoName);
  return {
    generate: function(curve) {
      var keys = algo.generateKeys(curve, 1);
      keys.pub.$curve = curve;
      keys.sec.$curve = curve;
      return keys;
    },
    importPublicHex: function(keyStr, curve) {
      return new algo.publicKey(
              sjcl.ecc.curves['c'+ curve ],
              sjcl.codec.hex.toBits(keyStr));
    },
    importSecretHex: function(keyStr, curve) {
      return new algo.secretKey(
              sjcl.ecc.curves['c'+ curve ],
              new sjcl.bn(keyStr));
    }
  };
}


/**
 * 
 * @param {obj} keyObj
 * @returns {String}
 */
function exportPublic(keyObj) {
  var obj = keyObj.get();
  return sjcl.codec.hex.fromBits(obj.x) +
         sjcl.codec.hex.fromBits(obj.y);
}

function exportSecret(keyObj) {
  return sjcl.codec.hex.fromBits(keyObj.get());
}

}(sjcl, arquematics));
/*
SJCL whole buffer
// async test
var reader = new FileReader();
reader.readAsArrayBuffer(blob);
reader.addEventListener("loadend", function() {
  var arrayBuffer = reader.result;

  var bytes = new Uint8Array(arrayBuffer);
  var bits = sjcl.codec.bytes.toBits(bytes);
  var encrypted = sjcl.mode[cs.mode].encrypt(prp, bits, cs.iv, adata, cs.ts);
  var encryptedBase64 = sjcl.codec.base64.fromBits(encrypted);

  var decodedBits = sjcl.codec.base64.toBits(encryptedBase64);
  var decrypted = sjcl.mode[cs.mode].decrypt(prp, decodedBits, cs.iv, adata, cs.ts);
  var byteNumbers = sjcl.codec.bytes.fromBits(decrypted);
  var byteArray = new Uint8Array(byteNumbers);

  var blob2 = new Blob([byteArray], {
    type: "application/octet-stream"
  });
  deferred.resolve()
});


SJCL
// async test
var reader = new FileReader();
reader.readAsArrayBuffer(blob);
reader.addEventListener("loadend", function() {
  var arrayBuffer = reader.result;
  var encryptedBase64Slices = [];
  for (var offset = 0; offset < arrayBuffer.byteLength; offset += sliceSize) {
    var slice = arrayBuffer.slice(offset, offset + sliceSize);
    var byteSlice = new Uint8Array(slice);
    var bitsSlice = sjcl.codec.bytes.toBits(byteSlice);
    var encryptedSlice = sjcl.mode[cs.mode].encrypt(prp, bitsSlice, cs.iv, adata, cs.ts);
    var encryptedBase64Slice = sjcl.codec.base64.fromBits(encryptedSlice);
    encryptedBase64Slices.push(encryptedBase64Slice);
  }

  var byteArrays = [];
  for (var i = 0; i < encryptedBase64Slices.length; i++) {
    var sliceBits = sjcl.codec.base64.toBits(encryptedBase64Slices[i]);
    var decryptedSlice = sjcl.mode[cs.mode].decrypt(prp, sliceBits, cs.iv, adata, cs.ts);
    var byteNumbersSlice = sjcl.codec.bytes.fromBits(decryptedSlice);
    var byteArraySlice = new Uint8Array(byteNumbersSlice);
    byteArrays.push(byteArraySlice);
  }

  var blob2 = new Blob(byteArrays, {
    type: "application/octet-stream"
  });
  deferred.resolve()
});
/*
// Generate encryption keys 
var keys = ecc.generate(ecc.ENC_DEC);
console.log(keys);
// => { dec: "192e35a51dc....", enc: "192037..." }

// A secret message
var plaintext = "hello world!";

// Encrypt message
var cipher = ecc.encrypt(plaintext,keys.enc);
// => {"iv":[1547037338,-736472389,324... }

// Decrypt message
var result = ecc.decrypt(cipher, keys.dec);

console.log(result);*/