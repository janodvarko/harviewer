/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Domplate) { with (HAR.Lib) {

// ************************************************************************************************

// TODO:
// 5) There should be a clean button to remove all current data (like a page reload).
// 6) the ant build should support testBuild target that doesn't compress
//    har files so, it's easier to debug problems with the release.
// 7) "@VERSION@" and other properties could be possible to use even 
//    in javascript files (currently it's only index.php).
// 8) //#ifdef _DEBUG should be possible to use in all javascript files.
// 10) Cache tab could display even the image. See HAR.Rep.EntryBody.hideCache.

/**
 * HAR Viewer implementation. This object represents the main page content.
 */
HAR.Viewer = domplate(
{
    tabView: null,

    initialize: function()
    {
        var content = HAR.$("content");
        if (!content)
            return;

        // Use all registered tabs.
        this.tabView = new HAR.TabView();
        var tabs = HAR.getTabs();
        for (var i in tabs)
            this.tabView.appendTab(tabs[i]);

        // Render basic page content (tab view) and select the Input tab by default.
        this.tabView.render(content);
        this.tabView.selectTabByName("Input");

        // Parse URL and load specified HAR files by default.
        HAR.Model.Loader.run();

        // Register window onresize listener for adapting
        // source editor width.
        window.addEventListener("resize", bind(this.onWindowResize, this), false);
        this.onWindowResize();
    },

    onWindowResize: function()
    {
        var editor = HAR.$("sourceEditor");
        var body = getBody(document);
        editor.style.width = (body.clientWidth - 40) + "px";
    },

    selectTabByName: function(name)
    {
        this.tabView.selectTabByName(name);
    },

    getTab: function(name)
    {
        this.tabView.getTab(name);
    },

    // OBSOLETE: HAR.Model.Loader.loadExample should be used directly.
    loadExample: function(path)
    {
        return HAR.Model.Loader.loadExample(path);
    }
});

//-----------------------------------------------------------------------------

/**
 * Download HAR source using Downloadify.
 */
HAR.Download = domplate(
{
    tag:
        SPAN({"class": "harDownloadButton harButton image",
            id: "harDownloadButton",
            title: $STR("tooltip.Download HAR File")}),

    create: function()
    {
        if (this.created)
            return;

        this.created = true;

        Downloadify.create("harDownloadButton",
        {
            filename: function() {
                return "netData.har";
            },
            data: function() {
                return HAR.Model.toJSON();
            },
            onComplete: function() {},
            onCancel: function() {},
            onError: function() {
                alert("Failed to save.");
            },
            swf: "downloadify/media/downloadify.swf",
            downloadImage: "images/download-sprites.png",
            width: 16,
            height: 16,
            transparent: true,
            append: false
        });
    }
});

// ************************************************************************************************
// Registration

HAR.registerModule(HAR.Viewer);

// ************************************************************************************************
}}});
