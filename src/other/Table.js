"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../layout/Border", "./HTML", "./Paginator", "../common/Utility", "css!./Table"], factory);
    } else {
        root.other_Table = factory(root.d3, root.common_Border, root.other_HTML, root.other_Paginator, root.common_Utility);
    }
}(this, function (d3, Border, HTML, Paginator, Utility) {
    function Table() {
        Border.call(this);
        this._tag = "div";
    }
    Table.prototype = Object.create(Border.prototype);
    Table.prototype.constructor = Table;
    Table.prototype._class += " other_Table";

    Table.prototype.publish("fixedHeader", true, "boolean", "Enable or disable fixed table header", null, { tags: ["Private"] });
    Table.prototype.publish("fixedColumn", true, "boolean", "Enable or disable fixed first column", null, { tags: ["Private"] });

    Table.prototype.enter = function (domNode, element) {
        Border.prototype.enter.apply(this, arguments);
        var context = this;
        this._fixedTHead = new HTML().data([["<table><thead><tr></tr></thead></table>"]]);
        this._fixedTHead.update = function (domNode, element) {
            if (context._adjustingSize) {
                return;
            }
            HTML.prototype.update.apply(this, arguments);
            context._fixedTHeadSizes = [];
            context.updateTable(domNode, element, context.fixedHeader() ? context.columns() : [], [], context._fixedTHeadSizes);
        };
        this.setContent("top", this._fixedTHead).topPercentage(0);//.topShrinkWrap(true);
        this._fixedTColumn = new HTML().data([["<table><thead><tr></tr></thead><tbody></tbody></table>"]]);
        this._fixedTColumn.update = function (domNode, element) {
            if (context._adjustingSize) {
                return;
            }
            HTML.prototype.update.apply(this, arguments);
            context._fixedTColumnSizes = [];
            context.updateTable(domNode, element, context.fixedHeader() ? [] : context.fixedColumn() ? context.columns().filter(function (col, i) {
                return i === 0;
            }) : [], context.fixedColumn() ? context.data().map(function (row) {
                return row.filter(function (cell, i) {
                    return i === 0;
                });
            }) : [], context._fixedTColumnSizes);
        };
        this.setContent("left", this._fixedTColumn).leftPercentage(0);//.leftShrinkWrap(true);
        this.table = new HTML().data([["<table><thead><tr></tr></thead><tbody></tbody></table>"]]);
        this.table.update = function (domNode, element) {
            if (context._adjustingSize) {
                return;
            }
            HTML.prototype.update.apply(this, arguments);
            context.tableSizes = [];
            context.updateTable(domNode, element, context.fixedHeader() ? [] : context.columns().filter(function (col, i) {
                return i >= (context.fixedColumn() ? 1 : 0);
            }), context.data().map(function (row) {
                return row.filter(function (cell, i) {
                    return i >= (context.fixedColumn() ? 1 : 0);
                });
            }), context.tableSizes);
            context.adjustSizes();  
        };
        this.setContent("center", this.table);
    };

    Table.prototype.update = function (domNode, element) {
        Border.prototype.update.apply(this, arguments);
    };

    Table.prototype.updateTable = function (domNode, element, columns, data, sizes) {
        var th = element.select("thead > tr").selectAll("th").data(columns);
        th.enter().append("th")
        ;
        th
            .style("width", null)
            .text(function (d) { return d; })
        ;
        th.exit().remove()
        ;
        th.order();

        var tr = element.select("tbody").selectAll("tr").data(data);
        tr.enter().append("tr")
        ;
        tr
            .each(function (d) {
                var element = d3.select(this);
                var td = element.selectAll("td").data(d);
                td.enter().append("td")
                ;
                td
                    .style("width", null)
                    .text(function (d) { return d; })
                ;
                td.exit().remove()
                ;
                td.order();
            })
        ;
        tr.exit().remove()
        ;
        tr.order();

        //  Get Cell Sizes of last row (including header)  ---
        if (data.length) {
            tr.filter(function (d, i) { return i === data.length - 1 }).selectAll("td")
                .each(function (cell, i) {
                    var element = d3.select(this);
                    sizes.push({ width: element.style("width"), height: element.style("height") });
                })
            ;
        } else if (columns.length) {
            th
                .each(function (cell, i) {
                    var element = d3.select(this);
                    sizes.push({width: element.style("width"), height: element.style("height")});
                })
            ;
        }
    };

    Table.prototype.adjustSizes = function () {
        var columns = this._fixedTColumnSizes.concat(this.tableSizes);
        var headers = this.fixedHeader() ? this._fixedTHeadSizes : columns;
        if (columns.length || headers.length) {
            var maxWidths = [];
            for (var i = 0; i < headers.length; ++i) {
                maxWidths[i] = Math.max(parseFloat(columns[i].width), parseFloat(headers[i].width));
            }
            if (this.fixedHeader()) {
                this.topSize(parseFloat(headers[0].height));
            } else {
                this.topSize(0);
            }
            if (this.fixedColumn()) {
                this.leftSize(maxWidths[0]);
            } else {
                this.leftSize(0);
            }
            var context = this;
            this._fixedTHead.element().selectAll("thead > tr > th")
                .each(function (d, i) {
                    var element = d3.select(this);
                    element
                        .style("width", /*(i === 0 ? context.gutter() : 0) +*/ maxWidths[i] /*- context.calcFrameWidth(element)*/ + "px")
                    ;
                })
            ;


            this._adjustingSize = true;
            var context = this;
            this.render(function (w) {
                context._adjustingSize = false;
            });
        }
    };

    Table.prototype.renderXXX = function (callback) {
        Border.prototype.render.apply(this, function (w) {
            if (callback) {
                callback(w);
            }
        });
    };

    Table.prototype.click = function (row, column) {
        console.log("Click:  " + JSON.stringify(row) + ", " + column);
    };

    return Table;
}));
