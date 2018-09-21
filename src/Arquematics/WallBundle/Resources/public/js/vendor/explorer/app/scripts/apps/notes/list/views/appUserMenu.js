/*global define*/
define([
    'underscore',
    'app',
    'marionette',
    'arquematics',
    'text!apps/notes/list/templates/appUserMenu.html'
], function(_, App, Marionette, arquematics, Template) {
    'use strict';

    var View = Marionette.ItemView.extend({
        template            : _.template(Template),
        tagName             : 'ul',
        className           : 'nav navbar-nav pull-right navbar-right',
        keyboardEvents      :   {},
        
        ui                  : {
            search: '.fuzzy-search',
            cmd_doc: '.documents-type',
            cmd_search: '.cmd-search',
            cmd_cancel: '.cmd-search-cancel',
            cmd_search_select: '.cmd-search-select'
        },
        
        events: {
            'keyup @ui.search'  : 'onChangeInput',
            'change @ui.search' : 'onChangeInput',
            'cut @ui.search'    : 'onChangeInput',
            'paste @ui.search'  : 'onChangeInput',
            
            'click @ui.cmd_search_select' : 'onClickSearchSelect',
            'click @ui.cmd_search' : 'onClickSearch',
            'click @ui.cmd_doc' : 'onClickSelectDocType',
            'click @ui.cmd_cancel'  : 'onClickCancel' 
        },
        
        collectionEvents    : {
            'change'      : 'render'
        },
        
       
        initialize: function () {
           _.bindAll(this, 'onChangeInput'); 
           
           this.isMovile = false;
        },
        
        onShow: function (){
            
            var that = this;
            //no deja pulsar el boton en modo desktop
            $('.px-nav-toggle').on('click', function(e) {
                if (!that.isMovile)
                {
                  e.preventDefault();
                  e.stopPropagation();
                }
            });    
        },
        
        onRender: function () {
           this.isMovile = ($(window).width() <= 800);
           
           if (arquematics.store.read('px_s_px-nav.left.state') !== 'expanded')
           {
               arquematics.store.write('px_s_px-nav.left.state', 'expanded');
               window.location.reload(true);
           }
           
           $('#menu-button-toggle').off();
            $('#menu-button-toggle').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                $('#px-demo-navbar-collapse').toggle();
            });
        },
        
        onClickSearchSelect: function(event)
        {
            event.preventDefault();
            event.stopPropagation();
            
            var $group = $(event.currentTarget).parents('.input-group-btn');
            
            if ($group.hasClass('open'))
            {
              $group.removeClass('open');
            }
            else
            {
              $group.addClass('open');
            }
        },
        
        onClickSearch: function (event) 
        {
            var inputSearch = $.trim($(this.ui.search).val());
            
            if (inputSearch === '')
            {
               this.collection.searchText = false; 
               this.collection.searchHash = false; 
               this.collection.searchHashSmall = false;
            }
            else
            {
               this.collection.searchText = inputSearch; 
               
               this.collection.searchHash = arquematics.utils.sha256(inputSearch.toLowerCase());
               this.collection.searchHashSmall = arquematics.utils.sha256(inputSearch.substring(0, 3).toLowerCase()); 
            }
            
            if ((inputSearch.length >= 3) || (inputSearch.length === 0))
            {
               App.trigger('doc:loading');
               this.collection.trigger(this.collection.lastFilter);       
            }
        },
        
        onClickCancel: function (event) 
        {
            var that = this;
            
            this.collection.searchText = false; 
            this.collection.searchHash = false; 
            this.collection.searchHashSmall = false;
            
            $(this.ui.cmd_cancel)
                       .removeClass('hidden')
                       .hide()
            ;
               
            that.collection.trigger(that.collection.lastFilter);
        },
        
        onChangeInput: function (event) 
        {
            event.preventDefault();
            event.stopPropagation();
            
            var inputSearch = $.trim($(event.currentTarget).val());
            
            if (inputSearch === '')
            {
               this.collection.searchText = false; 
               this.collection.searchHash = false; 
               this.collection.searchHashSmall = false;
            }
            else
            {
               this.collection.searchText = inputSearch; 
               
               this.collection.searchHash = arquematics.utils.sha256(inputSearch.toLowerCase());
               this.collection.searchHashSmall = arquematics.utils.sha256(inputSearch.substring(0, 3).toLowerCase()); 
            }
            
            if (event.which === 13 || event.keyCode === 13) 
            {
                if ((inputSearch.length >= 3) || (inputSearch.length === 0))
                {
                    App.trigger('doc:loading');
                    this.collection.trigger(this.collection.lastFilter);       
                }
            }
        },
        
        onClickSelectDocType: function (event) 
        {
           if ($(event.currentTarget).hasClass('open'))
           {
             $(event.currentTarget).removeClass('open') ;  
           }
           else
           {
              $(event.currentTarget).addClass('open') ; 
           }
        },

        serializeData: function () {

           var data = {
             user       : App.userInfo.user,
             docType    : this.collection.docType,
             trash      : this.collection.trash,
             isFavorite : this.collection.isFavorite,
             searchText : this.collection.searchText
           };
           
           return data;
        },

        templateHelpers: function () {
            return {
                i18n: $.t,
                
                captionSearchText: function (docType)
                {
                    if (docType === 'all')
                    {
                       return $.t('find docs');
                    }
                    else if (docType === 'fav')
                    {
                       return $.t('find favs');  
                    }
                    else if (docType === 'pdf')
                    {
                       return $.t('find pdf');  
                    }
                    else if (docType === 'stl')
                    {
                       return $.t('find stl');  
                    }
                    else if (docType === 'doc')
                    {
                       return $.t('find doc docx odt');  
                    }
                    else if (docType === 'xls')
                    {
                       return $.t('find xls xlsx ods');  
                    }
                    else if (docType === 'ppt')
                    {
                       return $.t('find ppt pptx pps odp');  
                    }
                    else if (docType === 'odp')
                    {
                       return $.t('find odp');  
                    }
                    else if (docType === 'ods')
                    {
                       return $.t('find ods');  
                    }
                    else if (docType === 'odt')
                    {
                       return $.t('find odt');  
                    }
                    else if (docType === 'gif')
                    {
                       return $.t('find gif');  
                    }
                    else if (docType === 'svg')
                    {
                       return $.t('find svg');  
                    }
                    else if (docType === 'psd')
                    {
                       return $.t('find psd');  
                    }
                    else if (docType === 'dwg')
                    {
                       return $.t('find dwg dxf');  
                    }
                    else if (docType === 'zip')
                    {
                       return $.t('find rar zip tgz');  
                    }  
                }
                
            };
        }

    });

    return View;
});
