
/**
 * Arquematics graphics. Utilidades para la carga
 * y procesamiento de textos en el navegador
 * 
 * @author Javier Trigueros Martínez de los Huertos
 * 
 * Copyright (c) 2015
 * Licensed under the MIT license.
 * 
 * dependencias:
 * 
 * 
 */
var arquematics = (function(arquematics, loadImage, $, document, window) {

arquematics.graphics = {
  /**
   * usa la libreria loadImage https://github.com/blueimp/JavaScript-Load-Image
   */
  getByDataOrURL: function(url, width, height)
  {
    var img = new Image()
    ,   d = $.Deferred()
    , options;
    
   if (width && height)
   {
      options = {maxHeight: height,
                 maxWidth: width};
   }
   else if (width)
   {
     options = {maxWidth: width};     
   }
   else if (height)
   {
      options = {maxHeight: height};     
   }

   loadImage(
        url,
        function (img) {
           d.resolve(img);
           if(img.type === "error")
           {
               if (console)
               {
                console.log("Error loading image " + url);      
               }
               
               d.reject();
           } else {
                d.resolve(img);
           }
        },
        options
    );
    

    return d;
  },
  
  createThumbnailFromDataUrl: function(data, documentType, name, width, height) {
     var URL = window.URL || window.webkitURL
      , img = new Image()
      , d = $.Deferred()
      , that = this
      /*
       * Bugfix for iOS 6 and 7
       * Source: http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
       * based on the work of https://github.com/stomita/ios-imagefile-megapixel
       *
       */
      , detectVerticalSquash = function(img) {
            var alpha, canvas, ctx, data, ey, ih, iw, py, ratio, sy;
            iw = img.naturalWidth;
            ih = img.naturalHeight;
            canvas = document.createElement("canvas");
            canvas.width = 1;
            canvas.height = ih;
            ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            data = ctx.getImageData(0, 0, 1, ih).data;
            sy = 0;
            ey = ih;
            py = ih;
            while (py > sy) {
                alpha = data[(py - 1) * 4 + 3];
                if (alpha === 0) {
                    ey = py;
                } else {
                    sy = py;
                }
                py = (ey + sy) >> 1;
            }
            ratio = py / ih;
            if (ratio === 0) {
                return 1;
            } else {
                return ratio;
            }
      }
      , drawImageIOSFix = function(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh)
      {
            var vertSquashRatio;
                vertSquashRatio = detectVerticalSquash(img);
            
            return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
      };
       
      img.crossOrigin = 'anonymous';
      
      img.onload = (function() {
          var canvas, ctx, resizeInfoMedium, thumbnailMedium, _ref, _ref1, _ref2, _ref3;
        
          resizeInfoMedium = that.resize(this,  width, height);
          
          if ( resizeInfoMedium.trgWidth == null) {
            resizeInfoMedium.trgWidth =  resizeInfoMedium.optWidth;
          }
          if ( resizeInfoMedium.trgHeight == null) {
             resizeInfoMedium.trgHeight =  resizeInfoMedium.optHeight;
          }
          
          canvas = document.createElement("canvas");
          ctx = canvas.getContext("2d");
          //thumbnail Medium
          canvas.width = resizeInfoMedium.trgWidth;
          canvas.height = resizeInfoMedium.trgHeight;
          drawImageIOSFix(ctx, this, (_ref = resizeInfoMedium.srcX) != null ? _ref : 0, (_ref1 = resizeInfoMedium.srcY) != null ? _ref1 : 0, resizeInfoMedium.srcWidth, resizeInfoMedium.srcHeight, (_ref2 = resizeInfoMedium.trgX) != null ? _ref2 : 0, (_ref3 = resizeInfoMedium.trgY) != null ? _ref3 : 0, resizeInfoMedium.trgWidth, resizeInfoMedium.trgHeight);
          thumbnailMedium = canvas.toDataURL("image/png");
          //mirar esto
          //var mimeType = "image/png";

          d.resolve(thumbnailMedium, name, "image/png");
      });
      
      img.onerror = function() {
        d.reject();
      };
      
      img.src = URL.createObjectURL(arquematics.codec.Base64.toBlob(data, documentType));
      
      return d;
  },
  
  resize: function(file, thumbnailWidth, thumbnailHeight)
  {
        var info, srcRatio, trgRatio;
        info = {
          srcX: 0,
          srcY: 0,
          srcWidth: file.width,
          srcHeight: file.height
        };
        srcRatio = file.width / file.height;
        info.optWidth = thumbnailWidth;
        info.optHeight = thumbnailHeight;
        if ((info.optWidth == null) && (info.optHeight == null)) {
          info.optWidth = info.srcWidth;
          info.optHeight = info.srcHeight;
        } else if (info.optWidth == null) {
          info.optWidth = srcRatio * info.optHeight;
        } else if (info.optHeight == null) {
          info.optHeight = (1 / srcRatio) * info.optWidth;
        }
        trgRatio = info.optWidth / info.optHeight;
        if (file.height < info.optHeight || file.width < info.optWidth) {
          info.trgHeight = info.srcHeight;
          info.trgWidth = info.srcWidth;
        } else {
          if (srcRatio > trgRatio) {
            info.srcHeight = file.height;
            info.srcWidth = info.srcHeight * trgRatio;
          } else {
            info.srcWidth = file.width;
            info.srcHeight = info.srcWidth / trgRatio;
          }
        }
        info.srcX = (file.width - info.srcWidth) / 2;
        info.srcY = (file.height - info.srcHeight) / 2;
        return info;
  },
  

  getProportionalHeight: function (srcWidth, srcHeight, maxWidth)
  {
    return (maxWidth / srcWidth) * srcHeight;
  },

  loadImageData: function (url, callBack)
  {
    var gCanvas = document.createElement("canvas");
    var gCtx = gCanvas.getContext("2d");

    function doProcess(f){
          var o=[];
          var reader = new FileReader();
          reader.onload = (function(theFile) {
              var img = new Image();
              
              img.onload = function(){
                gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
                gCtx.drawImage(img,0,0);
              }
              
              img.src = theFile;
              return callBack(img);
          })(f);
          reader.readAsDataURL(f);
      }

      doProcess(url);
  },
  /**
  * Ajusta el tamaño de una imagen sin deformarla
  * al tañano de un contenedor.
  *
  *
  * @param {int} srcWidth    : ancho de la imagen
  * @param {int} srcHeight   : largo de la imagen
  * @param {int} maxWidth    : ancho máximo
  * @param {int} maxHeight   : largo máximo
  *
  * @returns {
  *  return {
  *     width: @param {int}
  *     height: @param {int}
  *   }
  */
  getProportionalResize: function(srcWidth, srcHeight, maxWidth, maxHeight)
  {
    maxHeight = maxHeight || arquematics.graphics.getProportionalHeight(srcWidth, srcHeight,maxWidth)
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return {
      width: (maxWidth * ratio),
      height: (maxHeight * ratio)
    }
  }
};

  return arquematics;
  
}(arquematics || {}, loadImage,  jQuery,  document, window ));