/* See license.txt for terms of usage */

require({
    baseUrl: "/har/viewer/scripts", //xxxHonza: this must be derived from the 'url' option
},
[
    "core/lib",
    "core/dragdrop"
],

function(Lib, DragDrop) {

// ********************************************************************************************* //
// Vertical resizer for HAR iframes (previews)

var resizers = document.querySelectorAll(".harPreviewResizer");
for (var i=0; i<resizers.length; i++)
{
    var handler = resizers[i];
    var tracker = new DragDrop.Tracker(handler, {
        onDragStart: onDragStart,
        onDragOver: onDragOver,
        onDrop: onDrop
    });
    tracker.preview = handler.previousSibling;
}

function onDragStart(tracker)
{
    var body = Lib.getBody(tracker.preview.ownerDocument);
    body.setAttribute("resizingHtmlPreview", "true");
    tracker.startHeight = tracker.preview.clientHeight;
}

function onDragOver(newPos, tracker)
{
    var newHeight = (tracker.startHeight + newPos.y);
    tracker.preview.style.height = newHeight + "px";
}

function onDrop(tracker)
{
    var body = Lib.getBody(tracker.preview.ownerDocument);
    body.removeAttribute("resizingHtmlPreview");
}

// ********************************************************************************************* //
});

