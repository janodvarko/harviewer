/* See license.txt for terms of usage */

HAR.ns(function() { with (HAR.Domplate) {

//-----------------------------------------------------------------------------

/**
 * Template for HAR schema.
 */
HAR.Rep.Schema = domplate(
{
    errorTable:
        TABLE({"class": "errorTable", cellpadding: 0, cellspacing: 5},
            TBODY(
                FOR("error", "$errors",
                    TR({"class": "errorRow", _repObject: "$error"},
                        TD({"class": "errorProperty"},
                            SPAN("$error.property"
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

    parseInputData: function(jsonString, errorOutput, validate)
    {
        if (!jsonString)
            return;

        var inputData = HAR.Model.parseData(jsonString);
        if (!inputData)
        {
            this.renderErrorList(errorOutput, HAR.Model.errors);
            return null;
        }

        // Validate the input JSON if the user wants it.
        if (validate)
        {
            var start = HAR.now();

            dojo.require("dojox.json.schema");
            dojo.require("dojox.json.ref"); 

            // Resolve HAR schema (set of registered types).
            var resolvedSchema = dojox.json.ref.resolveJson(HAR.schema);
            HAR.log("har; resolvedSchema %o, %o", resolvedSchema, resolvedSchema.logType);

            // Execute validation against the logType.
            var results = dojox.json.schema.validate(inputData, resolvedSchema.logType);
            if (!results.valid)
            {
                HAR.log("har; Validation failed.", results.errors);
                this.renderErrorList(errorOutput, results.errors);
                return null;
            }

            HAR.log("har; validate data: " + HAR.Lib.formatTime(HAR.now() - start));
        }

        return inputData;
    },

    renderErrorList: function(parentNode, errors)
    {
        this.errorTable.append({errors:errors}, parentNode, this);
    }
});

//-----------------------------------------------------------------------------
}});
