/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Lib) { with (Domplate) {

/**
 * This template dislays simple page list.
 */
HAR.Service.PageList = domplate(
{
    tag:
        TABLE({"style": "width:100%", border: "0"},
            TR(
                TD({"class": "defaultContent",
                    "style": "vertical-align:middle; text-align:center;"},
                    IMG({"src": "images/ajax-loader.gif"})
                )
            )
        ),

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
        var table = this.render(HAR.$("pageList"));
        
        // But we need dijit.
        //dojo.require("dijit._base.place");
        //var vp = dijit.getViewport();
        //vp.x, vp.y, vp.t, vp.l (scrolloffset)

        var h = 0;
        if (!window.innerHeight) { //IE
            if (!(document.documentElement.clientHeight == 0)) //strict mode
                h = document.documentElement.clientHeight;
            else //quirks mode
                h = document.body.clientHeight;
        } else //w3c
            h = window.innerHeight;

        table.style.height = h + "px";

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
    }
})

//-----------------------------------------------------------------------------
// Registration

HAR.registerModule(HAR.Service.PageList);

//-----------------------------------------------------------------------------
}}});
