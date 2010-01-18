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
            TR({"class": "pageRow", _repObject: "$group", onmousemove: "$onMouseMove"},
                TD({"class": "groupName pageCol"},
                    SPAN({"class": "pageName"}, "$group|getPageTitle" ),
                    SPAN({"class": "pageRemoveAction", title: "Remove Page",
                        onclick: "$onRemove"}
                    )
                )
            )
        ),

    bodyTag:
        TR({"class": "pageInfoRow", style: "height:auto;display:none;"},
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

        // Remove from model.
        var page = row.repObject;
        var newData = HAR.Model.removePage(page);

        // Remove from timeline and update stats.
        HAR.Tab.Preview.timeline.removePage(page);
        HAR.Tab.Preview.stats.update(HAR.Tab.Preview.timeline.highlightedPage);

        // DOM tab must be regenerated
        var tabDOMBody = getElementByClass(document.documentElement, "tabDOMBody");
        if (tabDOMBody)
            tabDOMBody.updated = false;
    },

    onMouseMove: function(event)
    {
        var e = HAR.eventFix(event || window.event);
        cancelEvent(event);

        // This seems to be not useful.
        //var pageRow = getAncestorByClass(e.target, "pageRow");
        //HAR.Tab.Preview.timeline.updateDescByPage(pageRow.repObject);
    },

    toggleRow: function(row, forceOpen)
    {
        var opened = hasClass(row, "opened");
        if (opened && forceOpen)
            return;

        //xxxHonza: the dojo wipeIn and Out effect doesn't work.
        toggleClass(row, "opened");
        if (hasClass(row, "opened"))
        {
            var infoBodyRow = this.bodyTag.insertRows({}, row)[0];
            HAR.Tab.Preview.buildPageContent(infoBodyRow.firstChild, row.repObject);
            dojo.fx.wipeIn({node: infoBodyRow}).play();
        }
        else
        {
            var infoBodyRow = row.nextSibling;
            dojo.fx.wipeOut({node: infoBodyRow}).play();
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
        var rows = getElementsByClass(this.rootNode, "pageRow");
        for (var i=0; i<rows.length; i++)
        {
            var row = rows[i];
            if (row.repObject == page)
                return row;
        }
    },

    render: function(inputData, parentNode)
    {
        this.rootNode = this.tableTag.append({groups: inputData}, parentNode);
        return this.rootNode;
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
        if (hasClass(row, "opened"))
            this.toggleRow(row);
    }
});

//-----------------------------------------------------------------------------
}}});
