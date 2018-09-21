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
        form: "#page-login-form",
        
        input_signin_username: '#username',
        input_signin_password: '#password',
        
        input_private_key_textbox: '#private_key_textbox',
        
        private_key_modal:'#modal-private-key',
        
        cmd_accept_private_key: '.cmd-accept-private-key',
        
        sessionname: '',
        api_userinfo: ''
    },
    checkPrivateKeyField: function(privateKey)
       {
           function isArray(value)
           {
                return Object.prototype.toString.call(value) === '[object Array]';
           }

           var str = $.trim(privateKey)
           , dataHexEncode =  str.toUpperCase()
                    .replace(/(\r\n|\n|\r)/gm,'')
                    .replace(/-/g,'')
                    .replace(/BEGIN KEY/,'')
                    .replace(/END KEY/,'')
                    .replace(/^[A-F0-9]$/gm,'')
                    .replace(/\s+/g,'')
            , plainData = arquematics.codec.HEX.toString(dataHexEncode)
            , keyStrArr = plainData.split("|");
    
            return (isArray(keyStrArr) && (keyStrArr.length >= 4));
    },
    initLoginSession: function ()
    {
        var d = $.Deferred()
        , form = $(this.options.form)
        , formData = form.find('input, select, textarea').serialize();
           
        $.ajax({
            type: "POST",
            url: form.attr('action'),
            datatype: "json",
            data: formData,
            cache: false})
        .done(function() {
            d.resolve(true);
        })
        .fail(function (){
            d.reject(); 
        });
           
        return d;
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
           
    },
    init: function (options)
    {
        options = options || {};
            
        this.options = $.extend(this.options, options);
           
        this.initHandlers();
    },
    
    initHandlers: function()
    {
        var options = this.options
           , that = this;

           $(options.form).on('submit', function(e) {
              e.preventDefault();
             
               //evita que vuelva a initStatus
              if (!arquematics.login.context.lock)
              {
                arquematics.login.context.start();      
              }
              
           });
           
           $(options.cmd_accept_private_key).on('click', function(e) {
              e.preventDefault();
              
              console.log('$(options.cmd_accept_private_key)');
              
               if (arquematics.login.checkPrivateKeyField($(options.input_private_key_textbox).val()))
               {
                    $.when(arquematics.login.initLoginSession())
                    .done(function(){
                        $.when(arquematics.login.getUserInfo())
                        .then(function(jsonData){
                    
                             arquematics.utils.storeKeyForUser(jsonData.user.id + '-' + options.sessionname + '-key', $.trim($(options.input_private_key_textbox).val()));
                             
                            $(options.form).submit();
                        },
                        function (){
                          $(options.form).submit();  
                        });
                    });
               }
           });
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
       
       this.checkInputFields = function()
       {
           var userName = $.trim($(options.input_signin_username).val()),
               pass = $.trim($(options.input_signin_password).val());
           
           return ((userName.length >= 4) && (pass.length >= 4));
       };
        
       this.go = function ()
       {
            console.log('arquematics.login.initStatus');
            var $form_group = $(options.input_signin_username).parents('.form-group');
            $form_group.removeClass('has-error');
            
            $('body').addClass('loading');
            
            if (!this.checkInputFields())
            {
                arquematics.login.context.change(new arquematics.login.errorInputFieldsStatus());        
            }
            else
            {
               arquematics.login.context.change(new arquematics.login.processUserOrEmailStatus());     
            }
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
           console.log('arquematics.login.processUserOrEmailStatus');
           
            $.when(arquematics.login.initLoginSession())
            .done(function(){
              $.when(arquematics.login.getUserInfo())
                .then(function(jsonData){
                    if (jsonData.user.hasPublicKey)
                    {
                        if (that.checkClientHasPrivateKey(jsonData.user))
                        {
                            arquematics.login.context.change(new arquematics.login.sendLogRequestStatus());
                        }
                        else
                        {
                          arquematics.login.context.change(new arquematics.login.inputKeysStatus()); 
                        }
                    }
                    else 
                    {
                      arquematics.login.context.change(new arquematics.login.generateKeysAndStoreStatus(jsonData.user));
                    }
              },
              function(){
                  arquematics.login.context.change(new arquematics.login.errorInputFieldsStatus());
              }); 
            });  
       };
};

arquematics.login.sendLogRequestStatus = function (keyEncoded) 
{
    keyEncoded = keyEncoded ||  false;

    var options = arquematics.login.options;
     
     this.go = function ()
     {
        console.log('arquematics.login.sendLogRequestStatus');
        window.location.reload();
     };
   };
   
   arquematics.login.inputKeysStatus = function () 
   {
       var options = arquematics.login.options;
       
       this.logout = function()
       {
           var d = $.Deferred();
           
           $.ajax({
                    type: "GET",
                    url: options.api_logout,
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
     
       this.go = function ()
       { 
           $.when(this.logout())
           .done(function(){
               
               arquematics.login.context.lock = false;
               $('body').removeClass('loading');
        
                $(options.input_private_key_textbox).val('');
                $(options.private_key_modal).modal('show');
                       
                setTimeout($.proxy(function() {
                    $(options.input_private_key_textbox).focus();
                }, this), 500);  
           });
       };
       
   };
   
   
   arquematics.login.errorInputFieldsStatus = function () 
   {
       
       var options = arquematics.login.options;
       
       this.go = function ()
       {
           console.log('arquematics.login.errorInputFieldsStatus');
           
            var $inputUsername = $(options.input_signin_username).parents('.form-group')
            , $inputPassword = $(options.input_signin_password).parents('.form-group')
           ;
           
           arquematics.login.context.lock = false;
           
           $('body').removeClass('loading');
           
           $(options.private_key_modal).modal('hide');
           
           $inputUsername.addClass('has-error');
           $inputPassword.addClass('has-error');
           
           $inputUsername.focus();
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
