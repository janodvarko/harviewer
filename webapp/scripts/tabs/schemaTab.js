/* See license.txt for terms of usage */

/**
 * @module tabs/schemaTab
 */
define([
    "../domplate/domplate",
    "../domplate/tabView",
    "../core/lib",
    "i18n!../nls/harViewer",
    "../syntax-highlighter/shCore",
    "../core/trace",
],

function(Domplate, TabView, Lib, Strings, dp, Trace) {

var PRE = Domplate.PRE;

//*************************************************************************************************
// Home Tab

function SchemaTab() {}
SchemaTab.prototype =
{
    id: "Schema",
    label: Strings.schemaTabLabel,

    bodyTag:
        PRE({"class": "brush: javascript; toolbar: false;", name: "code"}),

    onUpdateBody: function(tabView, body)
    {
        $.ajax({
            url: "scripts/preview/harSchema.js",
            context: this,

            // tell jQuery not to evaluate the response as JavaScript
            dataType: "text",

            success: function(response)
            {
                var code = body.firstChild;
                code.innerHTML = response;
                dp.SyntaxHighlighter.highlight(code);
            },

            error: function(jqXHR, textStatus, errorThrown)
            {
                Trace.error("SchemaTab.onUpdateBody; ERROR ", jqXHR, textStatus, errorThrown);
            }
        });
    }
};

return SchemaTab;

//*************************************************************************************************
});
