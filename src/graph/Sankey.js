"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/SVGWidget", "../common/Palette", "../common/PropertyExt", "d3-sankey", "css!./Sankey"], factory);
    } else {
        root.graph_Graph = factory(root.d3, root.common_SVGWidget, root.common_Palette, root.common_PropertyExt, root.d3.sankey);
    }
}(this, function (d3, SVGWidget, Palette, PropertyExt, D3Sankey) {
    D3Sankey = D3Sankey || d3.sankey || root.d3.sankey;

    function Column(owner) {
        PropertyExt.call(this);
        this._owner = owner;
    }
    Column.prototype = Object.create(PropertyExt.prototype);
    Column.prototype.constructor = Column;
    Column.prototype._class += " graph_Sankey.Column";

    Column.prototype.publish("label", null, "set", "Field", function () { return this._owner ? this._owner.columns() : []; }, { optional: true });

    function Sankey(target) {
        SVGWidget.call(this);
        this._drawStartPos = "origin";
    }
    Sankey.prototype = Object.create(SVGWidget.prototype);
    Sankey.prototype.constructor = Sankey;
    Sankey.prototype._class += " graph_Sankey";
    Sankey.prototype.Column = Column;

    Sankey.prototype._palette = Palette.ordinal("default");

    Sankey.prototype.publish("paletteID", "default", "set", "Palette ID", Sankey.prototype._palette.switch());
    Sankey.prototype.publish("sourceColumns", [], "propertyArray", "Source Columns", null, { autoExpand: Column });
    Sankey.prototype.publish("vertexWidth", 36, "number", "Vertex Width");
    Sankey.prototype.publish("vertexPadding", 40, "number", "Vertex Padding");

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

        this._sankey = d3.sankey();

        this._path = this._sankey.link();
    };

    Sankey.prototype.update = function (domNode, element) {
        SVGWidget.prototype.update.apply(this, arguments);

        this._palette = this._palette.switch(this.paletteID());

        var sankeyData = this.sankeyData();
        this._sankey
            .size([this.width(), this.height()])
            .nodeWidth(this.vertexWidth())
            .nodePadding(this.vertexPadding())
            .nodes(sankeyData.vertices)
            .links(sankeyData.edges)
            .layout(32)
        ;

        // add in the links
        var link = element.selectAll(".link").data(sankeyData.edges);
        link.enter().append("path")
            .attr("class", "link")
            .append("title")
        ;

        link.select("title")
            .text(function (d) {
                return d.source.name + " → " +
                    d.target.name + "\n" + d.value;
            })
        ;

        link
            .attr("d", this._path)
            .style("stroke-width", function (d) { return Math.max(1, d.dy); })
            .sort(function (a, b) { return b.dy - a.dy; })
        ;
        link.exit().remove();

        // add in the nodes
        var node = element.selectAll(".node").data(sankeyData.vertices);
        node.enter().append("g")
            .attr("class", "node")
            .each(function (d) {
                var gElement = d3.select(this);
                gElement.append("rect")
                ;
                gElement.append("text");
            })
            .on("click", function (d, idx) {
                context.click(d.name, "", true);
            })
            /*
            .call(
                d3.behavior.drag()
                    .origin(function (d) { return d; })
                    .on("dragstart", function () {
                        this.parentNode.appendChild(this);
                    })
                    .on("drag", dragmove)
                )
                */
        ;

        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
        ;

        var context = this;
        node.select("rect")
            .attr("height", function (d) { return d.dy; })
            .attr("width", this._sankey.nodeWidth())
            .style("fill", function (d) {
                d.color = context._palette(d.name);
                return d.color;
            })
            .style("stroke", function (d) {
                return d3.rgb(d.color).darker(2);
            })
        ;

        node.select("text")
             .attr("x", -6)
             .attr("y", function (d) { return d.dy / 2; })
             .attr("dy", ".35em")
             .attr("text-anchor", "end")
             .attr("transform", null)
             .text(function (d) { return d.name; })
           .filter(function (d) { return d.x < context.width() / 2; })
             .attr("x", 6 + this._sankey.nodeWidth())
             .attr("text-anchor", "start")
        ;

        node.exit().remove();

        function dragmove(d) {
            var gElement = d3.select(this);
            gElement.attr("transform",
                "translate(" + //d.x +
                        (d.x = Math.max(0, Math.min(context.width() - d.dx, d3.event.x))) +
                "," + (
                        d.y = Math.max(0, Math.min(context.height() - d.dy, d3.event.y))
                    ) + ")");
            context._sankey.relayout();
            link.attr("d", context._path);

            gElement.select("text")
             .attr("x", -6)
             .attr("y", function (d) { return d.dy / 2; })
             .attr("dy", ".35em")
             .attr("text-anchor", "end")
             .attr("transform", null)
             .text(function (d) { return d.name; })
           .filter(function (d) { return d.x < context.width() / 2; })
             .attr("x", 6 + context._sankey.nodeWidth())
             .attr("text-anchor", "start")
        }

    };

    Sankey.prototype.exit = function (domNode, element) {
        SVGWidget.prototype.exit.apply(this, arguments);
    };

    Sankey.prototype.click = function (row, col, sel) {
        console.log(row + ", " + col + ", " + sel)
        var d = 0;
    };

    return Sankey;
}));
