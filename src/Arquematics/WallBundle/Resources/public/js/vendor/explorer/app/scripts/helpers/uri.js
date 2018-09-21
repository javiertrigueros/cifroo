/*global define*/
define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    /**
     * Builds URI's
     */
    var URI = {
        currentId: null,
        setCurrentId: function(currentId){
            this.currentId = currentId;
        },
        getCurrentId: function(){
            return this.currentId;
        },
        
        getProfile: function () {
            var route = Backbone.history.fragment,
                uri = (route ? route.split('/') : '');

            if (_.contains(uri, 'p')) {
                return uri[1];
            }
            else {
                return null;
            }
        },

        link: function (uri, profile) {
            if (profile) {
                uri = '/p/' + profile + uri;
            }
            // Search in window's hash (only if 2-nd argument doesn't exist
            else if (arguments.length === 1 && (profile = URI.getProfile()) ) {
                uri = '/p/' + profile + uri;
            }
            return uri;
        },
        
       vectorNextPrev: function (opt)
       {
           var args = (opt ? _.clone(opt) : {}),
                url = '/vectors/' + args.doctype ,
                filters = {
                    filter : '/f/',
                    query  : '/q/',
                    page   : '/p'
                };
            /*
            //calcula la nueva pagina
            args.page = (typeof page === 'number') ? page : args.page;
            if (isNaN(args.page)) {
                args.page = 1;
            }*/
            
            var urlFilters = '';
            _.each(filters, function (value, filter) {
                if (_.has(args, filter) && args[filter] !== null) {
                    urlFilters += value + args[filter];
                }
            });
            
            console.log('urlFilters');
            console.log(urlFilters);
            
            console.log('page');
            console.log(page);
            
            console.log('vector');
            console.log(url);
            
            return url + urlFilters;
        },
        
        // Builds vectors\'s hash URI
        vector: function (opt, doc) {
            
            var args = (opt ? _.clone(opt) : {}),
                url = '',
                filters = {
                    filter : '/f/',
                    query  : '/q/'
                    //page   : '/p'
                };
            /*
            //calcula la pagina
            args.page = (typeof doc === 'number') ? doc : args.page;
            if (isNaN(args.page)) {
                args.page = 1;
            }*/
            
            var urlFilters = '';
            _.each(filters, function (value, filter) {
                if (_.has(args, filter) && args[filter] !== null) {
                    urlFilters += value + args[filter];
                }
            });
            
            if (doc && _.isObject(doc)) {
                url += '/'+ ( doc.diagramType || doc.get('diagramType')) + urlFilters + '/show/' + ( doc.id || doc.get('id') );
            }
            
            return url;
        },
        
        objURL: function (obj)
        {
           var url = '';
           
           if (obj && _.isObject(obj)) {
                url = '/' + ( obj.diagramType || obj.get('diagramType')) +   '/show/' + ( obj.id || obj.get('id') );
           }
           
           return url;
        },
        
        doc: function (opt, obj) {
            var args = (opt ? _.clone(opt) : {}),
                filters = {
                    filter : '/f/',
                    query  : '/q/'
                    //page   : '/p'
                },
                //hasFilters = false,
                baseURL = '/note',
                url = '';
            
            
            if (_.has(args, 'docType'))
            {
              baseURL = '/' + args.docType;      
            }
            
            _.each(filters, function (value, filter) {
                if (_.has(args, filter) && args[filter] !== null) {
                    url += value + args[filter];
                    if (filter === '/f/')
                    {
                      baseURL = '/note';    
                    }
                }
            });

            //:TODO mira esto de note
            if (obj && _.isObject(obj)) {
                url += '/show/' + ( obj.id || obj.get('id') );
            }
            
            return baseURL + url;

            //return this.link(baseURL + url, args.profile);
        },
        
        // Builds note\'s hash URI
        note: function (opt, note) {
            var args = (opt ? _.clone(opt) : {}),
                url = '/notes',
                filters = {
                    filter : '/f/',
                    query  : '/q/'
                    //page   : '/p'
                };

            /*
            args.page = (typeof note === 'number') ? note : args.page;
            if (isNaN(args.page)) {
                args.page = 0;
            }*/

            _.each(filters, function (value, filter) {
                if (_.has(args, filter) && args[filter] !== null) {
                    url += value + args[filter];
                }
            });

          
            //:TODO mira esto de note
            // Note
            if (note && _.isObject(note)) {
                url += '/show/' + ( note.id || note.get('id') );
            }
            
            return url;

            //return this.link(url, args.profile);
        }

    };

    return URI;
});
