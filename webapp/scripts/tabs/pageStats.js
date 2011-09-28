/* See license.txt for terms of usage */

require.def("tabs/pageStats", [
    "domplate/domplate",
    "core/lib",
    "i18n!nls/pageStats",
    "preview/harSchema",
    "preview/harModel",
    "core/cookies",
    "domplate/infoTip",
    "core/trace"
],

function(Domplate, Lib, Strings, HarSchema, HarModel, Cookies, InfoTip, Trace) { with (Domplate) {

//*************************************************************************************************
// Page Load Statistics

function Pie() {}
Pie.prototype =
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
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function TimingPie() {};
TimingPie.prototype = Lib.extend(Pie.prototype,
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
        return item.label + ": " + Lib.formatTime(item.value);
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function ContentPie() {};
ContentPie.prototype = Lib.extend(Pie.prototype,
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

function TrafficPie() {};
TrafficPie.prototype = Lib.extend(Pie.prototype,
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

function CachePie() {};
CachePie.prototype = Lib.extend(Pie.prototype,
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
    "image/jpeg": 1,
    "image/gif": 1
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

        // Get schema type for timings.
        var phases = HarSchema.timingsType.properties;

        // If there is no selection, display stats for all pages/files.
        if (!pages.length)
            pages.push(null);

        // Iterate over all selected pages
        for (var j=0; j<pages.length; j++)
        {
            var page = pages[j];

            // Iterate over all requests and compute stats.
            var entries = page? this.model.getPageEntries(page) : this.model.getAllEntries();
            for (var i=0; i<entries.length; i++)
            {
                var entry = entries[i];
                if (!entry.timings)
                    continue;

                // Get timing info (SSL is new in HAR 1.2)
                timingPie.data[0].value += entry.timings.blocked;
                timingPie.data[1].value += entry.timings.dns;
                timingPie.data[2].value += entry.timings.ssl > 0 ? entry.timings.ssl : 0;
                timingPie.data[3].value += entry.timings.connect;
                timingPie.data[4].value += entry.timings.send;
                timingPie.data[5].value += entry.timings.wait;
                timingPie.data[6].value += entry.timings.receive;

                // The ssl time is also included in the connect field, see HAR 1.2 spec
                // (to ensure backward compatibility with HAR 1.1).
                if (entry.timings.ssl > 0)
                    timingPie.data[3].value -= entry.timings.ssl;

                var response = entry.response;
                var resBodySize = response.bodySize > 0 ? response.bodySize : 0;

                // Get Content type info. Make sure we read the right content type
                // even if there is also a charset specified.
                var mimeType = response.content.mimeType;
                var contentType = mimeType ? mimeType.match(/^([^;]+)/)[1] : null;
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
        }

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

        if (!animation || $.browser.msie)
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

        if (!animation || $.browser.msie)
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

        //xxxHonza: the class name requires a space at the end in order to hasClass
        // to work. This is terrible hack. Please fix me!
        el.setAttribute("class", "pieGraph ");
        el.setAttribute("height", "100");
        el.setAttribute("width", "100");
        pieBox.appendChild(el);

        if (typeof(G_vmlCanvasManager) != "undefined")
            G_vmlCanvasManager.initElement(el);

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
        for (var i in data)
            total += data[i].value;

        if (!total)
        {
            ctx.beginPath();
            ctx.moveTo(center[0], center[1]); // center of the pie
            ctx.arc(center[0], center[1], radius, 0, Math.PI * 2, false)
            ctx.closePath();
            ctx.fillStyle = "rgb(229,236,238)";
            ctx.lineStyle = "lightgray";
            ctx.fill();
            return;
        }

        for (var i=0; i<data.length; i++)
        {
            var thisvalue = data[i].value / total;

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

var PieInfoTip = domplate(
{
    tag:
        DIV({"class": "pieLabelInfoTip"},
            "$text"
        ),

    getText: function(item)
    {
        return item.label + ": " + formatTime(item.value);
    },

    render: function(pie, item, parentNode)
    {
        var text = pie.getLabelTooltipText(item);
        this.tag.replace({text: text}, parentNode);
    }
});

//*************************************************************************************************

return Stats;

//*************************************************************************************************
}});
