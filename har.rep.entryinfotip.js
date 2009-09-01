/* See license.txt for terms of usage */

HAR.ns(function() { with (Domplate) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

/**
 * This object represents a popup info tip with detailed info for an 
 * entry (request).
 */
HAR.Rep.EntryTimeInfoTip = domplate(
{
    tag:
        TABLE({"class": "timeInfoTip"},
            TBODY(
                TR(
                    TD({"class": "netBlockingBar timeInfoTipBar"}),
                    TD("$file.timings.blocked|formatTime : " + $STR("request.phase.Block"))
                ),
                TR(
                    TD({"class": "netResolvingBar timeInfoTipBar"}),
                    TD("$file.timings.dns|formatTime : " + $STR("request.phase.DNS"))
                ),
                TR(
                    TD({"class": "netConnectingBar timeInfoTipBar"}),
                    TD("$file.timings.connect|formatTime : " + $STR("request.phase.Connect"))
                ),
                TR(
                    TD({"class": "netSendingBar timeInfoTipBar"}),
                    TD("$file.timings.send|formatTime : " + $STR("request.phase.Send"))
                ),
                TR(
                    TD({"class": "netWaitingBar timeInfoTipBar"}),
                    TD("$file.timings.wait|formatTime : " + $STR("request.phase.Wait"))
                ),
                TR(
                    TD({"class": "netReceivingBar timeInfoTipBar"}),
                    TD("$file.timings.receive|formatTime : " + $STR("request.phase.Receive"))
                ),
                TR(
                    TD({"colspan": 2, "height": "10px"})
                ),
                TR(
                    TD({align: "center"},
                        DIV({"class": "netContentLoadBar timeInfoTipBar"})
                    ),
                    TD("$file|getOnContentLoadTime : " + $STR("page.event.ContentLoad"))
                ),
                TR(
                    TD({align: "center"},
                        DIV({"class": "netWindowLoadBar timeInfoTipBar"})
                    ),
                    TD("$file|getOnLoadTime : " + $STR("page.event.Load"))
                )
            )
        ),

    formatTime: function(time)
    {
        return HAR.Lib.formatTime(time);
    },

    formatPageEventTime: function(file, page, eventTime)
    {
        var pageStart = parseISO8601(page.startedDateTime);
        var requestStart = parseISO8601(file.startedDateTime);

        var time = (pageStart + eventTime) - requestStart;
        return (time > 0 ? "+" : "") + this.formatTime(time);
    },

    getOnLoadTime: function(file)
    {
        var page = HAR.Model.getParentPage(file);
        return this.formatPageEventTime(file, page, page.pageTimings.onLoad);
    },

    getOnContentLoadTime: function(file)
    {
        var page = HAR.Model.getParentPage(file);
        return this.formatPageEventTime(file, page, page.pageTimings.onContentLoad);
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
