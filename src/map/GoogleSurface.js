"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../layout/AbsoluteSurface", "./GMap2", "async!http://maps.google.com/maps/api/js?sensor=false", "css!./GMap"], factory);
    } else {
        root.map_GoogleSurface = factory(root.d3, root.common_HTMLWidget);
    }
}(this, function (d3, AbsoluteSurface, GMap2) {
    function GoogleSurface() {
        AbsoluteSurface.call(this);

        this._map = new GMap2();
    }
    GoogleSurface.prototype = Object.create(AbsoluteSurface.prototype);
    GoogleSurface.prototype.constructor = GoogleSurface;
    GoogleSurface.prototype._class += " map_GoogleSurface";

    GoogleSurface.prototarget = function()

    return GoogleSurface;
}));
