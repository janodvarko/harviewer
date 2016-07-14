/* See license.txt for terms of usage */

/**
 * @module core/StatsService
 */
define("core/StatsService", [
    "core/lib",
    "preview/harModel"
],

function(Lib, HarModel) {

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var jsTypes = {
    "text/javascript": 1,
    "text/jscript": 1,
    "application/javascript": 1,
    "application/x-javascript": 1,
    "text/js": 1
};

var htmlTypes = {
    "text/plain": 1,
    "text/html": 1
};

var cssTypes = {
    "text/css": 1
};

var imageTypes = {
    "image/png": 1,
    "image/jpeg": 1,
    "image/gif": 1
};

var flashTypes = {
    "application/x-shockwave-flash": 1
};

// eslint-disable-next-line no-unused-vars
var jsonTypes = {
    "text/x-json": 1,
    "text/x-js": 1,
    "application/json": 1,
    "application/x-js": 1
};

// eslint-disable-next-line no-unused-vars
var xmlTypes = {
    "application/xml": 1,
    "application/xhtml+xml": 1,
    "application/vnd.mozilla.xul+xml": 1,
    "text/xml": 1,
    "text/xul": 1,
    "application/rdf+xml": 1
};

// eslint-disable-next-line no-unused-vars
var unknownTypes = {
    "text/xsl": 1,
    "text/sgml": 1,
    "text/rtf": 1,
    "text/x-setext": 1,
    "text/richtext": 1,
    "text/tab-separated-values": 1,
    "text/rdf": 1,
    "text/xif": 1,
    "text/ecmascript": 1,
    "text/vnd.curl": 1,
    "text/vbscript": 1,
    "view-source": 1,
    "view-fragment": 1,
    "application/x-httpd-php": 1,
    "application/ecmascript": 1,
    "application/http-index-format": 1
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

/**
 * Returns a positive numeric value for the value provided.
 * If the value is not a number, zero is returned.
 * If the value is a number and is less than zero, zero is returned.
 * If the value is a number and is zero or greater, return value.
 *
 * @param value
 */
function ensurePositive(value) {
    return ("number" === typeof value) ? Math.max(0, value) : 0;
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function StatsService(model)
{
    this.model = model;
}

/**
 */
StatsService.prototype = {
    forEachPageEntries: function(pages, fn) {
        // Iterate over all selected pages
        for (var j = 0; j < pages.length; j++) {
            var page = pages[j];

            // Iterate over all requests and compute stats.
            var entries = page ? this.model.getPageEntries(page) : this.model.getAllEntries();
            fn(entries, page, pages);
        }
    },

    calcTimingsTotalsForEntries: function(entries, totals) {
        if (!Lib.isArray(entries)) {
            throw new Error("entries must be an array");
        }

        totals = totals || {
            blocked: 0,
            dns: 0,
            ssl: 0,
            connect: 0,
            send: 0,
            wait: 0,
            receive: 0
        };

        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];

            if (!entry.timings) {
                continue;
            }

            // Get timing info (SSL is new in HAR 1.2)
            totals.blocked += ensurePositive(entry.timings.blocked);
            totals.dns += ensurePositive(entry.timings.dns);
            totals.ssl += ensurePositive(entry.timings.ssl);
            totals.connect += ensurePositive(entry.timings.connect);
            totals.send += ensurePositive(entry.timings.send);
            totals.wait += ensurePositive(entry.timings.wait);
            totals.receive += ensurePositive(entry.timings.receive);

            // The ssl time is also included in the connect field, see HAR 1.2 spec
            // (to ensure backward compatibility with HAR 1.1).
            if (entry.timings.ssl > 0) {
                totals.ssl -= entry.timings.ssl;
            }
        }

        return totals;
    },

    calcTimingsTotalsForPages: function(pages) {
        var totals;
        var self = this;
        this.forEachPageEntries(pages, function(entries) {
            // totals is created by calcTimingsTotalsForEntries if not provided
            totals = self.calcTimingsTotalsForEntries(entries, totals);
        });
        return totals;
    },

    calcContentTotalsForEntries: function(entries, totals) {
        if (!Lib.isArray(entries)) {
            throw new Error("entries must be an array");
        }

        totals = totals || {
            html: { resBodySize: 0, count: 0 },
            js: { resBodySize: 0, count: 0 },
            css: { resBodySize: 0, count: 0 },
            image: { resBodySize: 0, count: 0 },
            flash: { resBodySize: 0, count: 0 },
            other: { resBodySize: 0, count: 0 }
        };

        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];

            if (!entry.timings) {
                continue;
            }

            var response = entry.response;
            var resBodySize = ensurePositive(response.bodySize);

            // Get Content type info. Make sure we read the right content type
            // even if there is also a charset specified.
            var mimeType = response.content.mimeType;
            var contentType = mimeType ? mimeType.match(/^([^;]+)/)[1] : null;
            mimeType = contentType ? contentType : response.content.mimeType;

            // Collect response sizes according to the mimeType.
            if (htmlTypes[mimeType]) {
                totals.html.resBodySize += resBodySize;
                totals.html.count++;
            }
            else if (jsTypes[mimeType]) {
                totals.js.resBodySize += resBodySize;
                totals.js.count++;
            }
            else if (cssTypes[mimeType]) {
                totals.css.resBodySize += resBodySize;
                totals.css.count++;
            }
            else if (imageTypes[mimeType]) {
                totals.image.resBodySize += resBodySize;
                totals.image.count++;
            }
            else if (flashTypes[mimeType]) {
                totals.flash.resBodySize += resBodySize;
                totals.flash.count++;
            }
            else {
                totals.other.resBodySize += resBodySize;
                totals.other.count++;
            }
        }

        return totals;
    },

    calcContentTotalsForPages: function(pages) {
        var totals;
        var self = this;
        this.forEachPageEntries(pages, function(entries) {
            // totals is created by calcContentTotalsForEntries if not provided
            totals = self.calcContentTotalsForEntries(entries, totals);
        });
        return totals;
    },

    calcTrafficTotalsForEntries: function(entries, totals) {
        if (!Lib.isArray(entries)) {
            throw new Error("entries must be an array");
        }

        totals = totals || {
            request: { headersSize: 0, bodySize: 0 },
            response: { headersSize: 0, bodySize: 0 }
        };

        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];

            if (!entry.timings) {
                continue;
            }

            var response = entry.response;

            // Get traffic info
            totals.request.headersSize += ensurePositive(entry.request.headersSize);
            totals.request.bodySize += ensurePositive(entry.request.bodySize);
            totals.response.headersSize += ensurePositive(entry.response.headersSize);
            totals.response.bodySize += ensurePositive(response.bodySize);
        }

        return totals;
    },

    calcTrafficTotalsForPages: function(pages) {
        var totals;
        var self = this;
        this.forEachPageEntries(pages, function(entries) {
            // totals is created by calcTrafficTotalsForEntries if not provided
            totals = self.calcTrafficTotalsForEntries(entries, totals);
        });
        return totals;
    },

    calcCacheTotalsForEntries: function(entries, totals) {
        if (!Lib.isArray(entries)) {
            throw new Error("entries must be an array");
        }

        totals = totals || {
            partial: { count: 0, resBodySize: 0 },
            cached: { count: 0, resBodySize: 0 },
            downloaded: { count: 0, resBodySize: 0 }
        };

        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];

            var response = entry.response;
            var resBodySize = ensurePositive(response.bodySize);

            // Get Cache info
            if (entry.response.status === 206) { // Partial content
                totals.partial.resBodySize += resBodySize;
                totals.partial.count++;
            } else if (HarModel.isCachedEntry(entry)) { // From cache
                var cachedSize = HarModel.getEntryUncompressedSize(entry);
                totals.cached.resBodySize += cachedSize;
                totals.cached.count++;
            } else if (resBodySize > 0){ // Downloaded
                totals.downloaded.resBodySize += resBodySize;
                totals.downloaded.count++;
            }
        }

        return totals;
    },

    calcCacheTotalsForPages: function(pages) {
        var totals;
        var self = this;
        this.forEachPageEntries(pages, function(entries) {
            // totals is created by calcCacheTotalsForEntries if not provided
            totals = self.calcCacheTotalsForEntries(entries, totals);
        });
        return totals;
    }
};

//*************************************************************************************************

return StatsService;

//*************************************************************************************************
});
