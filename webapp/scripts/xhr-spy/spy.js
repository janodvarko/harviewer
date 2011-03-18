/* See license.txt for terms of usage */

require.def("xhr-spy/spy", [
    "preview/requestList",
    "preview/harModel",
    "domplate/domplate",
    "core/lib",
    "xhr-spy/xhr",
    "core/trace",
    "domplate/toolbar"
],

function(RequestList, HarModel, Domplate, Lib, XhrSpy, Trace, Toolbar) { with (Domplate) {

// ********************************************************************************************* //
// Application Frame (UI)

var XHRSpyFrame = domplate(
{
    tag:
        DIV({"class": "xhrSpyFrame"},
            DIV({"class": "header"}),
            DIV({"class": "content"})
        ),

    render: function(parentNode)
    {
        this.element = this.tag.append({}, parentNode, this);

        // Helper references.
        this.header = Lib.getElementByClass(this.element, "header")
        this.content = Lib.getElementByClass(this.element, "content");

        // Instantiate a toolbar and XHR request list
        this.toolbar = new Toolbar();
        this.requestList = new RequestList(input);

        // Render the toolbar. The XHR list will be rendered as soon as a XHR is executed.
        this.toolbar.addButtons(this.getToolbarButtons());
        this.toolbar.render(this.header);
    },

    append: function(spy)
    {
        spy.pageref = input.log.pages[0].id;

        input.log.entries.push(spy);

        if (!spy.logRow)
        {
            var result = this.requestList.append(this.content, input.log.pages[0], [spy]);
            spy.logRow = result[0];
        }

        this.requestList.updateLayout(this.requestList.table, input.log.pages[0]);
        return spy.logRow;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Toolbar and action handlers

    getToolbarButtons: function()
    {
        //xxxHonza: localization
        var buttons = [
            {
                id: "clear",
                label: "Clear",
                tooltiptext: "Remove all entries",
                command: Lib.bindFixed(this.onClear, this)
            },
            {
                id: "save",
                label: "Save",
                tooltiptext: "Save As HAR File",
                command: Lib.bindFixed(this.onExport, this)
            }
        ];

        return buttons;
    },

    onClear: function()
    {
        input.log.entries = [];

        this.requestList = new RequestList(input);
        Lib.clearNode(this.content);
    },

    onExport: function()
    {
        console.log("Export: TBD");
    }
});

// ********************************************************************************************* //

var input =
{
    log: {
        version: "1.2",
        creator: {
            name: "XHRSpy Bookmarklet",
            version: "2.0"
        },
        browser: {
            name: "Firefox",
            version: "xxx"
        },
        pages: [{
            "startedDateTime": "",
            "id": "page1",
            "title": "Google",
            "pageTimings": {}
        }],
        entries: [
        ]
    }
}

// ********************************************************************************************* //

// Initialization
XHRSpyFrame.render(Lib.getBody(document));

// ********************************************************************************************* //

// Overwrite the XHRSpy log method
XhrSpy.prototype.log = function()
{
    return XHRSpyFrame.append(this);
}

// ********************************************************************************************* //
}});
