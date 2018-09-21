/*global define*/
define([
    'underscore',
    'backbone',
    /*'migrations/note',*/
    'collections/removed',
    'libs/utils',
    'arquematics',
    //'indexedDB'
], function (_, Backbone, /*NotesDB,*/ Removed, Utils, arquematics) {
    'use strict';

    var Model = Backbone.Model.extend({
        idAttribute: 'id',
        urlRoot: '/explorer/notebook/',
        //database: NotesDB,
        //url: '/doc/notebook/',
        //storeName: 'notebooks',

        defaults: {
            'id'           : undefined,
            'pass'         : '',
            'parentId'     : '',
            'name'         : '',
            'synchronized' : 0,
            'count'        : 0,
            'updated'      : Date.now()
        },

        validate: function (attrs) {
            var errors = [];
            if (attrs.name === '') {
                errors.push('name');
            }

            if (errors.length > 0) {
                return errors;
            }
        },

        initialize: function () {
            if (typeof this.id === 'number') {
                this.set('id', this.id.toString());
                this.set('parentId', this.get('parentId').toString());
            }

            this.on('removed:note', this.removeCount);
            this.on('add:note', this.addCount);
            
            this.isServerSave = !(this.isNew());
            if (!this.isServerSave) {
                //genera un pass aleatorio
                //y lo encripta con la clave local arquematics.storeKey
                this.set('pass', arquematics.simpleCrypt.encryptHex(arquematics.storeKey , arquematics.utils.randomKeyString(50)))
                this.updateDate();
            } 
        },

        encrypt: function (data) {
            
            var dataClone = data || this.toJSON();
            
            this.set('name',  arquematics.simpleCrypt.encryptHex(arquematics.storeKey , _.escape(dataClone.name)));

            return this.toJSON();
        },

        decrypt: function () {
             var data = this.toJSON();

            if (!this.isNew()) {
                data.pass = arquematics.simpleCrypt.decryptHex(arquematics.storeKey , data.pass);
                data.name = arquematics.simpleCrypt.decryptHex(arquematics.storeKey , data.name);       
            }
   
            return data;
            
            /*
            var data = this.toJSON(),
                auth = getAuth();

            data.name = auth.decrypt(data.name);
            return data;*/
        },

        updateDate: function () {
            this.set('updated', Date.now());
            this.set('synchronized', 0);
        },

        /**
         * Saves model's id for sync purposes, then destroys it
         */
        destroySync: function () {
            return new Removed().newObject(this, arguments);
        },

        addCount: function () {
            if (this.get('id') === 0) {
                return;
            }
            this.save({
                'count': this.get('count') + 1
            });
        },

        removeCount: function () {
            if (this.get('id') === 0) {
                return;
            }
            this.save({
                'count': this.get('count') - 1
            });
        },

        next: function () {
            if (this.collection) {
                return this.collection.at(this.collection.indexOf(this) + 1);
            }
        },

        prev: function () {
            if (this.collection) {
                return this.collection.at(this.collection.indexOf(this) - 1);
            }
        }

    });

    return Model;
});
