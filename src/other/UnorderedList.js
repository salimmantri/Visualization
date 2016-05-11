"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/HTMLWidget", "css!./UnorderedList"], factory);
    } else {
        root.template_UnorderedList = factory(root.d3, root.common_HTMLWidget);
    }
}(this, function (d3, HTMLWidget) {
    function UnorderedList(target) {
        HTMLWidget.call(this);

        this._tag = "div";
    }
    UnorderedList.prototype = Object.create(HTMLWidget.prototype);
    UnorderedList.prototype.constructor = UnorderedList;
    UnorderedList.prototype._class += " other_UnorderedList";

    UnorderedList.prototype.publish("stringProp", "defaultValue", "string", "Sample Property");

    UnorderedList.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
    };

    UnorderedList.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        d3.select(domNode.parentNode).style("overflow", "auto");
        this.updateArray(element, this.data(), 0);
    };

    UnorderedList.prototype.updateArray = function (element, _, depth) {
        var ul = element.selectAll("ul").data(_ instanceof Array ? [_] : []);
        ul.enter().append("ul")
            .attr("data-depth", depth)
        ;

        var li = ul.selectAll("ul[data-depth='" + depth + "'] > .dataRow").data(_);
        li.enter().append("li")
            .attr("class", "dataRow")
        ;
        var context = this;
        li
            .text(function (row) {
                return row[0] + " - " + depth;
            })
            .each(function (row) {
                context.updateArray(d3.select(this), row[1], depth + 1);
            })
        ;
        li.exit().remove();

        ul.exit().remove()
    }

    UnorderedList.prototype.exit = function (domNode, element) {
        HTMLWidget.prototype.exit.apply(this, arguments);
    };

    return UnorderedList;
}));
