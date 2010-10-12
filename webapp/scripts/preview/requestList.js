/* See license.txt for terms of usage */

require.def("preview/requestList", [
    "domplate/domplate",
    "core/lib",
    "i18n!nls/requestList",
    "preview/harModel",
    "core/cookies",
    "preview/requestBody",
    "domplate/infoTip",
    "domplate/popupMenu"
],

function(Domplate, Lib, Strings, HarModel, Cookies, RequestBody, InfoTip, Menu) { with (Domplate) {

//*************************************************************************************************
// Request List

function RequestList(input)
{
    this.input = input;

    InfoTip.addListener(this);
}

/**
 * @domplate This object represents a template for list of entries (requests).
 * This list is displayed when a page is expanded by the user. 
 */
RequestList.prototype = domplate(
/** @lends RequestList */
{
    tableTag:
        TABLE({"class": "netTable", cellpadding: 0, cellspacing: 0, onclick: "$onClick"},
            TBODY(
                TR(
                    TD({width: "20%"}),
                    TD({width: "10%"}),
                    TD({width: "10%"}),
                    TD({width: "10%"}),
                    TD({width: "50%"}),
                    TD({width: "15px"})
                )
            )
        ),

    fileTag:
        FOR("file", "$files",
            TR({"class": "netRow loaded",
                $hasHeaders: "$file|hasResponseHeaders",
                $responseError: "$file|isError",
                $fromCache: "$file|isFromCache"},
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
                    DIV({"class": "netStatusLabel netLabel"}, "$file|getStatus")
                ),
                TD({"class": "netDomainCol netCol"},
                    DIV({"class": "netDomainLabel netLabel"}, "$file|getDomain")
                ),
                TD({"class": "netSizeCol netCol"},
                    DIV({"class": "netSizeLabel netLabel"}, "$file|getSize")
                ),
                TD({"class": "netTimeCol netCol"},
                    DIV({"class": "netTimelineBar"},
                        "&nbsp;",
                        DIV({"class": "netResolvingBar netBar", style: "left: $file.offset"}),
                        DIV({"class": "netConnectingBar netBar", style: "left: $file.offset"}),
                        DIV({"class": "netBlockingBar netBar", style: "left: $file.offset"}),
                        DIV({"class": "netSendingBar netBar", style: "left: $file.offset"}),
                        DIV({"class": "netWaitingBar netBar", style: "left: $file.offset"}),
                        DIV({"class": "netContentLoadBar netBar", style: "left: $file.offset"}),
                        DIV({"class": "netWindowLoadBar netBar", style: "left: $file.offset"}),
                        DIV({"class": "netReceivingBar netBar", style: "left: $file.offset; width: $file.width"},
                            SPAN({"class": "netTimeLabel"}, "$file|getElapsedTime")
                        )
                    )
                ),
                TD({"class": "netOptionsCol netCol"},
                    DIV({"class": "netOptionsLabel netLabel", onclick: "$onOpenOptions"})
                )
            )
        ),

    headTag:
        TR({"class": "netHeadRow"},
            TD({"class": "netHeadCol", colspan: 6},
                DIV({"class": "netHeadLabel"}, "$doc.rootFile.href")
            )
        ),

    netInfoTag:
        TR({"class": "netInfoRow"},
            TD({"class": "netInfoCol", colspan: 6})
        ),

    summaryTag:
        TR({"class": "netRow netSummaryRow"},
            TD({"class": "netCol", colspan: 3},
                DIV({"class": "netCountLabel netSummaryLabel"}, "-")
            ),
            TD({"class": "netTotalSizeCol netCol"},
                DIV({"class": "netTotalSizeLabel netSummaryLabel"}, "0KB")
            ),
            TD({"class": "netTotalTimeCol netCol"},
                DIV({"class": "", style: "width: 100%"},
                    DIV({"class": "netCacheSizeLabel netSummaryLabel"},
                        "(",
                        SPAN("0KB"),
                        SPAN(" " + Strings.fromCache),
                        ")"
                    ),
                    DIV({"class": "netTimeBar"},
                        SPAN({"class": "netTotalTimeLabel netSummaryLabel"}, "0ms")
                    )
                )
            ),
            TD({"class": "netCol"})
        ),

    getIndent: function(file)
    {
        return 0;
    },

    isError: function(file)
    {
        var errorRange = Math.floor(file.response.status/100);
        return errorRange == 4 || errorRange == 5;
    },

    isFromCache: function(file)
    {
        return file.cache && file.cache.afterRequest;
    },

    getHref: function(file)
    {
        return file.request.method + " " + Lib.getFileName(this.getFullHref(file));
    },

    getFullHref: function(file)
    {
        return file.request.url;
    },

    getStatus: function(file)
    {
        var status = file.response.status > 0 ? (file.response.status + " ") : "";
        return status + file.response.statusText;
    },

    getDomain: function(file)
    {
        return Lib.getPrettyDomain(file.request.url);
    },

    getSize: function(file)
    {
        var bodySize = file.response.bodySize;
        var size = (bodySize && bodySize != -1) ? bodySize :
            file.response.content.size;

        return this.formatSize(size);
    },

    hasResponseHeaders: function(file)
    {
        return true;
    },

    formatSize: function(bytes)
    {
        return Lib.formatSize(bytes);
    },

    getElapsedTime: function(file)
    {
        // Total request time doesn't include the time spent in queue.
        //var elapsed = file.time - file.timings.blocked;
        return Lib.formatTime(file.time);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    onClick: function(event)
    {
        var e = $.event.fix(event || window.event);
        if (Lib.isLeftClick(event))
        {
            var row = Lib.getAncestorByClass(e.target, "netRow");
            if (row)
            {
                this.toggleHeadersRow(row);
                Lib.cancelEvent(event);
            }
        }
    },

    toggleHeadersRow: function(row)
    {
        if (!Lib.hasClass(row, "hasHeaders"))
            return;

        var file = row.repObject;

        Lib.toggleClass(row, "opened");
        if (Lib.hasClass(row, "opened"))
        {
            var netInfoRow = this.netInfoTag.insertRows({}, row)[0];
            netInfoRow.repObject = file;

            var requestBody = new RequestBody();
            requestBody.render(netInfoRow.firstChild, file);
        }
        else
        {
            var netInfoRow = row.nextSibling;
            var netInfoBox = Lib.getElementByClass(netInfoRow, "netInfoBody");
            row.parentNode.removeChild(netInfoRow);
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Options

    onOpenOptions: function(event)
    {
        var e = $.event.fix(event || window.event);
        Lib.cancelEvent(event);

        if (!Lib.isLeftClick(event))
            return;

        var target = e.target;

        // Collect all menu items.
        var row = Lib.getAncestorByClass(target, "netRow");
        var items = this.getOptionsMenuItems(row);

        // Finall, display the the popup menu.
        // xxxHonza: the old <DIV> can be still visible.
        var menu = new Menu({id: "requestContextMenu", items: items});
        menu.showPopup(target);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Menu Definition

    getOptionsMenuItems: function(row)
    {
        var file = row.repObject;
        var phase = row.phase;

        return [
            {
                label: Strings.menuBreakTimeline,
                type: "checkbox",
                disabled: false, // xxxHonza: the first phase, the first file.
                checked: phase.files[0] == file,
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
        var layoutBroken = phase.files[0] == file;
        row.breakLayout = !layoutBroken;

        var netTable = Lib.getAncestorByClass(row, "netTable");
        var page = HarModel.getParentPage(this.input, file);
        this.updateLayout(netTable, page);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
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
            phaseInterval = 1000;

        var phase = null;

        var pageStartedDateTime = page ? Lib.parseISO8601(page.startedDateTime) : null;
        var onLoadTime = 0;
        var onContentLoadTime = 0;

        if (page && page.pageTimings)
        {
            var timings = page.pageTimings;
            onLoadTime = (timings.onLoad > 0) ? timings.onLoad : 0;
            onContentLoadTime = (timings.onContentLoad > 0) ? timings.onContentLoad : 0;
        }

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

            // New phase is started if:
            // 1) There is no phase yet.
            // 2) There is a gap between this request and the last one.
            // 3) The new request is not started during the page load.
            var newPhase =
                ((startedDateTime - phaseLastStartTime) >= phaseInterval) &&
                (startedDateTime > (pageStartedDateTime + onLoadTime));

            // 4) The file can be also marked with breakLayout
            if (typeof(row.breakLayout) == "boolean")
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

            if (phase.startTime == undefined || phase.startTime > startedDateTime)
                phase.startTime = startedDateTime;

            // file.time represents total elapsed time of the request.
            if (phase.endTime == undefined || phase.endTime < startedDateTime + file.time)
                phase.endTime = startedDateTime + file.time;

            if (file.phase == this.phases[0] && phase.endTime < pageStartedDateTime + onLoadTime)
                phase.endTime = pageStartedDateTime + onLoadTime;

            if (file.phase == this.phases[0] && phase.endTime < pageStartedDateTime + onContentLoadTime)
                phase.endTime = pageStartedDateTime + onContentLoadTime;

            row = row.nextSibling;
        }

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
        if (phase != file.phase)
        {
            phase = file.phase;
            this.phaseStartTime = phase.startTime;
            this.phaseEndTime = phase.endTime;
            this.phaseElapsed = this.phaseEndTime - phase.startTime;
        }

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
        var resolving = ((file.timings.dns < 0) ? 0 : file.timings.dns);
        var connecting = resolving + ((file.timings.connect < 0) ? 0 : file.timings.connect);
        var blocking = connecting + ((file.timings.blocked < 0) ? 0 : file.timings.blocked);
        var sending = blocking + ((file.timings.send < 0) ? 0 : file.timings.send);
        var waiting = sending + ((file.timings.wait < 0) ? 0 : file.timings.wait);
        var receiving = waiting + ((file.timings.receive < 0) ? 0 : file.timings.receive);

        var elapsed = file.time;
        var startedDateTime = Lib.parseISO8601(file.startedDateTime);
        this.barOffset = (((startedDateTime-this.phaseStartTime)/this.phaseElapsed) * 100).toFixed(3);

        // Compute size of each bar. Left side of each bar starts at the 
        // beginning. The first bar is on top of all and the last one is
        // at the bottom (z-index). 
        this.barResolvingWidth = ((resolving/this.phaseElapsed) * 100).toFixed(3);
        this.barConnectingWidth = ((connecting/this.phaseElapsed) * 100).toFixed(3);
        this.barBlockingWidth = ((blocking/this.phaseElapsed) * 100).toFixed(3);
        this.barSendingWidth = ((sending/this.phaseElapsed) * 100).toFixed(3);
        this.barWaitingWidth = ((waiting/this.phaseElapsed) * 100).toFixed(3);
        this.barReceivingWidth = ((receiving/this.phaseElapsed) * 100).toFixed(3);

        // Compute also offset for the contentLoadBar and windowLoadBar, which are
        // displayed for the first phase. This is done only if the page exists.
        if (page)
        {
            var pageStart = Lib.parseISO8601(page.startedDateTime);

            // onContentLoad (e.g. DOMContentLoad for Firefox)
            var onContentLoad = page.pageTimings.onContentLoad;
            if (file.phase == this.phases[0] && onContentLoad > 0)
                this.contentLoadBarOffset =
                    (((pageStart+onContentLoad-phase.startTime)/this.phaseElapsed) * 100).toFixed(3);

            // onLoad (e.g. onLoad for Firefox)
            var onLoad = page.pageTimings.onLoad;
            if (file.phase == this.phases[0] && onLoad > 0)
                this.windowLoadBarOffset =
                    (((pageStart+onLoad-phase.startTime)/this.phaseElapsed) * 100).toFixed(3);
        }

        return phase;
    },

    updateTimeline: function(page)
    {
        var tbody = this.table.firstChild;

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

            // Get bar nodes. Every node represents one part of the graph-timeline.
            var resolvingBar = Lib.getElementByClass(row, "netResolvingBar");
            var connectingBar = resolvingBar.nextSibling;
            var blockingBar = connectingBar.nextSibling;
            var sendingBar = blockingBar.nextSibling;
            var waitingBar = sendingBar.nextSibling;
            var contentLoadBar = waitingBar.nextSibling;
            var windowLoadBar = contentLoadBar.nextSibling;
            var receivingBar = windowLoadBar.nextSibling;

            // All bars starts at the beginning of the appropriate request graph. 
            resolvingBar.style.left = 
                connectingBar.style.left =
                blockingBar.style.left =
                sendingBar.style.left = 
                waitingBar.style.left =
                receivingBar.style.left = this.barOffset + "%";

            // Sets width of all bars (using style). The width is computed according to measured timing.
            resolvingBar.style.width = this.barResolvingWidth + "%";
            connectingBar.style.width = this.barConnectingWidth + "%";
            blockingBar.style.width = this.barBlockingWidth + "%";
            sendingBar.style.width = this.barSendingWidth + "%";
            waitingBar.style.width = this.barWaitingWidth + "%";
            receivingBar.style.width = this.barReceivingWidth + "%";

            if (this.contentLoadBarOffset) {
                contentLoadBar.style.left = this.contentLoadBarOffset + "%";
                contentLoadBar.style.display = "block";
                this.contentLoadBarOffset = null;
            }

            if (this.windowLoadBarOffset) {
                windowLoadBar.style.left = this.windowLoadBarOffset + "%";
                windowLoadBar.style.display = "block";
                this.windowLoadBarOffset = null;
            }
        }
    },

    updateSummaries: function(page)
    {
        var phases = this.phases;
        var fileCount = 0, totalSize = 0, cachedSize = 0, totalTime = 0;
        for (var i = 0; i < phases.length; ++i)
        {
            var phase = phases[i];
            phase.invalidPhase = false;

            var summary = this.summarizePhase(phase);
            fileCount += summary.fileCount;
            totalSize += summary.totalSize;
            cachedSize += summary.cachedSize;
            totalTime += summary.totalTime;
        }

        var row = this.summaryRow;
        if (!row)
            return;

        var countLabel = Lib.getElementByClass(row, "netCountLabel");
        countLabel.firstChild.nodeValue = this.formatRequestCount(fileCount);

        var sizeLabel = Lib.getElementByClass(row, "netTotalSizeLabel");
        sizeLabel.setAttribute("totalSize", totalSize);
        sizeLabel.firstChild.nodeValue = Lib.formatSize(totalSize);

        var cacheSizeLabel = Lib.getElementByClass(row, "netCacheSizeLabel");
        cacheSizeLabel.setAttribute("collapsed", cachedSize == 0);
        cacheSizeLabel.childNodes[1].firstChild.nodeValue = Lib.formatSize(cachedSize);

        var timeLabel = Lib.getElementByClass(row, "netTotalTimeLabel");
        var timeText = Lib.formatTime(totalTime);

        // xxxHonza: localization?
        if (page && page.pageTimings.onLoad > 0)
            timeText += " (onload: " + Lib.formatTime(page.pageTimings.onLoad) + ")";

        timeLabel.innerHTML = timeText;
    },

    formatRequestCount: function(count)
    {
        return count + " " + (count == 1 ? String.request : String.requests);
    },

    summarizePhase: function(phase)
    {
        var cachedSize = 0, totalSize = 0;

        var category = "all";
        if (category == "all")
            category = null;

        var fileCount = 0;
        var minTime = 0, maxTime = 0;

        for (var i=0; i<phase.files.length; i++)
        {
            var file = phase.files[i];
            var startedDateTime = Lib.parseISO8601(file.startedDateTime);

            if (!category || file.category == category)
            {
                ++fileCount;

                var bodySize = file.response.bodySize;
                var size = (bodySize && bodySize != -1) ? bodySize : file.response.content.size;

                totalSize += size;
                if (file.response.status == 304)
                    cachedSize += size;

                if (!minTime || startedDateTime < minTime)
                    minTime = startedDateTime;

                var fileEndTime = startedDateTime + file.time;
                if (fileEndTime > maxTime)
                    maxTime = fileEndTime;
            }
        }

        var totalTime = maxTime - minTime;
        return {cachedSize: cachedSize, totalSize: totalSize, totalTime: totalTime,
                fileCount: fileCount}
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // InfoTip

    showInfoTip: function(infoTip, target, x, y)
    {
        var row = Lib.getAncestorByClass(target, "netRow");
        if (row)
        {
            if (Lib.getAncestorByClass(target, "netBar"))
            {
                // There is no background image for multiline tooltips.
                infoTip.setAttribute("multiline", true);
                var infoTipURL = row.repObject.startedDateTime + "-nettime"; //xxxHonza the ID should be URL.
                // xxxHonza: there can be requests to the same URLs with different timings.
                //if (infoTipURL == this.infoTipURL)
                //    return true;

                this.infoTipURL = infoTipURL;
                return this.populateTimeInfoTip(infoTip, row);
            }
            else if (Lib.hasClass(target, "netSizeLabel"))
            {
                var infoTipURL = row.repObject.startedDateTime + "-netsize"; //xxxHonza the ID should be URL.
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
        EntryTimeInfoTip.render(this.input, row, infoTip);
        return true;
    },

    populateSizeInfoTip: function(infoTip, row)
    {
        EntrySizeInfoTip.render(this.input, row, infoTip);
        return true;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Public

    render: function(parentNode, page)
    {
        var requests = HarModel.getPageEntries(this.input, page);
        if (!requests.length)
            return;

        this.table = this.tableTag.replace({}, parentNode, this);
        this.summaryRow =  this.summaryTag.insertRows({}, this.table.firstChild)[0];

        var tbody = this.table.firstChild;
        var lastRow = tbody.lastChild.previousSibling;

        this.fileTag.insertRows({files: requests}, lastRow, this);

        this.updateLayout(this.table, page);
    }
});

//*************************************************************************************************

/**
 * @object This object represents a phase that joins related requests into groups (phases).
 */
function Phase(file)
{
    this.files = [];
    this.addFile(file);
};

Phase.prototype =
{
    addFile: function(file)
    {
        this.files.push(file);
        file.phase = this;
    },

    getLastStartTime: function()
    {
        return this.files[this.files.length - 1].startedDateTime;
    }
};

//***********************************************************************************************//

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
            TD({"colspan": 2},
                "$startTime|getLabel"
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
        return Lib.formatTime(time);
    },

    formatStartTime: function(time)
    {
        var positive = time > 0;
        var label = Lib.formatTime(Math.abs(time));
        if (!time)
            return label;

        return (positive > 0 ? "+" : "-") + label;
    },

    getLabel: function(obj)
    {
        return Strings[obj.bar];
    },

    render: function(input, row, parentNode)
    {
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
        startTimeObj.time = requestStart - row.phase.startTime;
        startTimeObj.bar = "request.Started";
        this.startTimeTag.insertRows({startTime: startTimeObj}, infoTip.firstChild);

        // Insert separator.
        this.separatorTag.insertRows({}, infoTip.firstChild);

        var startTime = 0;
        var timings = [];

        // Helper shortcuts
        var dns = file.timings.dns;
        var ssl = file.timings.ssl; // new in HAR 1.2 xxxHonza: TODO
        var connect = file.timings.connect;
        var blocked = file.timings.blocked;
        var send = file.timings.send;
        var wait = file.timings.wait;
        var receive = file.timings.receive;

        if (dns >= 0)
        {
            timings.push({bar: "request.phase.Resolving",
                elapsed: dns,
                start: startTime});
        }

        if (connect >= 0)
        {
            timings.push({bar: "request.phase.Connecting",
                elapsed: connect,
                start: startTime += (dns < 0) ? 0 : dns});
        }

        if (blocked >= 0)
        {
            timings.push({bar: "request.phase.Blocking",
                elapsed: blocked,
                start: startTime += (connect < 0) ? 0 : connect});
        }

        if (send >= 0)
        {
            timings.push({bar: "request.phase.Sending",
                elapsed: send,
                start: startTime += (blocked < 0) ? 0 : blocked});
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
                loaded: file.loaded, fromCache: file.fromCache});
        }

        // Insert request timing info.
        this.timingsTag.insertRows({timings: timings}, infoTip.firstChild);

        // Get page event timing info (if the page exists).
        var events = [];

        if (page && page.pageTimings.onContentLoad > 0)
            events.push({bar: "ContentLoad",
                start: pageStart + page.pageTimings.onContentLoad - requestStart});

        if (page && page.pageTimings.onLoad > 0)
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

//***********************************************************************************************//

var EntrySizeInfoTip = domplate(
{
    tag:
        DIV({"class": "sizeInfoTip"}, "$file|getSize"),

    zippedTag:
        DIV(
            DIV({"class": "sizeInfoTip"}, "$file|getBodySize"),
            DIV({"class": "sizeInfoTip"}, "$file|getContentSize")
        ),

    getSize: function(file)
    {
        var bodySize = file.response.bodySize;
        return Lib.formatString(Strings.tooltipSize, [Lib.formatSize(bodySize),
            ((bodySize.size < 0) ? "?" : Lib.formatNumber(bodySize))]);
    },

    getBodySize: function(file)
    {
        var bodySize = file.response.bodySize;
        return Lib.formatString(Strings.tooltipZippedSize, [Lib.formatSize(bodySize),
            ((bodySize.size < 0) ? "?" : Lib.formatNumber(bodySize))]);
    },

    getContentSize: function(file)
    {
        var contentSize = file.response.content.size;
        return Lib.formatString(Strings.tooltipUnzippedSize, [Lib.formatSize(contentSize),
            ((contentSize.size < 0) ? "?" : Lib.formatNumber(contentSize))]);
    },

    render: function(input, row, parentNode)
    {
        var file = row.repObject;
        if (file.response.bodySize == file.response.content.size)
            return this.tag.replace({file: file}, parentNode);

        return this.zippedTag.replace({file: file}, parentNode);
    }
});

//*************************************************************************************************

return RequestList;

//*************************************************************************************************
}});
