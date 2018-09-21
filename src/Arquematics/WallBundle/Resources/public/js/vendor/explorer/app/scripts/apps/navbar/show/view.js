/* global define */
define([
    'underscore',
    'jquery',
    'app',
    'backbone',
    'helpers/uri',
    'text!apps/navbar/show/template.html',
    'backbone.mousetrap',
    'marionette'
], function (_, $, App, Backbone, URI, Tmpl) {
    'use strict';

    var View = Backbone.Marionette.ItemView.extend({
        template: _.template(Tmpl),
        
        attributes: function() {
            return {
                'href': App.userInfo.wall_url
            };
        },
        
        tagName             : 'span',
        className           : 'px-demo-logo',
        
        keyboardEvents:  { },

        ui:  {
            locationIcon     :  '#location-icon',
            navbarSearchForm :  '.search-form',
            navbarSearchInput:  '.search-form input',
            syncBtn          :  '.sync-button',
            syncStatus       :  '#syncStatus'
        },

        events:  {
            'click @ui.syncBtn'           : 'syncWithCloud',
            'click .btn-search'           : 'showSearch',
            'blur .search-input'          : 'hideSearch',
            'keyup @ui.navbarSearchInput' : 'searchKeyup',
            'submit @ui.navbarSearchForm' : 'searchSubmit'
        },

        initialize: function () {
            _.bindAll(this, 'syncBefore', 'syncAfter');
            
            this.keyboardEvents[App.settings.appSearch] = 'showSearch';

            // Show sync status
            this.listenTo(App, 'sync:before', this.syncBefore);
            this.listenTo(App, 'sync:after', this.syncAfter);
        },

        onRender: function () {
            var iconClass = (this.options.args.filter === null) ? 'note' : this.options.args.filter;
            this.ui.locationIcon.removeClass();
            this.ui.locationIcon.addClass('icon-' + iconClass);
        },

        syncWithCloud: function (e) {
            e.preventDefault();
            this.trigger('syncWithCloud');
        },

        syncBefore: function () {
            this.ui.syncStatus.addClass('animate-spin');
        },

        syncAfter: function () {
            this.ui.syncStatus.removeClass('animate-spin');
        },

        searchSubmit: function (e) {
            e.preventDefault();
            var text = this.ui.navbarSearchInput.val();
            App.navigate(URI.link('/notes/f/search/q/' + text), true);
        },

        searchKeyup: function (e) {
            if (e.which === 27) {
                this.ui.navbarSearchInput.blur();
            }
        },

        showSearch: function (e) {
            if (typeof (e) !== 'undefined') {
                e.preventDefault();
            }

            this.ui.navbarSearchForm.removeClass('hidden');
            this.ui.navbarSearchForm.find('input').focus().select();
            this.$('.navbar-nav').addClass('hidden');
        },

        hideSearch: function (e) {
            if (this.ui.navbarSearchForm.hasClass('hidden')) {
                return;
            }

            if (typeof (e) !== 'undefined') {
                e.preventDefault();
            }

            this.ui.navbarSearchForm.addClass('hidden');
            this.$('.navbar-nav').removeClass('hidden');
        },

        serializeData: function ()
        {
            if ((!this.options.args.docType)
                && (!this.options.args.filter))
            {
              document.title = $.t('Doctitle All Documents');
            }
            else if (this.options.args.filter)
            { 
               document.title = $.t('Doctitle ' + this.options.args.filter);
            }
            else if (this.options.args.docType)
            {
                document.title = $.t('Doctitle ' + this.options.args.docType);    
            }
            
            return {
                args: this.options.args,
                uri : URI.link('/'),
                notebooks: (this.options.inNotebooks) ? null : this.options.notebooks,
               // syncButton  : (App.settings.cloudStorage.toString() === '0') ? 'hidden' : '',
                profiles: App.settings.appProfiles,
                profile: App.currentProfile
                //profile: URI.getProfile()
            };
        },

        templateHelpers: function () {
            return {
                i18n: $.t,

                urlPage : function () {
                    if (App.currentApp && App.currentApp.moduleName === 'AppNotebook') {
                        return URI.link('/notebooks');
                    } else {
                        return URI.link('/notes');
                    }
                },

                pageTitle: function () {
                    var title = 'All notes';
                    if (this.args.filter) {
                        title = this.args.filter;
                    }
                    title = $.t(title.substr(0,1).toUpperCase() + title.substr(1));

                    if (this.args.query && this.args.filter !== 'search') {
                        //title += ': ' + this.args.query;
                        title = this.args.query;
                    }

                    return title;
                },
                pageIcon: function()
                {
                    var filter = 'notes'
                    , ret = '';
                    if (this.args.filter) {
                        filter = this.args.filter;
                    }
                    
                    switch (filter) {
                        case 'Notebooks':
                        case 'notebook':
                         ret = 'icon-book';   
                         break;
                        case 'notes':
                          ret = 'icon-doc';   
                          break;
                        case 'favorite':
                          ret = 'icon-star';
                          break;
                        case 'trashed':
                          ret = 'icon-trash';
                          break;
                    }
                    
                    return ret;
                },

                pageNumber: function () {
                    if (this.args.page) {
                        return this.args.page;
                    }
                },
                /*
                notebook: function (model) {
                    return model.decrypt().name;
                },*/

                link: function (profile) {
                    return URI.link('/notes', profile);
                }
            };
        }
    });

    return View;
});
