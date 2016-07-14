/* See license.txt for terms of usage */

/**
 * @module core/string
 */
define([
    "./array",
    "core/trace"
],

function(Arr, Trace) {

//***********************************************************************************************//

/**
 * @alias module:core/string
 */
var Str = {};

//*************************************************************************************************
// Text Formatting

/**
 * @param {Number|undefined} bytes
 * @return {String}
 */
Str.formatSize = function(bytes)
{
    var sizePrecision = 1; // Can be customizable from cookies?
    sizePrecision = (sizePrecision > 2) ? 2 : sizePrecision;
    sizePrecision = (sizePrecision < -1) ? -1 : sizePrecision;

    if (sizePrecision === -1)
        return bytes + " B";

    var a = Math.pow(10, sizePrecision);

    if (bytes === -1 || bytes === undefined)
        return "?";
    else if (bytes === 0)
        return "0";
    else if (bytes < 1024)
        return bytes + " B";
    else if (bytes < (1024*1024))
        return Math.round((bytes/1024)*a)/a + " KB";

    return Math.round((bytes/(1024*1024))*a)/a + " MB";
};

/**
 * @param {Number} elapsed
 * @return {String}
 */
Str.formatTime = function(elapsed)
{
    if (elapsed === -1)
        return "-"; // should be &nbsp; but this will be escaped so we need something that is no whitespace
    else if (elapsed < 1000)
        return elapsed + "ms";
    else if (elapsed < 60000)
        return (Math.ceil(elapsed/10) / 100) + "s";

    return (Math.ceil((elapsed/60000)*100)/100) + "m";
};

/**
 * @param {Number} number
 * @return {String}
 */
Str.formatNumber = function(number)
{
    number = String(number);
    var x = number.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1))
        x1 = x1.replace(rgx, "$1" + " " + "$2");
    return x1 + x2;
};

/**
 * @param {String} string
 * @return {String}
 */
Str.formatString = function(string)
{
    var args = Arr.cloneArray(arguments);
    string = args.shift();
    for (var i=0; i<args.length; i++)
    {
        var value = args[i].toString();
        string = string.replace("%S", value);
    }
    return string;
};

//*************************************************************************************************
// Text

/**
 * @param {String} str
 * @param {String} searchString
 * @param {String} position
 * @return {Boolean}
 */
Str.startsWith = function(str, searchString, position)
{
    position = position || 0;
    return str.indexOf(searchString, position) === position;
};

/**
 * @param {String} text
 * @return {String}
 */
Str.trim = function(text)
{
    return text.replace(/^\s*|\s*$/g, "");
};

/**
 * @param {String} text
 * @param {Boolean} noEscapeHTML
 * @return {String}
 */
Str.wrapText = function(text, noEscapeHTML)
{
    var reNonAlphaNumeric = /[^A-Za-z_$0-9'"-]/;

    var html = [];
    var wrapWidth = 100;

    // Split long text into lines and put every line into an <pre> element (only in case
    // if noEscapeHTML is false). This is useful for automatic scrolling when searching
    // within response body (in order to scroll we need an element).
    var lines = Str.splitLines(text);
    for (var i = 0; i < lines.length; ++i)
    {
        var line = lines[i];
        while (line.length > wrapWidth)
        {
            var m = reNonAlphaNumeric.exec(line.substr(wrapWidth, 100));
            var wrapIndex = wrapWidth+ (m ? m.index : 0);
            var subLine = line.substr(0, wrapIndex);
            line = line.substr(wrapIndex);

            if (!noEscapeHTML) html.push("<pre>");
            html.push(noEscapeHTML ? subLine : Str.escapeHTML(subLine));
            if (!noEscapeHTML) html.push("</pre>");
        }

        if (!noEscapeHTML) html.push("<pre>");
        html.push(noEscapeHTML ? line : Str.escapeHTML(line));
        if (!noEscapeHTML) html.push("</pre>");
    }

    return html.join(noEscapeHTML ? "\n" : "");
};

/**
 * @param {String} text
 * @param {HTMLElement} textBox
 * @param {Boolean} noEscapeHTML
 * @return {String}
 */
Str.insertWrappedText = function(text, textBox, noEscapeHTML)
{
    textBox.innerHTML = "<pre>" + Str.wrapText(text, noEscapeHTML) + "</pre>";
};

/**
 * @param {String} text
 * @return {Array}
 */
Str.splitLines = function(text)
{
    var reSplitLines = /\r\n|\r|\n/;

    if (!text)
        return [];
    else if (text.split)
        return text.split(reSplitLines);

    var str = String(text);
    var theSplit = str.split(reSplitLines);
    return theSplit;
};

/**
 * @param {String} value
 * @return {String}
 */
Str.escapeHTML = function(value)
{
    function replaceChars(ch)
    {
        switch (ch)
        {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "'":
                return "&#39;";
            case '"':
                return "&quot;";
        }
        return "?";
    }
    return String(value).replace(/[<>&"']/g, replaceChars);
};

/**
 * @param {String} text
 * @param {Number} limit
 * @return {String}
 */
Str.cropString = function(text, limit)
{
    text = String(text);

    var halfLimit = limit ? limit / 2 : 50;

    return (text.length > limit) ?
        Str.escapeNewLines(text.substr(0, halfLimit) + "..." + text.substr(text.length-halfLimit)) :
        Str.escapeNewLines(text);
};

/**
 * @param {String} value
 * @return {String}
 */
Str.escapeNewLines = function(value)
{
    return value.replace(/\r/g, "\\r").replace(/\n/g, "\\n");
};

// ********************************************************************************************* //

return Str;

// ********************************************************************************************* //
});
