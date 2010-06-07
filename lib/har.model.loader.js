/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR) {

//-----------------------------------------------------------------------------

/**
 * @object This object is responsible for loading HAR files specified in the URL
 * into the viewer.
 * 
 * Examples:
 * 1) http://har/viewer?path=<local-file-path>
 * 2) http://har/viewer?inputUrl=<remote-file-url>&callback=<name-of-the-callback>
 * 3) http://har/viewer?baseUrl=<remote-base-url>&path=1.har&path=2.har&callback=<name-of-the-callback>
 */
HAR.Model.Loader = extend(
{
    run: function()
    {
        var baseUrl = HAR.Lib.getURLParameter("baseUrl");
        var paths = HAR.Lib.getURLParameters("path");
        var callbackName = HAR.Lib.getURLParameter("callback");
        var inputUrl = HAR.Lib.getURLParameter("inputUrl");

        var urls = [];
        for (var p in paths)
            urls.push(baseUrl ? baseUrl + paths[p] : paths[p]);

        // Load input data (using JSONP) from remote location.
        // http://domain/har/viewer?inputUrl=<remote-file-url>&callback=<name-of-the-callback>
        if (inputUrl)
            urls.push(inputUrl);

        if ((baseUrl || inputUrl) && urls.length > 0)
        {
            this.loadRemoteArchive(urls, callbackName);
            return;
        }

        // The URL can specify also a locale file (with the same domain).
        // http://domain/har/viewer?path=<local-file-path>
        var filePath = HAR.Lib.getURLParameter("path");
        if (filePath)
            this.loadLocalArchive(filePath);
    },

    loadExample: function(path)
    {
        var href = document.location.href;
        var index = href.indexOf("?");
        document.location = href.substr(0, index) + "?path=" + path;

        // Show timeline and stats by default if an example is displayed.
        HAR.Lib.setCookie("timeline", true);
        HAR.Lib.setCookie("stats", true);
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

    loadRemoteArchive: function(urls, callbackName)
    {
        if (!urls.length)
            return;

        this.loadQueue = urls;
        this.callbackName = callbackName;

        // Load the first URL in the queue.
        var url = urls.shift();

        HAR.log("har; HAR.Model.Loader.loadRemoteArchive: " + url);

        if (!callbackName)
            callbackName = "onInputData";

        var editor = HAR.$("sourceEditor");
        editor.value = "Loading...";

        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.src = url;

        // xxxHonza: delete window[propName] throws an exception.
        window[callbackName] = new Function(
            "HAR.Model.Loader.onRemoteArchiveLoaded.apply(HAR.Model.Loader, arguments);" +
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
        HAR.log("har; HAR.Model.Loader.onRemoteArchiveLoaded");

        var jsonString = dojo.toJson(data, true);
        HAR.Tab.InputView.onAppendPreview(jsonString);

        this.loadRemoteArchive(this.loadQueue, this.callbackName);
    }
});

//-----------------------------------------------------------------------------
}});
