"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/SVGWidget", "../common/PropertyExt", "../common/Palette", "d3-sankey", "css!./Sankey"], factory);
    } else {
        root.graph_Sankey = factory(root.d3, root.common_SVGWidget, root.common_PropertyExt, root.common_Palette);
    }
}(this, function (d3, SVGWidget, PropertyExt, Palette) {
    function Column(owner) {
        PropertyExt.call(this);
        this._owner = owner;
    }
    Column.prototype = Object.create(PropertyExt.prototype);
    Column.prototype.constructor = Column;
    Column.prototype._class += " graph_Sankey.Column";

    Column.prototype.publish("label", null, "set", "Field", function () { return this._owner ? this._owner.columns() : []; }, { optional: true });

    function Sankey() {
        SVGWidget.call(this);
        this._drawStartPos = "origin";
    }
    Sankey.prototype = Object.create(SVGWidget.prototype);
    Sankey.prototype.constructor = Sankey;
    Sankey.prototype._class += " graph_Sankey";
    Sankey.prototype.Column = Column;

    Sankey.prototype._palette = Palette.ordinal("default");

    Sankey.prototype.publish("sourceColumns", [], "propertyArray", "Source Columns", null, { autoExpand: Column });

    Sankey.prototype.sankeyData = function () {
        var vertexIndex = {};
        var retVal = {
            vertices: [],
            edges: []
        }
        var sourceColumns = this.sourceColumns().filter(function (col) { return col.label(); });
        sourceColumns.forEach(function (col, idx) {
            var view = this._db.rollupView([col.label()]);
            view.entries().forEach(function (row) {
                var id = col.label() + ":" + idx + ":" + row.key;
                if (!vertexIndex[id]) {
                    retVal.vertices.push({
                        __id: id,
                        __category: col.label(),
                        name: row.key
                    })
                    vertexIndex[id] = retVal.vertices.length - 1;
                }
            }, this);
        }, this);
        sourceColumns.forEach(function (col, idx) {
            if (idx < sourceColumns.length - 1) {
                var col2 = sourceColumns[idx + 1];
                var view = this._db.rollupView([col.label(), col2.label()]);
                view.entries().forEach(function (row) {
                    var sourceID = col.label() + ":" + idx + ":" + row.key;
                    row.values.forEach(function (value) {
                        var targetID = col2.label() + ":" + (idx + 1) + ":" + value.key;
                        retVal.edges.push({
                            __id: sourceID + "_" + targetID,
                            source: vertexIndex[sourceID],
                            target: vertexIndex[targetID],
                            value: value.values.length
                        });
                    });
                });
            }
        }, this);

        return retVal;
    };
    
    Sankey.prototype.enter = function (domNode, element) {
        SVGWidget.prototype.enter.apply(this, arguments);
        this.d3Sankey = d3.sankey()
            .nodeWidth(36)
            .nodePadding(40)
        ;
        this.d3Path = this.d3Sankey.link();
    };

    Sankey.prototype.update = function (domNode, element) {
        SVGWidget.prototype.update.apply(this, arguments);
        var context = this;

        var width = this.width();
        var height = this.height();
        var data = this.sankeyData();
        this.d3Sankey
            .size([width, height])
            .nodes(data.vertices)
            .links(data.edges)
            .layout(32)
        ;

        var link = element.selectAll(".link").data(data.edges, function (d) { return d.__id; });
        link.enter().append("path")
            .attr("class", "link")
        ;
        link
            .attr("d", this.d3Path)
            .style("stroke-width", function (d) { return Math.max(1, d.dy); })
            .sort(function (a, b) { return b.dy - a.dy; })
        ;
        link.exit().remove();

        var node = element.selectAll(".node").data(data.vertices, function (d) { return d.__id; });
        node.enter().append("g")
            .attr("class", "node")
            .call(d3.behavior.drag()
                .origin(function (d) { return d; })
                .on("dragstart", function () { this.parentNode.appendChild(this); })
                .on("drag", dragmove))
            .each(function (d) {
                var element = d3.select(this);
                element
                    .append("rect")
                    .append("title")
                ;
                element.append("text");
            })
        ;
        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
        ;
        node.select(".node > rect")
            .attr("height", function (d) { return d.dy; })
            .attr("width", this.d3Sankey.nodeWidth())
            .style("stroke", function (d) { return context._palette(d.__category); })
            .style("fill", function (d) { return context._palette(d.name); })
        ;
        node.select(".node > rect > title")
            .text(function (d) { return d.name; })
        ;
        node.select(".node > text")
            .attr("x", -6)
            .attr("y", function (d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function (d) { return d.name; })
        .filter(function (d) { return d.x < width / 2; })
            .attr("x", 6 + this.d3Sankey.nodeWidth())
            .attr("text-anchor", "start")
        ;
        node.exit().remove();

        function dragmove(d) {
            d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(context.height() - d.dy, d3.event.y))) + ")");
            context.d3Sankey.relayout();
            element.selectAll(".link").attr("d", context.d3Path);
        }
    };

    Sankey.prototype.exit = function (domNode, element) {
        SVGWidget.prototype.exit.apply(this, arguments);
    };

    return Sankey;
}));
