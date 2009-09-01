/* See license.txt for terms of usage */

HAR.ns(function() { with (Domplate) {

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
            dojo.require("dojox.json.schema");
            dojo.require("dojox.json.ref"); 

            // It's enough to resolve onlyt the logType since it's the root 
            // of the structure and only the type used for validation.
            var resolvedSchema = dojox.json.ref.resolveJson(schema);
            HAR.log("har; resolvedSchema %o, %o", resolvedSchema, resolvedSchema.logType);

            // Exectute validation against the logType.
            var results = dojox.json.schema.validate(inputData, resolvedSchema.logType);
            if (!results.valid)
            {
                HAR.log("har; Validation failed.", results.errors);

                HAR.Model.setData(null);
                this.renderErrorList(errorOutput, results.errors);
                return null;
            }
        }

        return inputData;
    },

    renderErrorList: function(parentNode, errors)
    {
        this.errorTable.replace({errors:errors}, parentNode, this);
    }
});

//-----------------------------------------------------------------------------
}});
