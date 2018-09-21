/**
 * @package: arquematicsPlugin
 * @version: 0.1
 * @Autor: Arquematics 2010 
 *         by Javier Trigueros Martínez de los Huertos
 *         
 */

importScripts('/bundles/wall/js/vendor/sjcl/sjcl.overwrite.js');
importScripts('/bundles/wall/js/vendor/deferred-js/build/deferred.min.js');
/*
 * base64-arraybuffer
 * Mirar https://github.com/niklasvh/base64-arraybuffer
 *
 */

//para la recoleccion de números aleatorios
//no tenemos el objeto window disponible
sjcl.random.stopCollectors();
sjcl.random.setDefaultParanoia(1);

(function( arquematics, sjcl, Deferred) {

arquematics = arquematics || {};

arquematics.codec = {
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
        /**
         * igual que la funcion atob pero mas robusta
         */
        toByteCharacters: function(b64Data)
        {
            function decodeBase64(s) {
                var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
                var A= arquematics.codec.Base64._keyStr;
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
            // private property
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    /**
    * public method for encodeing normal string to base64
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
     * @param {booleam} skipDataType
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
  }  
};

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

var elg = loadECCAPI('elGamal');

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
    * @param {array} encryptKeys  : lista de claves publicas 
    *                                [{id:UsuarioId1, publickey:valor1},{id:UsuarioId2, publickey:valor2} ]
    *                                
    * @returns {String JSON} : [{id:UsuarioId1, data: stringToHex},{id:UsuarioId2, data: stringToHex}]
    */
    encryptMultipleKeys: function(content, encryptKeys)
    {
        encryptKeys = encryptKeys || this.encryptKeys;
        
        var contentArr = [];
        
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
    encrypt: function(plaintext, enckey)
    {
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
    *  @returns {String} string en texto plano
    */
    decryptHexToString: function(ciphertextHexString, deckey) {
        var ciphertext = arquematics.codec.HEX.toString(ciphertextHexString);
        return this.decrypt(JSON.parse(ciphertext), deckey);
    },
       
    getPublicKey: function()
    {
        return this.keys.pub;  
    },

    getPrivatekey: function()
    {
        return this.keys.sec;
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
    
        //return sjcl.codec.hex.fromBits(sjcl.codec.utf8String.toBits(encryptedText))

        return arquematics.codec.HEX.encode(encryptedText);
    },
    
    decryptBase64: function (passKey, dataBase64)
    {
        if ( !dataBase64 || dataBase64.length === 0) {
          return dataBase64;
        }
       
        return sjcl.decrypt(passKey, JSON.parse(arquematics.codec.Base64.toString(dataBase64)));
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
    }
};

arquematics.utils = {
    
    initEncrypt: function(plainDataPublicPrivKey, publicEncKeys)
    {
        arquematics.crypt = new arquematics.ecc();
        arquematics.crypt.setData(plainDataPublicPrivKey); 
        arquematics.crypt.setPublicEncKeys(publicEncKeys);
    },
    
    encryptAsyn: function (textToEncode)
    {
        var d = new Deferred();
        
        arquematics.crypt.encryptAsynMultipleKeys(textToEncode,
            function (textEncode)
            {
                textEncode= textEncode
                        .replace(/\"$/, '')
                        .replace(/^\"/, '')
                        .replace(/\\/g, '')
                        .replace(/\s+/g, ''); 
                d.resolve(textEncode);
            }
        );
            
        return d.promise();
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
   /**
    * Devuelve la extension del archivo
    * 
    * @param {string} filename
    * @returns {string}
    */
   getFileExtension: function(filename)
   {
        return filename.split('.').pop();
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
   
   randomKeyString: function(nChars)
   {
        return this._randomKey(nChars, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
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
    }
};


arquematics.HTTP = {
        createXMLHttpRequest: function()
        {
            var xhr = false;
            if(typeof XMLHttpRequest !== 'undefined') 
            {
               xhr = new XMLHttpRequest();     
            }  
            else 
            {
		var versions = ["MSXML2.XmlHttp.5.0", 
			 	"MSXML2.XmlHttp.4.0",
			 	"MSXML2.XmlHttp.3.0", 
			 	"MSXML2.XmlHttp.2.0",
			 	"Microsoft.XmlHttp"];

		for(var i = 0, len = versions.length; i < len; i++) 
                {
                    try {
			xhr = new ActiveXObject(versions[i]);
			break;
                    }
		    catch(e){}  
                }
            } 
            
            return xhr;
        },
        
        doRequest: function (url, formData, responseType, method)
        {
            //"" | "text"  | "arraybuffer" | "blob" |  "json" (por defecto)
            responseType = responseType || 'json';
            // por defecto sin datos
            formData = formData || null;
            //metodos validos GET | POST | PUT | DELETE
            method = method || 'GET';
            
             var d = new Deferred()
            , xhr =  this.createXMLHttpRequest();
            
            xhr.onload = function(e) {
                if (this.status === 200) {
                   //force json respose
                   if ((responseType === 'json') 
                        && (typeof this.response === 'string'))
                   {
                      d.resolve(JSON.parse(this.response));  
                   }
                   else
                   {
                      d.resolve(this.response); 
                   }  
                }
                else
                {
                   d.reject();     
                }
            };
            
            xhr.open(method, url, true); //true asynchronous y puede poner el responseType
            if ('responseType' in xhr) {
                xhr.responseType = responseType;
            }
            
            xhr.send(formData);
            return d.promise();
        },
        
        doGet: function (url, formData, responseType)
        {
            return this.doRequest(url, formData, responseType, 'GET');
        },
        
        doDelete: function (url, formData, responseType)
        {
            return this.doRequest(url, formData, responseType, 'DELETE');
        },
        
        doPost: function (url, formData, responseType)
        {
            return this.doRequest(url, formData, responseType, 'POST');
        },
        
        doPut: function (url, formData, responseType)
        {
            return this.doRequest(url, formData, responseType, 'PUT');
        },
        
        doPutAjax: function (url, formData)
        {
          return  this.doPut(url, formData, 'json', 'PUT');  
        },
        
        doPostAjax: function (url, formData)
        {
          return  this.doPost(url, formData, 'json', 'POST');
        },
        
        doGetAjax: function (url)
        {
           return this.doGet(url, false, 'json', 'GET');
        }
};

}(arquematics, sjcl, Deferred));