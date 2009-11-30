/* See license.txt for terms of usage */

// Localization helpers
//-----------------------------------------------------------------------------

function $STR(name)
{
    if (strings.hasOwnProperty(name))
        return strings[name]

    var index = name.lastIndexOf(".");
    if (index > 0)
        name = name.substr(index + 1);

    return name;
}

function $STRF(name, args)
{
    var label = $STR(name);
    for (var i=0; i<args.length; i++)
        label = label.replace("%S", args[i]);

    return label;
}

// Localized Strings
//-----------------------------------------------------------------------------

var strings = {
    "viewer.tab.Input": "Input HAR",
    "viewer.tab.Preview": "Preview",
    "viewer.tab.DOM": "DOM",
    "viewer.tab.About": "About",
    "viewer.tab.Schema": "Schema",
    "URLParameters": "Params",
    "RequestHeaders": "Request Headers",
    "ResponseHeaders": "Response Headers",
    "net.file.SizeInfotip": "Size: %S (%S bytes)",
    "Request": "1 request",
    "RequestCount": "%S requests",
    "Request": "Requests",
    "SourceTabDesc": "Paste HTML Archive source code (JSON) into the text box below and press Preview button.",
    "request.phase.Resolving": "DNS Lookup",
    "request.phase.Connecting": "Connecting",
    "request.phase.Blocking": "Blocking",
    "request.phase.Sending": "Sending",
    "request.phase.Waiting": "Waiting",
    "request.phase.Receiving": "Receiving",
    "page.event.ContentLoad": "Page Content Loaded",
    "page.event.Load": "Page Loaded",
    "tooltip.size": "%S (%S bytes)"
};
