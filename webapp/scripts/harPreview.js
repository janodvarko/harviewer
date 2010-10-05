/* See license.txt for terms of usage */

require.def("harPreview", [
    "preview/pageList",
    "preview/harModel"
],

function(PageList, HarModel) {

//*************************************************************************************************
// The Preview Application

// Load HAR file if any is specified in the URL.
HarModel.Loader.run(function onHarLoad(jsonString)
{
    var input = HarModel.parse(jsonString, true);
    var pageList = new PageList(input);
    pageList.render(document.getElementById("content"));
});

//*************************************************************************************************
});
