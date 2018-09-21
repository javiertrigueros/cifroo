    /**
 * @package: arquematicsPlugin
 * @version: 0.1
 * @Autor: Arquematics 2010 
 *         by Javier Trigueros Martínez de los Huertos
 *         
 */

var arquematics = {};

importScripts('/bundles/wall/js/arquematics/core/arquematics.formdata.js');
importScripts('/bundles/wall/js/arquematics/core/arquematics.core.micro.js');
importScripts('/bundles/wall/js/arquematics/core/arquematics.mime.js');

arquematics.cloudConvert = function() {
        //conversiones entre ficheros
        this.conversionTypes = {
          //cad
          'dxf': 'png',
          'dwg': 'png',
          //
          'stl': 'png',
          //psd
          'psd': 'png',
         //Office
          'odt': 'pdf', //doc
          'ods': 'pdf', //xls
          'odp': 'pdf', //presentacion
         //word
          'docx': 'pdf',
          'doc':  'pdf',
         //powerpoint
          'ppt':  'pdf',
          'pptx': 'pdf',
          //excel
          'xls': 'pdf',
          'xlsx': 'pdf'
        };  
};

arquematics.cloudConvert.prototype = {
  getOutputFormatByExt: function (ext)
  {
     return (this.conversionTypes[ext])?this.conversionTypes[ext]: false;
  },  
  createProcess: function(inputformat, outputformat)
  {
    var d = new Deferred();

    Deferred.when(arquematics.HTTP.doGetAjax('/v1/filePreview/' + inputformat + '/' + outputformat))
        .done(function (dataJSON){
          d.resolve(dataJSON.url);
        })
        .fail(function (){  
            d.reject(); 
        });
        
    return d.promise();
  },
  start: function (processURL, file, outputformat)
  {
    var d = new Deferred()
    , form = new FormData();

    form.append('input', 'base64');
    form.append('file', file.src); // fileBase64String
    form.append('filename', file.name);
    form.append('outputformat', outputformat);
    form.append('wait', 'false');
    
    Deferred.when(arquematics.HTTP.doPostAjax('https:' + processURL, form))
        .done(function (process){
          d.resolve(process.url);   
        })
        .fail(function (){  
            d.reject(); 
        });

    return d.promise();
  },
  getStatus: function (url)
  {
    var d = new Deferred();

    Deferred.when(arquematics.HTTP.doGetAjax('https:' + url))
        .done(function (dataJSON){
          if (dataJSON.step && ((dataJSON.step == 'finished') || (dataJSON.step == 'output')))
          {
            d.resolve(dataJSON);
          }
          else
          {
            d.reject(dataJSON); 
          }
            
        })
        .fail(function (){  
            d.reject(false); 
        });

    return d.promise();
  }

};


var dropzoneTaskUpload =  {
        getCloudConvertPreview: function(file)
        {
          
          var d = new Deferred()
          , conversionTool = new arquematics.cloudConvert()
          
          //tipo de extension del archivo
          , inputFormat = arquematics.mime.getInputConvertNameType(file.type)
          , outputformat = conversionTool.getOutputFormatByExt(inputFormat);
          
          Deferred.when(conversionTool.createProcess(inputFormat, outputformat))
           .done(function (process){
           
               Deferred.when(conversionTool.start(process, file, outputformat))
                .done(function (processUrl){
                
                     Deferred.when(conversionTool.getStatus(processUrl + '?wait'))
                    .done(function (dataJSON){
                         Deferred.when(arquematics.HTTP.doGet('https:' + dataJSON.output.url, null, 'arraybuffer'))
                         .done(function (arraybuffer){
                            //borra el proceso y el archivo
                            Deferred.when(arquematics.HTTP.doDelete('https:' + processUrl))
                            .done(function (respose){
                             
                            })
                            .fail(function (){
                          
                            });
                             
                            d.resolve(arquematics.codec.ArrayBuffer.toBase64String(arraybuffer));
                          })
                         .fail(function (){
                            d.reject(); 
                          });  
                    })
                    .fail(function (){
                        d.reject(); 
                    });    
              })
              .fail(function (){
                d.reject(); 
              });
                  
      
           })
           .fail(function (){
                d.reject(); 
            });

          return d.promise();
        },
   
        prepareFormDataChunkPreview: function (data, postIndex, pass, options)
        {
            var form = new FormData();

            form.append('ar_drop_file_chunk_preview[_csrf_token]', options.csrfTokenChunkPreview );
            form.append('ar_drop_file_chunk_preview[chunkData]', arquematics.simpleCrypt.encryptBase64(pass , data));
            form.append('ar_drop_file_chunk_preview[pos]', postIndex);
            
            return form;
        },
        
        parseFile: function ( imageData, pass, options)
        {
            var start = 0
           , end = options.BYTES_PER_CHUNK
           , imageDataSize = imageData.length
           , chunk = ''
           , chunkIndex = 0
           , ret = [];
            
            if (start < imageDataSize)
            {
               while(start < imageDataSize)
               {
                chunk = imageData.substring(start, end);   
                
                ret.push({
                        pos: chunkIndex,
                        chunkData: (pass)?
                                        arquematics.simpleCrypt.encryptBase64(pass , chunk)
                                        : chunk
                });
                
                start = end;
                end = start + options.BYTES_PER_CHUNK;
                
                chunkIndex++;
              }     
           }
           
           return JSON.stringify(ret);
        },
        
        
        sendFileChunksPreview: function (previewID, imageData, pass, options)
        {
            var d = new Deferred()
           , formData
           , start = 0
           , end = options.BYTES_PER_CHUNK
           , imageDataSize = imageData.src.length
           , chunk = ''
           , chunkIndex = 0;
            
            if (start < imageDataSize)
            {
               while(start < imageDataSize)
               {
               
                chunk = imageData.src.substring(start, end);   
                
                formData = this.prepareFormDataChunkPreview(chunk, chunkIndex, pass, options);
                
                Deferred.when(arquematics.HTTP.doPostAjax(options.chunkPreviewURL + previewID, formData))
                    .done(function (dataJSON){
                        if (dataJSON.status == 200)
                        {
                          if (start >= imageDataSize)
                          {
                              d.resolve(true);      
                          }
                        }
                        else
                        {
                          end = imageDataSize;
                          d.reject();      
                        }
                    })
                    .fail(function (){
                       end = imageDataSize;
                       d.reject(); 
                    });          
              

                start = end;
                end = start + options.BYTES_PER_CHUNK;
                
                chunkIndex++;
              }     
            }
            else
            {
              d.resolve(true);      
            }
           
           return d.promise();
        },

        
        prepareFormDataPreview: function (imageData,  pass,  options)
        {
            var src =   this.parseFile(imageData.src, pass, options)
            , form = new FormData();
            
            form.append('wallbundle_file_preview[_token]', options.csrfTokenPreview);
            form.append('wallbundle_file_preview[docType]', imageData.type);
            form.append('wallbundle_file_preview[style]', imageData.name);
            form.append('wallbundle_file_preview[src]', src);
            form.append('wallbundle_file_preview[size]', imageData.src.length);
            form.append('wallbundle_file_preview[guid]', this.guid());
            
            return form;
        },
        
        sendFilePreview: function (file, imageData,  pass, options)
        {
            var d = new Deferred()
           , formData = this.prepareFormDataPreview(imageData,  pass, options);
           
         
               self.postMessage({'cmd':'debug','sendFilePreview': file.url});
               //envia el fichero
               Deferred.when(arquematics.HTTP.doPostAjax(file.url, formData))
                    .done(function (dataJSON){
                        d.resolve({url: dataJSON.url,
                                   id: dataJSON.id});      
                    })
                    .fail(function (){
                       d.reject(); 
                }); 
           
           return d.promise();
        },
        
        prepareFormDataChunk: function (data, postIndex, pass, options)
        {
            var form = new FormData();
            
            form.append('ar_drop_file_chunk[_csrf_token]', options.csrfTokenChunk);
            form.append('ar_drop_file_chunk[chunkData]', (pass)?arquematics.simpleCrypt.encryptBase64(pass , data): data);
            form.append('ar_drop_file_chunk[pos]', postIndex);
            
            return form;
        },

        sendFileChunks: function (file, url, pass, options)
        {
            var d = new Deferred()
           , that = this
           , formData
           , start = 0
           , end = options.BYTES_PER_CHUNK
           , blob = file.src
           , blobSize = blob.length
           , chunkIndex = 0
           , chunk = '';
            
            if (start < blobSize)
            { 
               while(start < blobSize)
               {
               
                chunk = blob.substring(start, end);   
                        
                formData = that.prepareFormDataChunk(chunk, chunkIndex, pass, options)
                
                Deferred.when(arquematics.HTTP.doPostAjax(url, formData))
                .done(function (dataJSON){
                    if (start >= blobSize)
                    {
                        d.resolve(true);      
                    }  
                })
                .fail(function (){
                       d.reject(); 
                });
                
                start = end;
                end = start + options.BYTES_PER_CHUNK;
                
                chunkIndex++;
              }     
            }
            else
            {
              d.resolve(true);      
            }
           
           return d.promise();
        },

        S4: function () {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        },
        guid: function () {
                return (this.S4()+this.S4()+'-'+this.S4()+'-'+this.S4()+'-'+this.S4()+'-'+this.S4()+this.S4()+this.S4());
        },
        generateTagList: function (hashList)
        {
            var hash = arquematics.utils.removeExtension(hashList)
            , hasItems = hash.toLowerCase().split(' ')
            , ext = arquematics.utils.getFileExtension(hashList.toLowerCase())
            , ret = arquematics.utils.sha256('.' + ext);
                    
            if (hasItems.length > 0)
            {
                for (var i = 0, len = hasItems.length; i < len; i++) 
                {
                    ret += arquematics.utils.sha256(hasItems[i]);
                }
            }
            else
            {
              ret += arquematics.utils.sha256(hash.toLowerCase());  
            }
            
            return ret;
        },
        generateTagListSmall: function (hashList)
        {
            var hash = arquematics.utils.removeExtension(hashList)
            , hasItems = hash.toLowerCase().split(' ')
            , ext = arquematics.utils.getFileExtension(hashList.toLowerCase())
            , ret = arquematics.utils.sha256(ext);
    
            if (hasItems.length > 0)
            {
                for (var i = 0, len = hasItems.length; i < len; i++) 
                {
                    ret += arquematics.utils.sha256(hasItems[i].substring(0, 3));
                }
            }
            else
            {
              ret += arquematics.utils.sha256(hashList.toLowerCase().substring(0, 3));  
            }
            
            return ret;
        },
        prepareFormData: function (file, pass, options)
        {
           /*
            var src = (file.src.length <= options.BYTES_PER_CHUNK)?
                        (pass)?arquematics.simpleCrypt.encryptBase64(pass , file.src): file.src: this.parseFile(file.src, pass, options)
            */
            var src = this.parseFile(file.src, pass, options)
            , form = new FormData()
            ,  d = new Deferred();
      
            form.append('wallbundle_file[_token]', options.csrfTokenSend);
            form.append('wallbundle_file[docType]', file.type);
            form.append('wallbundle_file[name]', (pass)? arquematics.simpleCrypt.encryptBase64(pass ,file.name): file.name);
            form.append('wallbundle_file[size]', file.size);
            form.append('wallbundle_file[src]', src);
            form.append('wallbundle_file[hash]', this.generateTagList(file.name));
            form.append('wallbundle_file[hashSmall]', this.generateTagListSmall(file.name));
            form.append('wallbundle_file[guid]', this.guid());
            
            if (pass)
            {
                Deferred.when(arquematics.utils.encryptAsyn(pass))
                .done(function (data){
                    form.append('wallbundle_file[pass]', data);
                
                    d.resolve(form);       
                });
            }
            else
            {
              d.resolve(form);  
            }
                    
            return d.promise();
        },
    
        sendFile: function (file, pass, options)
        {
           var d = new Deferred()
           , that = this;
           
           self.postMessage({'cmd':'debug','size': file.src.length});
           self.postMessage({'cmd':'debug','BYTES_PER_CHUNK': options.BYTES_PER_CHUNK});
           
           Deferred.when(this.prepareFormData(file, pass, options))
           .done(function (formData){
               
               //envia el fichero
               Deferred.when(arquematics.HTTP.doPostAjax(options.sendURL, formData))
                   .done(function (dataJSON){
                        self.postMessage({'cmd': 'fileCreated', 'url': dataJSON.url});
                       
                       
                        
                        d.resolve({id:dataJSON.id,
                                   guid: dataJSON.guid,
                                   url: dataJSON.url}); 
                                 
                    })
                    .fail(function (){
                       self.postMessage({'cmd':'debug','allData': dataJSON});
                       d.reject(); 
                    });
            
           });

           return d.promise();
        },
        
        sendImages: function (file, images, pass, options)
        {
             var d = new Deferred();
            
            for ( var i = images.length -1, countItems = images.length; i >= 0; --i )
            {
                Deferred.when(this.sendFilePreview(
                                file, images[i],  pass, options))
                .done(function (){
                            countItems--;
                            //actualiza la barra de progreso
                            self.postMessage({'cmd': 'uploadprogress', 'progress': 100 * ((images.length - 1) - countItems) / (images.length - 1)});
                            
                            if (countItems <= 0)
                            {
                                d.resolve({'cmd': 'stop',  'fileUrl': file.url, 'fileId': file.id });     
                            }        
                })
                .fail(function (){
                        d.reject({'cmd': 'error'});
                    });                                   
            }
            
            return d.promise();
        },
        /**
         * el fichero esta listo para ser procesado
         */
        sendFileReady: function(url, cmd)
        {
            var d = new Deferred();
            
            Deferred.when(arquematics.HTTP.doPutAjax(url))
                .done(function (){   
                     d.resolve(cmd);   
             })
            .fail(function (){
                 d.reject({'cmd': 'err'});
            });
            
            return d.promise();
        },
        
	sendData: function (fileName, fileType, size, fileArrayBuf, pass, options)
        {
            var d = new Deferred()
            , that = this;
            
            if (arquematics.mime.isOfficeType(fileType)
                || arquematics.mime.isOpenOfficeType(fileType))
            {  
                Deferred.when(this.sendFile({
                                        src: fileArrayBuf,
                                        type: fileType,
                                        size:  size,
                                        name: fileName
                                        }, pass, options))
                        .done(function (fileRes)
                        {
                        
                                Deferred.when(that.getCloudConvertPreview({
                                        src: fileArrayBuf,
                                        type: fileType, 
                                        name: fileName
                                        }))
                                .done(function (pdfDataString){
                                  
                                    self.postMessage({'cmd': 'uploadprogress', 'progress': 50 });
                                    //envia el PDF generado
                                    Deferred.when(that.sendFilePreview(
                                        {
                                            id:     fileRes.id,
                                            src:    fileArrayBuf,
                                            type:   fileType, 
                                            name:   fileName,
                                            url:    fileRes.url
                                        }, 
                                        {
                                            type: 'application/pdf',
                                            name: 'normal',
                                            src: 'data:application/pdf;base64,' +  pdfDataString
                                        },  
                                        pass, options))
                                    .done(function (){
                                        d.resolve({'cmd': 'stop', 'fileUrl': fileRes.url ,'fileId': fileRes.id});
                                    })
                                    .fail(function (){
                                        d.reject({'cmd': 'err'}); 
                                    });  
                              
                             })
                             .fail(function (){
                                d.reject({'cmd': 'err'});
                               });   
                         
                        })
                        .fail(function (){
                            d.reject({'cmd': 'err'});
                        });    
              }
            else if (arquematics.mime.isDwg(fileType)
                     || arquematics.mime.isDxf(fileType)
                     || arquematics.mime.isPsd(fileType))
            {
                     Deferred.when(this.sendFile({
                                        src: fileArrayBuf,
                                        type: fileType,
                                        size:  size, 
                                        name: fileName
                                        }, pass, options)) 
                     .done(function (fileRes){
                         
                             Deferred.when(that.getCloudConvertPreview({
                                        src: fileArrayBuf,
                                        type: fileType, 
                                        name: fileName
                                        }))
                                .done(function (convertedDataPNG){
                                    d.resolve({cmd:'createThumbnails', extraContent: true, fileData: convertedDataPNG, fileType: 'image/png', url: fileRes.url, fileId: fileRes.id });   
                                })
                                .fail(function (){
                                    d.reject({'cmd': 'err'});
                                });  
                         
                     })
                     .fail(function (){
                             d.reject({'cmd': 'err'});
                     });   
            }
            else if (arquematics.mime.isImageType(fileType))
            {
                        Deferred.when(this.sendFile({
                                        src: fileArrayBuf,
                                        type: fileType, 
                                        size:  size,
                                        name: fileName
                                        }, pass, options))
                            .done(function (fileRes){
                  
                               self.postMessage({'cmd': 'uploadprogress', 'progress': 5});
                               
                               d.resolve({cmd:'createThumbnails', extraContent: false, fileType: fileType, url: fileRes.url, fileId: fileRes.id });
                            })
                            .fail(function (){
                                d.reject({'cmd': 'err'});
                            });
            }
            else 
            {
                        //por defecto simplemente manda el archivo
                        Deferred.when(this.sendFile({
                                        src: fileArrayBuf,
                                        type: fileType,
                                        size:  size, 
                                        name: fileName
                                        }, pass, options)) 
                        .done(function (fileRes){
                            d.resolve({'cmd': 'stop', 'fileUrl': fileRes.url, 'fileId': fileRes.id});
                        })
                        .fail(function (){
                             d.reject({'cmd': 'err'});
                        });   
            }
    return d.promise();
  }
};


self.addEventListener('message', function(e) {
  var data = e.data;

  //self.postMessage({'cmd':'debug','allData': data});

  switch (data.cmd) 
  {
    case 'initCrypt':
        if (data.crypt)
        {
           sjcl.random.addEntropy(data.value, data.size, data.source);
           //inicia arquematics.crypt
           arquematics.utils.initEncrypt(data.privPublic, JSON.parse(data.keys));  
        }
        self.postMessage({'cmd':'ready'});
    break;

    case 'start':
        //suma un work mas
        self.postMessage({'cmd':'start'});
   
            //self.postMessage({'cmd': 'debug', 'data': data});
            
            data.options = JSON.parse(data.options); 
            Deferred.when(dropzoneTaskUpload.sendData( data.name, data.type, data.size, data.fileArrayBuf, (data.crypt)? data.pass: false, data.options))
                .done(function (cmd){
                    if (cmd.cmd === 'stop')
                    {
                       Deferred.when(dropzoneTaskUpload.sendFileReady(cmd.fileUrl,cmd))
                       .done(function (cmd){
                           self.postMessage(cmd);
                       })
                      .fail(function (){
                            self.postMessage({'cmd':'err'}); 
                       });
                    }
                    else
                    {
                      self.postMessage(cmd);       
                    }
                })
                .fail(function (){
                    self.postMessage({'cmd':'err'}); 
                });
        
    break;
      
    case 'sendThumbnails':

            Deferred.when(dropzoneTaskUpload.sendImages({id: data.fileId, url: data.url, name: data.name, type: data.type}, JSON.parse(data.images), (data.crypt)? data.pass: false, JSON.parse(data.options)))
            .done(function (cmd){
                if (cmd.cmd === 'stop')
                {
                       Deferred.when(dropzoneTaskUpload.sendFileReady(cmd.fileUrl, cmd))
                       .done(function (cmd){
                           self.postMessage(cmd);
                       })
                      .fail(function (){
                            self.postMessage({'cmd':'err'}); 
                       });
                }
                else
                {
                    self.postMessage(cmd);       
                }
            })
            .fail(function (){
                self.postMessage({'cmd':'err'}); 
            });    
    break;
    
    case 'stop':
      self.postMessage({'cmd':'stop','text':'WORKER STOPPED:'});
      self.close(); // Terminates the worker.
      break;
  }
}, false);