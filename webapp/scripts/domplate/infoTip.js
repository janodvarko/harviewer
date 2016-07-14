/* See license.txt for terms of usage */

/**
 * @module domplate/infoTip
 */
define("domplate/infoTip", [
    "domplate/domplate",
    "core/lib",
    "core/trace"
],

function(Domplate, Lib, Trace) {

var domplate = Domplate.domplate;
var DIV = Domplate.DIV;

//***********************************************************************************************//

var InfoTip = Lib.extend(
{
    listeners: [],
    maxWidth: 100,
    maxHeight: 80,
    infoTipMargin: 10,
    infoTipWindowPadding: 25,

    tags: domplate(
    {
        infoTipTag: DIV({"class": "infoTip"})
    }),

    initialize: function()
    {
        var body = $("body");
        body.bind("mouseover", Lib.bind(this.onMouseMove, this));
        body.bind("mouseout", Lib.bind(this.onMouseOut, this));
        body.bind("mousemove", Lib.bind(this.onMouseMove, this));

        return this.infoTip = this.tags.infoTipTag.append({}, Lib.getBody(document));
    },

    showInfoTip: function(infoTip, target, x, y, rangeParent, rangeOffset)
    {
        var scrollParent = Lib.getOverflowParent(target);
        var scrollX = x + (scrollParent ? scrollParent.scrollLeft : 0);

        // Distribute event to all registered listeners and show the info tip if
        // any of them return true.
        var result = Lib.dispatch2(this.listeners, "showInfoTip",
            [infoTip, target, scrollX, y, rangeParent, rangeOffset]);

        if (result)
        {
            var htmlElt = infoTip.ownerDocument.documentElement;
            var panelWidth = htmlElt.clientWidth;
            var panelHeight = htmlElt.clientHeight;

            if (x+infoTip.offsetWidth + this.infoTipMargin >
                panelWidth - this.infoTipWindowPadding)
            {
                infoTip.style.left = "auto";
                infoTip.style.right = ((panelWidth-x) + this.infoTipMargin) + "px";
            }
            else
            {
                infoTip.style.left = (x + this.infoTipMargin) + "px";
                infoTip.style.right = "auto";
            }

            if (y + infoTip.offsetHeight + this.infoTipMargin > panelHeight)
            {
                infoTip.style.top = Math.max(0,
                    panelHeight - (infoTip.offsetHeight + this.infoTipMargin)) + "px";
                infoTip.style.bottom = "auto";
            }
            else
            {
                infoTip.style.top = (y + this.infoTipMargin) + "px";
                infoTip.style.bottom = "auto";
            }

            infoTip.setAttribute("active", "true");
        }
        else
        {
            this.hideInfoTip(infoTip);
        }
    },

    hideInfoTip: function(infoTip)
    {
        if (infoTip)
            infoTip.removeAttribute("active");
    },

    onMouseOut: function(event)
    {
        if (!event.relatedTarget)
            this.hideInfoTip(this.infoTip);
    },

    onMouseMove: function(event)
    {
        // There is no background image for mulitline tooltips.
        this.infoTip.setAttribute("multiline", false);

        var x = event.clientX;
        var y = event.clientY;
        this.showInfoTip(this.infoTip, event.target, x, y, event.rangeParent, event.rangeOffset);
    },

    populateTimingInfoTip: function(infoTip, color)
    {
        this.tags.colorTag.replace({rgbValue: color}, infoTip);
        return true;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Listeners

    addListener: function(listener)
    {
        this.listeners.push(listener);
    },

    removeListener: function(listener)
    {
        Lib.remove(this.listeners, listener);
    }
});

InfoTip.initialize();

// **********************************************************************************************//

return InfoTip;

// **********************************************************************************************//
});
