/* See license.txt for terms of usage */

require.def("tabs/homeTab", [
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "core/cookies",
    "core/trace",
    "i18n!nls/homeTab",
    "text!tabs/homeTab.html",
    "preview/harModel"
],

function(Domplate, TabView, Lib, Cookies, Trace, Strings, HomeTabHtml, HarModel) { with (Domplate) {

//*************************************************************************************************
// Home Tab

function HomeTab() {}
HomeTab.prototype = Lib.extend(TabView.Tab.prototype,
/** @lends HomeTab */
{
    id: "Home",
    label: Strings.homeTabLabel,

    bodyTag:
        DIV({"class": "homeBody"}),

    onUpdateBody: function(tabView, body)
    {
        body = this.bodyTag.replace({}, body);

        // Content of this tab is loaded by default (required above) since it's
        // the first thing displayed to the user anyway.
        // Also let's search and replace some constants in the template.
        body.innerHTML = HomeTabHtml.replace("@HAR_SPEC_URL@", tabView.harSpecURL, "g");

        // Register click handlers.
        $("#appendPreview").click(Lib.bindFixed(this.onAppendPreview, this));
        $(".linkAbout").click(Lib.bind(this.onAbout, this));

        // Registers drag-and-drop event handlers. These will be responsible for
        // auto-loading all dropped HAR files.
        var content = $("#content");
        content.bind("dragenter", Lib.bind(Lib.cancelEvent, Lib));
        content.bind("dragover", Lib.bind(Lib.cancelEvent, Lib));
        content.bind("drop", Lib.bind(this.onDrop, this));

        // Load examples
        $(".example").click(Lib.bind(this.onLoadExample, this));
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Events

    onAppendPreview: function(jsonString)
    {
        if (!jsonString)
            jsonString = $("#sourceEditor").val();

        if (jsonString)
            this.tabView.appendPreview(jsonString);
    },

    onAbout: function()
    {
        this.tabView.selectTabByName("About");
    },

    onLoadExample: function(event)
    {
        var e = $.event.fix(event || window.event);
        var path = e.target.getAttribute("path");

        var href = document.location.href;
        var index = href.indexOf("?");
        document.location = href.substr(0, index) + "?path=" + path;

        // Show timeline and stats by default if an example is displayed.
        Cookies.setCookie("timeline", true);
        Cookies.setCookie("stats", true);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    onDrop: function(event)
    {
        var e = $.event.fix(event || window.event);
        Lib.cancelEvent(e);

        try
        {
            this.handleDrop(event.originalEvent.dataTransfer);
        }
        catch (err)
        {
            Trace.exception("HomeTab.onDrop EXCEPTION", err);
        }
    },

    handleDrop: function(dataTransfer)
    {
        if (!dataTransfer)
            return false;

        var files = dataTransfer.files;
        if (!files)
            return;

        for (var i=0; i<files.length; i++)
            this.onAppendPreview(files[i].getAsText(""));
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    loadInProgress: function(show, msg)
    {
        $("#sourceEditor").val(show ? (msg ? msg : Strings.loadingHar) : "");
    }
});

return HomeTab;

//*************************************************************************************************
}});
