/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Domplate) { with (HAR.Lib) {

// ************************************************************************************************

/**
 * @domplate
 */
var ToolBar = domplate(
/** @lends HAR.Rep.ToolBar */
{
    tag:
        DIV({"class": "harToolbar"}),

    buttonTag:
        SPAN({"class": "harButton text", title: "$button.tooltiptext",
            onclick: "$button.oncommand"},
            "$button.label"
        ),

    separatorTag:
        SPAN({"class": "harToolBarSeparator", style: "color: gray;"}, "|"),
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

HAR.ToolBar = function()
{
    this.buttons = [];
}

HAR.ToolBar.prototype =
{
    addButton: function(button)
    {
        this.buttons.push(button);
    },

    render: function(parentNode)
    {
        var toolBar = ToolBar.tag.append({}, parentNode);
        for (var i=0; i<this.buttons.length; i++)
        {
            var button = this.buttons[i];
            button.label = button.label ? $STR(button.label) : button.label;
            var tag = button.tag ? button.tag : ToolBar.buttonTag;
            tag.append({button: button}, toolBar);

            if (i<this.buttons.length-1)
                ToolBar.separatorTag.append({}, toolBar);
        }
    }
};

// ************************************************************************************************
}}});
