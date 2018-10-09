 /**
 * @package: arquematicsPlugin
 * @version: 0.1
 * @Autor: Arquematics 2010 
 *         by Javier Trigueros Martínez de los Huertos
 *         
 */

/**
 * 
 * @param {type} $
 * @param {type} arquematics
 */
var arquematics = (function (arquematics , $,  List) {

arquematics.channelSearch =  {
	options: {
            showControls: true,
            input_control_search:       '#search-box'
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
            
       },
       init: function (options)
       {
           this.configure(options);

           this._initControlHandlers();
           
           this._initButtomHandlers();
           
	},
        
        deleteChannel: function(url)
        {
            var d = $.Deferred()
            ,options = this.options;
            
            $.ajax({
                type: "DELETE",
                url: url
            })
            .done(function(msg) {
                d.resolve(msg);         
            });
         
            return d;
        },
        
        _initButtomHandlers: function () 
        {
            var that = this;
            
            $(".cmd-block").off();
            $(".cmd-delete" ).click(function( event ) {
                event.preventDefault();
            
                $(".cmd-delete-ok" ).removeClass('disabled');
            
                $('#confirm-delete').data('cmd_url',$(event.target).attr('href'));
                $('#confirm-delete').modal('show');
            });
          
            $(".cmd-delete-ok").off();
            $(".cmd-delete-ok" ).click(function( event ) {
                event.preventDefault();

                $('body').addClass('loading');
                $(event.target).addClass('disabled');
               
                $.when(that.deleteChannel($('#confirm-delete').data('cmd_url')))
                .done(function (data){
                    window.location.reload(false); 
                 });
            });
           
        },
       
        
        /**
         * inicializa controles estaticos
         * que no necesitan agregarse a nuevos elementos
         */
        _initControlHandlers: function () 
        {
           var that = this,
               options = this.options;
       
            $(options.input_control_search).val('');
            

            $(".fuzzy-search").attr('placeholder', options.text_search);
            
            $(options.input_control_search)
                    .removeClass('hide')
                    .show();
            
            
             var optionsConfigure = {
                        valueNames: ['project-name'],
                        page: 10,
                        pagination: [
                            {
                                paginationClass: "pagination",
                                innerWindow: 1,
                                left: 2,
                                right: 2
                            }
                        ]
                };
            
            
            this.userList = new List('normal-list', optionsConfigure);
            
            
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
                    $('.note-warning').removeClass('hide').show();
                    $('#normal-list').hide();
                }
                else
                {
                    $('.note-warning').hide();
                    $('#normal-list').show();
                }
                
                that._initButtomHandlers();
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
        }
};

return arquematics;

}( arquematics || {}, jQuery, List));