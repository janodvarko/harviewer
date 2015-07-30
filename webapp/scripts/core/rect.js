/* See license.txt for terms of usage */

/**
 * A module containing rectangle utilities.
 * @module core/rect
 */
define([
    "./trace"
],

function(Trace) {

//***********************************************************************************************//

/**
 * A rectangle type.
 * @typedef {Object} Rectangle
 * @property {Number} top
 * @property {Number} left
 * @property {Number} height
 * @property {Number} width
 */

/**
 * @alias module:core/rect
 */
var Rect = {};

//***********************************************************************************************//
// Rect {top, left, height, width}

/**
 * @param {module:core/rect~Rectangle} rect The rectangle to inflate.
 * @param {Number} x
 * @param {Number} y
 */
Rect.inflateRect = function(rect, x, y)
{
    return {
        top: rect.top - y,
        left: rect.left - x,
        height: rect.height + 2*y,
        width: rect.width + 2*x
    };
};

/**
 * @param {module:core/rect~Rectangle} rect The rectangle to test.
 * @param {Number} x
 * @param {Number} y
 */
Rect.pointInRect = function(rect, x, y)
{
    return (y >= rect.top && y <= rect.top + rect.height &&
        x >= rect.left && x <= rect.left + rect.width);
};

// ********************************************************************************************* //

return Rect;

// ********************************************************************************************* //
});
