/* See license.txt for terms of usage */

/**
 * @module tabs/schemaTab
 */
define([
    "../domplate/domplate",
    "../domplate/tabView",
    "../core/lib",
    "i18n!../nls/harViewer",
    "../core/trace",
],

function(Domplate, TabView, Lib, Strings, Trace) {

var CODE = Domplate.CODE;
var PRE = Domplate.PRE;

//*************************************************************************************************
// Home Tab

function SchemaTab() {}
SchemaTab.prototype =
{
    id: "Schema",
    label: Strings.schemaTabLabel,

    bodyTag:
        PRE(CODE("class", "javascript")),

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
                hljs.highlightBlock(code);

                // test that highlighting has worked, and set a flag that helps with testing.
                var highlightedElement = code;
                if (code.classList.contains("hljs")) {
                    highlightedElement.setAttribute("highlighted", true);
                }
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
