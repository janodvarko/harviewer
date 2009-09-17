/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR) {

//-----------------------------------------------------------------------------

/**
 * This object represents basic library of functions used thorough the
 * application.
 */
HAR.Lib = extend(
{
    bind: function()  // fn, thisObject, args => thisObject.fn(args, arguments);
    {
        var args = this.cloneArray(arguments), fn = args.shift(), object = args.shift();
        return function() { return fn.apply(object, HAR.Lib.arrayInsert(HAR.Lib.cloneArray(args), 0, arguments)); }
    },

    getBody: function(doc)
    {
        if (doc.body)
            return doc.body;

        var body = doc.getElementsByTagName("body")[0];
        if (body)
            return body;

        // Should never happen.
        return null;
    },

    getOverflowParent: function(element)
    {
        for (var scrollParent = element.parentNode; scrollParent; scrollParent = scrollParent.offsetParent)
        {
            if (scrollParent.scrollHeight > scrollParent.offsetHeight)
                return scrollParent;
        }
    },

    formatSize: function(bytes)
    {
        if (bytes == -1 || bytes == undefined)
            return "?";
        else if (bytes < 1024)
            return bytes + " B";
        else if (bytes < (1024*1024))
            return Math.floor(bytes/1024) + " KB";
        else
            return Math.floor((bytes/(1024*1024))*100)/100 + " MB";
    },

    formatTime: function(elapsed)
    {
        if (elapsed == -1)
            return "-"; // should be &nbsp; but this will be escaped so we need something that is no whitespace
        else if (elapsed < 1000)
            return elapsed + "ms";
        else if (elapsed < 60000)
            return (Math.ceil(elapsed/10) / 100) + "s";
        else
            return (Math.ceil((elapsed/60000)*100)/100) + "m";
    },

    formatNumber: function(number)
    {
        number += "";
        var x = number.split(".");
        var x1 = x[0];
        var x2 = x.length > 1 ? "." + x[1] : "";
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1))
            x1 = x1.replace(rgx, "$1" + "," + "$2");
        return x1 + x2;
    },

    isLeftClick: function(event)
    {
        return event.button == 0 && this.noKeyModifiers(event);
    },
    
    noKeyModifiers: function(event)
    {
        return !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;
    },
    
    getAncestorByClass: function(node, className)
    {
        for (var parent = node; parent; parent = parent.parentNode)
        {
            if (this.hasClass(parent, className))
                return parent;
        }
    
        return null;
    },

    getElementByClass: function(node, className)  // className, className, ...
    {
        var args = this.cloneArray(arguments); args.splice(0, 1);
        for (var child = node.firstChild; child; child = child.nextSibling)
        {
            var args1 = this.cloneArray(args); args1.unshift(child);
            if (this.hasClass.apply(this, args1))
                return child;
            else
            {
                var found = this.getElementByClass.apply(this, args1);
                if (found)
                    return found;
            }
        }
    
        return null;
    },
    
    getChildByClass: function(node) // ,classname, classname, classname...
    {
        for (var i = 1; i < arguments.length; ++i)
        {
            var className = arguments[i];
            var child = node.firstChild;
            node = null;
            for (; child; child = child.nextSibling)
            {
                if (this.hasClass(child, className))
                {
                    node = child;
                    break;
                }
            }
        }
    
        return node;
    },
    
    hasClass: function(node, name) // className, className, ...
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
                if (!className || className.indexOf(name) == -1)
                    return false;
            }
    
            return true;
        }
    },
    
    setClass: function(node, name)
    {
        if (node && !this.hasClass(node, name))
            node.className += " " + name;
    },
    
    removeClass: function(node, name)
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
    },
    
    toggleClass: function(elt, name)
    {
        if (this.hasClass(elt, name))
            this.removeClass(elt, name);
        else
            this.setClass(elt, name);
    },

    cancelEvent: function(event)
    {
        var e = HAR.eventFix(event || window.event);
        e.stopPropagation();
        e.preventDefault();
    },

    cloneArray: function(array, fn)
    {
       var newArray = [];

       if (fn)
           for (var i = 0; i < array.length; ++i)
               newArray.push(fn(array[i]));
       else
           for (var i = 0; i < array.length; ++i)
               newArray.push(array[i]);

       return newArray;
    },

    arrayInsert: function(array, index, other)
    {
       for (var i = 0; i < other.length; ++i)
           array.splice(i+index, 0, other[i]);
       return array;
    },

    remove: function(list, item)
    {
        for (var i = 0; i < list.length; ++i)
        {
            if (list[i] == item)
            {
                list.splice(i, 1);
                break;
            }
        }
    },

    getRepObject: function(node)
    {
        var target = null;
        for (var child = node; child; child = child.parentNode)
        {
            if (this.hasClass(child, "repTarget"))
                target = child;
    
            if (child.repObject)
            {
                if (!target && this.hasClass(child, "repIgnore"))
                    break;
                else
                    return child.repObject;
            }
        }
    },
    
    getElementPanel: function(element)
    {
        for (; element; element = element.parentNode)
        {
            if (element.ownerPanel)
                return element.ownerPanel;
        }
    },
    
    wrapText: function(text, noEscapeHTML)
    {
        var reNonAlphaNumeric = /[^A-Za-z_$0-9'"-]/;
    
        var html = [];
        var wrapWidth = 100;
    
        // Split long text into lines and put every line into an <pre> element (only in case
        // if noEscapeHTML is false). This is useful for automatic scrolling when searching
        // within response body (in order to scroll we need an element).
        var lines = this.splitLines(text);
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
                html.push(noEscapeHTML ? subLine : this.escapeHTML(subLine));
                if (!noEscapeHTML) html.push("</pre>");
            }
    
            if (!noEscapeHTML) html.push("<pre>");
            html.push(noEscapeHTML ? line : this.escapeHTML(line));
            if (!noEscapeHTML) html.push("</pre>");
        }
    
        return html.join(noEscapeHTML ? "\n" : "");
    },
    
    insertWrappedText: function(text, textBox, noEscapeHTML)
    {
        textBox.innerHTML = "<pre>" + this.wrapText(text, noEscapeHTML) + "</pre>";
    },
    
    splitLines: function(text)
    {
        var reSplitLines = /\r\n|\r|\n/;
        if (text.split)
            return text.split(this.reSplitLines);
        else
        {
            var str = text+"";
            var theSplit = str.split(this.reSplitLines);
            return theSplit;
        }
    },
    
    getPrettyDomain: function(url)
    {
        var m = /[^:]+:\/{1,3}(www\.)?([^\/]+)/.exec(url);
        return m ? m[2] : "";
    },
    
    escapeHTML: function(value)
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
    },
    
    getFileName: function(url)
    {
        var split = this.splitURLBase(url);
        return split.name;
    },
    
    splitURLBase: function(url)
    {
        if (this.isDataURL(url))
            return this.splitDataURL(url);
        return this.splitURLTrue(url);
    },
    
    isDataURL: function(url)
    {
        return (url && url.substr(0,5) == "data:");
    },
    
    splitDataURL: function(url)
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
             var caller_split = this.splitURLTrue(caller_URL);
    
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
    },
    
    splitURLTrue: function(url)
    {
        var reSplitFile = /:\/{1,3}(.*?)\/([^\/]*?)\/?($|\?.*)/;
        var m = reSplitFile.exec(url);
        if (!m)
            return {name: url, path: url};
        else if (!m[2])
            return {path: m[1], name: m[1]};
        else
            return {path: m[1], name: m[2]+m[3]};
    },
    
    eraseNode: function(node)
    {
        while (node.lastChild)
            node.removeChild(node.lastChild);
    },

    clearNode: function(node)
    {
        node.innerHTML = "";
    },

    cloneJSON: function(obj)
    {
        if (obj == null || typeof(obj) != "object")
            return obj;
    
        try
        {
            var temp = obj.constructor();
            for (var key in obj)
                temp[key] = cloneJSON(obj[key]);
            return temp;
        }
        catch (err)
        {
            HAR.log(obj);
        }
    
        return null;
    },
    
    cropString: function(text, limit)
    {
        text = text + "";
    
        if (!limit)
            var halfLimit = 50;
        else
            var halfLimit = limit / 2;
    
        if (text.length > limit)
            return this.escapeNewLines(text.substr(0, halfLimit) + "..." + text.substr(text.length-halfLimit));
        else
            return this.escapeNewLines(text);
    },

    escapeNewLines: function(value)
    {
        return value.replace(/\r/g, "\\r").replace(/\n/g, "\\n");
    },

    parseISO8601: function(text)
    {
        // Date time pattern: YYYY-MM-DDThh:mm:ss.sTZD
        // eg 1997-07-16T19:20:30.451+01:00
        // http://www.w3.org/TR/NOTE-datetime
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

        return date.getTime();
    },

    getURLParameter: function(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++)
        {
            var pair = vars[i].split("=");
            if (pair[0] == variable)
                return pair[1];
        }
        return null;
    },

    fireEvent: function(element, event)
    {
        if (document.createEvent)
        {
            var evt = document.createEvent("Events");
            evt.initEvent(event, true, false); // event type,bubbling,cancelable
            return !element.dispatchEvent(evt);
        }
    }
});

//-----------------------------------------------------------------------------
}});
