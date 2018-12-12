/* See license.txt for terms of usage */

/**
 * @module tabs/search
 */
define([
    "../domplate/domplate",
    "../core/lib",
    "i18n!../nls/search",
    "../domplate/toolbar",
    "../domplate/popupMenu",
    "../core/cookies",
    "../core/dragdrop",
],

function(Domplate, Lib, Strings, Toolbar, Menu, Cookies, DragDrop) {

var domplate = Domplate.domplate;
var INPUT = Domplate.INPUT;
var SPAN = Domplate.SPAN;

// ********************************************************************************************* //
// Search

// Module object
var Search = {};

Search.caseSensitiveCookieName = "searchCaseSensitive";

// ********************************************************************************************* //
// Search Box

/**
 * Domplate template for search input box. Should be inserted into a {@Toolbar}.
 */
Search.Box = domplate(
{
    tag:
        SPAN({"class": "searchBox"},
            SPAN({"class": "toolbarSeparator resizer"},
                "&nbsp;"
            ),
            SPAN({"class": "searchTextBox"},
                INPUT({"class": "searchInput", type: "text", placeholder: Strings.search,
                    onkeydown: "$onKeyDown"}
                ),
                SPAN({"class": "arrow", onclick: "$onOpenOptions"},
                    "&nbsp;"
                )
            )
        ),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Events

    onKeyDown: function(event)
    {
        var e = $.event.fix(event || window.event);
        var tab = Lib.getAncestorByClass(e.target, "tabBody");

        var searchInput = Lib.getElementByClass(tab, "searchInput");
        setTimeout(Lib.bindFixed(this.search, this, tab, e.keyCode, searchInput.value));
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Implementation

    initialize: function(element)
    {
        var searchInput = Lib.getElementByClass(element, "searchInput");
        var resizer = Lib.getElementByClass(element, "resizer");
        Search.Resizer.initialize(searchInput, resizer);
    },

    search: function(tab, keyCode, prevText)
    {
        var searchInput = Lib.getElementByClass(tab, "searchInput");
        searchInput.removeAttribute("status");

        var text = searchInput.value;

        // Support for incremental search, changing the text also causes search.
        if (text === prevText && keyCode !== 13)
            return;

        // The search input box looses focus if something is selected on the page
        // So, switch off the incremental search for webkit (works only on Enter)
        if (keyCode !== 13 && Lib.isWebkit)
            return;

        var result = tab.repObject.onSearch(text, keyCode);

        // Red background if there is no match.
        if (!result)
            searchInput.setAttribute("status", "notfound");
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Options

    onOpenOptions: function(event)
    {
        var e = Lib.fixEvent(event);
        Lib.cancelEvent(event);

        if (!Lib.isLeftClick(event))
            return;

        var target = e.target;
        var items = this.getMenuItems(target);

        // Finally, display the the popup menu.
        // xxxHonza: the old <DIV> can be still visible.
        var menu = new Menu({id: "searchOptions", items: items});
        menu.showPopup(target);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Menu Definition

    getMenuItems: function(target)
    {
        var tab = Lib.getAncestorByClass(target, "tabBody");
        var items = tab.repObject.getSearchOptions();

        items.push("-");
        items.push({
            label: Strings.caseSensitive,
            checked: Cookies.getBooleanCookie(Search.caseSensitiveCookieName),
            command: Lib.bindFixed(this.onOption, this, Search.caseSensitiveCookieName)
        });

        return items;
    },

    onOption: function(name)
    {
        Cookies.toggleCookie(name);

        var searchInput = Lib.getElementByClass(document.documentElement, "searchInput");
        searchInput.removeAttribute("status");
    }
});

// ********************************************************************************************* //

Search.Resizer = domplate(
{
    initialize: function(searchInput, resizer)
    {
        this.searchInput = searchInput;
        this.tracker = new DragDrop.Tracker(resizer, {
            onDragStart: Lib.bind(this.onDragStart, this),
            onDragOver: Lib.bind(this.onDragOver, this),
            onDrop: Lib.bind(this.onDrop, this)
        });
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Splitter

    onDragStart: function(tracker)
    {
        var body = Lib.getBody(this.searchInput.ownerDocument);
        body.setAttribute("vResizing", "true");

        //xxxHonza: the padding (20) should not be hardcoded.
        this.startWidth = this.searchInput.clientWidth - 20;
    },

    onDragOver: function(newPos, tracker)
    {
        var newWidth = (this.startWidth - newPos.x);
        var toolbar = Lib.getAncestorByClass(this.searchInput, "toolbar");
        if (newWidth > toolbar.clientWidth - 40)
            return;

        this.searchInput.style.width = newWidth + "px";
    },

    onDrop: function(tracker)
    {
        var body = Lib.getBody(this.searchInput.ownerDocument);
        body.removeAttribute("vResizing");
    }
});

// ********************************************************************************************* //

return Search;

// ********************************************************************************************* //
});
