/* See license.txt for terms of usage */

/**
 * @module core/lib
 */
define([
    "./array",
    "./css",
    "./date",
    "./dom",
    "./events",
    "./json",
    "./mime",
    "./object",
    "./rect",
    "./sniff",
    "./string",
    "./url",
    "./trace"
],

function(Arr, Css, Date_, Dom, Events, Json, Mime, Obj, Rect, Sniff, Str, Url, Trace) {

//***********************************************************************************************//

/**
 * @alias module:core/lib
 */
var Lib = {};

//***********************************************************************************************//
// Browser Version

for (var p in Sniff)
    Lib[p] = Sniff[p];

//***********************************************************************************************//
// Core concepts (extension, bind)

for (var p in Obj)
    Lib[p] = Obj[p];

//***********************************************************************************************//
// Events

for (var p in Events)
    Lib[p] = Events[p];

//***********************************************************************************************//
// Rect {top, left, height, width}

for (var p in Rect)
    Lib[p] = Rect[p];

//*************************************************************************************************
// Arrays

for (var p in Arr)
    Lib[p] = Arr[p];

//*************************************************************************************************
// Text Formatting

for (var p in Str)
    Lib[p] = Str[p];

//*************************************************************************************************
// Date

for (var p in Date_)
    Lib[p] = Date_[p];

//*************************************************************************************************
// MIME

for (var p in Mime)
    Lib[p] = Mime[p];

//*************************************************************************************************
// URL

for (var p in Url)
    Lib[p] = Url[p];

//*************************************************************************************************
// DOM

for (var p in Dom)
    Lib[p] = Dom[p];

//***********************************************************************************************//
// CSS

for (var p in Css)
    Lib[p] = Css[p];

//***********************************************************************************************//
// JSON

for (var p in Json)
    Lib[p] = Json[p];

// ********************************************************************************************* //
// Selection

Lib.selectElementText = function(textNode, startOffset, endOffset)
{
    var win = window;
    var doc = win.document;
    if (win.getSelection && doc.createRange)
    {
        var sel = win.getSelection();
        var range = doc.createRange();
        //range.selectNodeContents(el);

        range.setStart(textNode, startOffset);
        range.setEnd(textNode, endOffset);
        sel.removeAllRanges();
        sel.addRange(range);
    }
    else if (doc.body.createTextRange)
    {
        range = doc.body.createTextRange();
        range.moveToElementText(textNode);
        range.select();
    }
};

// ********************************************************************************************* //

return Lib;

// ********************************************************************************************* //
});
