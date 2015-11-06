"use strict";
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["src/layout/Grid", "src/chart/Summary", "src/form/Slider", "src/chart/Column", "src/other/Comms", "gsoc/data"], factory);
    }
    //http://cmsapi.pulselive.com/rugby/rankings/mru?date=2015-10-01&client=pulse
}(this, function (Grid, Summary, Slider, Column, Comms, data) {
    //data.length=52
    /*
    var basic = new Comms.Basic()
        .url("http://cmsapi.pulselive.com/rugby/rankings/mru")
    ;
    var data = {};
    var date = new Date();
    var i = 0;
    var todo = 0;
    var format = d3.time.format("%Y-%m-%d");
    var interval = setInterval(function () {
        if (i > 52 * 4) {
            if (todo <= 0) {
                clearInterval(interval);
                var dataArr = [];
                for (var key in data) {
                    dataArr.push({
                        date : key,
                        entries: data[key]
                    });
                }
                dataArr.sort(function (l, r) { return l.date.localeCompare(r.date); });
                var tmp = JSON.stringify(dataArr);
            }
        } else {
            ++todo;
            var yyyy = date.getUTCFullYear();
            var mm = date.getUTCMonth() + 1;
            var dd = date.getUTCDate();
            var reqDate = format(date);
            basic.call({
                date: reqDate
            }, function (response) {
                data[response.effective.label] = response.entries.map(function (entry) {
                    return {
                        pts: entry.pts,
                        pos: entry.pos,
                        team: entry.team.abbreviation
                    }
                }).filter(function (row) { return row.pos <= 20; });
                --todo;
            });
            date.setDate(date.getDate() - 7);
        }
        ++i;
    }, 500);
    */

    var colors = {
        NZL: "black",
        AUS: "#CFA14B",
        RSA: "#183A43",
        ARG: "#5282CE",
        ENG: "#D5D7E4",
        WAL: "#B20229",
        FRA: "#2559BC",
        IRE: "#448D7C",
        TGA: "#AC1735",
        SAM: "#1C44A3",
        ITA: "#3581CD",
        SCO: "#232744",
        CAN: "#B40E32",
        JPN: "#282530",
        GEO: "#CE0227",
        FJI: "#DAD9EB",
        USA: "#272F53",
        ROM: "#F5B404",
        NAM: "#023E9E"
    };
    function Main(target) {
        Grid.call(this);
    }
    Main.prototype = Object.create(Grid.prototype);
    Main.prototype.constructor = Main;

    Main.prototype.enter = function (domNode, element) {
        Grid.prototype.enter.apply(this, arguments);
        this.slider = new Slider()
            .showPlay(true)
            .low(102)
            .high(data.length - 1)
            .step(1)
            .playInterval(500)
        ;
        this.setContent(0, 0, this.slider, "HPCC Viz. Framework - Anmol Jagetia", 2, 6);
        this.summary = new Summary()
            .fixedSize(false)
            .valueIcon("fa-calendar")
            .moreText("www.worldrugby.org/rankings")
            .columns(["Test"])
            .data([["Calue"]])
        ;
        this.setContent(0, 6, this.summary, null, 2, 3);
        this.column = new Column();
        var palette = this.column._palette;

        this.column._palette = function (id) {
            var retVal = colors[id];
            if (retVal)
                return retVal;
            return palette(id);
        };
        var context = this;
        this.column._palette.switch = function () { return context.column._palette; };

        this.setContent(2, 0, this.column, null, 6, 9);
        this.doUpdate(data[0]);

        this.slider.click = function (row, col, sel) {
            context.doUpdate(data[row]);
        }
    }
    Main.prototype.update = function (domNode, element) {
        Grid.prototype.update.apply(this, arguments);
    }
    Main.prototype.exit = function (domNode, element) {
        Grid.prototype.exit.apply(this, arguments);
    }
    Main.prototype.doUpdate = function (data) {
        var format = d3.time.format("%Y-%m-%d");
        var format1 = d3.time.format("%d %b");
        var format2 = d3.time.format("%Y");

        var date = format.parse(data.date);
        this.summary
            .columns([format2(date)])
            .data([[format1(date)]])
            .render()
        ;
        this.column
            .columns(["Team", "Ranking"])
            .data(data.entries.map(function (row, idx) {
                var nextPts = idx + 1 < data.entries.length ? data.entries[idx + 1].pts - 0.5 : row.pts - 2;
                return [row.team, [nextPts, row.pts]];
            }))
            .render()
        ;
    };

    return Main;
}));