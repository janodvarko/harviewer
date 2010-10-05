/* See license.txt for terms of usage */

require.def("tabs/domTab", [
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/harViewer",
    "domplate/domTree"
],

function(Domplate, TabView, Lib, Strings, DomTree) { with (Domplate) {

//*************************************************************************************************
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

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Public

    append: function(input)
    {
        var domTree = new DomTree(input);
        domTree.append(this._body);

        // Separate the next HAR log (e.g. dropped as a local file).
        this.separator.append({}, this._body);
    }
});

return DomTab;

//*************************************************************************************************
}});
