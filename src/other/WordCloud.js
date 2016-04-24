"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/SVGWidget", "../api/I2DChart", "../api/ITooltip", "d3-cloud", "css!./WordCloud"], factory);
    } else {
        root.other_WordCloud = factory(root.d3, root.common_SVGWidget, root.api_I2DChart, root.api_ITooltip, root.d3.layout.cloud);
    }
}(this, function (d3, SVGWidget, I2DChart, ITooltip, D3Cloud) {
    function WordCloud() {
        SVGWidget.call(this);
        I2DChart.call(this);
        ITooltip.call(this);

        this._prevOffsetX = this.offsetX();
        this._prevOffsetY = this.offsetY();
        this._prevZoom = this.zoom();
    }
    WordCloud.prototype = Object.create(SVGWidget.prototype);
    WordCloud.prototype.constructor = WordCloud;
    WordCloud.prototype.mixin(I2DChart);
    WordCloud.prototype.mixin(ITooltip);
    WordCloud.prototype._class += " other_WordCloud";

    WordCloud.prototype.publish("fontFamily", "Impact", "string", "Font Name", null, { tags: ["Basic"] });
    WordCloud.prototype.publish("fontSizeFrom", 6, "number", "Font Size From", null, { tags: ["Basic"] });
    WordCloud.prototype.publish("fontSizeTo", 48, "number", "Font Size To", null, { tags: ["Basic"] });
    WordCloud.prototype.publish("angleFrom", -60, "number", "Angle From", null, { tags: ["Basic"] });
    WordCloud.prototype.publish("angleTo", 60, "number", "Angle To", null, { tags: ["Basic"] });
    WordCloud.prototype.publish("angleCount", 5, "number", "Angle Count", null, { tags: ["Basic"] });
    WordCloud.prototype.publish("padding", 0, "number", "Padding", null, { tags: ["Intermediate"] });
    WordCloud.prototype.publish("scaleMode", "linear", "set", "Text scaling mode", ["linear", "log", "sqrt", "pow"], { tags: ["Intermediate"] });
    WordCloud.prototype.publish("spiral", "archimedean", "set", "Text scaling mode", ["archimedean", "rectangular"], { tags: ["Intermediate"] });
    WordCloud.prototype.publish("offsetX", 0, "number", "X offset", null, { tags: ["Advanced"] });
    WordCloud.prototype.publish("offsetY", 0, "number", "Y offset", null, { tags: ["Advanced"] });
    WordCloud.prototype.publish("zoom", 1, "number", "Zoom", null, { tags: ["Advanced"] });

    WordCloud.prototype.enter = function (domNode, element) {
        SVGWidget.prototype.enter.apply(this, arguments);

        this._root = element.append("g");
        this._canvas = document.createElement("canvas");

        var context = this;
        this._zoom = d3.behavior.zoom()
            .scaleExtent([0.1, 10])
            .on("zoom", function () {
                context.zoomed(context._zoom, d3.event.translate, d3.event.scale);
            })
        ;
        element.call(this._zoom);

        this._cloud = new D3Cloud()
            .canvas(this._canvas)
        ;
        this
            .tooltipHTML(function (d) {
                return context.tooltipFormat({ label: d.__viz_0, value: d.__viz_1 });
            })
        ;
    };

    WordCloud.prototype.update = function (domNode, element) {
        SVGWidget.prototype.update.apply(this, arguments);

        var mappedData = this.mappedData().map(function (row) {
            var retVal = {};
            for (var key in row) {
                retVal["__viz_" + key] = row[key];
            }
            return retVal;
        });

        this._palette = this._palette.switch(this.paletteID());
        if (this.useClonedPalette()) {
            this._palette = this._palette.cloneNotExists(this.paletteID() + "_" + this.id());
        }

        this.zoomed(this, [this.offsetX(), this.offsetY()], this.zoom());

        var context = this;
        var extent = d3.extent(mappedData, function (d) { return d.__viz_1; });
        var scale = d3.scale[this.scaleMode()]().domain(extent).range([this.fontSizeFrom(), this.fontSizeTo()]);
        var angleDomain = d3.scale.linear().domain([0, context.angleCount() - 1]).range([context.angleFrom(), context.angleTo()]);

        this._cloud.stop()
            .size([this.width(), this.height()])
            .words(mappedData)
            .font(this.fontFamily())
            .padding(this.padding())
            .spiral(this.spiral())
            .text(function (d) { return d.__viz_0; })
            .fontSize(function (d) { return scale(d.__viz_1); })
            .rotate(function () { return angleDomain(~~(Math.random() * context.angleCount())); })
            .on("end", draw)
            .start()
        ;

        function draw(data, bounds) {
            var text = context._root.selectAll("text")
                .data(data, function (d) { return d.__viz_0 ? d.__viz_0.toLowerCase() : ""; })
            ;
            text.enter().append("text")
                .attr("text-anchor", "middle")
                .text(function (d) { return d.__viz_0; })
                .on("click", function (d) {
                    context.click({ label: d.__viz_0, weight: d.__viz_1 });
                })
                .style("opacity", 1e-6)
                .on("mouseout.tooltip", context.tooltip.hide)
                .on("mousemove.tooltip", context.tooltip.show)
            ;
            text
                .style("font-size", function (d) { return scale(d.__viz_1) + "px"; })
                .style("font-family", context.fontFamily())
                .transition().duration(1000)
                    .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
                    .style("fill", function (d) { return context._palette(d.__viz_0 ? d.__viz_0.toLowerCase() : ""); })
                    .style("opacity", 1)
            ;
            text.exit().transition().duration(1000)
                .style("opacity", 1e-4)
                .remove()
            ;
        }
    };

    WordCloud.prototype.zoomed = function (source, translate, scale) {
        if (translate[0] !== this._prevOffsetX || translate[1] !== this._prevOffsetY || scale !== this._prevZoom) {
            this._root.attr("transform", "translate(" + translate[0] + "," + translate[1] + ")" + "scale(" + scale + ")");
            switch (source) {
                case this:
                    this._zoom
                        .scale(scale)
                        .translate(translate)
                    ;
                    break;
                case this._zoom:
                    this.offsetX(translate[0]);
                    this.offsetY(translate[1]);
                    this.zoom(scale);
                    break;
            }
            this._prevOffsetX = translate[0];
            this._prevOffsetY = translate[1];
            this._prevZoom = scale;
        }
    };

    return WordCloud;
}));