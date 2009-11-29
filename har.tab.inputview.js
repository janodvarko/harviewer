/* See license.txt for terms of usage */

HAR.ns(function() { with (Domplate) { with (HAR.Lib) {

//-----------------------------------------------------------------------------

/**
 * InputView tab implementation. This object is intended to display input box
 * (text area) for input HAR log.
 */
HAR.Tab.InputView = domplate(
{
    render: function(parentNode)
    {
        HAR.log("har; Render Input tab.");

        var template = HAR.$("InputTabTemplate");
        parentNode.innerHTML = template.innerHTML;

        // Clean up the template so, there are no elements with the same ID
        // (e.g. the "sourceEditor).
        clearNode(template);
    }
});

//-----------------------------------------------------------------------------
}}});
