/* See license.txt for terms of usage */

HAR.ns(function() { with (Domplate) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

/**
 * Template for list/graph of pages.
 */
HAR.Page.Timeline = domplate(
{
    graphCols:
        FOR("page", "$pages",
            TD({"class": "pageTimelineCol"},
                DIV({"class": "pageBar",
                    style: "height: $page|getHeight\\px",
                    onmousemove: "$onMouseMove",
                    _repObject: "$page",
                    onclick: "$onClick"})
            )
        ),

    pageGraph:
        TABLE({"class": "pageTimelineTable", cellpadding: 0, cellspacing: 0},
            TBODY(
                TR({"class": "pageTimelineRow"},
                    TAG("$graphCols", {pages: "$pages"})
                )
            )
        ),

    pageDesc:
        DIV({"class": "pageDescBox"},
            DIV({"class": "connector"}),
            DIV({"class": "desc"},
                SPAN({"class": "summary"}, "&nbsp;"),
                SPAN({"class": "url"}, "&nbsp;")
            )
        ),

    tag:
        DIV({"class": "pageTimelineBody", style: "height: auto; display: none"},
            TABLE({style: "margin: 7px;", cellpadding: 0, cellspacing: 0},
                TBODY(
                    TR(
                        TD(
                            TAG("$pageGraph", {pages: "$pages"})
                        )
                    ),
                    TR(
                        TD({colspan: 2},
                            TAG("$pageDesc")
                        )
                    )
                )
            )
        ),

    getHeight: function(page)
    {
        var height = Math.round((page.pageTimings.onLoad / this.maxElapsedTime) * 100);
        return Math.max(1, height);
    },

    onMouseMove: function(event)
    {
        var e = HAR.eventFix(event || window.event);

        var target = e.target;
        if (!hasClass(target, "pageBar"))
            return;

        this.updateDesc(getAncestorByClass(target, "tabPreviewBody"), target);
    },

    updateDesc: function(previewBody, pageBar)
    {
        var page = pageBar.repObject;

        //xxxHonza: If the timeline is opened the first time, the connector
        // position must be properly updated.
        //if (this.highlightedPage == page)
        //    return;

        this.highlightedPage = page;

        var pageTimeline = getElementByClass(previewBody, "pageTimelineBody");

        // Update connector position, but only if the timeline is visible
        if (hasClass(pageTimeline, "opened"))
        {
            var descBox = getElementByClass(previewBody, "pageDescBox");
            descBox.style.visibility = "visible";

            var conn = getElementByClass(previewBody, "connector");
            conn.style.marginLeft = pageBar.parentNode.offsetLeft + "px";
            HAR.log("Page.Timeline.updateConnector position: " + conn.style.marginLeft);

            // Collect page summary info.
            var summary = "";
            if (page.pageTimings.onLoad)
            {
                summary += $STR("label.Page_Load") + ": " +
                    formatTime(page.pageTimings.onLoad) + ", ";
            }

            var requests = HAR.Model.getPageEntries(page);
            summary += HAR.Tab.Preview.formatRequestCount(requests.length);

            // Page tooltip update: summary
            var summaryNode = getElementByClass(descBox, "summary");
            summaryNode.innerHTML = summary; 

            // Page tooltip update: URL 
            var desc = getElementByClass(descBox, "desc");
            desc.childNodes[1].innerHTML = page.title;
        }

        // Update pie graph.
        // xxxHonza: but only if it's visible.
        var pageStats = getElementByClass(previewBody, "pageStats");
        HAR.Page.Stats.update(pageStats, page);
    },

    onClick: function(event)
    {
        var e = HAR.eventFix(event || window.event);

        var target = e.target;
        if (!hasClass(target, "pageBar"))
            return;

        toggleClass(target, "selected");
    },

    maxElapsedTime: -1,

    append: function(inputData, parentNode)
    {
        HAR.log("har; Page timeline, append inputData: ", inputData);

        var prevMaxElapsedTime = this.maxElapsedTime; 

        // Iterate over all pages and find the max load-time so, the vertical
        // graph extent can be set.
        var pages = HAR.Model.inputData.log.pages;
        for (var i=0; i<pages.length; i++)
        {
            var onLoadTime = pages[i].pageTimings.onLoad;
            if (this.maxElapsedTime < onLoadTime)
                this.maxElapsedTime = onLoadTime;
        }

        if (!this.pageTimeline)
        {
            // If the timeline doesn't exist yet create it.
            clearNode(parentNode);
            this.pageTimeline = this.tag.append({pages: pages}, parentNode);
        }
        else
        {
            // Recalculate height of all pages since there are new
            if (prevMaxElapsedTime < this.maxElapsedTime) 
                this.recalcLayout(this.pageTimeline);

            // Otherwise just append a new columns to the existing graph.
            var timelineRow = getElementByClass(this.pageTimeline, "pageTimelineRow");
            this.graphCols.insertCols({pages: inputData.log.pages}, timelineRow);
        }
    },

    recalcLayout: function(pageTimeline)
    {
        var bars = getElementsByClass(pageTimeline, "pageBar");
        for (var i=0; i<bars.length; i++)
            bars[i].style.height = this.getHeight(bars[i].repObject) + "px";
    }
});

//-----------------------------------------------------------------------------

/**
 * Button template.
 */
HAR.Page.ShowTimeline = domplate(
{
    tag:
        SPAN({"class": "harButton", onclick: "$onToggle"},
            $STR("button.Show_Page_Timeline")
        ),

    onToggle: function(event)
    {
        var e = HAR.eventFix(event || window.event);
        cancelEvent(event);

        var button = e.target;
        if (!hasClass(button, "harButton"))
            return;

        var body = getAncestorByClass(button, "tabPreviewBody");
        var timelineBody = getElementByClass(body, "pageTimelineBody");

        var openNow = toggleClass(timelineBody, "opened");
        setCookie("timeline", openNow);
        if (openNow)
        {
            if (dojo.isIE)
                timelineBody.style.display = "block";
            else
                dojo.fx.wipeIn({node: timelineBody}).play();

            button.innerHTML = $STR("button.Hide_Page_Timeline");

            // Make sure the decription (tooltip) is displayed for the first page automatically.
            if (!this.updateDesc)
            {
                this.updateDesc = true;
                var firstPageBar = getElementByClass(body, "pageBar");
                HAR.Lib.fireEvent(firstPageBar, "mousemove");
            }
        }
        else
        {
            if (dojo.isIE)
                timelineBody.style.display = "none";
            else
                dojo.fx.wipeOut({node: timelineBody}).play();

            button.innerHTML = $STR("button.Show_Page_Timeline");
        }
    }
});

//-----------------------------------------------------------------------------
}}});
