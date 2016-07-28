/* See license.txt for terms of usage */

define("preview/pageList", [
    "domplate/domplate",
    "core/lib",
    "core/trace",
    "core/cookies",
    "preview/requestList",
    "i18n!nls/pageList",
    "domplate/popupMenu"
],

function(Domplate, Lib, Trace, Cookies, RequestList, Strings, Menu) {

var domplate = Domplate.domplate;
var DIV = Domplate.DIV;
var FOR = Domplate.FOR;
var SPAN = Domplate.SPAN;
var TABLE = Domplate.TABLE;
var TAG = Domplate.TAG;
var TBODY = Domplate.TBODY;
var TD = Domplate.TD;
var TR = Domplate.TR;

// ********************************************************************************************* //
// Page List

function PageList(input)
{
    this.input = input;
    this.listeners = [];
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
                TD({"class": "groupName pageCol", width: "1%"},
                    SPAN({"class": "pageName"}, "$group|getPageTitle")
                ),
                TD({"class": "netOptionsCol netCol", width: "15px"},
                    DIV({"class": "netOptionsLabel netLabel", onclick: "$onOpenOptions"})
                )
            )
        ),

    bodyTag:
        TR({"class": "pageInfoRow", style: "height:auto;"},
            TD({"class": "pageInfoCol", colspan: 2})
        ),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
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
        var e = Lib.fixEvent(event);
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

        var infoBodyRow;

        Lib.toggleClass(row, "opened");
        if (Lib.hasClass(row, "opened"))
        {
            infoBodyRow = this.bodyTag.insertRows({}, row)[0];

            // Build request list for the expanded page.
            var requestList = this.createRequestList();

            // Dynamically append custom registered page timings.
            var pageTimings = PageList.prototype.pageTimings;
            for (var i=0; i<pageTimings.length; i++)
                requestList.addPageTiming(pageTimings[i]);

            requestList.render(infoBodyRow.firstChild, row.repObject);
        }
        else
        {
            infoBodyRow = row.nextSibling;
            row.parentNode.removeChild(infoBodyRow);
        }
    },

    expandAll: function(pageList)
    {
        var row = pageList.firstChild.firstChild;
        while (row)
        {
            if (Lib.hasClass(row, "pageRow"))
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
            if (row.repObject === page)
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

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Customize Columns

    onOpenOptions: function(event)
    {
        var e = Lib.fixEvent(event);
        Lib.cancelEvent(event);

        if (!Lib.isLeftClick(event))
            return;

        var target = e.target;

        // Collect all menu items.
        var row = Lib.getAncestorByClass(target, "pageRow");
        var items = this.getMenuItems(row.repObject);

        // Finally, display the the popup menu.
        // xxxHonza: the old <DIV> can be still visible.
        var menu = new Menu({id: "requestContextMenu", items: items});
        menu.showPopup(target);
    },

    getMenuItems: function(row)
    {
        // Get list of columns as string for quick search.
        var cols = RequestList.getVisibleColumns().join();

        // You can't hide the last visible column.
        var lastVisibleIndex;
        var visibleColCount = 0;

        var items = [];
        for (var i=0; i<RequestList.columns.length; i++)
        {
            var colName = RequestList.columns[i];
            var visible = (cols.indexOf(colName) > -1);

            items.push({
                label: Strings["column.label." + colName],
                type: "checkbox",
                checked: visible,
                command: Lib.bindFixed(this.onToggleColumn, this, colName)
            });

            if (visible)
            {
                lastVisibleIndex = i;
                visibleColCount++;
            }
        }

        // If the last column is visible, disable its menu item.
        if (visibleColCount === 1)
            items[lastVisibleIndex].disabled = true;

        items.push("-");
        items.push({
            label: Strings["action.label.Reset"],
            command: Lib.bindFixed(this.updateColumns, this)
        });

        return items;
    },

    onToggleColumn: function(name)
    {
        // Try to remove the column from the array, if not presented append it.
        var cols = RequestList.getVisibleColumns();
        if (!Lib.remove(cols, name))
            cols.push(name);

        // Update Cookies and UI
        this.updateColumns(cols);
    },

    updateColumns: function(cols)
    {
        if (!cols)
            cols = RequestList.defaultColumns;

        RequestList.setVisibleColumns(cols);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Helpers

    createRequestList: function()
    {
        var requestList = new RequestList(this.input);
        requestList.listeners = this.listeners;
        return requestList;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Public

    append: function(parentNode)
    {
        // According to the spec, network requests doesn't have to be
        // associated with the parent page. This is to support even
        // tools that can't get this info.
        // Also if log files are merged there can be some requests not
        // associated with any page. Make sure these are displayed too.
        var requestList = this.createRequestList();
        requestList.render(parentNode, null);

        // If there are any pages, build regular page list.
        var pages = this.input.log.pages;
        if (pages && pages.length)
        {
            // Build the page list.
            var table = this.tableTag.append({input: this.input}, parentNode, this);

            // List of pages within one HAR log
            var pageRows = Lib.getElementsByClass(table, "pageRow");

            // List of HAR logs
            var pageTables = Lib.getElementsByClass(parentNode, "pageTable");

            // Expand appended page by default only if there is only one page.
            // Note that there can be more page-lists (pageTable elements)
            if (pageRows.length === 1 && pageTables.length === 1)
                this.toggleRow(pageRows[0]);

            // If 'expand' parameter is specified expand all by default.
            var expand = Lib.getURLParameter("expand");
            if (expand)
                this.expandAll(table);
        }
    },

    render: function(parentNode)
    {
        this.append(parentNode);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Listeners

    addListener: function(listener)
    {
        this.listeners.push(listener);
    },

    removeListener: function(listener)
    {
        Lib.remove(this.listeners, listener);
    }
});

// ********************************************************************************************* //

// Custom registered page timings, displayed as vertical lines over individual requests
// in the first phase.
PageList.prototype.pageTimings = [];

// ********************************************************************************************* //

return PageList;

// ********************************************************************************************* //
});
