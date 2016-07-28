/* See license.txt for terms of usage */

/**
 * @module core/object
 */
define([
    "./array",
    "./sniff"
],

function(Arr, Sniff) {

//***********************************************************************************************//

/**
 * @alias module:core/object
 */
var Obj = {};

//***********************************************************************************************//
// Type Checking

var toString = Object.prototype.toString;
var reFunction = /^\s*function(\s+[\w_$][\w\d_$]*)?\s*\(/;

/**
 * @param {Object} object
 */
Obj.isFunction = function(object)
{
    if (!object)
        return false;

    return toString.call(object) === "[object Function]" ||
        Sniff.isIE && typeof object !== "string" &&
        reFunction.test(String(object));
};

//***********************************************************************************************//
// Core concepts (extension, bind)

/**
 * @param {Object} l
 * @param {Object} r
 */
Obj.extend = function copyObject(l, r)
{
    var m = {};
    Obj.append(m, l);
    Obj.append(m, r);
    return m;
};

/**
 * @param {Object} l
 * @param {Object} r
 */
Obj.append = function(l, r)
{
    for (var n in r)
        l[n] = r[n];
    return l;
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

Obj.bind = function()  // fn, thisObject, args => thisObject.fn(args, arguments);
{
    var args = Arr.cloneArray(arguments);
    var fn = args.shift();
    var object = args.shift();
    return function() {
        return fn.apply(object, Arr.arrayInsert(Arr.cloneArray(args), 0, arguments));
    };
};

Obj.bindFixed = function() // fn, thisObject, args => thisObject.fn(args);
{
    var args = Arr.cloneArray(arguments);
    var fn = args.shift();
    var object = args.shift();
    return function() {
        return fn.apply(object, args);
    };
};

// ********************************************************************************************* //

return Obj;

// ********************************************************************************************* //
});
