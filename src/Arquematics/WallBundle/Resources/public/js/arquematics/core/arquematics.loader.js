/**
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