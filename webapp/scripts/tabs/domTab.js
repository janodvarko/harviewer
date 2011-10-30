/* See license.txt for terms of usage */

require.def("tabs/domTab", [
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/domTab",
    "domplate/toolbar",
    "tabs/search",
    "core/dragdrop",
    "domplate/domTree",
    "core/cookies",
    "json-path/jsonpath-0.8.0"
],

function(Domplate, TabView, Lib, Strings, Toolbar, Search, DragDrop, DomTree, Cookies) {
with (Domplate) {

// ********************************************************************************************* //
// Home Tab

// Search options
var jsonPathOption = "searchJsonPath";

function DomTab()
{
    this.toolbar = new Toolbar();
    this.toolbar.addButtons(this.getToolbarButtons());
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

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Tab

    onUpdateBody: function(tabView, body)
    {
        this.toolbar.render(Lib.$(body, "domToolbar"));

        // Lib.selectElementText doesn't support IE.
        if (Lib.isIE)
        {
            var searchInput = body.querySelector(".searchInput");
            searchInput.setAttribute("disabled", "true");
            searchInput.setAttribute("title", Strings.searchDisabledForIE);

            var searchOptions = body.querySelector(".searchBox .arrow");
            searchOptions.setAttribute("disabled", "true");
        }

        // TODO: Re-render the entire tab content here
    },

    getToolbarButtons: function()
    {
        var buttons = [
            {
                id: "search",
                tag: Search.Box.tag
            }
        ];

        return buttons;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Search

    createSearchObject: function(text)
    {
        // There can be more HAR files/logs displayed.
        var tables = this._body.querySelectorAll(".domTable");
        tables = Lib.cloneArray(tables);

        // Get all inputs (ie. HAR log files).
        var inputs = tables.map(function(a) { return a.repObject.input; });

        // Instantiate search object for this panel.
        return new Search.ObjectSearch(text, inputs, false, false);
    },

    getSearchOptions: function()
    {
        return [{
            label: Strings.searchOptionJsonPath,
            checked: Cookies.getBooleanCookie(jsonPathOption),
            command: Lib.bindFixed(this.onOption, this, jsonPathOption)
        }];
    },

    onOption: function(name)
    {
        Search.Box.onOption(name);

        this.updateSearchResultsUI();
    },

    updateSearchResultsUI: function()
    {
        var value = Cookies.getBooleanCookie(jsonPathOption);

        // There can be more HAR files/logs displayed.
        var boxes = this._body.querySelectorAll(".domBox");
        for (var i = 0; i < boxes.length; i++)
        {
            var box = boxes[i];
            var results = box.querySelector(".results");
            var splitter = box.querySelector(".splitter");

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
    },

    onSearch: function(text, keyCode)
    {
        var jsonPath = Cookies.getBooleanCookie(jsonPathOption);
        if (jsonPath)
            return this.evalJsonPath(text, keyCode);

        // Avoid searches for short texts.
        if (text.length < 3)
            return true;

        // Clear previous search if the text has changed.
        if (this.currSearch && this.currSearch.text != text)
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
        else
        {
            // Nothing has been found or we have reached the end. Reset the search object so,
            // the search starts from the begginging again.
            if (this.currSearch.matches.length > 0)
                this.currSearch = this.createSearchObject(text);

            return false;
        }
    },

    evalJsonPath: function(expr, keyCode)
    {
        // JSON Path is executed when enter key is pressed.
        if (keyCode != 13)
            return true;

        // Eval the expression for all logs.
        var boxes = this._body.querySelectorAll(".domBox");
        for (var i=0; i<boxes.length; i++)
        {
            var box = boxes[i];
            var table = box.querySelector(".domTable");
            var input = table.repObject.input;

            var parentNode = box.querySelector(".domBox .results");
            Lib.clearNode(parentNode);

            var result = jsonPath(input, expr);
            var domTree = new DomTree(result);
            domTree.append(parentNode);
        }

        return true;
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
            if (tree.input == input) 
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
        body.setAttribute("splitting", "true");

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
        body.removeAttribute("splitting");
    }
});

// ********************************************************************************************* //

return DomTab;

// ********************************************************************************************* //
}});
