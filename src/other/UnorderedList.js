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
        this._ul = element.append("ul")
            .attr("class", "container")
            .attr("data-depth", 0)
        ;
    };

    UnorderedList.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        this.appendArray(this._ul, this.data(), 0);
    };

    UnorderedList.prototype.appendArray = function (element, arr, depth) {
        var inner = element.selectAll('.container[data-depth="' + depth + '"] > .dataRow').data(arr);
        inner.enter().append("li")
            .attr("class", "dataRow")
        ;
        var context = this;
        inner
            .text(function (row) {
                return row[0];
            })
            .each(function (row) {
                var element = d3.select(this);
                if (row[1] instanceof Array) {
                    var innerUl = element.append("ul")
                        .attr("class", "container")
                        .attr("data-depth", depth + 1)
                    ;
                    context.appendArray(innerUl, row[1], depth + 1);
                }
            })
        ;
        inner.exit().remove();
    };

    UnorderedList.prototype.exit = function (domNode, element) {
        HTMLWidget.prototype.exit.apply(this, arguments);
    };

    return UnorderedList;
}));
