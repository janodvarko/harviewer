/* See license.txt for terms of usage */

/**
 * @module core/css
 */
define([
    "core/trace"
],

function(Trace) {

//***********************************************************************************************//

/**
 * @alias module:core/css
 */
var Css = {};

//***********************************************************************************************//
// CSS

/**
 * @param {HTMLElement|String} node
 * @param {String} name
 * @return {Boolean}
 */
Css.hasClass = function(node, name) // className, className, ...
{
    if (!node || node.nodeType !== 1)
        return false;

    var $node = jQuery(node);
    for (var i=1; i<arguments.length; ++i)
    {
        name = arguments[i];
        if (!$node.hasClass(name))
            return false;
    }

    return true;
};

/**
 * @param {HTMLElement|String} node
 * @param {String} name
 */
Css.setClass = function(node, name)
{
    if (node)
        jQuery(node).addClass(name);
};

/**
 * @param {HTMLElement|String} node
 * @param {String} name
 */
Css.removeClass = function(node, name)
{
    if (node)
        jQuery(node).removeClass(name);
};

/**
 * @param {HTMLElement|String} elt
 * @param {String} name
 * @return {Boolean}
 */
Css.toggleClass = function(elt, name)
{
    if (elt)
        jQuery(elt).toggleClass(name);
};

/**
 * @param {HTMLElement} elt
 * @param {String} name
 * @param {Number} timeout
 */
Css.setClassTimed = function(elt, name, timeout)
{
    if (!timeout)
        timeout = 1300;

    if (elt.__setClassTimeout)  // then we are already waiting to remove the class mark
        clearTimeout(elt.__setClassTimeout);  // reset the timer
    else                        // then we are not waiting to remove the mark
        Css.setClass(elt, name);

    elt.__setClassTimeout = setTimeout(function()
    {
        delete elt.__setClassTimeout;
        Css.removeClass(elt, name);
    }, timeout);
};

/**
 * @param {Document} doc
 * @return {HTMLHeadElement}
 */
Css.getHead = function(doc)
{
    return doc.getElementsByTagName("head")[0];
};

// ********************************************************************************************* //
// Stylesheets

/**
 * Load stylesheet into the specified document. The method doesn't wait till the stylesheet
 * is loaded and so, not suitable for cases when you do not care when the file is loaded.
 * @param {Document} doc The document to load the stylesheet into.
 * @param {String} url URL of the target stylesheet.
 */
Css.addStyleSheet = function(doc, url)
{
    if (doc.getElementById(url))
        return;

    var link = doc.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    link.setAttribute("id", url);

    var head = Css.getHead(doc);
    head.appendChild(link);
};

// ********************************************************************************************* //

return Css;

// ********************************************************************************************* //
});
