/* See license.txt for terms of usage */

require.def("tabs/domTab", [
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/harViewer",
    "domplate/toolbar",
    "tabs/search",
    "domplate/domTree"
],

function(Domplate, TabView, Lib, Strings, Toolbar, Search, DomTree) { with (Domplate) {

// ********************************************************************************************* //
// Home Tab

function DomTab()
{
    this.toolbar = new Toolbar();
    this.toolbar.addButtons(this.getToolbarButtons());
}

DomTab.prototype = Lib.extend(TabView.Tab.prototype,
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
                    TD({"colspan": 2},
                        DIV({"class": "title"}, "$title")
                    )
                ),
                TR(
                    TD({"class": "content", width: "100%"}),
                    TD({"class": "results", width: "0%"})
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

    onSearch: function(text)
    {
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
});

// ********************************************************************************************* //

return DomTab;

// ********************************************************************************************* //
}});
