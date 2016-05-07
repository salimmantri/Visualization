"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.test_chartFactory = factory();
    }
}(this, function () {
    var chartFactory = {
        Column: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chart/Column"], function (DataFactory, Column) {
                    callback(new Column()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                    );
                });
            },
            "long-label": function (callback) {
                require(["test/DataFactory", "src/chart/Column"], function (DataFactory, Column) {
                    callback(new Column()                        
                        .columns(DataFactory.ND.subjects.columns)
                        .data([
                            ["Geography-Geography-Geography-Geography-Geography", 75, 68, 65],
                            ["English", 45, 55, 52],
                            ["Math", 98, 92, 90],
                            ["Science", 66, 60, 72]
                        ])

                        .xAxisOverlapMode("rotate")
                        .xAxisLabelRotation(45)
                    );
                });
            },
            bar: function (callback) {
                chartFactory.Column.simple(function (widget) {
                    widget.orientation("vertical");
                    callback(widget);
                });
            },
            ordinalRange: function (callback) {
                require(["test/DataFactory", "src/chart/Column"], function (DataFactory, Column) {
                    callback(new Column()
                        .columns(DataFactory.ordinalRange.default.columns)
                        .data(DataFactory.ordinalRange.default.data)
                        
                        .yAxisType("linear")
                        .xAxisType("ordinal")
                    );
                });
            },
            linear: function (callback) {
                require(["test/DataFactory", "src/chart/Column"], function (DataFactory, Column) {
                    callback(new Column()
                        .columns(DataFactory.linear.default.columns)
                        .data(DataFactory.linear.default.data)
                        
                        .xAxisType("linear")
                        .yAxisType("linear")
                    );
                });
            },
            timeX: function (callback) {
                require(["test/DataFactory", "src/chart/Column"], function (DataFactory, Column) {
                    callback(new Column()
                        .columns(DataFactory.timeX.default.columns)
                        .data(DataFactory.timeX.default.data)
                        
                        .xAxisType("time")
                        .xAxisTypeTimePattern("%Y-%m-%dT%H:%M:%S")
                        .yAxisType("linear")
                    );
                });
            },
            timeY: function (callback) {
                require(["test/DataFactory", "src/chart/Column"], function (DataFactory, Column) {
                    callback(new Column()
                        .columns(DataFactory.timeY.default.columns)
                        .data(DataFactory.timeY.default.data)
                        
                        .xAxisType("ordinal")
                        .yAxisType("time")
                        .yAxisTypeTimePattern("%Y-%m-%d")
                    );
                });
            },
        },
        Bar: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chart/Bar"], function (DataFactory, Bar) {
                    callback(new Bar()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                    );
                });
            }
        },
        Gantt: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chart/Gantt"], function (DataFactory, Gantt) {
                    callback(new Gantt()
                        .yAxisTypeTimePattern("%Y-%m-%d")
                        .columns(["Project", "Date Range"])
                        .data([
                            ["Docs", ["2012-09-09", "2012-10-09"]],
                            ["Coding", ["2011-08-09", "2012-09-09"]],
                            ["Specs", ["2010-07-09", "2011-08-09"]]
                        ])
                    );
                });
            }
        },
        Bubble: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chart/Bubble"], function (DataFactory, Bubble) {
                    callback(new Bubble()
                        .columns(DataFactory.TwoD.subjects.columns)
                        .data(DataFactory.TwoD.subjects.data)
                    );
                });
            }
        },
        Scatter: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chart/Scatter"], function (DataFactory, Scatter) {
                    callback(new Scatter()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                    );
                });
            }
        },
        BoxPlot: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chart/BoxPlot"], function (DataFactory, BoxPlot) {
                    callback(new BoxPlot()
                        .columns(["Expt", "Run", "Speed"])
                        .data([[1, 1, 850], [1, 2, 740], [1, 3, 900], [1, 4, 1070], [1, 5, 930], [1, 6, 850], [1, 7, 950], [1, 8, 980], [1, 9, 980], [1, 10, 880], [1, 11, 1000], [1, 12, 980], [1, 13, 930], [1, 14, 650], [1, 15, 760], [1, 16, 810], [1, 17, 1000], [1, 18, 1000], [1, 19, 960], [1, 20, 960], [2, 1, 960], [2, 2, 940], [2, 3, 960], [2, 4, 940], [2, 5, 880], [2, 6, 800], [2, 7, 850], [2, 8, 880], [2, 9, 900], [2, 10, 840], [2, 11, 830], [2, 12, 790], [2, 13, 810], [2, 14, 880], [2, 15, 880], [2, 16, 830], [2, 17, 800], [2, 18, 790], [2, 19, 760], [2, 20, 800], [3, 1, 880], [3, 2, 880], [3, 3, 880], [3, 4, 860], [3, 5, 720], [3, 6, 720], [3, 7, 620], [3, 8, 860], [3, 9, 970], [3, 10, 950], [3, 11, 880], [3, 12, 910], [3, 13, 850], [3, 14, 870], [3, 15, 840], [3, 16, 840], [3, 17, 850], [3, 18, 840], [3, 19, 840], [3, 20, 840], [4, 1, 890], [4, 2, 810], [4, 3, 810], [4, 4, 820], [4, 5, 800], [4, 6, 770], [4, 7, 760], [4, 8, 740], [4, 9, 750], [4, 10, 760], [4, 11, 910], [4, 12, 920], [4, 13, 890], [4, 14, 860], [4, 15, 880], [4, 16, 720], [4, 17, 840], [4, 18, 850], [4, 19, 850], [4, 20, 780], [5, 1, 890], [5, 2, 840], [5, 3, 780], [5, 4, 810], [5, 5, 760], [5, 6, 810], [5, 7, 790], [5, 8, 810], [5, 9, 820], [5, 10, 850], [5, 11, 870], [5, 12, 870], [5, 13, 810], [5, 14, 740], [5, 15, 810], [5, 16, 940], [5, 17, 950], [5, 18, 800], [5, 19, 810], [5, 20, 870]])
                    );
                });
            }
        },
        Line: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chart/Line"], function (DataFactory, Line) {
                    callback(new Line()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                    );
                });
            },
            timeX: function (callback) {
                require(["test/DataFactory", "src/chart/Line"], function (DataFactory, Line) {
                    callback(new Line()
                        .columns(DataFactory.timeX.default.columns)
                        .data(DataFactory.timeX.default.data)
                        
                        .xAxisType("time")
                        .xAxisTypeTimePattern("%Y-%m-%dT%H:%M:%S")
                        .yAxisType("linear")
                    );
                });
            },
            cardinal_interpolation: function (callback) {
                require(["test/DataFactory", "src/chart/Line"], function (DataFactory, Line) {
                    callback(new Line()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                        .interpolate("cardinal")
                    );
                });
            }
        },
        Area: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chart/Area"], function (DataFactory, Area) {
                    callback(new Area()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                    );
                });
            }
        },
        Pie: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chart/Pie"], function (DataFactory, Pie) {
                    callback(new Pie()
                        .columns(DataFactory.TwoD.subjects.columns)
                        .data(DataFactory.TwoD.subjects.data)
                    );
                });
            }
        },
        Step: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chart/Step"], function (DataFactory, Step) {
                    callback(new Step()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                    );
                });
            }
        },
        Summary: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chart/Summary"], function (DataFactory, Summary) {
                    callback(new Summary()
                        .columns(DataFactory.OneD.subjects.columns)
                        .data(DataFactory.OneD.subjects.data)
                    );
                });
            }
        },
        MultiChart: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chart/MultiChart"], function (DataFactory, MultiChart) {
                    callback(new MultiChart()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                    );
                });
            }
        },
        MultiChartSurface: {
            simple: function (callback) {
                require(["test/DataFactory", "src/chart/MultiChartSurface"], function (DataFactory, MultiChartSurface) {
                    callback(new MultiChartSurface()
                        .columns(DataFactory.ND.subjects.columns)
                        .data(DataFactory.ND.subjects.data)
                    );
                });
            }
        }
    };

    return chartFactory;
}));
