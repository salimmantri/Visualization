"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "handsontable", "../common/HTMLWidget", "css!handsontable"], factory);
    } else {
        root.other_Table2 = factory(root.d3, root.Handsontable, root.common_HTMLWidget);
    }
}(this, function (d3, Handsontable, HTMLWidget) {
    function Table2() {
        HTMLWidget.call(this);
        this._tag = "div";
    }
    Table2.prototype = Object.create(HTMLWidget.prototype);
    Table2.prototype.constructor = Table2;
    Table2.prototype._class += " other_Table2";

    Table2.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
        element.style("overflow", "hidden");
        var context = this;
        this._table = new Handsontable(domNode, {
            width: this.width(),
            height: this.height(),
            fixedColumnsLeft: 1,
            columnSorting: true,
            readOnlyCellClassName: "",
            colHeaders: function (idx) {
                var columns = context.columns();
                return idx < columns.length ? columns[idx] : "";
            }
        });
    };

    Table2.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        var data = [];
        this.data().forEach(function (row) {
            data.push(row);
        });
        this._table.updateSettings({
            columns: this.columns().map(function (col) { return { readOnly: true }; }),
            width: this.width(),
            height: this.height(),
            data: this.cloneData()
        });
    };

    Table2.prototype.exit = function (domNode, element) {
        HTMLWidget.prototype.exit.apply(this, arguments);
    };
        
    return Table2;
}));
