 /**
 * @package: arquematicsPlugin
 * @version: 0.1
 * @Autor: Arquematics 2010 
 *         by Javier Trigueros Martínez de los Huertos
 *         
 *  depende de:
 *  - tmpl
 *  
 */

/**
 * 
 * @param {type} $
 * @param {type} arquematics
 */
var arquematics =  (function (arquematics , $, Mustache,  List, moment) {

arquematics.userFriend =  {
	options: {
            showControls: true,
            input_control_search:   '#search-box',
            template_follower:      '#template-follower',
            
            content_pagination:     '.pagination',
            content_item:           '.user-item',
            
            cmd_friend:             '.cmd-friend',
            cmd_search_cancel:      '.cmd-search-cancel'
	},
        
        //resetea el contenido del control y lo activa para usar
        reset: function() 
        {
         
          
        },
        resetError: function() 
        {
             
        },
            
        changeContent: function() {
                 
       },
       isMovile: false,
       
       configure: function(options)
       {
            if (!options){
               options = {};
            }
            
            this.options = $.extend({}, this.options, options);
            this.isMovile = ($(window).width() <= 400);
            
            if (this.isMovile)
            {
               this.options.content_col = this.options.content_col_movile;
            }
            
       },
       init: function (options)
       {
           this.configure(options);

           this._initControlHandlers();
	},
        
        getAllFriendList: function()
        {
            var d = $.Deferred()
            ,options = this.options;
        
            $.ajax({
                type: "GET",
                url: options.url
            })
            .done(function(users) {
                d.resolve(users);         
            });  
            
            return d;
        },
        
        addFriend: function($node)
        {
            var d = $.Deferred();
        
            $.ajax({
                type: "POST",
                url: $node.data('url')
            })
            .done(function(msg) {
                d.resolve(msg);         
            });  
            
            return d;
        },
        
        _generateDOM: function(users) 
        {
            var that = this
            ,options = this.options;
           
            for (var i = 0, count = Object.keys(users).length ; i < count; i++) 
            {
                var $contentNode = that._parseData(users[i]);
                $contentNode.insertBefore($(options.content_pagination));
                that._addNodeHandlers($contentNode);
            }
	},
        
        _addNodeHandlers: function($node)
        {
            var that = this
            ,options = this.options;
            
            $node.find(options.cmd_friend).off();
            $node.find(options.cmd_friend).on('click', function(event){
                event.preventDefault();
                
                var $node = $(this);
                
                $('body').addClass('loading');
                
                $.when(that.addFriend($node))
                .done(function (user){
                    var $contentNode = that._parseData(user);
                    $('#friend-' + user.id).replaceWith( $contentNode );
                    that._addNodeHandlers($contentNode);
                    
                    //user.status 3 es el estado de petición de amistad
                    //1 estado de aceptación
                    $('body').trigger('userChange', [user]);
                });             
            });
        },
        _parseData: function (data)
        {
            return  $(Mustache.render( $(this.options.template_follower).html(), data)); 
        },
        
        _initListHandlers: function () 
        {
            var optionsConfigure = {
                        valueNames: ['users-name'],
                        page: 10,
                        pagination: [
                            {
                                paginationClass: "pagination",
                                innerWindow: 1,
                                left: 2,
                                right: 2
                            }
                        ]
            }
            ,that = this
            ,options = this.options
            ;
            
            this.userList = new List('list-followers', optionsConfigure);
            
            this.userList.on('updated', function()
            {
                if ($('.normal-list-pagination li').length >= 2)
                {
                    $('.normal-list-pagination')
                       .removeClass('hide')
                       .show();
                }
                else
                {
                    $('.normal-list-pagination').hide(); 
                }
                
                if (that.userList.visibleItems.length <= 0)
                {
                    $('.note-no-users-find').removeClass('hide').show();
                    $('#profile-followers').hide();
                }
                else
                {
                    $('.note-no-users-find').hide();
                    $('#profile-followers').show();
                }
            });
            
            $(".fuzzy-search").keyup(function(){
                if ($.trim($(this).val()).length >= 3)
                {
                    that.userList.search($(this).val());
                }
                else 
                {
                   that.userList.search();
                }
                
                if ($.trim($(this).val()) !== '')
                {
                  $('.cmd-search-cancel')
                          .removeClass('hidden')
                          .show();
                }
                else
                {
                   $('.cmd-search-cancel').hide(); 
                }
            });
            
            $(".cmd-search-cancel").on('click', function(event){
                event.preventDefault();
            
                $(".fuzzy-search").val('');
                $('.cmd-search-cancel').hide(); 
            
                that.userList.search($(".fuzzy-search").val());
            }); 
            
            
            
            if ($('.normal-list-pagination li').length >= 2)
            {
                    $('.normal-list-pagination')
                       .removeClass('hide')
                       .show();
            }
            else
            {
                $('.normal-list-pagination').hide(); 
            }
        },
        _initControlHandlers: function () 
        {
           var that = this,
               options = this.options;
       
            $(options.input_control_search).val('');
            

            $(".fuzzy-search").attr('placeholder', options.text_search);
            
            $(options.input_control_search)
                    .removeClass('hide')
                    .show();
            
            
            $('body').bind('userChange', function (e, user)
            {
                var $contentNode = that._parseData(user);
                $('#friend-' + user.id).replaceWith( $contentNode );
                that._addNodeHandlers($contentNode);
                
            });
            
            $.when(this.getAllFriendList())
            .done(function (users){
                if (users && (users.length > 0))
                {
                   that._generateDOM(users);
                   that._initListHandlers(); 
                }
                else
                {
                    $('.note-has-no-users')
                        .removeClass('hide')
                        .show();
                
                     $('#profile-followers').hide();
                }
            });
        }
};

return arquematics;

}( arquematics || {}, jQuery, Mustache, List, moment));