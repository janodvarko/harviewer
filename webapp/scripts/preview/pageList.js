/* See license.txt for terms of usage */

require.def("preview/pageList", [
    "domplate/domplate",
    "core/lib",
    "core/trace",
    "preview/requestList"
],

function(Domplate, Lib, Trace, RequestList) { with (Domplate) {

//*************************************************************************************************
// Page List

function PageList(input)
{
    this.input = input;
}

/**
 * @domplate This object represents a template for list of pages.
 * This list is displayed within the Preview tab. 
 */
PageList.prototype = domplate(
/** @lends PageList */
{
    tableTag:
        TABLE({"class": "pageTable", cellpadding: 0, cellspacing: 0,
            onclick: "$onClick", _repObject: "$input"},
            TBODY(
                TAG("$rowTag", {groups: "$input.log.pages"})
            )
        ),

    rowTag:
        FOR("group", "$groups",
            TR({"class": "pageRow", _repObject: "$group"},
                TD({"class": "groupName pageCol"},
                    SPAN({"class": "pageName"}, "$group|getPageTitle")
                )
            )
        ),

    bodyTag:
        TR({"class": "pageInfoRow", style: "height:auto;"},
            TD({"class": "pageInfoCol"})
        ),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Events & Callbacks

    getPageTitle: function(page)
    {
        return Lib.cropString(page.title, 100);
    },

    getPageID: function(page)
    {
        return "[" + page.id + "]";
    },

    onClick: function(event)
    {
        var e = $.event.fix(event || window.event);
        if (Lib.isLeftClick(event)) 
        {
            var row = Lib.getAncestorByClass(e.target, "pageRow");
            if (row) 
            {
                this.toggleRow(row);
                Lib.cancelEvent(event);
            }
        }
    },

    toggleRow: function(row, forceOpen)
    {
        var opened = Lib.hasClass(row, "opened");
        if (opened && forceOpen)
            return;

        Lib.toggleClass(row, "opened");
        if (Lib.hasClass(row, "opened"))
        {
            var infoBodyRow = this.bodyTag.insertRows({}, row)[0];

            // Build request list for the expanded page.
            var requestList = new RequestList(this.input);

            // Dynamically append custom registered page timings.
            var pageTimings = PageList.prototype.pageTimings;
            for (var i=0; i<pageTimings.length; i++)
                requestList.addPageTiming(pageTimings[i]);

            requestList.render(infoBodyRow.firstChild, row.repObject);
        }
        else
        {
            var infoBodyRow = row.nextSibling;
            row.parentNode.removeChild(infoBodyRow);
        }
    },

    expandAll: function(pageList)
    {
        var row = pageList.firstChild.firstChild;
        while (row)
        {
            if (hasClass(row, "pageRow"))
                this.toggleRow(row, true);
            row = row.nextSibling;
        }
    },

    getPageRow: function(page)
    {
        var pageList = this.element.parentNode;
        var rows = Lib.getElementsByClass(pageList, "pageRow");
        for (var i=0; i<rows.length; i++)
        {
            var row = rows[i];
            if (row.repObject == page)
                return row;
        }
    },

    togglePage: function(page)
    {
        var row = this.getPageRow(page);
        this.toggleRow(row);
    },

    expandPage: function(page)
    {
        var row = this.getPageRow(page);
        this.toggleRow(row, true);
    },

    collapsePage: function(page)
    {
        var row = this.getPageRow(page);
        if (Lib.hasClass(row, "opened"))
            this.toggleRow(row);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Public

    append: function(parentNode)
    {
        // According to the spec, network requests doesn't have to be 
        // associated with the parent page. This is to support even
        // tools that can't get this info.
        // Also if log files are merged there can be some requests not
        // associated with any page. Make sure these are displayed too. 
        var requestList = new RequestList(this.input);
        requestList.render(parentNode, null);

        // If there are any pages, build regular page list.
        var pages = this.input.log.pages;
        if (pages && pages.length)
        {
            // Build the page list.
            var table = this.tableTag.append({input: this.input}, parentNode, this);

            // Expand appended page by default, but only if there is only one page.
            // Note that there can be more page-lists (pageTable elements)
            if (table.firstChild.childNodes.length == 1 && table.parentNode.childNodes.length == 1)
                this.toggleRow(table.firstChild.firstChild);
        }
    },

    render: function(parentNode)
    {
        this.append(parentNode);
    }
});

//*************************************************************************************************

// Custom registered page timings, displayed as vertical lines over individual requests
// in the first phase.
PageList.prototype.pageTimings = [];

//*************************************************************************************************

return PageList;

//*************************************************************************************************
}});
