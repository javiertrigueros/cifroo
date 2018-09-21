/*global define*/
define([
    'underscore',
    'jquery',
    'backbone',
    'modalRegion',
    'brandRegion',
    'helpers/uri',
    'i18next',
    'devicejs',
    'arquematicsAuth',
    'marionette'
], function (_, $, Backbone, ModalRegion, BrandRegion, URI, i18n, Device, ArquematicsAuth) {
    'use strict';

    // Underscore template
    _.templateSettings = {
        // interpolate : /\{\{(.+?)\}\}/g
        interpolate: /\{\{(.+?)\}\}/g,
        evaluate: /<%([\s\S]+?)%>/g
    };

    var App = new Backbone.Marionette.Application();

    //console.log(PixelAdmin);
    //PixelAdmin.start([]);

    App.isMobile = Device.mobile() === true || Device.tablet() === true;

    App.addRegions({
        //logo
        home          : '#home-navbar',
        //icono con el logo del tipo de documento
        //logo          : '#menu-left-navbar',
        //bottones del documento
        toolButtoms   : '#px-demo-navbar-collapse',
        //lista documentos
        sidebar       : '#sidebar-menu',
        //contenido
        content       : '#content-wrapper',
        brand         : BrandRegion,
        modal         : ModalRegion
    });
    //redireccion a fuera
    App.hasRedirOut = true;
    
    //ha terminado de sincronizar
    App.hasInitSync = false;
    //ha terminado de sincronizar
    App.hasSync = false;
    //informacion de usuario
    App.userInfo = false;
    // Modal region events
    App.modal.on('close', function () {
        // App.notesArg = null; // Re render sidebar
    });

    // Backbone history navigate
    App.navigate = function (route, options) {
        if (!options) {
            options = {};
        }
        Backbone.history.navigate(route, options);
    };

    // Go back
    App.navigateBack = function (defUrl) {
        var url = window.history;
        defUrl = (defUrl) ? defUrl : '/notes';

        if (url.length === 0) {
            App.navigate(defUrl, {trigger: true});
        } else {
            url.back();
        }
    };

    // Debug
    App.log = function (str) {
        if (console && typeof console.log === 'function') {
            console.log(str);
        }
    };

    // Return current route
    App.getCurrentRoute = function () {
        return Backbone.history.fragment;
    };

    // For submodules
    App.startSubApp = function(appName, args) {
        /*
        if (appName !== 'Encryption' && !App.Encryption.API.checkAuth()) {
            return;
        }*/
        //console.log('appName');
        //console.log(appName);
        
        var currentApp = appName ? App.module(appName) : null;
        
       
        if (App.currentApp === currentApp){ return; }

        if (App.currentApp){
            App.currentApp.stop();
        }
        //window.dropboxKey = App.settings.dropboxKey;

        App.currentApp = currentApp;
        if(currentApp){
            currentApp.start(args);
        }
    };

    // Initialize settings
    App.on('before:start', function () {
        
        //configs.fetch();

        //App.settings = configs.getConfigs();
        
        
        App.settings =  {
            'appVersion': '0.0.1',
            'appLang': '',
            'backURL': '',
            'pagination': '10',
            'editMode': 'preview',
            // Keybindings
            'navigateTop': 't',
            'navigateBottom': 'b',
            'jumpInbox': 'g i',
            'jumpNotebook': 'g n',
            'jumpFavorite': 'g f',
            'jumpRemoved': 'g t',
            'actionsEdit': 'e',
            'actionsOpen': 'o',
            'actionsRemove': 'shift+3',
            'actionsRotateStar': 's',
            'appCreateNote': 'c',
            'appSearch': '/',
            'appKeyboardHelp': '?'
        };
        
        /*
        configs.on('change', function () {
            App.settings = configs.getConfigs();
        });*/
        /*
        $.when(configs.firstStart()).done(function (collection) {
            configs = collection;
        });*/
    });

    App.on('profile:change', function () {
        App.currentProfile = URI.getProfile();
        App.mousetrap.API.restart();
    });
    /*
    App.on('configs:fetch', function () {
        configs.fetch();
    });*/
    
    //termino de sincronizar
    App.on('sync:after', function () {
        App.hasSync = true;
        App.hasInitSync = false;
    });
    

    // Start default module
    App.on('start', function () {
        require([
            'constants',
            'helpers/install',
            'apps/confirm/appConfirm',
            'helpers/keybindings',
            'apps/navbar/appNavbar',
            'apps/notes/appNote',
            'apps/settings/appSettings',
            'apps/help/appHelp'
        ], function (constants, Install) {
           
           //inicializa la libreria arquematics
          $.when(ArquematicsAuth())
           .done(function (userInfo) {
           
           //console.log('lanza trigger');
           //informacion de usuario
           App.userInfo = userInfo;
           //lenguaje de usuario
           App.settings.appLang = userInfo.lang;
            
            var lng = {                           
                resGetPath      : '/bundles/wall/js/vendor/explorer/app/locales/' + App.settings.appLang + '/__ns__.json',
                lng             : App.settings.appLang,
                fallbackLng     : 'en',
                useCookie       : false,
                useLocalStorage : false
            };
            

            App.currentProfile = URI.getProfile();

            
            i18n.init(lng, function () {
    
                App.constants = constants;
                Install.start();

                Backbone.history.start({pushState: false});
                

                App.log('init getCurrentRoute');
                App.log(App.getCurrentRoute());
                App.log((App.getCurrentRoute() === ''));
            

                if (App.getCurrentRoute() === '') {
                   App.trigger('notes:list');
                }
            });   
              
           });
            
        });
    });

    return App;
});
