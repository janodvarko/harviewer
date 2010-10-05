/* See license.txt for terms of usage */

require.def("core/trace", [
],

function() {

//*************************************************************************************************

var Trace = {
    log: function(){},
    error: function(){},
    exception: function(){},
    time: function(){},
    timeEnd: function(){}
};

if (typeof(console) == "undefined")
    return Trace;

// #ifdef _DEBUG
Trace.log = function()
{
    if (typeof(console.log) == "function")
        console.log.apply(console, arguments);
};

Trace.error = function()
{
    if (typeof(console.log) == "function")
        console.error.apply(console, arguments);
};

Trace.exception = function()
{
    if (typeof(console.log) == "function")
        console.error.apply(console, arguments);
};

Trace.time = function()
{
    if (typeof(console.log) == "function")
        console.time.apply(console, arguments);
};

Trace.timeEnd = function(name, message)
{
    if (typeof(console.log) == "function")
        console.timeEnd.apply(console, [name, message]);
};
// #endif

return Trace;

//*************************************************************************************************
});

