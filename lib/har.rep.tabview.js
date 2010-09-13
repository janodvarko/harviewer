/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Domplate) {

// ************************************************************************************************

/**
 * Basic TabView implementation. This object is used as a base for all 
 * tab views.
 */
HAR.Rep.TabView = domplate(HAR.Rep,
{
    listeners: [],

    tag:
        TABLE({"class": "tabView", cellpadding: 0, cellspacing: 0},
            TBODY(
                TR({"class": "tabViewRow"},
                    TD({"class": "tabViewCol", valign: "top"},
                        TAG("$tabList")
                    )
                )
            )
        ),

    tabList:
        DIV({"class": "tabViewBody", onclick: "$onClickTab"},
            DIV({"class": "tabBar"}),
            DIV({"class": "tabBodies"})
        ),

    tabHeaderTag:
        A({"class": "$tab.id\\Tab tab",
            view: "$tab.id", _repObject: "$tab"},
            "$tab.label"
        ),

    tabBodyTag:
        DIV({"class": "tab$tab.id\\Body tabBody", _repObject: "$tab"}),

    hideTab: function(context)
    {
        return false;
    },

    onClickTab: function(event)
    {
        var e = HAR.eventFix(event || window.event);
        var tab = HAR.Lib.getAncestorByClass(e.target, "tab");
        if (tab)
            this.selectTab(tab);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    selectTabByName: function(tabView, tabName)
    {
        var tab = HAR.Lib.getElementByClass(tabView, tabName + "Tab");
        if (tab)
            this.selectTab(tab);
    },

    selectTab: function(tab)
    {
        if (!HAR.Lib.hasClass(tab, "tab"))
            return;

        var view = tab.getAttribute("view");

        // xxxHonza: this is null if the user clicks on an example on the home page.
        if (!view)
            return;

        var viewBody = HAR.Lib.getAncestorByClass(tab, "tabViewBody");

        // Deactivate current tab.
        if (viewBody.selectedTab)
        {
            viewBody.selectedTab.removeAttribute("selected");
            viewBody.selectedBody.removeAttribute("selected");

            // xxxHonza: IE workaround. Removing the "selected" attribute
            // doesn't update the style (associated using attribute selector).
            // So use a class name instead.
            HAR.Lib.removeClass(viewBody.selectedTab, "selected");
            HAR.Lib.removeClass(viewBody.selectedBody, "selected");
        }

        // Store info about new active tab. Each tab has to have a body, 
        // which is identified by class.
        var tabBody = HAR.Lib.getElementByClass(viewBody, "tab" + view + "Body");
        if (!tabBody)
            HAR.error("TabView.selectTab; Missing tab body", tab);

        viewBody.selectedTab = tab;
        viewBody.selectedBody = tabBody;

        // Activate new tab.
        viewBody.selectedTab.setAttribute("selected", "true");
        viewBody.selectedBody.setAttribute("selected", "true");

        // xxxHonza: IE workaround. Adding the "selected" attribute doesn't
        // update the style. Use class name instead.
        HAR.Lib.setClass(viewBody.selectedBody, "selected");
        HAR.Lib.setClass(viewBody.selectedTab, "selected");

        this.updateTabBody(viewBody, view);
    },

    appendTab: function(parentNode, tab)
    {
        var tabHeaderTag = tab.tabHeaderTag ? tab.tabHeaderTag : this.tabHeaderTag;
        var tabBodyTag = tab.tabBodyTag ? tab.tabBodyTag : this.tabBodyTag;

        try
        {
            tabHeaderTag.append({tab:tab}, HAR.Lib.getElementByClass(parentNode, "tabBar"));
            tabBodyTag.append({tab:tab}, HAR.Lib.getElementByClass(parentNode, "tabBodies"));
        }
        catch (e)
        {
            exception("TabView.appendTab; Exception ", e);
        }
    },

    updateTabBody: function(viewBody, view)
    {
        var tab = viewBody.selectedTab;
        var repObject = tab ? tab.repObject : null;

        if (repObject && repObject.onUpdateTabBody)
            repObject.onUpdateTabBody(viewBody, view, repObject);

        for (var i=0; i<this.listeners.length; i++) {
            var listener = this.listeners[i];
            if (listener.onUpdateTabBody)
                listener.onUpdateTabBody(viewBody, view, repObject);
        }
    },

    appendUpdateListener: function(listener)
    {
        this.listeners.push(listener);
    },

    removeUpdateListener: function(listener)
    {
        remove(this.listeners, listener);
    },

    render: function(obj, parentNode)
    {
        return this.tag.replace(obj, parentNode, this);
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

HAR.TabView = function()
{
    this.tabs = [];
}

HAR.TabView.prototype =
{
    selectTabByName: function(name)
    {
        var tab = HAR.Rep.TabView.selectTabByName(this.element, name);
        return tab ? tab.repObject : null;
    },

    getTab: function(name)
    {
        var tab = HAR.Lib.getElementByClass(this.element, tabName + "Tab");
        return tab ? tab.repObject : null;
    },

    appendTab: function(tab)
    {
        this.tabs.push(tab);
    },

    render: function(parentNode)
    {
        this.element = HAR.Rep.TabView.render({}, parentNode);
        for (var i in this.tabs)
        {
            var tab = this.tabs[i];
            tab.label = tab.label ? HAR.Lib.$STR(tab.label) : tab.label;
            HAR.Rep.TabView.appendTab(this.element, tab);
        }
        return this.element;
    }
}

// ************************************************************************************************
}});
