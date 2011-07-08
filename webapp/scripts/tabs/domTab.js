/* See license.txt for terms of usage */

require.def("tabs/domTab", [
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/harViewer",
    "domplate/domTree"
],

function(Domplate, TabView, Lib, Strings, DomTree) { with (Domplate) {

// ********************************************************************************************* //
// Home Tab

function DomTab() {}
DomTab.prototype = Lib.extend(TabView.Tab.prototype,
{
    id: "DOM",
    label: Strings.domTabLabel,

    separator:
        DIV({"class": "separator"}),

    onUpdateBody: function(tabView, body)
    {
        // TODO: Re-render the entire tab content here
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Public

    append: function(input)
    {
        var domTree = new DomTree(input);
        domTree.append(this._body);

        // Separate the next HAR log (e.g. dropped as a local file).
        this.separator.append({}, this._body);
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
    }
});

return DomTab;

// ********************************************************************************************* //
}});
