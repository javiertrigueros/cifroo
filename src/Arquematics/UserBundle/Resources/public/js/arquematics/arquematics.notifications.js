var arquematics = (function (arquematics, $, Mustache) {
    
arquematics.notifications = {
    
    options: {
        stopGetNotifications:       false,
        
        content_item:               '.notification-item',
        content_notifications:      '#navbar-notifications',
        direct_messages:            '#direct_messages',

        cmd_notification_accept:    '.cmd-notification-accept',
        cmd_notification_block:     '.cmd-notification-block',
       
        content_bell_count:         '.notifications-bell-count',
        
        template_notification_form:      '#user-notification-template'
    },
    configure: function(options)
    {
        if (!options){options = {};}
        this.options = $.extend(options, this.options,options);
        this.isMovile = ($(window).width() <= 400);
    },
    
    reloadNotification: function()
    {
       var options = this.options
       ,that = this;
        
        $.when(this.getNotifications(), that.getSubscribers())
        .then(function (data){
           that._addNodeHandlers($(options.content_notifications));
        }); 
    },
    initHandler: function()
    {
        var options = this.options
        ,that = this;
        
        $(".notifications-bell").on("click", function(event)
        {
            var $notificationsBellNode = $(this);
        
            if ($notificationsBellNode.data('count') > 0)
            {
                if ($notificationsBellNode.data('wait_ajax'))
                {
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: options.url,
                        success:function(data){
                            if(data)
                            {
                                $('.notifications-bell-count').hide();
                            
                                $notificationsBellNode.data('wait_ajax', false);
                            }
                        }
                    }); 
                }
            }
        });
        
        this._addNodeHandlers($(options.content_notifications));
    },
    
    _doPostRequest: function($node)
    {
        var d = $.Deferred();
        
        $.ajax({
                type: "POST",
                dataType: "json",
                url: $node.attr('href')})
        .done(function(dataJson) {
             d.resolve(dataJson);    
        })
        .fail(function() { 
             d.reject();       
        });
        
        return d;
    },
    
    _addNodeHandlers: function($node)
    {
       var options = this.options
       ,that = this;
       
       $node.find(options.cmd_notification_block + ',' + options.cmd_notification_accept).off();
       $node.find(options.cmd_notification_block + ',' + options.cmd_notification_accept).on("click", function(e)
       {
            e.preventDefault();
                
            var  $cmd = $(e.currentTarget);
            
            $('body').addClass('loading');
            
            $.when(that._doPostRequest($cmd)) 
            .then(function (respose){
                $(options.content_notifications).empty();
        
                $.when(that.getNotifications(), that.getSubscribers())
                .then(function (data){
                   $('body').trigger('userChange', [respose]);
                });
            }); 
       });
    },
    
    getSubscribers: function()
    {
        var options = this.options
        ,that = this
        ,d = $.Deferred();
        
        $.ajax({
                type: "GET",
                url: options.subscribers,
                success:function(data)
                {
                    var $node = $(data);

                    $(options.direct_messages).empty();
                    $(options.direct_messages).html($node);
                    
                    d.resolve(data);      
                },
                error: function ()
                {
                     d.reject();
                }
            }); 

        return d;
        
       
    },
    
    getNotifications: function()
    {
        
        var options = this.options
        ,that = this
        ,d = $.Deferred();

        $(options.content_notifications).empty();
            
            $.ajax({
                type: "POST",
                dataType: "json",
                url: options.notifications,
                success:function(data)
                {
                    var $notificationsBellNode = $(".notifications-bell")
                    , $notificationsBellCount = $('.notifications-bell-count')
                    , $node = $(data.HTML);
                            
                    if (data.count > 0)
                    {
                        $notificationsBellNode.data('count', data.count);
                        $notificationsBellNode.data('wait_ajax', true);
                    
                        $notificationsBellCount.text(data.count);
                        $notificationsBellCount
                                .removeClass('hide')
                                .show();  
                    }
                    else
                    {
                      $notificationsBellNode.data('count', data.count);
                      $notificationsBellNode.data('wait_ajax', false);
                    
                      $notificationsBellCount.text(data.count);
                      $notificationsBellCount.hide();    
                    }
                    
                    $(options.content_notifications).empty();
                    $(options.content_notifications).html($node);
                    that._addNodeHandlers($node);
                    
                    d.resolve(data);      
                },
                error: function ()
                {
                     d.reject();
                }
            }); 

        return d;
    },
    
    init: function(options)
    {
       this.configure(options);
       this.initHandler();
    }
};
  
return arquematics;
    
}( arquematics || {}, jQuery, Mustache));