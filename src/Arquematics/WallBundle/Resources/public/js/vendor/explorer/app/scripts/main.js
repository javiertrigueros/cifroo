require.config({
    packages: [
        // Ace editor
        {
            name     : 'ace',
            location : '../bower_components/ace/lib/ace',
            main     : 'ace'
        },
        // Pagedown-ace editor
        {
            name     : 'pagedown-ace',
            location : '../bower_components/pagedown-ace',
            main     : 'Markdown.Editor'
        }
    ],
    paths: {
        html2canvas                : '../bower_components/html2canvas/build/html2canvas',
        loadImage                  : '../bower_components/blueimp-load-image/js/load-image',
        jspdf                      : '../bower_components/jspdf/dist/jspdf.debug',
        //prettify                   :  '../bower_components/google-code-prettify/src/prettify',
        moment                     :  '../bower_components/momentjs/moment',
        sjcl                       :  '../../../../vendor/sjcl/sjcl.overwrite',
        blobUtil                   :  '../bower_components/blob-util/dist/blob-util',
        // Dependencies            :  and libraries
        text                       :  '../bower_components/requirejs-text/text',
        jquery                     :  '../bower_components/jquery/jquery',
        underscore                 :  '../bower_components/underscore/underscore',
        devicejs                   :  '../bower_components/device.js/lib/device.min',
        i18next                    :  '../bower_components/i18next/i18next.min',
        // Backbone &              :  Marionette
        backbone                   :  '../bower_components/backbone/backbone',
        marionette                 :  '../bower_components/marionette/lib/core/backbone.marionette',
        localStorage               :  '../bower_components/backbone.localStorage/backbone.localStorage',
        //IndexedDBShim              :  '../bower_components/IndexedDBShim/dist/IndexedDBShim',
        //indexedDB                  :  '../bower_components/indexeddb-backbonejs-adapter/backbone-indexeddb',
        dropzone                   :  '../bower_components/dropzone/downloads/dropzone.min',
        toBlob                     :  '../bower_components/blueimp-canvas-to-blob/js/canvas-to-blob',
        blobjs                     :  '../bower_components/Blob/Blob',
        fileSaver                  :  '../bower_components/FileSaver/FileSaver',
        enquire                    :  '../bower_components/enquire/dist/enquire.min',
        //dropbox                    :  'libs/dropbox',
        hammerjs                   :  '../bower_components/hammerjs/hammer',
        //remotestorage              :  '../bower_components/remotestorage.js/release/0.10.0-beta3/remotestorage-nocache.amd',
        'backbone.wreqr'           :  '../bower_components/backbone.wreqr/lib/backbone.wreqr',
        'backbone.babysitter'      :  '../bower_components/backbone.babysitter/lib/backbone.babysitter',
        'backbone.paginator'       :  '../bower_components/backbone.paginator/lib/backbone.paginator',
        // Keybindings             :
        'Mousetrap'                :  '../bower_components/mousetrap/mousetrap',
        'mousetrap-pause'          :  '../bower_components/mousetrap/plugins/pause/mousetrap-pause',
        'backbone.mousetrap'       :  '../bower_components/backbone.mousetrap/backbone.mousetrap',
        // Pagedown                :
        'pagedown'                 :  '../bower_components/pagedown/Markdown.Editor',
        'pagedown-extra'           :  '../bower_components/pagedown-extra/Markdown.Extra',
        'to-markdown'              :  '../bower_components/to-markdown/dist/to-markdown',
        //'mathjax'                  :  '../bower_components/MathJax/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
        
        //'rangy'                    : 'libs/vendor/hallo/bower_components/rangy-official/rangy-core',
        //pop.line lib
        //popline                    : 'libs/vendor/popline/scripts/jquery.popline.all',
        //'jquery-notebook'          : 'libs/vendor/jquery-notebook/src/js/jquery.notebook',
        
        //'hallo'                    : 'libs/vendor/hallo/dist/hallo',
        
        //marked                   : 'libs/vendor/leptureEditor/marked',
        //lepture                  : 'libs/vendor/leptureEditor/editor',
        // Markdown helpers        :
        'jquery-resizable'        :  'libs/vendor/jquery-resizable/dist/jquery-resizable',
        //simditor
        'simditor-arup'           :  '../bower_components/simditor-arup/lib/simditor-arup',
        'simple-module'           :  '../bower_components/simple-module/lib/module',
        'simple-hotkeys'          :  '../bower_components/simple-hotkeys/lib/hotkeys',
        'simple-uploader'         :  '../bower_components/simple-uploader/lib/uploader',
        'simditor-markdown'       :  '../bower_components/simditor-markdown/lib/simditor-markdown',
        'simditor'                :  '../bower_components/simditor/lib/simditor',
        //handsontable
        'handsontable'            :  '../bower_components/handsontable/dist/handsontable.full',
        //nvd3
        'nvd3'                    :  '../bower_components/nvd3/build/nv.d3',
        //d3
        'd3'                      :  '../bower_components/d3/d3',
        'marked'                  :  '../bower_components/marked/lib/marked',
        'checklist'                :  'libs/checklist',
        'tags'                     :  'libs/tags',
        // Other                   :  libraries
        'bootstrap'                :  '../bower_components/bootstrap/dist/js/bootstrap.min',
        'arquematics'              :  '../../../../arquematics/arquematics.core',
        'arquematicsAuth'           : '../scripts/apps/encryption/arquematicsAuth',
        // View                    :  scripts here
        'modalRegion'              :  'views/modal',
        'brandRegion'              :  'views/brand',
        'apps'                     :  'apps/'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        html2canvas: {
         exports: 'html2canvas'   
        },
        jspdf: {
          deps: ['html2canvas'],
          exports: 'jsPDF'  
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        devicejs: {
            exports: 'device'
        },
        localStorage: {
            deps: ['underscore', 'backbone']
        },
        moment : {
          exports: 'moment'  
        },
        /*indexedDB: {
            deps: ['underscore', 'backbone']
        },
        'IndexedDBShim': {
            exports: 'shimIndexedDB'
        },*/
        // Mousetrap
        'Mousetrap': { },
        'mousetrap-pause': {
            deps: ['Mousetrap']
        },
        'backbone.mousetrap': {
            deps: ['Mousetrap', 'mousetrap-pause', 'backbone']
        },
        // Ace && pagedown editor
        ace: {
            exports: 'ace'
        },
        'pagedown': {
            exports: 'Markdown',
            deps: [ 'pagedown-extra' ]
        },
        'pagedown-extra': [ 'pagedown-ace' ],
        'pagedown-ace/Markdown.Editor': {
            exports: 'Markdown',
            deps: [ 'pagedown-ace/Markdown.Converter' ]
        },
        'pagedown-ace/Markdown.Sanitizer': {
            deps: [ 'pagedown-ace/Markdown.Converter' ]
        },
        /*'mathjax': {
            exports: 'MathJax'
        },*/
        'to-markdown': {
            exports: 'toMarkdown'
        },
        bootstrap: {
            deps: ['jquery']
        },
        
        'rangy': {
            deps: ['jquery'],
            exports: 'rangy'
        },
        
        loadImage: {
          exports: 'loadImage'  
        },
        
        d3: {
          exports: 'd3'  
        },
        
        nvd3: {
          deps: ['d3'],
          exports: 'nv'  
        },
        
        sjcl: {
            exports: 'sjcl'
        },
        
        blobUtil: {
            exports: 'blobUtil'
        },
        
        arquematics: {
            deps: ['blobUtil', 'sjcl', 'nvd3', 'd3', 'loadImage'],
            exports: 'arquematics'
        },
        
        marked: {
            exports: 'Lexer'
        },
        
        pixelAdmin: {
           deps: ['arquematics', 'i18next'],
           exports: 'PixelAdmin'
        },
        /*
        dropbox: {
            exports: 'Dropbox'
        },
        remotestorage: {
            exports: 'remoteStorage'
        },*/
        i18next: {
            deps: ['jquery'],
            exports: 'i18n'
        }/*,
        prettify: {
            exports: 'prettify'
        }*/
    },
    findNestedDependencies: true,
    waitSeconds: 10
});

require([
    'jquery',
    'app',
    //'helpers/sync/remotestorage',
    'bootstrap'
], function ($, App) {
    'use strict';
    /*global alert*/

    // prevent error in Firefox
    if( !('indexedDB' in window)) {
        window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB;
    }

    function startApp () {
        var request;
        if ( !window.indexedDB || !window.localStorage) {
            alert('Your browser outdated and does not support IndexedDB and/or LocalStorage.');
            return;
        }
        else 
        {
           App.start();     
        }
        /*
        request = window.indexedDB.open('MyTestDatabase');
        request.onerror = function() {
            // alert('It seems like you refused Laverna to use IndexedDB or you are in Private browsing mode.');
            window.appNoDB = true;
            App.start();
        };*/
        /*
        request.onsuccess = function() {
            App.start();
        };*/
    }

    $(document).ready(function () {
        /*
        if ( !window.indexedDB) {
            require(['IndexedDBShim'], function () {
                window.appNoDB = true;
                window.shimIndexedDB.__useShim(true);
                startApp();
            });
        }
        else {
            startApp();
        }*/
        startApp();
    });

});
