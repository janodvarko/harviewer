/* See license.txt for terms of usage */

require.def("tabs/schemaTab", [
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/harViewer",
    "syntax-highlighter/shCore",
    "core/trace"
],

function(Domplate, TabView, Lib, Strings, dp, Trace) { with (Domplate) {

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
        $.ajax({
            url: "scripts/preview/harSchema.js",
            context: this,

            success: function(response)
            {
                var code = body.firstChild;
                code.innerHTML = response;
                dp.SyntaxHighlighter.HighlightAll(code);
            },

            error: function(response, ioArgs)
            {
                Trace.error("SchemaTab.onUpdateBody; ERROR ", response);
            }
        });
    }
};

return SchemaTab;

//*************************************************************************************************
}});
