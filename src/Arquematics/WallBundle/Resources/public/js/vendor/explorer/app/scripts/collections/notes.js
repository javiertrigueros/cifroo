/*global define*/
define([
    'underscore',
    'backbone',
    //'migrations/note',
    'models/note',
    'backbone.paginator'
    /*'helpers/sync/arSyncNotes',*/
    //'indexedDB'
], function (_, Backbone,/* NotesDB,*/ Note/*, ArSyncNotes*/) {
    'use strict';
   
    var Notes = Backbone.PageableCollection.extend({
        model: Note,
        idAttribute: 'id',
        docType: 'note',
        trash: 0,
        isFavorite: 0,
        //busqueda por título
        searchText: false,
        searchHash: false,
        searchHashSmall: false,
        //ultimo filtro utilizado
        lastFilter: 'filter:all',
        //objeto seleccionado de la Coleción
        //selectedId: null,
        
        state: {
            pageSize: 10,
            // You can use 0-based or 1-based indices, the default is 1-based.
            // You can set to 0-based by setting ``firstPage`` to 0.
            firstPage: 1,

            // Set this to the initial page index if different from `firstPage`. Can
            // also be 0-based or 1-based.
            currentPage: 1
        },
        
        queryParams: {
            // `Backbone.PageableCollection#queryParams` converts to ruby's
            // will_paginate keys by default.
            currentPage: "page",
            
            pageSize: "size"
        },
        
        url: function ()
        {
           
           var ret = '/explorer/note?';
           
           if (this.docType !== false)
           {
               ret += 'docType=' + this.docType;
           }
           
           if (this.trash !== false)
           {
              ret += '&trash=' + this.trash;    
           }
           
           if (this.isFavorite !== false)
           {
             ret += '&isFavorite=' + this.isFavorite;      
           }
           
           if (this.searchHash !== false)
           {
              ret += '&searchHash=' + this.searchHash; 
           }
           
           if (this.searchHashSmall !== false)
           {
              ret += '&searchHashSmall=' + this.searchHashSmall; 
           }
           
           console.log('collection url');
           console.log(ret);
           
           return ret;  
        },
            
            
        setCollectionParams: function(params)
        {
           this.docType =  params.docType;
           this.trash = params.trash;
           this.isFavorite = params.isFavorite;
           this.searchText = params.searchText;
        },
        
        parseState: function (resp, queryParams, state, options) {
            return {totalPages: parseInt(resp.total_pages),
                    totalRecords: parseInt(resp.total_count)};
        },

        parseRecords: function (resp, options) {
            return resp.items;
        },
        /**
         * 
         */
        initialize: function ()
        {
            
        },
        
        /*
        setSelected: function (objId)
        {
           console.log('setSelected'); 
           var note = this.get(objId);
           
           if (note) {
               
           }
           
        },*/

        comparator: function (model) {
            return -model.get('created');
        },

        filterList: function (filter, query) {
            var res;
    
            switch (filter) {
            case 'favorite':
                res = this.getFavorites();
                break;
            case 'notebook':
                res = this.getNotebookNotes(query);
                break;
            case 'trashed':
                res = this.getTrashed();
                break;
            default:
                res = this.getActive();
                break;
            }
            return this.reset(res);
        },

        /**
         * Filter the list of all notes that are favorite
         */
        getFavorites: function () {
            return this.filter(function (note) {
                return note.get('isFavorite') === 1 && note.get('trash') === 0;
            });
        },

        /**
         * Only active notes
         */
        getActive: function () {
            return this.without.apply(this, this.getTrashed());
        },

        /**
         * Show only notebook's notes
         */
        getNotebookNotes: function ( notebookId ) {
            return this.filter(function (note) {
                var notebook = note.get('notebookId');

                if (notebook !== 0) {
                    return notebook.get('id') === notebookId && note.get('trash') === 0;
                }
            });
        },

        /**
         * Show only tag's notes
         */
        getTagged: function ( tagName ) {
            return this.filter(function (note) {
                if (note.get('tags').length > 0) {
                    return (_.indexOf(note.get('tags'), tagName) !== -1) && note.get('trash') === 0;
                }
            });
        },

        /**
         * Filter the list of notes that are removed to trash
         */
        getTrashed: function () {
            return this.filter(function (note) {
                return note.get('trash') === 1;
            });
        },
        
        getByID: function (id) {
            return this.filter(function (note) {
                return note.get('id') === id;
            });
        },

        /**
         * Filter: only unencrypted, JSON data probably encrypted data
         */
        getUnEncrypted: function () {
            return this.filter(function (note) {
                try {
                    JSON.parse(note.get('title'));
                    return false;
                } catch (e) {
                    return true;
                }
            });
        },

        /**
         * Search
         */
        search : function(letters) {
            if (letters === '') {
                return this;
            }

            var pattern = new RegExp(letters, 'gim'),
                data;

            return this.filter(function(model) {
                //data = model.decrypt();
                data = model.toJSON();
                pattern.lastIndex = 0;  // Reuse regexp
                return pattern.test(data.title) || pattern.test(data.content);
            });
        },

        /**
         * Pagination
         * @var int perPage
         * @var int page
         */
        pagination : function (page, perPage)
        {
            var collection = this;
            
            collection.state = page;
            
            collection = _(collection.rest(page));
            collection = _(collection.first(perPage));

            return collection.map( function(model) {
                return model;
            });
        }
    });
    
    return Notes;
});
