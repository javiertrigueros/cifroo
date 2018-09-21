/*global define*/
define([
    'underscore',
    'app',
    'helpers/uri',
    'marionette',
    'models/note'
], function (_, App, URI, Marionette, NoteModel) {
    'use strict';

    var Remove = App.module('AppNote.Remove');

    /**
     * Removes an existing note
     */
    Remove.Controller = Marionette.Controller.extend({

        initialize: function () {
            _.bindAll(this, 'remove', 'doRemove', 'redirect');
        },

        remove: function (args) {
            this.note = new NoteModel({ id : args.id });
            $.when(this.note.fetch()).done(this.doRemove);
        },

        doRemove: function () {
            // Destroy if note is already in trash
            if (Number(this.note.get('trash')) === 1)
            {
                var self = this;
                
                $.when(this.note.destroy()).done(function () {
                    self.redirect();
                });
            }
            else {
                this.note.updateDate();
                $.when(this.note.save({'trash' : 1}))
                 .done(this.redirect);
            }
        },

        redirect: function ()
        {
            App.content.reset();
            App.trigger('notes:rerender');

            App.navigate(URI.link('/notes'), true);
            App.trigger('notes:next');
        }

    });

    return Remove.Controller;
});
