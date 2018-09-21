/**
 * @package: arquematicsPlugin
 * @version: 0.1
 * @Autor: Arquematics 2010 
 *         by Javier Trigueros Martínez de los Huertos
 *         
 * dependencias con:
 * 
 * - jquery
 * @param {jQuery} $
 * @param {arquematics} arquematics
 */
(function($, arquematics) {
    
arquematics.tab =  {
        options: {
          showTabs: true,
          wall_url:                   '/wall',
          control_height: 109,

          tab_container: "#tab-container",
          
          control_take_back:      '#takeBack',
          
          input_control_wall_message: '#wallMessage_message',
          input_control_post_message: '#a_blog_new_post_message',
          input_control_event_message: '#a_new_event_message'
        },
        tabControls: [],
        tabsEnabled: true,
        
        init: function(options)
        {
           options = options || {};

           this.options = $.extend(this.options, options);
           
           this._initControlHandlers(); 
           this._showControls();
	},
        _initControlHandlers: function ()
        {
           var that = this
           , options = this.options;

           $('body').bind("resetWallContent",function (e, url)
           {
             that.options.showTabs = (url === options.wall_url);
             that._showControls();
           });
    
           $('body').bind('changeTabStatus', function (e, enable)
           {
              that.tabsEnabled = enable;
              that.notify(enable);
           });
        },
        _showControls: function()
        {
            var options = this.options;
            
            if (options.showTabs)
            {
              $(options.tab_container).removeClass('tab-container-border');
              $(options.element).show(); 
            }
            else
            {
              $(options.element).hide();
              $(options.tab_container).addClass('tab-container-border');
            }
        }, 
        _activeTab: function(tabControl, controlNode)
        {
            tabControl.setIsActive(true);
            tabControl.reset(); 
        },
        addHandlers: function ($controlNode)
        {
            var that = this;
            
            $controlNode.on("click", function (e) 
            {
                e.preventDefault();
                
                if (that.tabsEnabled)
                {
                   var $node = $(e.currentTarget);
                
                    $('.tab-control').hide();
                    $('.tab-buttons').hide();
                
                    $('.tab-button').removeClass('active');
                    $node.addClass('active');
               
                    $('#control-' + $node.attr('id')).removeClass('hide');
                    $('#buttons-' + $node.attr('id')).removeClass('hide');
                    $('#control-' + $node.attr('id')).show();
                    $('#buttons-' + $node.attr('id')).show();      
                }
            });
        },
        controlName: function()
        {
          return 'tabs';
        },
        notify: function(enable)
        {
            for (var i = this.tabControls.length -1;(i >= 0);i--)
            {
              this.tabControls[i].update(enable);
            }
        },
        subscribeTab: function(tabControl) 
        {
            var controlNode = tabControl.getElement();
            
            this.tabControls.push(tabControl);
            
            this.addHandlers(controlNode);
	}
};

}(jQuery, arquematics));