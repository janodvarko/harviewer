/* See license.txt for terms of usage */

/**
 * Core support for HAR Viewer application.
 */
var HAR = {};
(function() {

//-----------------------------------------------------------------------------

// Basic support for namespaces.
var namespaces = [];
this.ns = function(fn)
{
    var ns = {};
    namespaces.push(fn, ns);
    return ns;
};

// Application init procedure
this.initialize = function()
{
    // Define basic namespaces.
    HAR.Rep = {};
    HAR.Tab = {};
    HAR.Lib = {};
    HAR.Page = {};

    // Initialize registered namespaces.
    for (var i=0; i<namespaces.length; i+=2) {
        var fn = namespaces[i];
        var ns = namespaces[i+1];
        fn.apply(ns);
    }

    // Initialize application viewer (main app object).
    HAR.Viewer.initialize();
    HAR.InfoTip.initialize();
};

// Returns HARViewer version
this.getVersion = function()
{
    var content = HAR.$("content");
    if (content)
        return content.getAttribute("version");
}

//-----------------------------------------------------------------------------

/**
 * Support for debugging.
 */
this.log = function() {};
this.error = function() {};


//-----------------------------------------------------------------------------

/**
 * Helper functions. xxxHonza: should be in LIB.
 */
this.$ = dojo.byId;

//xxxHonza: should be the one from Dojo.
//xxxHonza: duplicated in domplate.
this.extend = function copyObject(l, r)
{
    var m = {};
    extend(m, l);
    extend(m, r);
    return m;
}

function extend(l, r)
{
    for (var n in r)
        l[n] = r[n];
}

// xxxHonza: Use Dojo for this if possible. 
this.now = function() { return (new Date()).getTime(); }
var expando = "har" + this.now(); 
this.eventFix = function(event)
{
    if ( event[expando] == true )
        return event;

    // store a copy of the original event object
    // and "clone" to set read-only properties
    var originalEvent = event;
    event = { originalEvent: originalEvent };
    var props = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target timeStamp toElement type view wheelDelta which".split(" ");
    for ( var i=props.length; i; i-- )
        event[ props[i] ] = originalEvent[ props[i] ];

    // Mark it as fixed
    event[expando] = true;

    // add preventDefault and stopPropagation since
    // they will not work on the clone
    event.preventDefault = function() {
        // if preventDefault exists run it on the original event
        if (originalEvent.preventDefault)
            originalEvent.preventDefault();
        // otherwise set the returnValue property of the original event to false (IE)
        originalEvent.returnValue = false;
    };
    event.stopPropagation = function() {
        // if stopPropagation exists run it on the original event
        if (originalEvent.stopPropagation)
            originalEvent.stopPropagation();
        // otherwise set the cancelBubble property of the original event to true (IE)
        originalEvent.cancelBubble = true;
    };

    // Fix timeStamp
    event.timeStamp = event.timeStamp || this.now();

    // Fix target property, if necessary
    if ( !event.target )
        event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either

    // check if target is a textnode (safari)
    if ( event.target.nodeType == 3 )
        event.target = event.target.parentNode;

    // Add relatedTarget, if necessary
    if ( !event.relatedTarget && event.fromElement )
        event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;

    // Calculate pageX/Y if missing and clientX/Y available
    if ( event.pageX == null && event.clientX != null ) {
        var doc = document.documentElement, body = document.body;
        event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
        event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
    }

    // Add which for key events
    if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) )
        event.which = event.charCode || event.keyCode;

    // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
    if ( !event.metaKey && event.ctrlKey )
        event.metaKey = event.ctrlKey;

    // Add which for click: 1 == left; 2 == middle; 3 == right
    // Note: button is not normalized, so don't use it
    if ( !event.which && event.button )
        event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));

    return event;
}

//-----------------------------------------------------------------------------

dojo.addOnLoad(HAR.initialize);

//-----------------------------------------------------------------------------
}).apply(HAR);

