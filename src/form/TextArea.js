"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "./Input"], factory);
    } else {
        root.form_Input = factory(root.d3, root.common_Input);
    }
}(this, function (d3, Input) {
    function TextArea() {
        Input.call(this);

        this._tag = "div";
        this.type("textarea");
    }
    TextArea.prototype = Object.create(Input.prototype);
    TextArea.prototype.constructor = TextArea;
    TextArea.prototype._class += " form_TextArea";

    TextArea.prototype.publish("rows", null, "number", "Rows", null, { optional: true });
    TextArea.prototype.publish("cols", null, "number", "Columns", null, { optional: true });
    TextArea.prototype.publish("wrap", "off", "set", "Wrap", ["off", "on"]);

    TextArea.prototype.enter = function (domNode, element) {
        Input.prototype.enter.apply(this, arguments);
    };

    TextArea.prototype.update = function (domNode, element) {
        Input.prototype.update.apply(this, arguments);
        this._inputElement
            .attr("rows", this.rows())
            .attr("cols", this.cols())
            .attr("wrap", this.wrap())
            .style("height", this.height() + "px")
        ;
    };

    return TextArea;
}));