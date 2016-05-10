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
        this.updateArray(element, this.data(), 0);
    };

    UnorderedList.prototype.updateArray = function (element, arr, depth) {
        var data = arr instanceof Array ? [arr] : [];
        if (depth === 2) {
            var d = 0;
        }
        var innerUL = element.selectAll("ul[data-depth='" + depth + "']").data(data);
        innerUL.enter().append("ul")
            .attr("data-depth", depth)
        ;
        var context = this;
        innerUL.each(function (d) {
            console.log(d === arr);
            var element = d3.select(this);
            var inner = element.selectAll('ul[data-depth="' + depth + '"] > .dataRow').data(d);
            inner.enter().append("li")
                .attr("class", "dataRow")
            ;
            inner
                .text(function (row) {
                    return row[0] + " - " + depth;
                })
                .each(function (row) {
                    console.log(row[1]);
                    context.updateArray(innerUL, row[1], depth + 1);
                })
            ;
            inner.exit().remove();
        });
        innerUL.exit().remove()
    }

    UnorderedList.prototype.updateArrayXXX = function (element, arr, depth) {
        var inner = element.selectAll('ul[data-depth="' + depth + '"] > .dataRow').data(arr);
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
                var data = row[1] instanceof Array ? [row[1]] : [];
                var innerUL = element.selectAll("li > ul[data-depth='" + (depth + 1) + "']").data(data);
                innerUL.enter().append("ul")
                    .attr("data-depth", depth + 1)
                ;
                if (data.length) {
                    context.appendArray(innerUL, data[0], depth + 1);
                }
                innerUL.exit().remove()
            })
        ;
        inner.exit().remove();
    };

    UnorderedList.prototype.exit = function (domNode, element) {
        HTMLWidget.prototype.exit.apply(this, arguments);
    };

    return UnorderedList;
}));
