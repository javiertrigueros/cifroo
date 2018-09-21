/*global define*/
define([
    'underscore',
    'app',
    'marionette',
    'models/note',
    'collections/files',
    //'helpers/uri',
    'apps/notes/show/views/noteView'
], function (_, App, Marionette, NoteModel,  FilesCollection , NoteView) {
    'use strict';

    var Show = App.module('AppNote.Show');

    /**
     * Controller shows note's content in App.content
     */
    Show.Controller = Marionette.Controller.extend({
        initialize: function () {
            _.bindAll(this, 'unTrashItem', 'showNote', 'showContent', 'fetchImages');
        },

        /**
         * Fetch note, then show it
         */
        showNote: function (args) {
            var that = this;
            
            this.args = args || this.args;
            this.note = new NoteModel({ id : this.args.id });
            //this.notebooks = new NotebooksCollection();
            this.files = new FilesCollection({url: function (){
                                                     return '/doc/note/' + that.note.get('id') + '/file'
                                                 }});
            
            /*
            $.when(this.note.fetch(), this.notebooks.fetch())
                .done(this.fetchImages);*/
            $.when(this.note.fetch())
                .done(this.fetchImages);
        },
        
        unTrashItem: function ()
        {
            App.content.reset();
            App.trigger('notes:rerender');
            App.trigger('notes:next');
        },
         
        redirectOut: function ()
        {
            window.location = App.userInfo.wall_url;
        },

        fetchImages: function () {
            $.when(
                this.files.fetchImages(this.note.get('images'),this.note.get('pass'))
            ).done(this.showContent);
        },

        showContent: function () 
        {
            console.log('showContent');
            var args = {
                model     : this.note,
                args      : this.args,
                files     : this.files
            };
            
             // Model events
            this.note.on('updateTaskProgress', this.updateTaskProgress, this);
            this.note.on('change', this.triggerChangeToSidebar, this);
            this.note.on('change:share', this.redirectOut, this);
            
            this.listenTo(this.note, 'change:trash', this.unTrashItem);

            App.content.show(new NoteView(args));
        },

        triggerChangeToSidebar: function () {
            App.trigger('notes:changeModel', this.note.get('id'));
        },

        updateTaskProgress: function (text) {
            /*
            this.note.set(_.extend(this.note.decrypt(), {
                'content': text.content,
                'taskCompleted': text.completed
            }));*/
             this.note.set(_.extend(this.note.toJSON(), {
                'content': text.content,
                'taskCompleted': text.completed
            }));

            //this.note.encrypt();
            this.note.trigger('update:any');
            this.note.save(this.note.toJSON());
        }

    });

    return Show.Controller;
});
