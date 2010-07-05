/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Domplate) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

function Pie() {}
Pie.prototype =
{
    data: [],
    title: "",

    getLabelTooltipText: function(item)
    {
        return item.label + ": " + formatSize(item.value);
    },

    cleanUp: function()
    {
        for (var i=0; i<this.data.length; i++)
        {
            this.data[i].value = 0;
            this.data[i].count = 0;
        }
    }
}

function TimingPie() {};
TimingPie.prototype = HAR.extend(Pie.prototype,
{
    title: "Summary of request times.",

    data: [
        {value: 0, label: $STR("pie.label.DNS"),     color: "rgb(119, 192, 203)"},
        {value: 0, label: $STR("pie.label.SSL"),     color: "rgb(168, 196, 173)"},
        {value: 0, label: $STR("pie.label.Connect"), color: "rgb(179, 222, 93)"},
        {value: 0, label: $STR("pie.label.Blocked"), color: "rgb(228, 214, 193)"},
        {value: 0, label: $STR("pie.label.Send"),    color: "rgb(224, 171, 157)"},
        {value: 0, label: $STR("pie.label.Wait"),    color: "rgb(163, 150, 190)"},
        {value: 0, label: $STR("pie.label.Receive"), color: "rgb(194, 194, 194)"}
    ],

    getLabelTooltipText: function(item)
    {
        return item.label + ": " + formatTime(item.value);
    }
});

function ContentPie() {};
ContentPie.prototype = HAR.extend(Pie.prototype,
{
    title: "Summary of content types.",

    data: [
        {value: 0, label: $STR("pie.label.HTML/Text"), color: "rgb(174, 234, 218)"},
        {value: 0, label: $STR("pie.label.JavaScript"), color: "rgb(245, 230, 186)"},
        {value: 0, label: $STR("pie.label.CSS"), color: "rgb(212, 204, 219)"},
        {value: 0, label: $STR("pie.label.Image"), color: "rgb(220, 171, 181)"},
        {value: 0, label: $STR("pie.label.Flash"), color: "rgb(166, 156, 222)"},
        {value: 0, label: $STR("pie.label.Others"), color: "rgb(229, 171, 255)"}
    ],

    getLabelTooltipText: function(item)
    {
        return item.count + "x" + " " + item.label + ": " + formatSize(item.value);
    }
});

function TrafficPie() {};
TrafficPie.prototype = HAR.extend(Pie.prototype,
{
    title: "Summary of sent and received bodies & headers.",

    data: [
        {value: 0, label: $STR("pie.label.Headers Sent"), color: "rgb(247, 179, 227)"},
        {value: 0, label: $STR("pie.label.Bodies Sent"), color: "rgb(226, 160, 241)"},
        {value: 0, label: $STR("pie.label.Headers Received"), color: "rgb(166, 232, 166)"},
        {value: 0, label: $STR("pie.label.Bodies Received"), color: "rgb(168, 196, 173)"}
    ]
});

function CachePie() {};
CachePie.prototype = HAR.extend(Pie.prototype,
{
    title: "Comparison of downloaded data from the server and browser cache.",

    data: [
        {value: 0, label: $STR("pie.label.Downloaded"), color: "rgb(182, 182, 182)"},
        {value: 0, label: $STR("pie.label.Partial"), color: "rgb(218, 218, 218)"},
        {value: 0, label: $STR("pie.label.From Cache"), color: "rgb(239, 239, 239)"}
    ],

    getLabelTooltipText: function(item)
    {
        return item.count + "x" + " " + item.label + ": " + formatSize(item.value);
    }
});

var timingPie = new TimingPie();
var contentPie = new ContentPie();
var trafficPie = new TrafficPie();
var cachePie = new CachePie();

//-----------------------------------------------------------------------------

// Must be defined before the HAR.Page.Stats object, otherwise the minifier
// is confused.
var jsTypes = {
    "text/javascript": 1,
    "text/jscript": 1,
    "application/javascript": 1,
    "application/x-javascript": 1,
    "text/js": 1
}

var htmlTypes = {
    "text/plain": 1,
    "text/html": 1
}

var cssTypes = {
    "text/css": 1
}
var imageTypes = {
    "image/png": 1,
    "image/jpeg": 1
}

var flashTypes = {
    "application/x-shockwave-flash": 1
}

var jsonTypes = {
    "text/x-json": 1,
    "text/x-js": 1,
    "application/json": 1,
    "application/x-js": 1
}

var xmlTypes = {
    "application/xml": 1,
    "application/xhtml+xml": 1,
    "application/vnd.mozilla.xul+xml": 1,
    "text/xml": 1,
    "text/xul": 1,
    "application/rdf+xml": 1
}

var unknownTypes = {
    "text/xsl": 1,
    "text/sgml": 1,
    "text/rtf": 1,
    "text/x-setext": 1,
    "text/richtext": 1,
    "text/tab-separated-values": 1,
    "text/rdf": 1,
    "text/xif": 1,
    "text/ecmascript": 1,
    "text/vnd.curl": 1,
    "text/vbscript": 1,
    "view-source": 1,
    "view-fragment": 1,
    "application/x-httpd-php": 1,
    "application/ecmascript": 1,
    "application/http-index-format": 1
};

//-----------------------------------------------------------------------------

/**
 * Template for statistics section (pie graphs)
 */
HAR.Page.Stats = domplate(
{
    rootNode: null,

    tag:
        DIV({"class": "pageStatsBody", style: "height: auto; display: none"}),

    render: function(parentNode)
    {
        HAR.log("har; Page statistics, render: ");

        this.rootNode = this.tag.replace({}, parentNode);

        // Generate HTML for pie graphs.
        this.timingPie = HAR.Page.Pie.render(timingPie, this.rootNode);
        this.contentPie = HAR.Page.Pie.render(contentPie, this.rootNode);
        this.trafficPie = HAR.Page.Pie.render(trafficPie, this.rootNode);
        this.cachePie = HAR.Page.Pie.render(cachePie, this.rootNode);

        // This graph is the last one so remove the separator right border
        this.cachePie.style.borderRight = 0;

        return this.rootNode;
    },

    update: function(page)
    {
        if (!this.isOpened())
            return;

        this.cleanUp();

        // Get schema type for timings.
        var phases = HAR.schema.timingsType.properties;

        // Iterate over all requests and compute stats.
        var entries = HAR.Model.getPageEntries(page);
        for (var i=0; i<entries.length; i++)
        {
            var entry = entries[i];

            // Get timing info (SSL is new in HAR 1.2)
            timingPie.data[0].value += entry.timings.dns;
            timingPie.data[1].value += entry.timings.ssl ? entry.timings.ssl : -1;
            timingPie.data[2].value += entry.timings.connect;
            timingPie.data[3].value += entry.timings.blocked;
            timingPie.data[4].value += entry.timings.send;
            timingPie.data[5].value += entry.timings.wait;
            timingPie.data[6].value += entry.timings.receive;

            // The ssl time is also included in the connect field, see HAR 1.2 spec
            // (to ensure backward compatibility with HAR 1.1).
            if (entry.timings.ssl > 0)
                timingPie.data[2].value -= entry.timings.ssl;

            var response = entry.response;
            var resBodySize = response.bodySize > 0 ? response.bodySize : 0;

            // Get Content type info. Make sure we read the right content type
            // even if there is also a charset specified.
            var contentType = response.content.mimeType.match(/^([^;]+)/)[1];
            var mimeType = contentType ? contentType : response.content.mimeType;

            // Collect response sizes according to the mimeType.
            if (htmlTypes[mimeType]) {
                contentPie.data[0].value += resBodySize;
                contentPie.data[0].count++;
            }
            else if (jsTypes[mimeType]) {
                contentPie.data[1].value += resBodySize;
                contentPie.data[1].count++;
            }
            else if (cssTypes[mimeType]) {
                contentPie.data[2].value += resBodySize;
                contentPie.data[2].count++;
            }
            else if (imageTypes[mimeType]) {
                contentPie.data[3].value += resBodySize;
                contentPie.data[3].count++;
            }
            else if (flashTypes[mimeType]) {
                contentPie.data[4].value += resBodySize;
                contentPie.data[4].count++;
            }
            else {
                contentPie.data[5].value += resBodySize;
                contentPie.data[5].count++;
            }

            // Get traffic info
            trafficPie.data[0].value += entry.request.headersSize > 0 ? entry.request.headersSize : 0;
            trafficPie.data[1].value += entry.request.bodySize > 0 ? entry.request.bodySize : 0;
            trafficPie.data[2].value += entry.response.headersSize > 0 ? entry.response.headersSize : 0;
            trafficPie.data[3].value += resBodySize;

            // Get Cache info
            if (entry.response.status == 206) { // Partial content
                cachePie.data[1].value += resBodySize;
                cachePie.data[1].count++;
            }
            else if (entry.response.status == 304) { // From cache
                cachePie.data[2].value += resBodySize;
                cachePie.data[2].count++;
            }
            else if (resBodySize > 0){ // Downloaded
                cachePie.data[0].value += resBodySize;
                cachePie.data[0].count++;
            }
        }

        // Draw all graphs.
        HAR.Page.Pie.draw(getElementByClass(this.timingPie, "pieGraph"), timingPie);
        HAR.Page.Pie.draw(getElementByClass(this.contentPie, "pieGraph"), contentPie);
        HAR.Page.Pie.draw(getElementByClass(this.trafficPie, "pieGraph"), trafficPie);
        HAR.Page.Pie.draw(getElementByClass(this.cachePie, "pieGraph"), cachePie);
    },

    cleanUp: function()
    {
        timingPie.cleanUp();
        contentPie.cleanUp();
        trafficPie.cleanUp();
        cachePie.cleanUp();
    },

    showInfoTip: function(infoTip, target, x, y)
    {
        return HAR.Page.Pie.showInfoTip(infoTip, target, x, y);
    },

    show: function(animation)
    {
        if (this.isOpened())
            return;

        setClass(this.rootNode, "opened");

        if (dojo.isIE || !animation)
            this.rootNode.style.display = "block";
        else
            dojo.fx.wipeIn({node: this.rootNode}).play();

        // If there is no selection yet, use the first page if any so,
        // the pie graphs display something.
        if (!HAR.Page.Timeline.highlightedPage)
        {
            if (HAR.Model.input && HAR.Model.input.log.pages.length)
                HAR.Page.Timeline.highlightedPage = HAR.Model.input.log.pages[0];
        }

        // Update button label.
        HAR.Page.ShowStats.update();

        // Draw
        HAR.Page.Stats.update(HAR.Page.Timeline.highlightedPage);
    },

    hide: function(animation)
    {
        removeClass(this.rootNode, "opened");

        if (dojo.isIE)
            this.rootNode.style.display = "none";
         else
            dojo.fx.wipeOut({node: this.rootNode}).play();

        HAR.Page.ShowStats.update();
    },

    isOpened: function()
    {
        return hasClass(this.rootNode, "opened");
    }
});

//-----------------------------------------------------------------------------

HAR.Page.ShowStats = domplate(
{
    tag:
        SPAN({"class": "harShowStats harButton text", onclick: "$onToggle"},
            $STR("button.Show_Page_Stats")
        ),

    update: function()
    {
        var opened = HAR.Tab.Preview.stats.isOpened();

        // xxxHonza: the button should not be global.
        var button = getElementByClass(document.documentElement, "harShowStats")
        button.innerHTML = opened ? $STR("button.Hide_Page_Stats") :
            $STR("button.Show_Page_Stats");
    },

    onToggle: function(event)
    {
        var e = HAR.eventFix(event || window.event);
        cancelEvent(event);

        var button = e.target;
        if (!hasClass(button, "harButton"))
            return;

        var stats = HAR.Tab.Preview.stats;
        var opened = stats.isOpened();
        if (opened)
            stats.hide(true);
        else
            stats.show(true);

        setCookie("stats", !opened);
    }
});

//-----------------------------------------------------------------------------
}}});
