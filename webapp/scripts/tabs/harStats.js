/* See license.txt for terms of usage */

/**
 * @module tabs/harStats
 */
define("tabs/harStats", [
    "domplate/domplate",
    "core/lib",
    "core/StatsService",
    "i18n!nls/harStats",
    "preview/harModel",
    "domplate/infoTip"
],

function(Domplate, Lib, StatsService, Strings, HarModel, InfoTip) {

var domplate = Domplate.domplate;
var DIV = Domplate.DIV;
var FOR = Domplate.FOR;
var SPAN = Domplate.SPAN;
var TABLE = Domplate.TABLE;
var TBODY = Domplate.TBODY;
var TD = Domplate.TD;
var TR = Domplate.TR;

//*************************************************************************************************

var PieInfoTip = domplate(
{
    tag:
        DIV({"class": "pieLabelInfoTip"},
            "$text"
        ),

    render: function(pie, item, parentNode)
    {
        var text = pie.getLabelTooltipText(item);
        this.tag.replace({text: text}, parentNode);
    }
});

//*************************************************************************************************

var Pie = domplate(
{
    tag:
        TABLE({"class": "pagePieTable", cellpadding: 0, cellspacing: 0,
            _repObject: "$pie"},
            TBODY(
                TR(
                    TD({"class": "pieBox", title: "$pie.title"}),
                    TD(
                        FOR("item", "$pie.data",
                            DIV({"class": "pieLabel", _repObject: "$item"},
                                SPAN({"class": "box", style: "background-color: $item.color"}, "&nbsp;"),
                                SPAN({"class": "label"}, "$item.label")
                            )
                        )
                    )
                )
            )
        ),

    render: function(pie, parentNode)
    {
        var root = this.tag.append({pie: pie}, parentNode);

        // Excanvas doesn't support creating CANVAS elements dynamically using
        // HTML injection (and so domplate can't be used). So, create the element
        // using DOM API.
        var pieBox = Lib.$(root, "pieBox");
        var el = document.createElement("canvas");

        // xxxgitgrimbo - using jQuery css class methods means we don't need
        // trailing space anymore.
        el.setAttribute("class", "pieGraph");
        el.setAttribute("height", "100");
        el.setAttribute("width", "100");
        pieBox.appendChild(el);

        return root;
    },

    draw: function(canvas, pie)
    {
        if (!canvas || !canvas.getContext)
            return;

        var ctx = canvas.getContext("2d");
        var radius = Math.min(canvas.width, canvas.height) / 2;
        var center = [canvas.width/2, canvas.height/2];
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var sofar = 0; // keep track of progress

        var data = pie.data;
        var total = 0;
        var i;

        for (i=0; i<data.length; i++)
            total += data[i].value;

        if (!total)
        {
            ctx.beginPath();
            ctx.moveTo(center[0], center[1]); // center of the pie
            ctx.arc(center[0], center[1], radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fillStyle = "rgb(229,236,238)";
            ctx.lineStyle = "lightgray";
            ctx.fill();
            return;
        }

        for (i=0; i<data.length; i++)
        {
            var thisvalue = data[i].value / total;
            if (thisvalue <= 0) {
                continue;
            }

            ctx.beginPath();
            ctx.moveTo(center[0], center[1]);
            ctx.arc(center[0], center[1], radius,
                Math.PI * (- 0.5 + 2 * sofar), // -0.5 sets set the start to be top
                Math.PI * (- 0.5 + 2 * (sofar + thisvalue)),
                false);

            // line back to the center
            ctx.lineTo(center[0], center[1]);
            ctx.closePath();
            ctx.fillStyle = data[i].color;
            ctx.fill();

            sofar += thisvalue; // increment progress tracker
        }
    },

    showInfoTip: function(infoTip, target, x, y)
    {
        var pieTable = Lib.getAncestorByClass(target, "pagePieTable");
        if (!pieTable)
            return false;

        var label = Lib.getAncestorByClass(target, "pieLabel");
        if (label)
        {
            PieInfoTip.render(pieTable.repObject, label.repObject, infoTip);
            return true;
        }
    }
});

//*************************************************************************************************
// Page Load Statistics

function PieBase() {}
PieBase.prototype =
{
    data: [],
    title: "",

    getLabelTooltipText: function(item)
    {
        return item.label + ": " + Lib.formatSize(item.value);
    },

    cleanUp: function()
    {
        for (var i=0; i<this.data.length; i++)
        {
            this.data[i].value = 0;
            this.data[i].count = 0;
        }
    }
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function TimingPie() {}

TimingPie.prototype = Lib.extend(PieBase.prototype,
{
    title: "Summary of request times.",

    data: [
        {value: 0, label: Strings.pieLabelBlocked, color: "rgb(228, 214, 193)"},
        {value: 0, label: Strings.pieLabelDNS,     color: "rgb(119, 192, 203)"},
        {value: 0, label: Strings.pieLabelSSL,     color: "rgb(168, 196, 173)"},
        {value: 0, label: Strings.pieLabelConnect, color: "rgb(179, 222, 93)"},
        {value: 0, label: Strings.pieLabelSend,    color: "rgb(224, 171, 157)"},
        {value: 0, label: Strings.pieLabelWait,    color: "rgb(163, 150, 190)"},
        {value: 0, label: Strings.pieLabelReceive, color: "rgb(194, 194, 194)"}
    ],

    getLabelTooltipText: function(item)
    {
        return item.label + ": " + Lib.formatTime(item.value.toFixed(2));
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function ContentPie() {}

ContentPie.prototype = Lib.extend(PieBase.prototype,
{
    title: "Summary of content types.",

    data: [
        {value: 0, label: Strings.pieLabelHTMLText, color: "rgb(174, 234, 218)"},
        {value: 0, label: Strings.pieLabelJavaScript, color: "rgb(245, 230, 186)"},
        {value: 0, label: Strings.pieLabelCSS, color: "rgb(212, 204, 219)"},
        {value: 0, label: Strings.pieLabelImage, color: "rgb(220, 171, 181)"},
        {value: 0, label: Strings.pieLabelFlash, color: "rgb(166, 156, 222)"},
        {value: 0, label: Strings.pieLabelOthers, color: "rgb(229, 171, 255)"}
    ],

    getLabelTooltipText: function(item)
    {
        return item.count + "x" + " " + item.label + ": " + Lib.formatSize(item.value);
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function TrafficPie() {}

TrafficPie.prototype = Lib.extend(PieBase.prototype,
{
    title: "Summary of sent and received bodies & headers.",

    data: [
        {value: 0, label: Strings.pieLabelHeadersSent, color: "rgb(247, 179, 227)"},
        {value: 0, label: Strings.pieLabelBodiesSent, color: "rgb(226, 160, 241)"},
        {value: 0, label: Strings.pieLabelHeadersReceived, color: "rgb(166, 232, 166)"},
        {value: 0, label: Strings.pieLabelBodiesReceived, color: "rgb(168, 196, 173)"}
    ]
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function CachePie() {}

CachePie.prototype = Lib.extend(PieBase.prototype,
{
    title: "Comparison of downloaded data from the server and browser cache.",

    data: [
        {value: 0, label: Strings.pieLabelDownloaded, color: "rgb(182, 182, 182)"},
        {value: 0, label: Strings.pieLabelPartial, color: "rgb(218, 218, 218)"},
        {value: 0, label: Strings.pieLabelFromCache, color: "rgb(239, 239, 239)"}
    ],

    getLabelTooltipText: function(item)
    {
        return item.count + "x" + " " + item.label + ": " + Lib.formatSize(item.value);
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var timingPie = new TimingPie();
var contentPie = new ContentPie();
var trafficPie = new TrafficPie();
var cachePie = new CachePie();

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function Stats(model, timeline)
{
    this.model = model;
    this.timeline = timeline;
    this.timeline.addListener(this);
}

/**
 * @domplate Template for statistics section (pie graphs)
 */
Stats.prototype = domplate(
/** @lends Stats */
{
    element: null,

    tag:
        DIV({"class": "pageStatsBody", style: "height: auto; display: none"}),

    update: function(pages)
    {
        if (!this.isVisible())
            return;

        this.cleanUp();

        // If there is no selection, display stats for all pages/files.
        if (!pages.length)
            pages.push(null);

        var ss = new StatsService(this.model);
        var timingsTotals = ss.calcTimingsTotalsForPages(pages);
        timingPie.data[0].value = timingsTotals.blocked;
        timingPie.data[1].value = timingsTotals.dns;
        timingPie.data[2].value = timingsTotals.ssl;
        timingPie.data[3].value = timingsTotals.connect;
        timingPie.data[4].value = timingsTotals.send;
        timingPie.data[5].value = timingsTotals.wait;
        timingPie.data[6].value = timingsTotals.receive;

        var contentTotals = ss.calcContentTotalsForPages(pages);
        contentPie.data[0].value = contentTotals.html.resBodySize;
        contentPie.data[0].count = contentTotals.html.count;
        contentPie.data[1].value = contentTotals.js.resBodySize;
        contentPie.data[1].count = contentTotals.js.count;
        contentPie.data[2].value = contentTotals.css.resBodySize;
        contentPie.data[2].count = contentTotals.css.count;
        contentPie.data[3].value = contentTotals.image.resBodySize;
        contentPie.data[3].count = contentTotals.image.count;
        contentPie.data[4].value = contentTotals.flash.resBodySize;
        contentPie.data[4].count = contentTotals.flash.count;
        contentPie.data[5].value = contentTotals.other.resBodySize;
        contentPie.data[5].count = contentTotals.other.count;

        var trafficTotals = ss.calcTrafficTotalsForPages(pages);
        trafficPie.data[0].value = trafficTotals.request.headersSize;
        trafficPie.data[1].value = trafficTotals.request.bodySize;
        trafficPie.data[2].value = trafficTotals.response.headersSize;
        trafficPie.data[3].value = trafficTotals.response.bodySize;

        var cacheTotals = ss.calcCacheTotalsForPages(pages);
        cachePie.data[1].value = cacheTotals.partial.resBodySize;
        cachePie.data[1].count = cacheTotals.partial.count;
        cachePie.data[2].value = cacheTotals.cached.resBodySize;
        cachePie.data[2].count = cacheTotals.cached.count;
        cachePie.data[0].value = cacheTotals.downloaded.resBodySize;
        cachePie.data[0].count = cacheTotals.downloaded.count;

        // Draw all graphs.
        Pie.draw(Lib.$(this.timingPie, "pieGraph"), timingPie);
        Pie.draw(Lib.$(this.contentPie, "pieGraph"), contentPie);
        Pie.draw(Lib.$(this.trafficPie, "pieGraph"), trafficPie);
        Pie.draw(Lib.$(this.cachePie, "pieGraph"), cachePie);
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
        return Pie.showInfoTip(infoTip, target, x, y);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Timeline Listener

    onSelectionChange: function(pages)
    {
        this.update(pages);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Public

    show: function(animation)
    {
        if (this.isVisible())
            return;

        InfoTip.addListener(this);
        Lib.setClass(this.element, "opened");

        if (!animation)
            this.element.style.display = "block";
        else
            $(this.element).slideDown();

        var pages = this.timeline.getSelection();
        this.update(pages);
    },

    hide: function(animation)
    {
        if (!this.isVisible())
            return;

        InfoTip.removeListener(this);
        Lib.removeClass(this.element, "opened");

        if (!animation)
            this.element.style.display = "none";
        else
            $(this.element).slideUp();
    },

    isVisible: function()
    {
        return Lib.hasClass(this.element, "opened");
    },

    toggle: function(animation)
    {
        if (this.isVisible())
            this.hide(animation);
        else
            this.show(animation);
    },

    render: function(parentNode)
    {
        this.element = this.tag.replace({}, parentNode);

        // Generate HTML for pie graphs.
        this.timingPie = Pie.render(timingPie, this.element);
        this.contentPie = Pie.render(contentPie, this.element);
        this.trafficPie = Pie.render(trafficPie, this.element);
        this.cachePie = Pie.render(cachePie, this.element);

        // This graph is the last one so remove the separator right border
        this.cachePie.style.borderRight = 0;

        return this.element;
    }
});

//*************************************************************************************************

return Stats;

//*************************************************************************************************
});
