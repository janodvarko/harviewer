/* See license.txt for terms of usage */

/**
 * @module tabs/domTab
 */
define("tabs/domTab", [
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/domTab",
    "domplate/toolbar",
    "tabs/search",
    "core/dragdrop",
    "domplate/domTree",
    "core/cookies",
    "domplate/tableView",
    "core/trace",
    "json-query/JSONQuery"
],

function(Domplate, TabView, Lib, Strings, Toolbar, Search, DragDrop, DomTree, Cookies,
    TableView, Trace) {

/* global JSONQuery*/

var domplate = Domplate.domplate;
var DIV = Domplate.DIV;
var INPUT = Domplate.INPUT;
var SPAN = Domplate.SPAN;
var TABLE = Domplate.TABLE;
var TBODY = Domplate.TBODY;
var TD = Domplate.TD;
var TR = Domplate.TR;

// ********************************************************************************************* //
// Home Tab

// Search options
var jsonQueryOption = "searchJsonQuery";

function DomTab()
{
    this.toolbar = new Toolbar();
    this.toolbar.addButtons(this.getToolbarButtons());

    // Display jsonQuery results as a tree by default.
    this.tableView = false;
}

DomTab.prototype = domplate(TabView.Tab.prototype,
{
    id: "DOM",
    label: Strings.domTabLabel,

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Domplates

    separator:
        DIV({"class": "separator"}),

    tabBodyTag:
        DIV({"class": "tab$tab.id\\Body tabBody", _repObject: "$tab"},
            DIV({"class": "domToolbar"}),
            DIV({"class": "domContent"})
        ),

    domBox:
        TABLE({"class": "domBox", cellpadding: 0, cellspacing: 0},
            TBODY(
                TR(
                    TD({"class": "content"},
                        DIV({"class": "title"}, "$title")
                    ),
                    TD({"class": "splitter"}),
                    TD({"class": "results"},
                        DIV({"class": "resultsDefaultContent"},
                            Strings.searchResultsDefaultText
                        )
                    )
                )
            )
        ),

    queryResultsViewType:
        DIV({"class": "queryResultsViewType"},
            INPUT({"class": "type", type: "checkbox", onclick: "$onTableView"}),
                SPAN({"class": "label"},
                Strings.queryResultsTableView
            )
        ),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Tab

    onUpdateBody: function(tabView, body)
    {
        this.toolbar.render(Lib.$(body, "domToolbar"));

        // Lib.selectElementText doesn't support IE8 and below.
        if (!Lib.supportsSelectElementText)
        {
            var searchBox = Lib.getElementByClass(body, "searchBox");

            var searchInput = Lib.getElementByClass(searchBox, "searchInput");
            searchInput.setAttribute("disabled", "true");
            searchInput.setAttribute("title", Strings.searchDisabledForIE);

            var searchOptions = Lib.getElementByClass(searchBox, "arrow");
            searchOptions.setAttribute("disabled", "true");
        }

        this.updateSearchResultsUI();

        // TODO: Re-render the entire tab content here
    },

    getToolbarButtons: function()
    {
        var buttons = [];

        /*buttons.push({
            id: "tableView",
            tag: this.tableBtn
        });*/

        buttons.push({
            id: "search",
            tag: Search.Box.tag,
            initialize: Search.Box.initialize
        });

        return buttons;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Search

    createSearchObject: function(text)
    {
        // There can be more HAR files/logs displayed.
        var tables = Lib.getElementsByClass(this._body, "domTable");
        tables = Lib.cloneArray(tables);

        // Get all inputs (ie. HAR log files).
        var inputs = tables.map(function(a) {
            return a.repObject.input;
        });

        // Instantiate search object for this panel.
        return new Search.ObjectSearch(text, inputs, false, false);
    },

    getSearchOptions: function()
    {
        var options = [];

        // JSON Query
        options.push({
            label: Strings.searchOptionJsonQuery,
            checked: Cookies.getBooleanCookie(jsonQueryOption),
            command: Lib.bindFixed(this.onOption, this, jsonQueryOption)
        });

        return options;
    },

    onOption: function(name)
    {
        Search.Box.onOption(name);

        this.updateSearchResultsUI();
    },

    updateSearchResultsUI: function()
    {
        var value = Cookies.getBooleanCookie(jsonQueryOption);

        // There can be more HAR files/logs displayed.
        var boxes = Lib.getElementsByClass(this._body, "domBox");
        for (var i = 0; i < boxes.length; i++)
        {
            var box = boxes[i];
            var results = Lib.getElementByClass(box, "results");
            var splitter = Lib.getElementByClass(box, "splitter");

            if (value)
            {
                Lib.setClass(results, "visible");
                Lib.setClass(splitter, "visible");
            }
            else
            {
                Lib.removeClass(results, "visible");
                Lib.removeClass(splitter, "visible");
            }

        }

        var searchInput = Lib.getElementByClass(this._body, "searchInput");
        if (searchInput)
        {
            var placeholder = value ? Strings.jsonQueryPlaceholder : Strings.searchPlaceholder;
            searchInput.setAttribute("placeholder", placeholder);
        }
    },

    onSearch: function(text, keyCode)
    {
        var jsonQuery = Cookies.getBooleanCookie(jsonQueryOption);
        if (jsonQuery)
            return this.evalJsonQuery(text, keyCode);

        // Avoid searches for short texts.
        if (text.length < 3)
            return true;

        // Clear previous search if the text has changed.
        if (this.currSearch && this.currSearch.text !== text)
            this.currSearch = null;

        // Create new search object if necessary. This objects holds current search
        // position and other meta data.
        if (!this.currSearch)
            this.currSearch = this.createSearchObject(text);

        // Search (or continue to search) through the JSON structure. The method returns
        // true if a match is found.
        if (this.currSearch.findNext(text))
        {
            // The root of search data is the list of inputs, the second is the
            // current input (where match has been found).
            var currentInput = this.currSearch.stack[1].object;
            var tree = this.getDomTree(currentInput);

            // Let's expand the tree so, the found value is displayed to the user.
            // Iterate over all current parents.
            for (var i=0; i<this.currSearch.stack.length; i++)
                tree.expandRow(this.currSearch.stack[i].object);

            // A match corresponds to a node-value in the HAR log.
            var match = this.currSearch.getCurrentMatch();
            var row = tree.getRow(match.value);
            if (row)
            {
                var valueText = row.querySelector(".memberValueCell .objectBox");
                this.currSearch.selectText(valueText.firstChild);
                Lib.scrollIntoCenterView(valueText);
            }

            return true;
        }

        // Nothing has been found or we have reached the end. Reset the search object so,
        // the search starts from the begginging again.
        if (this.currSearch.matches.length > 0)
            this.currSearch = this.createSearchObject(text);

        return false;
    },

    evalJsonQuery: function(expr, keyCode)
    {
        // JSON Path is executed when enter key is pressed.
        if (keyCode !== 13)
            return true;

        // Eval the expression for all logs.
        var boxes = Lib.getElementsByClass(this._body, "domBox");
        for (var i=0; i<boxes.length; i++)
        {
            var box = boxes[i];
            var table = Lib.getElementByClass(box, "domTable");
            var input = table.repObject.input;

            var parentNode = box.querySelector(".domBox .results");
            Lib.clearNode(parentNode);

            try
            {
                var viewType = this.queryResultsViewType.append({}, parentNode);
                if (this.tableView)
                {
                    var type = Lib.getElementByClass(viewType, "type");
                    type.setAttribute("checked", "true");
                }

                var result = JSONQuery(expr, input);
                parentNode.repObject = result;

                if (this.tableView)
                {
                    TableView.render(parentNode, result);
                }
                else
                {
                    var domTree = new DomTree(result);
                    domTree.append(parentNode);
                }
            }
            catch (err)
            {
                Trace.exception(err);
            }
        }

        return true;
    },

    onTableView: function(event)
    {
        var e = Lib.fixEvent(event);
        var target = e.target;

        var tab = Lib.getAncestorByClass(target, "tabBody");
        var tableView = $(target).prop("checked");
        tab.repObject.tableView = tableView;

        var resultBox = Lib.getAncestorByClass(target, "results");
        var result = resultBox.repObject;

        // Clean up
        var tree = Lib.getElementByClass(resultBox, "domTable");
        if (tree)
            tree.parentNode.removeChild(tree);

        var table = Lib.getElementByClass(resultBox, "dataTableSizer");
        if (table)
            table.parentNode.removeChild(table);

        if (tableView)
        {
            TableView.render(resultBox, result);
        }
        else
        {
            var domTree = new DomTree(result);
            domTree.append(resultBox);
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Public

    append: function(input)
    {
        var content = Lib.$(this._body, "domContent");

        // Iterate all pages and get titles.
        var titles = [];
        for (var i=0; i<input.log.pages.length; i++)
        {
            var page = input.log.pages[i];
            titles.push(page.title);
        }

        // Create box for DOM tree + render list of titles for this log.
        var box = this.domBox.append({title: titles.join(", ")}, content);
        var domContent = Lib.getElementByClass(box, "content");

        // Initialize splitter for JSON path query results area.
        var element = Lib.getElementByClass(box, "splitter");
        this.splitter = new DragDrop.Tracker(element, {
            onDragStart: Lib.bind(this.onDragStart, this),
            onDragOver: Lib.bind(this.onDragOver, this),
            onDrop: Lib.bind(this.onDrop, this)
        });

        this.updateSearchResultsUI();

        // Render log structure as an expandable tree.
        var domTree = new DomTree(input);
        domTree.append(domContent);

        // Separate the next HAR log (e.g. dropped as a local file).
        this.separator.append({}, content);
    },

    getDomTree: function(input)
    {
        // Iterate all existing dom-trees. There can be more if more logs
        // is currently displayed.
        var tables = Lib.getElementsByClass(this._body, "domTable");
        for (var i=0; i<tables.length; i++)
        {
            var tree = tables[i].repObject;
            if (tree.input === input)
                return tree;
        }
        return null;
    },

    highlightFile: function(input, file)
    {
        // Iterate all input HAR logs.
        var tree = this.getDomTree(input);
        if (!tree)
            return;

        // Expand the root and 'entries' node.
        tree.expandRow(input.log);
        tree.expandRow(input.log.entries);

        // Now expand the file node and highlight it.
        var row = tree.expandRow(file);
        if (row)
            Lib.setClassTimed(row, "jumpHighlight");

        // Scroll the tree so, the highlighted entry is visible.
        //xxxHonza: a little hacky
        var content = Lib.$(this._body, "domContent");
        content.scrollTop = row.offsetTop;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Splitter

    onDragStart: function(tracker)
    {
        var body = Lib.getBody(this._body.ownerDocument);
        body.setAttribute("vResizing", "true");

        var box = Lib.getAncestorByClass(tracker.element, "domBox");
        var element = Lib.getElementByClass(box, "content");
        this.startWidth = element.clientWidth;
    },

    onDragOver: function(newPos, tracker)
    {
        var box = Lib.getAncestorByClass(tracker.element, "domBox");
        var content = Lib.getElementByClass(box, "content");
        var newWidth = (this.startWidth + newPos.x);
        content.style.width = newWidth + "px";
    },

    onDrop: function(tracker)
    {
        var body = Lib.getBody(this._body.ownerDocument);
        body.removeAttribute("vResizing");
    }
});

// ********************************************************************************************* //

return DomTab;

// ********************************************************************************************* //
});
