/* See license.txt for terms of usage */

/**
 * @module domplate/toolTip
 */
define("domplate/toolTip", [
    "domplate/domplate",
    "core/lib",
    "core/trace"
],

function(Domplate, Lib, Trace) {

var domplate = Domplate.domplate;
var DIV = Domplate.DIV;

// ************************************************************************************************
// Globals

var mouseEvents = "mousemove mouseover mousedown click mouseout";
var currentToolTip = null;

// ************************************************************************************************
// Tooltip

function ToolTip()
{
    this.element = null;
}

ToolTip.prototype = domplate(
{
    tag:
        DIV({"class": "toolTip"},
            DIV()
        ),

    show: function(target, options)
    {
        if (currentToolTip)
            currentToolTip.hide();

        this.target = target;

        this.addListeners();

        // Render the tooltip.
        var body = Lib.getBody(document);
        this.element = this.tag.append({options: options}, body, this);

        // Compute coordinates and show.
        var box = Lib.getElementBox(this.target);
        this.element.style.top = box.top + box.height + "px";
        this.element.style.left = box.left + box.width + "px";
        this.element.style.display = "block";

        currentToolTip = this;

        return this.element;
    },

    hide: function()
    {
        if (!this.element)
            return;

        this.removeListeners();

        // Remove UI
        this.element.parentNode.removeChild(this.element);
        currentToolTip = this.element = null;
    },

    addListeners: function()
    {
        this.onMouseEvent = Lib.bind(this.onMouseEvent, this);

        // Register listeners for all mouse events.
        $(document).bind(mouseEvents, this.onMouseEvent, true);
    },

    removeListeners: function()
    {
        // Remove listeners for mouse events.
        $(document).unbind(mouseEvents, this.onMouseEvent, this, true);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Listeners

    onMouseEvent: function(event)
    {
        var e = Lib.fixEvent(event);

        // If the mouse is hovering within the tooltip pass the event further to it.
        var ancestor = Lib.getAncestorByClass(e.target, "toolTip");
        if (ancestor)
            return;

        var x = event.clientX;
        var y = event.clientY;
        var box = Lib.getElementBox(this.element);

        if (event.type !== "click" && event.type !== "mousedown")
            box = Lib.inflateRect(box, 10, 10);

        // If the mouse is hovering within near neighbourhood, ignore it.
        if (Lib.pointInRect(box, x, y))
        {
            Lib.cancelEvent(e);
            return;
        }

        // If the mouse is hovering over the target, ignore it too.
        if (Lib.isAncestor(e.target, this.target))
        {
            Lib.cancelEvent(e);
            return;
        }

        // The mouse is hovering far away, let's destroy the the tooltip.
        this.hide();

        Lib.cancelEvent(e);
    }
});

// ************************************************************************************************

return ToolTip;

// **********************************************************************************************//
});
