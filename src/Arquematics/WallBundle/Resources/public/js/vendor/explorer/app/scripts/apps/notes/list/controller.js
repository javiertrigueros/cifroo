/*global define*/
define([
    'underscore',
    'app',
    'backbone',
    'marionette',
    'helpers/uri',
    'collections/notes',
    'apps/notes/list/views/appUserMenu',
    'apps/notes/list/views/noteSidebar',
    'apps/notes/list/views/appLogo',
    'apps/notes/show/views/noteViewMsg'
], function (_, App, Backbone, Marionette, URI, Notes, AppUserMenu, NotesSidebar, AppLogo, NoteViewMsg) {
    'use strict';

    var List = App.module('AppNote.List');

    /**
     * Notes list controller - shows notes list in sidebar
     */
    List.Controller = Marionette.Controller.extend({
        //se ha lanzado el evento de scroll
        onScrollFire: false,
        
        initialize: function ()
        {
            _.bindAll(this, 'loadNextPage','endLoadNextPage','listNotes', 'listSvg', 'showSidebar', 'favoriteNotes');
            
            this.onScrollFire = false;
             
            this.notes = new Notes();

            //ya no redirecciona fuera
            App.hasRedirOut = false;
            // Application events
            App.on('notes:show', this.changeFocus, this);
            App.on('notes:next', this.toNextNote, this);

            //loadNextPage
            this.listenTo(this.notes, 'loadNextPage', this.loadNextPage, this);
            
            //DOCTYPES
            this.listenTo(this.notes, 'filter:zip', this.activeZip, this);
            this.listenTo(this.notes, 'filter:dwg', this.activeDwg, this);
            this.listenTo(this.notes, 'filter:psd', this.activePsd, this);
            this.listenTo(this.notes, 'filter:gif', this.activeGif, this);
            this.listenTo(this.notes, 'filter:odt', this.activeOdt, this);
            this.listenTo(this.notes, 'filter:ods', this.activeOds, this);
            this.listenTo(this.notes, 'filter:odp', this.activeOdp, this);
            this.listenTo(this.notes, 'filter:ppt', this.activePpt, this);
            this.listenTo(this.notes, 'filter:xls', this.activeXls, this);
            this.listenTo(this.notes, 'filter:doc', this.activeDoc, this);
            this.listenTo(this.notes, 'filter:stl', this.activeStl, this);
            this.listenTo(this.notes, 'filter:txt', this.activeTxt, this);
            this.listenTo(this.notes, 'filter:fav', this.activeFav, this);
            this.listenTo(this.notes, 'filter:svg', this.activeSvg, this);
            this.listenTo(this.notes, 'filter:pdf', this.activePdf, this);
            this.listenTo(this.notes, 'filter:rawchart', this.activeRawchart, this);
            this.listenTo(this.notes, 'filter:mindmaps', this.activeMindmaps, this);
            this.listenTo(this.notes, 'filter:epc', this.activeEpc, this);
            this.listenTo(this.notes, 'filter:bpmn', this.activeBpmn, this);
            this.listenTo(this.notes, 'filter:uml', this.activeUml, this);
            this.listenTo(this.notes, 'filter:umlsequence', this.activeUmlsequence, this);
            this.listenTo(this.notes, 'filter:umlusecase', this.activeUmlusecase, this);
            this.listenTo(this.notes, 'filter:wireframe', this.activeWireframe, this);
           
            // Filter
            this.listenTo(this.notes, 'filter:all', this.activeAll, this);
            this.listenTo(this.notes, 'filter:favorite', this.favoriteNotes, this);
            this.listenTo(this.notes, 'filter:trashed', this.trashedNotes, this);
            this.listenTo(this.notes, 'filter:search', this.searchNotes, this);
           
            // Navigation with keys
            this.listenTo(this.notes, 'navigateTop', this.toPrevNote, this);
            this.listenTo(this.notes, 'navigateBottom', this.toNextNote, this);
        },

        /**
         * Fetch notes, then show it
         * @param {type} args
         */
        listNotes: function (args)
        {
            this.args = _.clone(args) || this.args;
            App.settings.pagination = parseInt(App.settings.pagination);

            this.query = {};
            
            //borra el contenido seleccionado
            App.AppNavbar.trigger('resetContent', this.args);
            
            console.log('this.args');
            console.log(this.args);
            // Filter
            if (_.isNull(this.args) === false && this.args.filter)
            {
                this.lastFilter = 'filter:' + this.args.filter;
                this.notes.trigger('filter:' + this.args.filter);
            } else {
                this.lastFilter = 'filter:all';
                this.notes.trigger('filter:all');
            }
        },
        
        loadNextPage: function()
        {
          if (!this.onScrollFire)
          {
           this.onScrollFire = true;
           this.notes.trigger('showMore');
           //remove false para que no haga reset en la
           //colección cuando carga nuevo contenido
            $.when( this.notes.getNextPage({remove: false}))
                .done(this.endLoadNextPage);
          }
        },
        endLoadNextPage: function()
        {
          this.onScrollFire = false;
          this.notes.trigger('onFinishedLoad');
        },
        
        /**
         * 
         * @param {type} args
         */
        listSvg: function (args)
        {
           this.args = _.clone(args) || this.args;
           
           this.query = {};
           
           //borra todo el contenido
           App.AppNavbar.trigger('resetContent', this.args);
           
           if ( this.args.docType === 'all')
           {
             this.notes.lastFilter = 'filter:all';
             this.notes.trigger('filter:all');    
           }
           else if ( this.args.docType === 'fav')
           {
             this.notes.lastFilter = 'filter:fav';
             this.notes.trigger('filter:fav');    
           }
           else if ( this.args.docType === 'txt')
           {
             this.notes.lastFilter = 'filter:txt';
             this.notes.trigger('filter:txt');    
           }
           else if ( this.args.docType === 'dwg')
           {
             this.notes.lastFilter = 'filter:dwg';
             this.notes.trigger('filter:dwg');    
           }
           else if ( this.args.docType === 'psd')
           {
             this.notes.lastFilter = 'filter:psd';
             this.notes.trigger('filter:psd');    
           }
           else if ( this.args.docType === 'gif')
           {
             this.notes.lastFilter = 'filter:gif';
             this.notes.trigger('filter:gif');    
           }
           else if ( this.args.docType === 'stl')
           {
             this.notes.lastFilter = 'filter:stl';
             this.notes.trigger('filter:stl');    
           }
           else if ( this.args.docType === 'odp')
           {
             this.notes.lastFilter = 'filter:odp';
             this.notes.trigger('filter:odp');    
           }
           else if ( this.args.docType === 'ods')
           {
             this.notes.lastFilter = 'filter:ods';
             this.notes.trigger('filter:ods');    
           }
           else if ( this.args.docType === 'xls')
           {
             this.notes.lastFilter = 'filter:xls';
             this.notes.trigger('filter:xls');    
           }
           else if ( this.args.docType === 'ppt')
           {
             this.notes.lastFilter = 'filter:ppt';
             this.notes.trigger('filter:ppt');    
           }
           else if ( this.args.docType === 'odt')
           {
             this.notes.lastFilter = 'filter:odt';
             this.notes.trigger('filter:odt');    
           }
           else if ( this.args.docType === 'doc')
           {
             this.notes.lastFilter = 'filter:doc';
             this.notes.trigger('filter:doc');    
           }
           else if ( this.args.docType === 'zip')
           {
             this.notes.lastFilter = 'filter:zip';
             this.notes.trigger('filter:zip');    
           }
           else if ( this.args.docType === 'svg')
           {
             this.notes.lastFilter = 'filter:svg';
             this.notes.trigger('filter:svg');    
           }
           else if (this.args.docType === 'pdf')
           {
             this.notes.lastFilter = 'filter:pdf';
             this.notes.trigger('filter:pdf');     
           }
           else if (this.args.docType === 'rawchart')
           {
             this.notes.lastFilter = 'filter:rawchart';
             this.notes.trigger('filter:rawchart');   
           }
           else if (this.args.docType === 'mindmaps')
           {
             this.notes.lastFilter = 'filter:mindmaps';
             this.notes.trigger('filter:mindmaps');   
           }
           else if (this.args.docType === 'bpmn')
           {
             this.notes.lastFilter = 'filter:bpmn';
             this.notes.trigger('filter:bpmn');   
           }
           else if (this.args.docType === 'epc')
           {
             this.notes.lastFilter = 'filter:epc';
             this.notes.trigger('filter:epc');  
           }
           else if (this.args.docType === 'uml')
           {
             this.notes.lastFilter = 'filter:uml';
             this.notes.trigger('filter:uml');  
           }
           else if (this.args.docType === 'umlsequence')
           {
             this.notes.lastFilter = 'filter:umlsequence';
             this.notes.trigger('filter:umlsequence');   
           }
           else if (this.args.docType === 'umlusecase')
           {
             this.notes.lastFilter = 'filter:umlusecase';
             this.notes.trigger('filter:umlusecase');       
           }
           else if (this.args.docType === 'wireframe')
           {
             this.notes.lastFilter = 'filter:wireframe';
             this.notes.trigger('filter:wireframe');  
           }
        },
        
        
        activeAll: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: 'all',
                trash: false,
                isFavorite: 0,
                searchText: this.notes.searchText
            });

            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        
        activeFav: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: 'fav',
                trash: false,
                isFavorite: 0,
                searchText: this.notes.searchText
            });

            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        
        activeZip: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: 'zip',
                trash: false,
                isFavorite: 0,
                searchText: this.notes.searchText
            });

            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        
        activeDwg: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: 'dwg',
                trash: false,
                isFavorite: 0,
                searchText: this.notes.searchText
            });

            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        
        activePsd: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: 'psd',
                trash: false,
                isFavorite: 0,
                searchText: this.notes.searchText
            });

            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        
        activeGif: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: 'gif',
                trash: false,
                isFavorite: 0,
                searchText: this.notes.searchText
            });

            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        
        activeStl: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: 'stl',
                trash: false,
                isFavorite: 0,
                searchText: this.notes.searchText
            });

            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        
        activeOdp: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: 'odp',
                trash: false,
                isFavorite: 0,
                searchText: this.notes.searchText
            });

            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        
        activeOds: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: 'ods',
                trash: false,
                isFavorite: 0,
                searchText: this.notes.searchText
            });

            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        
        activeOdt: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: 'odt',
                trash: false,
                isFavorite: 0,
                searchText: this.notes.searchText
            });

            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        
        activePpt: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: 'ppt',
                trash: false,
                isFavorite: 0,
                searchText: this.notes.searchText
            });

            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        
        activeXls: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: 'xls',
                trash: false,
                isFavorite: 0,
                searchText: this.notes.searchText
            });

            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        
        activeDoc: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: 'doc',
                trash: false,
                isFavorite: 0,
                searchText: this.notes.searchText
            });

            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        
        activePdf: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: 'pdf',
                trash: false,
                isFavorite: 0,
                searchText: this.notes.searchText
            });
            
            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        
        activeTxt: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: 'txt',
                trash: false,
                isFavorite: 0,
                searchText: this.notes.searchText
            });
            
            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        /**
         * Show only active svg
         */
        activeSvg: function ()
        {
           this.notes.setCollectionParams(
           {
                docType: 'svg',
                trash: false,
                isFavorite: false
           });
            
           $.when(
            this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },
        
         /**
         * Show only active activeMindmaps
         */
        activeMindmaps: function ()
        {
           this.notes.setCollectionParams(
           {
                docType: 'mindmaps',
                trash: false,
                isFavorite: false
           });
           
           $.when(
            this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
            
        },
            
        /**
        * Show only active activeEpc
        */
        activeEpc: function ()
        {
           this.notes.setCollectionParams(
           {
                docType: 'epc',
                trash: false,
                isFavorite: false
           });
           
           $.when(
            this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
            
        },

        /**
        * Show only active activeEpc
        */
        activeBpmn: function ()
        {
           this.notes.setCollectionParams(
           {
                docType: 'bpmn',
                trash: false,
                isFavorite: false
           });
           
           $.when(
            this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
            
        },    
            
        /**
        * Show only active activeEpc
        */
        activeUml: function ()
        {
           this.notes.setCollectionParams(
           {
                docType: 'uml',
                trash: false,
                isFavorite: false
           });
           
           $.when(
            this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
            
        },  
        
        /**
        * Show only active activeUmlsequence
        */
        activeUmlsequence: function ()
        {
           this.notes.setCollectionParams(
           {
                docType: 'umlsequence',
                trash: false,
                isFavorite: false
           });
           
           $.when(
            this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
            
        },  
        
        /**
        * Show only active activeUmlsequence
        */
        activeUmlusecase: function ()
        {
           this.notes.setCollectionParams(
           {
                docType: 'umlusecase',
                trash: false,
                isFavorite: false
           });
           
           $.when(
            this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
            
        },  

        /**
        * Show only active activeUmlsequence
        */
        activeWireframe: function ()
        {

           this.notes.setCollectionParams(
           {
                docType: 'wireframe',
                trash: false,
                isFavorite: false
           });
           
           $.when(
            this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
            
        },  
          
        /**
         * Show only active rawchart
         */
        activeRawchart: function ()
        {
           this.notes.setCollectionParams(
           {
                docType: 'rawchart',
                trash: false,
                isFavorite: false
           });
           
           $.when(
            this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
            
        },
        
        
        /**
         * Show only active notes
         */
        activeNotes: function ()
        {
           
           this.notes.setCollectionParams(
            {
                docType: 'note',
                trash: false,
                isFavorite: false,
                searchText: this.notes.searchText
            });
           
           $.when(
                this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
            
        },

        /**
         * Show favorite notes
         */
        favoriteNotes: function ()
        {
            this.notes.setCollectionParams(
            {
                docType: false,
                trash: false,
                isFavorite: 1,
                searchText: this.notes.searchText
            });
            
            $.when(
             this.notes.fetch({ data: {page: this.args.page}})
            ).done(this.showSidebar);
        },

        /**
         * Show only removed notes
         */
        trashedNotes: function ()
        {
           //this.args.docType = 'trash';
            
           this.notes.setCollectionParams(
           {
                docType: false,
                trash: 1,
                isFavorite: false
           });
           
            $.when(
                    this.notes.fetch({ data: { page: this.args.page}})
            ).done(this.showSidebar);
        },

        /**
         * Notes with notebook
         */
        notebooksNotes: function ()
        {
            $.when(
                this.notes.fetch({
                    conditions: (  {notebookId : this.args.query} )
                })
            ).done(this.showSidebar);
        },

        /**
         * Notes which tagged with :tag
         */
        taggedNotes: function ()
        {
            var self = this,
                notes;
            $.when(
                this.notes.fetch({
                    conditions: ( {trash : 0} )
                })
            ).done(
                function () {
                    notes = self.notes.getTagged(self.args.query);
                    self.notes.reset(notes);
                    self.showSidebar();
                }
            );
        },

        /**
         * Search notes
         */
        searchNotes: function ()
        {
            var self = this,
                notes;
            $.when(
                // Fetch without limit, because with encryption, searching is impossible
                this.notes.fetch({
                    conditions: {trash : 0}
                })
            ).done(
                function () {
                    notes = self.notes.search(self.args.query);
                    self.notes.reset(notes);
                    self.showSidebar();
                }
            );
        },

        /**
         * muestra la lista de elementos
         */
        showSidebar: function ()
        {
            
            //: TODO mira el error. No cumple las condiciones
            // del fetch
            // esto es un mal arreglo
            //this.notes.filterList(this.args.filter, this.args.query);
            
            // Pagination
            /*
            if (this.notes.length > App.settings.pagination) {
                var notes = this.notes.pagination(this.args.page, App.settings.pagination);
                this.notes.reset(notes);
            }
            else if (this.args.page > 1) {
                this.notes.reset([]);
            }*/

            /*
            // Next page
            if (this.notes.length === App.settings.pagination) {
                this.args.next = this.args.page + App.settings.pagination;
            } else {
                this.args.next = this.args.page;
            }

            // Previous page
            if (this.args.page > App.settings.pagination) {
                this.args.prev = this.args.page - App.settings.pagination;
            }*/
            
            // Next page
            /*
            if (this.notes.length === App.settings.pagination) {
                this.args.next = this.args.page + 1;
            } else {
                this.args.next = this.args.page;
            }

            // Previous page
            if (this.args.page > App.settings.pagination) {
                this.args.prev = this.args.page - 1;
            }*/
            /*
            if ((this.args.page == 0) || (this.args.page == 1))
            {
              this.args.next = (this.notes.state.totalPages < 2)?false:2;
              this.args.prev = false;
            }
            else if (this.args.page == this.notes.state.totalPages)
            {
               this.args.next = false;
               this.args.prev = this.args.page - 1;     
            }
            else
            {
               this.args.next = this.args.page + 1;
               this.args.prev = this.args.page - 1;     
            }*/
            
            var View = new NotesSidebar({
                collection : this.notes,
                args       : this.args
            });
            
            var appUserMenu = new AppUserMenu({
                collection : this.notes,
                args       : this.args
            });
            
            App.sidebar.show(View);

            App.toolButtoms.show(appUserMenu);
            
            //si no tiene contenido en el sidebar
            //borra el contenido
            if (this.notes.length === 0)
            {
               App.content.show(new NoteViewMsg(this.args));
            }
            else
            {
               App.content.reset();
            }
            
            App.trigger('doc:loaded');
            
        },

        changeFocus: function (args)
        {
            if ( !args ) { return; }
            this.args = args;
            this.notes.trigger('changeFocus', args.id);
        },

        /**
         * redirección a note
         * 
         * @param {type} note
         */
        toNote: function (note)
        {
            if ( !note) { return; }

            var url = URI.note(this.args, note);
            return App.navigate(url, true);
        },

        /**
         * Navigate to next note
         */
        toNextNote: function ()
        {
            console.log('toNextNote');
            console.log(this.notes.length);
            // Nothing is here
            if (this.notes.length === 0) {
                return;
            }

            var note;
            try {
                note = this.notes.get(this.args.id);
                note = note.next();
            }
            catch (e) {
                note = this.notes.at(0);
            }

            if (this.notes.length >= App.settings.pagination && this.notes.indexOf(note) < 0) {
                this.notes.trigger('nextPage');
            }

            return this.toNote(note);
        },

        /**
         * Navigate to previous note
         */
        toPrevNote: function ()
        {
            // Nothing is here
            if (this.notes.length === 0) {
                return;
            }

            var note;
            try {
                note = this.notes.get(this.args.id);
                note = note.prev();
            }
            catch (e) {
                note = this.notes.last();
            }

            if (this.args.page > 1 && this.notes.indexOf(note) < 0) {
                this.notes.trigger('prevPage');
            }

            return this.toNote(note);
        }

    });

    return List.Controller;
});
