"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/SVGWidget", "./XYAxis", "../api/INDChart", "../api/ITooltip", "../common/Palette", "d3-box", "css!./BoxPlot"], factory);
    } else {
        root.chart_HexBin = factory(root.d3, root.common_SVGWidget, root.chart_XYAxis, root.api_INDChart, root.api_ITooltip, root.common_Palette);
    }
}(this, function (d3, SVGWidget, XYAxis, INDChart, ITooltip, Palette, D3Box) {
    D3Box = D3Box || d3.box || window.d3.box;

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

    BoxPlot.prototype.updateChart = function (domNode, element, margin, width, height, isHorizontal, duration) {
        var context = this;

        var min = Infinity,
            max = -Infinity;

        var view = this._db.rollupView(["Expt"]);
        var dataLabel = [];
        var data = view.entries().map(function (d) {
            return d.values.map(function (row) {
                dataLabel.push(d.key);
                if (row[2] > max) max = row[2];
                if (row[2] < min) min = row[2];
                return row[2];
            });
        });

        this.valueScale.domain([min, max]);

        this._d3Box
            .whiskers(iqr(1.5))
            .width(this.dataScale.rangeBand() / 2)
            .height(height)
            .domain(this.valueScale.domain())
        ;
        var boxplots = element.selectAll(".boxPlot").data(data);
        boxplots.enter().append("g")
            .attr("class", "boxPlot")
        ;
        boxplots
            .attr("transform", function (d, idx) { return "translate(" + (context.dataScale.rangeBand() / 2 + context.dataScale(idx + 1)) + "," + margin.top + ")"; })
            .call(context._d3Box);
        ;

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
