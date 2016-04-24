"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/Class", "../common/PropertyExt", "../common/Palette"], factory);

    } else {
        root.api_I2DChart = factory(root.d3, root.common_Class, root.common_PropertyExt, root.common_Palette);
    }
}(this, function (d3, Class, PropertyExt, Palette) {
    function I2DChart() {
        Class.call(this);
        PropertyExt.call(this);
    }
    I2DChart.prototype = Object.create(Class.prototype);
    I2DChart.prototype.constructor = I2DChart;
    I2DChart.prototype.mixin(PropertyExt);
    I2DChart.prototype._class += " api_I2DChart";

    I2DChart.prototype._palette = Palette.ordinal("default");

    I2DChart.prototype.publish("labelColumn", null, "set", "Label Field", function () { return this.columns(); });
    I2DChart.prototype.publish("valueColumn", null, "set", "Value Field", function () { return this.columns(); });
    I2DChart.prototype.publish("valueRollup", "sum", "set", "Value Field", ["sum", "mean", "median", "max", "min", "deviation", "variance"]);

    I2DChart.prototype.publish("paletteID", "default", "set", "Palette ID", I2DChart.prototype._palette.switch(), { tags: ["Basic", "Shared"] });
    I2DChart.prototype.publish("useClonedPalette", false, "boolean", "Enable or disable using a cloned palette", null, { tags: ["Intermediate", "Shared"] });

    function exists(d) {
        return d !== null && d !== undefined;
    }

    var labelColumn = I2DChart.prototype.labelColumn;
    I2DChart.prototype.labelColumn = function (_) {
        if (!arguments.length && !exists(labelColumn.apply(this, arguments))) {
            this.labelColumn(this.columns()[0]);
        }
        return labelColumn.apply(this, arguments);
    };

    var valueColumn = I2DChart.prototype.valueColumn;
    I2DChart.prototype.valueColumn = function (_) {
        if (!arguments.length && !exists(valueColumn.apply(this, arguments))) {
            this.valueColumn(this.columns()[1]);
        }
        return valueColumn.apply(this, arguments);
    };

    I2DChart.prototype.mappedData = function () {
        var columns = this.columns();
        var labelIdx = columns.indexOf(this.labelColumn());
        var valueIdx = columns.indexOf(this.valueColumn());
        var aggregator = d3[this.valueRollup()];
        var retVal = d3.nest()
            .key(function(d) { return d[labelIdx]})
            .rollup(function (leaves) { return aggregator(leaves, function (d) { return d[valueIdx] }); })
            .entries(this.data())
        ;
        return retVal.map(function (d) { return [d.key, d.values]; });
    };

    //  Events  ---
    I2DChart.prototype.click = function (row, column, selected) {
        console.log("Click:  " + JSON.stringify(row) + ", " + column + ", " + selected);
    };

    return I2DChart;
}));