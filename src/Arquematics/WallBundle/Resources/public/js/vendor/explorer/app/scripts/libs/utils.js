/**
 * funciones varias de ayuda
 */
/*global define*/
define(['underscore',  'moment'], function (_, moment) {
    'use strict';

    var instance = null;

    var Utils = function () { 
        
    };

    Utils.prototype = {
       removeExtension: function(filename)
       {
          return filename.split(".").slice(0,-1).join(".") || filename + "";
       },
       getExtension: function(filename)
       {
          return filename.split('.').pop();
       },
       /**
        * cadena de texto a objeto Date
        * 
        * @param {dateTimeString}
        * @return Date 
        */
       parseDate: function (dateTimeString)
       {
           var m = moment(dateTimeString, 'yyyy-MM-DD HH:mm:ss');
           return new Date(m.year(), m.month(), m.date(), m.hours(), m.minutes(), m.seconds(), m.milliseconds()).getTime();   
       },
       formatDate: function (date, formatString)
       {
           var m = moment(new Date(date));
    
           return m.format(formatString);
       },
       
       binaryStringToArrayBuffer: function(binary) 
       {
            var length = binary.length
            , buf = new ArrayBuffer(length)
            , arr = new Uint8Array(buf)
            , i = -1;
            while (++i < length)
            {
                arr[i] = binary.charCodeAt(i);
            }
            return buf;
       },
       dataURItoBlob: function(b64Data) 
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
            var contentType = b64Data.match(/data:([^;]+)/)[1]
            , base64 = b64Data.replace(/^[^,]+,/, '')
            , buff = this.binaryStringToArrayBuffer(decodeBase64(base64));
            
            return new Blob([buff], {type: contentType});
       }
    };
    
    return (instance = (instance || new Utils()));
   
});
