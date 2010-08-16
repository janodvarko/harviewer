/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Domplate) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

/**
 * Represents a list of pages displayed as a list of vertical graphs. this object
 * is implemented as a template so, it can render itself.
 */
HAR.Page.Timeline = domplate(
{
    rootNode: null,
    maxElapsedTime: -1,

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
                        TD({"class": "pageDescContainer", colspan: 2})
                    )
                )
            )
        ),

    getHeight: function(page)
    {
        var height = 1;
        var onLoad = page.pageTimings.onLoad;
        if (onLoad > 0 && this.maxElapsedTime > 0)
            height = Math.round((onLoad / this.maxElapsedTime) * 100);

        return Math.max(1, height);
    },

    // Template event handlers.
    onClick: function(event)
    {
        var e = HAR.eventFix(event || window.event);

        var target = e.target;
        if (!hasClass(target, "pageBar"))
            return;

        HAR.Rep.PageList.togglePage(target.repObject);

        //toggleClass(target, "selected");
    },

    onMouseMove: function(event)
    {
        var e = HAR.eventFix(event || window.event);

        // If the mouse moves over a page-bar, update a description displayed below.
        var target = e.target;
        if (hasClass(target, "pageBar"))
            this.updateDesc(target);
    },

    updateDesc: function(pageBar)
    {
        var page = pageBar.repObject;

        //xxxHonza: If the timeline is opened the first time, the connector
        // position must be properly updated.
        //if (this.highlightedPage == page)
        //    return;

        this.highlightedPage = page;

        // Update connector position, but only if the timeline is visible
        if (hasClass(this.rootNode, "opened"))
        {
            var descContainer = getElementByClass(this.rootNode, "pageDescContainer");
            HAR.Page.Timeline.Desc.render(descContainer, pageBar);
        }

        // Update pie graph.
        // xxxHonza: but only if it's visible.
        HAR.Page.Stats.update(page);
    },

    updateDescByPage: function(page)
    {
        var pageBar = this.getPageBar(page);
        if (pageBar)
            this.updateDesc(pageBar);
    },

    getPageBar: function(page)
    {
        if (!this.rootNode)
            return;

        // Iterate over all columns and find the one that represents the page.
        var table = getElementByClass(this.rootNode, "pageTimelineTable");
        var col = table.firstChild.firstChild.firstChild;
        while (col)
        {
            if (col.firstChild.repObject == page)
                return col.firstChild;
            col = col.nextSibling;
        }
    },

    append: function(inputData)
    {
        // If it's not rendered yet, bail out.
        if (!this.rootNode)
            return;

        HAR.log("har; Page timeline, append inputData: ", inputData);

        this.recalcLayout();

        // Otherwise just append a new columns to the existing graph.
        var timelineRow = getElementByClass(this.rootNode, "pageTimelineRow");
        this.graphCols.insertCols({pages: inputData.log.pages}, timelineRow);

        this.updateSelection();
    },

    recalcLayout: function()
    {
        var prevMaxElapsedTime = this.maxElapsedTime; 
        this.maxElapsedTime = 0;

        // Iterate over all pages and find the max load-time so, the vertical
        // graph extent can be set.
        var pages = HAR.Model.getPages();
        for (var i=0; i<pages.length; i++)
        {
            var onLoadTime = pages[i].pageTimings.onLoad;
            if (onLoadTime > 0 && this.maxElapsedTime < onLoadTime)
                this.maxElapsedTime = onLoadTime;
        }

        // Recalculate height of all pages only if there is new maximum.
        if (prevMaxElapsedTime != this.maxElapsedTime)
        {
            var bars = getElementsByClass(this.rootNode, "pageBar");
            for (var i=0; i<bars.length; i++)
                bars[i].style.height = this.getHeight(bars[i].repObject) + "px";
        } 
    },

    removePage: function(page)
    {
        var pageBar = this.getPageBar(page);
        if (!pageBar)
            return;

        var col = pageBar.parentNode;
        col.parentNode.removeChild(col);

        this.recalcLayout();

        if (this.highlightedPage == page)
        {
            this.highlightedPage = null;
            this.updateSelection();
        }

        if (!this.highlightedPage)
        {
            var descBox = getElementByClass(this.rootNode, "pageDescBox");
            descBox.style.visibility = "hidden";
        }
    },

    render: function(parentNode)
    {
        // Render basic structure, use the current model data
        this.rootNode = this.tag.replace({pages: HAR.Model.getPages()}, parentNode);
        this.recalcLayout();
    },

    show: function(animation)
    {
        if (this.isOpened())
            return;

        if (dojo.isIE || !animation)
            this.rootNode.style.display = "block";
        else
            dojo.fx.wipeIn({node: this.rootNode}).play();

        setClass(this.rootNode, "opened");

        HAR.Page.ShowTimeline.update();

        this.updateSelection();
    },

    updateSelection: function()
    {
        // Make sure the description (tooltip) is displayed for the first
        // page automatically.
        if (!this.highlightedPage && HAR.Model.getPages().length > 0)
        {
            var firstPageBar = getElementByClass(this.rootNode, "pageBar");
            if (firstPageBar)
                HAR.Lib.fireEvent(firstPageBar, "mousemove");
        }
    },

    hide: function(animation)
    {
        if (!this.isOpened())
            return;

        if (dojo.isIE || !animation)
            this.rootNode.style.display = "none";
        else
            dojo.fx.wipeOut({node: this.rootNode}).play();

        removeClass(this.rootNode, "opened");

        HAR.Page.ShowTimeline.update();
    },

    isOpened: function()
    {
        return hasClass(this.rootNode, "opened");
    }
});

//-----------------------------------------------------------------------------

HAR.Page.Timeline.Desc = domplate(
{
    tag:
        DIV({"class": "pageDescBox"},
            DIV({"class": "connector"}),
            DIV({"class": "desc"},
                SPAN({"class": "summary"}, "$page|getSummary"),
                SPAN({"class": "time"}, "$page|getTime"),
                SPAN({"class": "title"}, "$page|getTitle"),
                PRE({"class": "comment"}, "$page|getComment")
            )
        ),

    getSummary: function(page)
    {
        var summary = "";
        var onLoad = page.pageTimings.onLoad;
        if (onLoad > 0)
            summary += $STR("label.Page_Load") + ": " + formatTime(onLoad) + ", ";

        var requests = HAR.Model.getPageEntries(page);
        summary += HAR.Tab.Preview.formatRequestCount(requests.length);

        return summary;
    },

    getTime: function(page)
    {
        var pageStart = parseISO8601(page.startedDateTime);
        var date = new Date(pageStart);
        return date.toLocaleString();
    },

    getTitle: function(page)
    {
        return page.title;
    },

    getComment: function(page)
    {
        // HAR 1.2 supports comments.
        return page.comment ? page.comment : "";
    },

    render: function(parentNode, pageBar)
    {
        var page = pageBar.repObject;
        var rootNode = this.tag.replace({page: page}, parentNode);

        var conn = getElementByClass(rootNode, "connector");
        conn.style.marginLeft = pageBar.parentNode.offsetLeft + "px";
    }
});

//-----------------------------------------------------------------------------

/**
 * Button template.
 */
HAR.Page.ShowTimeline = domplate(
{
    tag:
        SPAN({"class": "harShowTimeline harButton text", onclick: "$onToggle"},
            $STR("button.Show_Page_Timeline")
        ),

    update: function()
    {
        var opened = HAR.Tab.Preview.timeline.isOpened();

        // xxxHonza: the button should not be global.
        var button = getElementByClass(document.documentElement, "harShowTimeline")
        button.innerHTML = opened ? $STR("button.Hide_Page_Timeline") :
            $STR("button.Show_Page_Timeline");
    },

    onToggle: function(event)
    {
        var e = HAR.eventFix(event || window.event);
        cancelEvent(event);

        var button = e.target;
        if (!hasClass(button, "harButton"))
            return;

        var timeline = HAR.Tab.Preview.timeline;
        var opened = timeline.isOpened();
        if (opened)
            timeline.hide(true);
        else
            timeline.show(true);

        setCookie("timeline", !opened);
    }
});

//-----------------------------------------------------------------------------
}}});
