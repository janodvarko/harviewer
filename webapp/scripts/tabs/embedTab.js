/* See license.txt for terms of usage */

require.def("tabs/embedTab", [
    "jquery/jquery",
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/harViewer",
    "text!tabs/embedTab.html",
    "require"
],

function($, Domplate, TabView, Lib, Strings, EmbedTabHtml, require) { with (Domplate) {
//*************************************************************************************************
// Home Tab

function EmbedTab() {}
EmbedTab.prototype =
{
    id: "Embed",
    label: Strings.embedTabLabel,

    tabHeaderTag:
        A({"class": "$tab.id\\Tab tab", view: "$tab.id", _repObject: "$tab"},
            "$tab.label"
        ),

    bodyTag:
        DIV({"class": "embedBody"}),

    onUpdateBody: function(tabView, body)
    {
        var self = this;
        body = this.bodyTag.replace({}, body);
        body.innerHTML = EmbedTabHtml;
    }
};

return EmbedTab;

//*************************************************************************************************
}});
