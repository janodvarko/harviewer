/* See license.txt for terms of usage */

/**
 * @module core/mime
 */
define([
    "core/trace"
],

function(Trace) {

//***********************************************************************************************//

/**
 * @alias module:core/mime
 */
var Mime = {};

//*************************************************************************************************
// MIME handling

/**
 * @param {String} mimeType
 * @return {String}
 */
Mime.extractMimeType = function(mimeType) {
    if ("string" !== typeof mimeType) {
        throw new Error((typeof mimeType) + " is not of type string");
    }
    // remove parameters (if any)
    var idx = mimeType.indexOf(";");
    if (idx > -1) {
        mimeType = mimeType.substring(0, idx).trim();
    }
    return mimeType;
};

// ********************************************************************************************* //

return Mime;

// ********************************************************************************************* //
});
