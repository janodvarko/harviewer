/* See license.txt for terms of usage */

/**
 * @module tabs/harStats
 */
define([
    "../domplate/domplate",
    "../core/lib",
    "../core/StatsService",
    "i18n!../nls/harStats",
    "../preview/harModel",
    "../domplate/infoTip",
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

    render: function(text, parentNode)
    {
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
                    TD({"class": "pieBox"}),
                    TD(
                        FOR("item", "$pie.data",
                            DIV({"class": "pieLabel", _repObject: "$item"},
                                SPAN({
                                    "class": "box", style: "background-color: $item.color"
                                }, "&nbsp;"),
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
        if (!pieTable) {
            return false;
        }

        var label = Lib.getAncestorByClass(target, "pieLabel");
        if (label) {
            var text = pieTable.repObject.getLabelTooltipText(label.repObject);
            PieInfoTip.render(text, infoTip);
            return true;
        }

        if (target.tagName === "CANVAS") {
            PieInfoTip.render(pieTable.repObject.title, infoTip);
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

// eslint-disable-next-line max-len
function loadColors(primaryClassName, secondaryClassName1, secondaryClassName2, secondaryClassNameN) {
    var secondaryClassNames = [].slice.call(arguments, 1);
    return secondaryClassNames.reduce(function(map, name) {
        var div = $("<div>").css("display", "none").addClass(primaryClassName).addClass(name);
        div.appendTo(document.body);

        map[name] = div.css("color");

        div.remove();

        return map;
    }, {});
}

var PieColors = {
    TimingPie: loadColors(
        "TimingPie", "Blocked", "DNS", "SSL", "Connect", "Send", "Wait", "Receive"
    ),
    ContentPie: loadColors(
        "ContentPie", "HTMLText", "JavaScript", "CSS", "Image", "Flash", "Others"
    ),
    TrafficPie: loadColors(
        "TrafficPie", "HeadersSent", "BodiesSent", "HeadersReceived", "BodiesReceived"
    ),
    CachePie: loadColors(
        "CachePie", "Downloaded", "Partial", "FromCache"
    )
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function TimingPie() {}

TimingPie.prototype = Lib.extend(PieBase.prototype,
{
    title: "Summary of request times.",

    data: [
        {value: 0, label: Strings.pieLabelBlocked, color: PieColors.TimingPie.Blocked},
        {value: 0, label: Strings.pieLabelDNS,     color: PieColors.TimingPie.DNS},
        {value: 0, label: Strings.pieLabelSSL,     color: PieColors.TimingPie.SSL},
        {value: 0, label: Strings.pieLabelConnect, color: PieColors.TimingPie.Connect},
        {value: 0, label: Strings.pieLabelSend,    color: PieColors.TimingPie.Send},
        {value: 0, label: Strings.pieLabelWait,    color: PieColors.TimingPie.Wait},
        {value: 0, label: Strings.pieLabelReceive, color: PieColors.TimingPie.Receive},
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
        {value: 0, label: Strings.pieLabelHTMLText, color: PieColors.ContentPie.HTMLText},
        {value: 0, label: Strings.pieLabelJavaScript, color: PieColors.ContentPie.JavaScript},
        {value: 0, label: Strings.pieLabelCSS, color: PieColors.ContentPie.CSS},
        {value: 0, label: Strings.pieLabelImage, color: PieColors.ContentPie.Image},
        {value: 0, label: Strings.pieLabelFlash, color: PieColors.ContentPie.Flash},
        {value: 0, label: Strings.pieLabelOthers, color: PieColors.ContentPie.Others}
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
        {value: 0, label: Strings.pieLabelHeadersSent,
            color: PieColors.TrafficPie.HeadersSent},
        {value: 0, label: Strings.pieLabelBodiesSent,
            color: PieColors.TrafficPie.BodiesSent},
        {value: 0, label: Strings.pieLabelHeadersReceived,
            color: PieColors.TrafficPie.HeadersReceived},
        {value: 0, label: Strings.pieLabelBodiesReceived,
            color: PieColors.TrafficPie.BodiesReceived}
    ]
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function CachePie() {}

CachePie.prototype = Lib.extend(PieBase.prototype,
{
    title: "Comparison of downloaded data from the server and browser cache.",

    data: [
        {value: 0, label: Strings.pieLabelDownloaded, color: PieColors.CachePie.Downloaded},
        {value: 0, label: Strings.pieLabelPartial, color: PieColors.CachePie.Partial},
        {value: 0, label: Strings.pieLabelFromCache, color: PieColors.CachePie.FromCache}
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
