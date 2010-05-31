/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR) {

//-----------------------------------------------------------------------------

/**
 * @object This object is responsible for loading HAR files.
 */
HAR.Model.Loader = extend(
{
    run: function()
    {
        // The URL can specify default file with input data.
        // http://domain/har/viewer?path=<local-file-path>
        var filePath = HAR.Lib.getURLParameter("example");
        if (!filePath)
            filePath = HAR.Lib.getURLParameter("path");

        if (filePath)
            this.loadLocalArchive(filePath);

        // Load input date (using JSONP) from remote location.
        // http://domain/har/viewer?inputUrl=<remote-file-url>&callback=<name-of-the-callback>
        var inputUrl = HAR.Lib.getURLParameter("inputUrl");
        var callback = HAR.Lib.getURLParameter("callback");
        if (inputUrl)
            this.loadRemoteArchive(inputUrl, callback);
    },

    loadLocalArchive: function(filePath, callback)
    {
        HAR.log("har; loadLocalArchive " + filePath);

        var editor = HAR.$("sourceEditor");
        if (editor)
            editor.value = "Loading...";

        // Execute XHR to get a local file (the same domain).
        dojo.xhrGet(
        {
            url: filePath,
            handleAs: "text",

            load: function(response, ioArgs)
            {
                // Call specified callback or press the Preview button by default.
                if (callback)
                    callback(response);
                else
                    HAR.Tab.InputView.onAppendPreview(response);
            },

            error: function(response, ioArgs)
            {
                HAR.error("har; loadLocalArchive ERROR " + response);
                if (editor)
                    editor.value = response;
            }
        });
    },

    loadRemoteArchive: function(url, callbackName)
    {
        HAR.log("har; loadRemoteArchive: " + url + ", " + callbackName);

        if (!callbackName)
            callbackName = "onInputData";

        var editor = HAR.$("sourceEditor");
        editor.value = "Loading...";

        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.src = url;

        // xxxHonza: delete window[propName] throws an exception.
        window[callbackName] = new Function(
            "HAR.Model.Loader.onRemoteArchiveLoaded.apply(HAR.Viewer, arguments);" +
            "if (!dojo.isIE) delete window[" + callbackName + "];");

        // Attach handlers for all browsers
        var done = false;
        script.onload = script.onreadystatechange = function()
        {
            if (!done && (!this.readyState || 
                this.readyState == "loaded" || 
                this.readyState == "complete"))
            {
                done = true;
                head.removeChild(script);
                HAR.log("har; Remote archive loaded: " + url);
            }
        };
        head.appendChild(script);
    },

    onRemoteArchiveLoaded: function(data)
    {
        HAR.log("har; HAR.Viewer.onRemoteArchiveLoaded");

        var jsonString = dojo.toJson(data, true);
        HAR.Tab.InputView.onAppendPreview(jsonString);
    },

    loadExample: function(path)
    {
        var href = document.location.href;
        var index = href.indexOf("?");
        document.location = href.substr(0, index) + "?path=" + path;

        // Show timeline and stats by default if an example is displayed.
        HAR.Lib.setCookie("timeline", true);
        HAR.Lib.setCookie("stats", true);
    }
});

//-----------------------------------------------------------------------------
}});
