/* See license.txt for terms of usage */

require.def("harViewer", [
    "domplate/tabView",
    "tabs/homeTab",
    "tabs/aboutTab",
    "tabs/previewTab",
    "tabs/schemaTab",
    "tabs/domTab",
    "preview/harModel",
    "i18n!nls/harViewer",
    "core/lib",
    "core/trace"
],

function(TabView, HomeTab, AboutTab, PreviewTab, SchemaTab, DomTab, HarModel, Strings, Lib, Trace) {

//*************************************************************************************************
// The Application

function HarView(content)
{
    this.id = "harView";

    // Location of the model (all tabs see its parent and so the model).
    this.model = new HarModel();

    // Append tabs
    this.homeTab = this.appendTab(new HomeTab());
    this.previewTab = this.appendTab(new PreviewTab(this.model));
    this.domTab = this.appendTab(new DomTab());
    this.aboutTab = this.appendTab(new AboutTab());
    this.schemaTab = this.appendTab(new SchemaTab());

    this.initialize(content);
}

/**
 * This is the Application UI configuration code. The Viewer UI is based on a Tabbed UI
 * interface and is composed from following tabs:
 * 
 * {@link HomeTab}: This is the starting application tab. This tab allows direct inserting of
 *      a HAR log source to preview. There are also some useful links to existing example logs.
 *      This page is displyed by default unless there is a HAR file specified in the URL.
 *      In such case the file is automatically loaded and {@link PreviewTab} selected.
 *
 * {@link PreviewTab}: This tab is used to preview one or more HAR files. The UI is composed
 *      from an expandable list of pages and requests. There is also a graphical timeline
 *      that shows request timings.
 *
 * {@link DomTab}: This tab shows hierarchical structure of the provided HAR file(s) as
 *      an expandable tree.
 *
 * {@link AboutTab}: Shows some basic information about the HAR Viewer and links to other
 *      resources.
 *
 * {@link SchemaTab}: Shows HAR log schema definition, based on JSON Schema.
 */
HarView.prototype = Lib.extend(new TabView(),
/** @lends HarView */
{
    initialize: function(content)
    {
        // Global application properties.
        this.version = content.getAttribute("version");
        this.harSpecURL = "http://groups.google.com/group/http-archive-specification/web/har-1-2-spec";

        this.render(content);
        this.selectTabByName("Home");

        // Auto load all HAR files specified in the URL.
        var okCallback = Lib.bind(this.appendPreview, this);
        var errorCallback = Lib.bind(this.onLoadError, this);

        if (HarModel.Loader.run(okCallback, errorCallback))
            this.homeTab.loadInProgress(true);
    },

    appendPreview: function(jsonString)
    {
        try
        {
            var validate = $("#validate").attr("checked");
            var input = HarModel.parse(jsonString, validate);
            this.model.append(input);

            // xxxHonza: this should be smarter.
            // Make sure the tab is rendered.
            this.previewTab.select();

            // Append loaded data into the Preview and DOM tab.
            this.previewTab.append(input);
            this.domTab.append(input);
        }
        catch (err)
        {
            Trace.exception("HarView.appendPreview; EXCEPTION ", err);

            if (err.errors)
                this.previewTab.appendError(err);
        }

        // The Preview is what the user wants to see now.
        this.previewTab.select();

        // HAR loaded, parsed and appended into the UI, let's shut down the progress.
        this.homeTab.loadInProgress(false);
    },

    onLoadError: function(response, ioArgs)
    {
        this.homeTab.loadInProgress(true, response.statusText);
        Trace.error("harModule.loadRemoteArchive; ERROR ", response, ioArgs);
    }
})

//*************************************************************************************************
// Initialization

/**
 * Render the entire application UI.
 */ 
var content = document.getElementById("content");
var harView = new HarView(content);

// Viewer is initialized so, notify all listeners. This is helpful
// for extending the page using e.g. Firefox extensions.
Lib.fireEvent(content, "onViewerInit", [harView]);

Trace.log("HarViewer; initialized OK");

//*************************************************************************************************
});
