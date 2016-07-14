/* See license.txt for terms of usage */

/**
 * @module core/events
 */
define([
    "core/trace"
],

function(Trace) {

//***********************************************************************************************//

/**
 * @alias module:core/events
 */
var Events = {};

//***********************************************************************************************//

/**
 * @param {Array} listeners
 * @param {String} name
 * @param {Array} args
 */
Events.dispatch = function(listeners, name, args)
{
    for (var i=0; listeners && i<listeners.length; i++)
    {
        var listener = listeners[i];
        if (listener[name])
        {
            try
            {
                listener[name].apply(listener, args);
            }
            catch (exc)
            {
                Trace.exception(exc);
            }
        }
    }
};

/**
 * @param {Array} listeners
 * @param {String} name
 * @param {Array} args
 */
Events.dispatch2 = function(listeners, name, args)
{
    for (var i=0; i<listeners.length; i++)
    {
        var listener = listeners[i];
        if (listener[name])
        {
            try
            {
                var result = listener[name].apply(listener, args);
                if (result)
                    return result;
            }
            catch (exc)
            {
                Trace.exception(exc);
            }
        }
    }
};

//***********************************************************************************************//
// Events

/**
 *
 */
Events.fixEvent = function(e)
{
    return jQuery.event.fix(e || window.event);
};

/**
 *
 */
Events.fireEvent = function(element, event)
{
    if (document.createEvent)
    {
        var evt = document.createEvent("Events");
        evt.initEvent(event, true, false); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    }
};

/**
 *
 */
Events.cancelEvent = function(event)
{
    var e = Events.fixEvent(event);
    e.stopPropagation();
    e.preventDefault();
};

/**
 *
 */
Events.addEventListener = function(object, name, handler, direction)
{
    direction = direction || false;

    if (object.addEventListener)
        object.addEventListener(name, handler, direction);
    else
        object.attachEvent("on"+name, handler);
};

/**
 *
 */
Events.removeEventListener = function(object, name, handler, direction)
{
    direction = direction || false;

    if (object.removeEventListener)
        object.removeEventListener(name, handler, direction);
    else
        object.detachEvent("on"+name, handler);
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
// Key Events

/**
 *
 */
Events.isLeftClick = function(event)
{
    return event.button === 0 && Events.noKeyModifiers(event);
};

/**
 *
 */
Events.noKeyModifiers = function(event)
{
    return !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;
};

/**
 *
 */
Events.isControlClick = function(event)
{
    return event.button === 0 && Events.isControl(event);
};

/**
 *
 */
Events.isShiftClick = function(event)
{
    return event.button === 0 && Events.isShift(event);
};

/**
 *
 */
Events.isControl = function(event)
{
    return (event.metaKey || event.ctrlKey) && !event.shiftKey && !event.altKey;
};

/**
 *
 */
Events.isAlt = function(event)
{
    return event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey;
};

/**
 *
 */
Events.isAltClick = function(event)
{
    return event.button === 0 && Events.isAlt(event);
};

/**
 *
 */
Events.isControlShift = function(event)
{
    return (event.metaKey || event.ctrlKey) && event.shiftKey && !event.altKey;
};

/**
 *
 */
Events.isShift = function(event)
{
    return event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey;
};

// ********************************************************************************************* //

return Events;

// ********************************************************************************************* //
});
