"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/HTMLWidget", "./Paginator", "../common/Utility", "css!./Table"], factory);
    } else {
        root.other_Table = factory(root.d3, root.common_HTMLWidget, root.other_Paginator, root.common_Utility);
    }
}(this, function (d3, HTMLWidget, Paginator, Utility) {
    function HTML() {
        HTMLWidget.call(this);
        this._tag = "div";
        this._drawStartPos = "origin";//"center";
    }
    HTML.prototype = Object.create(HTMLWidget.prototype);
    HTML.prototype.constructor = HTML;
    HTML.prototype._class += " other_Table";

    HTML.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
    };

    HTML.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);

        var html = element.selectAll(".htmlRow").data(this.data());
        html.enter().append("div")
            .attr("class", "htmlRow")
        ;
        html
            .html(function (d) { return d; })
        ;
        html.exit().remove();
    };

    HTML.prototype.click = function (row, column) {
        console.log("Click:  " + JSON.stringify(row) + ", " + column);
    };

    return HTML;
}));
