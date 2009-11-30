/* See license.txt for terms of usage */

HAR.ns(function() { with (Domplate) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

/**
 * This object represents a popup info tip with detailed timing info for an 
 * entry (request).
 */
HAR.Rep.EntryTimeInfoTip = domplate(
{
    tableTag:
        TABLE({"class": "timeInfoTip", "id": "fbNetTimeInfoTip"},
            TBODY()
        ),

    timingsTag:
        FOR("time", "$timings",
            TR({"class": "timeInfoTipRow", $collapsed: "$time|hideBar"},
                TD({"class": "$time|getBarClass timeInfoTipBar",
                    $loaded: "$time.loaded",
                    $fromCache: "$time.fromCache",
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

    separatorTag:
        TR(
            TD({"colspan": 4, "height": "10px"})
        ),

    eventsTag:
        FOR("event", "$events",
            TR({"class": "timeInfoTipEventRow"},
                TD({"class": "timeInfoTipBar", align: "center"},
                    DIV({"class": "$event|getBarClass timeInfoTipEventBar"})
                ),
                TD("$event.start|formatStartTime"),
                TD({"colspan": 2},
                    "$event|getLabel"
                )
            )
        ),

    hideBar: function(obj)
    {
        return !obj.elapsed && obj.bar == "request.phase.Blocking";
    },

    getBarClass: function(obj)
    {
        var className = obj.bar.substr(obj.bar.lastIndexOf(".") + 1);
        return "net" + className + "Bar";
    },

    formatTime: function(time)
    {
        return HAR.Lib.formatTime(time);
    },

    formatStartTime: function(time)
    {
        var positive = time > 0;
        var label = HAR.Lib.formatTime(Math.abs(time));
        if (!time)
            return label;

        return (positive > 0 ? "+" : "-") + label;
    },

    getLabel: function(obj)
    {
        return $STR(obj.bar);
    },

    render: function(file, parentNode)
    {
        var page = HAR.Model.getParentPage(file);
        var pageStart = parseISO8601(page.startedDateTime);
        var requestStart = parseISO8601(file.startedDateTime);

        var infoTip = HAR.Rep.EntryTimeInfoTip.tableTag.replace({}, parentNode);

        var startTime = 0;
        var timings = [];
        timings.push({bar: "request.phase.Resolving",
            elapsed: file.timings.dns,
            start: startTime});
        timings.push({bar: "request.phase.Connecting",
            elapsed: file.timings.connect,
            start: startTime += file.timings.dns});
        timings.push({bar: "request.phase.Blocking",
            elapsed: file.timings.blocked,
            start: startTime += file.timings.connect});
        timings.push({bar: "request.phase.Sending",
            elapsed: file.timings.send,
            start: startTime += file.timings.blocked});
        timings.push({bar: "request.phase.Waiting",
            elapsed: file.timings.wait,
            start: startTime += file.timings.send});
        timings.push({bar: "request.phase.Receiving",
            elapsed: file.timings.receive,
            start: startTime += file.timings.wait,
            loaded: file.loaded, fromCache: file.fromCache});

        // Insert request timing info.
        this.timingsTag.insertRows({timings: timings}, infoTip.firstChild);

        var events = [];
        if (page.pageTimings.onContentLoad)
            events.push({bar: "ContentLoad",
                start: pageStart + page.pageTimings.onContentLoad - requestStart});
        if (page.pageTimings.onLoad)
            events.push({bar: "WindowLoad",
                start: pageStart + page.pageTimings.onLoad - requestStart});

        if (!events.length)
            return;

        // Insert separator.
        this.separatorTag.insertRows({}, infoTip.firstChild);

        // Insert events timing info.
        this.eventsTag.insertRows({events: events}, infoTip.firstChild);

        return true;
    }
});

//-----------------------------------------------------------------------------

HAR.Rep.EntrySizeInfoTip = domplate(
{
    tag:
        DIV({"class": "sizeInfoTip"}, "$file|getSize"),

    getSize: function(file)
    {
        var bodySize = file.response.bodySize;
        return $STRF("tooltip.size", [formatSize(bodySize),
            ((file.size < 0) ? "?" : formatNumber(bodySize))]);
    }
});

//-----------------------------------------------------------------------------
}}});
