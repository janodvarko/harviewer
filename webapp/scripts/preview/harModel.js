/* See license.txt for terms of usage */
/* See license.txt for terms of usage */

/**
 * @module preview/harModel
 */
define([
    "../core/lib",
    "./jsonSchema",
    "./ref",
    "./harSchema",
    "../core/cookies",
    "../core/trace",
    "i18n!../nls/harModel",
],

function(Lib, JSONSchema, Ref, HarSchema, Cookies, Trace, Strings) {

//*************************************************************************************************
// Statistics

/**
 * @constructor
 * @alias module:preview/harModel
 */
function HarModel()
{
    this.input = null;
}

HarModel.prototype =
/** @lends module:preview/harModel.prototype */
{
    append: function(input)
    {
        if (!input)
        {
            Trace.error("HarModel.append; Trying to append null input!");
            return;
        }

        function sortByStartedDateTime(arr) {
            arr.sort(function(a, b) {
                var timeA = Lib.parseISO8601(a.startedDateTime);
                var timeB = Lib.parseISO8601(b.startedDateTime);
                return timeA - timeB;
            });
        }

        // Sort all pages according to the start time.
        if (input.log.pages) {
            sortByStartedDateTime(input.log.pages);
        }

        // Sort all requests according to the start time.
        if (input.log.entries) {
            sortByStartedDateTime(input.log.entries);
        }

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

    /**
     * @return {Array} An array of page objects.
     */
    getPages: function()
    {
        if (!this.input)
            return [];

        return this.input.log.pages ? this.input.log.pages : [];
    },

    /**
     * @return {Page} The first page if it exists, else null.
     */
    getFirstPage: function()
    {
        var pages = this.getPages();
        return pages.length > 0 ? pages[0] : null;
    },

    /**
     * @see {@link module:preview/harModel.getPageEntries}
     */
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
            if (entry.pageref === prevPageId)
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

        var jsonString = JSON.stringify(this.input, null, "\t");
        var result = jsonString.replace(/\\\\u/g, "\\u");
        return result;
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
        Trace.exception("HarModel.parse; EXCEPTION", err);

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
/**
 * If `page` is not provided, then return all the HAR entries without a parent `Page`.
 * If `page` is provided, then return all the HAR entries whose `pageref` matches `page.id`.
 * @param {HAR} input The input HAR object.
 * @param {Page} page The `Page` object to use to search for entries.
 * @return {Array} The `Page` entries.
 */
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
        if (page && entry.pageref === page.id)
            result.push(entry);
    }

    return result;
};

// xxxHonza: optimize using a map?
/**
 * @param {HAR} input The input HAR object.
 * @param {Entry} file The `Entry` object to use to find the parent `Page`.
 * @return {Page} The parent `Page` of the file/`Entry`, or null if a parent `Page` could not be
 *     found.
 */
HarModel.getParentPage = function(input, file)
{
    var pages = input.log.pages;
    if (!pages)
        return null;

    for (var i=0; i<pages.length; i++)
    {
        if (pages[i].id === file.pageref)
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
};

function ensureNumber(value, default_) {
    if (typeof value === "number") {
        return value;
    }
    if (typeof default_ === "number") {
        return default_;
    }
    return -1;
}

HarModel.isCachedEntry = function(entry) {
    if (entry.response.status === 304) {
        return true;
    }
    var transferSize = ensureNumber(entry.response._transferSize);
    if (transferSize > 0) {
        // "_transferSize" is a Chrome property.
        return false;
    }
    var resBodySize = Math.max(0, entry.response.bodySize);
    return (resBodySize === 0 && entry.response.content && entry.response.content.size > 0);
};

HarModel.getEntrySize = function(entry) {
    return HarModel.getEntryTransferredSize(entry);
};

HarModel.getEntryUncompressedSize = function(entry) {
    var contentSize = ensureNumber(entry.response.content.size);
    if (contentSize > -1) {
        return contentSize;
    }
    var transferSize = ensureNumber(entry.response._transferSize);
    if (transferSize > -1) {
        // "_transferSize" is a Chrome property.
        return transferSize;
    }
    var bodySize = ensureNumber(entry.response.bodySize);
    if (bodySize > -1) {
        return bodySize;
    }
    return -1;
};

HarModel.getEntryTransferredSize = function(entry) {
    var transferSize = ensureNumber(entry.response._transferSize);
    if (transferSize > -1) {
        // "_transferSize" is a Chrome property.
        return transferSize;
    }
    var bodySize = ensureNumber(entry.response.bodySize);
    if (bodySize > -1) {
        return bodySize;
    }
    return -1;
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Make sure the response (it can be binary) is converted to Unicode.
function contentToUnicode()
{
    var newContent = {};
    for (var prop in this) {
        if (prop !== "toJSON")
            newContent[prop] = this[prop];
    }

    if (!this.text)
        return newContent;

    newContent.text = Array.prototype.map.call(this.text, function(x) {
        var charCode = x.charCodeAt(0);
        if ((charCode >= 0x20 && charCode < 0x7F) ||
             charCode === 0xA || charCode === 0xD)
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
