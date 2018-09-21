/*global define*/
define([
    'sjcl',
    'blobUtil',
    'arquematics'
], function ( sjcl, blobUtil, arquematics) {
    'use strict';

    var instance = null;

    function ArquematicsAuth () {
        var d = $.Deferred();

             $.ajax({type: "GET",
                 url: '/v1/userinfo',
                 datatype: 'json',
                 cache: false})
                .done(function(userInfo){
                    arquematics.crypt = arquematics.utils.read(userInfo.user.id + '-' + userInfo.sessionname + '-key'  ,'arquematics.ecc');
                    arquematics.crypt.setPublicEncKeys(userInfo.user.public_keys);
                    
                    d.resolve(userInfo);
                })
                .fail(function(error){
                   d.reject(false);
               });    
        
        return d;
    }

    return function (){
      return (instance = (instance || new ArquematicsAuth()));  
    };
});
