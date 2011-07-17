/* See license.txt for terms of usage */

require.def("preview/menu", [
    "domplate/domplate",
    "core/lib",
    "domplate/toolbar",
    "core/trace"
],

function(Domplate, Lib, Toolbar, Trace) { with (Domplate) {

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
            label: "Powered by: Jan Odvarko",
            tooltiptext: "www.softwareishard.com/about",
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
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Commands

    onCredentials: function()
    {
        // Do not remove: credentials for HAR Viewer author.
        window.open("http://www.softwareishard.com/about");
    },

    onFullPreview: function()
    {
    }
};

// ********************************************************************************************* //

var MenuPlate = domplate(
{
    tag:
        DIV({"class": "menu", _repObject: "$object"},
            DIV({"class": "menuHandle", onmousemove: "$onMouseMove", onclick: "$onMouseClick"}),
            SPAN({"class": "menuContent", "style": "display: none"})
        ),

    onMouseMove: function(event)
    {
        this.open(event.target);
    },

    onMouseClick: function(event)
    {
        this.toggle(event.target);
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

return Menu;

// ********************************************************************************************* //
}});
