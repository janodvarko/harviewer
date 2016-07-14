/* See license.txt for terms of usage */

/**
 * @module domplate/tabView
 */
define("domplate/tabView", [
    "domplate/domplate",
    "core/lib",
    "core/trace"
],

function(Domplate, Lib, Trace) {

var domplate = Domplate.domplate;
var A = Domplate.A;
var DIV = Domplate.DIV;
var TABLE = Domplate.TABLE;
var TAG = Domplate.TAG;
var TBODY = Domplate.TBODY;
var TD = Domplate.TD;
var TR = Domplate.TR;

//*************************************************************************************************

/**
 * @domplate TabViewTempl is a template used by {@link TabView} widget.
 */
var TabViewTempl = domplate(
/** @lends TabViewTempl */
{
    tag:
        TABLE({"class": "tabView", cellpadding: 0, cellspacing: 0,
            _repObject: "$tabView"},
            TBODY(
                TR({"class": "tabViewRow"},
                    TD({"class": "tabViewCol", valign: "top"},
                        TAG("$tabList", {tabView: "$tabView"})
                    )
                )
            )
        ),

    tabList:
        DIV({"class": "tabViewBody", onclick: "$onClickTab"},
            DIV({"class": "$tabView.id\\Bar tabBar"}),
            DIV({"class": "$tabView.id\\Bodies tabBodies"})
        ),

    tabHeaderTag:
        A({"class": "$tab.id\\Tab tab",
            title: "$tab|getTitle",
            view: "$tab.id", _repObject: "$tab"},
            "$tab.label"
        ),

    tabBodyTag:
        DIV({"class": "tab$tab.id\\Body tabBody", _repObject: "$tab"}),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Event Handlers

    hideTab: function(context)
    {
        return false;
    },

    onClickTab: function(event)
    {
        var e = Lib.fixEvent(event);
        var tabView = this.getTabView(e.target);
        tabView.onClickTab(e);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Coupling with TabView instance.

    getTabView: function(node)
    {
        var tabView = Lib.getAncestorByClass(node, "tabView");
        return tabView.repObject;
    },

    getTitle: function(tab)
    {
        return tab.title || "";
    }
});

//*************************************************************************************************

function TabView(id)
{
    this.id = id;
    this.tabs = [];
    this.listeners = [];
    this.tabBarVisibility = true;
}

/**
 * @widget TabView represents a widget for tabbed UI interface.
 */
TabView.prototype =
/** @lends TabView */
{
    appendTab: function(tab)
    {
        this.tabs.push(tab);
        tab.tabView = this;
        return tab;
    },

    removeTab: function(tabId)
    {
        for (var i = 0; i < this.tabs.length; i++) {
            var tab = this.tabs[i];
            if (tab.id === tabId) {
                this.tabs.splice(i, 1);
                break;
            }
        }
    },

    getTab: function(tabId)
    {
        for (var i = 0; i < this.tabs.length; i++) {
            var tab = this.tabs[i];
            if (tab.id === tabId) {
                return tab;
            }
        }
    },

    selectTabByName: function(tabId)
    {
        var tab = Lib.getElementByClass(this.element, tabId + "Tab");
        if (tab)
            this.selectTab(tab);
    },

    showTabBar: function(show)
    {
        if (this.element)
        {
            if (show)
                this.element.removeAttribute("hideTabBar");
            else
                this.element.setAttribute("hideTabBar", "true");
        }
        else
        {
            this.tabBarVisibility = show;
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

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    // xxxHonza: this should be private.
    onClickTab: function(e)
    {
        var tab = Lib.getAncestorByClass(e.target, "tab");
        if (tab)
            this.selectTab(tab);
    },

    selectTab: function(tab)
    {
        if (!Lib.hasClass(tab, "tab"))
            return;

        if (Lib.hasClass(tab, "selected") && tab._updated)
            return;

        var view = tab.getAttribute("view");

        // xxxHonza: this is null if the user clicks on an example on the home page.
        if (!view)
            return;

        var viewBody = Lib.getAncestorByClass(tab, "tabViewBody");

        // Deactivate current tab.
        if (viewBody.selectedTab)
        {
            viewBody.selectedTab.removeAttribute("selected");
            viewBody.selectedBody.removeAttribute("selected");

            // IE workaround. Removing the "selected" attribute
            // doesn't update the style (associated using attribute selector).
            // So use a class name instead.
            Lib.removeClass(viewBody.selectedTab, "selected");
            Lib.removeClass(viewBody.selectedBody, "selected");
        }

        // Store info about new active tab. Each tab has to have a body,
        // which is identified by class.
        var tabBody = Lib.getElementByClass(viewBody, "tab" + view + "Body");
        if (!tabBody)
            Trace.error("TabView.selectTab; Missing tab body", tab);

        viewBody.selectedTab = tab;
        viewBody.selectedBody = tabBody;

        // Activate new tab.
        viewBody.selectedTab.setAttribute("selected", "true");
        viewBody.selectedBody.setAttribute("selected", "true");

        // IE workaround. Adding the "selected" attribute doesn't
        // update the style. Use class name instead.
        Lib.setClass(viewBody.selectedBody, "selected");
        Lib.setClass(viewBody.selectedTab, "selected");

        this.updateTabBody(viewBody, view);
    },

    // xxxHonza: should be private
    updateTabBody: function(viewBody, view)
    {
        var tab = viewBody.selectedTab.repObject;
        if (tab._body._updated)
            return;

        tab._body._updated = true;

        // Render default content if available.
        if (tab.bodyTag)
            tab.bodyTag.replace({tab: tab}, tab._body);

        // Call also onUpdateBody for dynamic body update.
        if (tab && tab.onUpdateBody)
            tab.onUpdateBody(this, tab._body);

        // Dispatch to all listeners.
        for (var i=0; i<this.listeners.length; i++)
        {
            var listener = this.listeners[i];
            if (listener.onUpdateBody)
                listener.onUpdateBody(this, tab._body);
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    render: function(parentNode)
    {
        this.element = TabViewTempl.tag.replace({tabView: this}, parentNode, TabViewTempl);
        Lib.setClass(this.element, this.id);

        this.showTabBar(this.tabBarVisibility);

        for (var i = 0; i < this.tabs.length; i++)
        {
            var tab = this.tabs[i];
            var tabHeaderTag = tab.tabHeaderTag ? tab.tabHeaderTag : TabViewTempl.tabHeaderTag;
            var tabBodyTag = tab.tabBodyTag ? tab.tabBodyTag : TabViewTempl.tabBodyTag;

            try
            {
                tab._header = tabHeaderTag.append({tab:tab}, Lib.$(parentNode, "tabBar"));
                tab._body = tabBodyTag.append({tab:tab}, Lib.$(parentNode, "tabBodies"));
            }
            catch (e)
            {
                Trace.exception("TabView.appendTab; Exception ", e);
            }
        }

        return this.element;
    }
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

TabView.Tab = function() {};
TabView.Tab.prototype =
{
    invalidate: function()
    {
        this._updated = false;
    },

    select: function()
    {
        this.tabView.selectTabByName(this.id);
    }
};

return TabView;

// ************************************************************************************************
});
