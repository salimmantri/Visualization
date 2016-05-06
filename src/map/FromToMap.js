"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["./GMapLayered", "./Lines", "./Pins"], factory);
    } else {
        root.map_TestHeatMap = factory(root.map_GMapLayered, root.map_Lines, root.map_Pins);
    }
}(this, function (GMapLayered, Lines, Pins) {
    function FromToMap(target) {
        GMapLayered.call(this);

        this._lines = new Lines()
            .opacity(0.75)
        ;
        this._pins = new Pins()
            .opacity(0.75)
        ;
        var layers = [
            this._lines,
            this._pins
        ];
        this.layers(layers)
    }
    FromToMap.prototype = Object.create(GMapLayered.prototype);
    FromToMap.prototype.constructor = FromToMap;
    FromToMap.prototype._class += " map_FromToMap";

    FromToMap.prototype.publish("fromLat", null, "set", "From Latitude", function () { return this.columns(); });
    FromToMap.prototype.publish("fromLong", null, "set", "From Latitude", function () { return this.columns(); });
    FromToMap.prototype.publish("toLat", null, "set", "From Latitude", function () { return this.columns(); });
    FromToMap.prototype.publish("toLong", null, "set", "From Latitude", function () { return this.columns(); });

    FromToMap.prototype.enter = function (domNode, element) {
        GMapLayered.prototype.enter.apply(this, arguments);
    };

    FromToMap.prototype.update = function (domNode, element) {
        var fromLatIdx = this._db.fieldByLabel(this.fromLat()).idx;
        var fromLongIdx = this._db.fieldByLabel(this.fromLong()).idx;
        var toLatIdx = this._db.fieldByLabel(this.toLat()).idx;
        var toLongIdx = this._db.fieldByLabel(this.toLong()).idx;
        var fromPins = {};
        var toPins = {};
        var allPins = [];
        var allEdges = [];
        this.data().forEach(function (row) {
            if (!fromPins[row[fromLatIdx] + "_" + row[fromLongIdx]]) {
                fromPins[row[fromLatIdx] + "_" + row[fromLongIdx]] = true;
                allPins.push([row[fromLatIdx], row[fromLongIdx], { fillColor: "green" }]);
            }
            if (!toPins[row[toLatIdx] + "_" + row[toLongIdx]]) {
                toPins[row[toLatIdx] + "_" + row[toLongIdx]] = true;
                allPins.push([row[toLatIdx], row[toLongIdx], { fillColor: "red" }]);
            }
            allEdges.push([row[fromLatIdx], row[fromLongIdx], row[toLatIdx], row[toLongIdx]]);
        });
        this._lines.data(allEdges);
        this._pins.data(allPins);

        GMapLayered.prototype.update.apply(this, arguments);
    };

    return FromToMap;
}));
