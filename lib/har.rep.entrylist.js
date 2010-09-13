/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Domplate) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

/**
 * This object represents a template for list of entries (requests).
 * This list is displayed when a page is expanded by the user. 
 */
HAR.Rep.EntryList = domplate(
{
    tableTag:
        TABLE({"class": "netTable", cellpadding: 0, cellspacing: 0, onclick: "$onClick"},
            TBODY(
                TR(
                    TD({width: "20%"}),
                    TD({width: "10%"}),
                    TD({width: "10%"}),
                    TD({width: "10%"}),
                    TD({width: "50%"}),
                    TD({width: "15px"})
                )
            )
        ),

    fileTag:
        FOR("file", "$files",
            TR({"class": "netRow loaded",
                $hasHeaders: "$file|hasResponseHeaders",
                $responseError: "$file|isError",
                $fromCache: "$file|isFromCache"},
                TD({"class": "netHrefCol netCol"},
                    DIV({"class": "netHrefLabel netLabel",
                         style: "margin-left: $file|getIndent\\px"},
                        "$file|getHref"
                    ),
                    DIV({"class": "netFullHrefLabel netHrefLabel netLabel",
                         style: "margin-left: $file|getIndent\\px"},
                        "$file|getFullHref"
                    )
                ),
                TD({"class": "netStatusCol netCol"},
                    DIV({"class": "netStatusLabel netLabel"}, "$file|getStatus")
                ),
                TD({"class": "netDomainCol netCol"},
                    DIV({"class": "netDomainLabel netLabel"}, "$file|getDomain")
                ),
                TD({"class": "netSizeCol netCol"},
                    DIV({"class": "netSizeLabel netLabel"}, "$file|getSize")
                ),
                TD({"class": "netTimeCol netCol"},
                    DIV({"class": "netTimelineBar"},
                        "&nbsp;",
                        DIV({"class": "netResolvingBar netBar", style: "left: $file.offset"}),
                        DIV({"class": "netConnectingBar netBar", style: "left: $file.offset"}),
                        DIV({"class": "netBlockingBar netBar", style: "left: $file.offset"}),
                        DIV({"class": "netSendingBar netBar", style: "left: $file.offset"}),
                        DIV({"class": "netWaitingBar netBar", style: "left: $file.offset"}),
                        DIV({"class": "netContentLoadBar netBar", style: "left: $file.offset"}),
                        DIV({"class": "netWindowLoadBar netBar", style: "left: $file.offset"}),
                        DIV({"class": "netReceivingBar netBar", style: "left: $file.offset; width: $file.width"},
                            SPAN({"class": "netTimeLabel"}, "$file|getElapsedTime")
                        )
                    )
                ),
                TD({"class": "netOptionsCol netCol"},
                    DIV({"class": "netOptionsLabel netLabel", onclick: "$onOpenOptions",
                        title: $STR("request.Options")})
                )
            )
        ),

    headTag:
        TR({"class": "netHeadRow"},
            TD({"class": "netHeadCol", colspan: 6},
                DIV({"class": "netHeadLabel"}, "$doc.rootFile.href")
            )
        ),

    netInfoTag:
        TR({"class": "netInfoRow"},
            TD({"class": "netInfoCol", colspan: 6})
        ),

    activationTag:
        TR({"class": "netRow netActivationRow"},
            TD({"class": "netCol netActivationLabel", colspan: 6},
                $STR("net.ActivationMessage")
            )
        ),

    summaryTag:
        TR({"class": "netRow netSummaryRow"},
            TD({"class": "netCol", colspan: 3},
                DIV({"class": "netCountLabel netSummaryLabel"}, "-")
            ),
            TD({"class": "netTotalSizeCol netCol"},
                DIV({"class": "netTotalSizeLabel netSummaryLabel"}, "0KB")
            ),
            TD({"class": "netTotalTimeCol netCol"},
                DIV({"class": "", style: "width: 100%"},
                    DIV({"class": "netCacheSizeLabel netSummaryLabel"},
                        "(",
                        SPAN("0KB"),
                        SPAN(" " + $STR("FromCache")),
                        ")"
                    ),
                    DIV({"class": "netTimeBar"},
                        SPAN({"class": "netTotalTimeLabel netSummaryLabel"}, "0ms")
                    )
                )
            ),
            TD({"class": "netCol"})
        ),

    getIndent: function(file)
    {
        return 0;
    },

    isError: function(file)
    {
        var errorRange = Math.floor(file.response.status/100);
        return errorRange == 4 || errorRange == 5;
    },

    isFromCache: function(file)
    {
        return file.cache && file.cache.afterRequest;
    },

    getHref: function(file)
    {
        return file.request.method + " " + getFileName(this.getFullHref(file));
    },

    getFullHref: function(file)
    {
        return file.request.url;
    },

    getStatus: function(file)
    {
        var status = file.response.status > 0 ? (file.response.status + " ") : "";
        return status + file.response.statusText;
    },

    getDomain: function(file)
    {
        return getPrettyDomain(file.request.url);
    },

    getSize: function(file)
    {
        var bodySize = file.response.bodySize;
        var size = (bodySize && bodySize != -1) ? bodySize :
            file.response.content.size;

        return this.formatSize(size);
    },

    hasResponseHeaders: function(file)
    {
        return true;
    },

    formatSize: function(bytes)
    {
        return formatSize(bytes);
    },

    getElapsedTime: function(file)
    {
        // Total request time doesn't include the time spent in queue.
        //var elapsed = file.time - file.timings.blocked;
        return formatTime(file.time);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    onClick: function(event)
    {
        var e = HAR.eventFix(event || window.event);
        if (isLeftClick(event))
        {
            var row = getAncestorByClass(e.target, "netRow");
            if (row)
            {
                this.toggleHeadersRow(row);
                cancelEvent(event);
            }
        }
    },

    onOpenOptions: function(event)
    {
        var e = HAR.eventFix(event || window.event);
        cancelEvent(event);

        if (!isLeftClick(event))
            return;

        var row = getAncestorByClass(e.target, "netRow");
        var file = row.repObject;
        var phase = row.phase;

        var menu = createMenu({
            leftClickToOpen: true
        });

        createMenuItem(menu, {
            label: $STR("request.menu.Break Timeline Layout"),
            disabled: false, // xxxHonza: the first phase, the first file.
            checked: phase.files[0] == file,
            onClick: bind(this.breakLayout, this, row)
        });

        createMenuSeparator(menu);

        createMenuItem(menu, {
            label: $STR("request.menu.Open Request in New Window"),
            disabled: !file.response.content.text,
            onClick: bind(this.openRequestInNewWindow, this, file)
        });

        createMenuItem(menu, {
            label: $STR("request.menu.Open Response in New Window"),
            onClick: bind(this.openResponseInNewWindow, this, file)
        });

        //event.target.parentNode.previousSibling.appendChild(menu.domNode);
        menu._openMyself(event);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    clear: function()
    {
        clearNode(this.panelNode);

        this.table = null;
        this.summaryRow = null;
        this.limitRow = null;

        this.queue = [];
        this.invalidPhases = false;
    },

    setFilter: function(filterCategory)
    {
        this.filterCategory = filterCategory;

        var panelNode = this.panelNode;
        for (var category in fileCategories)
        {
            if (filterCategory != "all" && category != filterCategory)
                setClass(panelNode, "hideCategory-"+category);
            else
                removeClass(panelNode, "hideCategory-"+category);
        }
    },

    toggleHeadersRow: function(row)
    {
        if (!hasClass(row, "hasHeaders"))
            return;

        var file = row.repObject;

        toggleClass(row, "opened");
        if (hasClass(row, "opened"))
        {
            var EntryBody = HAR.Rep.EntryBody;
            var netInfoRow = this.netInfoTag.insertRows({}, row)[0];
            netInfoRow.repObject = file;
            var netInfoBox = EntryBody.tag.replace({file: file}, netInfoRow.firstChild);

            EntryBody.selectTabByName(netInfoBox, "Headers");
            //var category = getFileCategory(row.repObject);
            //if (category)
            //    setClass(netInfoBox, "category-" + category);
        }
        else
        {
            var netInfoRow = row.nextSibling;
            var netInfoBox = getElementByClass(netInfoRow, "netInfoBody");
            row.parentNode.removeChild(netInfoRow);
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    openRequestInNewWindow: function(event, file)
    {
        window.open(file.request.url);
    },

    openResponseInNewWindow: function(event, file)
    {
        var response = file.response.content.text;
        var mimeType = file.response.content.mimeType;
        var encoding = file.response.content.encoding;
        var url = "data:" + (mimeType ? mimeType: "") + ";" +
            (encoding ? encoding : "") + "," + response;

        window.open(url);
    },

    breakLayout: function(event, row)
    {
        var file = row.repObject;
        var phase = row.phase;
        var layoutBroken = phase.files[0] == file;
        row.breakLayout = !layoutBroken;

        var netTable = getAncestorByClass(row, "netTable");
        var page = HAR.Model.getParentPage(file);
        HAR.Tab.Preview.updateLayout(netTable, page);
    }
});

//-----------------------------------------------------------------------------
}}});
