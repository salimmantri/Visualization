require.config({
    waitSeconds : 30,
    baseUrl: ".",
    paths: {
        "requireLib": "../node_modules/requirejs/require",
        "css": "../node_modules/require-css/css",
        "css-builder": "../node_modules/require-css/css-builder",
        "normalize": "../node_modules/require-css/normalize",
        "async": "../node_modules/requirejs-plugins/src/async",
        "propertyParser": "../node_modules/requirejs-plugins/src/propertyParser",
        "goog": "../node_modules/requirejs-plugins/src/goog",

        "d3": "../bower_components/d3/d3",
        "c3": "../bower_components/c3/c3",
        "dagre": "../bower_components/dagre/index",
        "topojson": "../bower_components/topojson/topojson",
        "colorbrewer": "../bower_components/colorbrewer/colorbrewer",
        "d3-cloud": "../bower_components/d3-cloud/build/d3.layout.cloud",
        "font-awesome": "../bower_components/font-awesome/css/font-awesome",
        "es6-promise": "../bower_components/es6-promise/promise",

        "amcharts": "../bower_components/amcharts3/amcharts/amcharts",
        "amcharts.funnel": "../bower_components/amcharts3/amcharts/funnel",
        "amcharts.gauge": "../bower_components/amcharts3/amcharts/gauge",
        "amcharts.pie": "../bower_components/amcharts3/amcharts/pie",
        "amcharts.radar": "../bower_components/amcharts3/amcharts/radar",
        "amcharts.serial": "../bower_components/amcharts3/amcharts/serial",
        "amcharts.xy": "../bower_components/amcharts3/amcharts/xy",
        "amcharts.gantt": "../bower_components/amcharts3/amcharts/gantt",
        "amcharts.plugins.responsive": "../bower_components/amcharts3/amcharts/plugins/responsive/responsive",
        "amchartsImg": "../bower_components/amcharts3/amcharts/images/",

        "simpleheat": "../bower_components/simpleheat/index",

        "src": "../src"
    },
    shim: {
        "amcharts.funnel": {
            deps: ["amcharts"],
            exports: "AmCharts",
            init: function() {
                AmCharts.isReady = true;
            }
        },
        "amcharts.gauge": {
            deps: ["amcharts"],
            exports: "AmCharts",
            init: function() {
                AmCharts.isReady = true;
            }
        },
        "amcharts.pie": {
            deps: ["amcharts"],
            exports: "AmCharts",
            init: function() {
                AmCharts.isReady = true;
            }
        },
        "amcharts.radar": {
            deps: ["amcharts"],
            exports: "AmCharts",
            init: function() {
                AmCharts.isReady = true;
            }
        },
        "amcharts.serial": {
            deps: ["amcharts"],
            exports: "AmCharts",
            init: function() {
                AmCharts.isReady = true;
            }
        },
        "amcharts.xy": {
            deps: ["amcharts"],
            exports: "AmCharts",
            init: function() {
                AmCharts.isReady = true;
            }
        },
        'amcharts.gantt': {
            deps: [ 'amcharts', 'amcharts.serial' ],
            exports: 'AmCharts',
            init: function() {
                AmCharts.isReady = true;
            }
        },
        "simpleheat": {
            exports: "simpleheat",
            init: function() {
                simpleheat.isReady = true;
            }
        }
    }
});

var hostname = window.location.hostname;
var src = "../src";
switch (hostname) {
case "bl.ocks.org":
case "blockbuilder.org":
    hostname = "rawgit.com";
    src = "//" + hostname + "/GordonSmith/Visualization/GIST/src";
case "rawgit.com":
case "cdn.rawgit.com":
    require.config({
        paths: {
            "css": "//" + hostname + "/guybedford/require-css/0.1.8/css.min",
            "css-builder": "//" + hostname + "/guybedford/require-css/0.1.8/css-builder.min",
            "normalize": "//" + hostname + "/guybedford/require-css/0.1.8/normalize.min",
            "async": "//" + hostname + "/millermedeiros/requirejs-plugins/v1.0.3/src/async",
            "propertyParser": "//" + hostname + "/millermedeiros/requirejs-plugins/v1.0.3/src/propertyParser",
            "goog": "//" + hostname + "/millermedeiros/requirejs-plugins/v1.0.3/src/goog",

            "d3": "//" + hostname + "/mbostock/d3/v3.5.5/d3.min",
            "c3": "//" + hostname + "/masayuki0812/c3/0.4.10/c3.min",
            "dagre": "//" + hostname + "/cpettitt/dagre/v0.7.3/dist/dagre.min",
            "topojson": "//" + hostname + "/mbostock/topojson/v1.6.19/topojson",
            "colorbrewer": "//" + hostname + "/jeanlauliac/colorbrewer/v1.0.0/colorbrewer",
            "d3-cloud": "//" + hostname + "/jasondavies/d3-cloud/v1.2.0/build/d3.layout.cloud",
            "font-awesome": "//" + hostname + "/FortAwesome/Font-Awesome/v4.3.0/css/font-awesome.min",
            "es6-promise": "//" + hostname + "/jakearchibald/es6-promise/v3.0.2/dist/es6-promise.min",

            "amcharts": "//" + hostname + "/amcharts/amcharts3/3.18.0/amcharts/amcharts",
            "amcharts.funnel": "//" + hostname + "/amcharts/amcharts3/3.18.0/amcharts/funnel",
            "amcharts.gauge": "//" + hostname + "/amcharts/amcharts3/3.18.0/amcharts/gauge",
            "amcharts.pie": "//" + hostname + "/amcharts/amcharts3/3.18.0/amcharts/pie",
            "amcharts.radar": "//" + hostname + "/amcharts/amcharts3/3.18.0/amcharts/radar",
            "amcharts.serial": "//" + hostname + "/amcharts/amcharts3/3.18.0/amcharts/serial",
            "amcharts.xy": "//" + hostname + "/amcharts/amcharts3/3.18.0/amcharts/xy",
            "amcharts.gantt": "//" + hostname + "/amcharts/amcharts3/3.18.0/amcharts/gantt",
            "amcharts.plugins.responsive": "//" + hostname + "/amcharts/amcharts3/3.18.0/amcharts/plugins/responsive/responsive",
            "amcharts.plugins.dataloader": "//" + hostname + "/amcharts/amcharts3/3.18.0/amcharts/plugins/dataloader",
            "amchartsImg": "//" + hostname + "/amcharts/amcharts3/3.18.0/amcharts/images/",
            "simpleheat": "//" + hostname + "/mourner/simpleheat/v0.3.0/simpleheat",

            "src": src
        }
    });
}
