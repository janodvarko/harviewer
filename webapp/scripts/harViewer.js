/* See license.txt for terms of usage */

/**
 * @module harViewer
 */
define("harViewer", [
    "domplate/tabView",
    "tabs/homeTab",
    "tabs/aboutTab",
    "tabs/previewTab",
    "tabs/schemaTab",
    "tabs/domTab",
    "preview/harModel",
    "preview/harModelLoader",
    "i18n!nls/harViewer",
    "preview/requestList",
    "core/lib",
    "core/trace"
],

function(TabView, HomeTab, AboutTab, PreviewTab, SchemaTab, DomTab, HarModel,
    Loader, Strings, RequestList, Lib, Trace) {

var content = document.getElementById("content");

// ********************************************************************************************* //
// The Application

function HarView()
{
    this.id = "harView";

    // Location of the model (all tabs see its parent and so the model).
    this.model = new HarModel();

    // Append tabs
    this.appendTab(new HomeTab());
    this.appendTab(new PreviewTab(this.model));
    this.appendTab(new DomTab());
    this.appendTab(new AboutTab());
    this.appendTab(new SchemaTab());
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
        this.harSpecURL = "http://www.softwareishard.com/blog/har-12-spec/";

        this.render(content);
        this.selectTabByName("Home");

        // Auto load all HAR files specified in the URL.
        var okCallback = Lib.bind(this.appendPreview, this);
        var errorCallback = Lib.bind(this.onLoadError, this);

        if (Loader.run(okCallback, errorCallback))
        {
            var homeTab = this.getTab("Home");
            if (homeTab)
                homeTab.loadInProgress(true);
        }
    },

    appendPreview: function(jsonString)
    {
        var homeTab = this.getTab("Home");
        var previewTab = this.getTab("Preview");
        var domTab = this.getTab("DOM");

        try
        {
            var validate = $("#validate").prop("checked");
            var input = HarModel.parse(jsonString, validate);
            this.model.append(input);

            if (previewTab)
            {
                // xxxHonza: this should be smarter.
                // Make sure the tab is rendered now.
                try
                {
                    previewTab.select();
                    previewTab.append(input);
                }
                catch (err)
                {
                    Trace.exception("HarView.appendPreview; EXCEPTION ", err);
                    if (err.errors && previewTab)
                        previewTab.appendError(err);
                }
            }

            // The input JSON is displayed in the DOM/HAR tab anyway, at least to
            // allow easy inspection of the content.
            // Btw. this makes HAR Viewer an effective JSON Viewer, but only if validation
            // is switched off, otherwise HarModel.parse() throws an exception.
            if (domTab)
                domTab.append(input);
        }
        catch (err)
        {
            Trace.exception("HarView.appendPreview; EXCEPTION ", err);
            if (err.errors && previewTab)
                previewTab.appendError(err);

            // xxxHonza: display JSON tree even if validation throws an exception
            if (err.input)
                domTab.append(err.input);
        }

        // Select the preview tab in any case.
        previewTab.select();

        // HAR loaded, parsed and appended into the UI, let's shut down the progress.
        if (homeTab)
            homeTab.loadInProgress(false);

        Lib.fireEvent(content, "onViewerHARLoaded");
    },

    onLoadError: function(jqXHR, textStatus, errorThrown)
    {
        var homeTab = this.getTab("Home");
        if (homeTab)
            homeTab.loadInProgress(true, jqXHR.statusText);

        Trace.error("harModule.loadRemoteArchive; ERROR ", jqXHR, textStatus, errorThrown);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Loading HAR files

    /**
     * Load HAR file
     * @param {String} url URL of the target log file
     * @param {Object} settings A set of key/value pairs taht configure the request.
     *      All settings are optional.
     *      settings.jsonp {Boolean} If you wish to force a crossDomain request using JSONP,
     *          set the value to true. You need to use HARP syntax for the target file.
     *          Default is false.
     *      settings.jsonpCallback {String} Override the callback function name used in HARP.
     *          Default is "onInputData".
     *      settings.success {Function} A function to be called when the file is successfully
     *          loaded. The HAR object is passed as an argument.
     *      settings.ajaxError {Function} A function to be called if the AJAX request fails.
     *          An error object is pased as an argument.
     */
    loadHar: function(url, settings)
    {
        settings = settings || {};
        return Loader.load(this, url,
            settings.jsonp,
            settings.jsonpCallback,
            settings.success,
            settings.ajaxError);
    },

    /**
     * Use to customize list of request columns displayed by default.
     *
     * @param {String} cols Column names separated by a space.
     * @param {Boolean} avoidCookies Set to true if you don't want to touch cookies.
     */
    setPreviewColumns: function(cols, avoidCookies)
    {
        RequestList.setVisibleColumns(cols, avoidCookies);
    }
});

// ********************************************************************************************* //
// Initialization

var harView = content.repObject = new HarView();

// Fire some events for listeners. This is useful for extending/customizing the viewer.
Lib.fireEvent(content, "onViewerPreInit");
harView.initialize(content);
Lib.fireEvent(content, "onViewerInit");

Trace.log("HarViewer; initialized OK");

// ********************************************************************************************* //
});
