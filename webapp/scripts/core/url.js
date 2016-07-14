/* See license.txt for terms of usage */

/**
 * @module core/url
 */
define([
    "core/trace"
],

function(Trace) {

//***********************************************************************************************//

/**
 * @alias module:core/url
 */
var Url = {};

//*************************************************************************************************
// URL

/**
 * @param {String} url
 * @return {String}
 */
Url.getFileName = function(url)
{
    try
    {
        var split = Url.splitURLBase(url);
        return split.name;
    }
    catch (e)
    {
        Trace.log(unescape(url));
    }

    return url;
};

/**
 * @param {String} url
 * @return {String|null}
 */
Url.getFileExtension = function(url)
{
    if (!url)
        return null;

    // Remove query string from the URL if any.
    var queryString = url.indexOf("?");
    if (queryString !== -1)
        url = url.substr(0, queryString);

    // Now get the file extension.
    var lastDot = url.lastIndexOf(".");
    return url.substr(lastDot+1);
};

/**
 * @param {String} url
 * @return {String}
 */
Url.splitURLBase = function(url)
{
    if (Url.isDataURL(url))
        return Url.splitDataURL(url);
    return Url.splitURLTrue(url);
};

/**
 * @param {String} url
 * @return {Boolean}
 */
Url.isDataURL = function(url)
{
    return (url && url.substr(0,5) === "data:");
};

/**
 * @param {String} url
 * @return {Object}
 */
Url.splitDataURL = function(url)
{
    var mark = url.indexOf(':', 3);
    if (mark !== 4)
        return false;   //  the first 5 chars must be 'data:'

    var point = url.indexOf(',', mark+1);
    if (point < mark)
        return false; // syntax error

    var props = { encodedContent: url.substr(point+1) };

    var metadataBuffer = url.substr(mark+1, point);
    var metadata = metadataBuffer.split(';');
    for (var i = 0; i < metadata.length; i++)
    {
        var nv = metadata[i].split('=');
        if (nv.length === 2)
            props[nv[0]] = nv[1];
    }

    // Additional Firebug-specific properties
    if (props.hasOwnProperty('fileName'))
    {
         var callerURL = decodeURIComponent(props.fileName);
         var callerSplit = Url.splitURLTrue(callerURL);

        if (props.hasOwnProperty('baseLineNumber'))  // this means it's probably an eval()
        {
            props.path = callerSplit.path;
            props.line = props.baseLineNumber;
            var hint = decodeURIComponent(props.encodedContent.substr(0,200)).replace(/\s*$/, "");
            props.name =  'eval->'+hint;
        }
        else
        {
            props.name = callerSplit.name;
            props.path = callerSplit.path;
        }
    }
    else
    {
        if (!props.hasOwnProperty('path'))
            props.path = "data:";
        if (!props.hasOwnProperty('name'))
            props.name =  decodeURIComponent(props.encodedContent.substr(0,200)).replace(/\s*$/, "");
    }

    return props;
};

/**
 * A 'split' URL type.
 * @typedef {Object} SplitUrl
 * @property {String} name
 * @property {String} path
 */

/**
 * @param {String} url
 * @return {module:core/url~SplitUrl} urlObject
 */
Url.splitURLTrue = function(url)
{
    var reSplitFile = /:\/{1,3}(.*?)\/([^\/]*?)\/?($|\?.*)/;
    var m = reSplitFile.exec(url);
    if (!m)
        return {name: url, path: url};
    else if (!m[2])
        return {path: m[1], name: m[1]};

    return {path: m[1], name: m[2]+m[3]};
};

/**
 * Returns value of specified parameter in the current URL.
 * @param {String} name Name of the requested parameter.
 * @return {String} Value of the requested parameter.
 */
Url.getURLParameter = function(name)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++)
    {
        var pair = vars[i].split("=");
        if (pair[0] === name)
            return unescape(pair[1]);
    }
    return null;
};

/**
 * Supports multiple URL parameters with the same name. Returns array
 * of values.
 * @param {String} name Name of the requested parameter.
 * @return {Array} Array with values.
 */
Url.getURLParameters = function(name)
{
    var result = [];
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++)
    {
        var pair = vars[i].split("=");
        if (pair[0] === name)
            result.push(unescape(pair[1]));
    }
    return result;
};

/**
 * Supports multiple hash parameters with the same name. Returns array
 * of values.
 * @param {String} name Name of the requested hash parameter.
 * @return {Array} Array with values.
 */
Url.getHashParameters = function(name)
{
    var result = [];
    var query = window.location.hash.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++)
    {
        var pair = vars[i].split("=");
        if (pair[0] === name)
            result.push(unescape(pair[1]));
    }
    return result;
};

/**
 * @param {String} url
 * @return {Array}
 */
Url.parseURLParams = function(url)
{
    var q = url ? url.indexOf("?") : -1;
    if (q === -1)
        return [];

    var search = url.substr(q+1);
    var h = search.lastIndexOf("#");
    if (h !== -1)
        search = search.substr(0, h);

    if (!search)
        return [];

    return Url.parseURLEncodedText(search);
};

/**
 * @param {String} text
 * @param {Boolean} noLimit
 * @return {Array}
 */
Url.parseURLEncodedText = function(text, noLimit)
{
    var maxValueLength = 25000;

    var params = [];

    // In case the text is empty just return the empty parameters
    if (!text)
      return params;

    // Unescape '+' characters that are used to encode a space.
    // See section 2.2.in RFC 3986: http://www.ietf.org/rfc/rfc3986.txt
    text = text.replace(/\+/g, " ");

    // Unescape '&amp;' character
    //xxxHonza: text = Url.unescapeForURL(text);

    function decodeText(text)
    {
        try
        {
            return decodeURIComponent(text);
        }
        catch (e)
        {
            return decodeURIComponent(unescape(text));
        }
    }

    var args = text.split("&");
    for (var i = 0; i < args.length; ++i)
    {
        try
        {
            var index = args[i].indexOf("=");
            var paramName;
            if (index !== -1)
            {
                paramName = args[i].substring(0, index);
                var paramValue = args[i].substring(index + 1);

                if (paramValue.length > maxValueLength && !noLimit)
                    paramValue = "LargeData";

                params.push({name: decodeText(paramName), value: decodeText(paramValue)});
            }
            else
            {
                paramName = args[i];
                params.push({name: decodeText(paramName), value: ""});
            }
        }
        catch (e)
        {
        }
    }

    params.sort(function(a, b) {
        return a.name <= b.name ? -1 : 1;
    });

    return params;
};

/**
 * @param {String} url
 * @return {String}
 */
Url.getPrettyDomain = function(url)
{
    // Large data URIs cause performance problems.
    // 255 is the FQDN length limit per RFC 1035.
    var m = /^(?!data:)[^:]+:\/{1,3}(www\.)?([^\/]{1,256})/.exec(url);
    return m ? m[2] : "";
};

// ********************************************************************************************* //

return Url;

// ********************************************************************************************* //
});
