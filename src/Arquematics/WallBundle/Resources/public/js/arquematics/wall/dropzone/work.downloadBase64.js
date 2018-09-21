 /**
 * @package: arquematicsPlugin
 * @version: 0.1
 * @Autor: Arquematics 2010 
 *         by Javier Trigueros Martínez de los Huertos
 *         
 */

var arquematics = {};

importScripts('/bundles/wall/js/arquematics/core/arquematics.core.micro.js');
importScripts('/bundles/wall/js/arquematics/core/arquematics.mime.js');

var dropzoneTaskDownload =  {
	
        getData: function (fileURL, pass)
        {
            var d = new Deferred()
            , that = this
            , loadFile = function(url, pass){
                  
                 Deferred.when(that._loadAndDecodeFullFile(url, pass))
                       .done(function (dataFile){
                         d.resolve(dataFile);    
                  })
                  .fail(function (){
                       d.reject(); 
                  });
            };
            
            self.postMessage({'cmd':'debug','fileURL': fileURL});
            
            loadFile(fileURL , pass);
            
            return d.promise();
        },
        
        _loadAndDecodeChunkData: function (fileURL, countParts, pass)
        {
            var d = new Deferred()
            , dataChunk = []
            //indice de posiciones empieza en 0
            , count = countParts -1;

            for (var i = 0, end = 0; (i <= count); i++)
            {
                Deferred.when(arquematics.HTTP.doGetAjax(fileURL + '/' + i))
                    .done(function (chunk)
                    {
                           chunk.chunk = (pass)? 
                                    arquematics.simpleCrypt.decryptBase64(pass , chunk.chunk)
                                    :chunk.chunk;
                           
                           dataChunk.push(chunk);
                           
                           end++;
                           if (end > count)
                           {
                               d.resolve(dataChunk);                
                           }     
                        
                    })
                    .fail(function (){
                       d.reject(); 
                    }); 
            }
            
            return d.promise();
        },
        
        _loadAndDecodeFullFile: function (url, pass, rawData)
        {
             var d = new Deferred()
            , that = this;
             
            function search(pos, myArray){
                
                for (var i=0; i < myArray.length; i++) 
                {
                    if (myArray[i].pos == pos) {
                        return myArray[i].chunk;
                    }
                }
                return false;
            }

            Deferred.when(arquematics.HTTP.doGetAjax(url))
                    .done(function (dataJSON){
                         //las partes  estan en la misma respuesta
                         if ((dataJSON.parts == 0) && 
                              dataJSON.chunks && (dataJSON.chunks.length > 0))
                         { 
                             var retOneGet = '';
                             for (var ii = 0; ii < dataJSON.chunks.length; ii++)
                             {
                                 retOneGet += (pass)? 
                                                arquematics.simpleCrypt.decryptBase64(pass ,  dataJSON.chunks[ii].chunkData)
                                                :dataJSON.chunks[ii].chunkData;
                             }
                              
                            d.resolve(retOneGet);
                         }
                         else if  (dataJSON.parts > 0)
                         { 
                               Deferred.when(that._loadAndDecodeChunkData(url, dataJSON.parts,pass)) 
                                .done(function (dataChunks){
              
                                  var ret = '';
                                     
                                   for (var ii = 0; ii < dataChunks.length; ii++)
                                   {
                                      ret += search(ii, dataChunks);
                                   }
                                  
                                   d.resolve(ret);
                                                          
                                });
                         }
                    })
                    .fail(function (){
                       d.reject(); 
                    });
             
            
            return d.promise();
        }
};


self.addEventListener('message', function(e) {
  var data;
  
  try{
    data = JSON.parse(e.data);  
  }
  catch(err) {
    data = e.data;    
  }
  
  switch (data.cmd) {
    case 'entropy':
        if (data.crypt)
        {
           sjcl.random.addEntropy(data.value, data.size, data.source);
        }
        self.fileURL = data.url;
        self.pass = data.pass;
        
        self.postMessage({ 'cmd': 'ready' });
        break;
    case 'start':
      Deferred.when(dropzoneTaskDownload.getData(self.fileURL, self.pass))
      .done(function (blobString){
           var blobItem = arquematics.codec.Base64.toArrayBuffer(blobString);
           self.postMessage(blobItem, [blobItem]);
      })
      .fail(function (){
          self.postMessage({'cmd':'err'}); 
      });
      break;
    case 'stop':
      self.postMessage({'cmd':'stop','text':'WORKER STOPPED:'});
      self.close(); 
      break;
  }
}, false);