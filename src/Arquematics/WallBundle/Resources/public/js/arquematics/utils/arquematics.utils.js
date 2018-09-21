/**
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