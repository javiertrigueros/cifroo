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
  
}(arquematics || {}));