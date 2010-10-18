/* See license.txt for terms of usage */

require.def("xhr-spy/xhr", [
    "core/lib"
],

function(Lib) {

// **********************************************************************************************//
// XMLHttpRequestWrapper

var XMLHttpRequestWrapper = function(xhrRequest)
{
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // XMLHttpRequestWrapper internal variables

    var xhrRequest = xhrRequest;
    var spy = new XHRSpy();
    var self = this;
    var reqType;
    var reqUrl;
    var reqStartTS;

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // XMLHttpRequestWrapper internal methods

    function updateSelfProperties()
    {
        for (var propName in xhrRequest)
        {
            try
            {
                var propValue = xhrRequest[propName];
                if (!Lib.isFunction(propValue))
                    self[propName] = propValue;
            }
            catch (err)
            {
            }
        }
    };

    function updateXHRProperties()
    {
        for (var propName in self)
        {
            try
            {
                var propValue = self[propName];
                if (!xhrRequest[propName])
                    xhrRequest[propName] = propValue;
            }
            catch(err)
            {
            }
        }
    };

    function logXHR()
    {
        spy.logRow = spy.log();
        Lib.setClass(spy.logRow, "loading");
    }

    function finishXHR()
    {
        spy.response.status = xhrRequest.status;
        spy.response.statusText = xhrRequest.statusText;

        var duration = new Date().getTime() - reqStartTS;
        var success = xhrRequest.status == 200;

        getHttpHeaders(xhrRequest, spy);

        setTimeout(function()
        {
            var response = xhrRequest.responseText;
            spy.response.content.text = response;
            spy.response.content.size = response;
            spy.response.bodySize = response ? response.length : 0;

            Lib.removeClass(spy.logRow, "loading");

            if (!success)
                Lib.setClass(spy.logRow, "error");
        },200);

        spy.loaded = true;

        updateSelfProperties();
    };

    function getHttpHeaders(request, spy)
    {
        var responseHeadersText = request.getAllResponseHeaders();
        var headers = responseHeadersText ? responseHeadersText.split(/[\n\r]/) : [];
        var reHeader = /^(\S+):\s*(.*)/;
        
        for (var i=0, l=headers.length; i<l; i++)
        {
            var header = headers[i];
            var match = header.match(reHeader);
            if (match)
            {
                var name = match[1];
                var value = match[2];

                // update the spy mimeType property so we can detect when to show 
                // custom response viewers (such as HTML, XML or JSON viewer)
                if (name == "Content-Type")
                    spy.response.mimeType = value;

                spy.response.headers.push({
                   name: [name],
                   value: [value]
                });
            }
        }
    };

    function handleStateChange()
    {
        self.readyState = xhrRequest.readyState;

        if (xhrRequest.readyState == 4)
        {
            finishXHR();

            xhrRequest.onreadystatechange = function(){};
        }

        self.onreadystatechange();
    };

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // XMLHttpRequestWrapper public properties and handlers

    this.readyState = 0;

    this.onreadystatechange = function(){};

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // XMLHttpRequestWrapper public methods

    this.open = function(method, url, async, user, password)
    {
        updateSelfProperties();

        spy.request.method = method;
        spy.request.url = url;
        spy.async = async;
        spy.request.queryString = Lib.parseURLParams(url);

        if (!$.browser.msie && async)
            xhrRequest.onreadystatechange = handleStateChange;

        // xhr.open.apply not available in IE
        if (typeof xhrRequest.open.apply != "undefined")
            xhrRequest.open.apply(xhrRequest, arguments)
        else
            xhrRequest.open(method, url, async, user, password);

        if ($.browser.msie && async)
            xhrRequest.onreadystatechange = handleStateChange;
    };

    this.send = function(data)
    {
        spy.request.postData.text = data;
        spy.timings.send = new Date().getTime();
        updateXHRProperties();

        try
        {
            xhrRequest.send(data);
        }
        catch(e)
        {
            throw e;
        }
        finally
        {
            logXHR();

            if (!spy.async)
            {
                self.readyState = xhrRequest.readyState;
                finishXHR();
            }
        }
    };

    this.setRequestHeader = function(header, value)
    {
        spy.requestHeaders.push({name: [header], value: [value]});
        return xhrRequest.setRequestHeader(header, value);
    };

    this.getResponseHeader = function(header)
    {
        return xhrRequest.getResponseHeader(header);
    };

    this.getAllResponseHeaders = function()
    {
        return xhrRequest.getAllResponseHeaders();
    };

    this.abort = function()
    {
        return xhrRequest.abort();
    };

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Clone XHR object

    var supportsApply = xhrRequest.open && typeof(xhrRequest.open.apply) != "undefined";

    for (var propName in xhrRequest)
    {
        if (propName == "onreadystatechange")
            continue;

        try
        {
            var propValue = xhrRequest[propName];
            if (Lib.isFunction(propValue))
            {
                if (typeof self[propName] == "undefined")
                {
                    this[propName] = supportsApply ?
                        // if the browser supports apply 
                        function()
                        {
                            return xhrRequest[propName].apply(xhrRequest, arguments)
                        }
                        :
                        function(a,b,c,d,e)
                        {
                            return xhrRequest[propName](a,b,c,d,e)
                        };
                } 
            }
            else
            {
                this[propName] = propValue;
            }
        }
        catch (err)
        {
        }
    }

    return this;
};

// **********************************************************************************************//
// Monkey patch the XMLHttpRequest to monitor its activity.

var win = window.parent;

var isIE6 = /msie 6/i.test(navigator.appVersion);
if (!isIE6)
{
    var _XMLHttpRequest = win.XMLHttpRequest;
    win.XMLHttpRequest = function()
    {
        return new XMLHttpRequestWrapper(new _XMLHttpRequest());
    }
}
else
{
    var names = " MSXML2.XMLHTTP.5.0 MSXML2.XMLHTTP.4.0 MSXML2.XMLHTTP.3.0 " +
        "MSXML2.XMLHTTP Microsoft.XMLHTTP ";

    var _ActiveXObject = win.ActiveXObject;
    win.ActiveXObject = function(name)
    {
        try
        {
            var activeXObject = new win._ActiveXObject(name);
            if (names.indexOf(" " + name + " ") != -1)
                return new XMLHttpRequestWrapper(activeXObject);
            else
                return activeXObject;
        }
        catch (err)
        {
        }
    };
}

//***********************************************************************************************//
// XHR Spy

function XHRSpy()
{
    this.requestHeaders = [];
    this.responseHeaders = [];
}

XHRSpy.prototype = 
{
    async: null,
    href: null,
    loaded: false,
    logRow: null,
    responseText: null,
    requestHeaders: null,
    responseHeaders: null,
    sourceLink: null, // {href:"file.html", line: 22}

    response: {
        headers: [],
        content: {
            text: ""
        }
    },
    request: {
        url: "",
        method: "",
        bodySize: 0,
        headers: [],
        postData: {}
    },
    timings: {
        dns: -1,
        connect: -1,
        blocked: -1,
        send: -1,
        wait: -1,
        receive: -1,
        ssl: -1,
        comment: -1,
        connect: -1
    },

    getURL: function()
    {
        return this.href;
    },

    log: function()
    {
        // TODO: overwrite in the parent module
    }
};

return XHRSpy;

//***********************************************************************************************//
});
