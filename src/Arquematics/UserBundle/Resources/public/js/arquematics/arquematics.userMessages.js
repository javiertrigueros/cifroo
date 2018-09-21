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
var arquematics =  (function (arquematics , $) {


arquematics.userMessages =  {
    configure: function(options)
    {
        if (!options){
               options = {};
        } 
        this.options = $.extend({}, this.options, options);      
     },
     init: function(options)
     {
        var that = this;
        
        this.configure(options);
        
        $('body').bind('userChange', function (e, user)
        {
            if (user.status && ((user.status === 3) || (user.status === 1) ))
            {
               $('body').removeClass('loading'); 
               $('#sendMessages').modal("show");  
            }
            else
            {
                $('body').removeClass('loading'); 
            }
        });
        
        $(".cmd-send-cancel").on('click', function(event){
            event.preventDefault();
            window.location.reload(true);
        });
        
        $(".cmd-send-accept").on('click', function(event){
                event.preventDefault();
                
            $('#sendMessages').modal("hide");
            $('body').addClass('loading'); 
            
            $.when(arquematics.userMessages.sendMessages(true))
                .done(function (){
                    
                   $.when(that.getUserMessagesLock())
                    .done(function (resp){
                        window.location.reload(true);
                    });
            }); 
        });
        
        
        $('.notifications-bell')
                .removeClass('hide')
                .show();
        
        //bloquea la pantalla y lo intenta de nuevo
        if (this.options.status)
        {
            $('body').addClass('loading');
             
            $.when(arquematics.userMessages.sendMessages(false))
                .done(function (){
                    $.when(that.getUserMessagesLock())
                    .done(function (resp){
                         window.location.reload(true);
                    });
            });   
             
        }
        
       
     },
    sendMessages: function(lock)
    {
        var that = this
        , d = $.Deferred()
        , pagesLoad = 0;
        
        $.when(that.getUserInfo())
        .done(function (userInfo){
            //reinicializa crypt
            arquematics.crypt.setPublicEncKeys(userInfo.user.public_keys);

            if (lock)
            {
                 $.when(that.getUserMessagesLock())
                .done(function (resp){
                    if (resp.pagesCount && resp.pagesCount > 0)
                    {
                        for (var i = 0; (i < resp.pagesCount); i++)
                        {
                                       $.when(that.getUserMessages(i + 1))
                                        .done(function (messageList){

                                            if (messageList.messages)
                                            {
                                               $.when(that.pageSend(messageList.messages))
                                               .done(function (){
                                                   pagesLoad++;
                                           
                                                   if (pagesLoad >= resp.pagesCount){
                                                      d.resolve();     
                                                   } 
                                               });
                                            }
                                            else
                                            {
                                              pagesLoad++;
                                  
                                              if (pagesLoad >= resp.pagesCount){
                                                 d.resolve();     
                                              }
                                            }
                                            
                                        }); 
                        }                
                    }
                    else
                    {
                        d.resolve();  
                    }
                });
            }
            else
            {
                $.when(that.getUserMessagesCount())
               .done(function (resp){
                    if (resp.pagesCount && resp.pagesCount > 0)
                    {
                        for (var i = 0; (i < resp.pagesCount); i++)
                        {
                                       $.when(that.getUserMessages(i + 1))
                                        .done(function (messageList){

                                            if (messageList.messages)
                                            {
                                               $.when(that.pageSend(messageList.messages))
                                               .done(function (){
                                                   pagesLoad++;
                                           
                                                   if (pagesLoad >= resp.pagesCount){
                                                      d.resolve();     
                                                   } 
                                               });
                                            }
                                            else
                                            {
                                              pagesLoad++;
                                  
                                              if (pagesLoad >= resp.pagesCount){
                                                 d.resolve();     
                                              }
                                            }
                                            
                                        }); 
                        }                
                    }
                    else
                    {
                        d.resolve();  
                    }
               });
            }
           
                            
        });
        
        return d;
    },
    pageSend: function(messages)
    {
            var d = $.Deferred()
            , messagesSend = 0
            , countPageMessages = Object.keys(messages).length;
            
            for (var i = 0, count = countPageMessages ; i < count; i++) 
            {
                $.when(this.sendMessage(this.reEncodeMessage(messages[i])))
                   .done(function (message){
                         messagesSend++;
                         if (messagesSend === countPageMessages)
                         {
                            d.resolve();      
                         }
                });
            }  
            
            return d;
    },
        
    sendMessage: function(message)
    {
        var d = $.Deferred();
        $.ajax({
                type: "POST",
                url: this.options.url_messages + '/' + message.id,
                datatype: "json",
                data: '&data=' + JSON.stringify(message)
        })
        .done(function(msg) {
                d.resolve(msg);         
        });  
           
        return d;
    },
        
    getUserInfo: function()
    {
        var d = $.Deferred();
        
        $.ajax({
                type: "GET",
                url: this.options.url_api_userinfo
        })
        .done(function(msg) {
                d.resolve(msg);         
        });  
            
        return d;
    },
        
    getUserMessages: function(page)
    {
            var d = $.Deferred();
        
            $.ajax({
                type: "GET",
                url: this.options.url_messages + '?pag=' + page
            })
            .done(function(msg) {
                d.resolve(msg);         
            });  
            
            return d;
    },
        
    getUserMessagesLock: function()
    {
        var d = $.Deferred();
        
        $.ajax({
                type: "POST",
                url: this.options.url_lock
            })
            .done(function(msg) {
                d.resolve(msg);         
            });    
        return d;
     },
     
     getUserMessagesCount: function()
    {
        var d = $.Deferred();
        
        $.ajax({
                type: "GET",
                url: this.options.url_count
            })
            .done(function(msg) {
                d.resolve(msg);         
            });    
        return d;
     },
     
     reEncodeMessage: function(message)
     {
            if (message.pass)
            {

              message.pass = arquematics.crypt.decryptHexToString(message.pass);
              message.pass = arquematics.crypt.encryptMultipleKeys(message.pass);
              
              if (message.comments && (message.comments.length > 0))
              {
                for (var i = message.comments.length -1; (i >= 0); --i)
                {
                    message.comments[i].pass = arquematics.crypt.decryptHexToString(message.comments[i].pass);
                    message.comments[i].pass = arquematics.crypt.encryptMultipleKeys(message.comments[i].pass);
                }
              }
              
              if (message.files && (message.files.length > 0))
              {
                  for (var i = message.files.length -1; (i >= 0); --i)
                  {
                        message.files[i].pass = arquematics.crypt.decryptHexToString(message.files[i].pass);
                        message.files[i].pass = arquematics.crypt.encryptMultipleKeys(message.files[i].pass);
                  }
              }
              
              if (message.tags && (message.tags.length > 0 ))
              {
                  for (var i = message.tags.length -1; (i >= 0); --i)
                  {
                      message.tags[i].pass = arquematics.crypt.decryptHexToString(message.tags[i].pass);
                      message.tags[i].pass = arquematics.crypt.encryptMultipleKeys(message.tags[i].pass);
                  }
              }
              
              if (message.wallLinks.all && (message.wallLinks.all.length > 0 ))
              {
                  for (var i = message.wallLinks.all.length -1; (i >= 0); --i)
                  {
                    message.wallLinks.all[i].pass = arquematics.crypt.decryptHexToString(message.wallLinks.all[i].pass);
                    message.wallLinks.all[i].pass = arquematics.crypt.encryptMultipleKeys(message.wallLinks.all[i].pass ); 
                  }
              }
              
            }
            
            return message;
     }
};

return arquematics;

}( arquematics || {}, jQuery));