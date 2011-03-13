/* See license.txt for terms of usage */

require.def("tabs/previewTab", [
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/previewTab",
    "domplate/toolbar",
    "tabs/pageTimeline",
    "tabs/pageStats",
    "preview/pageList",
    "core/cookies",
    "downloadify/js/swfobject",
    "downloadify/src/downloadify"
],

function(Domplate, TabView, Lib, Strings, Toolbar, Timeline, Stats, PageList, Cookies) { with (Domplate) {

//*************************************************************************************************
// Home Tab

function PreviewTab(model)
{
    this.model = model;

    this.toolbar = new Toolbar();
    this.timeline = new Timeline();
    this.stats = new Stats(model, this.timeline);

    // Initialize toolbar.
    var buttons = this.getToolbarButtons();
    for (var i=0; i<buttons.length; i++)
        this.toolbar.addButton(buttons[i]);
}

PreviewTab.prototype = Lib.extend(TabView.Tab.prototype,
{
    id: "Preview",
    label: Strings.previewTabLabel,

    // Use tabBodyTag so, the basic content layout is rendered immediately
    // and not as soon as the tab is actually selected. This is useful when
    // new data are appended while the tab hasn't been selected yet.
    tabBodyTag:
        DIV({"class": "tab$tab.id\\Body tabBody", _repObject: "$tab"},
            DIV({"class": "previewToolbar"}),
            DIV({"class": "previewTimeline"}),
            DIV({"class": "previewStats"}),
            DIV({"class": "previewList"})
        ),

    // Used in case of parsing or validation errors.
    errorTable:
        TABLE({"class": "errorTable", cellpadding: 0, cellspacing: 5},
            TBODY(
                FOR("error", "$errors",
                    TR({"class": "errorRow", _repObject: "$error"},
                        TD({"class": "errorProperty"},
                            SPAN("$error.property")
                        ),
                        TD("&nbsp;"),
                        TD({"class": "errorMessage"},
                            SPAN("$error.message"
                            )
                        )
                    )
                )
            )
        ),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Tab

    onUpdateBody: function(tabView, body)
    {
        // Render all UI components except of the page list. The page list is rendered
        // as soon as HAR data are loaded into the page.
        this.toolbar.render(Lib.$(body, "previewToolbar"));
        this.stats.render(Lib.$(body, "previewStats"));
        this.timeline.render(Lib.$(body, "previewTimeline"));

        // Show timeline & stats by default if the cookie says so (no animation)
        // But there should be an input.
        var input = this.model.input;
        if (input && Cookies.getCookie("timeline") == "true")
            this.onTimeline(false);

        if (input && Cookies.getCookie("stats") == "true")
            this.onStats(false);

        this.updateDownloadifyButton();
    },

    updateDownloadifyButton: function()
    {
        // Create download button (using Downloadify)
        var model = this.model;
        $(".harDownloadButton").downloadify(
        {
            filename: function() {
                return "netData.har";
            },
            data: function() {
                return model ? model.toJSON() : "";
            },
            onComplete: function() {},
            onCancel: function() {},
            onError: function() {
                alert(Strings.downloadError);
            },
            swf: "scripts/downloadify/media/downloadify.swf",
            downloadImage: "css/images/download-sprites.png",
            width: 16,
            height: 16,
            transparent: true,
            append: false
        });
    },

    getToolbarButtons: function()
    {
        var buttons = [
            {
                id: "showTimeline",
                label: Strings.showTimelineButton,
                tooltiptext: Strings.showTimelineTooltip,
                command: Lib.bindFixed(this.onTimeline, this, true)
            },
            {
                id: "showStats",
                label: Strings.showStatsButton,
                tooltiptext: Strings.showStatsTooltip,
                command: Lib.bindFixed(this.onStats, this, true)
            },
            {
                id: "clear",
                label: Strings.clearButton,
                tooltiptext: Strings.clearTooltip,
                command: Lib.bindFixed(this.onClear, this)
            }
        ];

        if ($.browser.mozilla)
        {
            buttons.push({
                id: "download",
                tooltiptext: Strings.downloadTooltip,
                className: "harDownloadButton"
            });
        }

        return buttons;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Toolbar commands

    onTimeline: function(animation)
    {
        // Update showTimeline button label.
        var button = this.toolbar.getButton("showTimeline");
        if (!button)
            return;

        this.timeline.toggle(animation);

        var visible = this.timeline.isVisible();
        button.label = Strings[visible ? "hideTimelineButton" : "showTimelineButton"];

        // Re-render toolbar to update label.
        this.toolbar.render();
        this.updateDownloadifyButton();

        Cookies.setCookie("timeline", visible);
    },

    onStats: function(animation)
    {
        // Update showStats button label.
        var button = this.toolbar.getButton("showStats");
        if (!button)
            return;

        this.stats.toggle(animation);

        var visible = this.stats.isVisible();
        button.label = Strings[visible ? "hideStatsButton" : "showStatsButton"];

        // Re-render toolbar to update label.
        this.toolbar.render();
        this.updateDownloadifyButton();

        Cookies.setCookie("stats", visible);
    },

    onClear: function()
    {
        var href = document.location.href;
        var index = href.indexOf("?");
        document.location = href.substr(0, index);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Public

    showStats: function(show)
    {
        Cookies.setCookie("stats", show);
    },

    showTimeline: function(show)
    {
        Cookies.setCookie("timeline", show);
    },

    append: function(input)
    {
        // The page list is responsible for rendering expandable list of pages and requests.
        // xxxHonza: There should probable be a list of all pageLists. Inside the pageList?
        var pageList = new PageList(input);
        pageList.append(Lib.$(this._body, "previewList"));

        // Append new pages into the timeline.
        this.timeline.append(input);
    },

    appendError: function(err)
    {
        if (err.errors)
            this.errorTable.append(err, Lib.$(this._body, "previewList"));
    },

    addPageTiming: function(timing)
    {
        PageList.prototype.pageTimings.push(timing);
    }
});

//*************************************************************************************************

return PreviewTab;

//*************************************************************************************************
}});
