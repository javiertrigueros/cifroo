/* global define */
define([
    'underscore',
    'jquery',
    'app',
    'marionette',
    'apps/navbar/show/view'
], function ( _, $, App, Marionette, NavbarView ) {
    'use strict';

    var Navbar = App.module('AppNavbar.Show');

    /**
     * Navbar show controller
     */
    Navbar.Controller = Marionette.Controller.extend({

        currentApp: App.currentApp || {},

        initialize: function () {
            _.bindAll(this, 'show');
        },

        show: function (args) {
            App.home.show(new NavbarView({
                args: _.clone(args)
            }));
        },
        /**
         * borra todos los contenido de la app
         */
        reset: function (args){
            App.sidebar.empty();
            App.content.empty();
            App.toolButtoms.empty();
        },
        
        resetSidebar: function (args){
            App.sidebar.empty();
        }
    });

    return Navbar.Controller;
});
