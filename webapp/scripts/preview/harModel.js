/* See license.txt for terms of usage */

require.def("preview/harModel", [
    "core/lib",
    "preview/jsonSchema",
    "preview/ref",
    "preview/harSchema",
    "core/cookies",
    "core/trace",
    "i18n!nls/harModel",
    "jquery-plugins/jquery.json"
],

function(Lib, JSONSchema, Ref, HarSchema, Cookies, Trace, Strings) {

//*************************************************************************************************
// Statistics

function HarModel()
{
    this.input = null;
}

HarModel.prototype =
{
    append: function(input)
    {
        if (!input)
        {
            Trace.error("HarModel.append; Trying to append null input!");
            return;
        }

        // Sort all requests according to the start time.
        input.log.entries.sort(function(a, b)
        {
            var timeA = Lib.parseISO8601(a.startedDateTime);
            var timeB = Lib.parseISO8601(b.startedDateTime);

            if (timeA < timeB)
                return -1;
            else if (timeA > timeB)
                return 1;

            return 0;
        })

        if (this.input)
        {
            if (input.log.pages)
            {
                for (var i=0; i<input.log.pages.length; i++)
                    this.importPage(input.log.pages[i], input.log.entries);
            }
            else
            {
                Trace.error("Import of additional data without a page is not yet supported.");
                //xxxHonza: how to properly import data with no page?
                //for (var i=0; i<input.log.entries.length; i++)
                //    this.input.log.entries.push(input.log.entries[i]);
                return null;
            }
        }
        else
        {
            this.input = Lib.cloneJSON(input);
        }

        return this.input;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Pages

    getPages: function()
    {
        if (!this.input)
            return [];

        return this.input.log.pages ? this.input.log.pages : [];
    },

    getFirstPage: function()
    {
        var pages = this.getPages();
        return pages.length > 0 ? pages[0] : null;
    },

    getPageEntries: function(page)
    {
        return HarModel.getPageEntries(this.input, page);
    },

    getAllEntries: function(page)
    {
        return this.input ? this.input.log.entries : [];
    },

    getParentPage: function(file)
    {
        return HarModel.getParentPage(this.input, file);
    },

    importPage: function(page, entries)
    {
        var pageId = this.getUniquePageID(page.id);
        var prevPageId = page.id;
        page.id = pageId;

        this.input.log.pages.push(page);
        for (var i=0; i<entries.length; i++)
        {
            var entry = entries[i];
            if (entry.pageref == prevPageId)
            {
                entry.pageref = pageId;
                this.input.log.entries.push(entry);
            }
        }
    },

    getUniquePageID: function(defaultId)
    {
        var pages = this.input.log.pages;
        var hashTable = {};
        for (var i=0; i<pages.length; i++)
            hashTable[pages[i].id] = true;

        if (!hashTable[defaultId])
            return defaultId;

        var counter = 1;
        while (true)
        {
            var pageId = defaultId + counter;
            if (!hashTable[pageId])
                return pageId;
            counter++;
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // JSON

    toJSON : function(input)
    {
        if (!input)
            input = this.input;

        if (!input)
            return "";

        // xxxHonza: we don't have to iterate all entries again if it did already.
        var entries = this.input.log.entries;
        for (var i=0; i<entries.length; i++) {
            var entry = entries[i];
            if (entry.response.content.text)
                entry.response.content.toJSON = contentToUnicode;
        }

        var jsonString = $.jSONToString(this.input, null, "\t");
        var result = jsonString.replace(/\\\\u/g, "\\u");
        return result;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Statistics

    getSize: function(input)
    {
        if (!input)
            input = this.input;

        if (!input)
            return 0;

        var jsonString = dojo.toJson(input, true);
        return jsonString.length;
    }
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
// Static methods (no instance of the model, no |this| )

HarModel.parse = function(jsonString, validate)
{
    var input = jsonString;

    try
    {
        if (typeof(jsonString) === "string")
            input = jQuery.parseJSON(jsonString);
    }
    catch (err)
    {
        console.exception("HarModel.parse; EXCEPTION", err);

        throw {
            errors: [{
                "message": "Failed to parse JSON",
                "property": "JSON evaluation"
            }]
        };
    }

    if (!validate)
        return input;

    //xxxHonza: the schema doesn't have to be resolved repeatedly.
    var resolvedSchema = Ref.resolveJson(HarSchema);
    var result = JSONSchema.validate(input, resolvedSchema.logType);
    if (result.valid)
    {
        this.validateRequestTimings(input);
        return input;
    }


    throw result;
};

// xxxHonza: optimalization using a map?
HarModel.getPageEntries = function(input, page)
{
    var result = [];

    var entries = input.log.entries;
    if (!entries)
        return result;

    for (var i=0; i<entries.length; i++)
    {
        var entry = entries[i];

        // Return all requests that doesn't have a parent page.
        if (!entry.pageref && !page)
            result.push(entry);

        // Return all requests for the specified page.
        if (page && entry.pageref == page.id)
            result.push(entry);
    }

    return result;
};

// xxxHonza: optimize using a map?
HarModel.getParentPage = function(input, file)
{
    var pages = input.log.pages;
    if (!pages)
        return null;

    for (var i=0; i<pages.length; i++)
    {
        if (pages[i].id == file.pageref)
            return pages[i];
    }

    return null;
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
// Validation

HarModel.validateRequestTimings = function(input)
{
    var errors = [];

    // Iterate all request timings and check the total time.
    var entries = input.log.entries;
    for (var i=0; i<entries.length; i++)
    {
        var entry = entries[i];
        var timings = entry.timings;

        /* http://code.google.com/p/chromium/issues/detail?id=339551
        var total = 0;
        for (var p in timings)
        {
            var time = parseInt(timings[p], 10);

            // According to the spec, the ssl time is alrady included in "connect".
            if (p != "ssl" && time > 0)
                total += time;
        }

        if (total != entry.time)
        {
            var message = Lib.formatString(Strings.validationSumTimeError,
                entry.request.url, entry.time, total, i, entry.pageref);

            errors.push({
                input: input,
                file: entry,
                "message": message,
                "property": Strings.validationType
            });
        }*/

        if (timings.blocked < -1 ||
            timings.connect < -1 ||
            timings.dns < -1 ||
            timings.receive < -1 ||
            timings.send < -1 ||
            timings.wait < -1)
        {
            var message = Lib.formatString(Strings.validationNegativeTimeError,
                entry.request.url, i, entry.pageref);

            errors.push({
                input: input,
                file: entry,
                "message": message,
                "property": Strings.validationType
            });
        }
    }

    if (errors.length)
        throw {errors: errors, input: input};
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

HarModel.Loader =
{
    run: function(callback, errorCallback)
    {
        var baseUrl = Lib.getURLParameter("baseUrl");

        // Append traling slahs if missing.
        if (baseUrl && baseUrl[baseUrl.length-1] != "/")
            baseUrl += "/";

        var paths = Lib.getURLParameters("path");
        var callbackName = Lib.getURLParameter("callback");
        var inputUrls = Lib.getURLParameters("inputUrl");

        //for (var p in inputUrls)
        //    inputUrls[p] = inputUrls[p].replace(/%/g,'%25');

        var urls = [];
        for (var p in paths)
            urls.push(baseUrl ? baseUrl + paths[p] : paths[p]);

        // Load input data (using JSONP) from remote location.
        // http://domain/har/viewer?inputUrl=<remote-file-url>&callback=<name-of-the-callback>
        for (var p in inputUrls)
            urls.push(inputUrls[p]);

        if ((baseUrl || inputUrls.length > 0) && urls.length > 0)
            return this.loadRemoteArchive(urls, callbackName, callback, errorCallback);

        // The URL can specify also a locale file (with the same domain).
        // http://domain/har/viewer?path=<local-file-path>
        var filePath = Lib.getURLParameter("path");
        if (filePath)
            return this.loadLocalArchive(filePath, callback, errorCallback);
    },

    loadExample: function(path, callback)
    {
        var href = document.location.href;
        var index = href.indexOf("?");
        document.location = href.substr(0, index) + "?path=" + path;

        // Show timeline and stats by default if an example is displayed.
        Cookies.setCookie("timeline", true);
        Cookies.setCookie("stats", true);
    },

    loadLocalArchive: function(filePath, callback, errorCallback)
    {
        // Execute XHR to get a local file (the same domain).
        $.ajax({
            url: filePath,
            context: this,

            success: function(response)
            {
                callback(response);
            },

            error: function(response, ioArgs)
            {
                errorCallback(response, ioArgs);
            }
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

            error: function(response, ioArgs)
            {
                if (errorCallback)
                    errorCallback(response, ioArgs);
            }
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

        function onError(response, args)
        {
            if (scope.onLoadError)
                scope.onLoadError(response, args);

            if (errorCallback)
                errorCallback.call(scope, response, args);
        }

        if (crossDomain)
            return this.loadRemoteArchive([url], callbackName, onLoaded, onError);
        else
            return this.loadLocalArchive(url, onLoaded, onError);
    }
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Make sure the response (it can be binary) is converted to Unicode.
function contentToUnicode()
{
    var newContent = {};
    for (var prop in this) {
        if (prop != "toJSON")
            newContent[prop] = this[prop];
    }

    if (!this.text)
        return newContent;

    newContent.text = Array.map(this.text, function(x) {
        var charCode = x.charCodeAt(0);
        if ((charCode >= 0x20 && charCode < 0x7F) ||
             charCode == 0xA || charCode == 0xD)
            return x.charAt(0);

        var unicode = charCode.toString(16).toUpperCase();
        while (unicode.length < 4)
            unicode = "0" + unicode;
        return "\\u" + unicode;
    }).join("");

    return newContent;
}

return HarModel;

//*************************************************************************************************
});
