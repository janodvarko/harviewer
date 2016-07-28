/* See license.txt for terms of usage */

/**
 * @module tabs/search
 */
define("tabs/search", [
    "domplate/domplate",
    "core/lib",
    "i18n!nls/search",
    "domplate/toolbar",
    "domplate/popupMenu",
    "core/cookies",
    "core/dragdrop"
],

function(Domplate, Lib, Strings, Toolbar, Menu, Cookies, DragDrop) {

var domplate = Domplate.domplate;
var INPUT = Domplate.INPUT;
var SPAN = Domplate.SPAN;

// ********************************************************************************************* //
// Search

// Module object
var Search = {};

// Default options
var caseSensitiveOption = "searchCaseSensitive";

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
            checked: Cookies.getBooleanCookie(caseSensitiveOption),
            command: Lib.bindFixed(this.onOption, this, caseSensitiveOption)
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
// Object Search

/**
 * Implements search over object properties and children objects. There should be no
 * cycles in the scanned object hierarchy.
 *
 * @param {Object} text Text to search for.
 * @param {Object} object The input object to search.
 * @param {Object} reverse If true search is made backwards.
 * @param {Object} caseSensitive If true the search is case sensitive.
 */
Search.ObjectSearch = function(text, object, reverse, caseSensitive)
{
    this.text = text;
    this.reverse = reverse;
    this.caseSensitive = caseSensitive;

    // Helper stack as an alternative for recursive tree iteration.
    this.stack = [];

    // The search can't use recursive approach to iterate the tree of objects.
    // Instad we have a helper persistent stack that holds the current position
    // in the tree. This way the user can see individual matches step by step.
    //
    // object: current object in the tree.
    // propIndex: index of the last found property with matched value.
    // startOffset: index of the match within the value (there can be more matches in it)
    this.stack.push({
        object: object,
        propIndex: 0,
        startOffset: -1
    });

    // Array of matched values.
    this.matches = [];
};

Search.ObjectSearch.prototype =
{
    findNext: function(text)
    {
        // All children objects of the passed object are pushed on to the stack
        // for further scan.
        while (this.stack.length > 0)
        {
            var scope = this.getCurrentScope();
            var result = this.find(scope);
            if (result)
                return result;
        }

        // No match
        return false;
    },

    find: function(scope)
    {
        var propIndex = 0;
        for (var p in scope.object)
        {
            propIndex++;

            // Ignore properties that have been already scaned and also ignore the
            // last property if its value has been searched till the end (startOffset == -1).
            if (scope.propIndex >= propIndex)
                continue;

            // Ignore empty values.
            var value = scope.object[p];
            if (!value)
                continue;

            scope.propIndex = propIndex;

            // Any children object are pushed on the stack and scaned in the next call.
            if (typeof(value) === "object")
            {
                // Put child on the stack (alternative for recursion).
                this.stack.push({
                    propIndex: 0,
                    object: value,
                    startOffset: -1
                });

                // And iterate the child in the next cycle.
                return false;
            }

            // Convert to lower case in case of non case sensitive search.
            var tempText = this.text;
            var tempValue = String(value);

            if (!Cookies.getBooleanCookie(caseSensitiveOption))
            {
                tempValue = tempValue.toLowerCase();
                tempText = tempText.toLowerCase();
            }

            // Search for occurence of the text. Start searching since the beggingin
            // if this is the first time we are scanning the value. Otherwise continue
            // from the last position.
            var startOffset = (scope.startOffset < 0) ? 0 : scope.startOffset;
            var offset = tempValue.indexOf(tempText, startOffset);
            if (offset >= 0)
            {
                // Make sure that the value will be yet scanned for more occurences
                // in the next cycle.
                scope.propIndex += -1;
                scope.startOffset = offset + tempText.length;

                // Remember the match.
                this.matches.push({
                    value: value,
                    startOffset: offset
                });

                // One occurence found.
                return true;
            }
        }

        // Entire object in this scope scanned so remove it from the stack.
        this.stack.pop();

        return false;
    },

    getCurrentScope: function()
    {
        return this.stack[this.stack.length - 1];
    },

    getCurrentMatch: function()
    {
        return this.matches[this.matches.length - 1];
    },

    selectText: function(textNode)
    {
        var match = this.getCurrentMatch();
        Lib.selectElementText(textNode, match.startOffset, match.startOffset + this.text.length);
    }
};

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
