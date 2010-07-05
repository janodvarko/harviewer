/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Domplate) { with (HAR.Lib) {

// ************************************************************************************************

HAR.Tab.HelpView = domplate(
{
    id: "Help",
    label: "viewer.tab.About",

    bodyTag:
        DIV({"class": "helpBody"}),

    version: HAR.getVersion(),

    tabHeaderTag:
        A({"class": "$tab.id\\Tab tab", view: "$tab.id", _repObject: "$tab"},
            $STR("viewer.tab.About"),
            SPAN("&nbsp;"),
            SPAN({"class": "red", "style": "font-size:11px;"},
                "$version"
            )
        ),

    onUpdateTabBody: function(viewBody, view, object)
    {
        var tab = viewBody.selectedTab;
        var tabHelpBody = getElementByClass(viewBody, "tabHelpBody");
        if (hasClass(tab, "HelpTab") && !tabHelpBody.updated)
        {
            tabHelpBody.updated = true;

            var helpBody = this.bodyTag.replace({}, tabHelpBody);
            var template = HAR.$("HelpTabTemplate");
            helpBody.innerHTML = template.innerHTML;
            //eraseNode(template);
        }
    }
});

// ************************************************************************************************
// Registration

HAR.registerTab(HAR.Tab.HelpView, "DOM");

// ************************************************************************************************
}}});
