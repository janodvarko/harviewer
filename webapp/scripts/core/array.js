/* See license.txt for terms of usage */

/**
 * @module core/array
 */
define([
    "core/trace"
],

function(Trace) {

//***********************************************************************************************//

/**
 * Helper functions for arrays.
 * @alias module:core/array
 */
var Arr = {};

//*************************************************************************************************
// Arrays

/**
 * @param {Object} object
 */
Arr.isArray = function(object)
{
    // Supported by IE9
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
    return Array.isArray(object);
};

/**
 * @param {Array} array
 * @param {Function} fn
 */
Arr.cloneArray = function(array, fn)
{
   var newArray = [];

   if (fn)
       for (var i = 0; i < array.length; ++i)
           newArray.push(fn(array[i]));
   else
       for (var j = 0; j < array.length; ++j)
           newArray.push(array[j]);

   return newArray;
};

/**
 * @param {Array} array
 * @param {Number} index
 * @param {Array} other
 */
Arr.arrayInsert = function(array, index, other)
{
   for (var i = 0; i < other.length; ++i)
       array.splice(i+index, 0, other[i]);
   return array;
};

/**
 * @param {Array} list
 * @param {Object} item
 */
Arr.remove = function(list, item)
{
    for (var i = 0; i < list.length; ++i)
    {
        if (list[i] === item)
        {
            list.splice(i, 1);
            return true;
        }
    }
    return false;
};

// ********************************************************************************************* //

return Arr;

// ********************************************************************************************* //
});
