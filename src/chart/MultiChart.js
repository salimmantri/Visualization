"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../layout/Border", "../common/Text", "../other/Legend", "../api/INDChart", "require", "css!./MultiChart"], factory);
    } else {
        root.chart_MultiChart = factory(root.d3, root.layout_Border, root.common_Text, root.other_Legend, root.api_INDChart, root.require);
    }
}(this, function (d3, Border, Text, Legend, INDChart, require) {
    var _1DChartTypes = [
        { id: "SUMMARY", display: "Summary", widgetClass: "chart_Summary" },
        { id: "C3_GAUGE", display: "Gauge (C3)", widgetClass: "c3chart_Gauge" }
    ];
    var _2DChartTypes = [
        { id: "BUBBLE", display: "Bubble", widgetClass: "chart_Bubble" },
        { id: "PIE", display: "Pie", widgetClass: "chart_Pie" },
        { id: "GOOGLE_PIE", display: "Pie (Google)", widgetClass: "google_Pie" },
        { id: "C3_DONUT", display: "Donut (C3)", widgetClass: "c3chart_Donut" },
        { id: "C3_PIE", display: "Pie (C3)", widgetClass: "c3chart_Pie" },
        { id: "AM_FUNNEL", display: "Area (amCharts)", widgetClass: "amchart_Funnel" },
        { id: "AM_PIE", display: "Pie (amCharts)", widgetClass: "amchart_Pie" },
        { id: "AM_PYRAMID", display: "Area (amCharts)", widgetClass: "amchart_Pyramid" },
        { id: "WORD_CLOUD", display: "Word Cloud", widgetClass: "other_WordCloud" }
    ];
    var _NDChartTypes = [
        { id: "COLUMN", display: "Column", widgetClass: "chart_Column", legend: true },
        { id: "LINE", display: "Line", widgetClass: "chart_Line", legend: true },
        { id: "AREA", display: "Area", widgetClass: "chart_Area", legend: true },
        { id: "STEP", display: "Step", widgetClass: "chart_Step", legend: true },
        { id: "GOOGLE_BAR", display: "Bar (Google)", widgetClass: "google_Bar", legend: true },
        { id: "GOOGLE_COLUMN", display: "Column (Google)", widgetClass: "google_Column", legend: true },
        { id: "GOOGLE_LINE", display: "Line (Google)", widgetClass: "google_Line", legend: true },
        { id: "C3_AREA", display: "Area (C3)", widgetClass: "c3chart_Area", legend: true },
        { id: "C3_BAR", display: "Bar (C3)", widgetClass: "c3chart_Bar", legend: true },
        { id: "C3_COLUMN", display: "Column (C3)", widgetClass: "c3chart_Column", legend: true },
        { id: "C3_LINE", display: "Line (C3)", widgetClass: "c3chart_Line", legend: true },
        { id: "C3_SCATTER", display: "Scatter (C3)", widgetClass: "c3chart_Scatter", legend: true },
        { id: "C3_STEP", display: "Step (C3)", widgetClass: "c3chart_Step", legend: true },
        { id: "AM_AREA", display: "Area (amCharts)", widgetClass: "amchart_Area", legend: true },
        { id: "AM_BAR", display: "Bar (amCharts)", widgetClass: "amchart_Bar", legend: true },
        { id: "AM_LINE", display: "Line (amCharts)", widgetClass: "amchart_Line", legend: true },
        //{ id: "AM_SCATTER", display: "Scatter (amCharts)", widgetClass: "amchart_Scatter" },
    ];
    var _anyChartTypes = [
        { id: "TABLE", display: "Table", widgetClass: "other_Table" }
    ];
    var _allChartTypes = _1DChartTypes.concat(_2DChartTypes.concat(_NDChartTypes.concat(_anyChartTypes)));

    function MultiChart() {
        Border.call(this);
        INDChart.call(this);

        this._1DChartTypes = _1DChartTypes;
        this._2DChartTypes = _2DChartTypes;
        this._NDChartTypes = _NDChartTypes;
        this._anyChartTypes = _anyChartTypes;
        this._allChartTypes = _allChartTypes;

        this._allCharts = {};
        this._allChartTypes.forEach(function (item) {
            var newItem = JSON.parse(JSON.stringify(item));
            newItem.widget = null;
            this._allCharts[item.id] = newItem;
            this._allCharts[item.display] = newItem;
            this._allCharts[item.widgetClass] = newItem;
        }, this);
        //  Backward compatability until we roll our own BAR  ---
        this._allCharts["BAR"] = this._allCharts["COLUMN"];
    }
    MultiChart.prototype = Object.create(Border.prototype);
    MultiChart.prototype.constructor = MultiChart;
    MultiChart.prototype._class += " chart_MultiChart";
    MultiChart.prototype.implements(INDChart.prototype);

    MultiChart.prototype.publish("chartType", "COLUMN", "set", "Chart Type", _allChartTypes.map(function (item) { return item.id; }), { tags: ["Basic"] });
    MultiChart.prototype.publish("axisTitleHeight", 18, "string", "Axis Title Height", null, { tags: ["Basic"] });
    MultiChart.prototype.publish("xAxisTitle", "X-Axis", "string", "X-Axis", null, { tags: ["Basic"] });
    MultiChart.prototype.publish("yAxisTitle", "Y-Axis", "string", "Y-Axis", null, { tags: ["Basic"] });

    MultiChart.prototype.publish("showLegend", true, "boolean", "Show Legend", null, { tags: ["Basic"] });

    MultiChart.prototype.testData = function () {
        return INDChart.prototype.testData.apply(this, arguments);
    };

    MultiChart.prototype.columns = function (_) {
        var retVal = Border.prototype.columns.apply(this, arguments);
        if (arguments.length && this.getContent("centerSection")) {
            this.getContent("centerSection").columns(_);
        }
        return retVal;
    };

    MultiChart.prototype.data = function (_) {
        var retVal = Border.prototype.data.apply(this, arguments);
        if (arguments.length && this.getContent("centerSection")) {
            this.getContent("centerSection").data(_);
        }
        return retVal;
    };

    MultiChart.prototype.hasOverlay = function () {
        return this.getContent("centerSection") && this.getContent("centerSection").hasOverlay();
    };

    MultiChart.prototype.visible = function (_) {
        if (!arguments.length) return this.getContent("centerSection") && this.getContent("centerSection").visible();
        if (this.getContent("centerSection")) {
            this.getContent("centerSection").visible(_);
        }
        return this;
    };

    MultiChart.prototype.requireContent = function (chartType, callback) {
        var path = "src/" + this._allCharts[chartType].widgetClass.split("_").join("/");
        require([path], function (WidgetClass) {
            callback(new WidgetClass());
        });
    };

    MultiChart.prototype.switchChart = function (callback) {
        var oldContent = this.getContent("centerSection");
        var context = this;
        this.requireContent(this.chartType(), function (newContent) {
            if (newContent !== oldContent) {
                var size = context.size();
                newContent
                    .columns(context._columns)
                    .data(context._data)
                    .size(size)
                ;
                context.setContent("centerSection", newContent);
                if (context._legend) {
                    context._legend.targetWidget(newContent).render();
                }
                newContent.click = function (row, column, selected) {
                    context.click(row, column, selected);
                };
            }
            if (callback) {
                callback(this);
            }
        });
    };

    MultiChart.prototype.render = function (callback) {
        if (this._allCharts[this.chartType()].legend) {
            if (this._prevXAxisTitle !== this.xAxisTitle()) {
                if (!this.hasContent("bottomSection")) {
                    this.setContent("bottomSection", this.xAxisTitle() ? new Text() : null);
                }
                this.getContent("bottomSection").text(this.xAxisTitle());
                this._prevXAxisTitle = this.xAxisTitle();
            }
            if (this._prevYAxisTitle !== this.yAxisTitle()) {
                if (!this.hasContent("leftSection")) {
                    this.setContent("leftSection", this.yAxisTitle() ? new Text().rotation(-90) : null);
                }
                this.getContent("leftSection").text(this.yAxisTitle());
                this._prevYAxisTitle = this.yAxisTitle();
            }
            if (this._prevAxisTitleHeight !== this.axisTitleHeight()) {
                if (this.hasContent("bottomSection")) {
                    this.getContent("bottomSection").fontSize(this.axisTitleHeight());
                    this.bottomCellSize(this.axisTitleHeight() + 4);
                    this.bottomCellPercentage(0);
                }
                if (this.hasContent("leftSection")) {
                    this.getContent("leftSection").fontSize(this.axisTitleHeight());
                    this.leftCellSize(this.axisTitleHeight() + 4);
                    this.leftCellPercentage(0);
                }
                this._prevAxisTitleHeight = this.axisTitleHeight();
            }
            if (this._prevshowLegend !== this.showLegend()) {
                if (this.showLegend()) {
                    this._legend = new Legend().targetWidget(this.getContent("centerSection"));
                    this.setContent("rightSection", this._legend);
                    this.rightCellSize(128);
                    this.rightCellPercentage(0);
                } else {
                    delete this._legend;
                    this.setContent("rightSection", null);
                    this.rightCellSize(0);
                    this.rightCellPercentage(0);
                }
                this._prevshowLegend = this.showLegend();
            }
        } else {
            delete this._prevXAxisTitle;
            delete this._prevYAxisTitle;
            delete this._prevAxisTitleHeight;
            delete this._prevshowLegend;
            this.setContent("leftSection", null);
            this.setContent("bottomSection", null);
            this.setContent("rightSection", null);
        }
        if (this.chartType() && (!this.getContent("centerSection") || (this.getContent("centerSection").classID() !== this._allCharts[this.chartType()].widgetClass))) {
            var context = this;
            var args = arguments;
            this.switchChart(function () {
                Border.prototype.render.apply(context, args);
            });
            return this;
        }
        return Border.prototype.render.apply(this, arguments);
    };

    return MultiChart;
}));
