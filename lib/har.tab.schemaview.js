/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Domplate) { with (HAR.Lib) {

// ************************************************************************************************

HAR.Tab.SchemaView = domplate(
{
    id: "Schema",
    label: "viewer.tab.Schema",

    bodyTag:
        PRE({"class": "schemaPreview"}),

    onUpdateTabBody: function(viewBody, view, object)
    {
        var tab = viewBody.selectedTab;
        var tabSchemaBody = getElementByClass(viewBody, "tabSchemaBody");
        if (hasClass(tab, "SchemaTab") && !tabSchemaBody.updated)
        {
            tabSchemaBody.updated = true;

            var schemaPreview = this.bodyTag.replace({}, tabSchemaBody);

            dojo.xhrGet({
                url: "lib/schema.js",
                load: function(response, ioArgs)
                {
                    dojo.require("dojox.highlight");
                    dojo.require("dojox.highlight.languages.javascript");

                    var code = dojox.highlight.processString(response).result;

                    // xxxHonza: IE doesn't properly preserve whitespaces.
                    if (dojo.isIE)
                        code = code.replace(/\n/g, "<br/>");

                    dojo.attr(schemaPreview, {innerHTML: code});
                }
            });
        }
    }
});

// ************************************************************************************************
// Registration

HAR.registerTab(HAR.Tab.SchemaView, "Help");

// ************************************************************************************************
}}});
