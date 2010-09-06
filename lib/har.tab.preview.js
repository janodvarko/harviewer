/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Domplate) { with (HAR.Lib) {

// ************************************************************************************************

/**
 * Preview tab implementation.
 */
HAR.Tab.Preview = HAR.extend(
{
    id: "Preview",
    label: "viewer.tab.Preview",

    timeline: HAR.Page.Timeline,
    stats: HAR.Page.Stats,

    tabBodyTag:
        DIV({"class": "tab$tab.id\\Body tabBody", _repObject: "$tab"},
            DIV({"class": "previewToolBar"}),
            DIV({"class": "pageTimeline"}),
            DIV({"class": "pageStats"}),
            DIV({"class": "pageList"})
        ),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Module

    initialize: function()
    {
        // Initialize toolbar
        this.toolBar = new HAR.ToolBar();
        this.toolBar.addButton({tag: HAR.Page.ShowTimeline.tag});
        this.toolBar.addButton({tag: HAR.Page.ShowStats.tag});
        this.toolBar.addButton({label: "button.Clear",
            oncommand: bind(this.onClear, this)});
        this.toolBar.addButton({tag: HAR.Download.tag});
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Tab

    onUpdateTabBody: function(viewBody, view, object)
    {
        var tab = viewBody.selectedTab;
        var tabPreviewBody = getElementByClass(viewBody, "tabPreviewBody");
        if (hasClass(tab, "PreviewTab") && !tabPreviewBody.updated)
        {
            tabPreviewBody.updated = true;
            this.render(tabPreviewBody);
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    render: function(parentNode)
    {
        // Render toolbar
        this.toolBar.render(getElementByClass(parentNode, "previewToolBar"));

        // Create download button. This button must be created as soon as
        // the parent element (identified by id) exists).
        HAR.Download.create();

        // Render basic structure of the timeline.
        this.timeline.render(getElementByClass(parentNode, "pageTimeline"));
        this.stats.render(getElementByClass(parentNode, "pageStats"));

        if (getCookie("timeline") == "true")
            this.timeline.show(false);

        if (getCookie("stats") == "true")
            this.stats.show(false);

        // The page list is appended dynamically e.g. by dropping a HAR file.
    },

    onClear: function()
    {
        var href = document.location.href;
        var index = href.indexOf("?");
        document.location = href.substr(0, index);
    },

    append: function(inputData, parentNode)
    {
        // Remove possible errors from the page.
        var errors = getElementsByClass(parentNode, "errorTable");
        for (var i=0; i<errors.length; i++)
        {
            var error = errors[i];
            error.parentNode.removeChild(error);
        }

        // Build page list from what we have.
        this.buildPageList(parentNode, inputData);

        // Update also page timeline.
        this.timeline.append(inputData);
    },

    buildPageList: function(parentNode, inputData)
    {
        if (!inputData)
            return;

        var start = HAR.now();

        // According to the spec, network requests doesn't have to be 
        // associated with the parent page. This is to support even
        // tools that can't get this info.
        // Also if log files are merged there can be some requests not
        // associated with any page. Make sure these are displayed too. 
        this.buildPageContent(parentNode, null);

        var table;

        // If there are any pages, build regular page list.
        var pages = inputData.log.pages;
        if (pages && pages.length)
        {
            // OK, a page exists so, let's build the page list first.
            var PageList = HAR.Rep.PageList;
            table = PageList.render(pages, parentNode);

            // Expand appended page by default, but only if there is only one page.
            var modelPages = HAR.Model.getPages();
            if (modelPages.length == 1)
                PageList.toggleRow(table.firstChild.firstChild);
        }

        // Mark the preview tab as initialized so, it isn't rendered 
        // again as soon as the tab is selected.
        parentNode.updated = true; 

        HAR.log("har; Render preview data: " + formatTime(HAR.now() - start));

        return table;
    },

    buildPageContent: function(parentNode, page)
    {
        var requests = HAR.Model.getPageEntries(page);
        if (!requests.length)
            return; 

        var EntryList = HAR.Rep.EntryList;
        this.table = EntryList.tableTag.replace({}, parentNode, EntryList);
        this.summaryRow =  EntryList.summaryTag.insertRows({}, this.table.firstChild)[0];

        var tbody = this.table.firstChild;
        var lastRow = tbody.lastChild.previousSibling;
        var row = this.firstRow = EntryList.fileTag.insertRows({files: requests}, lastRow)[0];

        this.phases = [];

        // The phase interval is customizable through a cookie.
        var phaseInterval = getCookie("phaseInterval");
        if (!phaseInterval)
            phaseInterval = 1000;

        var phase = null;

        var pageStartedDateTime = page ? parseISO8601(page.startedDateTime) : null;
        var onLoadTime = (page && page.pageTimings && page.pageTimings.onLoad > 0) ?
            page.pageTimings.onLoad : 0;

        for (var i=0; i<requests.length; i++)
        {
            var file = requests[i];
            row.repObject = file;
            row = row.nextSibling;

            // If the parent page doesn't exists get startedDateTime of the
            // first request.
            if (!pageStartedDateTime)
                pageStartedDateTime = parseISO8601(file.startedDateTime);

            var startedDateTime = parseISO8601(file.startedDateTime);
            var phaseLastStartTime = phase ? parseISO8601(phase.getLastStartTime()) : 0;

            // New phase is started if:
            // 1) There is no phase yet.
            // 2) There is a gap between this request and the last one.
            // 3) The new request is not started during the page load.
            if (!phase || ((startedDateTime - phaseLastStartTime) >= phaseInterval) &&
                (startedDateTime > (pageStartedDateTime + onLoadTime)))
            {
                phase = this.startPhase(file);
            }
            else
            {
                phase.addFile(file);
            }

            if (phase.startTime == undefined || phase.startTime > startedDateTime)
                phase.startTime = startedDateTime;

            // file.time represents total elapsed time of the request.
            if (phase.endTime == undefined || phase.endTime < startedDateTime + file.time)
                phase.endTime = startedDateTime + file.time;

            if (file.phase == this.phases[0] && phase.endTime < pageStartedDateTime + onLoadTime)
                phase.endTime = pageStartedDateTime + onLoadTime;
        }

        this.updateTimeline(page);
        this.updateSummaries(page);
    },

    startPhase: function(file)
    {
        var phase = new HAR.Model.Phase(file);
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
        var startedDateTime = parseISO8601(file.startedDateTime);
        this.barOffset = Math.floor(((startedDateTime-this.phaseStartTime)/this.phaseElapsed) * 100);

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
            var pageStartedDateTime = parseISO8601(page.startedDateTime);

            // onContentLoad (e.g. DOMContentLoad for Firefox)
            var onContentLoad = page.pageTimings.onContentLoad;
            if (file.phase == this.phases[0] && onContentLoad > 0)
                this.contentLoadBarOffset = Math.floor(
                    ((pageStartedDateTime+onContentLoad-phase.startTime)/this.phaseElapsed) * 100);

            // onLoad (e.g. onLoad for Firefox)
            var onLoad = page.pageTimings.onLoad;
            if (file.phase == this.phases[0] && onLoad > 0)
                this.windowLoadBarOffset = Math.floor(
                    ((pageStartedDateTime+onLoad-phase.startTime)/this.phaseElapsed) * 100);
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

            phase = this.calculateFileTimes(page, file, phase);

            // Remember the phase it's utilized by the time info-tip.
            row.phase = file.phase;

            // Remove the phase from the file object so, it's not displayed
            // in the DOM tab.
            delete file.phase;

            // Get bar nodes. Every node represents one part of the graph-timeline.
            var resolvingBar = row.childNodes[4].firstChild.childNodes[1];
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

        var countLabel = row.firstChild.firstChild;
        countLabel.firstChild.nodeValue = this.formatRequestCount(fileCount);

        var sizeLabel = row.childNodes[1].firstChild;
        sizeLabel.setAttribute("totalSize", totalSize);
        sizeLabel.firstChild.nodeValue = formatSize(totalSize);

        var cacheSizeLabel = row.lastChild.firstChild.firstChild;
        cacheSizeLabel.setAttribute("collapsed", cachedSize == 0);
        cacheSizeLabel.childNodes[1].firstChild.nodeValue = formatSize(cachedSize);

        var timeLabel = row.lastChild.firstChild.lastChild.firstChild;
        var timeText = formatTime(totalTime);

        // xxxHonza: localization?
        if (page && page.pageTimings.onLoad > 0)
            timeText += " (onload: " + formatTime(page.pageTimings.onLoad) + ")";

        timeLabel.innerHTML = timeText;
    },

    formatRequestCount: function(count)
    {
        return (count == 1) ? $STR("Request") : $STRF("RequestCount", [count]);
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
            var startedDateTime = parseISO8601(file.startedDateTime);

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

    showInfoTip: function(infoTip, target, x, y)
    {
        var row = getAncestorByClass(target, "netRow");
        if (row)
        {
            if (getAncestorByClass(target, "netTimeCol"))
            {
                infoTip.setAttribute("multiline", true);
                var infoTipURL = row.repObject.startedDateTime + "-nettime"; //xxxHonza the ID should be URL.
                // xxxHonza: there can be requests to the same URLs with different timings.
                //if (infoTipURL == this.infoTipURL)
                //    return true;

                this.infoTipURL = infoTipURL;
                return this.populateTimeInfoTip(infoTip, row);
            }
            else if (hasClass(target, "netSizeLabel"))
            {
                var infoTipURL = row.repObject.startedDateTime + "-netsize"; //xxxHonza the ID should be URL.
                // xxxHonza: there can be requests to the same URLs with different response sizes.
                //if (infoTipURL == this.infoTipURL)
                //    return true;

                this.infoTipURL = infoTipURL;
                return this.populateSizeInfoTip(infoTip, row);
            }
            return;
        }

        var statsPanel = getAncestorByClass(target, "pageStats");
        if (statsPanel)
            return HAR.Page.Stats.showInfoTip(infoTip, target, x, y);
    },

    populateTimeInfoTip: function(infoTip, row)
    {
        HAR.Rep.EntryTimeInfoTip.render(row, infoTip);
        return true;
    },

    populateSizeInfoTip: function(infoTip, row)
    {
        HAR.Rep.EntrySizeInfoTip.render(row.repObject, infoTip);
        return true;
    }
});

// ************************************************************************************************
// Registration

HAR.registerTab(HAR.Tab.Preview, "Input");
HAR.registerModule(HAR.Tab.Preview);

// ************************************************************************************************
}}});
