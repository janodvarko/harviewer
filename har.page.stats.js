/* See license.txt for terms of usage */

HAR.ns(function() { with (Domplate) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

function Pie() {}
Pie.prototype =
{
    data: [],

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
    data: [
        {value: 0, label: $STR("pie.label.DNS"),     color: "rgb(119, 192, 203)"},
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
    node: null,

    tag:
        DIV({"class": "pageStatsBody", style: "height: auto; display: none"}),

    render: function(parentNode)
    {
        HAR.log("har; Page statistics, render: ");

        this.node = this.tag.replace({}, parentNode);

        // Generate HTML for pie graphs.
        this.timingPie = HAR.Page.Pie.render(timingPie, this.node);
        this.contentPie = HAR.Page.Pie.render(contentPie, this.node);
        this.trafficPie = HAR.Page.Pie.render(trafficPie, this.node);
        this.cachePie = HAR.Page.Pie.render(cachePie, this.node);

        // This graph is the last one so remove the separator right border
        this.cachePie.style.borderRight = 0;

        return this.node;
    },

    update: function(page)
    {
        if (!this.isOpened())
            return;

        this.cleanUp();

        // Get schema type for timings.
        var phases = timingsType.timingsType.properties;

        // Iterate over all requests and compute stats.
        var entries = HAR.Model.getPageEntries(page);
        for (var i=0; i<entries.length; i++)
        {
            var entry = entries[i];

            // Get timing info.
            var index = 0;
            for (var phase in phases)
                timingPie.data[index++].value += entry.timings[phase];

            var resBodySize = entry.response.bodySize > 0 ? entry.response.bodySize : 0;

            // Get Content typ info.
            var mimeType = entry.response.content.mimeType;
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
            else if (cssTypes[mimeType]) {
                contentPie.data[5].value += resBodySize;
                contentPie.data[5].count++;
            }

            // Get traffic info
            trafficPie.data[0].value += entry.request.headersSize > 0 ? entry.request.headersSize : 0;
            trafficPie.data[1].value += entry.request.bodySize > 0 ? entry.request.bodySize : 0;
            trafficPie.data[2].value += entry.response.headersSize > 0 ? entry.response.headersSize : 0;
            trafficPie.data[3].value += resBodySize;

            // Get Cache info
            if (entry.response.status == 200) { // Downloaded
                cachePie.data[0].value += resBodySize;
                cachePie.data[0].count++;
            }
            else  if (entry.response.status == 206) { // Partial content
                cachePie.data[1].value += resBodySize;
                cachePie.data[1].count++;
            }
            else if (entry.response.status == 304) { // From cache
                cachePie.data[2].value += resBodySize;
                cachePie.data[2].count++;
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

        setClass(this.node, "opened");

        if (dojo.isIE || !animation)
            this.node.style.display = "block";
        else
            dojo.fx.wipeIn({node: this.node}).play();

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
        removeClass(this.node, "opened");

        if (dojo.isIE)
            this.node.style.display = "none";
         else
            dojo.fx.wipeOut({node: this.node}).play();

        HAR.Page.ShowStats.update();
    },

    isOpened: function()
    {
        return hasClass(this.node, "opened");
    }
});

//-----------------------------------------------------------------------------

HAR.Page.ShowStats = domplate(
{
    tag:
        SPAN({"class": "harButton harShowStats", onclick: "$onToggle"},
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
