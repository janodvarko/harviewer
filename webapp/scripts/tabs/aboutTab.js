/* See license.txt for terms of usage */

/**
 * @module tabs/aboutTab
 */
define("tabs/aboutTab", [
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/harViewer"
],

function(Domplate, TabView, Lib, Strings) {

var A = Domplate.A;
var DIV = Domplate.DIV;
var SPAN = Domplate.SPAN;

//*************************************************************************************************
// Home Tab

/**
 * @constructor module:tabs/aboutTab
 */
function AboutTab() {}
AboutTab.prototype =
{
    id: "About",
    label: Strings.aboutTabLabel,

    tabHeaderTag:
        A({"class": "$tab.id\\Tab tab", view: "$tab.id", _repObject: "$tab"},
            "$tab.label",
            SPAN("&nbsp;"),
            SPAN({"class": "version"},
                "$tab.tabView.version"
            )
        ),

    bodyTag:
        DIV({"class": "aboutBody"}),

    onUpdateBody: function(tabView, body)
    {
        var self = this;
        body = this.bodyTag.replace({}, body);
        require(["text!tabs/aboutTab.html"], function(html)
        {
            function replace(s, pattern, replaceWith) {
                if (!replaceWith) {
                    return s;
                }
                return s.replace(new RegExp(pattern, "g"), replaceWith);
            }

            html = replace(html, "@VERSION@", tabView.version);
            html = replace(html, "@HAR_SPEC_URL@", tabView.harSpecURL);

            body.innerHTML = html;

            $(".linkSchema").click(Lib.bind(self.onSchema, self));
        });
    },

    onSchema: function()
    {
        this.tabView.selectTabByName("Schema");
    }
};

return AboutTab;

//*************************************************************************************************
});
