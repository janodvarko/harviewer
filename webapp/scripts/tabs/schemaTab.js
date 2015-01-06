/* See license.txt for terms of usage */

require.def("tabs/schemaTab", [
    "jquery/jquery",
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/harViewer",
    "syntax-highlighter/shCore",
    "core/trace",
    "require"
],

function($, Domplate, TabView, Lib, Strings, dp, Trace, require) { with (Domplate) {

//*************************************************************************************************
// Home Tab

function SchemaTab() {}
SchemaTab.prototype =
{
    id: "Schema",
    label: Strings.schemaTabLabel,

    bodyTag:
        PRE({"class": "javascript:nocontrols:", name: "code"}),

    onUpdateBody: function(tabView, body)
    {
        require(["text!preview/harSchema.js"], function(source)
        {
            var code = body.firstChild;
            code.innerHTML = (typeof source === "string") ? source : JSON.stringify(source, null, 4);
            dp.SyntaxHighlighter.HighlightAll(code);
        });
    }
};

return SchemaTab;

//*************************************************************************************************
}});
