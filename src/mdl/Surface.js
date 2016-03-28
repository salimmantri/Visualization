"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["./Common", "css!./Surface"], factory);
    } else {
        root.layout_Surface = factory(root.mdl_Common);
    }
}(this, function (Common) {
    function Surface() {
        Common.call(this);
    }
    Surface.prototype = Object.create(Common.prototype);
    Surface.prototype.constructor = Surface;
    Surface.prototype._class += " mdl_Surface";

    Surface.prototype.publish("title", "", "string", "Title",null,{tags:["Intermediate"]});
    Surface.prototype.publish("widget", null, "widget", "Widget", null, { tags: ["Basic"] });

    Surface.prototype.publish("surfacePadding", null, "string", "Surface Padding (px)", null, { tags: ["Intermediate"] });

    Surface.prototype.widgetSize = function (titleDiv, widgetDiv) {
        var width = this.clientWidth();
        var height = this.clientHeight();
        height -= this.calcHeight(titleDiv);
        height -= this.calcFrameHeight(widgetDiv);
        width -= this.calcFrameWidth(widgetDiv);
        return { width: width, height: height };
    };

    Surface.prototype.enter = function (domNode, element) {
        Common.prototype.enter.apply(this, arguments);
        element
            .classed("mdl-layout mdl-js-layout mdl-layout--fixed-header is-small-screen", true)
        ;
        this._header = element.append("div")
            .attr("class", "mdl-layout__header")
        ;
        this._header_row = this._header.append("div")
            .attr("class", "mdl-layout__header-row")
        ;
        this._header_row_title = this._header_row.append("span")
            .attr("class", "mdl-layout-title")
        ;
        this._header_row.append("div")
            .attr("class", "mdl-layout-spacer")
        ;
        this._header_nav = this._header_row.append("nav")
            .attr("class", "mdl-navigation mdl-layout--large-screen-only")
        ;
        this._header_nav.append("a")
            .attr("class", "mdl-navigation__link")
            .attr("href", "''")
            .text("Link")
        ;
        this._drawer = element.append("div")
            .attr("class", "mdl-layout__drawer")
        ;
        this._drawer_title = this._drawer.append("span")
            .attr("class", "mdl-layout-title")
        ;
        this._drawer_nav = this._drawer.append("nav")
            .attr("class", "mdl-navigation")
        ;
        this._drawer_nav.append("a")
            .attr("class", "mdl-navigation__link")
            .attr("href", "''")
            .text("Link")
        ;
        this._content = element.append("div")
            .attr("id", this._id + "_content")
            .attr("class", "mdl-layout__content")
        ;
        componentHandler.upgradeElement(element.node());
    };

    Surface.prototype.update = function (domNode, element) {
        Common.prototype.update.apply(this, arguments);
        var context = this;

        this._header_row_title.text(this.title());
        this._drawer_title.text(this.title());

        var widgets = this._content.selectAll("#" + this._id + "_content > .surfaceWidget").data(this.widget() ? [this.widget()] : [], function (d) { return d._id; });
        widgets.enter().append("div")
            .attr("class", "surfaceWidget")
            .each(function (d) {
                d3.select(context.element().node().parentElement).classed("content-icon content-icon-" + (d.classID().split("_")[1]), true);
                d.target(this);
            })
        ;
        widgets
            .style("padding", this.surfacePadding_exists() ? this.surfacePadding() + "px" : null)
            .each(function (d) {
                var widgetSize = context.widgetSize(context._header, d3.select(this));
                if (widgetSize.width < 0) widgetSize.width = 0;
                if (widgetSize.height < 0) widgetSize.height = 0;
                d
                    .resize({ width: widgetSize.width, height: widgetSize.height })
                ;
            })
        ;
        widgets.exit().each(function (d) {
            d.target(null);
        }).remove();
    };

    Surface.prototype.exit = function (domNode, element) {
        Common.prototype.exit.apply(this, arguments);
    };

    return Surface;
}));
