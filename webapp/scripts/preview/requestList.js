/* See license.txt for terms of usage */

define("preview/requestList", [
    "domplate/domplate",
    "core/lib",
    "i18n!nls/requestList",
    "preview/harModel",
    "core/cookies",
    "preview/requestBody",
    "domplate/infoTip",
    "domplate/popupMenu"
],

function(Domplate, Lib, Strings, HarModel, Cookies, RequestBody, InfoTip, Menu) {

var domplate = Domplate.domplate;
var DIV = Domplate.DIV;
var FOR = Domplate.FOR;
var SPAN = Domplate.SPAN;
var TABLE = Domplate.TABLE;
var TBODY = Domplate.TBODY;
var TD = Domplate.TD;
var TR = Domplate.TR;

// ********************************************************************************************* //

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

// ********************************************************************************************* //
// Entry Size Info Tip

var EntrySizeInfoTip = domplate(
{
    tag:
        DIV(
            DIV({"class": "sizeInfoTip"}, "$file|getSize"),
            DIV({"class": "sizeInfoTip", style: "display: $file|getCachedDisplayStyle"}, "$file|getCached")
        ),

    zippedTag:
        DIV(
            DIV({"class": "sizeInfoTip"}, "$file|getBodySize"),
            DIV({"class": "sizeInfoTip"}, "$file|getContentSize"),
            DIV({"class": "sizeInfoTip", style: "display: $file|getCachedDisplayStyle"}, "$file|getCached")
        ),

    getSize: function(file)
    {
        var bodySize = file.response.bodySize;
        if (bodySize < 0)
            return Strings.unknownSize;

        return Lib.formatString(Strings.tooltipSize,
            Lib.formatSize(bodySize),
            Lib.formatNumber(bodySize));
    },

    getBodySize: function(file)
    {
        var bodySize = file.response.bodySize;
        if (bodySize < 0)
            return Strings.unknownSize;

        return Lib.formatString(Strings.tooltipZippedSize,
            Lib.formatSize(bodySize),
            Lib.formatNumber(bodySize));
    },

    getContentSize: function(file)
    {
        var contentSize = file.response.content.size;
        if (contentSize < 0)
            return Strings.unknownSize;

        return Lib.formatString(Strings.tooltipUnzippedSize,
            Lib.formatSize(contentSize),
            Lib.formatNumber(contentSize));
    },

    getCached: function(file)
    {
        return HarModel.isCachedEntry(file) ? Strings.resourceFromCache : "";
    },

    getCachedDisplayStyle: function(file)
    {
        return HarModel.isCachedEntry(file) ? "block" : "none";
    },

    render: function(requestList, row, parentNode)
    {
        var file = row.repObject;
        if (file.response.bodySize === file.response.content.size)
            return this.tag.replace({file: file}, parentNode);

        return this.zippedTag.replace({file: file}, parentNode);
    }
});

// ********************************************************************************************* //
// Request List

function RequestList(input)
{
    this.input = input;
    this.pageTimings = [];

    // List of pageTimings fields (see HAR 1.2 spec) that should be displayed
    // in the waterfall graph as vertical lines. The HAR spec defines two timings:
    // onContentLoad: DOMContentLoad event fired
    // onLoad: load event fired
    // New custom page timing fields can be appended using RequestList.addPageTiming method.
    this.addPageTiming({
        name: "onContentLoad",
        classes: "netContentLoadBar",
        description: Strings.ContentLoad
    });

    this.addPageTiming({
        name: "onLoad",
        classes: "netWindowLoadBar",
        description: Strings.WindowLoad
    });

    InfoTip.addListener(this);
}

// ********************************************************************************************* //
// Columns

/**
 * List of all available columns for the request table, see also RequestList.prototype.tableTag
 */
RequestList.columns = [
    "index",
    "url",
    "status",
    "type",
    "domain",
    "serverIPAddress",
    "connection",
    "size",
    "timeline"
];

/**
 * List of columns that are visible by default.
 */
RequestList.defaultColumns = [
    "url",
    "status",
    "size",
    "timeline"
];

/**
 * Use this method to get a list of currently visible columns.
 */
RequestList.getVisibleColumns = function()
{
    var cols = Cookies.getCookie("previewCols");
    if (cols)
    {
        // Columns names are separated by a space so, make sure to properly process
        // spaces in the cookie value.
        cols = cols.replace(/\+/g, " ");
        cols = unescape(cols);
        return cols.split(" ");
    }

    if (!cols)
    {
        var content = document.getElementById("content");
        if (content)
        {
            cols = content.getAttribute("previewCols");
            if (cols)
                return cols.split(" ");
        }
    }

    return Lib.cloneArray(RequestList.defaultColumns);
};

RequestList.setVisibleColumns = function(cols, avoidCookies)
{
    if (!cols)
        cols = RequestList.getVisibleColumns();

    // If the parameter is an array, convert it to string.
    if (cols.join)
        cols = cols.join(" ");

    var content = document.getElementById("content");
    if (content)
        content.setAttribute("previewCols", cols);

    // Update cookie
    if (!avoidCookies)
        Cookies.setCookie("previewCols", cols);
};

// Initialize UI. List of columns is specified on the content element (used by CSS).
RequestList.setVisibleColumns();

// ********************************************************************************************* //

/**
 * @domplate This object represents a template for list of entries (requests).
 * This list is displayed when a page is expanded by the user.
 */
RequestList.prototype = domplate(
/** @lends RequestList */
{
    tableTag:
        TABLE({"class": "netTable", cellpadding: 0, cellspacing: 0, onclick: "$onClick",
            _repObject: "$requestList"},
            TBODY(
                TR({"class" : "netSizerRow"},
                    TD({"class": "netIndexCol netCol"}),
                    TD({"class": "netHrefCol netCol", width: "20%"}),
                    TD({"class": "netStatusCol netCol", width: "7%"}),
                    TD({"class": "netTypeCol netCol", width: "7%"}),
                    TD({"class": "netDomainCol netCol", width: "7%"}),
                    TD({"class": "netServerIPAddressCol netCol", width: "7%"}),
                    TD({"class": "netConnectionCol netCol", width: "7%"}),
                    TD({"class": "netSizeCol netCol", width: "7%"}),
                    TD({"class": "netTimeCol netCol", width: "100%"}),
                    TD({"class": "netOptionsCol netCol", width: "15px"}) // Options
                )
            )
        ),

    fileTag:
        FOR("file", "$files",
            TR({"class": "netRow loaded",
                $isExpandable: "$file|isExpandable",
                $responseError: "$file|isError",
                $responseRedirect: "$file|isRedirect",
                $fromCache: "$file|isFromCache"},
                TD({"class": "netIndexCol netCol"},
                    DIV({"class": "netIndexLabel netLabel"}, "$file|getIndex")
                ),
                TD({"class": "netHrefCol netCol"},
                    DIV({"class": "netHrefLabel netLabel",
                         style: "margin-left: $file|getIndent\\px"},
                        "$file|getHref"
                    ),
                    DIV({"class": "netFullHrefLabel netHrefLabel netLabel",
                         style: "margin-left: $file|getIndent\\px"},
                        "$file|getFullHref"
                    )
                ),
                TD({"class": "netStatusCol netCol"},
                    DIV({"class": "netStatusLabel netLabel", title: "$file|getStatus"},
                        "$file|getStatus")
                ),
                TD({"class": "netTypeCol netCol"},
                    DIV({"class": "netTypeLabel netLabel", title: "$file|getType"},
                        "$file|getType")
                ),
                TD({"class": "netDomainCol netCol", title: "$file|getDomain"},
                    DIV({"class": "netDomainLabel netLabel"},
                        "$file|getDomain")
                ),
                TD({"class": "netServerIPAddressCol netCol"},
                    DIV({"class": "netServerIPAddressLabel netLabel", title: "$file|getServerIPAddress"},
                        "$file|getServerIPAddress")
                ),
                TD({"class": "netConnectionCol netCol"},
                    DIV({"class": "netConnectionLabel netLabel", title: "$file|getConnection"},
                        "$file|getConnection")
                ),
                TD({"class": "netSizeCol netCol"},
                    DIV({"class": "netSizeLabel netLabel"}, "$file|getSize")
                ),
                TD({"class": "netTimeCol netCol"},
                    DIV({"class": "netTimelineBar"},
                        "&nbsp;",
                        DIV({"class": "netBlockingBar netBar"}),
                        DIV({"class": "netResolvingBar netBar"}),
                        DIV({"class": "netConnectingBar netBar"}),
                        DIV({"class": "netSendingBar netBar"}),
                        DIV({"class": "netWaitingBar netBar"}),
                        DIV({"class": "netReceivingBar netBar"},
                            SPAN({"class": "netTimeLabel"}, "$file|getElapsedTime")
                        )
                        // Page timings (vertical lines) are dynamically appended here.
                    )
                ),
                TD({"class": "netOptionsCol netCol"},
                    DIV({"class": "netOptionsLabel netLabel", onclick: "$onOpenOptions"})
                )
            )
        ),

    headTag:
        TR({"class": "netHeadRow"},
            TD({"class": "netHeadCol", colspan: 9},
                DIV({"class": "netHeadLabel"}, "$doc.rootFile.href")
            )
        ),

    netInfoTag:
        TR({"class": "netInfoRow"},
            TD({"class": "netInfoCol", colspan: 9})
        ),

    summaryTag:
        TR({"class": "netRow netSummaryRow"},
            TD({"class": "netIndexCol netCol"}),
            TD({"class": "netHrefCol netCol"},
                DIV({"class": "netCountLabel netSummaryLabel"}, "-")
            ),
            TD({"class": "netStatusCol netCol"}),
            TD({"class": "netTypeCol netCol"}),
            TD({"class": "netDomainCol netCol"}),
            TD({"class": "netServerIPAddressCol netCol"}),
            TD({"class": "netConnectionCol netCol"}),
            TD({"class": "netTotalSizeCol netSizeCol netCol"},
                DIV({"class": "netTotalSizeLabel netSummaryLabel"}, "0KB")
            ),
            TD({"class": "netTotalTimeCol netTimeCol netCol"},
                DIV({"class": "", style: "width: 100%"},
                    DIV({"class": "netCacheSizeLabel netSummaryLabel"},
                        "(",
                        SPAN("0KB"),
                        SPAN(" " + Strings.summaryFromCache),
                        ")"
                    ),
                    DIV({"class": "netUncompressedSizeLabel netSummaryLabel"},
                        "(",
                        SPAN("0KB"),
                        SPAN(" " + Strings.uncompressed),
                        ")"
                    ),
                    DIV({"class": "netTimeBar"},
                        SPAN({"class": "netTotalTimeLabel netSummaryLabel"}, "0ms")
                    )
                )
            ),
            TD({"class": "netOptionsCol netCol"})
        ),

    getIndex: function(file)
    {
        return (file.index + 1);
    },

    getIndent: function(file)
    {
        return 0;
    },

    isError: function(file)
    {
        var errorRange = Math.floor(file.response.status / 100);
        return errorRange === 4 || errorRange === 5 || errorRange === 0;
    },

    isRedirect: function(file)
    {
        // xxxHonza: 304?
        //var errorRange = Math.floor(file.response.status/100);
        //return errorRange == 3;
        return false;
    },

    isFromCache: function(file)
    {
        return (file.cache && file.cache.afterRequest) || HarModel.isCachedEntry(file);
    },

    getHref: function(file)
    {
        var fileName = Lib.getFileName(this.getFullHref(file));
        return unescape(file.request.method + " " + fileName);
    },

    getFullHref: function(file)
    {
        return unescape(file.request.url);
    },

    getStatus: function(file)
    {
        // WebInspector can include an _error property when response.status===0.
        // Use this _error value if provided, as it's more informative than showing '0'.
        if (file.response.status === 0 && file.response._error) {
            return file.response._error;
        }

        var status = file.response.status > 0 ? (file.response.status + " ") : "";
        return status + file.response.statusText;
    },

    getType: function(file)
    {
        return file.response.content.mimeType;
    },

    getDomain: function(file)
    {
        return Lib.getPrettyDomain(file.request.url);
    },

    getServerIPAddress: function(file)
    {
        return file.serverIPAddress || "";
    },

    getConnection: function(file)
    {
        return file.connection || "";
    },

    getSize: function(file)
    {
        var bodySize = file.response.bodySize;
        var size = (bodySize && bodySize !== -1) ? bodySize :
            file.response.content.size;

        return this.formatSize(size);
    },

    isExpandable: function(file)
    {
        var hasHeaders = file.response.headers.length > 0;
        var hasDataURL = file.request.url.indexOf("data:") === 0;
        return hasHeaders || hasDataURL;
    },

    formatSize: function(bytes)
    {
        return Lib.formatSize(bytes);
    },

    getElapsedTime: function(file)
    {
        // Total request time doesn't include the time spent in queue.
        //var elapsed = file.time - file.timings.blocked;
        var time = Math.round(file.time * 10) / 10;
        return Lib.formatTime(time.toFixed(2));
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    onClick: function(event)
    {
        var e = Lib.fixEvent(event);
        if (Lib.isLeftClick(event))
        {
            var row = Lib.getAncestorByClass(e.target, "netRow");
            if (row)
            {
                this.toggleHeadersRow(row);
                Lib.cancelEvent(event);
            }
        }
        else if (Lib.isControlClick(event))
        {
            window.open(event.target.innerText || event.target.textContent);
        }
    },

    toggleHeadersRow: function(row)
    {
        if (!Lib.hasClass(row, "isExpandable"))
            return;

        var file = row.repObject;
        var netInfoRow;

        Lib.toggleClass(row, "opened");
        if (Lib.hasClass(row, "opened"))
        {
            netInfoRow = this.netInfoTag.insertRows({}, row)[0];
            netInfoRow.repObject = file;

            var requestBody = new RequestBody();
            requestBody.render(netInfoRow.firstChild, file);
        }
        else
        {
            netInfoRow = row.nextSibling;
            row.parentNode.removeChild(netInfoRow);
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Options

    onOpenOptions: function(event)
    {
        var e = Lib.fixEvent(event);
        Lib.cancelEvent(event);

        if (!Lib.isLeftClick(event))
            return;

        var target = e.target;

        // Collect all menu items.
        var row = Lib.getAncestorByClass(target, "netRow");
        var items = this.getMenuItems(row);
        if (!items.length)
            return;

        // Finally, display the the popup menu.
        // xxxHonza: the old <DIV> can be still visible.
        var menu = new Menu({id: "requestContextMenu", items: items});
        menu.showPopup(target);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Menu Definition

    getMenuItems: function(row)
    {
        var file = row.repObject;
        var phase = row.phase;

        // Disable the 'break layout' command for the first file in the first phase.
        var disableBreakLayout = (phase.files[0] === file && this.phases[0] === phase);

        var items = [
            {
                label: Strings.menuBreakTimeline,
                type: "checkbox",
                disabled: disableBreakLayout,
                checked: phase.files[0] === file && !disableBreakLayout,
                command: Lib.bind(this.breakLayout, this, row)
            },
            "-",
            {
                label: Strings.menuOpenRequest,
                command: Lib.bind(this.openRequest, this, file)
            },
            {
                label: Strings.menuOpenResponse,
                disabled: !file.response.content.text,
                command: Lib.bind(this.openResponse, this, file)
            }
        ];

        // Distribute to all listeners to allow registering custom commands.
        // Listeneres are set by the parent page-list.
        Lib.dispatch(this.listeners, "getMenuItems", [items, this.input, file]);

        return items;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Command Handlers

    openRequest: function(event, file)
    {
        window.open(file.request.url);
    },

    openResponse: function(event, file)
    {
        var response = file.response.content.text;
        var mimeType = file.response.content.mimeType;
        var encoding = file.response.content.encoding;
        var url = "data:" + (mimeType ? mimeType: "") + ";" +
            (encoding ? encoding : "") + "," + response;

        window.open(url);
    },

    breakLayout: function(event, row)
    {
        var file = row.repObject;
        var phase = row.phase;
        var layoutBroken = phase.files[0] === file;
        row.breakLayout = !layoutBroken;

        // For CSS (visual separator between two phases).
        row.setAttribute("breakLayout", row.breakLayout ? "true" : "false");

        var netTable = Lib.getAncestorByClass(row, "netTable");
        var page = HarModel.getParentPage(this.input, file);
        this.updateLayout(netTable, page);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Layout

    updateLayout: function(table, page)
    {
        var requests = HarModel.getPageEntries(this.input, page);

        this.table = table;
        var tbody = this.table.firstChild;
        var row = this.firstRow = tbody.firstChild.nextSibling;

        this.phases = [];

        // The phase interval is customizable through a cookie.
        var phaseInterval = Cookies.getCookie("phaseInterval");
        if (!phaseInterval)
            phaseInterval = 4000;

        var phase = null;

        var pageStartedDateTime = page ? Lib.parseISO8601(page.startedDateTime) : null;

        // The onLoad time stamp is used for proper initialization of the first phase. The first
        // phase contains all requests till onLoad is fired (even if there are time gaps).
        // Don't worry if it
        var onLoadTime = (page && page.pageTimings) ? page.pageTimings.onLoad : -1;

        // The timing could be NaN or -1. In such case keep the value otherwise
        // make the time absolute.
        if (onLoadTime > 0)
            onLoadTime += pageStartedDateTime;

        // Iterate over all requests and create phases.
        for (var i=0; i<requests.length; i++)
        {
            var file = requests[i];

            if (Lib.hasClass(row, "netInfoRow"))
                row = row.nextSibling;

            row.repObject = file;

            // If the parent page doesn't exists get startedDateTime of the
            // first request.
            if (!pageStartedDateTime)
                pageStartedDateTime = Lib.parseISO8601(file.startedDateTime);

            var startedDateTime = Lib.parseISO8601(file.startedDateTime);
            var phaseLastStartTime = phase ? Lib.parseISO8601(phase.getLastStartTime()) : 0;
            var phaseEndTime = phase ? phase.endTime : 0;

            // New phase is started if:
            // 1) There is no phase yet.
            // 2) There is a gap between this request and the last one.
            // 3) The new request is not started during the page load.
            var newPhase = false;
            if (phaseInterval >= 0)
            {
                newPhase = (startedDateTime > onLoadTime) &&
                    ((startedDateTime - phaseLastStartTime) >= phaseInterval) &&
                    (startedDateTime + file.time >= phaseEndTime + phaseInterval);
            }

            // 4) The file can be also marked with breakLayout
            if (typeof(row.breakLayout) === "boolean")
            {
                if (!phase || row.breakLayout)
                    phase = this.startPhase(file);
                else
                    phase.addFile(file);
            }
            else
            {
                if (!phase || newPhase)
                    phase = this.startPhase(file);
                else
                    phase.addFile(file);
            }

            // For CSS (visual separator between two phases). Except of the first file
            // in the first phase.
            if (this.phases[0] !== phase)
                row.setAttribute("breakLayout", (phase.files[0] === file) ? "true" : "false");

            if ("number" !== typeof phase.startTime || phase.startTime > startedDateTime)
                phase.startTime = startedDateTime;

            // file.time represents total elapsed time of the request.
            if ("number" !== typeof phase.endTime || phase.endTime < startedDateTime + file.time)
                phase.endTime = startedDateTime + file.time;

            row = row.nextSibling;
        }

        this.updateTimeStamps(page);
        this.updateTimeline(page);
        this.updateSummaries(page);
    },

    startPhase: function(file)
    {
        var phase = new Phase(file);
        this.phases.push(phase);
        return phase;
    },

    calculateFileTimes: function(page, file, phase)
    {
        if (phase !== file.phase)
        {
            phase = file.phase;
            this.phaseStartTime = phase.startTime;
            this.phaseEndTime = phase.endTime;
            this.phaseElapsed = this.phaseEndTime - phase.startTime;
        }

        if (!file.timings)
            return phase;

        // Individual phases of a request:
        //
        // 1) Blocking          HTTP-ON-MODIFY-REQUEST -> (STATUS_RESOLVING || STATUS_CONNECTING_TO)
        // 2) DNS               STATUS_RESOLVING -> STATUS_CONNECTING_TO
        // 3) Connecting        STATUS_CONNECTING_TO -> (STATUS_CONNECTED_TO || STATUS_SENDING_TO)
        // 4) Sending           STATUS_SENDING_TO -> STATUS_WAITING_FOR
        // 5) Waiting           STATUS_WAITING_FOR -> STATUS_RECEIVING_FROM
        // 6) Receiving         STATUS_RECEIVING_FROM -> ACTIVITY_SUBTYPE_RESPONSE_COMPLETE
        //
        // Note that HTTP-ON-EXAMINE-RESPONSE should not be used since the time isn't passed
        // along with this event and so, it could break the timing. Only the HTTP-ON-MODIFY-REQUEST
        // is used to get begining of the request and compute the blocking time. Hopefully this
        // will work or there is better mechanism.
        //
        // If the response comes directly from the browser cache, there is only one state.
        // HTTP-ON-MODIFY-REQUEST -> HTTP-ON-EXAMINE-CACHED-RESPONSE

        // Compute end of each phase since the request start.
        var blocking = ((file.timings.blocked < 0) ? 0 : file.timings.blocked);
        var resolving = blocking + ((file.timings.dns < 0) ? 0 : file.timings.dns);
        var connecting = resolving + ((file.timings.connect < 0) ? 0 : file.timings.connect);
        var sending = connecting + ((file.timings.send < 0) ? 0 : file.timings.send);
        var waiting = sending + ((file.timings.wait < 0) ? 0 : file.timings.wait);
        var receiving = waiting + ((file.timings.receive < 0) ? 0 : file.timings.receive);

        var startedDateTime = Lib.parseISO8601(file.startedDateTime);
        this.barOffset = (((startedDateTime-this.phaseStartTime)/this.phaseElapsed) * 100).toFixed(3);

        // Compute size of each bar. Left side of each bar starts at the
        // beginning. The first bar is on top of all and the last one is
        // at the bottom (z-index).
        this.barBlockingWidth = ((blocking/this.phaseElapsed) * 100).toFixed(3);
        this.barResolvingWidth = ((resolving/this.phaseElapsed) * 100).toFixed(3);
        this.barConnectingWidth = ((connecting/this.phaseElapsed) * 100).toFixed(3);
        this.barSendingWidth = ((sending/this.phaseElapsed) * 100).toFixed(3);
        this.barWaitingWidth = ((waiting/this.phaseElapsed) * 100).toFixed(3);
        this.barReceivingWidth = ((receiving/this.phaseElapsed) * 100).toFixed(3);

        // Compute also offset for page timings, e.g.: contentLoadBar and windowLoadBar,
        // which are displayed for the first phase. This is done only if a page exists.
        this.calculatePageTimings(page, file, phase);

        return phase;
    },

    calculatePageTimings: function(page, file, phase)
    {
        // Obviously we need a page object for page timings.
        if (!page)
            return;

        var pageStart = Lib.parseISO8601(page.startedDateTime);

        // Iterate all timings in this phase and generate offsets (px position in the timeline).
        for (var i=0; i<phase.pageTimings.length; i++)
        {
            var time = phase.pageTimings[i].time;
            if (time > 0)
            {
                var timeOffset = pageStart + time - phase.startTime;
                var barOffset = ((timeOffset/this.phaseElapsed) * 100).toFixed(3);
                phase.pageTimings[i].offset = barOffset;
            }
        }
    },

    updateTimeline: function(page)
    {
        var phase;

        // Iterate over all existing entries. Some rows aren't associated with a file
        // (e.g. header, sumarry) so, skip them.
        for (var row = this.firstRow; row; row = row.nextSibling)
        {
            var file = row.repObject;
            if (!file)
                continue;

            // Skip expanded rows.
            if (Lib.hasClass(row, "netInfoRow"))
                continue;

            phase = this.calculateFileTimes(page, file, phase);

            // Remember the phase it's utilized by the time info-tip.
            row.phase = file.phase;

            // Remove the phase from the file object so, it's not displayed
            // in the DOM tab.
            delete file.phase;

            // Parent for all timing bars.
            var timelineBar = Lib.getElementByClass(row, "netTimelineBar");

            // Get bar nodes. Every node represents one part of the graph-timeline.
            var blockingBar = timelineBar.children[0];
            var resolvingBar = blockingBar.nextSibling;
            var connectingBar = resolvingBar.nextSibling;
            var sendingBar = connectingBar.nextSibling;
            var waitingBar = sendingBar.nextSibling;
            var receivingBar = waitingBar.nextSibling;

            // All bars starts at the beginning of the appropriate request graph.
            blockingBar.style.left =
                connectingBar.style.left =
                resolvingBar.style.left =
                sendingBar.style.left =
                waitingBar.style.left =
                receivingBar.style.left = this.barOffset + "%";

            // Sets width of all bars (using style). The width is computed according to measured timing.
            blockingBar.style.width = this.barBlockingWidth + "%";
            resolvingBar.style.width = this.barResolvingWidth + "%";
            connectingBar.style.width = this.barConnectingWidth + "%";
            sendingBar.style.width = this.barSendingWidth + "%";
            waitingBar.style.width = this.barWaitingWidth + "%";
            receivingBar.style.width = this.barReceivingWidth + "%";

            // Remove all existing timing bars first. The UI can be relayouting at this moment
            // (can happen if break layout is executed).
            var bars = Lib.getElementsByClass(timelineBar, "netPageTimingBar");
            for (var j=0; j<bars.length; j++)
                bars[j].parentNode.removeChild(bars[j]);

            // Generate UI for page timings (vertical lines displayed for the first phase)
            for (var i=0; i<phase.pageTimings.length; i++)
            {
                var timing = phase.pageTimings[i];
                if (!timing.offset)
                    continue;

                var bar = timelineBar.ownerDocument.createElement("DIV");
                timelineBar.appendChild(bar);

                if (timing.classes)
                    Lib.setClass(bar, timing.classes);

                Lib.setClass(bar, "netPageTimingBar netBar");

                bar.style.left = timing.offset + "%";
                bar.style.display = "block";

                // The offset will be calculated for the next row (request entry) again
                // within calculatePageTimings in the next row (outer) cycle.
                timing.offset = null;
            }
        }
    },

    updateTimeStamps: function(page)
    {
        if (!page)
            return;

        var i;

        // Convert registered page timings (e.g. onLoad, DOMContentLoaded) into structures
        // with label information.
        var pageTimings = [];
        for (i=0; page.pageTimings && i<this.pageTimings.length; i++)
        {
            var timing = this.pageTimings[i];
            var eventTime = page.pageTimings[timing.name];
            if (eventTime > 0)
            {
                pageTimings.push({
                    label: timing.name,
                    time: eventTime,
                    classes: timing.classes,
                    comment: timing.description
                });
            }
        }

        // Get time-stamps generated from console.timeStamp() method (this method has been
        // introduced in Firebug 1.8b3).
        // See Firebug documentation: http://getfirebug.com/wiki/index.php/Console_API
        var timeStamps = page.pageTimings ? page.pageTimings._timeStamps : [];

        // Put together all timing info.
        if (timeStamps)
            pageTimings.push.apply(pageTimings, timeStamps);

        // Iterate all existing phases.
        var phases = this.phases;
        for (i=0; i<phases.length; i++)
        {
            var phase = phases[i];
            var nextPhase = phases[i+1];

            // Iterate all timings and divide them into phases. This process can extend
            // the end of a phase.
            for (var j=0; j<pageTimings.length; j++)
            {
                var stamp = pageTimings[j];
                var time = stamp.time;
                if (!time)
                    continue;

                // We need the absolute time.
                var startedDateTime = Lib.parseISO8601(page.startedDateTime);
                time += startedDateTime;

                // The time stamp belongs to the current phase if:
                // 1) It occurs before the next phase started or there is no next phase.
                if (!nextPhase || time < nextPhase.startTime)
                {
                    // 2) It occurs after the current phase started, or this is the first phase.
                    if (i === 0 || time >= phase.startTime)
                    {
                        // This is the case where the time stamp occurs before the first phase
                        // started (shouldn't actually happen since there can't be a stamp made
                        // before the first document request).
                        if (phase.startTime > time)
                            phase.startTime = time;

                        // This is the case where the time stamp occurs after the phase end time,
                        // but still before the next phase start time.
                        if (phase.endTime < time)
                            phase.endTime = time;

                        phase.pageTimings.push({
                            classes: stamp.classes ? stamp.classes : "netTimeStampBar",
                            name: stamp.label,
                            description: stamp.comment,
                            time: stamp.time
                        });
                    }
                }
            }
        }
    },

    updateSummaries: function(page)
    {
        var phases = this.phases;
        var fileCount = 0;
        var totalTransferredSize = 0;
        var totalUncompressedSize = 0;
        var cachedSize = 0;
        var totalTime = 0;
        for (var i = 0; i < phases.length; ++i)
        {
            var phase = phases[i];
            phase.invalidPhase = false;

            var summary = this.summarizePhase(phase);
            fileCount += summary.fileCount;
            totalTransferredSize += summary.totalTransferredSize;
            totalUncompressedSize += summary.totalUncompressedSize;
            cachedSize += summary.cachedSize;
            totalTime += summary.totalTime;
        }

        var row = this.summaryRow;
        if (!row)
            return;

        var countLabel = Lib.getElementByClass(row, "netCountLabel");
        countLabel.firstChild.nodeValue = this.formatRequestCount(fileCount);

        var sizeLabel = Lib.getElementByClass(row, "netTotalSizeLabel");
        sizeLabel.setAttribute("totalSize", totalTransferredSize);
        sizeLabel.firstChild.nodeValue = Lib.formatSize(totalTransferredSize);

        var uncompressedSizeLabel = Lib.getElementByClass(row, "netUncompressedSizeLabel");
        uncompressedSizeLabel.setAttribute("collapsed", totalUncompressedSize === 0);
        uncompressedSizeLabel.childNodes[1].firstChild.nodeValue = Lib.formatSize(totalUncompressedSize);

        var cacheSizeLabel = Lib.getElementByClass(row, "netCacheSizeLabel");
        cacheSizeLabel.setAttribute("collapsed", cachedSize === 0);
        cacheSizeLabel.childNodes[1].firstChild.nodeValue = Lib.formatSize(cachedSize);

        var timeLabel = Lib.getElementByClass(row, "netTotalTimeLabel");
        var timeText = Lib.formatTime(totalTime.toFixed(2));

        // xxxHonza: localization?
        if (page && page.pageTimings.onLoad > 0)
            timeText += " (onload: " + Lib.formatTime(page.pageTimings.onLoad.toFixed(2)) + ")";

        timeLabel.innerHTML = timeText;
    },

    formatRequestCount: function(count)
    {
        return count + " " + (count === 1 ? Strings.request : Strings.requests);
    },

    summarizePhase: function(phase)
    {
        var cachedSize = 0;
        var totalTransferredSize = 0;
        var totalUncompressedSize = 0;

        var fileCount = 0;
        var minTime = 0;
        var maxTime = 0;

        for (var i=0; i<phase.files.length; i++)
        {
            var file = phase.files[i];
            var startedDateTime = Lib.parseISO8601(file.startedDateTime);

            ++fileCount;

            var transferredSize = HarModel.getEntryTransferredSize(file);
            var uncompressedSize = HarModel.getEntryUncompressedSize(file);

            totalTransferredSize += transferredSize;
            totalUncompressedSize += uncompressedSize;

            if (HarModel.isCachedEntry(file)) {
                cachedSize += uncompressedSize;
            }

            if (!minTime || startedDateTime < minTime) {
                minTime = startedDateTime;
            }

            var fileEndTime = startedDateTime + file.time;
            if (fileEndTime > maxTime) {
                maxTime = fileEndTime;
            }
        }

        var totalTime = maxTime - minTime;
        return {
            cachedSize: cachedSize,
            totalUncompressedSize: totalUncompressedSize,
            totalTransferredSize: totalTransferredSize,
            totalTime: totalTime,
            fileCount: fileCount
        };
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // InfoTip

    showInfoTip: function(infoTip, target, x, y)
    {
        // There is more instances of RequestList object registered as info-tips listener
        // so make sure the one that is associated with the target is used.
        var table = Lib.getAncestorByClass(target, "netTable");
        if (!table || table.repObject !== this)
            return;

        var row = Lib.getAncestorByClass(target, "netRow");
        if (row)
        {
            var infoTipURL;

            if (Lib.getAncestorByClass(target, "netBar"))
            {
                // There is no background image for multiline tooltips.
                infoTip.setAttribute("multiline", true);
                infoTipURL = row.repObject.startedDateTime + "-nettime"; //xxxHonza the ID should be URL.
                // xxxHonza: there can be requests to the same URLs with different timings.
                //if (infoTipURL == this.infoTipURL)
                //    return true;

                this.infoTipURL = infoTipURL;
                return this.populateTimeInfoTip(infoTip, row);
            }
            else if (Lib.hasClass(target, "netSizeLabel"))
            {
                infoTipURL = row.repObject.startedDateTime + "-netsize"; //xxxHonza the ID should be URL.
                // xxxHonza: there can be requests to the same URLs with different response sizes.
                //if (infoTipURL == this.infoTipURL)
                //    return true;

                this.infoTipURL = infoTipURL;
                return this.populateSizeInfoTip(infoTip, row);
            }
        }
    },

    populateTimeInfoTip: function(infoTip, row)
    {
        EntryTimeInfoTip.render(this, row, infoTip);
        return true;
    },

    populateSizeInfoTip: function(infoTip, row)
    {
        EntrySizeInfoTip.render(this, row, infoTip);
        return true;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Public

    render: function(parentNode, page)
    {
        var entries = HarModel.getPageEntries(this.input, page);
        if (!entries.length)
            return null;

        return this.append(parentNode, page, entries);
    },

    append: function(parentNode, page, entries)
    {
        if (!this.table)
            this.table = this.tableTag.replace({requestList: this}, parentNode, this);

        if (!this.summaryRow)
            this.summaryRow = this.summaryTag.insertRows({}, this.table.firstChild)[0];

        var tbody = this.table.firstChild;
        var lastRow = tbody.lastChild.previousSibling;

        // Copy the entries and add an index property to each file,
        // so that we can display the index.
        var files = entries.map(function(file, i) {
            return Lib.extend(file, { index: i });
        });

        var result = this.fileTag.insertRows({files: files}, lastRow, this);
        this.updateLayout(this.table, page);

        return result[0];
    },

    addPageTiming: function(timing)
    {
        this.pageTimings.push(timing);
    }
});

// ********************************************************************************************* //

/**
 * @object This object represents a phase that joins related requests into groups (phases).
 */
function Phase(file)
{
    this.files = [];
    this.pageTimings = [];

    this.addFile(file);
}

Phase.prototype =
{
    addFile: function(file)
    {
        this.files.push(file);
        file.phase = this;
    },

    getLastStartTime: function()
    {
        // The last request start time.
        return this.files[this.files.length - 1].startedDateTime;
    }
};

// ********************************************************************************************* //

return RequestList;

// ********************************************************************************************* //
});
