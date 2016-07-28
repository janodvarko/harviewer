/* See license.txt for terms of usage */

/**
 * @module tabs/pageTimeline
 */
define("tabs/pageTimeline", [
    "domplate/domplate",
    "core/lib",
    "core/trace",
    "i18n!nls/pageTimeline",
    "preview/harModel"
],

function(Domplate, Lib, Trace, Strings, HarModel) {

var domplate = Domplate.domplate;
var DIV = Domplate.DIV;
var FOR = Domplate.FOR;
var PRE = Domplate.PRE;
var SPAN = Domplate.SPAN;
var TABLE = Domplate.TABLE;
var TAG = Domplate.TAG;
var TBODY = Domplate.TBODY;
var TD = Domplate.TD;
var TR = Domplate.TR;

//*************************************************************************************************

var Selection =
{
    isSelected: function(bar)
    {
        return Lib.hasClass(bar, "selected");
    },

    toggle: function(bar)
    {
        Lib.toggleClass(bar, "selected");
    },

    select: function(bar)
    {
        if (!this.isSelected(bar))
            Lib.setClass(bar, "selected");
    },

    unselect: function(bar)
    {
        if (this.isSelected(bar))
            Lib.removeClass(bar, "selected");
    },

    getSelection: function(row)
    {
        var pages = [];
        var bars = Lib.getElementsByClass(row, "pageBar");
        for (var i=0; i<bars.length; i++)
        {
            var bar = bars[i];
            if (this.isSelected(bar))
                pages.push(bar.page);
        }
        return pages;
    },

    unselectAll: function(row, except)
    {
        var bars = Lib.getElementsByClass(row, "pageBar");
        for (var i=0; i<bars.length; i++)
        {
            if (except !== bars[i])
                this.unselect(bars[i]);
        }
    }
};

//*************************************************************************************************
// Timeline

/**
 * Represents a list of pages displayed as a list of vertical graphs. this object
 * is implemented as a template so, it can render itself.
 */
function Timeline()
{
    this.listeners = [];
    this.element = null;
    this.maxElapsedTime = -1;

    // List of all selected bars.
    this.lastSelectedBar = null;
}

Timeline.prototype = domplate(
{
    graphCols:
        FOR("page", "$input|getPages",
            TD({"class": "pageTimelineCol"},
                DIV({"class": "pageBar", _input: "$input", _page: "$page",
                    title: Strings.pageBarTooltip,
                    style: "height: $page|getHeight\\px",
                    onmousemove: "$onMouseMove",
                    onclick: "$onClick"})
            )
        ),

    pageGraph:
        TABLE({"class": "pageTimelineTable", cellpadding: 0, cellspacing: 0},
            TBODY(
                TR({"class": "pageTimelineRow"},
                    TAG("$graphCols", {input: "$input"})
                )
            )
        ),

    tag:
        DIV({"class": "pageTimelineBody", style: "height: auto; display: none"},
            TABLE({style: "margin: 7px;", cellpadding: 0, cellspacing: 0},
                TBODY(
                    TR(
                        TD(
                            TAG("$pageGraph", {input: "$input"})
                        )
                    ),
                    TR(
                        TD({"class": "pageDescContainer", colspan: 2})
                    )
                )
            )
        ),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    getHeight: function(page)
    {
        var height = 1;
        var onLoad = page.pageTimings.onLoad;
        if (onLoad > 0 && this.maxElapsedTime > 0)
            height = Math.round((onLoad / this.maxElapsedTime) * 100);

        return Math.max(1, height);
    },

    onClick: function(event)
    {
        var e = Lib.fixEvent(event);

        var bar = e.target;
        if (!Lib.hasClass(bar, "pageBar"))
            return;

        var control = Lib.isControlClick(e);
        var shift = Lib.isShiftClick(e);

        var row = Lib.getAncestorByClass(bar, "pageTimelineRow");

        // If no modifier is active remove the current selection.
        if (!control && !shift)
            Selection.unselectAll(row, bar);

        // Clicked bar toggles its selection state
        Selection.toggle(bar);

        this.selectionChanged();
    },

    onMouseMove: function(event)
    {
        var e = Lib.fixEvent(event);

        // If the mouse moves over a bar, update a description displayed below and
        // notify all registered listeners.
        var bar = e.target;
        if (!Lib.hasClass(bar, "pageBar"))
            return;

        if (this.highlightedPage === bar.page)
            return;

        this.highlightedPage = bar.page;

        var parentNode = Lib.getElementByClass(this.element, "pageDescContainer");
        Timeline.Desc.render(parentNode, bar);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    getPages: function(input)
    {
        return input.log.pages ? input.log.pages : [];
    },

    getPageBar: function(page)
    {
        if (!this.element)
            return;

        // Iterate over all columns and find the one that represents the page.
        var table = Lib.getElementByClass(this.element, "pageTimelineTable");
        var col = table.firstChild.firstChild.firstChild;
        while (col)
        {
            if (col.firstChild.page === page)
                return col.firstChild;
            col = col.nextSibling;
        }
    },

    recalcLayout: function()
    {
        this.maxElapsedTime = 0;
        var prevMaxElapsedTime = this.maxElapsedTime;

        // Iterate over all pages and find the max load-time so, the vertical
        // graph extent can be set.
        var bars = Lib.getElementsByClass(this.element, "pageBar");
        for (var i=0; i<bars.length; i++)
        {
            var page = bars[i].page;
            var onLoadTime = page.pageTimings.onLoad;
            if (onLoadTime > 0 && this.maxElapsedTime < onLoadTime)
                this.maxElapsedTime = onLoadTime;
        }

        // Recalculate height of all pages only if there is a new maximum.
        if (prevMaxElapsedTime !== this.maxElapsedTime)
        {
            for (var j=0; j<bars.length; j++)
                bars[j].style.height = this.getHeight(bars[j].page) + "px";
        }
    },

    updateDesc: function()
    {
        if (!this.isVisible())
            return;

        // Make sure the description (tooltip) is displayed for the first
        // page automatically.
        if (!this.highlightedPage)
        {
            var firstBar = Lib.getElementByClass(this.element, "pageBar");
            if (firstBar)
                Lib.fireEvent(firstBar, "mousemove");
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Listeners

    addListener: function(listener)
    {
        this.listeners.push(listener);
    },

    removeListener: function(listener)
    {
        Lib.remove(this.listeners, listener);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Selection

    selectionChanged: function()
    {
        // Notify listeners such as the statistics preview
        var pages = this.getSelection();
        Lib.dispatch(this.listeners, "onSelectionChange", [pages]);
    },

    removeSelection: function()
    {
        if (!this.element)
            return;

        var row = Lib.getElementByClass(this.element, "pageTimelineRow");
        Selection.unselectAll(row);

        this.selectionChanged();
    },

    getSelection: function()
    {
        if (!this.isVisible())
            return [];

        var row = Lib.getElementByClass(this.element, "pageTimelineRow");
        return Selection.getSelection(row);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Public

    show: function(animation)
    {
        if (this.isVisible())
            return;

        if (!animation)
            this.element.style.display = "block";
        else
            $(this.element).slideDown();

        Lib.setClass(this.element, "opened");
        this.updateDesc();
    },

    hide: function(animation)
    {
        if (!this.isVisible())
            return;

        if (!animation)
            this.element.style.display = "none";
        else
            $(this.element).slideUp();

        Lib.removeClass(this.element, "opened");

        // Remove all selecteed page and so, the stats can update.
        this.removeSelection();
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
        // Render basic structure. Some pages could be rendered now, but let's
        // do it in the append method.
        this.element = this.tag.replace({input: {log: {pages: []}}}, parentNode, this);
        this.recalcLayout();
        return this.element;
    },

    append: function(input, parentNode)
    {
        // If it's not rendered yet, bail out.
        if (!this.element)
            return;

        // Otherwise just append a new columns to the existing graph.
        var timelineRow = Lib.getElementByClass(this.element, "pageTimelineRow");
        this.graphCols.insertCols({input: input}, timelineRow, this);

        this.recalcLayout();
        this.updateDesc();
    }
});

//*************************************************************************************************
// Timeline Description

Timeline.Desc = domplate(
{
    tag:
        DIV({"class": "pageDescBox"},
            DIV({"class": "connector"}),
            DIV({"class": "desc"},
                SPAN({"class": "summary"}, "$object|getSummary"),
                SPAN({"class": "time"}, "$object.page|getTime"),
                SPAN({"class": "title"}, "$object.page|getTitle"),
                PRE({"class": "comment"}, "$object.page|getComment")
            )
        ),

    getSummary: function(object)
    {
        var summary = "";
        var onLoad = object.page.pageTimings.onLoad;
        if (onLoad > 0)
            summary += Strings.pageLoad + ": " + Lib.formatTime(onLoad.toFixed(2)) + ", ";

        var requests = HarModel.getPageEntries(object.input, object.page);
        var count = requests.length;
        summary += count + " " + (count === 1 ? Strings.request : Strings.requests);

        return summary;
    },

    getTime: function(page)
    {
        var pageStart = Lib.parseISO8601(page.startedDateTime);
        var date = new Date(pageStart);
        return date.toLocaleString();
    },

    getTitle: function(page)
    {
        return page.title;
    },

    getComment: function(page)
    {
        return page.comment ? page.comment : "";
    },

    render: function(parentNode, bar)
    {
        var object = {
            input: bar.input,
            page: bar.page
        };

        var element = this.tag.replace({object: object}, parentNode);
        var conn = Lib.$(element, "connector");
        conn.style.marginLeft = bar.parentNode.offsetLeft + "px";
        return element;
    }
});

//*************************************************************************************************

return Timeline;

//*************************************************************************************************
});
