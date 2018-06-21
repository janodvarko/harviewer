/* See license.txt for terms of usage */

/**
 * @module harPreview
 */
define([
    "./preview/requestList",
    "./preview/pageList",
    "./preview/harModel",
    "./preview/harModelLoader",
    "./core/lib",
    "./core/trace",
    "./preview/menu",
    "./preview/validationError",
],

function(RequestList, PageList, HarModel, Loader, Lib, Trace, Menu, ValidationError) {

var content = document.getElementById("content");

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
        this.topMenu = new Menu();
        this.topMenu.render(content);

        // Auto load all HAR files specified in the URL.
        var okCallback = Lib.bind(this.appendPreview, this);
        var errorCallback = Lib.bind(this.onError, this);
        Loader.run(okCallback, errorCallback);
    },

    appendPreview: function(jsonString)
    {
        try
        {
            var validate = true;
            var param = Lib.getURLParameter("validate");
            if (param === "false")
                validate = false;

            var input = HarModel.parse(jsonString, validate);
            this.model.append(input);

            var pageList = new PageList(input);
            pageList.render(content);

            Lib.fireEvent(content, "onPreviewHARLoaded");
        }
        catch (err)
        {
            Trace.exception("HarPreview.appendPreview; EXCEPTION ", err);

            ValidationError.appendError(err, content);
        }
    },

    onError: function(jqXHR, textStatus, errorThrown)
    {
        Trace.log("HarPreview; Load error ", jqXHR, textStatus, errorThrown);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Loading HAR files

    /**
     * Load HAR file. See {@link HarViewer.loadHar} for documentation.
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
     * Load HAR and HARP file. See {@link HarViewer.loadArchives} for documentation.
     */
    loadArchives: function(hars, harps, callbackName, callback, errorCallback, doneCallback) {
        var self = this;
        return Loader.loadArchives(hars, harps, callbackName, function(jsonString) {
            self.appendPreview(jsonString);
            if (callback) {
                callback.apply(this, arguments);
            }
        }, errorCallback, doneCallback);
    },

    setPreviewColumns: function(cols, avoidCookies)
    {
        RequestList.setVisibleColumns(cols, avoidCookies);
    }
};

//*************************************************************************************************
// Initialization

var harPreview = content.repObject = new HarPreview();

// Fire some events for listeners. This is useful for extending/customizing the viewer.
Lib.fireEvent(content, "onPreviewPreInit");
harPreview.initialize(content);
Lib.fireEvent(content, "onPreviewInit");

Trace.log("HarPreview; initialized OK");

//*************************************************************************************************
});
