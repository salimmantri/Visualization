"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["src/layout/Grid", "src/chart/Summary", "src/form/Slider", "src/chart/Column"], factory);
    }
}(this, function (Grid, Summary, Slider, Column) {
    function Main(target) {
        Grid.call(this);
    }
    Main.prototype = Object.create(Grid.prototype);
    Main.prototype.constructor = Main;

    Main.prototype.enter = function (domNode, element) {
        Grid.prototype.enter.apply(this, arguments);
        this.slider = new Slider()
            .showPlay(true)
        ;
        this.setContent(0, 0, this.slider, null, 2, 6);
        this.summary = new Summary()
            .fixedSize(false)
            .columns(["Test"])
            .data([["Calue"]])
        ;
        this.setContent(0, 6, this.summary, null, 2, 3);
        this.column = new Column();
        this.setContent(2, 0, this.column, null, 6, 9);
    }
    Main.prototype.update = function (domNode, element) {
        Grid.prototype.update.apply(this, arguments);
    }
    Main.prototype.exit = function (domNode, element) {
        Grid.prototype.exit.apply(this, arguments);
    }

    return Main;
}));