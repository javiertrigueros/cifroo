var arquematics = (function (arquematics, $) {
    
arquematics.notifications = {
    
    options: {
        stopGetNotifications:       false,
        
        content_item:               '.notification-item',
        content_notifications:      '#navbar-notifications',

        cmd_notification_accept:    '.cmd-notification-accept',
        cmd_notification_block:     '.cmd-notification-block'
    },
    configure: function(options)
    {
        if (!options){options = {};}
        this.options = $.extend(options, this.options,options);
        this.isMovile = ($(window).width() <= 400);
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
        
        setInterval(
        function() {
            $.when(that.getNotifications())
                .then(function (data){
                    
            });
        }, options.timeout);
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
       
       $node.find(options.cmd_notification_block + ',' + options.cmd_notification_accept).on("click", function(e)
       {
            e.preventDefault();
                
            var  $cmd = $(e.currentTarget);
            
            $('body').addClass('loading');
            
            $.when(that._doPostRequest($cmd)) 
            .then(function (respose){
                $(options.content_notifications).empty();
        
                $.when(that.getNotifications())
                .then(function (data){
                   $('body').trigger('userChange', [respose]);
                });
            }); 
       });
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
                        $notificationsBellCount.show();  
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
    
}( arquematics || {}, jQuery));