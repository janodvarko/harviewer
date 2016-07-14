/* See license.txt for terms of usage */

/**
 * @module domplate/toolbar
 */
define("domplate/toolbar", [
    "domplate/domplate",
    "core/lib",
    "core/trace",
    "domplate/popupMenu"
],

function(Domplate, Lib, Trace, Menu) {

var domplate = Domplate.domplate;
var DIV = Domplate.DIV;
var SPAN = Domplate.SPAN;

//*************************************************************************************************

/**
 * @domplate Represents a toolbar widget.
 */
var ToolbarTempl = domplate(
/** @lends ToolbarTempl */
{
    tag:
        DIV({"class": "toolbar", onclick: "$onClick"}),

    buttonTag:
        SPAN({"class": "$button|getClassName toolbarButton", title: "$button.tooltiptext",
            $text: "$button|hasLabel", onclick: "$button|getCommand"},
            "$button|getLabel"
        ),

    dropDownTag:
        SPAN({"class": "$button|getClassName toolbarButton dropDown",
            _repObject: "$button",
            title: "$button.tooltiptext",
            $text: "$button|hasLabel", onclick: "$onDropDown"},
            "$button|getLabel",
            SPAN({"class": "arrow"})
        ),

    separatorTag:
        SPAN({"class": "toolbarSeparator", style: "color: gray;"}, "|"),

    hasLabel: function(button)
    {
        return button.label ? true : false;
    },

    getLabel: function(button)
    {
        return button.label ? button.label : "";
    },

    getClassName: function(button)
    {
        return button.className ? button.className : "";
    },

    getCommand: function(button)
    {
        return button.command ? button.command : function() {};
    },

    onClick: function(event)
    {
        var e = $.event.fix(event || window.event);

        // Cancel button clicks so they are not propagated further.
        Lib.cancelEvent(e);
    },

    onDropDown: function(event)
    {
        var e = $.event.fix(event || window.event);

        var target = e.target;
        var button = Lib.getAncestorByClass(target, "toolbarButton");
        var items = button.repObject.items;

        var menu = new Menu({id: "toolbarContextMenu", items: items});
        menu.showPopup(button);
    }
});

// ********************************************************************************************* //

/**
 * Toolbat widget.
 */
function Toolbar()
{
    this.buttons = [];
}

Toolbar.prototype =
/** @lends Toolbar */
{
    addButton: function(button)
    {
        if (!button.tooltiptext)
            button.tooltiptext = "";
        this.buttons.push(button);
    },

    removeButton: function(buttonId)
    {
        for (var i=0; i<this.buttons.length; i++)
        {
            if (this.buttons[i].id === buttonId)
            {
                this.buttons.splice(i, 1);
                break;
            }
        }
    },

    addButtons: function(buttons)
    {
        for (var i=0; i<buttons.length; i++)
            this.addButton(buttons[i]);
    },

    getButton: function(buttonId)
    {
        for (var i=0; i<this.buttons.length; i++)
        {
            if (this.buttons[i].id === buttonId)
                return this.buttons[i];
        }
    },

    render: function(parentNode)
    {
        // Don't render if there are no buttons. Note that buttons can be removed
        // as part of viewer customization.
        if (!this.buttons.length)
            return;

        // Use the same parent as before if just re-rendering.
        if (this.element)
            parentNode = this.element.parentNode;

        this.element = ToolbarTempl.tag.replace({}, parentNode);
        for (var i=0; i<this.buttons.length; i++)
        {
            var button = this.buttons[i];
            var defaultTag = button.items ? ToolbarTempl.dropDownTag : ToolbarTempl.buttonTag;
            var tag = button.tag ? button.tag : defaultTag;

            var element = tag.append({button: button}, this.element);

            if (button.initialize)
                button.initialize(element);

            if (i<this.buttons.length-1)
                ToolbarTempl.separatorTag.append({}, this.element);
        }

        return this.element;
    }
};

return Toolbar;

// ************************************************************************************************
});
