"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/CanvasWidget", "simpleheat"], factory);
    } else {
        root.other_Heat = factory(root.d3, root.common_CanvasWidget, root.simpleheat);
    }
}(this, function (d3, CanvasWidget, simpleheat) {
    function Heat() {
        CanvasWidget.call(this);
    }
 
    Heat.prototype = Object.create(CanvasWidget.prototype);
    Heat.prototype._class += " other_Heat";
    Heat.prototype.publish("radius", 25, "number");
    Heat.prototype.publish("blur", 15, "number");
    Heat.prototype.publish("max", 1, "number");
    Heat.prototype.publish("gradient", {}, "object");
 
    Heat.prototype.testData = function () {
        this
            .data([[340, 280, 0.22532552290509789], [279, 78, 0.17218748760882907], [328, 336, 0.09651770381968094], [44, 263, 0.3316061590758984], [214, 477, 0.34511952287135683], [195, 485, 0.47588339388219036], [374, 396, 0.271679226500542], [360, 148, 0.18736486936235697], [80, 333, 0.8888903185554132], [202, 439, 0.8072545133759657], [347, 326, 0.7121907931949589], [214, 93, 0.8450257030767434], [427, 54, 0.9070942314279923], [338, 375, 0.7678188486462785], [135, 350, 0.748831574602582], [414, 146, 0.17446160174067626], [134, 454, 0.3971279668693425], [76, 166, 0.24240573560820156], [103, 1, 0.9879741685278576], [271, 438, 0.05501944785473689]]
        )
        ;
        return this;
    };

    Heat.prototype.drawHeatMap = function() {
        if (this.data().length === 4) {
            this.data().map(function(a) { return a.splice(0,3); });
        }
        this.heat.data(this.data());

        if(this.radius()){
            this.heat.radius(this.radius(), this.blur());
        }

        this.heat.draw();
    };
 
    Heat.prototype.data = function (_) {
        var retVal = CanvasWidget.prototype.data.apply(this, arguments);
        if (arguments.length) {
            this._vizData = _.map(function (row) {
                var retVal = {};
                for (var key in row) {
                    retVal["__viz_" + key] = row[key];
                }
                return retVal;
            });
        }
        return retVal;
    };
 
    Heat.prototype.enter = function (domNode, element) {
        CanvasWidget.prototype.enter.apply(this, arguments);
        this.resize(this._size);
        this.heat = simpleheat(domNode);
        this.drawHeatMap();
    };
 
    Heat.prototype.update = function (domNode, element) {
        CanvasWidget.prototype.update.apply(this, arguments);
        this.drawHeatMap();
    };

    Heat.prototype.render = function (callback) {
        CanvasWidget.prototype.render.apply(this, arguments);
        this.drawHeatMap();
    };
 
    return Heat;
}));