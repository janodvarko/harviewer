/* See license.txt for terms of usage */

/**
 * @module core/json
 */
define([
    "./trace"
],

function(Trace) {

//***********************************************************************************************//

/**
 * @alias module:core/json
 */
var Json = {};

//***********************************************************************************************//
// JSON

/**
 * @param {Object} obj
 * @return {Object|null}
 */
Json.cloneJSON = function(obj)
{
    if (obj === null || typeof(obj) !== "object")
        return obj;

    try
    {
        var temp = obj.constructor();
        for (var key in obj)
            temp[key] = this.cloneJSON(obj[key]);
        return temp;
    }
    catch (err)
    {
        Trace.exception(err);
    }

    return null;
};

// ********************************************************************************************* //

return Json;

// ********************************************************************************************* //
});
