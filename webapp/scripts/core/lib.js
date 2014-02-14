/* See license.txt for terms of usage */

require.def("core/lib", [
    "core/trace"
],

function(Trace) {

//***********************************************************************************************//

var Lib = {};

//***********************************************************************************************//
// Browser Version

var userAgent = navigator.userAgent.toLowerCase();
Lib.isFirefox = /firefox/.test(userAgent);
Lib.isOpera   = /opera/.test(userAgent);
Lib.isWebkit  = /webkit/.test(userAgent);
Lib.isSafari  = /webkit/.test(userAgent);
Lib.isIE      = /msie/.test(userAgent) && !/opera/.test(userAgent);
Lib.isIE6     = /msie 6/i.test(navigator.appVersion);
Lib.browserVersion = (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1];
Lib.isIElt8   = Lib.isIE && (Lib.browserVersion-0 < 8); 

//***********************************************************************************************//
// Core concepts (extension, dispatch, bind)

Lib.extend = function copyObject(l, r)
{
    var m = {};
    Lib.append(m, l);
    Lib.append(m, r);
    return m;
};

Lib.append = function(l, r)
{
    for (var n in r)
        l[n] = r[n];
    return l;
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

Lib.bind = function()  // fn, thisObject, args => thisObject.fn(args, arguments);
{
    var args = Lib.cloneArray(arguments), fn = args.shift(), object = args.shift();
    return function() { return fn.apply(object, Lib.arrayInsert(Lib.cloneArray(args), 0, arguments)); }
};

Lib.bindFixed = function() // fn, thisObject, args => thisObject.fn(args);
{
    var args = Lib.cloneArray(arguments), fn = args.shift(), object = args.shift();
    return function() { return fn.apply(object, args); }
};

Lib.dispatch = function(listeners, name, args)
{
    for (var i=0; listeners && i<listeners.length; i++)
    {
        var listener = listeners[i];
        if (listener[name])
        {
            try
            {
                listener[name].apply(listener, args);
            }
            catch (exc)
            {
                Trace.exception(exc);
            }
        }
    }
};

Lib.dispatch2 = function(listeners, name, args)
{
    for (var i=0; i<listeners.length; i++)
    {
        var listener = listeners[i];
        if (listener[name])
        {
            try
            {
                var result = listener[name].apply(listener, args);
                if (result)
                    return result;
            }
            catch (exc)
            {
                Trace.exception(exc);
            }
        }
    }
};

//***********************************************************************************************//
// Type Checking

var toString = Object.prototype.toString;
var reFunction = /^\s*function(\s+[\w_$][\w\d_$]*)?\s*\(/; 

Lib.isArray = function(object)
{
    //return toString.call(object) === "[object Array]";
    return jQuery.isArray(object);
};

Lib.isFunction = function(object)
{
    if (!object)
        return false;

    return toString.call(object) === "[object Function]" ||
        Lib.isIE && typeof object != "string" &&
        reFunction.test(""+object);
};

//***********************************************************************************************//
// DOM

Lib.isAncestor = function(node, potentialAncestor)
{
    for (var parent = node; parent; parent = parent.parentNode)
    {
        if (parent == potentialAncestor)
            return true;
    }

    return false;
};

//***********************************************************************************************//
// Events

Lib.fixEvent = function(e)
{
    return jQuery.event.fix(e || window.event);
}

Lib.fireEvent = function(element, event)
{
    if (document.createEvent)
    {
        var evt = document.createEvent("Events");
        evt.initEvent(event, true, false); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    }
}

Lib.cancelEvent = function(event)
{
    var e = Lib.fixEvent(event);
    e.stopPropagation();
    e.preventDefault();
};

Lib.addEventListener = function(object, name, handler, direction)
{
    direction = direction || false;

    if (object.addEventListener)
        object.addEventListener(name, handler, direction);
    else
        object.attachEvent("on"+name, handler);
};

Lib.removeEventListener = function(object, name, handler, direction)
{
    direction = direction || false;

    if (object.removeEventListener)
        object.removeEventListener(name, handler, direction);
    else
        object.detachEvent("on"+name, handler);
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
// Key Events

Lib.isLeftClick = function(event)
{
    return event.button == 0 && Lib.noKeyModifiers(event);
};

Lib.noKeyModifiers = function(event)
{
    return !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;
};

Lib.isControlClick = function(event)
{
    return event.button == 0 && Lib.isControl(event);
};

Lib.isShiftClick = function(event)
{
    return event.button == 0 && Lib.isShift(event);
};

Lib.isControl = function(event)
{
    return (event.metaKey || event.ctrlKey) && !event.shiftKey && !event.altKey;
};

Lib.isAlt = function(event)
{
    return event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey;
};

Lib.isAltClick = function(event)
{
    return event.button == 0 && Lib.isAlt(event);
};

Lib.isControlShift = function(event)
{
    return (event.metaKey || event.ctrlKey) && event.shiftKey && !event.altKey;
};

Lib.isShift = function(event)
{
    return event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey;
};

//***********************************************************************************************//
// Rect {top, left, height, width}

Lib.inflateRect = function(rect, x, y)
{
    return {
        top: rect.top - y,
        left: rect.left - x,
        height: rect.height + 2*y,
        width: rect.width + 2*x
    }
};

Lib.pointInRect = function(rect, x, y)
{
    return (y >= rect.top && y <= rect.top + rect.height &&
        x >= rect.left && x <= rect.left + rect.width);
}

//*************************************************************************************************
// Arrays

Lib.cloneArray = function(array, fn)
{
   var newArray = [];

   if (fn)
       for (var i = 0; i < array.length; ++i)
           newArray.push(fn(array[i]));
   else
       for (var i = 0; i < array.length; ++i)
           newArray.push(array[i]);

   return newArray;
};

Lib.arrayInsert = function(array, index, other)
{
   for (var i = 0; i < other.length; ++i)
       array.splice(i+index, 0, other[i]);
   return array;
};

Lib.remove = function(list, item)
{
    for (var i = 0; i < list.length; ++i)
    {
        if (list[i] == item)
        {
            list.splice(i, 1);
            return true;
        }
    }
    return false;
};

//*************************************************************************************************
// Text Formatting

Lib.formatSize = function(bytes)
{
    var sizePrecision = 1; // Can be customizable from cookies?
    sizePrecision = (sizePrecision > 2) ? 2 : sizePrecision;
    sizePrecision = (sizePrecision < -1) ? -1 : sizePrecision;

    if (sizePrecision == -1)
        return bytes + " B";

    var a = Math.pow(10, sizePrecision);

    if (bytes == -1 || bytes == undefined)
        return "?";
    else if (bytes == 0)
        return "0";
    else if (bytes < 1024)
        return bytes + " B";
    else if (bytes < (1024*1024))
        return Math.round((bytes/1024)*a)/a + " KB";
    else
        return Math.round((bytes/(1024*1024))*a)/a + " MB";
};

Lib.formatTime = function(elapsed)
{
    if (elapsed == -1)
        return "-"; // should be &nbsp; but this will be escaped so we need something that is no whitespace
    else if (elapsed < 1000)
        return elapsed + "ms";
    else if (elapsed < 60000)
        return (Math.ceil(elapsed/10) / 100) + "s";
    else
        return (Math.ceil((elapsed/60000)*100)/100) + "m";
};

Lib.formatNumber = function(number)
{
    number += "";
    var x = number.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1))
        x1 = x1.replace(rgx, "$1" + " " + "$2");
    return x1 + x2;
};

Lib.formatString = function(string)
{
    var args = Lib.cloneArray(arguments), string = args.shift();
    for (var i=0; i<args.length; i++)
    {
        var value = args[i].toString();
        string = string.replace("%S", value);
    }
    return string;
};

//*************************************************************************************************
// Date

Lib.parseISO8601 = function(text)
{
    var date = Lib.fromISOString(text);
    return date ? date.getTime() : null;
};

Lib.fromISOString = function(text)
{
    if (!text)
        return null;

    // Date time pattern: YYYY-MM-DDThh:mm:ss.sTZD
    // eg 1997-07-16T19:20:30.451+01:00
    // http://www.w3.org/TR/NOTE-datetime
    // xxxHonza: use the one from the schema.
    var regex = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;
    var reg = new RegExp(regex);
    var m = text.toString().match(new RegExp(regex));
    if (!m)
        return null;

    var date = new Date();
    date.setUTCDate(1);
    date.setUTCFullYear(parseInt(m[1], 10));
    date.setUTCMonth(parseInt(m[3], 10) - 1);
    date.setUTCDate(parseInt(m[5], 10));
    date.setUTCHours(parseInt(m[7], 10));
    date.setUTCMinutes(parseInt(m[9], 10));
    date.setUTCSeconds(parseInt(m[11], 10));

    if (m[12])
        date.setUTCMilliseconds(parseFloat(m[12]) * 1000);
    else
        date.setUTCMilliseconds(0);

    if (m[13] != 'Z')
    {
        var offset = (m[15] * 60) + parseInt(m[17], 10);
        offset *= ((m[14] == '-') ? -1 : 1);
        date.setTime(date.getTime() - offset * 60 * 1000);
    }

    return date;
},

Lib.toISOString = function(date)
{
    function f(n, c) {
        if (!c) c = 2;
        var s = new String(n);
        while (s.length < c) s = "0" + s;
        return s;
    }

    var result = date.getUTCFullYear() + '-' +
        f(date.getMonth() + 1) + '-' +
        f(date.getDate()) + 'T' +
        f(date.getHours()) + ':' +
        f(date.getMinutes()) + ':' +
        f(date.getSeconds()) + '.' +
        f(date.getMilliseconds(), 3);

    var offset = date.getTimezoneOffset();
    var offsetHours = Math.floor(offset / 60);
    var offsetMinutes = Math.floor(offset % 60);
    var prettyOffset = (offset > 0 ? "-" : "+") +
        f(Math.abs(offsetHours)) + ":" + f(Math.abs(offsetMinutes));

    return result + prettyOffset;
},

//*************************************************************************************************
// URL

Lib.getFileName = function(url)
{
    try
    {
        var split = Lib.splitURLBase(url);
        return split.name;
    }
    catch (e)
    {
        Trace.log(unescape(url));
    }

    return url;
};

Lib.getFileExtension = function(url)
{
    if (!url)
        return null;

    // Remove query string from the URL if any.
    var queryString = url.indexOf("?");
    if (queryString != -1)
        url = url.substr(0, queryString);

    // Now get the file extension.
    var lastDot = url.lastIndexOf(".");
    return url.substr(lastDot+1);
};

Lib.splitURLBase = function(url)
{
    if (Lib.isDataURL(url))
        return Lib.splitDataURL(url);
    return Lib.splitURLTrue(url);
};

Lib.isDataURL = function(url)
{
    return (url && url.substr(0,5) == "data:");
};

Lib.splitDataURL = function(url)
{
    var mark = url.indexOf(':', 3);
    if (mark != 4)
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
        if (nv.length == 2)
            props[nv[0]] = nv[1];
    }

    // Additional Firebug-specific properties
    if (props.hasOwnProperty('fileName'))
    {
         var caller_URL = decodeURIComponent(props['fileName']);
         var caller_split = Lib.splitURLTrue(caller_URL);

        if (props.hasOwnProperty('baseLineNumber'))  // this means it's probably an eval()
        {
            props['path'] = caller_split.path;
            props['line'] = props['baseLineNumber'];
            var hint = decodeURIComponent(props['encodedContent'].substr(0,200)).replace(/\s*$/, "");
            props['name'] =  'eval->'+hint;
        }
        else
        {
            props['name'] = caller_split.name;
            props['path'] = caller_split.path;
        }
    }
    else
    {
        if (!props.hasOwnProperty('path'))
            props['path'] = "data:";
        if (!props.hasOwnProperty('name'))
            props['name'] =  decodeURIComponent(props['encodedContent'].substr(0,200)).replace(/\s*$/, "");
    }

    return props;
};

Lib.splitURLTrue = function(url)
{
    var reSplitFile = /:\/{1,3}(.*?)\/([^\/]*?)\/?($|\?.*)/;
    var m = reSplitFile.exec(url);
    if (!m)
        return {name: url, path: url};
    else if (!m[2])
        return {path: m[1], name: m[1]};
    else
        return {path: m[1], name: m[2]+m[3]};
};

/**
 * Returns value of specified parameter in the current URL.
 * @param {String} name Name of the requested parameter.
 * @return {String} Value of the requested parameter.
 */
Lib.getURLParameter = function(name)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++)
    {
        var pair = vars[i].split("=");
        if (pair[0] == name)
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
Lib.getURLParameters = function(name)
{
    var result = [];
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++)
    {
        var pair = vars[i].split("=");
        if (pair[0] == name)
            result.push(unescape(pair[1]));
    }
    return result;
};

Lib.parseURLParams = function(url)
{
    var q = url ? url.indexOf("?") : -1;
    if (q == -1)
        return [];

    var search = url.substr(q+1);
    var h = search.lastIndexOf("#");
    if (h != -1)
        search = search.substr(0, h);

    if (!search)
        return [];

    return Lib.parseURLEncodedText(search);
};

Lib.parseURLEncodedText = function(text, noLimit)
{
    var maxValueLength = 25000;

    var params = [];

    // In case the text is empty just return the empty parameters
    if(text == '')
      return params;

    // Unescape '+' characters that are used to encode a space.
    // See section 2.2.in RFC 3986: http://www.ietf.org/rfc/rfc3986.txt
    text = text.replace(/\+/g, " ");

    // Unescape '&amp;' character
    //xxxHonza: text = Lib.unescapeForURL(text);

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
            if (index != -1)
            {
                var paramName = args[i].substring(0, index);
                var paramValue = args[i].substring(index + 1);

                if (paramValue.length > maxValueLength && !noLimit)
                    paramValue = Lib.$STR("LargeData");

                params.push({name: decodeText(paramName), value: decodeText(paramValue)});
            }
            else
            {
                var paramName = args[i];
                params.push({name: decodeText(paramName), value: ""});
            }
        }
        catch (e)
        {
        }
    }

    params.sort(function(a, b) { return a.name <= b.name ? -1 : 1; });

    return params;
};

//*************************************************************************************************
// DOM

Lib.getBody = function(doc)
{
    if (doc.body)
        return doc.body;

    var body = doc.getElementsByTagName("body")[0];
    if (body)
        return body;

    // Should never happen.
    return null;
};

Lib.getHead = function(doc)
{
    return doc.getElementsByTagName("head")[0];
};

Lib.getAncestorByClass = function(node, className)
{
    for (var parent = node; parent; parent = parent.parentNode)
    {
        if (Lib.hasClass(parent, className))
            return parent;
    }

    return null;
};

Lib.$ = function()
{
    return Lib.getElementByClass.apply(this, arguments);
};

Lib.getElementByClass = function(node, className)  // className, className, ...
{
    if (!node)
        return null;

    var args = Lib.cloneArray(arguments); args.splice(0, 1);
    for (var child = node.firstChild; child; child = child.nextSibling)
    {
        var args1 = Lib.cloneArray(args); args1.unshift(child);
        if (Lib.hasClass.apply(this, args1))
            return child;
        else
        {
            var found = Lib.getElementByClass.apply(this, args1);
            if (found)
                return found;
        }
    }

    return null;
};

Lib.getElementsByClass = function(node, className)  // className, className, ...
{
    if (node.querySelectorAll)
    {
        var args = Lib.cloneArray(arguments); args.shift();
        var selector = "." + args.join(".");
        return node.querySelectorAll(selector);
    }

    function iteratorHelper(node, classNames, result)
    {
        for (var child = node.firstChild; child; child = child.nextSibling)
        {
            var args1 = Lib.cloneArray(classNames); args1.unshift(child);
            if (Lib.hasClass.apply(null, args1))
                result.push(child);

            iteratorHelper(child, classNames, result);
        }
    }

    var result = [];
    var args = Lib.cloneArray(arguments); args.shift();
    iteratorHelper(node, args, result);
    return result;
}

Lib.getChildByClass = function(node) // ,classname, classname, classname...
{
    for (var i = 1; i < arguments.length; ++i)
    {
        var className = arguments[i];
        var child = node.firstChild;
        node = null;
        for (; child; child = child.nextSibling)
        {
            if (Lib.hasClass(child, className))
            {
                node = child;
                break;
            }
        }
    }

    return node;
};

Lib.eraseNode = function(node)
{
    while (node.lastChild)
        node.removeChild(node.lastChild);
};

Lib.clearNode = function(node)
{
    node.innerHTML = "";
};

//***********************************************************************************************//
// CSS

Lib.hasClass = function(node, name) // className, className, ...
{
    if (!node || node.nodeType != 1)
        return false;
    else
    {
        for (var i=1; i<arguments.length; ++i)
        {
            var name = arguments[i];
            //var re = new RegExp("(^|\\s)"+name+"($|\\s)");
            //if (!re.exec(node.getAttribute("class")))
            //    return false;
            var className = node.className;//node.getAttribute("class");
            if (!className || className.indexOf(name + " ") == -1)
                return false;
        }

        return true;
    }
};

Lib.setClass = function(node, name)
{
    if (node && !Lib.hasClass(node, name))
        node.className += " " + name + " ";
};

Lib.removeClass = function(node, name)
{
    if (node && node.className)
    {
        var index = node.className.indexOf(name);
        if (index >= 0)
        {
            var size = name.length;
            node.className = node.className.substr(0,index-1) + node.className.substr(index+size);
        }
    }
};

Lib.toggleClass = function(elt, name)
{
    if (Lib.hasClass(elt, name))
    {
        Lib.removeClass(elt, name);
        return false;
    }
    else
    {
        Lib.setClass(elt, name);
        return true;
    }
};

Lib.setClassTimed = function(elt, name, timeout)
{
    if (!timeout)
        timeout = 1300;

    if (elt.__setClassTimeout)  // then we are already waiting to remove the class mark
        clearTimeout(elt.__setClassTimeout);  // reset the timer
    else                        // then we are not waiting to remove the mark
        Lib.setClass(elt, name);

    elt.__setClassTimeout = setTimeout(function()
    {
        delete elt.__setClassTimeout;
        Lib.removeClass(elt, name);
    }, timeout);
};

//*************************************************************************************************
// Text

Lib.trim = function(text)
{
    return text.replace(/^\s*|\s*$/g, "");
};

Lib.wrapText = function(text, noEscapeHTML)
{
    var reNonAlphaNumeric = /[^A-Za-z_$0-9'"-]/;

    var html = [];
    var wrapWidth = 100;

    // Split long text into lines and put every line into an <pre> element (only in case
    // if noEscapeHTML is false). This is useful for automatic scrolling when searching
    // within response body (in order to scroll we need an element).
    var lines = Lib.splitLines(text);
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
            html.push(noEscapeHTML ? subLine : Lib.escapeHTML(subLine));
            if (!noEscapeHTML) html.push("</pre>");
        }

        if (!noEscapeHTML) html.push("<pre>");
        html.push(noEscapeHTML ? line : Lib.escapeHTML(line));
        if (!noEscapeHTML) html.push("</pre>");
    }

    return html.join(noEscapeHTML ? "\n" : "");
};

Lib.insertWrappedText = function(text, textBox, noEscapeHTML)
{
    textBox.innerHTML = "<pre>" + Lib.wrapText(text, noEscapeHTML) + "</pre>";
};

Lib.splitLines = function(text)
{
    var reSplitLines = /\r\n|\r|\n/;

    if (!text)
        return [];
    else if (text.split)
        return text.split(reSplitLines);

    var str = text + "";
    var theSplit = str.split(reSplitLines);
    return theSplit;
};

Lib.getPrettyDomain = function(url)
{
    var m = /^[^:]+:\/{1,3}(www\.)?([^\/]+)/.exec(url);
    return m ? m[2] : "";
},

Lib.escapeHTML = function(value)
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
    };
    return String(value).replace(/[<>&"']/g, replaceChars);
};

Lib.cropString = function(text, limit)
{
    text = text + "";

    if (!limit)
        var halfLimit = 50;
    else
        var halfLimit = limit / 2;

    if (text.length > limit)
        return Lib.escapeNewLines(text.substr(0, halfLimit) + "..." + text.substr(text.length-halfLimit));
    else
        return Lib.escapeNewLines(text);
};

Lib.escapeNewLines = function(value)
{
    return value.replace(/\r/g, "\\r").replace(/\n/g, "\\n");
};

//***********************************************************************************************//
// JSON

Lib.cloneJSON = function(obj)
{
    if (obj == null || typeof(obj) != "object")
        return obj;

    try
    {
        var temp = obj.constructor();
        for (var key in obj)
            temp[key] = this.cloneJSON(obj[key]);
        return temp;
    }
    catch (err)
    {
        Trace.exception(err);
    }

    return null;
};

//***********************************************************************************************//
// Layout

Lib.getOverflowParent = function(element)
{
    for (var scrollParent = element.parentNode; scrollParent;
        scrollParent = scrollParent.offsetParent)
    {
        if (scrollParent.scrollHeight > scrollParent.offsetHeight)
            return scrollParent;
    }
};

Lib.getElementBox = function(el)
{
    var result = {};

    if (el.getBoundingClientRect)
    {
        var rect = el.getBoundingClientRect();

        // fix IE problem with offset when not in fullscreen mode
        var offset = Lib.isIE ? document.body.clientTop || document.documentElement.clientTop: 0;
        var scroll = Lib.getWindowScrollPosition();

        result.top = Math.round(rect.top - offset + scroll.top);
        result.left = Math.round(rect.left - offset + scroll.left);
        result.height = Math.round(rect.bottom - rect.top);
        result.width = Math.round(rect.right - rect.left);
    }
    else
    {
        var position = Lib.getElementPosition(el);

        result.top = position.top;
        result.left = position.left;
        result.height = el.offsetHeight;
        result.width = el.offsetWidth;
    }

    return result;
};

Lib.getElementPosition = function(el)
{
    var left = 0
    var top = 0;

    do
    {
        left += el.offsetLeft;
        top += el.offsetTop;
    }
    while (el = el.offsetParent);

    return {left:left, top:top};
};

Lib.getWindowSize = function()
{
    var width=0, height=0, el;
    
    if (typeof window.innerWidth == "number")
    {
        width = window.innerWidth;
        height = window.innerHeight;
    }
    else if ((el=document.documentElement) && (el.clientHeight || el.clientWidth))
    {
        width = el.clientWidth;
        height = el.clientHeight;
    }
    else if ((el=document.body) && (el.clientHeight || el.clientWidth))
    {
        width = el.clientWidth;
        height = el.clientHeight;
    }
    
    return {width: width, height: height};
};

Lib.getWindowScrollSize = function()
{
    var width=0, height=0, el;

    // first try the document.documentElement scroll size
    if (!Lib.isIEQuiksMode && (el=document.documentElement) && 
       (el.scrollHeight || el.scrollWidth))
    {
        width = el.scrollWidth;
        height = el.scrollHeight;
    }

    // then we need to check if document.body has a bigger scroll size value
    // because sometimes depending on the browser and the page, the document.body
    // scroll size returns a smaller (and wrong) measure
    if ((el=document.body) && (el.scrollHeight || el.scrollWidth) &&
        (el.scrollWidth > width || el.scrollHeight > height))
    {
        width = el.scrollWidth;
        height = el.scrollHeight;
    }

    return {width: width, height: height};
};

Lib.getWindowScrollPosition = function()
{
    var top=0, left=0, el;

    if(typeof window.pageYOffset == "number")
    {
        top = window.pageYOffset;
        left = window.pageXOffset;
    }
    else if((el=document.body) && (el.scrollTop || el.scrollLeft))
    {
        top = el.scrollTop;
        left = el.scrollLeft;
    }
    else if((el=document.documentElement) && (el.scrollTop || el.scrollLeft))
    {
        top = el.scrollTop;
        left = el.scrollLeft;
    }

    return {top:top, left:left};
};

// ********************************************************************************************* //
// Scrolling

Lib.scrollIntoCenterView = function(element, scrollBox, notX, notY)
{
    if (!element)
        return;

    if (!scrollBox)
        scrollBox = Lib.getOverflowParent(element);

    if (!scrollBox)
        return;

    var offset = Lib.getClientOffset(element);

    if (!notY)
    {
        var topSpace = offset.y - scrollBox.scrollTop;
        var bottomSpace = (scrollBox.scrollTop + scrollBox.clientHeight)
            - (offset.y + element.offsetHeight);

        if (topSpace < 0 || bottomSpace < 0)
        {
            var centerY = offset.y - (scrollBox.clientHeight/2);
            scrollBox.scrollTop = centerY;
        }
    }

    if (!notX)
    {
        var leftSpace = offset.x - scrollBox.scrollLeft;
        var rightSpace = (scrollBox.scrollLeft + scrollBox.clientWidth)
            - (offset.x + element.clientWidth);

        if (leftSpace < 0 || rightSpace < 0)
        {
            var centerX = offset.x - (scrollBox.clientWidth/2);
            scrollBox.scrollLeft = centerX;
        }
    }
};

Lib.getClientOffset = function(elt)
{
    function addOffset(elt, coords, view)
    {
        var p = elt.offsetParent;

        var style = view.getComputedStyle(elt, "");

        if (elt.offsetLeft)
            coords.x += elt.offsetLeft + parseInt(style.borderLeftWidth);
        if (elt.offsetTop)
            coords.y += elt.offsetTop + parseInt(style.borderTopWidth);

        if (p)
        {
            if (p.nodeType == 1)
                addOffset(p, coords, view);
        }
        else if (elt.ownerDocument.defaultView.frameElement)
        {
            addOffset(elt.ownerDocument.defaultView.frameElement,
                coords, elt.ownerDocument.defaultView);
        }
    }

    var coords = {x: 0, y: 0};
    if (elt)
    {
        var view = elt.ownerDocument.defaultView;
        addOffset(elt, coords, view);
    }

    return coords;
};

// ********************************************************************************************* //
// Stylesheets

/**
 * Load stylesheet into the specified document. The method doesn't wait till the stylesheet
 * is loaded and so, not suitable for cases when you do not care when the file is loaded.
 * @param {Object} doc The document to load the stylesheet into.
 * @param {Object} url URL of the target stylesheet.
 */
Lib.addStyleSheet = function(doc, url)
{
    if (doc.getElementById(url))
        return;

    var link = doc.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    link.setAttribute("id", url);

    var head = Lib.getHead(doc);
    head.appendChild(link);
}

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
}

// ********************************************************************************************* //

return Lib;

// ********************************************************************************************* //
});
