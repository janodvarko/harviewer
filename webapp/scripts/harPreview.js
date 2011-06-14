/* See license.txt for terms of usage */

require.def("harPreview", [
    "preview/pageList",
    "preview/harModel",
    "core/lib",
    "core/trace"
],

function(PageList, HarModel, Lib, Trace) {

//*************************************************************************************************
// The Preview Application

function HarPreview()
{
    this.id = "harPreview";

    this.model = new HarModel();
}

HarPreview.prototype =
{
    initialize: function(content)
    {
        // Auto load all HAR files specified in the URL.
        var okCallback = Lib.bind(this.appendPreview, this);
        HarModel.Loader.run(okCallback);
    },

    appendPreview: function(jsonString)
    {
        var input = HarModel.parse(jsonString, true);
        this.model.append(input);

        var pageList = new PageList(input);
        pageList.render(content);

        Lib.fireEvent(content, "onPreviewHARLoaded");
    }
}

//*************************************************************************************************
// Initialization

var content = document.getElementById("content");
var harPreview = content.repObject = new HarPreview();

// Fire some events for listeners. This is useful for extending/customizing the viewer.
Lib.fireEvent(content, "onPreviewPreInit");
harPreview.initialize(content);
Lib.fireEvent(content, "onPreviewInit");

Trace.log("HarPreview; initialized OK");

//*************************************************************************************************
});
