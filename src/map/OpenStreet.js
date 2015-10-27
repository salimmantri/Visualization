"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "topojson", "./Layer", "./Utility", "css!./OpenStreet"], factory);
    } else {
        root.map_OpenStreet = factory(root.d3, root.topojson, root.map_Layer, root.map_Utility);
    }
}(this, function (d3, topojson, Layer, Utility) {
    function OpenStreet() {
        Layer.call(this);
    }
    OpenStreet.prototype = Object.create(Layer.prototype);
    OpenStreet.prototype.constructor = OpenStreet;
    OpenStreet.prototype._class += " map_OpenStreet";

    OpenStreet.prototype._openstreetmapCopyright = "© OpenStreetMap contributors";

    OpenStreet.prototype.layerEnter = function (base, svgElement, domElement) {
        Layer.prototype.layerEnter.apply(this, arguments);

        this._tile = Utility.Tile();
        this._openStreetTransform = svgElement.append("g");
        this._openStreet = this._openStreetTransform.append("g");
        this._copyright = svgElement.append("text")
            .attr("x", -100)
            .attr("y", -100)
            .style("opacity", 0.5)
            .text(this._openstreetmapCopyright)
        ;
        this._copyrightBBox = this._copyright.node().getBBox();
    };

    OpenStreet.prototype.layerUpdate = function (base) {
        if (!this.visible()) {
            this._copyright.text("");
        } else {
            this._copyright
                .attr("x", base.width() - this._copyrightBBox.width - this._copyrightBBox.height / 2)
                .attr("y", base.height() - this._copyrightBBox.height / 2)
                .text(this._openstreetmapCopyright)
            ;
        }
    };

    OpenStreet.prototype.layerZoomed = function (base) {
        var tiles = [];
        if (this.visible()) {
            var maxSize = base.project(-85, 180);
            if (!maxSize) {
                maxSize = [base.width(), base.height()];
            }
            this._tile
                .size([Math.min(base.width(), maxSize[0]), Math.min(base.height(), maxSize[1])])
                .scale(base._zoom.scale() * (1 << 12))
                .translate(base._zoom.translate())
            ;
            tiles = this._tile();
            this._openStreetTransform
                .attr("transform", "scale(" + tiles.scale + ")translate(" + tiles.translate + ")")
            ;
        }
        var image = this._openStreet.selectAll("image").data(tiles, function (d) { return d[2] + "/" + d[0] + "/" + d[1]; });
        image.enter().append("image")
            .attr("xlink:href", function (d) { return "http://" + ["a", "b", "c"][Math.random() * 3 | 0] + ".tile.openstreetmap.org/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
            .attr("width", 1)
            .attr("height", 1)
            .attr("x", function (d) { return d[0]; })
            .attr("y", function (d) { return d[1]; })
            .style("opacity", 0.0)
            .transition().duration(500)
            .style("opacity", 1)
        ;
        image.exit()
            .remove()
        ;
    };

    return OpenStreet;
}));