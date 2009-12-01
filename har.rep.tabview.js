/* See license.txt for terms of usage */

HAR.ns(function() { with (Domplate) {

//-----------------------------------------------------------------------------

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
        DIV({"class": "tabViewBody"},
            TAG("$tabBar"),
            TAG("$tabBodies")
        ),

    tabBar: 
        DIV({"class": "tabBar"}/*,
            A({class: "ParamsTab tab", onclick: "$onClickTab", view: "Params"},
                "Parameters"
            )*/
        ),

    tabBodies: 
        DIV({"class": "tabBodies"}/*,
            DIV({class: "tabParamsBody tabBody"},
                "Hello from static tab."
            )*/
        ),

    appendTab: function(tabId, tabTitle)
    {
        // Create new tab tag.
        this.tabBar.tag.merge([
            A({"class": tabId + "Tab tab", 
                onclick: "$onClickTab", 
                $collapsed: "$this|hideTab",
                view: tabId}, 
                tabTitle
            )
        ], this.tabBar.tag);

        // Create new body tag.
        this.tabBodies.tag.merge([
            DIV({"class": "tab" + tabId + "Body tabBody"})
        ], this.tabBodies.tag);
    },

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

        viewBody.selectedTab = tab;
        viewBody.selectedBody = tabBody;

        // Activate new tab.
        viewBody.selectedTab.setAttribute("selected", "true");
        viewBody.selectedBody.setAttribute("selected", "true");

        // xxxHonza: IE workaround. Adding the "selected" attribute doesn't
        // update the style. Use class name instead.
        HAR.Lib.setClass(viewBody.selectedBody, "selected");
        HAR.Lib.setClass(viewBody.selectedTab, "selected");

        this.updateTabBody(viewBody, view, null);
    },

    updateTabBody: function(viewBody, view, object)
    {
        var tab = viewBody.selectedTab;

        for (var i=0; i<this.listeners.length; i++) {
            var listener = this.listeners[i];
            if (listener.onUpdateTabBody)
                listener.onUpdateTabBody(viewBody, view, object);
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

//-----------------------------------------------------------------------------
}});
