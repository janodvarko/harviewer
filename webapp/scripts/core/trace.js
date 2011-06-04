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
Trace.log = function(message)
{
    if (typeof(console.log) == "function")
        console.log(message);
};

Trace.error = function(message)
{
    if (typeof(console.error) == "function")
        console.error(message);
};

Trace.exception = function(message)
{
    if (typeof(console.error) == "function")
        console.error(message);
};

Trace.time = function(name, reset)
{
    if (typeof(console.time) == "function")
        console.time(name, reset);
};

Trace.timeEnd = function(name, message)
{
    if (typeof(console.timeEnd) == "function")
        console.timeEnd(name, message);
};
// #endif

return Trace;

//*************************************************************************************************
});

