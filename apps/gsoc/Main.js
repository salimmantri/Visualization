"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["src/layout/Border"], factory);
    }
}(this, function (Border) {
    function Main(target) {
        Border.call(this);
    }
    Main.prototype = Object.create(Border.prototype);
    Main.prototype.constructor = Main;

    return Main;
}));