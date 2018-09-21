/**
 * Arquematics
 * 
 * @author Javier Trigueros Martínez de los Huertos
 * 
 * Copyright (c) 2014
 * Licensed under the MIT license.
 * 
 */

/**
 * @param {jQuery} $
 * @param {JSEncrypt} jSEncrypt
 * @param {arquematics} arquematics
 */
var arquematics = (function($, jSEncrypt, arquematics) {
    
arquematics.login = {
    options:{
        api_send_public_key: '',
        api_send_private_mail: '',
        api_request_private_mail: '',
        api_userinfo: '',
        api_logout: '',
        sessionname: ''
    },
    configure: function (options)
    {
        options = options || {};
            
        this.options = $.extend(this.options, options);
    },
    init: function (options)
    {
        this.configure(options);
           
        if (!arquematics.login.context.lock)
        {
            arquematics.login.context.start();      
        }
    },
    getUserInfo: function()
    {
        var d = $.Deferred();
           
        $.ajax({
                    type: "GET",
                    url: this.options.api_userinfo,
                    datatype: "json",
                    cache: false})
        .done(function(jsonData) {
            if (jsonData.user)
            {
               d.resolve(jsonData); 
            }
            else
            {
              d.reject(); 
            }
        })
        .fail(function (){
                d.reject(); 
        });
           
        return d;
           
    }
};


arquematics.login.context = {
    currentState: false,
      
    lock: false,
    change: function (state) 
    {
         this.currentState = state;
         this.currentState.go();
    },
    start: function ()
    {
        this.lock = true;
         
        this.currentState = new arquematics.login.initStatus();
        this.currentState.go();  
    }
};

arquematics.login.initStatus = function ()
{
       var options = arquematics.login.options;
       
       this.go = function ()
       {
            
            $('body').addClass('loading');
            
            arquematics.login.context.change(new arquematics.login.processUserOrEmailStatus());     
            
       };
};

arquematics.login.processUserOrEmailStatus = function ()
{
    var options = arquematics.login.options
    , that = this;
    
       this.checkClientHasPrivateKey = function(user)
       {
           var data = arquematics.store.read(user.id + '-' + options.sessionname + '-key');
           
           return (data !== null);
       };
       this.go = function ()
       {
           $.when(arquematics.login.getUserInfo())
                .then(function(jsonData){
                      arquematics.login.context.change(new arquematics.login.generateKeysAndStoreStatus(jsonData.user));
            });
       };
};

  arquematics.login.sendLogRequestStatus = function () 
  {
     var options = arquematics.login.options;
     this.go = function ()
     {
        window.location.href = options.api_wall;
     };
   };
   
  
arquematics.login.generateKeysAndStoreStatus = function (userObj) 
{
       var options = arquematics.login.options
       ,that = this;
       
       this.sendPublicKey = function(ecc)
       {
           var d = $.Deferred()
           , formData = '&public_key=' + ecc.keys.pub; 
           
           $.ajax({
                    type: "POST",
                    url: options.api_send_public_key,
                    data: formData,
                    datatype: "json",
                    cache: false})
           .done(function(jsonData) {
               d.resolve(jsonData);
            })
            .fail(function (){
                d.reject(); 
            });
           
           return d;
           
           
       },
       this.sendMailPrivateAndPublicKey = function(keyEncoded)
       {
           var d = $.Deferred()
           , formData = '&private_key=' + arquematics.codec.Base64.encode(JSON.stringify(keyEncoded)); 
           
           $.ajax({
                    type: "POST",
                    url: options.api_send_private_mail,
                    data: formData,
                    datatype: "json",
                    cache: false})
           .done(function(jsonData) {
               d.resolve(jsonData);
            })
            .fail(function (){
                d.reject(); 
            });
           
           return d;
       };
       this.requestMailPublicKey = function()
       {
           
           var d = $.Deferred();
           
           $.ajax({
                    type: "POST",
                    url: options.api_request_private_mail,
                    datatype: "json",
                    cache: false})
           .done(function(jsonData) {
               d.resolve(jsonData);
            })
            .fail(function (){
                d.reject(); 
            });
           
           return d;
       };

       this.go = function()
       {
           console.log('arquematics.login.generateKeysAndStoreStatus');
           
           var ecc = new arquematics.ecc();
           
           ecc.generate();
           
           arquematics.utils.store(userObj.id + '-' + options.sessionname + '-key', ecc);
           
           
           $.when(this.requestMailPublicKey())
            .done(function(jsonData){
                
                var keyHexEncode = arquematics.codec.HEX.encode(ecc.getData())
                , mailEncrypt = arquematics.utils.wordwrap(keyHexEncode)
                , keyEncoded = [];
                
                jSEncrypt.setPublicKey(arquematics.codec.Base64.toString(jsonData.public_key));
          
                for (var i = 0, count = mailEncrypt.length; i < count; i++)
                {
                    //:TODO
                    //jSEncrypt.encrypt codifica a base64? o algo asi
                    //ni idea, lo arreglo en el back con base64_decode(base64_decode($data->data))
                    keyEncoded.push({ index: i, data:  arquematics.codec.Base64.encode(jSEncrypt.encrypt(mailEncrypt[i]))});
                }
                
                $.when(that.sendMailPrivateAndPublicKey(keyEncoded))
                .done(function(jsonData){
                    
                     $.when(that.sendPublicKey(ecc))
                    .done(function(jsonData){
                        arquematics.login.context.change(new arquematics.login.sendLogRequestStatus());
                     });
                });
           }); 
       };
};


return arquematics;

}(jQuery, new JSEncrypt(), arquematics || {}));
