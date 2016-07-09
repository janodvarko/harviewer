/* See license.txt for terms of usage */

/**
 * @module preview/harModelLoader
 */
define([
    "core/url"
],

function(Url) {

/**
 * Helper for loading HAR resources.
 * @namespace
 */
var Loader =
{
    run: function(callback, errorCallback)
    {
        var baseUrl = Url.getURLParameter("baseUrl");

        // Append traling slahs if missing.
        if (baseUrl && baseUrl[baseUrl.length-1] !== "/")
            baseUrl += "/";

        var paths = Url.getURLParameters("path");
        var callbackName = Url.getURLParameter("callback");
        var inputUrls = Url.getURLParameters("inputUrl").concat(Url.getHashParameters("inputUrl"));

        //for (var p in inputUrls)
        //    inputUrls[p] = inputUrls[p].replace(/%/g,'%25');

        var urls = paths.map(function(path) {
            return baseUrl ? baseUrl + path : path;
        });

        // Load input data (using JSONP) from remote location.
        // http://domain/har/viewer?inputUrl=<remote-file-url>&callback=<name-of-the-callback>
        urls = urls.concat(inputUrls);

        if ((baseUrl || inputUrls.length > 0) && urls.length > 0)
            return this.loadRemoteArchive(urls, callbackName, callback, errorCallback);

        // The URL can specify also a locale file (with the same domain).
        // http://domain/har/viewer?path=<local-file-path>
        var filePath = Url.getURLParameter("path");
        if (filePath)
            return this.loadLocalArchive(filePath, callback, errorCallback);
    },

    /**
     * Loads the HAR from `filePath` as JSON using Ajax.
     * @param {String} filePath The path to the HAR.
     * @param {Function} callback Called when load is successful.
     * @param {Function} errorCallback Called when load fails.
     */
    loadLocalArchive: function(filePath, callback, errorCallback)
    {
        // Execute XHR to get a local file (the same domain).
        $.ajax({
            url: filePath,
            context: this,
            dataType: "json",
            success: callback,
            error: errorCallback
        });

        return true;
    },

    loadRemoteArchive: function(urls, callbackName, callback, errorCallback)
    {
        if (!urls.length)
            return false;

        // Get the first URL in the queue.
        var url = urls.shift();

        if (!callbackName)
            callbackName = "onInputData";

        $.ajax({
            url: url,
            context: this,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: callbackName,

            success: function(response)
            {
                if (callback)
                    callback(response);

                // Asynchronously load other HAR files (jQuery doesn't like is synchronously).
                // The timeout specifies how much the browser UI cane be frozen.
                if (urls.length)
                {
                    var self = this;
                    setTimeout(function() {
                        self.loadRemoteArchive(urls, callbackName, callback, errorCallback);
                    }, 300);
                }
            },

            error: errorCallback
        });

        return true;
    },

    load: function(scope, url, crossDomain, callbackName, callback, errorCallback)
    {
        function onLoaded(input)
        {
            if (scope.appendPreview)
                scope.appendPreview(input);

            if (callback)
                callback.call(scope, input);
        }

        function onError(jqXHR, textStatus, errorThrown)
        {
            if (scope.onLoadError)
                scope.onLoadError(jqXHR, textStatus, errorThrown);

            if (errorCallback)
                errorCallback.call(scope, jqXHR, textStatus, errorThrown);
        }

        if (crossDomain)
            return this.loadRemoteArchive([url], callbackName, onLoaded, onError);

        return this.loadLocalArchive(url, onLoaded, onError);
    }
};

return Loader;

//*************************************************************************************************
});
