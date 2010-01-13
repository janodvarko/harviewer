/* See license.txt for terms of usage */

HAR.ns(function() { with (Domplate) { with (HAR) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

HAR.InfoTip = extend(
{
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
        // xxxHonza: The info tip doesn't properly work in IE.
        if (dojo.isIE)
            return;

        HAR.log("har; InfoTip.initialize");

        dojo.connect(document, "mouseover", bind(this.onMouseMove, this));
        dojo.connect(document, "mouseout", bind(this.onMouseOut, this));
        dojo.connect(document, "mousemove", bind(this.onMouseMove, this));

        return this.infoTip = this.tags.infoTipTag.append({}, getBody(document));
    },

    showInfoTip: function(infoTip, panel, target, x, y, rangeParent, rangeOffset)
    {
        var scrollParent = getOverflowParent(target);
        var scrollX = x + (scrollParent ? scrollParent.scrollLeft : 0);

        if (panel.showInfoTip(infoTip, target, scrollX, y, rangeParent, rangeOffset))
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
        //xxxHonza: should be the current tab.
        var currentTab = HAR.Tab.Preview;

        this.infoTip.setAttribute("multiline", false);

        var x = event.clientX, y = event.clientY;
        this.showInfoTip(this.infoTip, currentTab, event.target,
            x, y, event.rangeParent, event.rangeOffset);
    },

    populateTimingInfoTip: function(infoTip, color)
    {
        this.tags.colorTag.replace({rgbValue: color}, infoTip);
        return true;
    }
});

//-----------------------------------------------------------------------------
// Registration

HAR.registerModule(HAR.InfoTip);

//-----------------------------------------------------------------------------
}}}});
