"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["d3", "../common/HTMLWidget", "../layout/AbsoluteSurface", "async!http://maps.google.com/maps/api/js?sensor=false", "css!./GMap"], factory);
    } else {
        root.map_GMap2 = factory(root.d3, root.common_HTMLWidget);
    }
}(this, function (d3, HTMLWidget, AbsoluteSurface) {
    function Overlay(gmap, map) {
        this._div = null;

        this._gmap = gmap;
        this._map = map;
        this.setMap(map);

        var context = this;
        google.maps.event.addListener(map, 'bounds_changed', function () {
            context.draw();
        });
        google.maps.event.addListener(map, 'center_changed', function () {
            context.draw();
        });
    }
    Overlay.prototype = new google.maps.OverlayView();

    Overlay.prototype.onAdd = function () {
        this.div = document.createElement('div');
        d3.select(this.div)
            .style({
                width: this._gmap.width() + "px",
                height: this._gmap.height() + "px"
            })
        ;

        this.surface = new AbsoluteSurface()
            .target(this.div)
            .units("pixels")
            .testData()
        ;

        var panes = this.getPanes();
        panes.overlayLayer.appendChild(this.div);
    };

    Overlay.prototype.draw = function () {
        var projection = this.getProjection();

        var point1 = projection.fromLatLngToDivPixel(new google.maps.LatLng(37.665074, -122.384375));
        var point2 = projection.fromLatLngToDivPixel(new google.maps.LatLng(45.777062, -108.549835));

        var x = Math.min(point1.x, point2.x);
        var y = Math.min(point1.y, point2.y);
        var width = Math.max(point1.x, point2.x) - x;
        var height = Math.max(point1.y, point2.y) - y;

        this.surface
            .widgetX(x)
            .widgetY(y)
            .widgetWidth(width)
            .widgetHeight(height)
            .resize()
            .render()
        ;
        /*
        var bounds = this._map.getBounds(),
                ne = bounds.getNorthEast(),
                sw = bounds.getSouthWest();

        this.choro.d3Projection = d3.geo.mercator()
            .rotate([-bounds.getCenter().lng(), 0])
            .translate([0, 0])
            //.center([0,0])
            .scale(1)
        ;
        this.choro.d3Path = d3.geo.path()
            .projection(this.choro.d3Projection);

        var p1 = this.choro.d3Projection([ne.lng(), ne.lat()]),
            p2 = this.choro.d3Projection([sw.lng(), sw.lat()]);

        //this.choro.x(p2[0]);
        //this.choro.y(p1[0]);
        this.choro.render();
        //this.choro._element.attr("transform", null);

        this.choro._svg.attr('transform',
            'scale(' + this._gmap.width() / (p1[0] - p2[0]) + ',' + this._gmap.height() / (p2[1] - p1[1]) + ')' +
            'translate(' + (-p2[0]) + ',' + (-p1[1]) + ') ')
        ;
        */
    };

    Overlay.prototype.onRemove = function () {
        this.surface.target(null);
        this._div.parentNode.removeChild(this._div);
        this._div = null;
    };

    function GMap2() {
        HTMLWidget.call(this);

        this._tag = "div";

        this._markers = [];
    }
    GMap2.prototype = Object.create(HTMLWidget.prototype);
    GMap2.prototype.constructor = GMap2;
    GMap2.prototype._class += " map_GMap2";

    GMap2.prototype.publish("type", "road", "set", "Map Type", ["terrain", "road", "satellite", "hybrid"], { tags: ["Basic"] });
    GMap2.prototype.publish("centerLat", 42.877742, "number", "Center Latitude", null, { tags: ["Basic"] });
    GMap2.prototype.publish("centerLong", -97.380979, "number", "Center Longtitude", null, { tags: ["Basic"] });
    GMap2.prototype.publish("zoom", 4, "number", "Zoom Level", null, { tags: ["Basic"] });

    GMap2.prototype.publish("panControl", true, "boolean", "Pan Controls", null, { tags: ["Basic"] });
    GMap2.prototype.publish("zoomControl", true, "boolean", "Pan Controls", null, { tags: ["Basic"] });
    GMap2.prototype.publish("mapTypeControl", false, "boolean", "Pan Controls", null, { tags: ["Basic"] });
    GMap2.prototype.publish("scaleControl", true, "boolean", "Pan Controls", null, { tags: ["Basic"] });
    GMap2.prototype.publish("streetViewControl", false, "boolean", "Pan Controls", null, { tags: ["Basic"] });
    GMap2.prototype.publish("overviewMapControl", false, "boolean", "Pan Controls", null, { tags: ["Basic"] });

    GMap2.prototype.testData = function () {
        this
            .columns(["latitude", "longtitude", "pin", "circle"])
            .data([
                [37.665074, -122.384375, { fillColor: "green" }, { radius: 10, fillColor: "red" }],
                [32.690680, -117.178540],
                [39.709455, -104.969859],
                [41.244123, -95.961610],
                [32.688980, -117.192040, null, { radius: 10, fillColor: "green", strokeColor: "green" }],
                [45.786490, -108.526600],
                [45.796180, -108.535652],
                [45.774320, -108.494370],
                [45.777062, -108.549835, { fillColor: "red" }]
            ])
        ;
        return this;
    };

    GMap2.prototype.data = function (_) {
        var retVal = HTMLWidget.prototype.data.apply(this, arguments);
        return retVal;
    };

    GMap2.prototype.getMapType = function () {
        switch (this.type()) {
            case "terrain":
                return google.maps.MapTypeId.TERRAIN;
            case "road":
                return google.maps.MapTypeId.ROADMAP;
            case "satellite":
                return google.maps.MapTypeId.SATELLITE;
            case "hybrid":
                return google.maps.MapTypeId.HYBRID;
            default:
                return google.maps.MapTypeId.ROADMAP;
        }
    };

    GMap2.prototype.getMapOptions = function () {
        return {
            panControl: this.panControl(),
            zoomControl: this.zoomControl(),
            mapTypeControl: this.mapTypeControl(),
            scaleControl: this.scaleControl(),
            streetViewControl: this.streetViewControl(),
            overviewMapControl: this.overviewMapControl(),
            overviewMapControlOptions: { opened: true }
        };
    };

    GMap2.prototype.size = function (_) {
        var retVal = HTMLWidget.prototype.size.apply(this, arguments);
        if (arguments.length && this._googleMapNode) {
            this._googleMapNode.style({
                width: _.width + "px",
                height: _.height + "px",
            });
            google.maps.event.trigger(this._googleMap, "resize");
        }
        return retVal;
    };

    GMap2.prototype.enter = function (domNode, element) {
        HTMLWidget.prototype.enter.apply(this, arguments);
        this._googleMapNode = element.append("div")
            .style({
                width: this.width() + "px",
                height: this.height() + "px"
            })
        ;
        this._googleMap = new google.maps.Map(this._googleMapNode.node(), {
            zoom: this.zoom(),
            center: new google.maps.LatLng(this.centerLat(), this.centerLong()),
            mapTypeId: this.getMapType(),
            disableDefaultUI: true
        });
        this._overlay = new Overlay(this, this._googleMap);

        this._circleMap = d3.map([]);
        this._pinMap = d3.map([]);

        this._prevCenterLat = this.centerLat();
        this._prevCenterLong = this.centerLong();
        this._prevZoom = this.zoom();
    };

    GMap2.prototype.update = function (domNode, element) {
        this._googleMap.setMapTypeId(this.getMapType());
        this._googleMap.setOptions(this.getMapOptions());

        if (this._prevCenterLat !== this.centerLat() || this._prevCenterLong !== this.centerLong()) {
            this._googleMap.setCenter(new google.maps.LatLng(this.centerLat(), this.centerLong()));

            this._prevCenterLat = this.centerLat();
            this._prevCenterLong = this.centerLong();
        }
        if (this._prevZoom = this.zoom()) {
            this._googleMap.setZoom(this.zoom());

            this._prevZoom = this.zoom();
        }
        this.updateCircles();
        this.updatePins();
    };

    GMap2.prototype.updateCircles = function () {
        function rowID(row) {
            return row[0] + "_" + row[1];
        }

        var circle_enter = [];
        var circle_update = [];
        var circle_exit = d3.map(this._circleMap.keys(), function (d) { return d });
        this.data().forEach(function (row) {
            circle_exit.remove(rowID(row));
            if (row[3] && !this._circleMap.has(rowID(row))) {
                circle_enter.push(row);
            } else if (row[3] && this._circleMap.has(rowID(row))) {
                circle_update.push(row);
            } else if (!row[3] && this._circleMap.has(rowID(row))) {
                circle_exit.set(rowID(row), true);
            }
        }, this);

        circle_enter.forEach(function (row) {
            var marker = this.createCircle(row[0], row[1], row[3], "");
            this._circleMap.set(rowID(row), marker);
        }, this);

        circle_update.forEach(function (row) {
            //this._pinMap.get(rowID(row)).setIcon(this.createIcon(row[3]));
        }, this);

        var context = this;
        circle_exit.forEach(function (row) {
            context._circleMap.get(row).setMap(null);
            context._circleMap.remove(row);
        });
    };

    GMap2.prototype.updatePins = function () {
        function rowID(row) {
            return row[0] + "_" + row[1];
        }

        var pin_enter = [];
        var pin_update = [];
        var pin_exit = d3.map(this._pinMap.keys(), function (d) { return d });
        this.data().forEach(function (row) {
            pin_exit.remove(rowID(row));
            if (row[2] && !this._pinMap.has(rowID(row))) {
                pin_enter.push(row);
            } else if (row[2] && this._pinMap.has(rowID(row))) {
                pin_update.push(row);
            } else if (!row[2] && this._pinMap.has(rowID(row))) {
                pin_exit.set(rowID(row), true);
            }
        }, this);

        pin_enter.forEach(function (row) {
            var marker = this.createMarker(row[0], row[1], row[2], "");
            this._pinMap.set(rowID(row), marker);
        }, this);

        pin_update.forEach(function (row) {
            this._pinMap.get(rowID(row)).setIcon(this.createIcon(row[2]));
        }, this);

        var context = this;
        pin_exit.forEach(function (row) {
            context._pinMap.get(row).setMap(null);
            context._pinMap.remove(row);
        });
    };

    GMap2.prototype.createIcon = function (pinObj) {
        return {
            path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30", // a 2,2 0 1,1 4,0 2,2 0 1,1",
            fillColor: pinObj.fillColor,
            fillOpacity: pinObj.fillOpacity || 0.8,
            scale: 0.5,
            strokeColor: pinObj.strokeColor || "black",
            strokeWeight: 0.25
        };
    };

    GMap2.prototype.createMarker = function (lat, lng, pinObj) {
        return new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            animation: google.maps.Animation.DROP,
            title: pinObj.title || "",
            icon: this.createIcon(pinObj),
            map: this._googleMap,
        });
    };

    GMap2.prototype.createCircle = function (lat, lng, circleObj) {
        return new google.maps.Circle({
            center: new google.maps.LatLng(lat, lng),
            radius: 16093 * circleObj.radius / 10,    // 16093 === 10 miles in metres
            fillColor: circleObj.fillColor || "red",
            strokeColor: circleObj.strokeColor || circleObj.fillColor || "black",
            strokeWeight:0.5,
            map: this._googleMap
        });
    };

    GMap2.prototype.createCircle2 = function (marker, radius, color) {
        var circle = new google.maps.Circle({
            radius: 16093 * radius / 10,    // 16093 === 10 miles in metres
            fillColor: color,
            strokeColor: color,
            map: this._googleMap
        });
        circle.bindTo("center", marker, "position");
        return circle;
    };

    GMap2.prototype.calcLatLong = function (dx, dy) {
        dx += this.width() / 2;
        dy += this.height() / 2;
        var projection = this._gmOverlay.getProjection();

        var context = this;
    };

    GMap2.prototype.zoomTo = function (selection) {
        var foundCount = 0;
        var latlngbounds = new google.maps.LatLngBounds();
        selection.forEach(function (item) {
            var gLatLong = new google.maps.LatLng(item.geo_lat, item.geo_long);
            latlngbounds.extend(gLatLong);
            ++foundCount;
        });
        if (foundCount) {
            this._googleMap.setCenter(latlngbounds.getCenter());
            this._googleMap.fitBounds(latlngbounds);
            if (this._googleMap.getZoom() > 12) {
                this._googleMap.setZoom(12);
            }
        }
        return this;
    };

    GMap2.prototype.zoomToFit = function () {
        return this.zoomTo([]);//this.graphData.nodeValues().map(function(row) {return row._data;}));
    };

    return GMap2;
}));
