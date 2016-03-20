"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "d3-tip", "../common/Widget", "css!./ITooltip"], factory);
    } else {
        root.api_ITooltip = factory(root.d3, root.d3.tip, root.common_Widget);
    }
}(this, function (d3, d3Tip, Widget, AbsoluteSurface, TextBox) {
    function ITooltip() {
        Widget.call(this);

        var context = this;
        this._tooltipInit = false;
        this.tooltip = d3Tip()
            .attr("class", "d3-tip")
            .offset(function (d) {
                switch (context.tooltip.direction()()) {
                    case "e":
                        return [0, context.tooltipOffset()];
                    default:
                        return [-context.tooltipOffset(), 0];
                }
            })
        ;
    }
    ITooltip.prototype = Object.create(Widget.prototype);

    ITooltip.prototype.publish("tooltipOffset", 8, "number", "Offset from the cursor", null, {});

    return ITooltip;
}));
