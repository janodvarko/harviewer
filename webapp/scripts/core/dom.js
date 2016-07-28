/* See license.txt for terms of usage */

/**
 * @module core/dom
 */
define([
    "./array",
    "./css",
    "./sniff",
    "core/trace"
],

function(Arr, Css, Sniff, Trace) {

//***********************************************************************************************//

var Dom = {};

//*************************************************************************************************
// DOM

Dom.getBody = function(doc)
{
    if (doc.body)
        return doc.body;

    var body = doc.getElementsByTagName("body")[0];
    if (body)
        return body;

    // Should never happen.
    return null;
};

Dom.getAncestorByClass = function(node, className)
{
    for (var parent = node; parent; parent = parent.parentNode)
    {
        if (Css.hasClass(parent, className))
            return parent;
    }

    return null;
};

Dom.$ = function()
{
    return Dom.getElementByClass.apply(this, arguments);
};

Dom.getElementByClass = function(node, className)  // className, className, ...
{
    if (!node)
        return null;

    var args = Arr.cloneArray(arguments);
    args.splice(0, 1);
    for (var child = node.firstChild; child; child = child.nextSibling)
    {
        var args1 = Arr.cloneArray(args);
        args1.unshift(child);
        if (Css.hasClass.apply(this, args1)) {
            return child;
        }
        var found = Dom.getElementByClass.apply(this, args1);
        if (found)
            return found;
    }

    return null;
};

Dom.getElementsByClass = function(node, className)  // className, className, ...
{
    function iteratorHelper(node, classNames, result)
    {
        for (var child = node.firstChild; child; child = child.nextSibling)
        {
            var args1 = Arr.cloneArray(classNames);
            args1.unshift(child);
            if (Css.hasClass.apply(null, args1))
                result.push(child);

            iteratorHelper(child, classNames, result);
        }
    }

    var args = Arr.cloneArray(arguments);
    args.shift();

    if (node.querySelectorAll)
    {
        var selector = "." + args.join(".");
        return node.querySelectorAll(selector);
    }

    var result = [];
    iteratorHelper(node, args, result);
    return result;
};

Dom.getChildByClass = function(node) // ,classname, classname, classname...
{
    for (var i = 1; i < arguments.length; ++i)
    {
        var className = arguments[i];
        var child = node.firstChild;
        node = null;
        for (; child; child = child.nextSibling)
        {
            if (Css.hasClass(child, className))
            {
                node = child;
                break;
            }
        }
    }

    return node;
};

Dom.isAncestor = function(node, potentialAncestor)
{
    for (var parent = node; parent; parent = parent.parentNode)
    {
        if (parent === potentialAncestor)
            return true;
    }

    return false;
};

Dom.eraseNode = function(node)
{
    while (node.lastChild)
        node.removeChild(node.lastChild);
};

Dom.clearNode = function(node)
{
    node.innerHTML = "";
};


//***********************************************************************************************//
// Layout

Dom.getOverflowParent = function(element)
{
    for (var scrollParent = element.parentNode; scrollParent;
        scrollParent = scrollParent.offsetParent)
    {
        if (scrollParent.scrollHeight > scrollParent.offsetHeight)
            return scrollParent;
    }
};

Dom.getElementBox = function(el)
{
    var result = {};

    if (el.getBoundingClientRect)
    {
        var rect = el.getBoundingClientRect();

        // fix IE problem with offset when not in fullscreen mode
        var offset = Sniff.isIE ? document.body.clientTop || document.documentElement.clientTop: 0;
        var scroll = Dom.getWindowScrollPosition();

        result.top = Math.round(rect.top - offset + scroll.top);
        result.left = Math.round(rect.left - offset + scroll.left);
        result.height = Math.round(rect.bottom - rect.top);
        result.width = Math.round(rect.right - rect.left);
    }
    else
    {
        var position = Dom.getElementPosition(el);

        result.top = position.top;
        result.left = position.left;
        result.height = el.offsetHeight;
        result.width = el.offsetWidth;
    }

    return result;
};

Dom.getElementPosition = function(el)
{
    var left = 0;
    var top = 0;

    do
    {
        left += el.offsetLeft;
        top += el.offsetTop;
    }
    while (el === el.offsetParent);

    return {left:left, top:top};
};

Dom.getWindowSize = function()
{
    var width = 0;
    var height = 0;
    var el;

    if (typeof window.innerWidth === "number")
    {
        width = window.innerWidth;
        height = window.innerHeight;
    }
    else if ((el=document.documentElement) && (el.clientHeight || el.clientWidth))
    {
        width = el.clientWidth;
        height = el.clientHeight;
    }
    else if ((el=document.body) && (el.clientHeight || el.clientWidth))
    {
        width = el.clientWidth;
        height = el.clientHeight;
    }

    return {width: width, height: height};
};

Dom.getWindowScrollSize = function()
{
    var width = 0;
    var height = 0;
    var el;

    // first try the document.documentElement scroll size
    if (!Sniff.isIEQuiksMode && (el=document.documentElement) &&
       (el.scrollHeight || el.scrollWidth))
    {
        width = el.scrollWidth;
        height = el.scrollHeight;
    }

    // then we need to check if document.body has a bigger scroll size value
    // because sometimes depending on the browser and the page, the document.body
    // scroll size returns a smaller (and wrong) measure
    if ((el=document.body) && (el.scrollHeight || el.scrollWidth) &&
        (el.scrollWidth > width || el.scrollHeight > height))
    {
        width = el.scrollWidth;
        height = el.scrollHeight;
    }

    return {width: width, height: height};
};

Dom.getWindowScrollPosition = function()
{
    var top = 0;
    var left = 0;
    var el;

    if(typeof window.pageYOffset === "number")
    {
        top = window.pageYOffset;
        left = window.pageXOffset;
    }
    else if((el=document.body) && (el.scrollTop || el.scrollLeft))
    {
        top = el.scrollTop;
        left = el.scrollLeft;
    }
    else if((el=document.documentElement) && (el.scrollTop || el.scrollLeft))
    {
        top = el.scrollTop;
        left = el.scrollLeft;
    }

    return {top:top, left:left};
};

// ********************************************************************************************* //
// Scrolling

Dom.scrollIntoCenterView = function(element, scrollBox, notX, notY)
{
    if (!element)
        return;

    if (!scrollBox)
        scrollBox = Dom.getOverflowParent(element);

    if (!scrollBox)
        return;

    var offset = Dom.getClientOffset(element);

    if (!notY)
    {
        var topSpace = offset.y - scrollBox.scrollTop;
        var bottomSpace = (scrollBox.scrollTop + scrollBox.clientHeight)
            - (offset.y + element.offsetHeight);

        if (topSpace < 0 || bottomSpace < 0)
        {
            var centerY = offset.y - (scrollBox.clientHeight/2);
            scrollBox.scrollTop = centerY;
        }
    }

    if (!notX)
    {
        var leftSpace = offset.x - scrollBox.scrollLeft;
        var rightSpace = (scrollBox.scrollLeft + scrollBox.clientWidth)
            - (offset.x + element.clientWidth);

        if (leftSpace < 0 || rightSpace < 0)
        {
            var centerX = offset.x - (scrollBox.clientWidth/2);
            scrollBox.scrollLeft = centerX;
        }
    }
};

Dom.getClientOffset = function(elt)
{
    function addOffset(elt, coords, view)
    {
        var p = elt.offsetParent;

        var style = view.getComputedStyle(elt, "");

        if (elt.offsetLeft)
            coords.x += elt.offsetLeft + parseInt(style.borderLeftWidth, 10);
        if (elt.offsetTop)
            coords.y += elt.offsetTop + parseInt(style.borderTopWidth, 10);

        if (p)
        {
            if (p.nodeType === 1)
                addOffset(p, coords, view);
        }
        else if (elt.ownerDocument.defaultView.frameElement)
        {
            addOffset(elt.ownerDocument.defaultView.frameElement,
                coords, elt.ownerDocument.defaultView);
        }
    }

    var coords = {x: 0, y: 0};
    if (elt)
    {
        var view = elt.ownerDocument.defaultView;
        addOffset(elt, coords, view);
    }

    return coords;
};

// ********************************************************************************************* //

return Dom;

// ********************************************************************************************* //
});
