"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        //define(["material", "../common/HTMLWidget", "css!material"], factory);
        define(["../common/HTMLWidget", "material", "css!./Common"], factory);
    } else {
        root.c3chart_Common = factory(root.common_HTMLWidget);
    }
}(this, function (HTMLWidget) {
    function Common() {
        HTMLWidget.call(this);

        this._tag = "div";
    }
    Common.prototype = Object.create(HTMLWidget.prototype);
    Common.prototype.constructor = Common;
    Common.prototype._class += " mld_Common";

    Common.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
    };

    Common.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
    };

    Common.prototype.exit = function (domNode, element) {
        HTMLWidget.prototype.exit.apply(this, arguments);
    };

    return Common;
}));
