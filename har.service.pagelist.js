/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Lib) { with (Domplate) {

/**
 * This template dislays simple page list.
 */
HAR.Service.PageList = domplate(
{
    /**
     * Initialization of the viewer (called after page onLoad).
     */
    initialize: function()
    {
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
                    HAR.Rep.PageList.expandAll(pageList);
            }
        });
    }
})

//-----------------------------------------------------------------------------
// Registration

HAR.registerModule(HAR.Service.PageList);

//-----------------------------------------------------------------------------
}}});
