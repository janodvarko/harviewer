/* See license.txt for terms of usage */

HAR.ns(function() { with (Domplate) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

/**
 * This object represents a template for list of pages.
 * This list is displayed within the Preview tab. 
 */
HAR.Rep.PageList = domplate(
{
    tableTag:
        TABLE({"class": "pageTable", cellpadding: 0, cellspacing: 0, onclick: "$onClick"},
            TBODY(
                TAG("$rowTag", {groups: "$groups"})
            )
        ),

    rowTag:
        FOR("group", "$groups",
            TR({"class": "pageRow", _repObject: "$group"},
                TD({"class": "groupName pageCol"},
                    SPAN({"class": "pageName"},
                        "$group|getPageTitle"
                    ),
                    SPAN("&nbsp;"),
                    SPAN({"class": "pageID"},
                        "$group|getPageID"
                    ),
                    SPAN({"class": "pageRemoveAction link",
                        onclick: "$onRemove"},
                        SPAN("Remove")
                    )
                )
            )
        ),

    bodyTag:
        TR({"class": "pageInfoRow"},
            TD({"class": "pageInfoCol"})
        ),

    getPageTitle: function(page) 
    {
        return page.title;
    },

    getPageID: function(page)
    {
        return "[" + page.id + "]";
    },

    onClick: function(event)
    {
        var e = HAR.eventFix(event || window.event);
        if (isLeftClick(event)) 
        {
            var row = getAncestorByClass(e.target, "pageRow");
            if (row) 
            {
                this.toggleRow(row);
                cancelEvent(event);
            }
        }
    },

    expandGroup: function(row)
    {
        if (hasClass(row, "pageRow"))
            this.toggleRow(row, true);
    },

    collapseGroup: function(row)
    {
        if (hasClass(row, "pageRow", "opened"))
            this.toggleRow(row);
    },

    toggleRow: function(row, forceOpen)
    {
        var opened = hasClass(row, "opened");
        if (opened && forceOpen)
            return;

        toggleClass(row, "opened");
        if (hasClass(row, "opened"))
        {
            var page = row.repObject;
            if (!page)
                return;

            var netInfoRow = this.bodyTag.insertRows({}, row)[0];
            HAR.Tab.Preview.buildPageContent(netInfoRow.firstChild, page);
        }
        else
        {
            var infoBodyRow = row.nextSibling;
            if (infoBodyRow)
                row.parentNode.removeChild(infoBodyRow);
        }
    },

    onRemove: function(event)
    {
        var e = HAR.eventFix(event || window.event);
        cancelEvent(event);

        var row = getAncestorByClass(e.target, "pageRow");

        // Collapse if expanded
        if (hasClass(row, "opened"))
            this.toggleRow(row);

        // Remove the page-row
        row.parentNode.removeChild(row);

        // Regenerate JSON string.
        var page = row.repObject;
        var newData = HAR.Model.removePage(page);
        var sourceEditor = HAR.$("sourceEditor");
        sourceEditor.value = dojo.toJson(newData, true);

        // DOM tab must be regenerated
        var tabDOMBody = getElementByClass(document.documentElement, "tabDOMBody");
        tabDOMBody.updated = false;
    }
});

//-----------------------------------------------------------------------------
}}});
