/**
 * @package: arquematicsPlugin
 * @version: 0.1
 * @Autor: Arquematics 2010 
 *         by Javier Trigueros Martínez de los Huertos
 *         
 * dependencias:
 *  - bootstrap-dropdown.js
 *  - bootstrap-alert.js
 */

$.widget( "arquematics.infinite", {
	options: {
           //url con el contenido
           url : '',
           //pagina de inicio
           initPage: 0,
           //donde se coloca el contenido nuevo
           content: '#content',
           //disparador en %
           trigger : 75,
           //lo que se muestra en onload
           showOnLoad: '',
           
           template_loader: '#template-loader',
           
           resetControlError: function(e, that) 
           {
               
           }
         
        },
        reset_url: '',        
        scrolling: true,
        counter: 0,
        _create: function() 
        {
            this._addScrollHandler();
            this._initEventHandlers();
	},
        _init: function()
        {
            this.scrolling = false;
            this.counter = this.options.initPage;
            this.reset_url = this.options.url;
            //lo inicializa por primera vez
            var that = this
             , options = this.options;
            
            $.when(this.load()) 
             .then(function (dataJson){
                  $('body').trigger('changeScrollContent', [dataJson, options.url] );           
             },
             function(){
                 setTimeout(function(){ that._init(); }, 50);
             }
            );
        },
        _update: function(){
            
        },
        
        load: function()
        {
            var that = this
            , options = this.options
            , d = $.Deferred()
            , dataString = "pag=" + this.counter;
             
            this.scrolling = true;
            
            var $loader = $(options.showOnLoad);      
            $loader.removeClass('hide');
            $loader.show();
            
            $.ajax({
                type: "GET",
                url: options.url,
                datatype: "json",
                data: dataString,
                cache: false})
            .done(function(dataJson) {
                $loader.hide();
        
                that.counter++;
                    
                if (dataJson.isLastPage)
                {
                  that.element.off('scroll');
                } 
                    
                that.scrolling = false;
                
                d.resolve(dataJson);   
            })
            .fail(function() {
                
                this.scrolling = false;
            
                d.reject();       
            });    
            
            return d;
            
        },
        _setOption: function( key, value ) {
		this.options[ key ] = value;
		this._update();
	},
        _addScrollHandler: function () 
        {
            var that = this;
            var options = this.options;
           
            $(this.element).on('scroll', function ( e ){
                var wintop = $(window).scrollTop();
                var docheight = $(that.element).height();
                var winheight = $(window).height();
                
                if ((Math.round( wintop / ( docheight - winheight ) * 100 ) 
                > options.trigger ) &&  !(that.scrolling))
                {
                    $.when(that.load()) 
                    .then(function (dataJson){
                        $('body').trigger('changeScrollContent', [dataJson, options.url] );           
                    });
                }         
            });
            
        },
        _initEventHandlers: function () 
        {
           var that = this;
           var options = this.options;
           
           $('body').bind("resetWallContent",function (e, url){
              
              if (url && ($.type(url) === "string"))
              {
                options.url = $.trim(url);      
              }
              else
              {
                options.url = that.reset_url;        
              }
              
              that.counter = 1;
              $(options.content).empty();
              
              $(options.content).append($(options.template_loader).html());
              
              $(that.element).off('scroll');
              
              that._addScrollHandler();
              $.when(that.load()) 
             .then(function (dataJson){
                  $('body').trigger('changeScrollContent', [dataJson, options.url] );           
             });
            });
        }
});