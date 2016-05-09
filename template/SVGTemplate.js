"use strict";
     function SVGTemplate(target) {
        SVGWidget.call(this);
    }
    SVGTemplate.prototype = Object.create(SVGWidget.prototype);
    SVGTemplate.prototype.constructor = SVGTemplate;
    SVGTemplate.prototype._class += " template_SVGTemplate";

    SVGTemplate.prototype.publish("stringProp", "defaultValue", "string", "Sample Property");

    SVGTemplate.prototype.enter = function (domNode, element) {
        SVGWidget.prototype.enter.apply(this, arguments);
    };

    SVGTemplate.prototype.update = function (domNode, element) {
        SVGWidget.prototype.update.apply(this, arguments);
    };

    SVGTemplate.prototype.exit = function (domNode, element) {
        SVGWidget.prototype.exit.apply(this, arguments);
    };

    return SVGTemplate;
}));
