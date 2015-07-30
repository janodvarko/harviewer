/* See license.txt for terms of usage */

/**
 * @module core/sniff
 */
define([
    "core/trace"
],

function(Trace) {

//***********************************************************************************************//

var Sniff = {};

//***********************************************************************************************//
// Browser Version

var hasNav           = ("undefined" !== typeof navigator);
var hasWin           = ("undefined" !== typeof window);
var userAgent        = hasNav ? navigator.userAgent.toLowerCase() : "";

Sniff.isFirefox      = /firefox/.test(userAgent);
Sniff.isOpera        = /opera/.test(userAgent);
Sniff.isWebkit       = /webkit/.test(userAgent);
Sniff.isSafari       = /webkit/.test(userAgent);
Sniff.isIE           = /msie/.test(userAgent) && !/opera/.test(userAgent);
Sniff.isIE6          = hasNav && /msie 6/i.test(navigator.appVersion);
Sniff.browserVersion = (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1];
Sniff.isIElt8        = Sniff.isIE && (Sniff.browserVersion-0 < 8);
Sniff.supportsSelectElementText = hasWin && ((window.getSelection && window.document.createRange) ||
                                             (window.document.body.createTextRange));

// ********************************************************************************************* //

return Sniff;

// ********************************************************************************************* //
});
