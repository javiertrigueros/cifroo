/* global define */
define([
    'underscore',
    'jquery',
    'marionette',
    'app',
    'apps/navbar/controller'
], function (_, $, Marionette, App, Show) {
    'use strict';

    /**
     * Module which shows navbar
     */
    var AppNavbar = App.module('AppNavbar', { startWithParent: false }),
        controller = new Show();

    function showNavbar (args) {
        controller.show(args || {});
    }
    
    function resetContent (args){
       controller.reset(args || {}); 
    }
    
    function resetNavbar(args){
       controller.reset(args || {}); 
    }

    AppNavbar.on('start', function () {
        App.log('AppNavbar has been started');
        showNavbar();
    });

    AppNavbar.on('stop', function () {
        App.log('AppNavbar has been stopped');
    });

    AppNavbar.on('titleChange', function (args) {
        showNavbar(args);
    });
    
    AppNavbar.on('resetContent', function (args) {
        resetContent(args);
    });
    
    AppNavbar.on('resetNavbar', function (args) {
        resetNavbar(args);
    });
    
    

    return AppNavbar;
});
