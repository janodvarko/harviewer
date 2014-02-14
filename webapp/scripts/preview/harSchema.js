/* See license.txt for terms of usage */

require.def("preview/harSchema", [], function() {

// ************************************************************************************************
// HAR Schema Definition

// Date time fields use ISO8601 (YYYY-MM-DDThh:mm:ss.sTZD, e.g. 2009-07-24T19:20:30.45+01:00)
var dateTimePattern = /^(\d{4})(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;

/**
 * Root HTML Archive type.
 */
var logType = {
    "logType": {
        "id": "logType",
        "description": "HTTP Archive structure.",
        "type": "object",
        "properties": {
            "log": {
                "type": "object",
                "properties": {
                    "version": {"type": "string"},
                    "creator": {"$ref": "creatorType"},
                    "browser": {"$ref": "browserType"},
                    "pages": {"type": "array", "optional": true, "items": {"$ref": "pageType"}},
                    "entries": {"type": "array", "items": {"$ref": "entryType"}},
                    "comment": {"type": "string", "optional": true}
                }
            }
        }
    }
};

var creatorType = {
    "creatorType": {
        "id": "creatorType",
        "description": "Name and version info of the log creator app.",
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "version": {"type": "string"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var browserType = {
    "browserType": {
        "id": "browserType",
        "description": "Name and version info of used browser.",
        "type": "object",
        "optional": true,
        "properties": {
            "name": {"type": "string"},
            "version": {"type": "string"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var pageType = {
    "pageType": {
        "id": "pageType",
        "description": "Exported web page",
        "optional": true,
        "properties": {
            "startedDateTime": {"type": "string", "format": "date-time", "pattern": dateTimePattern},
            "id": {"type": "string", "unique": true},
            "title": {"type": "string"},
            "pageTimings": {"$ref": "pageTimingsType"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var pageTimingsType = {
    "pageTimingsType": {
        "id": "pageTimingsType",
        "description": "Timing info about page load",
        "properties": {
            "onContentLoad": {"type": "number", "optional": true, "min": -1},
            "onLoad": {"type": "number", "optional": true, "min": -1},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var entryType = {
    "entryType": {
        "id": "entryType",
        "description": "Request and Response related info",
        "optional": true,
        "properties": {
            "pageref": {"type": "string", "optional": true},
            "startedDateTime": {"type": "string", "format": "date-time", "pattern": dateTimePattern},
            "time": {"type": "number", "min": 0},
            "request" : {"$ref": "requestType"},
            "response" : {"$ref": "responseType"},
            "cache" : {"$ref": "cacheType"},
            "timings" : {"$ref": "timingsType"},
            "serverIPAddress" : {"type": "string", "optional": true},
            "connection" : {"type": "string", "optional": true},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var requestType = {
    "requestType": {
        "id": "requestType",
        "description": "Monitored request",
        "properties": {
            "method": {"type": "string"},
            "url": {"type": "string"},
            "httpVersion": {"type" : "string"},
            "cookies" : {"type": "array", "items": {"$ref": "cookieType"}},
            "headers" : {"type": "array", "items": {"$ref": "recordType"}},
            "queryString" : {"type": "array", "items": {"$ref": "recordType"}},
            "postData" : {"$ref": "postDataType"},
            "headersSize" : {"type": "integer"},
            "bodySize" : {"type": "integer"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var recordType = {
    "recordType": {
        "id": "recordType",
        "description": "Helper name-value pair structure.",
        "properties": {
            "name": {"type": "string"},
            "value": {"type": "string"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var responseType = {
    "responseType": {
        "id": "responseType",
        "description": "Monitored Response.",
        "properties": {
            "status": {"type": "integer"},
            "statusText": {"type": "string"},
            "httpVersion": {"type": "string"},
            "cookies" : {"type": "array", "items": {"$ref": "cookieType"}},
            "headers" : {"type": "array", "items": {"$ref": "recordType"}},
            "content" : {"$ref": "contentType"},
            "redirectURL" : {"type": "string"},
            "headersSize" : {"type": "integer"},
            "bodySize" : {"type": "integer"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var cookieType = {
    "cookieType": {
        "id": "cookieType",
        "description": "Cookie description.",
        "properties": {
            "name": {"type": "string"},
            "value": {"type": "string"},
            "path": {"type": "string", "optional": true},
            "domain" : {"type": "string", "optional": true},
            "expires" : {"type": "string", "optional": true},
            "httpOnly" : {"type": "boolean", "optional": true},
            "secure" : {"type": "boolean", "optional": true},
            "comment": {"type": "string", "optional": true}
        }
    }
}

var postDataType = {
    "postDataType": {
        "id": "postDataType",
        "description": "Posted data info.",
        "optional": true,
        "properties": {
            "mimeType": {"type": "string"},
            "text": {"type": "string", "optional": true},
            "params": {
                "type": "array",
                "optional": true,
                "properties": {
                    "name": {"type": "string"},
                    "value": {"type": "string", "optional": true},
                    "fileName": {"type": "string", "optional": true},
                    "contentType": {"type": "string", "optional": true},
                    "comment": {"type": "string", "optional": true}
                }
            },
            "comment": {"type": "string", "optional": true}
        }
    }
};

var contentType = {
    "contentType": {
        "id": "contentType",
        "description": "Response content",
        "properties": {
            "size": {"type": "integer"},
            "compression": {"type": "integer", "optional": true},
            "mimeType": {"type": "string"},
            "text": {"type": "string", "optional": true},
            "encoding": {"type": "string", "optional": true},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var cacheType = {
    "cacheType": {
        "id": "cacheType",
        "description": "Info about a response coming from the cache.",
        "properties": {
            "beforeRequest": {"$ref": "cacheEntryType"},
            "afterRequest": {"$ref": "cacheEntryType"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var cacheEntryType = {
    "cacheEntryType": {
        "id": "cacheEntryType",
        "optional": true,
        "description": "Info about cache entry.",
        "properties": {
            "expires": {"type": "string", optional: "true"},
            "lastAccess": {"type": "string"},
            "eTag": {"type": "string"},
            "hitCount": {"type": "integer"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var timingsType = {
    "timingsType": {
        "id": "timingsType",
        "description": "Info about request-response timing.",
        "properties": {
            "dns": {"type": "number", "optional": true, "min": -1},
            "connect": {"type": "number", "optional": true, "min": -1},
            "blocked": {"type": "number", "optional": true, "min": -1},
            "send": {"type": "number", "min": -1},
            "wait": {"type": "number", "min": -1},
            "receive": {"type": "number", "min": -1},
            "ssl": {"type": "number", "optional": true, "min": -1},
            "comment": {"type": "string", "optional": true}
        }
    }
};

// ************************************************************************************************
// Helper schema object

function Schema() {}
Schema.prototype =
{
    registerType: function()
    {
        var doIt = function(my, obj){
            for (var name in obj) {
                if (obj.hasOwnProperty(name) && name != "prototype") {
                    my[name] = obj[name];
                }
            }
        }
        var that = this;
        for(i=0; i < arguments.length; i +=1) {
            doIt(that, arguments[i]);
        };
    }
};

// ************************************************************************************************
// Registration

// Register all defined types into the final schema object.
var schema = new Schema();
schema.registerType(
    logType,
    creatorType,
    browserType,
    pageType,
    pageTimingsType,
    entryType,
    requestType,
    recordType,
    responseType,
    postDataType,
    contentType,
    cacheType,
    cacheEntryType,
    timingsType
);

// ************************************************************************************************

return schema;

// ************************************************************************************************
});
