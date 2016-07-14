/* See license.txt for terms of usage */

/**
 * A module containing date utilities.
 * @module core/date
 */
define([
    "core/trace"
],

function(Trace) {

//***********************************************************************************************//

/**
 * @alias module:core/date
 */
var Date_ = {};

//*************************************************************************************************
// Date

/**
 * @param {String} text
 * @return {Number|null}
 */
Date_.parseISO8601 = function(text)
{
    var date = Date_.fromISOString(text);
    return date ? date.getTime() : null;
};

/**
 * @param {String} text
 * @return {Date|null}
 */
Date_.fromISOString = function(text)
{
    if (!text)
        return null;

    // Date time pattern: YYYY-MM-DDThh:mm:ss.sTZD
    // eg 1997-07-16T19:20:30.451+01:00
    // http://www.w3.org/TR/NOTE-datetime
    // xxxHonza: use the one from the schema.
    var regex = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;
    var m = text.toString().match(new RegExp(regex));
    if (!m)
        return null;

    var date = new Date();
    date.setUTCDate(1);
    date.setUTCFullYear(parseInt(m[1], 10));
    date.setUTCMonth(parseInt(m[3], 10) - 1);
    date.setUTCDate(parseInt(m[5], 10));
    date.setUTCHours(parseInt(m[7], 10));
    date.setUTCMinutes(parseInt(m[9], 10));
    date.setUTCSeconds(parseInt(m[11], 10));

    if (m[12])
        date.setUTCMilliseconds(parseFloat(m[12]) * 1000);
    else
        date.setUTCMilliseconds(0);

    if (m[13] !== 'Z')
    {
        var offset = (m[15] * 60) + parseInt(m[17], 10);
        offset *= ((m[14] === '-') ? -1 : 1);
        date.setTime(date.getTime() - offset * 60 * 1000);
    }

    return date;
};

/**
 * @param {Date} date
 * @return {String}
 */
Date_.toISOString = function(date)
{
    function f(n, c) {
        if (!c) c = 2;
        var s = new String(n);
        while (s.length < c) s = "0" + s;
        return s;
    }

    var result = date.getUTCFullYear() + '-' +
        f(date.getMonth() + 1) + '-' +
        f(date.getDate()) + 'T' +
        f(date.getHours()) + ':' +
        f(date.getMinutes()) + ':' +
        f(date.getSeconds()) + '.' +
        f(date.getMilliseconds(), 3);

    var offset = date.getTimezoneOffset();
    var offsetHours = Math.floor(offset / 60);
    var offsetMinutes = Math.floor(offset % 60);
    var prettyOffset = (offset > 0 ? "-" : "+") +
        f(Math.abs(offsetHours)) + ":" + f(Math.abs(offsetMinutes));

    return result + prettyOffset;
};

// ********************************************************************************************* //

return Date_;

// ********************************************************************************************* //
});
