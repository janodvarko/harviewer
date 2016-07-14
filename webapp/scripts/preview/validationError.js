/* See license.txt for terms of usage */

define("preview/validationError", [
    "domplate/domplate",
    "core/lib",
    "core/trace",
    "domplate/popupMenu"
],

function(Domplate, Lib, Trace, Menu) {

var domplate = Domplate.domplate;
var DIV = Domplate.DIV;
var FOR = Domplate.FOR;
var SPAN = Domplate.SPAN;
var TABLE = Domplate.TABLE;
var TBODY = Domplate.TBODY;
var TD = Domplate.TD;
var TR = Domplate.TR;

// ********************************************************************************************* //
// Template for displaying validation errors

var ValidationError = domplate(
{
    // Used in case of parsing or validation errors.
    errorTable:
        TABLE({"class": "errorTable", cellpadding: 3, cellspacing: 0},
            TBODY(
                FOR("error", "$errors",
                    TR({"class": "errorRow", _repObject: "$error"},
                        TD({"class": "errorProperty"},
                            SPAN("$error.property")
                        ),
                        TD({"class": "errorOptions", $hasTarget: "$error|hasTarget"},
                            DIV({"class": "errorOptionsTarget", onclick: "$onOpenOptions"},
                                "&nbsp;"
                            )
                        ),
                        TD("&nbsp;"),
                        TD({"class": "errorMessage"},
                            SPAN("$error.message"
                            )
                        )
                    )
                )
            )
        ),

    hasTarget: function(error)
    {
        return error.input && error.file;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Events

    onOpenOptions: function(event)
    {
        var e = Lib.fixEvent(event);
        Lib.cancelEvent(event);

        if (!Lib.isLeftClick(event))
            return;

        var target = e.target;

        // Collect all menu items.
        var row = Lib.getAncestorByClass(target, "errorRow");
        var error = row.repObject;
        if (!error || !error.input || !error.file)
            return;

        var items = this.getMenuItems(error.input, error.file);
        if (!items.length)
            return;

        // Finally, display the the popup menu.
        // xxxHonza: the old <DIV> can be still visible.
        var menu = new Menu({id: "requestContextMenu", items: items});
        menu.showPopup(target);
    },

    getMenuItems: function(input, file)
    {
        var items = [];
        Lib.dispatch(this.listeners, "getMenuItems", [items, input, file]);
        return items;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Listeners

    listeners: [],

    addListener: function(listener)
    {
        this.listeners.push(listener);
    },

    removeListener: function(listener)
    {
        Lib.remove(this.listeners, listener);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Tab

    appendError: function(err, parentNode)
    {
        if (err.errors)
            this.errorTable.append(err, parentNode);
    }
});

// ********************************************************************************************* //

return ValidationError;

// ********************************************************************************************* //
});
