/*global define*/
define([
    'backbone',
    /*'migrations/note'*/
], function (Backbone/*, NotesDB*/) {
    'use strict';

    /**
     * Model stores id of removed objects
     */
    var Removed = Backbone.Model.extend({
        idAttribute: 'id',
        //database: NotesDB,
        //url: '/doc/removed/',
        //storeName: 'removed',
        urlRoot: '/explorer/removed/',
        defaults: {
            id: undefined
        }

    });

    return Removed;
});
