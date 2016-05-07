"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/SVGWidget", "../common/PropertyExt", "./XYAxis", "../api/INDChart", "../api/ITooltip", "../common/Palette", "d3-box", "css!./BoxPlot"], factory);
    } else {
        root.chart_HexBin = factory(root.d3, root.common_SVGWidget, root.common_PropertyExt, root.chart_XYAxis, root.api_INDChart, root.api_ITooltip, root.common_Palette);
    }
}(this, function (d3, SVGWidget, PropertyExt, XYAxis, INDChart, ITooltip, Palette, D3Box) {
    D3Box = D3Box || d3.box || window.d3.box;

    function Column(owner) {
        PropertyExt.call(this);
        this._owner = owner;
    }
    Column.prototype = Object.create(PropertyExt.prototype);
    Column.prototype.constructor = Column;
    Column.prototype._class += " graph_Sankey.Column";

    Column.prototype.publish("label", null, "set", "Field", function () { return this._owner ? this._owner.origColumns() : []; }, { optional: true });

    function BoxPlot(target) {
        XYAxis.call(this);
        INDChart.call(this);
        ITooltip.call(this);

        this._d3Box = new D3Box();
    }
    BoxPlot.prototype = Object.create(XYAxis.prototype);
    BoxPlot.prototype.constructor = BoxPlot;
    BoxPlot.prototype._class += " chart_BoxPlot";
    BoxPlot.prototype.implements(INDChart.prototype);
    BoxPlot.prototype.implements(ITooltip.prototype);

    BoxPlot.prototype.publish("sourceColumns", [], "propertyArray", "Source Columns", null, { autoExpand: Column });
    BoxPlot.prototype.publish("aggregateColumn", null, "set", "Aggregate Column", function () { return this.origColumns(); }, { optional: true });

    BoxPlot.prototype.origColumns = XYAxis.prototype.columns;
    BoxPlot.prototype.columns = function (_) {
        var retVal = this.origColumns.apply(this, arguments);
        if (!arguments.length) {
            return ["Series", "Values"];
        }
        return retVal;
    };

    var origData = XYAxis.prototype.data;
    BoxPlot.prototype.data = function (_) {
        var retVal = origData.apply(this, arguments);
        if (!arguments.length) {
            var sourceColumns = this.sourceColumns().filter(function (col) { return col.label(); });
            if (!sourceColumns.length) {
                return [];
            }
            var aggregateField = this._db.fieldByLabel(this.aggregateColumn());
            if (!aggregateField) {
                return [];
            }
            var aggregateIdx = aggregateField.idx;
            return retVal.map(function (row) {
                var label = "";
                sourceColumns.forEach(function (col, idx) {
                    var colIdx = this._db.fieldByLabel(col.label()).idx;
                    if (idx > 0) {
                        label += "/";
                    }
                    label += row[colIdx];
                }, this);
                return [label, row[aggregateIdx]];
            }, this);
        }
        return retVal;
    };

    BoxPlot.prototype.updateChart = function (domNode, element, margin, width, height, isHorizontal, duration) {
        var context = this;
        var data = this.data();
        var data = d3.nest()
            .key(function (row) { return row[0]; })
            //.rollup(function (leaves) { return leaves[1]; })
            .entries(this.data())
        ;

        var dataLen = this.dataScale.rangeBand();

        this._d3Box
            .whiskers(iqr(1.5))
            .width(50)//this.dataScale.rangeBand())
            .height(height)
            .domain(this.valueScale.domain())
        ;
        var boxplots = element.selectAll(".boxPlotSVG").data(data, function (d) { return d.key; });
        boxplots.enter().append("g")
            .attr("class", "boxPlotSVG")
        ;
        boxplots
            .each(function (dataRow, idx) {
                var element = d3.select(this);
                var boxplot = element.selectAll(".boxPlot").data([dataRow.values.map(function (row) { return row[1]; })]);
                var rect = boxplot.enter().append("g")
                    .attr("class", "boxPlot")
                    .append("rect")
                ;
                //boxplot.call(context._d3Box);
                boxplot.exit().remove();
                var bbox = this.getBBox();
                /*
                element
                    .attr("transform", function (d) {
                        return "translate(" + (context.dataScale.rangeBand() / 2 + context.dataPos(data[idx].key) - bbox.width / 2) + "," + margin.top + ")";
                    })
                ;
                */
                rect
                    .attr("x", context.dataPos(data[idx].key))
                    .attr("y", 0)
                    .attr("width", dataLen)
                    .attr("height", height)
                ;
            })
        ;
        boxplots.exit().remove();

        // Returns a function to compute the interquartile range.
        function iqr(k) {
            return function (d, i) {
                var q1 = d.quartiles[0],
                    q3 = d.quartiles[2],
                    iqr = (q3 - q1) * k,
                    i = -1,
                    j = d.length;
                while (d[++i] < q1 - iqr);
                while (d[--j] > q3 + iqr);
                return [i, j];
            };
        }
    };

    return BoxPlot;
}));
