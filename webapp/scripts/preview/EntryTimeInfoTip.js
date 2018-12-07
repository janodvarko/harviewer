/* See license.txt for terms of usage */

define([
    "../domplate/domplate",
    "../core/lib",
    "i18n!../nls/requestList",
    "./harModel",
],

function(Domplate, Lib, Strings, HarModel) {

var domplate = Domplate.domplate;
var DIV = Domplate.DIV;
var FOR = Domplate.FOR;
var SPAN = Domplate.SPAN;
var TABLE = Domplate.TABLE;
var TBODY = Domplate.TBODY;
var TD = Domplate.TD;
var TR = Domplate.TR;

/**
 * @domplate This object represents a popup info tip with detailed timing info for an
 * entry (request).
 */
var EntryTimeInfoTip = domplate(
{
    tableTag:
        TABLE({"class": "timeInfoTip"},
            TBODY()
        ),

    timingsTag:
        FOR("time", "$timings",
            TR({"class": "timeInfoTipRow", $collapsed: "$time|hideBar"},
                TD({"class": "$time|getBarClass timeInfoTipBar",
                    $loaded: "$time.loaded",
                    $fromCache: "$time.fromCache"
                }),
                TD({"class": "timeInfoTipCell startTime"},
                    "$time.start|formatStartTime"
                ),
                TD({"class": "timeInfoTipCell elapsedTime"},
                    "$time.elapsed|formatTime"
                ),
                TD("$time|getLabel")
            )
        ),

    startTimeTag:
        TR(
            TD(),
            TD("$startTime.time|formatStartTime"),
            TD({"class": "timeInfoTipStartLabel", "colspan": 2},
                "$startTime|getLabel"
            )
        ),

    separatorTag:
        TR({},
            TD({"class": "timeInfoTipSeparator", "colspan": 4, "height": "10px"},
                SPAN("$label")
            )
        ),

    eventsTag:
        FOR("event", "$events",
            TR({"class": "timeInfoTipEventRow"},
                TD({"class": "timeInfoTipBar", align: "center"},
                    DIV({"class": "$event|getPageTimingClass timeInfoTipEventBar"})
                ),
                TD("$event.start|formatStartTime"),
                TD({"colspan": 2},
                    "$event|getTimingLabel"
                )
            )
        ),

    hideBar: function(obj)
    {
        return !obj.elapsed && obj.bar === "request.phase.Blocking";
    },

    getBarClass: function(obj)
    {
        var className = obj.bar.substr(obj.bar.lastIndexOf(".") + 1);
        return "net" + className + "Bar";
    },

    getPageTimingClass: function(timing)
    {
        return timing.classes ? timing.classes : "";
    },

    formatTime: function(time)
    {
        return Lib.formatTime(time.toFixed(2));
    },

    formatStartTime: function(time)
    {
        var positive = time > 0;
        var label = Lib.formatTime(Math.abs(time.toFixed(2)));
        if (!time)
            return label;

        return (positive > 0 ? "+" : "-") + label;
    },

    getLabel: function(obj)
    {
        return Strings[obj.bar];
    },

    getTimingLabel: function(obj)
    {
        return obj.bar;
    },

    render: function(requestList, row, parentNode)
    {
        var input = requestList.input;
        var file = row.repObject;
        var page = HarModel.getParentPage(input, file);
        var pageStart = page ? Lib.parseISO8601(page.startedDateTime) : null;
        var requestStart = Lib.parseISO8601(file.startedDateTime);
        var infoTip = EntryTimeInfoTip.tableTag.replace({}, parentNode);

        // Insert start request time.
        var startTimeObj = {};

        //xxxHonza: the request start-time should be since the page start-time
        // but what to do if there was no parent page and the parent phase
        // is not the first one?
        //xxxHonza: the request start-time is since the page start-time
        // but the other case isw not tested yet.
        if (pageStart)
            startTimeObj.time = requestStart - pageStart;
        else
            startTimeObj.time = requestStart - row.phase.startTime;

        startTimeObj.bar = "request.Started";
        this.startTimeTag.insertRows({startTime: startTimeObj}, infoTip.firstChild);

        // Insert separator.
        this.separatorTag.insertRows({label: Strings["request.phases.label"]},
            infoTip.firstChild);

        var startTime = 0;
        var timings = [];

        // Helper shortcuts
        var blocked = file.timings.blocked;
        var dns = file.timings.dns;
        var ssl = file.timings.ssl; // new in HAR 1.2 xxxHonza: TODO
        var connect = file.timings.connect;
        var send = file.timings.send;
        var wait = file.timings.wait;
        var receive = file.timings.receive;

        if (blocked >= 0)
        {
            timings.push({bar: "request.phase.Blocking",
                elapsed: blocked,
                start: startTime});
        }

        if (dns >= 0)
        {
            timings.push({bar: "request.phase.Resolving",
                elapsed: dns,
                start: startTime += (blocked < 0) ? 0 : blocked});
        }

        if (connect >= 0)
        {
            timings.push({bar: "request.phase.Connecting",
                elapsed: connect,
                start: startTime += (dns < 0) ? 0 : dns});
        }

        if (send >= 0)
        {
            timings.push({bar: "request.phase.Sending",
                elapsed: send,
                start: startTime += (connect < 0) ? 0 : connect});
        }

        if (wait >= 0)
        {
            timings.push({bar: "request.phase.Waiting",
                elapsed: wait,
                start: startTime += (send < 0) ? 0 : send});
        }

        if (receive >= 0)
        {
            timings.push({bar: "request.phase.Receiving",
                elapsed: receive,
                start: startTime += (wait < 0) ? 0 : wait,
                loaded: file.loaded, fromCache: HarModel.isCachedEntry(file)});
        }

        // Insert request timing info.
        this.timingsTag.insertRows({timings: timings}, infoTip.firstChild);

        if (!page)
            return true;

        // Get page event timing info (if the page exists).
        var events = [];
        for (var i=0; i<row.phase.pageTimings.length; i++)
        {
            var timing = row.phase.pageTimings[i];
            events.push({
                bar: timing.description ? timing.description : timing.name,
                start: pageStart + timing.time - requestStart,
                classes: timing.classes,
                time: timing.time
            });
        }

        if (events.length)
        {
            events.sort(function(a, b) {
                return (a.time < b.time) ? -1 : 1;
            });

            // Insert separator and timing info.
            this.separatorTag.insertRows({label: Strings["request.timings.label"]},
                infoTip.firstChild);
            this.eventsTag.insertRows({events: events}, infoTip.firstChild);
        }

        return true;
    }
});

return EntryTimeInfoTip;

});
