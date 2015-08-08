"use strict";
define(["src/common/Widget"], function (Widget) {
    describe("oop", function (done) {
        var BaseObject = Widget.prototype.__extend();
        BaseObject.prototype._class += " BaseObject";

        BaseObject.prototype.publish("prop", 42, "number", "The meaning of life").__proxy(function (_) {
            var retVal = __proxy.apply(this, arguments);
            if (arguments.length) {
                this.__test = _;
            }
            return retVal;
        });

        BaseObject.prototype.add = function (a, b) {
            return "base-" + a + "-" + b;
        };

        describe("Proxy Tests", function () {
            it("Create __proxy", function () {
                BaseObject.prototype.__proxy("add", function (a, b) {
                    return "o1-" + __proxy.apply(this, arguments);
                });
                BaseObject.prototype.__proxy("add", function (a, b) {
                    return "o2-" + __proxy.apply(this, arguments);
                });
                BaseObject.prototype.__proxy("add", function (a, b, c) {
                    return "o3-" + __proxy.call(this, a, b) + "-" + c;
                });
            });
            it("Missing __proxy", function () {
                try {
                    BaseObject.prototype.__proxy("missing_func", function () {
                    });
                } catch (e) {
                    return;
                }
                assert.isTrue(false, "expected an exception");
            });

            var obj = new BaseObject();
            it("__proxy calls", function () {
                assert.equal(obj.add(5, 7, 11), "o3-o2-o1-base-5-7-11");
                assert.equal(obj.prop(55), obj);
                assert.equal(obj.prop(), 55);
                assert.equal(obj.__test, 55);
            });
        });

        describe("derived class", function () {
            function DerivedObject() {
                BaseObject.call(this);
            }
            DerivedObject.prototype = Object.create(BaseObject.prototype);
            DerivedObject.prototype.constructor = DerivedObject;
            DerivedObject.prototype._class += " DerivedObject";

            DerivedObject.prototype.add = function (a, b, c) {
                return "o4-" + BaseObject.prototype.add.call(this, a, b, c);
            };

            var obj = new DerivedObject();
            it("derived class calls", function () {
                assert.equal(obj.add(5, 7, 11), "o4-o3-o2-o1-base-5-7-11");
            });
        });
    });
});
