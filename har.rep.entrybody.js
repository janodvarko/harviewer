/* See license.txt for terms of usage */

HAR.ns(function() { with (Domplate) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

/**
 * This object represents a template for entry body (request body) that is 
 * displayed if an entry (request) is expaned by the user.
 */
HAR.Rep.EntryBody = domplate(
{
    tag:
        DIV({"class": "netInfoBody", _repObject: "$file"},
            TAG("$infoTabs", {file: "$file"}),
            TAG("$infoBodies", {file: "$file"})
        ),

    infoTabs:
        DIV({"class": "netInfoTabs"},
            A({"class": "netInfoParamsTab netInfoTab", onclick: "$onClickTab",
                view: "Params",
                $collapsed: "$file|hideParams"},
                $STR("URLParameters")
            ),
            A({"class": "netInfoHeadersTab netInfoTab", onclick: "$onClickTab",
                view: "Headers"},
                $STR("Headers")
            ),
            A({"class": "netInfoPostTab netInfoTab", onclick: "$onClickTab",
                view: "Post",
                $collapsed: "$file|hidePost"},
                $STR("Post")
            ),
            A({"class": "netInfoPutTab netInfoTab", onclick: "$onClickTab",
                view: "Put",
                $collapsed: "$file|hidePut"},
                $STR("Put")
            ),
            A({"class": "netInfoCookiesTab netInfoTab", onclick: "$onClickTab",
                view: "Cookies",
                $collapsed: "$file|hideCookies"},
                $STR("Cookies")
            ),
            A({"class": "netInfoResponseTab netInfoTab", onclick: "$onClickTab",
                view: "Response",
                $collapsed: "$file|hideResponse"},
                $STR("Response")
            ),
            A({"class": "netInfoCacheTab netInfoTab", onclick: "$onClickTab",
               view: "Cache",
               $collapsed: "$file|hideCache"},
               $STR("Cache")
            ),
            A({"class": "netInfoHtmlTab netInfoTab", onclick: "$onClickTab",
               view: "Html",
               $collapsed: "$file|hideHtml"},
               $STR("HTML")
            )
        ),

    infoBodies:
        DIV({"class": "netInfoBodies"},
            TABLE({"class": "netInfoParamsText netInfoText netInfoParamsTable",
                    cellpadding: 0, cellspacing: 0}, TBODY()),
            TABLE({"class": "netInfoHeadersText netInfoText netInfoHeadersTable",
                    cellpadding: 0, cellspacing: 0},
                TBODY(
                    TR({"class": "netInfoResponseHeadersTitle"},
                        TD({colspan: 2},
                            DIV({"class": "netInfoHeadersGroup"}, $STR("ResponseHeaders"))
                        )
                    ),
                    TR({"class": "netInfoRequestHeadersTitle"},
                        TD({colspan: 2},
                            DIV({"class": "netInfoHeadersGroup"}, $STR("RequestHeaders"))
                        )
                    )
                )
            ),
            DIV({"class": "netInfoPostText netInfoText"},
                TABLE({"class": "netInfoPostTable", cellpadding: 0, cellspacing: 0},
                    TBODY()
                )
            ),
            DIV({"class": "netInfoPutText netInfoText"},
                TABLE({"class": "netInfoPutTable", cellpadding: 0, cellspacing: 0},
                    TBODY()
                )
            ),
            DIV({"class": "netInfoCookiesText netInfoText"},
                TABLE({"class": "netInfoCookiesTable", cellpadding: 0, cellspacing: 0},
                    TBODY(
                        TR({"class": "netInfoResponseCookiesTitle"},
                            TD({colspan: 2},
                                DIV({"class": "netInfoCookiesGroup"}, $STR("Response Cookies"))
                            )
                        ),
                        TR({"class": "netInfoRequestCookiesTitle"},
                            TD({colspan: 2},
                                DIV({"class": "netInfoCookiesGroup"}, $STR("Request Cookies"))
                            )
                        )
                    )
                )
            ),
            DIV({"class": "netInfoResponseText netInfoText"},
                DIV({"class": "loadResponseMessage"})
            ),
            DIV({"class": "netInfoCacheText netInfoText"},
                TABLE({"class": "netInfoCacheTable", cellpadding: 0, cellspacing: 0},
                    TBODY()
                )
            ),
            DIV({"class": "netInfoHtmlText netInfoText"},
                IFRAME({"class": "netInfoHtmlPreview"})
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

    hideParams: function(file)
    {
        return !file.request.queryString || !file.request.queryString.length;
    },

    hidePost: function(file)
    {
        return file.request.method.toUpperCase() != "POST";
    },

    hidePut: function(file)
    {
        return file.request.method.toUpperCase() != "PUT";
    },

    hideCookies: function(file)
    {
        return true;//!file.request.cookies && !file.response.cookies;
    },

    hideResponse: function(file)
    {
        return !file.response.content.text.length;
    },

    hideCache: function(file)
    {
        if (!file.cache)
            return true;

        if (!file.cache.afterRequest)
            return true;

        // Don't show cache tab for images 
        // xxxHonza: the tab could display the image. 
        if (file.category == "image")
            return true;

        return false;
    },

    hideHtml: function(file)
    {
        return (file.response.content.mimeType != "text/html") && 
            (file.mimeType != "application/xhtml+xml");
    },

    onClickTab: function(event)
    {
        var e = HAR.eventFix(event || window.event);
        this.selectTab(e.target);
    },

    getParamValue: function(param)
    {
        // This value is inserted into PRE element and so, make sure the HTML isn't escaped (1210).
        // This is why the second parameter is true.
        // The PRE element preserves whitespaces so they are displayed the same, as they come from
        // the server (1194).
        return wrapText(param.value, true);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    appendTab: function(netInfoBox, tabId, tabTitle)
    {
        // Create new tab and body.
        var args = {tabId: tabId, tabTitle: tabTitle};
        this.customTab.append(args, getElementByClass(netInfoBox, "netInfoTabs"));
        this.customBody.append(args, getElementByClass(netInfoBox, "netInfoBodies"));
    },

    selectTabByName: function(netInfoBox, tabName)
    {
        var tab = getChildByClass(netInfoBox, "netInfoTabs", "netInfo"+tabName+"Tab");
        if (tab)
            this.selectTab(tab);
    },

    selectTab: function(tab)
    {
        var netInfoBox = getAncestorByClass(tab, "netInfoBody");

        var view = tab.getAttribute("view");
        if (netInfoBox.selectedTab)
        {
            netInfoBox.selectedTab.removeAttribute("selected");
            netInfoBox.selectedText.removeAttribute("selected");
        }

        var textBodyName = "netInfo" + view + "Text";

        netInfoBox.selectedTab = tab;
        netInfoBox.selectedText = getElementByClass(netInfoBox, textBodyName);

        netInfoBox.selectedTab.setAttribute("selected", "true");
        netInfoBox.selectedText.setAttribute("selected", "true");

        var file = getRepObject(netInfoBox);
        if (file)
            this.updateInfo(netInfoBox, file);
    },

    updateInfo: function(netInfoBox, file)
    {
        var tab = netInfoBox.selectedTab;
        if (hasClass(tab, "netInfoParamsTab"))
        {
            if (file.request.queryString && !netInfoBox.urlParamsPresented)
            {
                netInfoBox.urlParamsPresented = true;
                this.insertHeaderRows(netInfoBox, file.request.queryString, "Params");
            }
        }

        if (hasClass(tab, "netInfoHeadersTab"))
        {
            if (file.response.headers && !netInfoBox.responseHeadersPresented)
            {
                netInfoBox.responseHeadersPresented = true;
                this.insertHeaderRows(netInfoBox, file.response.headers, "Headers", "ResponseHeaders");
            }

            if (file.request.headers && !netInfoBox.requestHeadersPresented)
            {
                netInfoBox.requestHeadersPresented = true;
                this.insertHeaderRows(netInfoBox, file.request.headers, "Headers", "RequestHeaders");
            }
        }

        if (hasClass(tab, "netInfoPostTab"))
        {
            var postTextBox = getElementByClass(netInfoBox, "netInfoPostText");
            if (!netInfoBox.postPresented)
            {
                netInfoBox.postPresented  = true;
                this.setPostText(file.request.postData, netInfoBox, postTextBox)
            }
        }

        if (hasClass(tab, "netInfoPutTab"))
        {
            var putTextBox = getElementByClass(netInfoBox, "netInfoPutText");
            if (!netInfoBox.putPresented)
            {
                netInfoBox.putPresented  = true;
                this.setPostText(file.request.postData, netInfoBox, putTextBox)
            }
        }

        if (hasClass(tab, "netInfoCookiesTab"))
        {
            if (file.response.cookies && !netInfoBox.responseCookiesPresented)
            {
                netInfoBox.responseCookiesPresented = true;
                this.insertHeaderRows(netInfoBox, file.response.cookies, "Cookies", "ResponseCookies");
            }

            if (file.request.cookies && !netInfoBox.requestCookiesPresented)
            {
                netInfoBox.requestCookiesPresented = true;
                this.insertHeaderRows(netInfoBox, file.request.cookies, "Cookies", "RequestCookies");
            }
        }

        if (hasClass(tab, "netInfoResponseTab") && !netInfoBox.responsePresented)
        {
            var responseTextBox = getElementByClass(netInfoBox, "netInfoResponseText");
            if (file.category == "image")
            {
                netInfoBox.responsePresented = true;

                var responseImage = netInfoBox.ownerDocument.createElement("img");
                responseImage.src = file.href;

                clearNode(responseTextBox);
                responseTextBox.appendChild(responseImage, responseTextBox);
            }
            else
            {
                this.setResponseText(file, netInfoBox, responseTextBox);
            }
        }

        if (hasClass(tab, "netInfoCacheTab") && !netInfoBox.cachePresented)
        {
            netInfoBox.cachePresented = true;

            var responseTextBox = getElementByClass(netInfoBox, "netInfoCacheText");
            if (file.cache && file.cache.afterRequest)
            {
                var cacheEntry = file.cache.afterRequest;
                var values = [];
                for (var prop in cacheEntry)
                    values.push({name: prop, value: cacheEntry[prop]});

                this.insertHeaderRows(netInfoBox, values, "Cache");
            }
        }

        if (hasClass(tab, "netInfoHtmlTab") && !netInfoBox.htmlPresented)
        {
            netInfoBox.htmlPresented = true;

            var text = file.response.content.text;
            var iframe = getElementByClass(netInfoBox, "netInfoHtmlPreview");
            iframe.contentWindow.document.body.innerHTML = text;
        }
    },

    setPostText: function(postData, netInfoBox, postTextBox)
    {
        if (!postData)
            return;

        if (postData.mimeType == "application/x-www-form-urlencoded")
            this.insertHeaderRows(netInfoBox, postData.params, "Post");
        else
            insertWrappedText(postData.text, postTextBox);
    },

    setResponseText: function(file, netInfoBox, responseTextBox)
    {
        var text = file.response.content.text;
        insertWrappedText(text, responseTextBox);
        netInfoBox.responsePresented = true;
    },

    insertHeaderRows: function(netInfoBox, headers, tableName, rowName)
    {
        var headersTable = getElementByClass(netInfoBox, "netInfo"+tableName+"Table");
        var tbody = headersTable.firstChild;
        var titleRow = getChildByClass(tbody, "netInfo" + rowName + "Title");

        if (headers.length)
        {
            this.headerDataTag.insertRows({headers: headers}, titleRow ? titleRow : tbody);
            removeClass(titleRow, "collapsed");
        }
        else
            setClass(titleRow, "collapsed");
    }
});

//-----------------------------------------------------------------------------
}}});
