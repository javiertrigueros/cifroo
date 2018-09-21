
/**
 * @package: arquematicsPlugin
 * @version: 0.1
 * @Autor: Arquematics 2010 
 *         by Javier Trigueros Martínez de los Huertos
 *         
 *  depende de:
 *  
 */

/**
 * 
 * @param {type} $
 * @param {type} arquematics
 */
var arquematics =  (function ($, arquematics) {




arquematics.documentView = {

    

    getProportionalResize: function(srcWidth, srcHeight, maxWidth, maxHeight)
    {
        var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

        return {
            width: (maxWidth * ratio),
            height: (maxHeight * ratio)
        };
    },


    getDomObject: function (item)
    {
        if  ((item !== null && typeof item === 'object')
            && (typeof item.get === 'function')) {
            return item.get(0);
        }
        else
        {
            var $ret = $(item);

            return ((item !== null) && 
                    ($ret instanceof jQuery || 'jquery' in Object($ret)))? $ret.get(0):'';
        }
    }
};


arquematics.document =  {
    options: {
        
    },
        
    isRawchartType: function(mimeTypes)
    {
       return ('rawchart' === mimeTypes); 
    },

    createDocument: function (type) {
        var document;
 
        if (type === "barChar") {
            document = new arquematics.docviews.barChar();
        } else if (type === "barCharMultiple") {
            document = new arquematics.docviews.barCharMultiple();
        } else if (type === "histogram") {
            document = new arquematics.docviews.histogram();
        } else if (type === "pieChart") {
            document = new arquematics.docviews.pieChart();
        }
 
        document.documentType = type;
 
        return document = $.extend({}, arquematics.documentView , document);
    }  
};



  return arquematics;
    
}(jQuery,  arquematics || {} ));