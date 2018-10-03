/**
 * arquematics.mime
 * 
 * @author Javier Trigueros Martínez de los Huertos
 * 
 * Copyright (c) 2014
 * Licensed under the MIT license.
 * 
 */
/**
 * dependencias:
 * @param {type} arquematics
 * @param {type} $
 * @param {type} WS
 * @returns {arquematics}
 */
var arquematics = (function(arquematics, $, WS) {

arquematics.websocket = function (wsURI)
{
    var that = this;
    this.webSocketUri = wsURI;
    this.connection = null;
    this.session = null;
    this.error = null;
    this.connect = connect;
                
    function connect()
    {
        var deferred = $.Deferred();
        
        if (that.connection) 
        {
            deferred.resolve(that.session);
        } 
        else 
        {
            that.connection = WS.connect(that.webSocketUri);

            that.connection.on("socket/connect", function(session) {
                that.session = session;
                deferred.resolve(session);
            });
            
            that.connection.on("socket/disconnect", function(error) {
                that.error = error;
                deferred.reject(error);
            });
         }
         return deferred;
    }
};

arquematics.websocket.subscribersHandler = function (session) {
    
    function findTag(tag, dataPush)
    {
        var ret = false
        , updateTags = [];
        
        if (dataPush[userId] && dataPush[userId].updateTags)
        {
           updateTags = dataPush[userId].updateTags;
           for (var i = 0, len = updateTags.length; (i < len) && !ret; i++) 
            {
                ret = (updateTags[i].hash == tag);
            }
        }
        else if (dataPush.updateTags)
        {
           updateTags = dataPush.updateTags;
           for (var i = 0, len = updateTags.length; (i < len) && !ret; i++) 
           {
                ret = (updateTags[i].hash == tag);
           }
        }
        
        return ret;
    }
    
    var friends = arquematics.crypt.getUserFriends()
    , userId = arquematics.crypt.getUserId();
    
    for (var i = 0, len = friends.length; i < len; i++) 
    {
        session.subscribe("message/" + arquematics.wall.getSlug() + '/' + friends[i], function(uri, payload){

            var dataPush = JSON.parse(payload.msg);

            if (arquematics.tag.lastTag && arquematics.wall.getUserRequest())
            {
                if (findTag(arquematics.tag.lastTag,dataPush) && (dataPush['userRequest'] == arquematics.wall.getUserRequest()))
                {
                    if (dataPush && dataPush[userId])
                    {
                        arquematics.wall.renderAndNotify(dataPush[userId]);
                    }
                    else
                    {
                       arquematics.wall.deleteAndNotify(dataPush); 
                    }
                }
            }
            else if (arquematics.wall.getUserRequest())
            {
                if (dataPush['userRequest'] == arquematics.wall.getUserRequest())
                {
                    if (dataPush && dataPush[userId])
                    {
                        arquematics.wall.renderAndNotify(dataPush[userId]);
                    }
                    else
                    {
                       arquematics.wall.deleteAndNotify(dataPush); 
                    }
                }
            }
            else if (arquematics.tag.lastTag && (findTag(arquematics.tag.lastTag,dataPush)))
            {
                if (dataPush && dataPush[userId])
                {
                    arquematics.wall.renderAndNotify(dataPush[userId]);
                }
                else
                {
                    arquematics.wall.deleteAndNotify(dataPush);
                }
            }
            else if ((!arquematics.wall.getUserRequest()) && (!arquematics.tag.lastTag))
            {
                if (dataPush && dataPush[userId])
                {
                    arquematics.wall.renderAndNotify(dataPush[userId]);
                }
                else
                {
                   arquematics.wall.deleteAndNotify(dataPush); 
                }
            } 
            
        });
        
        session.subscribe("comment/" + friends[i], function(uri, payload){
            var dataPush = JSON.parse(payload.msg);
            
            if (dataPush && dataPush[userId])
            {
                arquematics.wall.renderComment(dataPush[userId]);  
            }
            else 
            {
                arquematics.wall.deleteComment(dataPush);  
            }
        });
        
        session.subscribe("vote/" + friends[i], function(uri, payload){
            var dataPush = JSON.parse(payload.msg);
 
            if (dataPush && dataPush[userId])
            {
               arquematics.wall.renderVote(dataPush[userId]); 
            }
        });
         
    }
    
    session.subscribe("user/notification", function(uri, payload){
            var dataPush = JSON.parse(payload.msg);
            
            if (userId == dataPush.authUserId)
            {
                arquematics.notifications.reloadNotification();
            }
    });

    //session.publish("app/user/2", "This is a message!");         
};

arquematics.websocket.requestFriendHandler = function (session)
{
    var userId = arquematics.crypt.getUserId();
    
    session.subscribe("user/notification", function(uri, payload){
            var dataPush = JSON.parse(payload.msg);
            
            if (userId == dataPush.authUserId)
            {
               arquematics.notifications.reloadNotification();
               arquematics.userFriend.updateUserData(dataPush);
            }
    });
    
};

arquematics.websocket.errorHandler = function (error) {
    console.log('Websocket server connection failed', error);
};

arquematics.websocket.prototype = {
    subscribeUsers: function()
    {
        $.when(this.connect())
             .then(arquematics.websocket.subscribersHandler, 
                   arquematics.websocket.errorHandler);  
    },
    requestFriendNotification: function()
    {
        $.when(this.connect())
             .then(arquematics.websocket.requestFriendHandler, 
                   arquematics.websocket.errorHandler);  
    }
};
 
return arquematics;
  
}(arquematics || {}, jQuery, WS));