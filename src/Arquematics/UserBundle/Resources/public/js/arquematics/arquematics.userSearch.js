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
(function (arquematics , jQuery,  List, moment) {

arquematics.userSearch =  {
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
            
            if (this.isMovile)
            {
               this.options.content_col = this.options.content_col_movile;
            }
            
       },
       init: function (options)
       {
           this.configure(options);

           this._initControlHandlers();
           
           this._initButtomHandlers();
           
	},
        
        _initButtomHandlers: function () 
        {
             var $blockElement
            , $unblockElement
            , $deleteElement
            ;
            
            $(".cmd-block").off();
            $(".cmd-block").on('click', function(event){
                event.preventDefault();
                
                $blockElement = $(this);
                              
                $('#confirm-block').modal('show');
                return false;
            });
                    
            $(".cmd-unblock").off();
            $(".cmd-unblock").on('click', function(event){
                        event.preventDefault();
                        
                        $unblockElement = $(this);
                        
                        $('#confirm-unblock').modal('show');
                        return false;
            });
                    
            $(".cmd-accept-block").off();
            $(".cmd-accept-block").on('click', function(event){
                        event.preventDefault();
                        
                        $('body').addClass('loading');
                        
                         window.location = $blockElement.attr('href');
                        
                        return false;
            });
            
            $(".cmd-accept-unblock").off();
                    
            $(".cmd-accept-unblock").on('click', function(event){
                        event.preventDefault();
                        
                        $('body').addClass('loading');
                        
                        window.location = $unblockElement.attr('href');
                        
                        return false;
            });
            
            $(".cmd-delete").off();
                    
            $(".cmd-delete").on('click', function(event){
                        event.preventDefault();
                        
                        $deleteElement = $(this);
                        
                        $('#confirm-delete').modal('show');
                        return false;
            });
                   
            $(".cmd-accept-delete").off();
            $(".cmd-accept-delete").on('click', function(event){
                        event.preventDefault();
                        
                        $('body').addClass('loading');
                        
                        window.location = $deleteElement.attr('href');
                       
                        return false;
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
                        valueNames: [ 'users-name', 'users-status', 'users-last-access'],
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


}( arquematics || {}, jQuery, List, moment));