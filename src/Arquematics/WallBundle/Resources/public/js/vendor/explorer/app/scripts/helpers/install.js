/*global define*/
define([
    'underscore',
    'jquery',
    'app'
], function (_, $, App) {
    'use strict';

    var Install = App.module('App.Install', {startWithParent: false});

    Install.on('start', function () {
        Install.API.start();
    });

    Install.API = {
        start: function () {
            /*
            if (App.firstStart  === true) {
                this.createDoc();
            }
            else if (App.settings.appVersion !== App.constants.VERSION) {
                App.log('New version of application is available');

                // Increase appVersion
                configs.create(new configs.model({ name: 'appVersion', value: App.constants.VERSION }));
            }*/
            /*
            if (App.settings.appVersion !== App.constants.VERSION) {
                App.log('New version of application is available');

                // Increase appVersion
                configs.create(new configs.model({ name: 'appVersion', value: App.constants.VERSION }));
            }*/
        }

    };

    return Install.API;
});
