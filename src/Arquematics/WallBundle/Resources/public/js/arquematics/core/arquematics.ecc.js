
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
/**
 * @returns {array}
 */
getUserFriends: function()
{
  var retFriends = [];
  for (var i = 0, len = this.encryptKeys.length; i < len; i++) 
  {
    retFriends.push(this.encryptKeys[i].id);
  }
  return retFriends;
},
/**
 * devuelve la id del usuario actual
 * @returns {id}
 */
getUserId: function()
{
  return this.encryptKeys[this.encryptKeys.length - 1].id; 
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