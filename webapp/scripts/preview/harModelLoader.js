/* See license.txt for terms of usage */

/**
 * @module preview/harModelLoader
 */
define([
    "core/url"
],

function(Url) {

/**
 * Return type for `Loader.getLoadOptions()`.
 *
 * @typedef {Object} LoadOptions
 *
 * @property {string} callbackName
 *   Used as the callback name when loading HARPs (JSONP).
 * @property {string} baseUrl
 *   Will be prepended to "path", "har" and "harp" URL parameters if provided.
 * @property {string[]} hars
 *   A list of HAR files to load.
 * @property {string[]} harps
 *   A list of HARP files to load.
 * @property {string[]} urls
 *   Legacy parameter. Derived from the "path" and "inputUrl" URL parameters.
 * @property {string[]} inputUrls
 *   Legacy parameter. Derived from "inputUrl" URL parameters to specific HARP files to load.
 * @property {string} filePath
 *   Legacy parameter. Derived from the first "path" URL parameter.
 */

/**
 * Helper for loading HAR resources.
 *
 * @alias module:preview/harModelLoader
 */
var Loader =
{
    /**
     * @param {string} url
     *   The URL to create the load options for.
     * @return {module:preview/harModelLoader~LoadOptions}
     */
    getLoadOptions: function(url) {
        var baseUrl = Url.getURLParameter("baseUrl", url);

        // Append traling slash if missing.
        if (baseUrl && baseUrl[baseUrl.length-1] !== "/") {
            baseUrl += "/";
        }

        var callbackName = Url.getURLParameter("callback", url);
        var filePath = Url.getURLParameter("path", url);

        // Legacy path and inputUrl
        var paths = Url.getURLParameters("path", url);
        var inputUrls = Url.getURLParameters("inputUrl", url).concat(Url.getHashParameters("inputUrl", url));

        var urls = paths.map(function(path) {
            return baseUrl ? baseUrl + path : path;
        });

        urls = urls.concat(inputUrls);
        // End Legacy path and inputUrl

        // New har and harp
        var hars = Url.getURLParameters("har", url);
        var harps = Url.getURLParameters("harp", url).concat(Url.getHashParameters("harp", url));

        if (baseUrl) {
            hars = hars.map(function(har) {
                return baseUrl + har;
            });
            harps = harps.map(function(harp) {
                return baseUrl + harp;
            });
        }
        // End New har and harp

        return {
            callbackName: callbackName,
            baseUrl: baseUrl,
            urls: urls,
            inputUrls: inputUrls,
            hars: hars,
            harps: harps,
            filePath: filePath
        };
    },

    /**
     * Uses the parameters provided in `window.location.href` to load HAR and or HARP files.
     */
    run: function(callback, errorCallback)
    {
        var loadOptions = this.getLoadOptions(window.location.href);

        // New params
        if (loadOptions.hars.length > 0 || loadOptions.harps.length > 0) {
            return this.loadArchives(loadOptions.hars, loadOptions.harps, loadOptions.callbackName, callback, errorCallback);
        }

        // Legacy params
        if ((loadOptions.baseUrl || loadOptions.inputUrls.length > 0) && loadOptions.urls.length > 0) {
            // The assumption here is that we load as HARP (JSONP).
            return this.loadArchives([], loadOptions.urls, loadOptions.callbackName, callback, errorCallback);
        }

        // Legacy params
        // The URL can specify also a locale file (with the same domain).
        // http://domain/har/viewer?path=<local-file-path>
        if (loadOptions.filePath) {
            // The assumption here is that we load as HAR (XHR).
            return this.loadArchives([loadOptions.filePath], [], loadOptions.callbackName, callback, errorCallback);
        }
    },

    /**
     * @param {string[]} hars
     *   Load these HARs (via XHR, same-domain or cross-domain).
     * @param {string[]} harps
     *   Load these HARPs (via JSONP, same-domain or cross-domain).
     * @param {string} callbackName
     *   Use this callback name for any HARPs (JSONP).
     * @param {function} callback
     *   Called when a HAR/HARP is loaded successfully.
     * @param {function} errorCallback
     *   Called when any HAR/HARP fails to load.
     * @param {function} doneCallback
     *   Called when all HARs/HARPs are loaded successfully.
     * @return {boolean}
     *   `true` if there was any HAR/HARP to load, `false` otherwise.
     */
    loadArchives: function(hars, harps, callbackName, callback, errorCallback, doneCallback)
    {
        function done() {
            if (doneCallback) {
                doneCallback();
            }
        }

        hars = hars || [];
        harps = harps || [];

        var isHarp = false;

        // try a HAR first
        var url = hars.shift();

        if (!url) {
            // No HARs, try a HARP
            isHarp = true;
            url = harps.shift();
        }

        if (!url) {
            // No HAR or HARP.  We're done.
            done();
            return false;
        }

        if (!callbackName) {
            callbackName = "onInputData";
        }

        var ajaxOpts = {
            url: url,
            context: this,
            dataType: "json",

            success: function() {
                if (callback) {
                    callback.apply(this, arguments);
                }

                if (hars.length + harps.length === 0) {
                    done();
                    return;
                }

                // Asynchronously load other HAR files (jQuery doesn't like it synchronously).
                var self = this;
                setTimeout(function() {
                    self.loadArchives(hars, harps, callbackName, callback, errorCallback, doneCallback);
                }, 300);
            },

            error: function() {
                // Here to place breakpoints :)
                if (errorCallback) {
                    errorCallback.apply(this, arguments);
                }
            }
        };

        if (isHarp) {
            ajaxOpts.dataType = "jsonp";
            ajaxOpts.jsonp = "callback";
            ajaxOpts.jsonpCallback = callbackName;
        }

        this.ajax(ajaxOpts);

        return true;
    },

    ajax: function(ajaxOpts) {
        $.ajax(ajaxOpts);
    },

    /**
     * @param {object} scope
     *   Scope to execute the callbacks in.
     * @param {string} url
     *   The url of the file to load (HAR or HARP).
     * @param {boolean} isHarp
     *   Set to `true` if the url to load is a HARP, otherwise it will be loaded as a HAR.
     * @param {string} callbackName
     *   Callback name to use if loading a HARP.
     * @param {function} callback
     *   Called when HAR/HARP loads successfully.
     * @param {function} errorCallback
     *   Called when HAR/HARP fails to load.
     */
    load: function(scope, url, isHarp, callbackName, callback, errorCallback)
    {
        function onLoaded(input)
        {
            if (scope.appendPreview) {
                scope.appendPreview(input);
            }

            if (callback) {
                callback.call(scope, input);
            }
        }

        function onError(jqXHR, textStatus, errorThrown)
        {
            if (scope.onLoadError) {
                scope.onLoadError(jqXHR, textStatus, errorThrown);
            }

            if (errorCallback) {
                errorCallback.call(scope, jqXHR, textStatus, errorThrown);
            }
        }

        var hars = [];
        var harps = [];
        if (isHarp) {
            harps.push(url);
        } else {
            hars.push(url);
        }

        return this.loadArchives(hars, harps, callbackName, onLoaded, onError);
    }
};

return Loader;

//*************************************************************************************************
});
