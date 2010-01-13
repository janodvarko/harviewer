/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Lib) { with (Domplate) {

/**
 * This template dislays simple page list.
 */
HAR.Service.PageList = domplate(
{
    tag:
        TABLE({"style": "width:100%; height:220px", border: "0"},
            TR(
                TD({"class": "defaultContent",
                    "style": "vertical-align:middle; text-align:center;"},
                    TAG("$filePath|getContentTag", {filePath: "$filePath"})
                )
            )
        ),

    errorTag:
        DIV(
            SPAN("Missing"),
            SPAN("&nbsp;"),
            SPAN({"style": "font-weight: bold;"}, "path"),
            SPAN("&nbsp;"),
            SPAN("parameter in the URL.")
        ),

    loadTag:
        DIV(
            BUTTON({"class": "loadButton", onclick: "$onLoad"}, "Load HAR"),
            BR(),
            BR(),
            A({style: "font-size: 10px", target: "_tab",
                href: "$filePath|getFullPreviewLink"}, "Full Preview")
        ),

    loadingTag:
        IMG({"src": "images/ajax-loader.gif"}),

    getContentTag: function(filePath)
    {
        return filePath ? this.loadTag : this.errorTag;
    },

    getFullPreviewLink: function(filePath)
    {
        return "/har/viewer?path=" + filePath;
    },


    /**
     * The Load button was clicked so, load the HAR file and preview.
     */
    onLoad: function(event)
    {
        var e = HAR.eventFix(event || window.event);

        // Avoid clicks on links.
        if (!hasClass(e.target, "loadButton"))
            return;

        // Replace the button with ajax-loader icon.
        var content = getAncestorByClass(e.target, "defaultContent");
        this.loadingTag.replace({}, content);

        // Load the HAR log asynchronously.
        var filePath = HAR.Lib.getURLParameter("path");
        HAR.Viewer.loadLocalArchive(filePath, function(response)
        {
            var content = HAR.$("pageList");
            var inputData = HAR.Rep.Schema.parseInputData(response, content, false);
            if (inputData)
            {
                HAR.Model.appendData(inputData);
                var pageList = HAR.Tab.Preview.buildPageList(content, inputData);
                if (HAR.Lib.getURLParameter("expand"))
                    HAR.Rep.PageList.expandAll(pageList)
            }
        });
    },

    /**
     * The page list preview doesn't load the HAR log automatically. The user
     * has to click a button.
     */
    render: function(parentNode)
    {
        var filePath = HAR.Lib.getURLParameter("path");
        HAR.log("har.service.pageList; render " + filePath);
        return this.tag.replace({filePath: filePath}, parentNode);
    },

    /**
     * Initialization of the viewer (called after page onLoad).
     */
    initialize: function()
    {
        this.render(HAR.$("pageList"));
    }
})

//-----------------------------------------------------------------------------
// Registration

HAR.registerModule(HAR.Service.PageList);

//-----------------------------------------------------------------------------
}}});
