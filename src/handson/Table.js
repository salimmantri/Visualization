"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "handsontable", "../common/HTMLWidget", "../common/Utility", "css!handsontable", "css!./Table"], factory);
    } else {
        root.handson_Table = factory(root.d3, root.Handsontable, root.common_HTMLWidget, root.common_Utility);
    }
}(this, function (d3, Handsontable, HTMLWidget, Utility) {
    function Table() {
        HTMLWidget.call(this);
        this._tag = "div";

        this._selectionBag = new Utility.Selection();
    }
    Table.prototype = Object.create(HTMLWidget.prototype);
    Table.prototype.constructor = Table;
    Table.prototype._class += " handson_Table";

    Table.prototype.publish("renderHtmlDataCells", false, "boolean", "enable or disable HTML within cells",null,{tags:["Private"]});
    Table.prototype.publish("fixedColumn", false, "boolean", "Enable or disable fixed first column", null, { tags: ["Private"] });
    Table.prototype.publish("multiSelect", false, "boolean", "Multiple Selection", null, { tags: ["Basic"] });

    Table.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
        element.style("overflow", "hidden");
        var context = this;
        this._table = new Handsontable(domNode, {
            columnSorting: true,
            readOnlyCellClassName: "",
            manualColumnResize: true,
            sortIndicator: true,
            wordWrap: false,
            currentRowClassName: 'currentRow',
            afterSelectionEnd: function (r, c, r2, c2) {
                if (r2 === r) {
                    var d = this.getDataAtRow(r);
                    context.selectionBagClick(d, r, event);
                    context.click(context.rowToObj(d), c, context._selectionBag.isSelected(context._createSelectionObject(d)));
                }
            },
            cells: function(row, col, prop) {
                return {
                    renderer: function (instance, td, row, col, prop, value, cellProperties) {
                        var field = context.fields()[col];
                        var textRender = context.renderHtmlDataCells() ? Handsontable.renderers.HtmlRenderer : Handsontable.renderers.TextRenderer;
                        switch (field.type()) {
                            case "string":
                                value = field.transform(value);
                                textRender.call(this, instance, td, row, col, prop, value, cellProperties);
                                break;
                            case "number":
                                Handsontable.renderers.NumericRenderer.call(this, instance, td, row, col, prop, value, cellProperties);
                                break;
                            case "boolean":
                                value = true;
                                Handsontable.renderers.CheckboxRenderer.call(this, instance, td, row, col, prop, value, cellProperties);
                                break;
                            case "time":
                            default:
                                value = field.transform(value);
                                textRender.call(this, instance, td, row, col, prop, value, cellProperties);
                        }
                        if (context._selectionBag.isSelected({ _id: row })) {
                            td.style.color = "white";
                            td.style.background = "#f48a00";

                        } else {
                            td.style.color = null;
                            td.style.background = null;
                        }
                    }
                };
            },
            colHeaders: [],
            columns: [],
            fixedColumnsLeft: 1,
            width: this.width(),
            height: this.height(),
            data: []
        });
    };

    Table.prototype.update = function (domNode, element) {
        HTMLWidget.prototype.update.apply(this, arguments);
        var context = this;
        this._table.loadData(this.cloneData());
        var settings = this._table.getSettings();
        settings.colHeaders = this.columns();
        settings.columns = settings.colHeaders.map(function (field) {
            return {
                readOnly: true
            };
        });
        settings.fixedColumnsLeft = this.fixedColumn() ? 1 : 0;
        settings.width = this.width();
        settings.height = this.height();
        this._table.updateSettings(settings);
        if (this._table.sortingEnabled) {
            this._table.sort(this._table.sortColumn, this._table.sortOrder);
        }
        this._table.render();
    };

    Table.prototype.exit = function (domNode, element) {
        HTMLWidget.prototype.exit.apply(this, arguments);
    };

    Table.prototype._createSelectionObject = function (i) {
        var context = this;
        return {
            _id: i,
            element: function () {
                return d3.select();
            }
        };
    };

    Table.prototype.selection = function (_) {
        if (!arguments.length) return this._selectionBag.get().map(function (d) { return d._id; });
        this._selectionBag.set(_.map(function (row) {
            return this._createSelectionObject(row);
        }, this));
        return this;
    };

    Table.prototype.selectionBagClick = function (d, i, event) {
        if (this.multiSelect() && event.shiftKey && this._selectionPrevClick) {
            var inRange = false;
            var rows = [];
            var selection = this.data().filter(function (row, i) {
                var lastInRangeRow = false;
                if (row === d || row === this._selectionPrevClick) {
                    if (inRange) {
                        lastInRangeRow = true;
                    }
                    inRange = !inRange;
                    rows.push(i);
                }
                return inRange || lastInRangeRow;
            }, this);
            this.selection(selection);
        } else if (this.multiSelect()) {
            this._selectionBag.click(this._createSelectionObject(d), event);
            this._selectionPrevClick = d;
        } else {
            var selObj = this._createSelectionObject(i);
            this._selectionBag.click(selObj, { ctrlKey: this._selectionBag.isSelected(selObj) });
            this._selectionPrevClick = d;
        }
        var context = this;
        setTimeout(function () {
            context.render();
        }, 0);
    };

    Table.prototype.click = function (row, column, selected) {
        console.log("Click:  " + JSON.stringify(row) + ", " + column + "," + selected);
    };
        
    return Table;
}));
