/* See license.txt for terms of usage */

require.def("xhr-spy/spy", [
    "preview/requestList",
    "preview/harModel",
    "domplate/domplate",
    "core/lib",
    "xhr-spy/xhr",
    "core/trace"
],

function(RequestList, HarModel, Domplate, Lib, XhrSpy, Trace) { with (Domplate) {

//***********************************************************************************************//
// Application Frame (UI)

var XhrSpyFrame = domplate(
{
    tag:
        DIV({"class": "xhrSpyFrame"},
            DIV({"class": "content"})
        ),

    xhr:
        DIV({"class": "xhrSpyRow"},
            SPAN("$spy.url")
        ),

    render: function(parentNode)
    {
        this.element = this.tag.append({}, parentNode, this);

        this.requestList = new RequestList(input);
        this.requestList.render(this.element);
    },

    append: function(spy)
    {
        //return this.xhr.append({spy: spy}, this.element, this);
        input.log.entries.push(spy);
        spy.pageref = input.log.pages[0].id;

        var content = Lib.getElementByClass(this.element, "content");
        this.requestList.render(content, input.log.pages[0]);
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

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

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

// Initialization
XhrSpyFrame.render(Lib.getBody(document));

//***********************************************************************************************//

// Overwrite the XHRSpy log method
XhrSpy.prototype.log = function()
{
    return XhrSpyFrame.append(this);
}

//***********************************************************************************************//
}});
