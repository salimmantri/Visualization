"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["../common/Class", "../common/PropertyExt", "../common/Palette"], factory);

    } else {
        root.api_I2DChart = factory(root.common_Class, root.common_PropertyExt, root.common_Palette);
    }
}(this, function (Class, PropertyExt, Palette) {
    function I2DChart() {
        Class.call(this);
        PropertyExt.call(this);

        var columns = this.columns;
        this.columns = function (_) {
            var retVal = columns.apply(this, arguments);
            if (arguments.length) {
                this.labelColumnIdx = this.columns().indexOf(this.labelColumn());
                this.valueColumnIdx = this.columns().indexOf(this.valueColumn());
            }
            return retVal;
        };
        var fields = this.fields;
        this.fields = function (_) {
            var retVal = fields.apply(this, arguments);
            if (arguments.length) {
                this.labelColumnIdx = this.columns().indexOf(this.labelColumn());
                this.valueColumnIdx = this.columns().indexOf(this.valueColumn());
            }
            return retVal;
        };

    }
    I2DChart.prototype = Object.create(Class.prototype);
    I2DChart.prototype.constructor = I2DChart;
    I2DChart.prototype.mixin(PropertyExt);
    I2DChart.prototype._class += " api_I2DChart";

    I2DChart.prototype._palette = Palette.ordinal("default");

    I2DChart.prototype.publish("labelColumn", null, "set", "Label Field", function () { return this.columns(); });
    I2DChart.prototype.publish("valueColumn", null, "set", "Value Field", function () { return this.columns(); });
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
        var retVal = labelColumn.apply(this, arguments);
        if (arguments.length) {
            this.labelColumnIdx = this.columns().indexOf(_);
        }
        return retVal;
    };
    I2DChart.prototype.toLabel = function (d) {
        return d[this.labelColumnIdx];
    };

    var valueColumn = I2DChart.prototype.valueColumn;
    I2DChart.prototype.valueColumn = function (_) {
        if (!arguments.length && !exists(valueColumn.apply(this, arguments))) {
            this.valueColumn(this.columns()[1]);
        }
        var retVal = valueColumn.apply(this, arguments);
        if (arguments.length) {
            this.valueColumnIdx = this.columns().indexOf(_);
        }
        return retVal;
    };
    I2DChart.prototype.toValue = function (d) {
        return d[this.valueColumnIdx];
    };

    //  Events  ---
    I2DChart.prototype.click = function (row, column, selected) {
        console.log("Click:  " + JSON.stringify(row) + ", " + column + ", " + selected);
    };

    return I2DChart;
}));