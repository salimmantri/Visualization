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
    }
    I2DChart.prototype = Object.create(Class.prototype);
    I2DChart.prototype.constructor = I2DChart;
    I2DChart.prototype.mixin(PropertyExt);
    I2DChart.prototype._class += " api_I2DChart";

    I2DChart.prototype._palette = Palette.ordinal("default");

    I2DChart.prototype.publish("paletteID", "default", "set", "Palette ID", I2DChart.prototype._palette.switch(), { tags: ["Basic", "Shared"] });
    I2DChart.prototype.publish("useClonedPalette", false, "boolean", "Enable or disable using a cloned palette", null, { tags: ["Intermediate", "Shared"] });


    //  Events  ---
    I2DChart.prototype.click = function (row, column, selected) {
        console.log("Click:  " + JSON.stringify(row) + ", " + column + ", " + selected);
    };

    return I2DChart;
}));