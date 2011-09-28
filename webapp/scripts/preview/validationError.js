/* See license.txt for terms of usage */

require.def("preview/validationError", [
    "domplate/domplate",
    "core/lib",
    "core/trace"
],

function(Domplate, Lib, Trace) { with (Domplate) {

// ********************************************************************************************* //
// Template for displaying validation errors

var ValidationError = Lib.extend(
{
    // Used in case of parsing or validation errors.
    errorTable:
        TABLE({"class": "errorTable", cellpadding: 0, cellspacing: 5},
            TBODY(
                FOR("error", "$errors",
                    TR({"class": "errorRow", _repObject: "$error"},
                        TD({"class": "errorProperty"},
                            SPAN("$error.property")
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
}});
