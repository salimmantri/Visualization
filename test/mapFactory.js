"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.test_mapFactory = factory();
    }
}(this, function () {
    var geoHashData = [{ "count": 34677, "term": "tnk" }, { "count": 21076, "term": "svz" }, { "count": 17655, "term": "s00" }, { "count": 7082, "term": "w30" }, { "count": 6662, "term": "sv8" }, { "count": 5964, "term": "syq" }, { "count": 5594, "term": "xn7" }, { "count": 5123, "term": "tq8" }, { "count": 4472, "term": "tq6" }, { "count": 4015, "term": "xn0" }, { "count": 3753, "term": "syp" }, { "count": 3463, "term": "tnb" }, { "count": 3432, "term": "tjm" }, { "count": 3398, "term": "tw4" }, { "count": 3074, "term": "syr" }, { "count": 2914, "term": "w1p" }, { "count": 2459, "term": "t02" }, { "count": 2082, "term": "tc9" }, { "count": 2032, "term": "wyd" }, { "count": 2008, "term": "w4r" }, { "count": 2002, "term": "wh6" }, { "count": 1817, "term": "tmy" }, { "count": 1801, "term": "tw1" }, { "count": 1772, "term": "twj" }, { "count": 1770, "term": "wvu" }, { "count": 1716, "term": "ttc" }, { "count": 1682, "term": "xn1" }, { "count": 1667, "term": "tjw" }, { "count": 1664, "term": "tj6" }, { "count": 1659, "term": "tmr" }, { "count": 1651, "term": "tjd" }, { "count": 1637, "term": "tmw" }, { "count": 1595, "term": "tp8" }, { "count": 1594, "term": "tnh" }, { "count": 1529, "term": "sv9" }, { "count": 1493, "term": "xn6" }, { "count": 1463, "term": "tne" }, { "count": 1462, "term": "szx" }, { "count": 1410, "term": "wyp" }, { "count": 1402, "term": "wyn" }, { "count": 1389, "term": "xn3" }, { "count": 1309, "term": "tn4" }, { "count": 1300, "term": "wsq" }, { "count": 1287, "term": "d29" }, { "count": 1280, "term": "tn0" }, { "count": 1275, "term": "ttb" }, { "count": 1271, "term": "ucf" }, { "count": 1266, "term": "tm2" }, { "count": 1259, "term": "twh" }, { "count": 1252, "term": "w4x" }, { "count": 1233, "term": "tnm" }, { "count": 1198, "term": "u15" }, { "count": 1194, "term": "svy" }, { "count": 1180, "term": "tn5" }, { "count": 1176, "term": "tn8" }, { "count": 1173, "term": "tmt" }, { "count": 1169, "term": "sfx" }, { "count": 1155, "term": "u0n" }, { "count": 1145, "term": "tc8" }, { "count": 1138, "term": "ttf" }, { "count": 1138, "term": "6gy" }, { "count": 1137, "term": "tp9" }, { "count": 1113, "term": "tw5" }, { "count": 1111, "term": "tuu" }, { "count": 1104, "term": "dr4" }, { "count": 1072, "term": "u0v" }, { "count": 1048, "term": "u09" }, { "count": 1040, "term": "gcp" }, { "count": 1038, "term": "sy1" }, { "count": 1023, "term": "sfr" }, { "count": 1018, "term": "tnd" }, { "count": 1007, "term": "svc" }, { "count": 993, "term": "ttv" }, { "count": 954, "term": "tn1" }, { "count": 941, "term": "u1h" }, { "count": 934, "term": "u0m" }, { "count": 933, "term": "u0w" }, { "count": 924, "term": "tug" }, { "count": 913, "term": "u0q" }, { "count": 909, "term": "u1j" }, { "count": 904, "term": "dr7" }, { "count": 874, "term": "u2m" }, { "count": 810, "term": "dqc" }, { "count": 717, "term": "tn7" }, { "count": 695, "term": "d2f" }, { "count": 694, "term": "u0u" }, { "count": 692, "term": "tjf" }, { "count": 686, "term": "xnd" }, { "count": 671, "term": "u0y" }, { "count": 667, "term": "drt" }, { "count": 665, "term": "u1w" }, { "count": 552, "term": "wc2" }, { "count": 526, "term": "u30" }, { "count": 523, "term": "tnt" }, { "count": 508, "term": "xne" }, { "count": 499, "term": "xps" }, { "count": 495, "term": "tjb" }, { "count": 489, "term": "dp3" }, { "count": 484, "term": "dr5" }, { "count": 357, "term": "u28" }];
    var createMap = function (gmapFlag, callback) {
        require(["test/DataFactory", "src/map/GMapLayered", "src/map/Layered", "src/map/OpenStreet", "src/map/ChoroplethContinents", "src/map/ChoroplethCountries", "src/map/ChoroplethStates", "src/map/ChoroplethCounties", "src/map/Graticule", "src/map/GeoHash", "src/map/Graph", "src/map/Heat"], function (DataFactory, GMap, Layered, OpenStreet, ChoroplethContinents, ChoroplethCountries, ChoroplethStates, ChoroplethCounties, Graticule, GeoHash, Pins, Heat) {
            var Base = gmapFlag ? GMap : Layered;
            function Sample() {
                Base.call(this);

                var rawData = DataFactory.Counties.simple.rawData;
                var countyData = rawData.map(function (item) {
                    return [item.county, item.weight];
                });

                this._openStreet = new OpenStreet()
                    .tileProvider("OpenStreetMap")
                ;
                this._continents = new ChoroplethContinents()
                    .meshStrokeWidth(0.5)
                ;
                this._states = new ChoroplethStates()
                    .meshStrokeWidth(0.5)
                ;
                this._countries = new ChoroplethCountries()
                    .opacity(0.25)
                    .meshVisible(true)
                    .meshStrokeWidth(0.75)
                    .columns(DataFactory.Countries.simple.columns)
                    .data(DataFactory.Countries.simple.rawData)
                ;
                this._counties = new ChoroplethCounties()
                    .meshVisible(false)
                    .opacity(0.5)
                    .columns(DataFactory.Counties.simple.columns)
                    .data(countyData)
                ;
                this._geoHash = new GeoHash()
                    .paletteID("PuOr")
                    .opacity(0.75)
                    .columns(["geohash", "weight"])
                    .data(geoHashData.map(function (row) { return [row.term, row.count]; }))
                ;
                this._heat = new Heat()
                    .columns(DataFactory.GMap.heat.columns)
                    .data(DataFactory.GMap.heat.data)
                ;
                this._graph_pins = new Pins()
                    .opacity(0.75)
                    .columns(DataFactory.GMap.simple.columns)
                    .data(DataFactory.GMap.simple.data)
                ;
                this._graticule = new Graticule()
                    .opacity(0.5)
                    .meshStrokeWidth(0.75)
                ;
                var layers = [
                    this._openStreet,
                    this._continents,
                    this._states,
                    this._countries,
                    this._counties,
                    this._geoHash,
                    this._counties,
                    this._heat,
                    this._graph_pins,
                    this._graticule
                ];
                this.layers(layers)
            }
            Sample.prototype = Object.create(Base.prototype);
            Sample.prototype.constructor = Sample;
            Sample.prototype._class += " test_Sample";

            Sample.prototype.publish("openStreet", !gmapFlag, "boolean", "Open Street Map");
            Sample.prototype.publish("continents", true, "boolean", "Continents");
            Sample.prototype.publish("countries", true, "boolean", "Countries");
            Sample.prototype.publish("states", true, "boolean", "US States");
            Sample.prototype.publish("counties", true, "boolean", "US Counties");
            Sample.prototype.publish("geoHash", true, "boolean", "Graticule");
            Sample.prototype.publish("graph_pins", true, "boolean", "Pins");
            Sample.prototype.publish("graticule", true, "boolean", "Graticule");
            Sample.prototype.publish("heat", true, "boolean", "Heat");

            Sample.prototype.update = function (domNode, element) {
                this._openStreet.visible(this.openStreet());
                this._continents.visible(this.continents());
                this._countries.visible(this.countries());
                this._states.visible(this.states());
                this._counties.visible(this.counties());
                this._geoHash.visible(this.geoHash());
                this._heat.visible(this.heat());
                this._graph_pins.visible(this.graph_pins());
                this._graticule.visible(this.graticule());
                Base.prototype.update.apply(this, arguments);
            };
            callback(new Sample());
        });
    }

    var mapFactory = {
        Graticule: {
            simple: function (callback) {
                require(["test/DataFactory", "src/map/Graticule"], function (DataFactory, Graticule) {
                    callback(new Graticule()
                    );
                });
            }
        },
        ChoroplethCounties: {
            simple: function (callback) {
                require(["test/DataFactory", "src/map/ChoroplethCounties"], function (DataFactory, ChoroplethCounties) {
                    var rawData = DataFactory.Counties.simple.rawData;
                    var countyData = rawData.map(function (item) {
                        return [item.county, item.weight];
                    });
                    callback(new ChoroplethCounties()
                        .columns(DataFactory.Counties.simple.columns)
                        .data(countyData)
                    );
                });
            }
        },
        ChoroplethCountries: {
            simple: function (callback) {
                require(["test/DataFactory", "src/map/ChoroplethCountries", "src/map/countries"], function (DataFactory, ChoroplethCountries, countries) {
                    callback(new ChoroplethCountries()
                        .columns(DataFactory.Countries.simple.columns)
                        .data(DataFactory.Countries.simple.rawData)
                    );
                });
            }
        },
        ChoroplethContinents: {
            simple: function (callback) {
                require(["test/DataFactory", "src/map/ChoroplethContinents", "src/map/countries"], function (DataFactory, ChoroplethContinents, countries) {
                    callback(new ChoroplethContinents());
                });
            }
        },
        ChoroplethStates: {
            simple: function (callback) {
                require(["test/DataFactory", "src/map/ChoroplethStates"], function (DataFactory, ChoroplethStates) {
                    callback(new ChoroplethStates()
                        .columns(DataFactory.States.simple.columns)
                        .data(DataFactory.States.simple.data)
                    );
                });
            },
            heat: function (callback) {
                require(["test/DataFactory", "src/layout/Layered", "src/layout/AbsoluteSurface", "src/other/HeatMap"], function (DataFactory, Layered, AbsoluteSurface, HeatMap) {
                    mapFactory.ChoroplethStates.simple(function (map) {
                        var heat = new HeatMap();
                        var heatData = DataFactory.States.heatmap.heatData;

                        var origRender = heat.render;
                        heat.render = function () {
                            this.data(heatData.map(function (row) {
                                var pos = map.project(row[0], row[1]);
                                return [pos[0], pos[1], row[2]];
                            }));
                            origRender.apply(this, arguments);
                        };
                        callback(new Layered()
                            .addLayer(new AbsoluteSurface().widget(map))
                            .addLayer(new AbsoluteSurface().widget(heat))
                        );
                    });
                });
            }
        },
        GMap: {
            simple: function (callback) {
                require(["test/DataFactory", "src/map/GMap"], function (DataFactory, GMap) {
                    callback(new GMap()
                        .columns(DataFactory.GMap.simple.columns)
                        .data(DataFactory.GMap.simple.data)
                    );
                });
            },
            graph: function (callback) {
                require(["test/DataFactory", "src/map/GMapGraph"], function (DataFactory, GMapGraph) {
                    callback(new GMapGraph()
                        .columns(DataFactory.GMap.graph.columns)
                        .data(DataFactory.GMap.graph.data)
                    );
                });
            },
            heat: function (callback) {
                require(["test/DataFactory", "src/map/GMapHeat"], function (DataFactory, GMapHeat) {
                    callback(new GMapHeat()
                        .columns(DataFactory.GMap.heat.columns)
                        .data(DataFactory.GMap.heat.data)
                    );
                });
            },
            layered: function (callback) {
                createMap(true, callback);
            }
        },
        Layered: {
            simple: function (callback) {
                createMap(false, callback);
            }
        },
        OpenStreet: {
            simple: function (callback) {
                require(["src/map/OpenStreet"], function (OpenStreet) {
                    callback(new OpenStreet());
                });
            }
        },
        GeoHash: {
            simple: function (callback) {
                require(["src/map/GeoHash"], function (GeoHash) {
                    callback(new GeoHash()
                        .columns(["geohash", "weight"])
                        .data(geoHashData.map(function (row) { return [row.term, row.count]; }))
                    );
                });
            }
        },
        Pins: {
            simple: function (callback) {
                require(["test/DataFactory", "src/map/Pins"], function (DataFactory, Pins) {
                    callback(new Pins()
                        .columns(DataFactory.GMap.simple.columns)
                        .data(DataFactory.GMap.simple.data)
                    );
                });
            }
        },
        Graph: {
            simple: function (callback) {
                require(["test/DataFactory", "src/map/Graph"], function (DataFactory, Graph) {
                    callback(new Graph()
                        .columns(DataFactory.GMap.simple.columns)
                        .data(DataFactory.GMap.simple.data)
                    );
                });
            }
        },
        Heat: {
            simple: function (callback) {
                require(["test/DataFactory", "src/map/Heat"], function (DataFactory, Heat) {
                    callback(new Heat()
                        .columns(DataFactory.GMap.heat.columns)
                        .data(DataFactory.GMap.heat.data)
                    );
                });
            }
        },
        FromTo: {
            simple: function (callback) {
                require(["test/DataFactory", "src/map/FromToMap"], function (DataFactory, FromToMap) {
                    callback(new FromToMap()
                        .columns(["orgin_state", "orgin_airport", "orgin_iata", "orgin_lat", "orgin_long", "dest_state", "dest_iata", "dest_airport", "dest_lat", "dest_long", "AVE(distance)"])
                        .data([ ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "GA", "ATL", "William B Hartsfield-Atlanta Intl", "33.64044444", "-84.42694444", "761"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "OH", "CMH", "Port Columbus Intl", "39.99798528", "-82.89188278", "478"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "TX", "DFW", "Dallas-Fort Worth International", "32.89595056", "-97.0372", "1389"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "FL", "FLL", "Fort Lauderdale-Hollywood Int'l", "26.07258333", "-80.15275", "1076"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "SC", "GSP", "Greenville-Spartanburg", "34.89566722", "-82.21885833", "610"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "VA", "IAD", "Washington Dulles International", "38.94453194", "-77.45580972", "229"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "TN", "MEM", "Memphis International", "35.04241667", "-89.97666667", "963"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "VA", "ORF", "Norfolk International", "36.89461111", "-76.20122222", "296"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "PA", "PHL", "Philadelphia Intl", "39.87195278", "-75.24114083", "96"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "KY", "SDF", "Louisville International-Standiford", "38.17438889", "-85.736", "658"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "TN", "BNA", "Nashville International", "36.12447667", "-86.67818222", "764"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "MA", "BOS", "Gen Edw L Logan Intl", "42.3643475", "-71.00517917", "185"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "NY", "BUF", "Buffalo Niagara Intl", "42.94052472", "-78.73216667", "292"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "MD", "BWI", "Baltimore-Washington International", "39.17540167", "-76.66819833", "185"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "VA", "DCA", "Ronald Reagan Washington National", "38.85208333", "-77.03772222", "214"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "FL", "MIA", "Miami International", "25.79325", "-80.29055556", "1097"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "IL", "ORD", "Chicago O'Hare International", "41.979595", "-87.90446417", "733"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "FL", "PBI", "Palm Beach International", "26.68316194", "-80.09559417", "1035"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "NY", "ROC", "Greater Rochester Int'l", "43.11886611", "-77.67238389", "254"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "FL", "RSW", "Southwest Florida International", "26.53616667", "-81.75516667", "1080"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "MO", "STL", "Lambert-St Louis International", "38.74768694", "-90.35998972", "887"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "NC", "CLT", "Charlotte/Douglas International", "35.21401111", "-80.94312583", "544"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "KY", "CVG", "Cincinnati Northern Kentucky Intl", "39.04614278", "-84.6621725", "585"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "CO", "DEN", "Denver Intl", "39.85840806", "-104.6670019", "1619"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "TX", "HOU", "William P Hobby", "29.64541861", "-95.27888889", "1428"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "IN", "IND", "Indianapolis International", "39.71732917", "-86.29438417", "659"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "WV", "LWB", "Greenbrier Valley", "37.85830556", "-80.39947222", "403"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "LA", "MSY", "New Orleans International", "29.99338889", "-90.25802778", "1183"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "OH", "CLE", "Cleveland-Hopkins Intl", "41.41089417", "-81.84939667", "418"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "CO", "EGE", "Eagle County Regional", "39.64256778", "-106.9176953", "1739"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "FL", "JAX", "Jacksonville International", "30.49405556", "-81.68786111", "834"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "FL", "MCO", "Orlando International", "28.42888889", "-81.31602778", "950"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "PA", "PIT", "Pittsburgh International", "40.49146583", "-80.23287083", "335"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "NC", "RDU", "Raleigh-Durham International", "35.87763889", "-78.78747222", "431"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "VA", "RIC", "Richmond International", "37.50516667", "-77.31966667", "292"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "FL", "TPA", "Tampa International", "27.97547222", "-82.53325", "1011"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "MI", "DTW", "Detroit Metropolitan-Wayne County", "42.21205889", "-83.34883583", "501"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "NC", "GSO", "Piedmont Triad International", "36.09774694", "-79.9372975", "461"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "TX", "IAH", "George Bush Intercontinental", "29.98047222", "-95.33972222", "1416"],
                                ["NY", "LaGuardia", "LGA", "40.77724306", "-73.87260917", "MN", "MSP", "Minneapolis-St Paul Intl", "44.88054694", "-93.2169225", "1020"]])
                        .fromLat("orgin_lat")
                        .fromLong("orgin_long")
                        .toLat("dest_lat")
                        .toLong("dest_long")
                    );
                });
            }
        }
    };

    return mapFactory;
}));
