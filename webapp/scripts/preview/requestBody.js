/* See license.txt for terms of usage */

define("preview/requestBody", [
    "domplate/domplate",
    "i18n!nls/requestBody",
    "core/lib",
    "core/cookies",
    "domplate/tabView",
    "domplate/domTree",
    "core/dragdrop",
    "syntax-highlighter/shCore"
],

function(Domplate, Strings, Lib, Cookies, TabView, DomTree, DragDrop, dp) { with (Domplate) {

//*************************************************************************************************
// Request Body

/**
 * @domplate This object represents a template for request body that is displayed if a request
 * is expanded within the UI. It's content is composed from set of tabs that are dynamically
 * appended as necessary (depends on actual data).
 *
 * TODO: There should be an APIs allowing to register a new tab from other modules. The same
 * approach as within the Firebug Net panel should be used.
 *
 * There are currently following tabs built-in:
 * {@link HeadersTab}: request and response headers
 * {@link ParamsTab}: URL parameters
 * {@link SentDataTab}: posted data
 * {@link ResponseTab}: request response body
 * {@link CacheTab}: browser cache entry meta-data
 * {@link HtmlTab}: Preview for HTML responses
 * {@link DataURLTab}: Data URLs
 */
function RequestBody() {}
RequestBody.prototype = domplate(
/** @lends RequestBody */
{
    render: function(parentNode, file)
    {
        // Crete tabView and append all necessary tabs.
        var tabView = new TabView("requestBody");
        if (file.response.headers.length > 0)
            tabView.appendTab(new HeadersTab(file));

        if (file.request.queryString && file.request.queryString.length)
            tabView.appendTab(new ParamsTab(file));

        if (RequestBody.isValidPostData(file)) {
            tabView.appendTab(new SentDataTab(file, file.request.method));
        }

        if (ResponseTab.canShowFile(file)) {
            tabView.appendTab(new ResponseTab(file));
        }

        if (HighlightedTab.canShowFile(file)) {
            tabView.appendTab(new HighlightedTab(file));
        }

        if (JsonTab.canShowFile(file)) {
            tabView.appendTab(new JsonTab(file));
        }

        if (XmlTab.canShowFile(file)) {
            tabView.appendTab(new XmlTab(file));
        }

        //xxxHonza
        //if (file.request.cookies || file.response.cookies)
        //    tabView.appendTab(new CookiesTab(file));

        if (this.showCache(file))
            tabView.appendTab(new CacheTab(file));

        if (this.showHtml(file))
            tabView.appendTab(new HtmlTab(file));

        if (this.showDataURL(file))
            tabView.appendTab(new DataURLTab(file));

        // Finally, render the tabView and select the first tab by default
        var element = tabView.render(parentNode);
        if (tabView.tabs.length > 0)
            tabView.selectTabByName(tabView.tabs[0].id);

        return element;
    },

    showCache: function(file)
    {
        if (!file.cache)
            return false;

        if (!file.cache.afterRequest)
            return false;

        // Don't show cache tab for images
        // xxxHonza: the tab could display the image.
        if (file.category == "image")
            return false;

        return true;
    },

    showHtml: function(file)
    {
        // The mime-type value doesn't have to match the content type exactly
        // there can be a charset specified. So, check the prefix.
        var mimeType = file.response.content.mimeType || "";
        var fileMimeType = file.mimeType || "";
        return (Lib.startsWith(mimeType, "text/html")) ||
            (Lib.startsWith(fileMimeType, "application/xhtml+xml"));
    },

    showDataURL: function(file)
    {
        return file.request.url.indexOf("data:") == 0;
    }
});

RequestBody.isValidPostData = function(file) {
    var postData = file.request.postData;
    if (!postData) {
        // No post data at all.
        return false;
    }

    var paramsMissing = !Lib.isArray(postData.params) || (postData.params.length === 0);
    var textMissing = !postData.text;

    var postContentMissing = paramsMissing && textMissing;

    if (postContentMissing) {
        // (at least) Firefox 47 exports GET requests in HARs that have:
        //   postData.mimeType = ""
        //   postData.params = []
        //   postData.text = ""
        // So double-check for this and only allow such 'empty' postData for PUT and POST
        return ["PUT", "POST"].indexOf(file.request.method) > -1;
    }

    return true;
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function HeadersTab(file)
{
    this.file = file;
}

HeadersTab.prototype = domplate(TabView.Tab.prototype,
{
    id: "Headers",
    label: Strings.Headers,

    bodyTag:
        TABLE({"class": "netInfoHeadersText netInfoText netInfoHeadersTable",
                cellpadding: 0, cellspacing: 0},
            TBODY(
                TR({"class": "netInfoResponseHeadersTitle"},
                    TD({colspan: 2},
                        DIV({"class": "netInfoHeadersGroup"}, Strings.ResponseHeaders)
                    )
                ),
                TR({"class": "netInfoRequestHeadersTitle"},
                    TD({colspan: 2},
                        DIV({"class": "netInfoHeadersGroup"}, Strings.RequestHeaders)
                    )
                )
            )
        ),

    headerDataTag:
        FOR("param", "$headers",
            TR(
                TD({"class": "netInfoParamName"}, "$param.name"),
                TD({"class": "netInfoParamValue"},
                    PRE("$param|getParamValue")
                )
            )
        ),

    getParamValue: function(param)
    {
        // This value is inserted into PRE element and so, make sure the HTML isn't escaped (1210).
        // This is why the second parameter is true.
        // The PRE element preserves whitespaces so they are displayed the same, as they come from
        // the server (1194).
        return Lib.wrapText(param.value, true);
    },

    onUpdateBody: function(tabView, body)
    {
        if (this.file.response.headers)
            this.insertHeaderRows(body, this.file.response.headers, "Headers", "ResponseHeaders");

        if (this.file.request.headers)
            this.insertHeaderRows(body, this.file.request.headers, "Headers", "RequestHeaders");
    },

    insertHeaderRows: function(parentNode, headers, tableName, rowName)
    {
        var headersTable = Lib.getElementByClass(parentNode, "netInfo"+tableName+"Table");
        var titleRow = Lib.getElementByClass(headersTable, "netInfo" + rowName + "Title");

        if (headers.length)
        {
            this.headerDataTag.insertRows({headers: headers}, titleRow ? titleRow : parentNode);
            Lib.removeClass(titleRow, "collapsed");
        }
        else
        {
            Lib.setClass(titleRow, "collapsed");
        }
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function ResponseTab(file)
{
    this.file = file;
}

ResponseTab.prototype = domplate(TabView.Tab.prototype,
{
    id: "Response",
    label: Strings.Response,

    bodyTag:
        DIV({"class": "netInfoResponseText netInfoText"},
            PRE()
        ),

    onUpdateBody: function(tabView, body)
    {
        var responseTextBox = Lib.getElementByClass(body, "netInfoResponseText");

        var pre = responseTextBox.firstChild;
        Lib.clearNode(pre);

        var text = this.file.response.content.text;
        Lib.insertWrappedText(text, pre);
    }
});

ResponseTab.canShowFile = function(file) {
    return (file.response.content.text && file.response.content.text.length > 0);
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function HighlightedTab(file)
{
    this.file = file;
}

HighlightedTab.prototype = domplate(TabView.Tab.prototype,
{
    id: "Highlighted",
    label: Strings.Highlighted,

    bodyTag:
        DIV({"class": "netInfoHighlightedText netInfoText"},
            PRE({"class": "toolbar: false; brush: ", name: "code"})
        ),

    onUpdateBody: function(tabView, body)
    {
        var responseTextBox = Lib.getElementByClass(body, "netInfoHighlightedText");

        var pre = responseTextBox.firstChild;
        Lib.clearNode(pre);

        var text = this.file.response.content.text;
        var mimeType = this.file.response.content.mimeType || "";
        // Remove any mime type parameters (if any)
        mimeType = Lib.extractMimeType(mimeType);

        // Highlight the syntax if the mimeType is supported.
        var brush = HighlightedTab.shouldHighlightAs(mimeType);
        if (brush) {
            pre.className += brush;

            // If we want to highlight HTML then we can't use 'innerHTML=' in this way,
            // as CSS from the HTML content will be parsed/used in the main HAR Viewer document.
            //pre.innerHTML = text;

            // Instead we insert a text node.
            pre.appendChild(document.createTextNode(text));
            dp.SyntaxHighlighter.highlight(pre);
        }
        else
        {
            Lib.insertWrappedText(text, pre);
        }
    }
});

HighlightedTab.canShowFile = function(file) {
    var mimeType = file.response.content.mimeType || "";
    // Remove any mime type parameters (if any)
    mimeType = Lib.extractMimeType(mimeType);

    var hasContent = file.response.content.text && file.response.content.text.length > 0;
    return hasContent && (null !== HighlightedTab.shouldHighlightAs(mimeType));
};

HighlightedTab.shouldHighlightAs = function(mimeType) {
    var mimeTypesToHighlight = {
        javascript: ["application/javascript", "text/javascript", "application/x-javascript", "text/ecmascript", "application/ecmascript", "application/json"],
        css: ["text/css"],
        html: ["text/html", "application/xhtml+xml"]
    };
    for (var brush in mimeTypesToHighlight) {
        if (mimeTypesToHighlight[brush].indexOf(mimeType) > -1) {
            return brush;
        }
    }
    return XmlTab.isXmlMimeType(mimeType) ? "xml" : null;
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function ParamsTab(file)
{
    this.file = file;
}

ParamsTab.prototype = domplate(HeadersTab.prototype,
{
    id: "Params",
    label: Strings.URLParameters,

    bodyTag:
        TABLE({"class": "netInfoParamsText netInfoText netInfoParamsTable",
            cellpadding: 0, cellspacing: 0}, TBODY()
        ),

    onUpdateBody: function(tabView, body)
    {
        if (this.file.request.queryString)
        {
            var textBox = Lib.getElementByClass(body, "netInfoParamsText");
            this.insertHeaderRows(textBox, this.file.request.queryString, "Params");
        }
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function SentDataTab(file, method)
{
    // Convert to lower case and capitalize the first letter.
    method = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();

    this.file = file;
    this.id =  method;
    this.label = Strings[method];
}

SentDataTab.prototype = domplate(HeadersTab.prototype,
{
    bodyTag:
        DIV({"class": "netInfo$tab.id\\Text netInfoText"},
            TABLE({"class": "netInfo$tab.id\\Table", cellpadding: 0, cellspacing: 0},
                TBODY()
            )
        ),

    onUpdateBody: function(tabView, body)
    {
        var postData = this.file.request.postData;
        if (!postData)
            return;

        var textBox = Lib.getElementByClass(body, "netInfo" + this.id + "Text");
        if (postData.mimeType == "application/x-www-form-urlencoded")
            this.insertHeaderRows(textBox, postData.params, this.id);
        else
            Lib.insertWrappedText(postData.text, textBox);
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function CookiesTab(file)
{
    this.file = file;
}

CookiesTab.prototype = domplate(HeadersTab.prototype,
{
    id: "Cookies",
    label: Strings.Cookies,

    bodyTag:
        DIV({"class": "netInfoCookiesText netInfoText"},
            TABLE({"class": "netInfoCookiesTable", cellpadding: 0, cellspacing: 0},
                TBODY(
                    TR({"class": "netInfoResponseCookiesTitle"},
                        TD({colspan: 2},
                            DIV({"class": "netInfoCookiesGroup"}, Strings.ResponseCookies)
                        )
                    ),
                    TR({"class": "netInfoRequestCookiesTitle"},
                        TD({colspan: 2},
                            DIV({"class": "netInfoCookiesGroup"}, Strings.RequestCookies)
                        )
                    )
                )
            )
        ),

    onUpdateBody: function(tabView, body)
    {
        if (file.response.cookies)
        {
            var textBox = Lib.getElementByClass(body, "netInfoParamsText");
            this.insertHeaderRows(textBox, file.response.cookies, "Cookies", "ResponseCookies");
        }

        if (file.request.cookies)
        {
            var textBox = Lib.getElementByClass(body, "netInfoParamsText");
            this.insertHeaderRows(textBox, file.request.cookies, "Cookies", "RequestCookies");
        }
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function CacheTab(file)
{
    this.file = file;
}

CacheTab.prototype = domplate(HeadersTab.prototype,
{
    id: "Cache",
    label: Strings.Cache,

    bodyTag:
        DIV({"class": "netInfoCacheText netInfoText"},
            TABLE({"class": "netInfoCacheTable", cellpadding: 0, cellspacing: 0},
                TBODY()
            )
        ),

    onUpdateBody: function(tabView, body)
    {
        if (this.file.cache && this.file.cache.afterRequest)
        {
            var cacheEntry = this.file.cache.afterRequest;

            var values = [];
            for (var prop in cacheEntry)
                values.push({name: prop, value: cacheEntry[prop]});

            this.insertHeaderRows(body, values, "Cache");
        }
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

/**
 * @domplate Represents an HTML preview for network responses using 'text/html' or
 * 'application/xhtml+xml' mime type.
 */
function HtmlTab(file)
/** @lends HtmlTab */
{
    this.file = file;
}

HtmlTab.prototype = domplate(HeadersTab.prototype,
{
    id: "HTML",
    label: Strings.HTML,

    bodyTag:
        DIV({"class": "netInfoHtmlText netInfoText"},
            IFRAME({"class": "netInfoHtmlPreview", onload: "$onLoad"}),
            DIV({"class": "htmlPreviewResizer"})
        ),

    onUpdateBody: function(tabView, body)
    {
        this.preview = Lib.getElementByClass(body, "netInfoHtmlPreview");

        var height = parseInt(Cookies.getCookie("htmlPreviewHeight"));
        if (!isNaN(height))
            this.preview.style.height = height + "px";

        var handler = Lib.getElementByClass(body, "htmlPreviewResizer");
        this.resizer = new DragDrop.Tracker(handler, {
            onDragStart: Lib.bind(this.onDragStart, this),
            onDragOver: Lib.bind(this.onDragOver, this),
            onDrop: Lib.bind(this.onDrop, this)
        });
    },

    onLoad: function(event)
    {
        var e = Lib.fixEvent(event);
        var self = Lib.getAncestorByClass(e.target, "tabHTMLBody").repObject;
        self.preview.contentWindow.document.body.innerHTML = self.file.response.content.text;
    },

    onDragStart: function(tracker)
    {
        var body = Lib.getBody(this.preview.ownerDocument);
        body.setAttribute("hResizing", "true");
        this.startHeight = this.preview.clientHeight;
    },

    onDragOver: function(newPos, tracker)
    {
        var newHeight = (this.startHeight + newPos.y);
        this.preview.style.height = newHeight + "px";
        Cookies.setCookie("htmlPreviewHeight", newHeight);
    },

    onDrop: function(tracker)
    {
        var body = Lib.getBody(this.preview.ownerDocument);
        body.removeAttribute("hResizing");
    }
});

/**
 * @domplate Represents a request body tab displaying unescaped data: URLs.
 */
function DataURLTab(file)
/** @lends DataURLTab */
{
    this.file = file;
}

DataURLTab.prototype = domplate(HeadersTab.prototype,
{
    id: "DataURL",
    label: Strings.DataURL,

    bodyTag:
        DIV({"class": "netInfoDataURLText netInfoText"}),

    onUpdateBody: function(tabView, body)
    {
        var textBox = Lib.getElementByClass(body, "netInfoDataURLText");
        var data = this.file.request.url;

        if (data.indexOf("data:image") == 0)
        {
            var image = body.ownerDocument.createElement("img");
            image.src = data;
            textBox.appendChild(image);
        }
        else
        {
            Lib.insertWrappedText(unescape(data), textBox);
        }
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function JsonTab(file) {
    this.file = file;
}

JsonTab.prototype = domplate(TabView.Tab.prototype, {
    id: "JSON",
    label: Strings.JSON,

    bodyTag:
        DIV({"class": "netInfoJsonText netInfoText"}),

    onUpdateBody: function(tabView, body) {
        Lib.clearNode(body.firstChild);

        var content = this.file.response.content;
        try {
            var jsonStr = ("base64" === content.encoding) ? atob(content.text) : content.text;
            var ob = JSON.parse(jsonStr);
            var domTree = new DomTree(ob);
            domTree.append(body);
        } catch (e) {
            body.innerHTML = "" + e;
        }
    }
});

JsonTab.canShowFile = function(file) {
    var content = file.response.content;
    if (!content || !content.text) {
        return false;
    }
    if (content.encoding && "base64" !== content.encoding) {
        return false;
    }

    var mimeType = Lib.extractMimeType(content.mimeType);
    return ["application/json"].indexOf(mimeType) > -1;
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function XmlTab(file) {
    this.file = file;
}

XmlTab.prototype = domplate(TabView.Tab.prototype, {
    id: "XML",
    label: Strings.XML,

    bodyTag:
        DIV({"class": "netInfoXmlText netInfoText"}),

    onUpdateBody: function(tabView, body)
    {
        Lib.clearNode(body.firstChild);

        var content = this.file.response.content;
        try {
            var xmlStr = ("base64" === content.encoding) ? atob(content.text) : content.text;
            var xmlDoc = $.parseXML(xmlStr);
            var domTree = new DomTree(xmlDoc);
            domTree.append(body);
        } catch (e) {
            body.innerHTML = "" + e;
        }
    }
});

XmlTab.isXmlMimeType = function(mimeType) {
    var mimeType = Lib.extractMimeType(mimeType);
    return [
        "text/xml",
        "application/xml",
        "image/svg+xml",
        "application/atom+xml",
        "application/xslt+xml",
        "application/mathml+xml",
        "application/rss+xml"
    ].indexOf(mimeType) > -1;
};

XmlTab.canShowFile = function(file) {
    var content = file.response.content;
    if (!content || !content.text) {
        return false;
    }
    if (content.encoding && "base64" !== content.encoding) {
        return false;
    }
    return XmlTab.isXmlMimeType(Lib.extractMimeType(content.mimeType));
};

//*************************************************************************************************

return RequestBody;

//*************************************************************************************************
}});
