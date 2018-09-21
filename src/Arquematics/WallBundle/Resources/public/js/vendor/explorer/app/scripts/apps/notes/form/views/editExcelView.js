/*global define*/
/*global Markdown*/
define([
    'underscore',
    'app',
    'marionette',
    'helpers/uri',
    'text!apps/notes/form/templates/editExcelView.html',
    'libs/utils',
    'handsontable',
    'jquery',
    'jquery-resizable',
    'backbone.mousetrap',
], function (_, App, Marionette, URI, Template, Utils, Handsontable, $ ) {
    'use strict';

    var View = Marionette.ItemView.extend({
        //template: _.template(Template),
        template: _.template(Template),

        className: 'content-notes',

        ui: {
            favorite : '.favorite i',
            title:      'input[name="title"]',
            content:    'input[name="editor"]',
            progress : '.progress-bar',
            percent  : '.progress-percent'
        },

        events: {
            'click .favorite'               : 'favorite'
        },

        keyboardEvents: {
            'up'   : 'scrollTop',
            'down' : 'scrollDown'
        },

        initialize: function(options)
        {     
            //colection files
            this.files = options.files;
            //this.imgHelper = new Img();
            
            this.clickEnabled = true;
            
            // Setting shortcuts
            var configs = App.settings;
            this.keyboardEvents[configs.actionsRotateStar] = 'favorite';

            // Model events
            this.listenTo(this.model, 'change:isFavorite', this.changeFavorite);
            //view events
            //el autosave solo funciona cuando se ha creado el documento
            if (!options.isNewNote)
            {
              this.on('autoSave', this.autoSave, this);      
            }
            
            this.model.on('attachImages', this.attachImages, this);
        },
        
        attachImages: function (data)
        {
            var that = this;
            
            _.forEach(data.images, function (model)
            {
                that.simditor.trigger('attachImages', model);
            });
        },
        
        onShow: function(){
            var that = this
            , container = document.getElementById('excel-doc');

            var dataObject = [
    {id: 1, flag: 'EUR', currencyCode: 'EUR', currency: 'Euro',	level: 0.9033, units: 'EUR / USD', asOf: '08/19/2015', onedChng: 0.0026},
    {id: 2, flag: 'JPY', currencyCode: 'JPY', currency: 'Japanese Yen', level: 124.3870, units: 'JPY / USD', asOf: '08/19/2015', onedChng: 0.0001},
    {id: 3, flag: 'GBP', currencyCode: 'GBP', currency: 'Pound Sterling', level: 0.6396, units: 'GBP / USD', asOf: '08/19/2015', onedChng: 0.00},
    {id: 4, flag: 'CHF', currencyCode: 'CHF', currency: 'Swiss Franc',	level: 0.9775, units: 'CHF / USD', asOf: '08/19/2015', onedChng: 0.0008},
    {id: 5, flag: 'CAD', currencyCode: 'CAD', currency: 'Canadian Dollar',	level: 1.3097, units: 'CAD / USD', asOf: '08/19/2015', onedChng: -0.0005},
    {id: 6, flag: 'AUD', currencyCode: 'AUD', currency: 'Australian Dollar',	level: 1.3589, units: 'AUD / USD', asOf: '08/19/2015', onedChng: 0.0020},
    {id: 7, flag: 'NZD', currencyCode: 'NZD', currency: 'New Zealand Dollar',	level: 1.5218, units: 'NZD / USD', asOf: '08/19/2015', onedChng: -0.0036},
    {id: 8, flag: 'SEK', currencyCode: 'SEK', currency: 'Swedish Krona',	level: 8.5280, units: 'SEK / USD', asOf: '08/19/2015', onedChng: 0.0016},
    {id: 9, flag: 'NOK', currencyCode: 'NOK', currency: 'Norwegian Krone',	level: 8.2433, units: 'NOK / USD', asOf: '08/19/2015', onedChng: 0.0008},
    {id: 10, flag: 'BRL', currencyCode: 'BRL', currency: 'Brazilian Real',	level: 3.4806, units: 'BRL / USD', asOf: '08/19/2015', onedChng: -0.0009},
    {id: 11, flag: 'CNY', currencyCode: 'CNY', currency: 'Chinese Yuan',	level: 6.3961, units: 'CNY / USD', asOf: '08/19/2015', onedChng: 0.0004},
    {id: 12, flag: 'RUB', currencyCode: 'RUB', currency: 'Russian Rouble',	level: 65.5980, units: 'RUB / USD', asOf: '08/19/2015', onedChng: 0.0059},
    {id: 13, flag: 'INR', currencyCode: 'INR', currency: 'Indian Rupee',	level: 65.3724, units: 'INR / USD', asOf: '08/19/2015', onedChng: 0.0026},
    {id: 14, flag: 'TRY', currencyCode: 'TRY', currency: 'New Turkish Lira',	level: 2.8689, units: 'TRY / USD', asOf: '08/19/2015', onedChng: 0.0092},
    {id: 15, flag: 'THB', currencyCode: 'THB', currency: 'Thai Baht',	level: 35.5029, units: 'THB / USD', asOf: '08/19/2015', onedChng: 0.0044},
    {id: 16, flag: 'IDR', currencyCode: 'IDR', currency: 'Indonesian Rupiah',	level: 13.83, units: 'IDR / USD', asOf: '08/19/2015', onedChng: -0.0009},
    {id: 17, flag: 'MYR', currencyCode: 'MYR', currency: 'Malaysian Ringgit',	level: 4.0949, units: 'MYR / USD', asOf: '08/19/2015', onedChng: 0.0010},
    {id: 18, flag: 'MXN', currencyCode: 'MXN', currency: 'Mexican New Peso',	level: 16.4309, units: 'MXN / USD', asOf: '08/19/2015', onedChng: 0.0017},
    {id: 19, flag: 'ARS', currencyCode: 'ARS', currency: 'Argentinian Peso',	level: 9.2534, units: 'ARS / USD', asOf: '08/19/2015', onedChng: 0.0011},
    {id: 20, flag: 'DKK', currencyCode: 'DKK', currency: 'Danish Krone',	level: 6.7417, units: 'DKK / USD', asOf: '08/19/2015', onedChng: 0.0025},
    {id: 21, flag: 'ILS', currencyCode: 'ILS', currency: 'Israeli New Sheqel',	level: 3.8262, units: 'ILS / USD', asOf: '08/19/2015', onedChng: 0.0084},
    {id: 22, flag: 'PHP', currencyCode: 'PHP', currency: 'Philippine Peso',	level: 46.3108, units: 'PHP / USD', asOf: '08/19/2015', onedChng: 0.0012},
    {id: '=SUM(A1:A22)'}

    ];
  
  var hotSettings = {
    data: dataObject,
    /*
    columns: [
        {
            data: 'id',
            type: 'numeric',
            width: 40
        },
        {
            data: 'flag',
            type: 'text'
        },
        {
            data: 'currencyCode',
            type: 'text'
        },
        {
            data: 'currency',
            type: 'text'
        },
        {
            data: 'level',
            type: 'numeric',
            format: '0.0000'
        },
        {
            data: 'units',
            type: 'text'
        },
        {
            data: 'asOf',
            language: 'es',
            type: 'date',
            dateFormat: 'DD/MM/YYYY'
        },
        {
            data: 'onedChng',
            type: 'numeric',
            format: '0.00%'
        }
    ],*/
    autoWrapRow: true,
    rowHeaders: true,
    colHeaders: [],
    columnSorting: true,
    sortIndicator: true,
    autoColumnSize: {
        samplingRatio: 23
    },
    contextMenuCopyPaste: {
      swfPath: '/arquematicsDocumentsPlugin/js/explorer/app/bower_components/zeroclipboard/dist/ZeroClipboard.swf'
    },
    manualRowResize: true,
    manualColumnResize: true,
    allowInsertRow: true,
    allowInsertColumn: true,
    contextMenu: true,
    formulas: true,
    startRows: 200,
    startCols: 200,
    minSpareRows: 1,
    preventOverflow: 'horizontal'
};
           
           this.handsontable = new Handsontable(container, hotSettings);
        
           // .handsontable('getInstance');
           
           this.handsontable.updateSettings({
                contextMenu: {
                    items: {
                        "row_above": {
                            name: 'insérer une ligne au-dessus'
                        },
                        "row_below": {
                            name: 'Insérer une ligne ci-dessous'
                        },
                        "remove_row": {
                            name: 'supprimer une ligne'
                        }
                    }
                }
            });
           
        },
        
        autoSave: function ()
        {
            if (App.Confirm.active)
            {
                clearTimeout(this.timeOut);
                return;
            }
            
            App.log('Note has been automatically saved');
            this.model.trigger('autoSave');
        },
        
        getEditorContent: function()
        {
          
            return content.replace(urlRegex, '');
        },
        
        onDestroy: function() {
            this.undelegateEvents();
            this.stopListening();
        },


        onRender: function () {
    
        },

        onClose: function () {
            //this.imgHelper.clean();
        },
       
       
        serializeData: function () {
            //var data = _.extend(this.model.toJSON(), this.options.decrypted),
            var data = this.model.toJSON(),
                self = this;
                // Convert from markdown to HTML
                // converter = Markdown.getSanitizingConverter();
                //converter = new Markdown.Converter();
                //Markdown.Extra.init(converter);
            

            /*
            if (data.diagramType === 'note')
            {
                // Customize markdown converter
                converter.hooks.chain('postNormalization', function (text) {
                    text = new Checklist().toHtml(text);
                    //text = new Tags().toHtml(text);
                    return self.imgHelper.toHtml(text, self.options.files);
                });
              
                data.content = converter.makeHtml(data.content);
            }*/
            
            //this.simditor.setValue(data.content);
            
             //datos de usuario
            data.isAdmin = App.userInfo.cms_admin;
            //data.userMenu = App.userInfo.HTML;

            data.uri = URI.link('/');
            
            URI.setCurrentId(data.id);
            
            return data;
        },

        changeFavorite: function () {
            var sidebar = $('#note-' + this.model.get('id') + ' .favorite');
            if (this.model.get('isFavorite') === 1) {
                this.ui.favorite.removeClass('fa-star-o');
                sidebar.removeClass('fa-star-o');
               
                this.ui.favorite.addClass('fa-star');
                sidebar.addClass('fa-star');
            } else {
                
                this.ui.favorite.removeClass('fa-star');
                sidebar.removeClass('fa-star');
                
                this.ui.favorite.addClass('fa-star-o');
                sidebar.addClass('fa-star-o');
            }
        },

        /**
         * Add note item to your favorite notes list
         */
        favorite: function (e) {
            e.preventDefault();
            
            if (this.clickEnabled)
            {
              this.model.trigger('setFavorite'); 
            }
            
            return false;
        },

        /**
         * Scroll page to top when user hits up button
         */
        scrollTop: function () {
            var Top = this.$('.ui-body').scrollTop();
            this.$('.ui-body').scrollTop(Top - 50);
        },

        /**
         * Scroll page down when user hits down button
         */
        scrollDown: function () {
            var Top = this.$('.ui-body').scrollTop();
            this.$('.ui-body').scrollTop(Top + 50);
        },

        templateHelpers: function() {
            return {
                i18n: $.t,

                getProgress: function() {
                    return Math.floor(this.taskCompleted * 100 / this.taskAll);
                },

                getContent: function()
                {
                    return this.content;
                },
                createdDate: function() {
                    return Utils.formatDate(this.created, $.t('DateFormat'));
                }
            };
        }

    });

    return View;
});
