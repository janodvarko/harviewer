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

Obj.append(Lib, Sniff);

//***********************************************************************************************//
// Core concepts (extension, bind)

Obj.append(Lib, Obj);

//***********************************************************************************************//
// Events

Obj.append(Lib, Events);

//***********************************************************************************************//
// Rect {top, left, height, width}

Obj.append(Lib, Rect);

//*************************************************************************************************
// Arrays

Obj.append(Lib, Arr);

//*************************************************************************************************
// Text Formatting

Obj.append(Lib, Str);

//*************************************************************************************************
// Date

Obj.append(Lib, Date_);

//*************************************************************************************************
// MIME

Obj.append(Lib, Mime);

//*************************************************************************************************
// URL

Obj.append(Lib, Url);

//*************************************************************************************************
// DOM

Obj.append(Lib, Dom);

//***********************************************************************************************//
// CSS

Obj.append(Lib, Css);

//***********************************************************************************************//
// JSON

Obj.append(Lib, Json);

// ********************************************************************************************* //
// Selection

Lib.selectElementText = function(textNode, startOffset, endOffset)
{
    var win = window;
    var doc = win.document;
    var range;
    if (win.getSelection && doc.createRange)
    {
        var sel = win.getSelection();
        range = doc.createRange();
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
