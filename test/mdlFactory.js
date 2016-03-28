"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.test_otherFactory = factory();
    }
}(this, function (DataFactory, HeatMap, WordCloud, Table) {
    return {
        Surface: {
            simple: function (callback) {
                require(["test/DataFactory", "src/mdl/Surface", "src/chart/Line"], function (DataFactory, Surface, Line) {
                    callback(new Surface()
                        .title(DataFactory.Surface.simple.title)
                        .widget(new Line()
                            .columns(DataFactory.ND.subjects.columns)
                            .data(DataFactory.ND.subjects.data)
                        )
                    );
                });
            }
        }
    };
}));
