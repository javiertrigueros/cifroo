/*global define*/
/**
 * Replaces MD code like ![](#image-id) to ![](base64://image-code)
 */
define(['underscore', 'jquery', 'toBlob', 'blobjs'], function (_, $, toBlob) {
    'use strict';

    var Images = function () { };

    _.extend(Images.prototype, {
        urls : [],

        toHtml: function (text, images)
        {
            
            var url = window.URL || window.webkitURL,
                self = this,
                pattern,
                src,
                $node;

            this.urls = [];
            
            images.models.forEach(function (img, index)
            {
                 pattern = new RegExp('#' + img.get('id'));
                 /*
                 src = img.get('src');
                 console.log(src);*/
                 src = img.get('src');
                 if (src && (typeof src === 'string'))
                 {
                   //self.urls[index] = url.createObjectURL(toBlob(src));      
                   text = text.replace(pattern, src);
                   //$node =  $("img[src='#" + img.get('id') +"']");
                   
                  //.get(0).src = self.urls[index];
                 }
                 else if (src && (typeof src === 'object'))
                 {
                         
                 }
                 
            });
            
            /*
            if (images.length > 0)
            {
              images.forEach(function (img, index)
              {
                //TODO: mirar esta historia
                //javier
                src = img.get('src');
                console.log('img');
                console.log(img);
                console.log('images each src');
                console.log(src);
                /*
                src = (typeof src === 'object') ? src : toBlob(src);

                self.urls[index] = url.createObjectURL(src);
                pattern = new RegExp('#' + img.get('id'));
                text = text.replace(pattern, self.urls[index]);
              });      
            }*/
            
            return text;
        },

        attachedImages: function (text, images) {
            var d = $.Deferred(),
                toDelete = [],
                pattern;

            if (images.length === 0) {
                d.resolve();
            }

            $.when(_.forEach(images.models, function (img) {
                pattern = new RegExp('#' + img.get('id'));
                if (pattern.test(text) === false) {
                    toDelete.push(img.get('id'));
                }
            })).done(function () {
                images.remove(toDelete);
                d.resolve();
            });

            return d;
        },

        clean: function () {
            var url = window.URL || window.webkitURL;

            _.forEach(this.urls, function (urlImage) {
                url.revokeObjectURL(urlImage);
            });
        }

    });

    return Images;
});
