"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/Class", "../common/PropertyExt", "../common/Palette"], factory);

    } else {
        root.api_INDChart = factory(root.d3, root.common_Class, root.common_PropertyExt, root.common_Palette);
    }
}(this, function (d3, Class, PropertyExt, Palette) {
    function Value(owner) {
        Class.call(this);
        PropertyExt.call(this);
        this._owner = owner;
    }
    Value.prototype = Object.create(Class.prototype);
    Value.prototype.constructor = Value;
    Value.prototype.mixin(PropertyExt);
    Value.prototype._class += " api_INDChart.Value";

    Value.prototype.id = function () {
        return this._id;
    };

    Value.prototype.publish("column", null, "set", "Field", function () { return this._owner.columns(); }, {optional:true});
    Value.prototype.publish("rollup", "sum", "set", "Field", ["sum", "mean", "median", "max", "min", "deviation", "variance"]);

    function INDChart() {
        Class.call(this);
        PropertyExt.call(this);
    }
    INDChart.prototype = Object.create(Class.prototype);
    INDChart.prototype.constructor = INDChart;
    INDChart.prototype.mixin(PropertyExt);
    INDChart.prototype._class += " api_INDChart";
    INDChart.prototype.Value = Value;

    INDChart.prototype._palette = Palette.ordinal("default");

    INDChart.prototype.publish("labelColumn", null, "set", "Label Field", function () { return this.columns(); });
    INDChart.prototype.publish("valueColumns", [], "propertyArray", "Value Columns");

    INDChart.prototype.publish("paletteID", "default", "set", "Palette ID", INDChart.prototype._palette.switch(), { tags: ["Basic", "Shared"] });
    INDChart.prototype.publish("useClonedPalette", false, "boolean", "Enable or disable using a cloned palette", null, { tags: ["Intermediate", "Shared"] });

    function exists(d) {
        return d !== null && d !== undefined;
    }

    INDChart.prototype.leafValue = function (d, column, leafIdx) {
        leafIdx = leafIdx || 0;
        var valueIdx = this.columns().indexOf(column);
        if (valueIdx >= 0) {
            return d[2][leafIdx][valueIdx];
        }
        return undefined;
    };

    var labelColumn = INDChart.prototype.labelColumn;
    INDChart.prototype.labelColumn = function (_) {
        if (!arguments.length && !exists(labelColumn.apply(this, arguments))) {
            this.labelColumn(this.columns()[0]);
        }
        return labelColumn.apply(this, arguments);
    };

    var valueColumns = INDChart.prototype.valueColumns;
    INDChart.prototype.valueColumns = function (_) {
        var retVal = valueColumns.apply(this, arguments);
        if (!arguments.length) {
            if (retVal.length === 0) {
                this.columns().forEach(function (column, idx) {
                    if (idx > 0 && idx < 3 ) {
                        retVal.push(new Value(this).column(column));
                    }
                }, this);
                this.valueColumns(retVal);
            }
            //  remove empties and ensure lasty row is an empty---
            var lastColumn = "dummy";
            var noEmpties = retVal.filter(function (row, idx) {
                lastColumn = row.column();
                row._owner = this;
                return idx === retVal.length - 1 || row.column();
            }, this);
            var changed = retVal.length - noEmpties.length;
            if (lastColumn) {
                changed = true;
                noEmpties.push(new Value(this));
            }
            if (changed) {
                this.valueColumns(noEmpties);
            }
        }
        return retVal;
    };

    INDChart.prototype.mappedColumns = function () {
        return [this.labelColumn()].concat(this.valueColumns().filter(function (vc) {
            return vc.column();
        }).map(function (vc) {
            return vc.column() + " (" + vc.rollup() + ")";
        }));
    },

    INDChart.prototype.mappedData = function () {
        var columns = this.columns();
        var labelIdx = columns.indexOf(this.labelColumn());

        var valueIdxAggregators = this.valueColumns().filter(function (vc) {
            return vc.column();
        }).map(function (vc) {
            return {
                col: vc.column(),
                idx: columns.indexOf(vc.column()),
                aggregator: d3[vc.rollup()]
            };
        });
        var retVal = d3.nest()
            .key(function (d) { return d[labelIdx] })
            .rollup(function (leaves) {
                return {
                    rollups: valueIdxAggregators.map(function (item) {
                        var filteredLeaves = leaves.filter(function (d) {
                            if (isNaN(d[item.idx])) {
                                console.log("Expected a number:" + d);
                                return false;
                            }
                            return true;
                        });
                        var min = d3.min(filteredLeaves, function (d) {
                            return +d[item.idx];
                        });
                        var mean = d3.mean(filteredLeaves, function (d) {
                            return +d[item.idx];
                        });
                        var max = d3.max(filteredLeaves, function (d) {
                            return +d[item.idx];
                        });
                        if (min > mean || min > max || mean > max) {
                            console.log(item.col + "-min:  " + min);
                            console.log(item.col + "-mean:  " + mean);
                            console.log(item.col + "-max:  " + max);
                        }
                        var retVal = item.aggregator(filteredLeaves, function (d) {
                            return +d[item.idx];
                        });
                        return retVal;
                    }),
                    leaves: leaves
                }
            })
            .entries(this.data())
        ;
        return retVal.map(function (d) { return [d.key].concat(d.values.rollups).concat([d.values.leaves]); });
    };

    //  Events  ---
    INDChart.prototype.click = function (row, column, selected) {
        console.log("Click:  " + JSON.stringify(row) + ", " + column + ", " + selected);
    };

    return INDChart;
}));