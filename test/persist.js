"use strict";
define(["d3", "src/other/Persist", "src/layout/Grid"], function (d3, Persist, Grid) {
    describe("Persist", function (done) {
        this.timeout(10000);
        describe("Grid", function () {
            var grid;
            var clone;
            it("create", function (done) {
                assert.equal(d3.select("#persistOrig").html(), "");
                grid = new Grid()
                    .target("persistOrig")
                    .testData()
                    .render(function () {
                        assert.notEqual(d3.select("#persistOrig").html(), "");
                        done();
                    })
                ;
            });
            it("clone", function (done) {
                assert.equal(d3.select("#persistTarget").html(), "");
                Persist.clone(grid, function (widget) {
                    clone = widget;
                    widget
                        .target("persistTarget")
                        .testData()
                        .render(function () {
                            assert.notEqual(d3.select("#persistTarget").html(), "");
                            done();
                        })
                    ;
                })
            });
            it("tweak", function (done) {
                var gridStr = Persist.serialize(grid);
                assert.equal(Persist.serialize(grid), Persist.serialize(clone));
                var pie = grid.getCell(0, 0).widget();
                assert.isDefined(pie, "Has Pie Cell");
                pie.paletteID("default");
                assert.notEqual(Persist.serialize(grid), Persist.serialize(clone), "Palette change again");
                pie.paletteID("Dark2");
                assert.notEqual(Persist.serialize(grid), Persist.serialize(clone), "Palette changed");

                Persist.deserialize(clone, Persist.serialize(grid, null, true), function (widget) {
                    widget.render(function () {
                        assert.equal(Persist.serialize(grid), Persist.serialize(clone), "Deserialize should reset properties.");

                        pie.render(function () {
                            done();
                        });
                    });
                    //return;

                });
            });
            it("destroy", function () {
                //grid.target(null);
                //assert.equal(d3.select("#persistOrig").html(), "");
            });
        });
    });
});
