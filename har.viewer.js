/* See license.txt for terms of usage */

HAR.ns(function() { with (Domplate) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

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

        // Render basic page content (tab view) and select the Input tab by default.
        this.tabView = this.TabView.render(content);
        this.selectTabByName("Input");

        // Parse URL and load specified HAR files by default.
        HAR.Model.Loader.run();

        // Register window onresize listener for adapting
        // source editor width.
        window.onresize = bind(this.onWindowResize, this);
        this.onWindowResize();

        // Create download button.
        HAR.Download.create();

        // Viewer is initialized so, notify all listeners. This is helpful
        // for extending the page using e.g. Firefox extensions.
        fireEvent(content, "onViewerInit");

        HAR.log("har; Viewer initialized.", schema);
    },

    onWindowResize: function()
    {
        var editor = HAR.$("sourceEditor");
        var body = getBody(document);
        editor.style.width = (body.clientWidth - 40) + "px";
    },

    selectTabByName: function(tabName)
    {
        this.TabView.selectTabByName(this.tabView, tabName);
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
        SPAN({"class": "harDownloadButton", id: "harDownloadButton",
            title: $STR("tooltip.Download_HAR_File")}),

    create: function()
    {
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

//-----------------------------------------------------------------------------

/**
 * Domplate template for the main tabbed UI.
 */
HAR.Viewer.TabView = domplate(HAR.Rep.TabView,
{
    tabList:
        DIV({"class": "tabViewBody"},
            DIV({"class": "tabBar"},
                A({"class": "InputTab tab", onmousedown: "$onClickTab", view: "Input"},
                    $STR("viewer.tab.Input")
                ),
                A({"class": "PreviewTab tab", onmousedown: "$onClickTab", view: "Preview"},
                    $STR("viewer.tab.Preview")
                ),
                A({"class": "DOMTab tab", onmousedown: "$onClickTab", view: "DOM"},
                    $STR("viewer.tab.DOM")
                ),
                A({"class": "HelpTab tab", onmousedown: "$onClickTab", view: "Help"},
                    $STR("viewer.tab.About"),
                    SPAN("&nbsp;"),
                    SPAN({"class": "red", "style": "font-size:11px;"},
                        "$version"
                    )
                ),
                A({"class": "SchemaTab tab", onclick: "$onClickTab", view: "Schema"},
                    $STR("viewer.tab.Schema")
                )
            ),
            DIV({"class": "tabInputBody tabBody"},
                DIV({"class": "inputBody"})
            ),
            DIV({"class": "tabPreviewBody tabBody"},
                TAG("$previewToolbar"),
                DIV({"class": "pageTimeline"}),
                DIV({"class": "pageStats"}),
                DIV({"class": "pageList"})
            ),
            DIV({"class": "tabDOMBody tabBody"}),
            DIV({"class": "tabHelpBody tabBody"},
                DIV({"class": "helpBody"})
            ),
            DIV({"class": "tabSchemaBody tabBody"},
                PRE({"class": "schemaPreview"})
            )
        ),

    previewToolbar:
        DIV({"class": "previewToolbar"},
            TAG(HAR.Page.ShowTimeline.tag),
            SPAN({style: "color: gray;"}, " | "),
            TAG(HAR.Page.ShowStats.tag),
            SPAN({style: "color: gray;"}, " | "),
            SPAN({"class": "harButton", onclick: "$onClear", title: "Clean up the viewer."},
                $STR("button.Clear")
            ),
            SPAN({style: "color: gray;"}, " | "),
            TAG(HAR.Download.tag)
        ),

    onClear: function()
    {
        var href = document.location.href;
        var index = href.indexOf("?");
        document.location = href.substr(0, index);
    },

    version: HAR.getVersion(),

    updateTabBody: function(viewBody, view, object)
    {
        var tab = viewBody.selectedTab;

        var tabInputBody = getElementByClass(viewBody, "tabInputBody");
        if (hasClass(tab, "InputTab") && !tabInputBody.updated)
        {
            var inputBody = getElementByClass(tabInputBody, "inputBody");

            tabInputBody.updated = true;
            HAR.Tab.InputView.render(inputBody);
        }

        var tabPreviewBody = getElementByClass(viewBody, "tabPreviewBody");
        if (hasClass(tab, "PreviewTab") && !tabPreviewBody.updated)
        {
            tabPreviewBody.updated = true;
            HAR.Tab.Preview.render(tabPreviewBody);
        }

        var tabDOMBody = getElementByClass(viewBody, "tabDOMBody");
        if (hasClass(tab, "DOMTab") && !tabDOMBody.updated)
        {
            tabDOMBody.updated = true;
            HAR.Tab.DomView.render(HAR.Model.inputData, tabDOMBody);
        }

        var tabSchemaBody = getElementByClass(viewBody, "tabSchemaBody");
        if (hasClass(tab, "SchemaTab") && !tabSchemaBody.updated)
        {
            tabSchemaBody.updated = true;

            dojo.xhrGet({
                url: "schema.js",
                load: function(response, ioArgs)
                {
                    dojo.require("dojox.highlight");
                    dojo.require("dojox.highlight.languages.javascript");

                    var code = dojox.highlight.processString(response).result;

                    // xxxHonza: IE doesn't properly preserve whitespaces.
                    if (dojo.isIE)
                        code = code.replace(/\n/g, "<br/>");

                    dojo.attr(tabSchemaBody.firstChild, {innerHTML: code});
                }
            });
        }

        var tabHelpBody = getElementByClass(viewBody, "tabHelpBody");
        if (hasClass(tab, "HelpTab") && !tabHelpBody.updated)
        {
            tabHelpBody.updated = true;

            var helpBody = getElementByClass(tabHelpBody, "helpBody");
            var template = HAR.$("HelpTabTemplate");
            helpBody.innerHTML = template.innerHTML;
            //eraseNode(template);
        }
    },

    render: function(parentNode)
    {
        var tabView = this.tag.replace({}, parentNode, this);
        return tabView;
    }
});

//-----------------------------------------------------------------------------
// Registration

HAR.registerModule(HAR.Viewer);

//-----------------------------------------------------------------------------
}}});
