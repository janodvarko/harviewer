/* See license.txt for terms of usage */

define("preview/menu", [
    "domplate/domplate",
    "core/lib",
    "domplate/toolbar",
    "core/trace"
],

function(Domplate, Lib, Toolbar, Trace) {

var domplate = Domplate.domplate;
var DIV = Domplate.DIV;

// ********************************************************************************************* //

var MenuPlate = domplate(
{
    tag:
        DIV({"class": "menu", _repObject: "$object"},
            DIV({"class": "menuHandle", onmousemove: "$onMouseMove", onclick: "$onMouseClick"}),
            DIV({"class": "menuContent", "style": "display: none"})
        ),

    onMouseMove: function(event)
    {
        var e = Lib.fixEvent(event);
        this.open(e.target);
    },

    onMouseClick: function(event)
    {
        var e = Lib.fixEvent(event);
        this.toggle(e.target);
    },

    open: function(element)
    {
        var menu = Lib.getAncestorByClass(element, "menu");
        var content = Lib.getElementByClass(menu, "menuContent");
        if (content.clientWidth > 0)
            return;

        this.toggle(element);
    },

    toggle: function(element)
    {
        var menu = Lib.getAncestorByClass(element, "menu");
        var content = Lib.getElementByClass(menu, "menuContent");
        $(content).animate({width: "toggle"}, undefined, undefined, function()
        {
            // Update class on the handle element.
            var handle = Lib.getElementByClass(menu, "menuHandle");
            if (content.clientWidth > 0)
                Lib.setClass(handle, "opened");
            else
                Lib.removeClass(handle, "opened");
        });
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Public

    render: function(parentNode, scope)
    {
        return this.tag.append({object: scope}, parentNode, this);
    }
});

// ********************************************************************************************* //
// Credentials for HAR Preview

/**
 * Renders a menu at the top-right corner of the preview.
 */
function Menu() {}
Menu.prototype =
/** @lends Menu */
{
    render: function(parentNode)
    {
        // Render basic layout of the menu.
        this.element = MenuPlate.render(parentNode);

        // Construct toolbar and render it inside the menu.
        this.toolbar = new Toolbar();

        this.toolbar.addButton({
            id: "credentials",
            label: "Powered by Jan Odvarko",
            tooltiptext: "http://www.softwareishard.com/blog/har-viewer/",
            command: Lib.bindFixed(this.onCredentials, this, true)
        });

        /*this.toolbar.addButton({
            id: "fullPreview",
            label: "Open in HAR Viewer",
            tooltiptext: "Open the current HAR file in HAR Viewer",
            command: Lib.bindFixed(this.onFullPreview, this, true)
        });*/

        var menuContent = Lib.getElementByClass(this.element, "menuContent");
        this.toolbar.render(menuContent);

        if (Lib.isWebkit)
            menuContent.style.paddingTop = "1px";
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Commands

    onCredentials: function()
    {
        // Do not remove: credentials for HAR Viewer author.
        window.open("http://www.softwareishard.com/blog/har-viewer/");
    },

    onFullPreview: function()
    {
    }
};

// ********************************************************************************************* //

return Menu;

// ********************************************************************************************* //
});
