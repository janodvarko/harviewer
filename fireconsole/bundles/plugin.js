// @pinf-bundle-ignore: 
PINF.bundle("", function(require) {
// @pinf-bundle-header: {"helper":"amd"}
function define(id, dependencies, moduleInitializer) {
    if (typeof dependencies === "undefined" && typeof moduleInitializer === "undefined") {
        if (typeof id === "function") {
            moduleInitializer = id;
        } else {
            var exports = id;
            moduleInitializer = function() { return exports; }
        }
        dependencies = ["require", "exports", "module"];
        id = null;
    } else
    if (Array.isArray(id) && typeof dependencies === "function" && typeof moduleInitializer === "undefined") {
        moduleInitializer = dependencies;
        dependencies = id;
        id = null;
    } else
    if (typeof id === "string" && typeof dependencies === "function" && typeof moduleInitializer === "undefined") {
        moduleInitializer = dependencies;
        dependencies = ["require", "exports", "module"];
    }
    return function(realRequire, exports, module) {
        function require(id) {
            if (Array.isArray(id)) {
                var apis = [];
                var callback = arguments[1];
                id.forEach(function(moduleId, index) {
                    realRequire.async(moduleId, function(api) {
                        apis[index] = api
                        if (apis.length === id.length) {
                            if (callback) callback.apply(null, apis);
                        }
                    }, function(err) {
                        throw err;
                    });
                });
            } else {
                return realRequire(id);
            }
        }
        require.toUrl = function(id) {
            return realRequire.sandbox.id.replace(/\/[^\/]*$/, "") + realRequire.id(id);
        }
        require.sandbox = realRequire.sandbox;
        require.id = realRequire.id;
        if (typeof amdRequireImplementation !== "undefined") {
            amdRequireImplementation = require;
        }
        if (typeof moduleInitializer === "function") {
            return moduleInitializer.apply(moduleInitializer, dependencies.map(function(name) {
                if (name === "require") return require;
                if (name === "exports") return exports;
                if (name === "module") return module;
                return require(name);
            }));
        } else
        if (typeof dependencies === "object") {
            return dependencies;
        }
    }
}
define.amd = { jQuery: true };
require.def = define;
// @pinf-bundle-module: {"file":"plugin.js","mtime":1420588688,"wrapper":"commonjs","format":"commonjs","id":"/plugin.js"}
require.memoize("/plugin.js", 
function(require, exports, module) {var __dirname = '';

var JQUERY = require("jquery/jquery");
var HARVIEWER = require("harviewer");

exports.main = function (domNode) {

	HARVIEWER.init(domNode || JQUERY("#content")[0]);

}

}
, {"filename":"plugin.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/jquery/jquery.js","mtime":1420421820,"wrapper":"amd","format":"amd","id":"45d7de3498542e1f7118e3db47ee8e06dbc24163-jquery/jquery.js"}
require.memoize("45d7de3498542e1f7118e3db47ee8e06dbc24163-jquery/jquery.js", 
/*!
 * jQuery JavaScript Library v1.5.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Feb 23 13:55:29 2011 -0500
 */

define([],function () {

return (function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// Has the ready events already been bound?
	readyBound = false,

	// The deferred used on DOM ready
	readyList,

	// Promise methods
	promiseMethods = "then done fail isResolved isRejected promise".split( " " ),

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = "body";
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.5.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.done( fn );

		return this;
	},

	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {
		// A third-party is pushing the ready event forwards
		if ( wait === true ) {
			jQuery.readyWait--;
		}

		// Make sure that the DOM is not already loaded
		if ( !jQuery.readyWait || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).unbind( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyBound ) {
			return;
		}

		readyBound = true;

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNaN: function( obj ) {
		return obj == null || !rdigit.test( obj ) || isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw msg;
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test(data.replace(rvalidescape, "@")
			.replace(rvalidtokens, "]")
			.replace(rvalidbraces, "")) ) {

			// Try to use the native JSON parser first
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			jQuery.error( "Invalid JSON: " + data );
		}
	},

	// Cross-browser xml parsing
	// (xml & tmp used internally)
	parseXML: function( data , xml , tmp ) {

		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}

		tmp = xml.documentElement;

		if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
			jQuery.error( "Invalid XML: " + data );
		}

		return xml;
	},

	noop: function() {},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement,
				script = document.createElement( "script" );

			if ( jQuery.support.scriptEval() ) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}

			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type(array);

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {
		if ( array.indexOf ) {
			return array.indexOf( elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var ret = [], value;

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	proxy: function( fn, proxy, thisObject ) {
		if ( arguments.length === 2 ) {
			if ( typeof proxy === "string" ) {
				thisObject = fn;
				fn = thisObject[ proxy ];
				proxy = undefined;

			} else if ( proxy && !jQuery.isFunction( proxy ) ) {
				thisObject = proxy;
				proxy = undefined;
			}
		}

		if ( !proxy && fn ) {
			proxy = function() {
				return fn.apply( thisObject || this, arguments );
			};
		}

		// Set the guid of unique handler to the same of original handler, so it can be removed
		if ( fn ) {
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
		}

		// So proxy can be declared as an argument
		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can be optionally by executed if its a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return (new Date()).getTime();
	},

	// Create a simple deferred (one callbacks list)
	_Deferred: function() {
		var // callbacks list
			callbacks = [],
			// stored [ context , args ]
			fired,
			// to avoid firing when already doing so
			firing,
			// flag to know if the deferred has been cancelled
			cancelled,
			// the deferred itself
			deferred  = {

				// done( f1, f2, ...)
				done: function() {
					if ( !cancelled ) {
						var args = arguments,
							i,
							length,
							elem,
							type,
							_fired;
						if ( fired ) {
							_fired = fired;
							fired = 0;
						}
						for ( i = 0, length = args.length; i < length; i++ ) {
							elem = args[ i ];
							type = jQuery.type( elem );
							if ( type === "array" ) {
								deferred.done.apply( deferred, elem );
							} else if ( type === "function" ) {
								callbacks.push( elem );
							}
						}
						if ( _fired ) {
							deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
						}
					}
					return this;
				},

				// resolve with given context and args
				resolveWith: function( context, args ) {
					if ( !cancelled && !fired && !firing ) {
						firing = 1;
						try {
							while( callbacks[ 0 ] ) {
								callbacks.shift().apply( context, args );
							}
						}
						// We have to add a catch block for
						// IE prior to 8 or else the finally
						// block will never get executed
						catch (e) {
							throw e;
						}
						finally {
							fired = [ context, args ];
							firing = 0;
						}
					}
					return this;
				},

				// resolve with this as context and given arguments
				resolve: function() {
					deferred.resolveWith( jQuery.isFunction( this.promise ) ? this.promise() : this, arguments );
					return this;
				},

				// Has this deferred been resolved?
				isResolved: function() {
					return !!( firing || fired );
				},

				// Cancel
				cancel: function() {
					cancelled = 1;
					callbacks = [];
					return this;
				}
			};

		return deferred;
	},

	// Full fledged deferred (two callbacks list)
	Deferred: function( func ) {
		var deferred = jQuery._Deferred(),
			failDeferred = jQuery._Deferred(),
			promise;
		// Add errorDeferred methods, then and promise
		jQuery.extend( deferred, {
			then: function( doneCallbacks, failCallbacks ) {
				deferred.done( doneCallbacks ).fail( failCallbacks );
				return this;
			},
			fail: failDeferred.done,
			rejectWith: failDeferred.resolveWith,
			reject: failDeferred.resolve,
			isRejected: failDeferred.isResolved,
			// Get a promise for this deferred
			// If obj is provided, the promise aspect is added to the object
			promise: function( obj ) {
				if ( obj == null ) {
					if ( promise ) {
						return promise;
					}
					promise = obj = {};
				}
				var i = promiseMethods.length;
				while( i-- ) {
					obj[ promiseMethods[i] ] = deferred[ promiseMethods[i] ];
				}
				return obj;
			}
		} );
		// Make sure only one callback list will be used
		deferred.done( failDeferred.cancel ).fail( deferred.cancel );
		// Unexpose cancel
		delete deferred.cancel;
		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}
		return deferred;
	},

	// Deferred helper
	when: function( object ) {
		var lastIndex = arguments.length,
			deferred = lastIndex <= 1 && object && jQuery.isFunction( object.promise ) ?
				object :
				jQuery.Deferred(),
			promise = deferred.promise();

		if ( lastIndex > 1 ) {
			var array = slice.call( arguments, 0 ),
				count = lastIndex,
				iCallback = function( index ) {
					return function( value ) {
						array[ index ] = arguments.length > 1 ? slice.call( arguments, 0 ) : value;
						if ( !( --count ) ) {
							deferred.resolveWith( promise, array );
						}
					};
				};
			while( ( lastIndex-- ) ) {
				object = array[ lastIndex ];
				if ( object && jQuery.isFunction( object.promise ) ) {
					object.promise().then( iCallback(lastIndex), deferred.reject );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( promise, array );
			}
		} else if ( deferred !== object ) {
			deferred.resolve( object );
		}
		return promise;
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySubclass( selector, context ) {
			return new jQuerySubclass.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySubclass, this );
		jQuerySubclass.superclass = this;
		jQuerySubclass.fn = jQuerySubclass.prototype = this();
		jQuerySubclass.fn.constructor = jQuerySubclass;
		jQuerySubclass.subclass = this.subclass;
		jQuerySubclass.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySubclass) ) {
				context = jQuerySubclass(context);
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySubclass );
		};
		jQuerySubclass.fn.init.prototype = jQuerySubclass.fn;
		var rootjQuerySubclass = jQuerySubclass(document);
		return jQuerySubclass;
	},

	browser: {}
});

// Create readyList deferred
readyList = jQuery._Deferred();

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

if ( indexOf ) {
	jQuery.inArray = function( elem, array ) {
		return indexOf.call( array, elem );
	};
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

// Expose jQuery to the global object
return jQuery;

})();


(function() {

	jQuery.support = {};

	var div = document.createElement("div");

	div.style.display = "none";
	div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0],
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") ),
		input = div.getElementsByTagName("input")[0];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: input.value === "on",

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Will be defined later
		deleteExpando: true,
		optDisabled: false,
		checkClone: false,
		noCloneEvent: true,
		noCloneChecked: true,
		boxModel: null,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableHiddenOffsets: true
	};

	input.checked = true;
	jQuery.support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as diabled)
	select.disabled = true;
	jQuery.support.optDisabled = !opt.disabled;

	var _scriptEval = null;
	jQuery.support.scriptEval = function() {
		if ( _scriptEval === null ) {
			var root = document.documentElement,
				script = document.createElement("script"),
				id = "script" + jQuery.now();

			try {
				script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
			} catch(e) {}

			root.insertBefore( script, root.firstChild );

			// Make sure that the execution of code works by injecting a script
			// tag with appendChild/createTextNode
			// (IE doesn't support this, fails, and uses .text instead)
			if ( window[ id ] ) {
				_scriptEval = true;
				delete window[ id ];
			} else {
				_scriptEval = false;
			}

			root.removeChild( script );
			// release memory in IE
			root = script = id  = null;
		}

		return _scriptEval;
	};

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;

	} catch(e) {
		jQuery.support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function click() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", click);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	div = document.createElement("div");
	div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

	var fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function() {
		var div = document.createElement("div"),
			body = document.getElementsByTagName("body")[0];

		// Frameset documents with no body should not run this code
		if ( !body ) {
			return;
		}

		div.style.width = div.style.paddingLeft = "1px";
		body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;

		if ( "zoom" in div.style ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			jQuery.support.inlineBlockNeedsLayout = div.offsetWidth === 2;

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			jQuery.support.shrinkWrapBlocks = div.offsetWidth !== 2;
		}

		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		var tds = div.getElementsByTagName("td");

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		jQuery.support.reliableHiddenOffsets = tds[0].offsetHeight === 0;

		tds[0].style.display = "";
		tds[1].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE < 8 fail this test)
		jQuery.support.reliableHiddenOffsets = jQuery.support.reliableHiddenOffsets && tds[0].offsetHeight === 0;
		div.innerHTML = "";

		body.removeChild( div ).style.display = "none";
		div = tds = null;
	});

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	var eventSupported = function( eventName ) {
		var el = document.createElement("div");
		eventName = "on" + eventName;

		// We only care about the case where non-standard event systems
		// are used, namely in IE. Short-circuiting here helps us to
		// avoid an eval call (in setAttribute) which can cause CSP
		// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
		if ( !el.attachEvent ) {
			return true;
		}

		var isSupported = (eventName in el);
		if ( !isSupported ) {
			el.setAttribute(eventName, "return;");
			isSupported = typeof el[eventName] === "function";
		}
		el = null;

		return isSupported;
	};

	jQuery.support.submitBubbles = eventSupported("submit");
	jQuery.support.changeBubbles = eventSupported("change");

	// release memory in IE
	div = all = a = null;
})();



var rbrace = /^(?:\{.*\}|\[.*\])$/;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];

		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, getByName = typeof name === "string", thisCache,

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || (pvt && id && !cache[ id ][ internalKey ])) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ jQuery.expando ] = id = ++jQuery.uuid;
			} else {
				id = jQuery.expando;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ][ internalKey ] = jQuery.extend(cache[ id ][ internalKey ], name);
			} else {
				cache[ id ] = jQuery.extend(cache[ id ], name);
			}
		}

		thisCache = cache[ id ];

		// Internal jQuery data is stored in a separate object inside the object's data
		// cache in order to avoid key collisions between internal data and user-defined
		// data
		if ( pvt ) {
			if ( !thisCache[ internalKey ] ) {
				thisCache[ internalKey ] = {};
			}

			thisCache = thisCache[ internalKey ];
		}

		if ( data !== undefined ) {
			thisCache[ name ] = data;
		}

		// TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
		// not attempt to inspect the internal events object using jQuery.data, as this
		// internal data object is undocumented and subject to change.
		if ( name === "events" && !thisCache[name] ) {
			return thisCache[ internalKey ] && thisCache[ internalKey ].events;
		}

		return getByName ? thisCache[ name ] : thisCache;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {
			var thisCache = pvt ? cache[ id ][ internalKey ] : cache[ id ];

			if ( thisCache ) {
				delete thisCache[ name ];

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !isEmptyDataObject(thisCache) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( pvt ) {
			delete cache[ id ][ internalKey ];

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		var internalCache = cache[ id ][ internalKey ];

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		if ( jQuery.support.deleteExpando || cache != window ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the entire user cache at once because it's faster than
		// iterating through each key, but we need to continue to persist internal
		// data if it existed
		if ( internalCache ) {
			cache[ id ] = {};
			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}

			cache[ id ][ internalKey ] = internalCache;

		// Otherwise, we need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		} else if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			} else {
				elem[ jQuery.expando ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 ) {
					var attr = this[0].attributes, name;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = name.substr( 5 );
							dataAttr( this[0], name, data[ name ] );
						}
					}
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		data = elem.getAttribute( "data-" + key );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				!jQuery.isNaN( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// TODO: This is a hack for 1.5 ONLY to allow objects with a single toJSON
// property to be considered empty objects; this property always exists in
// order to make sure JSON.stringify does not expose internal metadata
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




jQuery.extend({
	queue: function( elem, type, data ) {
		if ( !elem ) {
			return;
		}

		type = (type || "fx") + "queue";
		var q = jQuery._data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if ( !data ) {
			return q || [];
		}

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery._data( elem, type, jQuery.makeArray(data) );

		} else {
			q.push( data );
		}

		return q;
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue", true );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function( i ) {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},

	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	}
});




var rclass = /[\n\t\r]/g,
	rspaces = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /^(?:href|src|style)$/,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rradiocheck = /^(?:radio|checkbox)$/i;

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	colspan: "colSpan",
	tabindex: "tabIndex",
	usemap: "useMap",
	frameborder: "frameBorder"
};

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name, fn ) {
		return this.each(function(){
			jQuery.attr( this, name, "" );
			if ( this.nodeType === 1 ) {
				this.removeAttribute( name );
			}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ",
							setClass = elem.className;

						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspaces );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( !arguments.length ) {
			var elem = this[0];

			if ( elem ) {
				if ( jQuery.nodeName( elem, "option" ) ) {
					// attributes.value is undefined in Blackberry 4.7 but
					// uses .value. See #6932
					var val = elem.attributes.value;
					return !val || val.specified ? elem.value : elem.text;
				}

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						// Don't return options that are disabled or in a disabled optgroup
						if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
								(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
					if ( one && !values.length && options.length ) {
						return jQuery( options[ index ] ).val();
					}

					return values;
				}

				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}

				// Everything else, we just grab the value
				return (elem.value || "").replace(rreturn, "");

			}

			return undefined;
		}

		var isFunction = jQuery.isFunction(value);

		return this.each(function(i) {
			var self = jQuery(this), val = value;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call(this, i, self.val());
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray(val) ) {
				val = jQuery.map(val, function (value) {
					return value == null ? "" : value + "";
				});
			}

			if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
				this.checked = jQuery.inArray( self.val(), val ) >= 0;

			} else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}

			} else {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || elem.nodeType === 2 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery(elem)[name](value);
		}

		var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// Only do all the following if this is a node (faster for style)
		if ( elem.nodeType === 1 ) {
			// These attributes require special treatment
			var special = rspecialurl.test( name );

			// Safari mis-reports the default selected property of an option
			// Accessing the parent's selectedIndex property fixes it
			if ( name === "selected" && !jQuery.support.optSelected ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;

					// Make sure that it also works with optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}

			// If applicable, access the attribute via the DOM 0 way
			// 'in' checks fail in Blackberry 4.7 #6931
			if ( (name in elem || elem[ name ] !== undefined) && notxml && !special ) {
				if ( set ) {
					// We can't allow the type property to be changed (since it causes problems in IE)
					if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
						jQuery.error( "type property can't be changed" );
					}

					if ( value === null ) {
						if ( elem.nodeType === 1 ) {
							elem.removeAttribute( name );
						}

					} else {
						elem[ name ] = value;
					}
				}

				// browsers index elements by id/name on forms, give priority to attributes.
				if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
					return elem.getAttributeNode( name ).nodeValue;
				}

				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				if ( name === "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );

					return attributeNode && attributeNode.specified ?
						attributeNode.value :
						rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml && name === "style" ) {
				if ( set ) {
					elem.style.cssText = "" + value;
				}

				return elem.style.cssText;
			}

			if ( set ) {
				// convert the value to a string (all browsers do this but IE) see #1070
				elem.setAttribute( name, "" + value );
			}

			// Ensure that missing attributes return undefined
			// Blackberry 4.7 returns "" from getAttribute #6938
			if ( !elem.attributes[ name ] && (elem.hasAttribute && !elem.hasAttribute( name )) ) {
				return undefined;
			}

			var attr = !jQuery.support.hrefNormalized && notxml && special ?
					// Some attributes require a special call on IE
					elem.getAttribute( name, 2 ) :
					elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return attr === null ? undefined : attr;
		}
		// Handle everything which isn't a DOM element node
		if ( set ) {
			elem[ name ] = value;
		}
		return elem[ name ];
	}
});




var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspace = / /g,
	rescape = /[^\w\s.|`]/g,
	fcleanup = function( nm ) {
		return nm.replace(rescape, "\\$&");
	};

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// TODO :: Use a try/catch until it's safe to pull this out (likely 1.6)
		// Minor release fix for bug #8018
		try {
			// For whatever reason, IE has trouble passing the window object
			// around, causing it to be cloned in the process
			if ( jQuery.isWindow( elem ) && ( elem !== window && !elem.frameElement ) ) {
				elem = window;
			}
		}
		catch ( e ) {}

		if ( handler === false ) {
			handler = returnFalse;
		} else if ( !handler ) {
			// Fixes bug #7229. Fix recommended by jdalton
			return;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery._data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData.events,
			eventHandle = elemData.handle;

		if ( !events ) {
			elemData.events = events = {};
		}

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function() {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			if ( !handleObj.guid ) {
				handleObj.guid = handler.guid;
			}

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		}

		var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			events = elemData && elemData.events;

		if ( !elemData || !events ) {
			return;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" +
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem, undefined, true );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem /*, bubbling */ ) {
		// Event object or event type
		var type = event.type || event,
			bubbling = arguments[3];

		if ( !bubbling ) {
			event = typeof event === "object" ?
				// jQuery.Event object
				event[ jQuery.expando ] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();

				// Only trigger if we've ever bound an event for it
				if ( jQuery.event.global[ type ] ) {
					// XXX This code smells terrible. event.js should not be directly
					// inspecting the data cache
					jQuery.each( jQuery.cache, function() {
						// internalKey variable is just used to make it easier to find
						// and potentially change this stuff later; currently it just
						// points to jQuery.expando
						var internalKey = jQuery.expando,
							internalCache = this[ internalKey ];
						if ( internalCache && internalCache.events && internalCache.events[ type ] ) {
							jQuery.event.trigger( event, data, internalCache.handle.elem );
						}
					});
				}
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
				return undefined;
			}

			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;

			// Clone the incoming data, if any
			data = jQuery.makeArray( data );
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = jQuery._data( elem, "handle" );

		if ( handle ) {
			handle.apply( elem, data );
		}

		var parent = elem.parentNode || elem.ownerDocument;

		// Trigger an inline bound script
		try {
			if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
				if ( elem[ "on" + type ] && elem[ "on" + type ].apply( elem, data ) === false ) {
					event.result = false;
					event.preventDefault();
				}
			}

		// prevent IE from throwing an error for some elements with some event types, see #3533
		} catch (inlineError) {}

		if ( !event.isPropagationStopped() && parent ) {
			jQuery.event.trigger( event, data, parent, true );

		} else if ( !event.isDefaultPrevented() ) {
			var old,
				target = event.target,
				targetType = type.replace( rnamespaces, "" ),
				isClick = jQuery.nodeName( target, "a" ) && targetType === "click",
				special = jQuery.event.special[ targetType ] || {};

			if ( (!special._default || special._default.call( elem, event ) === false) &&
				!isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()]) ) {

				try {
					if ( target[ targetType ] ) {
						// Make sure that we don't accidentally re-trigger the onFOO events
						old = target[ "on" + targetType ];

						if ( old ) {
							target[ "on" + targetType ] = null;
						}

						jQuery.event.triggered = true;
						target[ targetType ]();
					}

				// prevent IE from throwing an error for some elements with some event types, see #3533
				} catch (triggerError) {}

				if ( old ) {
					target[ "on" + targetType ] = old;
				}

				jQuery.event.triggered = false;
			}
		}
	},

	handle: function( event ) {
		var all, handlers, namespaces, namespace_re, events,
			namespace_sort = [],
			args = jQuery.makeArray( arguments );

		event = args[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		// Namespaced event handlers
		all = event.type.indexOf(".") < 0 && !event.exclusive;

		if ( !all ) {
			namespaces = event.type.split(".");
			event.type = namespaces.shift();
			namespace_sort = namespaces.slice(0).sort();
			namespace_re = new RegExp("(^|\\.)" + namespace_sort.join("\\.(?:.*\\.)?") + "(\\.|$)");
		}

		event.namespace = event.namespace || namespace_sort.join(".");

		events = jQuery._data(this, "events");

		handlers = (events || {})[ event.type ];

		if ( events && handlers ) {
			// Clone the handlers to prevent manipulation
			handlers = handlers.slice(0);

			for ( var j = 0, l = handlers.length; j < l; j++ ) {
				var handleObj = handlers[ j ];

				// Filter the functions by class
				if ( all || namespace_re.test( handleObj.namespace ) ) {
					// Pass in a reference to the handler function itself
					// So that we can later remove it
					event.handler = handleObj.handler;
					event.data = handleObj.data;
					event.handleObj = handleObj;

					var ret = handleObj.handler.apply( this, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}

					if ( event.isImmediatePropagationStopped() ) {
						break;
					}
				}
			}
		}

		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			// Fixes #1925 where srcElement might not be defined either
			event.target = event.srcElement || document;
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement,
				body = document.body;

			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
			event.which = event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this,
					liveConvert( handleObj.origType, handleObj.selector ),
					jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) );
			},

			remove: function( handleObj ) {
				jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
			}
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;

	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try {

		// Chrome does something similar, the parentNode property
		// can be accessed but is null.
		if ( parent !== document && !parent.parentNode ) {
			return;
		}
		// Traverse up the tree
		while ( parent && parent !== this ) {
			parent = parent.parentNode;
		}

		if ( parent !== this ) {
			// set the correct event type
			event.type = event.data;

			// handle event if we actually just moused on to a non sub-element
			jQuery.event.handle.apply( this, arguments );
		}

	// assuming we've left the element since we most likely mousedover a xul element
	} catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( this.nodeName && this.nodeName.toLowerCase() !== "form" ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						trigger( "submit", this, arguments );
					}
				});

				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( elem.nodeName.toLowerCase() === "select" ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery._data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery._data( elem, "_change_data", val );
		}

		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			e.liveFired = undefined;
			jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange,

			beforedeactivate: testChange,

			click: function( e ) {
				var elem = e.target, type = elem.type;

				if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
					testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = elem.type;

				if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery._data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return rformElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return rformElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;

	// Handle when the input is .focus()'d
	changeFilters.focus = changeFilters.beforeactivate;
}

function trigger( type, elem, args ) {
	// Piggyback on a donor event to simulate a different one.
	// Fake originalEvent to avoid donor's stopPropagation, but if the
	// simulated event prevents default then we do the same on the donor.
	// Don't pass args or remember liveFired; they apply to the donor event.
	var event = jQuery.extend( {}, args[ 0 ] );
	event.type = type;
	event.originalEvent = {};
	event.liveFired = undefined;
	jQuery.event.handle.call( elem, event );
	if ( event.isDefaultPrevented() ) {
		args[ 0 ].preventDefault();
	}
}

// Create "bubbling" focus and blur events
if ( document.addEventListener ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
		jQuery.event.special[ fix ] = {
			setup: function() {
				this.addEventListener( orig, handler, true );
			},
			teardown: function() {
				this.removeEventListener( orig, handler, true );
			}
		};

		function handler( e ) {
			e = jQuery.event.fix( e );
			e.type = fix;
			return jQuery.event.handle.call( this, e );
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}

		if ( jQuery.isFunction( data ) || data === false ) {
			fn = data;
			data = undefined;
		}

		var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
			jQuery( this ).unbind( event, handler );
			return fn.apply( this, arguments );
		}) : fn;

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},

	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
				return this.unbind( "live" );

		} else {
			return this.die( types, null, fn, selector );
		}
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			var event = jQuery.Event( type );
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			i = 1;

		// link all the functions, so any of them can unbind this click handler
		while ( i < args.length ) {
			jQuery.proxy( fn, args[ i++ ] );
		}

		return this.click( jQuery.proxy( fn, function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		}));
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );

		if ( typeof types === "object" && !types.preventDefault ) {
			for ( var key in types ) {
				context[ name ]( key, data, types[key], selector );
			}

			return this;
		}

		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( type === "focus" || type === "blur" ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				for ( var j = 0, l = context.length; j < l; j++ ) {
					jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				}

			} else {
				// unbind live handler
				context.unbind( "live." + liveConvert( type, selector ), fn );
			}
		}

		return this;
	};
});

function liveHandler( event ) {
	var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = [],
		selectors = [],
		events = jQuery._data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
	if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
		return;
	}

	if ( event.namespace ) {
		namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		close = match[i];

		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) && !close.elem.disabled ) {
				elem = close.elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					event.type = handleObj.preType;
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj, level: close.level });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];

		if ( maxLevel && match.level > maxLevel ) {
			break;
		}

		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		ret = match.handleObj.origHandler.apply( match.elem, arguments );

		if ( ret === false || event.isPropagationStopped() ) {
			maxLevel = match.level;

			if ( ret === false ) {
				stop = false;
			}
			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspace, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.bind( name, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});


/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return "text" === elem.getAttribute( 'type' );
		},
		radio: function( elem ) {
			return "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return "checkbox" === elem.type;
		},

		file: function( elem ) {
			return "file" === elem.type;
		},
		password: function( elem ) {
			return "password" === elem.type;
		},

		submit: function( elem ) {
			return "submit" === elem.type;
		},

		image: function( elem ) {
			return "image" === elem.type;
		},

		reset: function( elem ) {
			return "reset" === elem.type;
		},

		button: function( elem ) {
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					var first = match[2],
						last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// If the nodes are siblings (or identical) we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector,
		pseudoWorks = false;

	try {
		// This should fail with an exception
		// Gecko does not error, returns false instead
		matches.call( document.documentElement, "[test!='']:sizzle" );
	
	} catch( pseudoError ) {
		pseudoWorks = true;
	}

	if ( matches ) {
		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						return matches.call( node, expr );
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var ret = this.pushStack( "", "find", selector ),
			length = 0;

		for ( var i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( var n = length; n < ret.length; n++ ) {
					for ( var r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && jQuery.filter( selector, this ).length > 0;
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];

		if ( jQuery.isArray( selectors ) ) {
			var match, selector,
				matches = {},
				level = 1;

			if ( cur && selectors.length ) {
				for ( i = 0, l = selectors.length; i < l; i++ ) {
					selector = selectors[i];

					if ( !matches[selector] ) {
						matches[selector] = jQuery.expr.match.POS.test( selector ) ?
							jQuery( selector, context || this.context ) :
							selector;
					}
				}

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( selector in matches ) {
						match = matches[selector];

						if ( match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match) ) {
							ret.push({ selector: selector, elem: cur, level: level });
						}
					}

					cur = cur.parentNode;
					level++;
				}
			}

			return ret;
		}

		var pos = POS.test( selectors ) ?
			jQuery( selectors, context || this.context ) : null;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique(ret) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		if ( !elem || typeof elem === "string" ) {
			return jQuery.inArray( this[0],
				// If it receives a string, the selector is used
				// If it receives nothing, the siblings are used
				elem ? jQuery( elem ) : this.parent().children() );
		}
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until ),
			// The variable 'args' was introduced in
			// https://github.com/jquery/jquery/commit/52a0238
			// to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
			// http://code.google.com/p/v8/issues/detail?id=1050
			args = slice.call(arguments);

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, args.join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
}




var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<(?:script|object|embed|option|style)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnocache.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value );
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || (l > 1 && i < lastIndex) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var internalKey = jQuery.expando,
		oldData = jQuery.data( src ),
		curData = jQuery.data( dest, oldData );

	// Switch to use the internal data object, if it exists, for the next
	// stage of data copying
	if ( (oldData = oldData[ internalKey ]) ) {
		var events = oldData.events;
				curData = curData[ internalKey ] = jQuery.extend({}, oldData);

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( var type in events ) {
				for ( var i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
				}
			}
		}
	}
}

function cloneFixAttributes(src, dest) {
	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	var nodeName = dest.nodeName.toLowerCase();

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	dest.clearAttributes();

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	dest.mergeAttributes(src);

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults,
		doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		args[0].charAt(0) === "<" && !rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

		cacheable = true;
		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults ) {
			if ( cacheresults !== 1 ) {
				fragment = cacheresults;
			}
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = (i > 0 ? this.clone(true) : this).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( "getElementsByTagName" in elem ) {
		return elem.getElementsByTagName( "*" );
	
	} else if ( "querySelectorAll" in elem ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var clone = elem.cloneNode(true),
				srcElements,
				destElements,
				i;

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName
			// instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				cloneFixAttributes( srcElements[i], destElements[i] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		// Return the cloned set
		return clone;
},
	clean: function( elems, context, fragment, scripts ) {
		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [];

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" && !rhtml.test( elem ) ) {
				elem = context.createTextNode( elem );

			} else if ( typeof elem === "string" ) {
				// Fix "XHTML"-style tags in all browsers
				elem = elem.replace(rxhtmlTag, "<$1></$2>");

				// Trim whitespace, otherwise indexOf won't work as expected
				var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
					wrap = wrapMap[ tag ] || wrapMap._default,
					depth = wrap[0],
					div = context.createElement("div");

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + elem + wrap[2];

				// Move to the right depth
				while ( depth-- ) {
					div = div.lastChild;
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !jQuery.support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					var hasBody = rtbody.test(elem),
						tbody = tag === "table" && !hasBody ?
							div.firstChild && div.firstChild.childNodes :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !hasBody ?
								div.childNodes :
								[];

					for ( var j = tbody.length - 1; j >= 0 ; --j ) {
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
							tbody[ j ].parentNode.removeChild( tbody[ j ] );
						}
					}

				}

				// IE completely kills leading whitespace when innerHTML is used
				if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
				}

				elem = div.childNodes;
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id, cache = jQuery.cache, internalKey = jQuery.expando, special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ] && cache[ id ][ internalKey ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle,

	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"zIndex": true,
		"fontWeight": true,
		"opacity": true,
		"zoom": true,
		"lineHeight": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			// Make sure that NaN and null values aren't set. See: #7116
			if ( typeof value === "number" && isNaN( value ) || value == null ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( typeof value === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		// Make sure that we're working with the right name
		var ret, origName = jQuery.camelCase( name ),
			hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name, origName );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	},

	camelCase: function( string ) {
		return string.replace( rdashAlpha, fcamelCase );
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					val = getWH( elem, name, extra );

				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				if ( val <= 0 ) {
					val = curCSS( elem, name, name );

					if ( val === "0px" && currentStyle ) {
						val = currentStyle( elem, name, name );
					}

					if ( val != null ) {
						// Should return "auto" instead of 0, use 0 for
						// temporary backwards-compat
						return val === "" || val === "auto" ? "0px" : val;
					}
				}

				if ( val < 0 || val == null ) {
					val = elem.style[ name ];

					// Should return "auto" instead of 0, use 0 for
					// temporary backwards-compat
					return val === "" || val === "auto" ? "0px" : val;
				}

				return typeof val === "string" ? val : val + "px";
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat(value);

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ?
				(parseFloat(RegExp.$1) / 100) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style;

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// Set the alpha filter to set the opacity
			var opacity = jQuery.isNaN(value) ?
				"" :
				"alpha(opacity=" + value * 100 + ")",
				filter = style.filter || "";

			style.filter = ralpha.test(filter) ?
				filter.replace(ralpha, opacity) :
				style.filter + ' ' + opacity;
		}
	};
}

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, newName, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( !(defaultView = elem.ownerDocument.defaultView) ) {
			return undefined;
		}

		if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			rsLeft = elem.runtimeStyle && elem.runtimeStyle[ name ],
			style = elem.style;

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
			// Remember the original values
			left = style.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : (ret || 0);
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {
	var which = name === "width" ? cssWidth : cssHeight,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

	if ( extra === "border" ) {
		return val;
	}

	jQuery.each( which, function() {
		if ( !extra ) {
			val -= parseFloat(jQuery.css( elem, "padding" + this )) || 0;
		}

		if ( extra === "margin" ) {
			val += parseFloat(jQuery.css( elem, "margin" + this )) || 0;

		} else {
			val -= parseFloat(jQuery.css( elem, "border" + this + "Width" )) || 0;
		}
	});

	return val;
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /(?:^file|^widget|\-extension):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rucHeaders = /(^|\-)([a-z])/g,
	rucHeadersFunc = function( _, $1, $2 ) {
		return $1 + $2.toUpperCase();
	},
	rurl = /^([\w\+\.\-]+:)\/\/([^\/?#:]*)(?::(\d+))?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts;

// #8138, IE may throw an exception when accessing
// a field from document.location if document.domain has been set
try {
	ajaxLocation = document.location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() );

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for(; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

//Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for(; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.bind( o, f );
	};
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
} );

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function ( target, settings ) {
		if ( !settings ) {
			// Only one parameter, we extend ajaxSettings
			settings = target;
			target = jQuery.extend( true, jQuery.ajaxSettings, settings );
		} else {
			// target was provided, we extend into it
			jQuery.extend( true, target, jQuery.ajaxSettings, settings );
		}
		// Flatten fields we don't want deep extended
		for( var field in { context: 1, url: 1 } ) {
			if ( field in settings ) {
				target[ field ] = settings[ field ];
			} else if( field in jQuery.ajaxSettings ) {
				target[ field ] = jQuery.ajaxSettings[ field ];
			}
		}
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		crossDomain: null,
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": "*/*"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery._Deferred(),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						requestHeaders[ name.toLowerCase().replace( rucHeaders, rucHeadersFunc ) ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, statusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status ? 4 : 0;

			var isSuccess,
				success,
				error,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = statusText;

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.resolveWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.done;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( !s.crossDomain ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( (ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			requestHeaders[ "Content-Type" ] = s.contentType;
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				requestHeaders[ "If-Modified-Since" ] = jQuery.lastModified[ ifModifiedKey ];
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				requestHeaders[ "If-None-Match" ] = jQuery.etag[ ifModifiedKey ];
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		requestHeaders.Accept = s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
			s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", */*; q=0.01" : "" ) :
			s.accepts[ "*" ];

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( status < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					jQuery.error( e );
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) && obj.length ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// If we see an array here, it is empty and should be treated as an empty
		// object
		if ( jQuery.isArray( obj ) || jQuery.isEmptyObject( obj ) ) {
			add( prefix, "" );

		// Serialize object item.
		} else {
			for ( var name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for( key in s.converters ) {
				if( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|()\?\?()/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var dataIsString = ( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		originalSettings.jsonpCallback ||
		originalSettings.jsonp != null ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				dataIsString && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2",
			cleanUp = function() {
				// Set callback back to previous value
				window[ jsonpCallback ] = previous;
				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( previous ) ) {
					window[ jsonpCallback ]( responseContainer[ 0 ] );
				}
			};

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( dataIsString ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Install cleanUp function
		jqXHR.then( cleanUp, cleanUp );

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
} );




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
} );




var // #5280: next active xhr id and list of active xhrs' callbacks
	xhrId = jQuery.now(),
	xhrCallbacks,

	// XHR used to determine supports properties
	testXHR;

// #5280: Internet Explorer will keep connections alive if we don't abort on unload
function xhrOnUnloadAbort() {
	jQuery( window ).unload(function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	});
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Test if we can create an xhr object
testXHR = jQuery.ajaxSettings.xhr();
jQuery.support.ajax = !!testXHR;

// Does this browser support crossDomain XHR requests
jQuery.support.cors = testXHR && ( "withCredentials" in testXHR );

// No need for the temporary xhr anymore
testXHR = undefined;

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// Requested-With header
					// Not set for crossDomain requests with no content
					// (see why at http://trac.dojotoolkit.org/ticket/9486)
					// Won't change header if already provided
					if ( !( s.crossDomain && !s.hasContent ) && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									delete xhrCallbacks[ handle ];
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						// Create the active xhrs callbacks list if needed
						// and attach the unload handler
						if ( !xhrCallbacks ) {
							xhrCallbacks = {};
							xhrOnUnloadAbort();
						}
						// Add to list of active xhrs callbacks
						handle = xhrId++;
						xhr.onreadystatechange = xhrCallbacks[ handle ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	];

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[i];
				display = elem.style.display;

				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
					display = elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( display === "" && jQuery.css( elem, "display" ) === "none" ) {
					jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[i];
				display = elem.style.display;

				if ( display === "" || display === "none" ) {
					elem.style.display = jQuery._data(elem, "olddisplay") || "";
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				var display = jQuery.css( this[i], "display" );

				if ( display !== "none" && !jQuery._data( this[i], "olddisplay" ) ) {
					jQuery._data( this[i], "olddisplay", display );
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				this[i].style.display = "none";
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete );
		}

		return this[ optall.queue === false ? "each" : "queue" ](function() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			var opt = jQuery.extend({}, optall), p,
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				self = this;

			for ( p in prop ) {
				var name = jQuery.camelCase( p );

				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
					p = name;
				}

				if ( prop[p] === "hide" && hidden || prop[p] === "show" && !hidden ) {
					return opt.complete.call(this);
				}

				if ( isElement && ( p === "height" || p === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height
					// animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {
						if ( !jQuery.support.inlineBlockNeedsLayout ) {
							this.style.display = "inline-block";

						} else {
							var display = defaultDisplay(this.nodeName);

							// inline-level elements accept inline-block;
							// block-level elements need to be inline with layout
							if ( display === "inline" ) {
								this.style.display = "inline-block";

							} else {
								this.style.display = "inline";
								this.style.zoom = 1;
							}
						}
					}
				}

				if ( jQuery.isArray( prop[p] ) ) {
					// Create (if needed) and add to specialEasing
					(opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
					prop[p] = prop[p][0];
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function( name, val ) {
				var e = new jQuery.fx( self, opt, name );

				if ( rfxtypes.test(val) ) {
					e[ val === "toggle" ? hidden ? "show" : "hide" : val ]( prop );

				} else {
					var parts = rfxnum.exec(val),
						start = e.cur();

					if ( parts ) {
						var end = parseFloat( parts[2] ),
							unit = parts[3] || ( jQuery.cssNumber[ name ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( self, name, (end || 1) + unit);
							start = ((end || 1) / e.cur()) * start;
							jQuery.style( self, name, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			});

			// For JS strict compliance
			return true;
		});
	},

	stop: function( clearQueue, gotoEnd ) {
		var timers = jQuery.timers;

		if ( clearQueue ) {
			this.queue([]);
		}

		this.each(function() {
			// go in reverse order so anything added to the queue during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- ) {
				if ( timers[i].elem === this ) {
					if (gotoEnd) {
						// force the next step to be the last
						timers[i](true);
					}

					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if ( !gotoEnd ) {
			this.dequeue();
		}

		return this;
	}

});

function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function() {
			if ( opt.queue !== false ) {
				jQuery(this).dequeue();
			}
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig ) {
			options.orig = {};
		}
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = jQuery.now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );
		this.now = this.start;
		this.pos = this.state = 0;

		function t( gotoEnd ) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval(fx.tick, fx.interval);
		}
	},

	// Simple 'show' function
	show: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var t = jQuery.now(), done = true;

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			for ( var i in this.options.curAnim ) {
				if ( this.options.curAnim[i] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( this.options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {
					var elem = this.elem,
						options = this.options;

					jQuery.each( [ "", "X", "Y" ], function (index, value) {
						elem.style[ "overflow" + value ] = options.overflow[index];
					} );
				}

				// Hide the element if the "hide" operation was done
				if ( this.options.hide ) {
					jQuery(this.elem).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( this.options.hide || this.options.show ) {
					for ( var p in this.options.curAnim ) {
						jQuery.style( this.elem, p, this.options.orig[p] );
					}
				}

				// Execute the complete function
				this.options.complete.call( this.elem );
			}

			return false;

		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			var specialEasing = this.options.specialEasing && this.options.specialEasing[this.prop];
			var defaultEasing = this.options.easing || (jQuery.easing.swing ? "swing" : "linear");
			this.pos = jQuery.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timers = jQuery.timers;

		for ( var i = 0; i < timers.length; i++ ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

function defaultDisplay( nodeName ) {
	if ( !elemdisplay[ nodeName ] ) {
		var elem = jQuery("<" + nodeName + ">").appendTo("body"),
			display = elem.css("display");

		elem.remove();

		if ( display === "none" || display === "" ) {
			display = "block";
		}

		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = (win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop ),
			scrollLeft = (win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft),
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.css(body, "marginTop") ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed";
		checkDiv.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden";
		innerDiv.style.position = "relative";

		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		body = container = innerDiv = checkDiv = table = td = null;
		jQuery.offset.initialize = jQuery.noop;
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = (position === "absolute" && jQuery.inArray('auto', [curCSSTop, curCSSLeft]) > -1),
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is absolute
		if ( calculatePosition ) {
			curPosition = curElem.position();
		}

		curTop  = calculatePosition ? curPosition.top  : parseInt( curCSSTop,  10 ) || 0;
		curLeft = calculatePosition ? curPosition.left : parseInt( curCSSLeft, 10 ) || 0;

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if (options.top != null) {
			props.top = (options.top - curOffset.top) + curTop;
		}
		if (options.left != null) {
			props.left = (options.left - curOffset.left) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function(val) {
		var elem = this[0], win;

		if ( !elem ) {
			return null;
		}

		if ( val !== undefined ) {
			// Set the scroll offset
			return this.each(function() {
				win = getWindow( this );

				if ( win ) {
					win.scrollTo(
						!i ? val : jQuery(win).scrollLeft(),
						i ? val : jQuery(win).scrollTop()
					);

				} else {
					this[ method ] = val;
				}
			});
		} else {
			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function() {
		return this[0] ?
			parseFloat( jQuery.css( this[0], type, "padding" ) ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function( margin ) {
		return this[0] ?
			parseFloat( jQuery.css( this[0], type, margin ? "margin" : "border" ) ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ];
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				elem.document.body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNaN( ret ) ? orig : ret;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});


//window.jQuery = window.$ = jQuery;
return jQuery;
})(window);

})
, {"filename":"../webapp/scripts/jquery/jquery.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/harViewer.js","mtime":1421119686,"wrapper":"amd","format":"amd","id":"b89a1ab93a03eeb31412b4efe36b98e48e3e40d2-scripts/harViewer.js"}
require.memoize("b89a1ab93a03eeb31412b4efe36b98e48e3e40d2-scripts/harViewer.js", 
/* See license.txt for terms of usage */

require.def("harViewer", [
    "jquery/jquery",
    "domplate/tabView",
    "tabs/homeTab",
    "tabs/aboutTab",
    "tabs/previewTab",
    "tabs/schemaTab",
    "tabs/embedTab",
    "tabs/domTab",
    "preview/harModel",
    "i18n!nls/harViewer",
    "preview/requestList",
    "css/loader",
    "core/lib",
    "core/trace",
    "require"
],

function($, TabView, HomeTab, AboutTab, PreviewTab, SchemaTab, EmbedTab, DomTab, HarModel,
    Strings, RequestList, CssLoader, Lib, Trace, require) {

// ********************************************************************************************* //
// The Application

function HarView()
{
    this.id = "harView";

    // Location of the model (all tabs see its parent and so the model).
    this.model = new HarModel();

    // Append tabs
    this.appendTab(new HomeTab());
    this.appendTab(new PreviewTab(this.model));
    this.appendTab(new DomTab());
    this.appendTab(new AboutTab());
    this.appendTab(new SchemaTab());
    this.appendTab(new EmbedTab());
}

/**
 * This is the Application UI configuration code. The Viewer UI is based on a Tabbed UI
 * interface and is composed from following tabs:
 * 
 * {@link HomeTab}: This is the starting application tab. This tab allows direct inserting of
 *      a HAR log source to preview. There are also some useful links to existing example logs.
 *      This page is displyed by default unless there is a HAR file specified in the URL.
 *      In such case the file is automatically loaded and {@link PreviewTab} selected.
 *
 * {@link PreviewTab}: This tab is used to preview one or more HAR files. The UI is composed
 *      from an expandable list of pages and requests. There is also a graphical timeline
 *      that shows request timings.
 *
 * {@link DomTab}: This tab shows hierarchical structure of the provided HAR file(s) as
 *      an expandable tree.
 *
 * {@link AboutTab}: Shows some basic information about the HAR Viewer and links to other
 *      resources.
 *
 * {@link SchemaTab}: Shows HAR log schema definition, based on JSON Schema.
 */
HarView.prototype = Lib.extend(new TabView(),
/** @lends HarView */
{
    initialize: function(content)
    {
        // Global application properties.
        this.version = content.getAttribute("version") || "";
        this.harSpecURL = "http://www.softwareishard.com/blog/har-12-spec/";

        this.render(content);
        this.selectTabByName("Home");

        // Auto load all HAR files specified in the URL.
        var okCallback = Lib.bind(this.appendPreview, this);
        var errorCallback = Lib.bind(this.onLoadError, this);

        if (HarModel.Loader.run(okCallback, errorCallback))
        {
            var homeTab = this.getTab("Home");
            if (homeTab)
                homeTab.loadInProgress(true);
        }
    },

    appendPreview: function(jsonString)
    {
        var homeTab = this.getTab("Home");
        var previewTab = this.getTab("Preview");
        var domTab = this.getTab("DOM");

        try
        {
            var validate = $("#validate").attr("checked");
            var input = HarModel.parse(jsonString, validate);
            this.model.append(input);

            if (previewTab)
            {
                // xxxHonza: this should be smarter.
                // Make sure the tab is rendered now.
                try
                {
                    previewTab.select();
                    previewTab.append(input);
                }
                catch (err)
                {
                    Trace.exception("HarView.appendPreview; EXCEPTION ", err);
                    if (err.errors && previewTab)
                        previewTab.appendError(err);
                }
            }

            // The input JSON is displayed in the DOM/HAR tab anyway, at least to
            // allow easy inspection of the content.
            // Btw. this makes HAR Viewer an effective JSON Viewer, but only if validation
            // is switched off, otherwise HarModel.parse() throws an exception.
            if (domTab)
                domTab.append(input);
        }
        catch (err)
        {
            Trace.exception("HarView.appendPreview; EXCEPTION ", err);
            if (err.errors && previewTab)
                previewTab.appendError(err);

            // xxxHonza: display JSON tree even if validation throws an exception
            if (err.input)
                domTab.append(err.input);
        }

        // Select the preview tab in any case.
        previewTab.select();

        // HAR loaded, parsed and appended into the UI, let's shut down the progress.
        if (homeTab)
            homeTab.loadInProgress(false);

        Lib.fireEvent(content, "onViewerHARLoaded");
    },

    onLoadError: function(response, ioArgs)
    {
        var homeTab = this.getTab("Home");
        if (homeTab)
            homeTab.loadInProgress(true, response.statusText);

        Trace.error("harModule.loadRemoteArchive; ERROR ", response, ioArgs);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Loading HAR files

    /**
     * Load HAR file
     * @param {String} url URL of the target log file
     * @param {Object} settings A set of key/value pairs taht configure the request.
     *      All settings are optional.
     *      settings.jsonp {Boolean} If you wish to force a crossDomain request using JSONP,
     *          set the value to true. You need to use HARP syntax for the target file.
     *          Default is false.
     *      settings.jsonpCallback {String} Override the callback function name used in HARP.
     *          Default is "onInputData".
     *      settings.success {Function} A function to be called when the file is successfully
     *          loaded. The HAR object is passed as an argument.
     *      settings.ajaxError {Function} A function to be called if the AJAX request fails.
     *          An error object is pased as an argument.
     */
    loadHar: function(url, settings)
    {
        settings = settings || {};
        return HarModel.Loader.load(this, url,
            settings.jsonp,
            settings.jsonpCallback,
            settings.success,
            settings.ajaxError);
    },

    /**
     * Use to customize list of request columns displayed by default.
     * 
     * @param {String} cols Column names separated by a space.
     * @param {Boolean} avoidCookies Set to true if you don't want to touch cookies.
     */
    setPreviewColumns: function(cols, avoidCookies)
    {
        RequestList.setVisibleColumns(cols, avoidCookies);
    }
});

// ********************************************************************************************* //
// Initialization

var api = {
    init: function (domNode) {

        var content = domNode;
        var harView = content.repObject = new HarView();

        CssLoader.initialize();

        // Fire some events for listeners. This is useful for extending/customizing the viewer.
        Lib.fireEvent(content, "onViewerPreInit");
        harView.initialize(content);
        Lib.fireEvent(content, "onViewerInit");

        Trace.log("HarViewer; initialized OK");
    }
};

if (window.harviewerInitOnLoad) {
    api.init(document.getElementById("content"));
}

return api;

// ********************************************************************************************* //
})
, {"filename":"../webapp/scripts/harViewer.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/domplate/tabView.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/tabView.js"}
require.memoize("bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/tabView.js", 
/* See license.txt for terms of usage */

require.def("domplate/tabView", [
    "domplate/domplate",
    "core/lib",
    "core/trace"
],

function(Domplate, Lib, Trace) { with (Domplate) {

//*************************************************************************************************

/**
 * @domplate TabViewTempl is a template used by {@link TabView} widget.
 */
var TabViewTempl = domplate(
/** @lends TabViewTempl */
{
    tag:
        TABLE({"class": "tabView", cellpadding: 0, cellspacing: 0,
            _repObject: "$tabView"},
            TBODY(
                TR({"class": "tabViewRow"},
                    TD({"class": "tabViewCol", valign: "top"},
                        TAG("$tabList", {tabView: "$tabView"})
                    )
                )
            )
        ),

    tabList:
        DIV({"class": "tabViewBody", onclick: "$onClickTab"},
            DIV({"class": "$tabView.id\\Bar tabBar"}),
            DIV({"class": "$tabView.id\\Bodies tabBodies"})
        ),

    tabHeaderTag:
        A({"class": "$tab.id\\Tab tab",
            view: "$tab.id", _repObject: "$tab"},
            "$tab.label"
        ),

    tabBodyTag:
        DIV({"class": "tab$tab.id\\Body tabBody", _repObject: "$tab"}),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Event Handlers

    hideTab: function(context)
    {
        return false;
    },

    onClickTab: function(event)
    {
        var e = Lib.fixEvent(event);
        var tabView = this.getTabView(e.target);
        tabView.onClickTab(e);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Coupling with TabView instance.

    getTabView: function(node)
    {
        var tabView = Lib.getAncestorByClass(node, "tabView");
        return tabView.repObject;
    }
});

//*************************************************************************************************

function TabView(id)
{
    this.id = id;
    this.tabs = [];
    this.listeners = [];
    this.tabBarVisibility = true;
}

/**
 * @widget TabView represents a widget for tabbed UI interface.
 */
TabView.prototype =
/** @lends TabView */
{
    appendTab: function(tab)
    {
        this.tabs.push(tab);
        tab.tabView = this;
        return tab;
    },

    removeTab: function(tabId)
    {
        for (var i in this.tabs)
        {
            var tab = this.tabs[i];
            if (tab.id == tabId)
            {
                this.tabs.splice(i, 1);
                break;
            }
        }
    },

    getTab: function(tabId)
    {
        for (var i in this.tabs)
        {
            var tab = this.tabs[i];
            if (tab.id == tabId)
                return tab;
        }
    },

    selectTabByName: function(tabId)
    {
        var tab = Lib.getElementByClass(this.element, tabId + "Tab");
        if (tab)
            this.selectTab(tab);
    },

    showTabBar: function(show)
    {
        if (this.element)
        {
            if (show)
                this.element.removeAttribute("hideTabBar");
            else
                this.element.setAttribute("hideTabBar", "true");
        }
        else
        {
            this.tabBarVisibility = show;
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Listeners

    addListener: function(listener)
    {
        this.listeners.push(listener);
    },

    removeListener: function(listener)
    {
        Lib.remove(this.listeners, listener);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    // xxxHonza: this should be private.
    onClickTab: function(e)
    {
        var tab = Lib.getAncestorByClass(e.target, "tab");
        if (tab)
            this.selectTab(tab);
    },

    selectTab: function(tab)
    {
        if (!Lib.hasClass(tab, "tab"))
            return;

        if (Lib.hasClass(tab, "selected") && tab._updated)
            return;

        var view = tab.getAttribute("view");

        // xxxHonza: this is null if the user clicks on an example on the home page.
        if (!view)
            return;

        var viewBody = Lib.getAncestorByClass(tab, "tabViewBody");

        // Deactivate current tab.
        if (viewBody.selectedTab)
        {
            viewBody.selectedTab.removeAttribute("selected");
            viewBody.selectedBody.removeAttribute("selected");

            // IE workaround. Removing the "selected" attribute
            // doesn't update the style (associated using attribute selector).
            // So use a class name instead.
            Lib.removeClass(viewBody.selectedTab, "selected");
            Lib.removeClass(viewBody.selectedBody, "selected");
        }

        // Store info about new active tab. Each tab has to have a body, 
        // which is identified by class.
        var tabBody = Lib.getElementByClass(viewBody, "tab" + view + "Body");
        if (!tabBody)
            Trace.error("TabView.selectTab; Missing tab body", tab);

        viewBody.selectedTab = tab;
        viewBody.selectedBody = tabBody;

        // Activate new tab.
        viewBody.selectedTab.setAttribute("selected", "true");
        viewBody.selectedBody.setAttribute("selected", "true");

        // IE workaround. Adding the "selected" attribute doesn't
        // update the style. Use class name instead.
        Lib.setClass(viewBody.selectedBody, "selected");
        Lib.setClass(viewBody.selectedTab, "selected");

        this.updateTabBody(viewBody, view);
    },

    // xxxHonza: should be private
    updateTabBody: function(viewBody, view)
    {
        var tab = viewBody.selectedTab.repObject;
        if (tab._body._updated)
            return;

        tab._body._updated = true;

        // Render default content if available.
        if (tab.bodyTag)
            tab.bodyTag.replace({tab: tab}, tab._body);

        // Call also onUpdateBody for dynamic body update.
        if (tab && tab.onUpdateBody)
            tab.onUpdateBody(this, tab._body);

        // Dispatch to all listeners.
        for (var i=0; i<this.listeners.length; i++)
        {
            var listener = this.listeners[i];
            if (listener.onUpdateBody)
                listener.onUpdateBody(this, tab._body);
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    render: function(parentNode)
    {
        this.element = TabViewTempl.tag.replace({tabView: this}, parentNode, TabViewTempl);
        Lib.setClass(this.element, this.id);

        this.showTabBar(this.tabBarVisibility);

        for (var i in this.tabs)
        {
            var tab = this.tabs[i];
            var tabHeaderTag = tab.tabHeaderTag ? tab.tabHeaderTag : TabViewTempl.tabHeaderTag;
            var tabBodyTag = tab.tabBodyTag ? tab.tabBodyTag : TabViewTempl.tabBodyTag;

            try
            {
                tab._header = tabHeaderTag.append({tab:tab}, Lib.$(parentNode, "tabBar"));
                tab._body = tabBodyTag.append({tab:tab}, Lib.$(parentNode, "tabBodies"));
            }
            catch (e)
            {
                Trace.exception("TabView.appendTab; Exception ", e);
            }
        }

        return this.element;
    }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

TabView.Tab = function() {}
TabView.Tab.prototype =
{
    invalidate: function()
    {
        this._updated = false;
    },

    select: function()
    {
        this.tabView.selectTabByName(this.id);
    }
}

return TabView;

// ************************************************************************************************
}})
, {"filename":"../webapp/scripts/domplate/tabView.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/domplate/domplate.js","mtime":1420522185,"wrapper":"amd","format":"amd","id":"bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/domplate.js"}
require.memoize("bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/domplate.js", 
/* See license.txt for terms of usage */

require.def("domplate/domplate", [
    "jquery/jquery"
], function($) {

//*************************************************************************************************

Domplate = {};

(function(){

function DomplateTag(tagName)
{
    this.tagName = tagName;
}

this.DomplateTag = DomplateTag;

function DomplateEmbed()
{
}

function DomplateLoop()
{
}

var womb = null;

var domplate = function()
{
    var lastSubject;
    for (var i = 0; i < arguments.length; ++i)
        lastSubject = lastSubject ? copyObject(lastSubject, arguments[i]) : arguments[i];

    for (var name in lastSubject)
    {
        var val = lastSubject[name];
        if (isTag(val))
        {
            if (val.tag.subject)
            {
                lastSubject[name] = val = copyObject({}, val);
                val.tag = copyObject({}, val.tag);
            }
            val.tag.subject = lastSubject;
        }
    }

    return lastSubject;
};

domplate.context = function(context, fn)
{
    var lastContext = domplate.lastContext;
    domplate.topContext = context;
    fn.apply(context);
    domplate.topContext = lastContext;
};

this.domplate = domplate;
this.create = domplate;


this.TAG = function()
{
    var embed = new DomplateEmbed();
    return embed.merge(arguments);
};

this.FOR = function()
{
    var loop = new DomplateLoop();
    return loop.merge(arguments);
};

DomplateTag.prototype =
{
    merge: function(args, oldTag)
    {
        if (oldTag)
            this.tagName = oldTag.tagName;

        this.context = oldTag ? oldTag.context : null;
        this.subject = oldTag ? oldTag.subject : null;
        this.attrs = oldTag ? copyObject(oldTag.attrs) : {};
        this.classes = oldTag ? copyObject(oldTag.classes) : {};
        this.props = oldTag ? copyObject(oldTag.props) : null;
        this.listeners = oldTag ? copyArray(oldTag.listeners) : null;
        this.children = oldTag ? copyArray(oldTag.children) : [];
        this.vars = oldTag ? copyArray(oldTag.vars) : [];

        var attrs = args.length ? args[0] : null;
        var hasAttrs = typeof(attrs) == "object" && !isTag(attrs);

        this.children = [];

        if (domplate.topContext)
            this.context = domplate.topContext;

        if (args.length)
            parseChildren(args, hasAttrs ? 1 : 0, this.vars, this.children);

        if (hasAttrs)
            this.parseAttrs(attrs);

        return creator(this, DomplateTag);
    },

    parseAttrs: function(args)
    {
        for (var name in args)
        {
            var val = parseValue(args[name]);
            readPartNames(val, this.vars);

            if (name.indexOf("on") == 0)
            {
                var eventName = $.browser.msie ? name : name.substr(2);
                if (!this.listeners)
                    this.listeners = [];
                this.listeners.push(eventName, val);
            }
            else if (name.indexOf("_") == 0)
            {
                var propName = name.substr(1);
                if (!this.props)
                    this.props = {};
                this.props[propName] = val;
            }
            else if (name.indexOf("$") == 0)
            {
                var className = name.substr(1);
                if (!this.classes)
                    this.classes = {};
                this.classes[className] = val;
            }
            else
            {
                if (name == "class" && name in this.attrs)
                    this.attrs[name] += " " + val;
                else
                    this.attrs[name] = val;
            }
        }
    },

    compile: function()
    {
        if (this.renderMarkup)
            return;

        this.compileMarkup();
        this.compileDOM();

        //ddd(this.renderMarkup);
        //ddd(this.renderDOM);
        //ddd(this.domArgs);
    },

    compileMarkup: function()
    {
        this.markupArgs = [];
        var topBlock = [], topOuts = [], blocks = [], info = {args: this.markupArgs, argIndex: 0};
        //this.addLocals(blocks);
        this.generateMarkup(topBlock, topOuts, blocks, info);
        this.addCode(topBlock, topOuts, blocks);

        var fnBlock = ['(function (__code__, __context__, __in__, __out__'];
        for (var i = 0; i < info.argIndex; ++i)
            fnBlock.push(', s', i);
        fnBlock.push(') {\n');

        if (this.subject)
            fnBlock.push('with (this) {\n');
        if (this.context)
            fnBlock.push('with (__context__) {\n');
        fnBlock.push('with (__in__) {\n');

        fnBlock.push.apply(fnBlock, blocks);

        if (this.subject)
            fnBlock.push('}\n');
        if (this.context)
            fnBlock.push('}\n');

        fnBlock.push('}})\n');

        function __link__(tag, code, outputs, args)
        {
            tag.tag.compile();

            var tagOutputs = [];
            var markupArgs = [code, tag.tag.context, args, tagOutputs];
            markupArgs.push.apply(markupArgs, tag.tag.markupArgs);
            tag.tag.renderMarkup.apply(tag.tag.subject, markupArgs);

            outputs.push(tag);
            outputs.push(tagOutputs);
        }

        function __escape__(value)
        {
            function replaceChars(ch)
            {
                switch (ch)
                {
                    case "<":
                        return "&lt;";
                    case ">":
                        return "&gt;";
                    case "&":
                        return "&amp;";
                    case "'":
                        return "&#39;";
                    case '"':
                        return "&quot;";
                }
                return "?";
            };
            return String(value).replace(/[<>&"']/g, replaceChars);
        }

        function __loop__(iter, outputs, fn)
        {
            var iterOuts = [];
            outputs.push(iterOuts);

            if (iter instanceof Array)
                iter = new ArrayIterator(iter);

            try
            {
                while (1)
                {
                    var value = iter.next();
                    var itemOuts = [0,0];
                    iterOuts.push(itemOuts);
                    fn.apply(this, [value, itemOuts]);
                }
            }
            catch (exc)
            {
                if (exc != StopIteration)
                    throw exc;
            }
        }

        var js = $.browser.msie ? 'var f = ' + fnBlock.join("") + ';f' : fnBlock.join("");
        this.renderMarkup = eval(js);
    },

    getVarNames: function(args)
    {
        if (this.vars)
            args.push.apply(args, this.vars);

        for (var i = 0; i < this.children.length; ++i)
        {
            var child = this.children[i];
            if (isTag(child))
                child.tag.getVarNames(args);
            else if (child instanceof Parts)
            {
                for (var i = 0; i < child.parts.length; ++i)
                {
                    if (child.parts[i] instanceof Variable)
                    {
                        var name = child.parts[i].name;
                        var names = name.split(".");
                        args.push(names[0]);
                    }
                }
            }
        }
    },

    generateMarkup: function(topBlock, topOuts, blocks, info)
    {
        topBlock.push(',"<', this.tagName, '"');

        for (var name in this.attrs)
        {
            if (name != "class")
            {
                var val = this.attrs[name];
                topBlock.push(', " ', name, '=\\""');
                addParts(val, ',', topBlock, info, true);
                topBlock.push(', "\\""');
            }
        }

        if (this.listeners)
        {
            for (var i = 0; i < this.listeners.length; i += 2)
                readPartNames(this.listeners[i+1], topOuts);
        }

        if (this.props)
        {
            for (var name in this.props)
                readPartNames(this.props[name], topOuts);
        }

        if ("class" in this.attrs || this.classes)
        {
            topBlock.push(', " class=\\""');
            if ("class" in this.attrs)
                addParts(this.attrs["class"], ',', topBlock, info, true);
              topBlock.push(', " "');
            for (var name in this.classes)
            {
                topBlock.push(', (');
                addParts(this.classes[name], '', topBlock, info);
                topBlock.push(' ? "', name, '" + " " : "")');
            }
            topBlock.push(', "\\""');
        }
        topBlock.push(',">"');

        this.generateChildMarkup(topBlock, topOuts, blocks, info);
        topBlock.push(',"</', this.tagName, '>"');
    },

    generateChildMarkup: function(topBlock, topOuts, blocks, info)
    {
        for (var i = 0; i < this.children.length; ++i)
        {
            var child = this.children[i];
            if (isTag(child))
                child.tag.generateMarkup(topBlock, topOuts, blocks, info);
            else
                addParts(child, ',', topBlock, info, true);
        }
    },

    addCode: function(topBlock, topOuts, blocks)
    {
        if (topBlock.length)
            blocks.push('__code__.push(""', topBlock.join(""), ');\n');
        if (topOuts.length)
            blocks.push('__out__.push(', topOuts.join(","), ');\n');
        topBlock.splice(0, topBlock.length);
        topOuts.splice(0, topOuts.length);
    },

    addLocals: function(blocks)
    {
        var varNames = [];
        this.getVarNames(varNames);

        var map = {};
        for (var i = 0; i < varNames.length; ++i)
        {
            var name = varNames[i];
            if ( map.hasOwnProperty(name) )
                continue;

            map[name] = 1;
            var names = name.split(".");
            blocks.push('var ', names[0] + ' = ' + '__in__.' + names[0] + ';\n');
        }
    },

    compileDOM: function()
    {
        var path = [];
        var blocks = [];
        this.domArgs = [];
        path.embedIndex = 0;
        path.loopIndex = 0;
        path.staticIndex = 0;
        path.renderIndex = 0;
        var nodeCount = this.generateDOM(path, blocks, this.domArgs);

        var fnBlock = ['(function (root, context, o'];

        for (var i = 0; i < path.staticIndex; ++i)
            fnBlock.push(', ', 's'+i);

        for (var i = 0; i < path.renderIndex; ++i)
            fnBlock.push(', ', 'd'+i);

        fnBlock.push(') {\n');
        for (var i = 0; i < path.loopIndex; ++i)
            fnBlock.push('var l', i, ' = 0;\n');
        for (var i = 0; i < path.embedIndex; ++i)
            fnBlock.push('var e', i, ' = 0;\n');

        if (this.subject)
            fnBlock.push('with (this) {\n');
        if (this.context)
            fnBlock.push('with (context) {\n');

        fnBlock.push(blocks.join(""));

        if (this.subject)
            fnBlock.push('}\n');
        if (this.context)
            fnBlock.push('}\n');

        fnBlock.push('return ', nodeCount, ';\n');
        fnBlock.push('})\n');

        function __prop__(object, prop, value)
        {
            object[prop] = value;
        }

        function __bind__(object, fn)
        {
            return function(event) { return fn.apply(object, [event]); }
        }

        function __link__(node, tag, args)
        {
            tag.tag.compile();

            var domArgs = [node, tag.tag.context, 0];
            domArgs.push.apply(domArgs, tag.tag.domArgs);
            domArgs.push.apply(domArgs, args);

            return tag.tag.renderDOM.apply(tag.tag.subject, domArgs);
        }

        var self = this;
        function __loop__(iter, fn)
        {
            var nodeCount = 0;
            for (var i = 0; i < iter.length; ++i)
            {
                iter[i][0] = i;
                iter[i][1] = nodeCount;
                nodeCount += fn.apply(this, iter[i]);
                //ddd("nodeCount", nodeCount);
            }
            return nodeCount;
        }

        function __path__(parent, offset)
        {
            //ddd("offset", arguments[2])
            var root = parent;

            for (var i = 2; i < arguments.length; ++i)
            {
                var index = arguments[i];
                if (i == 3)
                    index += offset;

                if (index == -1)
                    parent = parent.parentNode;
                else
                    parent = parent.childNodes[index];
            }

            //ddd(arguments[2], root, parent);
            return parent;
        }

        var js = $.browser.msie ? 'var f = ' + fnBlock.join("") + ';f' : fnBlock.join("");
        //ddd(js.replace(/(\;|\{)/g, "$1\n"));
        this.renderDOM = eval(js);
    },

    generateDOM: function(path, blocks, args)
    {
        if (this.listeners || this.props)
            this.generateNodePath(path, blocks);

        if (this.listeners)
        {
            for (var i = 0; i < this.listeners.length; i += 2)
            {
                var val = this.listeners[i+1];
                var arg = generateArg(val, path, args);
                if ($.browser.msie)
                    blocks.push('node.attachEvent("', this.listeners[i], '", __bind__(this, ', arg, '));\n');
                else
                    blocks.push('node.addEventListener("', this.listeners[i], '", __bind__(this, ', arg, '), false);\n');
            }
        }

        if (this.props)
        {
            for (var name in this.props)
            {
                var val = this.props[name];
                var arg = generateArg(val, path, args);
                blocks.push("__prop__(node, '" + name + "', " + arg + ");\n");
                //blocks.push('node.', name, ' = ', arg, ';');
            }
        }

        this.generateChildDOM(path, blocks, args);
        return 1;
    },

    generateNodePath: function(path, blocks)
    {
        blocks.push("var node = __path__(root, o");
        for (var i = 0; i < path.length; ++i)
            blocks.push(",", path[i]);
        blocks.push(");\n");
        //blocks.push("try {ddd(l0,l1,l2); } catch (exc) {}");
    },

    generateChildDOM: function(path, blocks, args)
    {
        path.push(0);
        for (var i = 0; i < this.children.length; ++i)
        {
            var child = this.children[i];
            if (isTag(child))
                path[path.length-1] += '+' + child.tag.generateDOM(path, blocks, args);
            else
                path[path.length-1] += '+1';
        }
        path.pop();
    }
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

DomplateEmbed.prototype = copyObject(DomplateTag.prototype,
{
    merge: function(args, oldTag)
    {
        this.value = oldTag ? oldTag.value : parseValue(args[0]);
        this.attrs = oldTag ? oldTag.attrs : {};
        this.vars = oldTag ? copyArray(oldTag.vars) : [];

        var attrs = args[1];
        for (var name in attrs)
        {
            var val = parseValue(attrs[name]);
            this.attrs[name] = val;
            readPartNames(val, this.vars);
        }

        return creator(this, DomplateEmbed);
    },

    getVarNames: function(names)
    {
        if (this.value instanceof Parts)
            names.push(this.value.parts[0].name);

        if (this.vars)
            names.push.apply(names, this.vars);
    },

    generateMarkup: function(topBlock, topOuts, blocks, info)
    {
        this.addCode(topBlock, topOuts, blocks);

        blocks.push('__link__(');
        addParts(this.value, '', blocks, info);
        blocks.push(', __code__, __out__, {\n');

        var lastName = null;
        for (var name in this.attrs)
        {
            if (lastName)
                blocks.push(',');
            lastName = name;

            var val = this.attrs[name];
            blocks.push('"', name, '":');
            addParts(val, '', blocks, info);
        }

        blocks.push('});\n');
        //this.generateChildMarkup(topBlock, topOuts, blocks, info);
    },

    generateDOM: function(path, blocks, args)
    {
        var embedName = 'e'+path.embedIndex++;

        this.generateNodePath(path, blocks);

        var valueName = 'd' + path.renderIndex++;
        var argsName = 'd' + path.renderIndex++;
        blocks.push(embedName + ' = __link__(node, ', valueName, ', ', argsName, ');\n');

        return embedName;
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

DomplateLoop.prototype = copyObject(DomplateTag.prototype,
{
    merge: function(args, oldTag)
    {
        this.isLoop = true;
        this.varName = oldTag ? oldTag.varName : args[0];
        this.iter = oldTag ? oldTag.iter : parseValue(args[1]);
        this.vars = [];

        this.children = oldTag ? copyArray(oldTag.children) : [];

        var offset = Math.min(args.length, 2);
        parseChildren(args, offset, this.vars, this.children);

        return creator(this, DomplateLoop);
    },

    getVarNames: function(names)
    {
        if (this.iter instanceof Parts)
            names.push(this.iter.parts[0].name);

        DomplateTag.prototype.getVarNames.apply(this, [names]);
    },

    generateMarkup: function(topBlock, topOuts, blocks, info)
    {
        this.addCode(topBlock, topOuts, blocks);

        var iterName;
        if (this.iter instanceof Parts)
        {
            var part = this.iter.parts[0];
            iterName = part.name;

            if (part.format)
            {
                for (var i = 0; i < part.format.length; ++i)
                    iterName = part.format[i] + "(" + iterName + ")";
            }
        }
        else
            iterName = this.iter;

        blocks.push('__loop__.apply(this, [', iterName, ', __out__, function(', this.varName, ', __out__) {\n');
        this.generateChildMarkup(topBlock, topOuts, blocks, info);
        this.addCode(topBlock, topOuts, blocks);
        blocks.push('}]);\n');
    },

    generateDOM: function(path, blocks, args)
    {
        var iterName = 'd'+path.renderIndex++;
        var counterName = 'i'+path.loopIndex;
        var loopName = 'l'+path.loopIndex++;

        if (!path.length)
            path.push(-1, 0);

        var preIndex = path.renderIndex;
        path.renderIndex = 0;

        var nodeCount = 0;

        var subBlocks = [];
        var basePath = path[path.length-1];
        for (var i = 0; i < this.children.length; ++i)
        {
            path[path.length-1] = basePath+'+'+loopName+'+'+nodeCount;

            var child = this.children[i];
            if (isTag(child))
                nodeCount += '+' + child.tag.generateDOM(path, subBlocks, args);
            else
                nodeCount += '+1';
        }

        path[path.length-1] = basePath+'+'+loopName;

        //blocks.push("console.group('", loopName, "');");
        blocks.push(loopName,' = __loop__.apply(this, [', iterName, ', function(', counterName,',',loopName);
        for (var i = 0; i < path.renderIndex; ++i)
            blocks.push(',d'+i);
        blocks.push(') {\n');
        blocks.push(subBlocks.join(""));
        blocks.push('return ', nodeCount, ';\n');
        blocks.push('}]);\n');
        //blocks.push("console.groupEnd();");

        path.renderIndex = preIndex;

        return loopName;
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function Variable(name, format)
{
    this.name = name;
    this.format = format;
}

function Parts(parts)
{
    this.parts = parts;
}

// ************************************************************************************************

function parseParts(str)
{
    var re = /\$([_A-Za-z][_A-Za-z0-9.|]*)/g;
    var index = 0;
    var parts = [];

    var m;
    while (m = re.exec(str))
    {
        var pre = str.substr(index, (re.lastIndex-m[0].length)-index);
        if (pre)
            parts.push(pre);

        var expr = m[1].split("|");
        parts.push(new Variable(expr[0], expr.slice(1)));
        index = re.lastIndex;
    }

    if (!index)
        return str;

    var post = str.substr(index);
    if (post)
        parts.push(post);

    return new Parts(parts);
}

function parseValue(val)
{
    return typeof(val) == 'string' ? parseParts(val) : val;
}

function parseChildren(args, offset, vars, children)
{
    for (var i = offset; i < args.length; ++i)
    {
        var val = parseValue(args[i]);
        children.push(val);
        readPartNames(val, vars);
    }
}

function readPartNames(val, vars)
{
    if (val instanceof Parts)
    {
        for (var i = 0; i < val.parts.length; ++i)
        {
            var part = val.parts[i];
            if (part instanceof Variable)
                vars.push(part.name);
        }
    }
}

function generateArg(val, path, args)
{
    if (val instanceof Parts)
    {
        var vals = [];
        for (var i = 0; i < val.parts.length; ++i)
        {
            var part = val.parts[i];
            if (part instanceof Variable)
            {
                var varName = 'd'+path.renderIndex++;
                if (part.format)
                {
                    for (var j = 0; j < part.format.length; ++j)
                        varName = part.format[j] + '(' + varName + ')';
                }

                vals.push(varName);
            }
            else
                vals.push('"'+part.replace(/"/g, '\\"')+'"');
        }

        return vals.join('+');
    }
    else
    {
        args.push(val);
        return 's' + path.staticIndex++;
    }
}

function addParts(val, delim, block, info, escapeIt)
{
    var vals = [];
    if (val instanceof Parts)
    {
        for (var i = 0; i < val.parts.length; ++i)
        {
            var part = val.parts[i];
            if (part instanceof Variable)
            {
                var partName = part.name;
                if (part.format)
                {
                    for (var j = 0; j < part.format.length; ++j)
                        partName = part.format[j] + "(" + partName + ")";
                }

                if (escapeIt)
                    vals.push("__escape__(" + partName + ")");
                else
                    vals.push(partName);
            }
            else
                vals.push('"'+ part + '"');
        }
    }
    else if (isTag(val))
    {
        info.args.push(val);
        vals.push('s'+info.argIndex++);
    }
    else
        vals.push('"'+ val + '"');

    var parts = vals.join(delim);
    if (parts)
        block.push(delim, parts);
}

function isTag(obj)
{
    return (typeof(obj) == "function" || obj instanceof Function) && !!obj.tag;
}

function isDomplate(obj)
{
    return (typeof(obj) == "object") && !!obj.render;
}

function creator(tag, cons)
{
    var fn = new Function(
        "var tag = arguments.callee.tag;" +
        "var cons = arguments.callee.cons;" +
        "var newTag = new cons();" +
        "return newTag.merge(arguments, tag);");

    fn.tag = tag;
    fn.cons = cons;
    extend(fn, Renderer);

    return fn;
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function copyArray(oldArray)
{
    var ary = [];
    if (oldArray)
        for (var i = 0; i < oldArray.length; ++i)
            ary.push(oldArray[i]);
   return ary;
}

function copyObject(l, r)
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

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function ArrayIterator(array)
{
    var index = -1;

    this.next = function()
    {
        if (++index >= array.length)
            throw StopIteration;

        return array[index];
    };
}

function StopIteration() {}

this.$break = function()
{
    throw StopIteration;
};

// ************************************************************************************************

var Renderer =
{
    renderHTML: function(args, outputs, self)
    {
        var code = [];
        var markupArgs = [code, this.tag.context, args, outputs];
        markupArgs.push.apply(markupArgs, this.tag.markupArgs);
        this.tag.renderMarkup.apply(self ? self : this.tag.subject, markupArgs);
        return code.join("");
    },

    insertRows: function(args, before, self)
    {
        this.tag.compile();

        var outputs = [];
        var html = this.renderHTML(args, outputs, self);

        var doc = before.ownerDocument;
        var tableParent = doc.createElement("div"); // Workaround: IE doesn't allow to set TABLE.innerHTML
        tableParent.innerHTML = "<table>" + html + "</table>";

        var tbody = tableParent.firstChild.firstChild;
        var parent = before.tagName.toLowerCase() == "tr" ? before.parentNode : before;
        var after = before.tagName.toLowerCase() == "tr" ? before.nextSibling : null;

        var firstRow = tbody.firstChild, lastRow;
        while (tbody.firstChild)
        {
            lastRow = tbody.firstChild;
            if (after)
                parent.insertBefore(lastRow, after);
            else
                parent.appendChild(lastRow);
        }

        var offset = 0;
        if (this.tag.isLoop)
        {
            var node = firstRow.parentNode.firstChild;
            for (; node && node != firstRow; node = node.nextSibling)
                ++offset;
        }

        var domArgs = [firstRow, this.tag.context, offset];
        domArgs.push.apply(domArgs, this.tag.domArgs);
        domArgs.push.apply(domArgs, outputs);

        this.tag.renderDOM.apply(self ? self : this.tag.subject, domArgs);
        return [firstRow, lastRow];
    },

    insertAfter: function(args, before, self)
    {
        this.tag.compile();

        var outputs = [];
        var html = this.renderHTML(args, outputs, self);

        var doc = before.ownerDocument;
        var range = doc.createRange();
        range.selectNode(doc.body);
        var frag = range.createContextualFragment(html);

        var root = frag.firstChild;
        if (before.nextSibling)
            before.parentNode.insertBefore(frag, before.nextSibling);
        else
            before.parentNode.appendChild(frag);

        var domArgs = [root, this.tag.context, 0];
        domArgs.push.apply(domArgs, this.tag.domArgs);
        domArgs.push.apply(domArgs, outputs);

        this.tag.renderDOM.apply(self ? self : (this.tag.subject ? this.tag.subject : null),
            domArgs);

        return root;
    },

    replace: function(args, parent, self)
    {
        this.tag.compile();

        var outputs = [];
        var html = this.renderHTML(args, outputs, self);

        var root;
        if (parent.nodeType == 1)
        {
            parent.innerHTML = html;
            root = parent.firstChild;
        }
        else
        {
            if (!parent || parent.nodeType != 9)
                parent = document; //xxxHonza: There are no globals.

            if (!womb || womb.ownerDocument != parent)
                womb = parent.createElement("div");
            womb.innerHTML = html;

            root = womb.firstChild;
            //womb.removeChild(root);
        }

        var domArgs = [root, this.tag.context, 0];
        domArgs.push.apply(domArgs, this.tag.domArgs);
        domArgs.push.apply(domArgs, outputs);
        this.tag.renderDOM.apply(self ? self : this.tag.subject, domArgs);

        return root;
    },

    append: function(args, parent, self)
    {
        this.tag.compile();

        var outputs = [];
        var html = this.renderHTML(args, outputs, self);

        if (!womb || womb.ownerDocument != parent.ownerDocument)
            womb = parent.ownerDocument.createElement("div");
        womb.innerHTML = html;

        var root = womb.firstChild;
        while (womb.firstChild)
            parent.appendChild(womb.firstChild);

        var domArgs = [root, this.tag.context, 0];
        domArgs.push.apply(domArgs, this.tag.domArgs);
        domArgs.push.apply(domArgs, outputs);
        this.tag.renderDOM.apply(self ? self : this.tag.subject, domArgs);

        return root;
    },

    insertCols: function(args, parent, self)
    {
        this.tag.compile();

        var outputs = [];
        var html = this.renderHTML(args, outputs, self);

        // This doesn't work in IE.
        //var table = parent.ownerDocument.createElement("table");
        //var womb = parent.ownerDocument.createElement("tr");
        //table.appendChild(womb);
        //womb.innerHTML = html;

        var womb = parent.ownerDocument.createElement("div");
        womb.innerHTML = "<table><tbody><tr>" + html + "</tr></tbody></table>";
        womb = womb.firstChild.firstChild.firstChild;

        var firstCol = womb.firstChild;
        if (!firstCol)
            return null;

        while (womb.firstChild)
            parent.appendChild(womb.firstChild);

        // See insertRows for comment.
        var offset = 0;
        if (this.tag.isLoop)
        {
            var node = firstCol.parentNode.firstChild;
            for (; node && node != firstCol; node = node.nextSibling)
                ++offset;
        }

        var domArgs = [firstCol, this.tag.context, offset];
        domArgs.push.apply(domArgs, this.tag.domArgs);
        domArgs.push.apply(domArgs, outputs);
        this.tag.renderDOM.apply(self ? self : this.tag.subject, domArgs);

        return firstCol;
    }
};

// ************************************************************************************************

function defineTags()
{
    for (var i = 0; i < arguments.length; ++i)
    {
        var tagName = arguments[i];
        var fn = new Function("var newTag = new Domplate.DomplateTag('"+tagName+"'); return newTag.merge(arguments);");

        var fnName = tagName.toUpperCase();
        Domplate[fnName] = fn;
    }
}

defineTags(
    "a", "button", "br", "canvas", "col", "colgroup", "div", "fieldset", "form", "h1", "h2", "h3", "hr",
     "img", "input", "label", "legend", "li", "ol", "optgroup", "option", "p", "pre", "select",
    "span", "strong", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "tr", "tt", "ul", "code",
    "iframe", "canvas"
);

}).apply(Domplate);

return Domplate;

//*************************************************************************************************
})
, {"filename":"../webapp/scripts/domplate/domplate.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/core/lib.js","mtime":1420433266,"wrapper":"amd","format":"amd","id":"3d84302dc73ad91f3bb53e7af2525a4ab1cbb6a9-core/lib.js"}
require.memoize("3d84302dc73ad91f3bb53e7af2525a4ab1cbb6a9-core/lib.js", 
/* See license.txt for terms of usage */

require.def("core/lib", [
    "jquery/jquery",
    "core/trace"
],

function(jQuery, Trace) {

//***********************************************************************************************//

var Lib = {};

//***********************************************************************************************//
// Browser Version

var userAgent = navigator.userAgent.toLowerCase();
Lib.isFirefox = /firefox/.test(userAgent);
Lib.isOpera   = /opera/.test(userAgent);
Lib.isWebkit  = /webkit/.test(userAgent);
Lib.isSafari  = /webkit/.test(userAgent);
Lib.isIE      = /msie/.test(userAgent) && !/opera/.test(userAgent);
Lib.isIE6     = /msie 6/i.test(navigator.appVersion);
Lib.browserVersion = (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1];
Lib.isIElt8   = Lib.isIE && (Lib.browserVersion-0 < 8); 

//***********************************************************************************************//
// Core concepts (extension, dispatch, bind)

Lib.extend = function copyObject(l, r)
{
    var m = {};
    Lib.append(m, l);
    Lib.append(m, r);
    return m;
};

Lib.append = function(l, r)
{
    for (var n in r)
        l[n] = r[n];
    return l;
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

Lib.bind = function()  // fn, thisObject, args => thisObject.fn(args, arguments);
{
    var args = Lib.cloneArray(arguments), fn = args.shift(), object = args.shift();
    return function() { return fn.apply(object, Lib.arrayInsert(Lib.cloneArray(args), 0, arguments)); }
};

Lib.bindFixed = function() // fn, thisObject, args => thisObject.fn(args);
{
    var args = Lib.cloneArray(arguments), fn = args.shift(), object = args.shift();
    return function() { return fn.apply(object, args); }
};

Lib.dispatch = function(listeners, name, args)
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

Lib.dispatch2 = function(listeners, name, args)
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
// Type Checking

var toString = Object.prototype.toString;
var reFunction = /^\s*function(\s+[\w_$][\w\d_$]*)?\s*\(/; 

Lib.isArray = function(object)
{
    //return toString.call(object) === "[object Array]";
    return jQuery.isArray(object);
};

Lib.isFunction = function(object)
{
    if (!object)
        return false;

    return toString.call(object) === "[object Function]" ||
        Lib.isIE && typeof object != "string" &&
        reFunction.test(""+object);
};

//***********************************************************************************************//
// DOM

Lib.isAncestor = function(node, potentialAncestor)
{
    for (var parent = node; parent; parent = parent.parentNode)
    {
        if (parent == potentialAncestor)
            return true;
    }

    return false;
};

//***********************************************************************************************//
// Events

Lib.fixEvent = function(e)
{
    return jQuery.event.fix(e || window.event);
}

Lib.fireEvent = function(element, event)
{
    if (document.createEvent)
    {
        var evt = document.createEvent("Events");
        evt.initEvent(event, true, false); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    }
}

Lib.cancelEvent = function(event)
{
    var e = Lib.fixEvent(event);
    e.stopPropagation();
    e.preventDefault();
};

Lib.addEventListener = function(object, name, handler, direction)
{
    direction = direction || false;

    if (object.addEventListener)
        object.addEventListener(name, handler, direction);
    else
        object.attachEvent("on"+name, handler);
};

Lib.removeEventListener = function(object, name, handler, direction)
{
    direction = direction || false;

    if (object.removeEventListener)
        object.removeEventListener(name, handler, direction);
    else
        object.detachEvent("on"+name, handler);
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
// Key Events

Lib.isLeftClick = function(event)
{
    return event.button == 0 && Lib.noKeyModifiers(event);
};

Lib.noKeyModifiers = function(event)
{
    return !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;
};

Lib.isControlClick = function(event)
{
    return event.button == 0 && Lib.isControl(event);
};

Lib.isShiftClick = function(event)
{
    return event.button == 0 && Lib.isShift(event);
};

Lib.isControl = function(event)
{
    return (event.metaKey || event.ctrlKey) && !event.shiftKey && !event.altKey;
};

Lib.isAlt = function(event)
{
    return event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey;
};

Lib.isAltClick = function(event)
{
    return event.button == 0 && Lib.isAlt(event);
};

Lib.isControlShift = function(event)
{
    return (event.metaKey || event.ctrlKey) && event.shiftKey && !event.altKey;
};

Lib.isShift = function(event)
{
    return event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey;
};

//***********************************************************************************************//
// Rect {top, left, height, width}

Lib.inflateRect = function(rect, x, y)
{
    return {
        top: rect.top - y,
        left: rect.left - x,
        height: rect.height + 2*y,
        width: rect.width + 2*x
    }
};

Lib.pointInRect = function(rect, x, y)
{
    return (y >= rect.top && y <= rect.top + rect.height &&
        x >= rect.left && x <= rect.left + rect.width);
}

//*************************************************************************************************
// Arrays

Lib.cloneArray = function(array, fn)
{
   var newArray = [];

   if (fn)
       for (var i = 0; i < array.length; ++i)
           newArray.push(fn(array[i]));
   else
       for (var i = 0; i < array.length; ++i)
           newArray.push(array[i]);

   return newArray;
};

Lib.arrayInsert = function(array, index, other)
{
   for (var i = 0; i < other.length; ++i)
       array.splice(i+index, 0, other[i]);
   return array;
};

Lib.remove = function(list, item)
{
    for (var i = 0; i < list.length; ++i)
    {
        if (list[i] == item)
        {
            list.splice(i, 1);
            return true;
        }
    }
    return false;
};

//*************************************************************************************************
// Text Formatting

Lib.formatSize = function(bytes)
{
    var sizePrecision = 1; // Can be customizable from cookies?
    sizePrecision = (sizePrecision > 2) ? 2 : sizePrecision;
    sizePrecision = (sizePrecision < -1) ? -1 : sizePrecision;

    if (sizePrecision == -1)
        return bytes + " B";

    var a = Math.pow(10, sizePrecision);

    if (bytes == -1 || bytes == undefined)
        return "?";
    else if (bytes == 0)
        return "0";
    else if (bytes < 1024)
        return bytes + " B";
    else if (bytes < (1024*1024))
        return Math.round((bytes/1024)*a)/a + " KB";
    else
        return Math.round((bytes/(1024*1024))*a)/a + " MB";
};

Lib.formatTime = function(elapsed)
{
    if (elapsed == -1)
        return "-"; // should be &nbsp; but this will be escaped so we need something that is no whitespace
    else if (elapsed < 1000)
        return elapsed + "ms";
    else if (elapsed < 60000)
        return (Math.ceil(elapsed/10) / 100) + "s";
    else
        return (Math.ceil((elapsed/60000)*100)/100) + "m";
};

Lib.formatNumber = function(number)
{
    number += "";
    var x = number.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1))
        x1 = x1.replace(rgx, "$1" + " " + "$2");
    return x1 + x2;
};

Lib.formatString = function(string)
{
    var args = Lib.cloneArray(arguments), string = args.shift();
    for (var i=0; i<args.length; i++)
    {
        var value = args[i].toString();
        string = string.replace("%S", value);
    }
    return string;
};

//*************************************************************************************************
// Date

Lib.parseISO8601 = function(text)
{
    var date = Lib.fromISOString(text);
    return date ? date.getTime() : null;
};

Lib.fromISOString = function(text)
{
    if (!text)
        return null;

    // Date time pattern: YYYY-MM-DDThh:mm:ss.sTZD
    // eg 1997-07-16T19:20:30.451+01:00
    // http://www.w3.org/TR/NOTE-datetime
    // xxxHonza: use the one from the schema.
    var regex = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;
    var reg = new RegExp(regex);
    var m = text.toString().match(new RegExp(regex));
    if (!m)
        return null;

    var date = new Date();
    date.setUTCDate(1);
    date.setUTCFullYear(parseInt(m[1], 10));
    date.setUTCMonth(parseInt(m[3], 10) - 1);
    date.setUTCDate(parseInt(m[5], 10));
    date.setUTCHours(parseInt(m[7], 10));
    date.setUTCMinutes(parseInt(m[9], 10));
    date.setUTCSeconds(parseInt(m[11], 10));

    if (m[12])
        date.setUTCMilliseconds(parseFloat(m[12]) * 1000);
    else
        date.setUTCMilliseconds(0);

    if (m[13] != 'Z')
    {
        var offset = (m[15] * 60) + parseInt(m[17], 10);
        offset *= ((m[14] == '-') ? -1 : 1);
        date.setTime(date.getTime() - offset * 60 * 1000);
    }

    return date;
},

Lib.toISOString = function(date)
{
    function f(n, c) {
        if (!c) c = 2;
        var s = new String(n);
        while (s.length < c) s = "0" + s;
        return s;
    }

    var result = date.getUTCFullYear() + '-' +
        f(date.getMonth() + 1) + '-' +
        f(date.getDate()) + 'T' +
        f(date.getHours()) + ':' +
        f(date.getMinutes()) + ':' +
        f(date.getSeconds()) + '.' +
        f(date.getMilliseconds(), 3);

    var offset = date.getTimezoneOffset();
    var offsetHours = Math.floor(offset / 60);
    var offsetMinutes = Math.floor(offset % 60);
    var prettyOffset = (offset > 0 ? "-" : "+") +
        f(Math.abs(offsetHours)) + ":" + f(Math.abs(offsetMinutes));

    return result + prettyOffset;
},

//*************************************************************************************************
// URL

Lib.getFileName = function(url)
{
    try
    {
        var split = Lib.splitURLBase(url);
        return split.name;
    }
    catch (e)
    {
        Trace.log(unescape(url));
    }

    return url;
};

Lib.getFileExtension = function(url)
{
    if (!url)
        return null;

    // Remove query string from the URL if any.
    var queryString = url.indexOf("?");
    if (queryString != -1)
        url = url.substr(0, queryString);

    // Now get the file extension.
    var lastDot = url.lastIndexOf(".");
    return url.substr(lastDot+1);
};

Lib.splitURLBase = function(url)
{
    if (Lib.isDataURL(url))
        return Lib.splitDataURL(url);
    return Lib.splitURLTrue(url);
};

Lib.isDataURL = function(url)
{
    return (url && url.substr(0,5) == "data:");
};

Lib.splitDataURL = function(url)
{
    var mark = url.indexOf(':', 3);
    if (mark != 4)
        return false;   //  the first 5 chars must be 'data:'

    var point = url.indexOf(',', mark+1);
    if (point < mark)
        return false; // syntax error

    var props = { encodedContent: url.substr(point+1) };

    var metadataBuffer = url.substr(mark+1, point);
    var metadata = metadataBuffer.split(';');
    for (var i = 0; i < metadata.length; i++)
    {
        var nv = metadata[i].split('=');
        if (nv.length == 2)
            props[nv[0]] = nv[1];
    }

    // Additional Firebug-specific properties
    if (props.hasOwnProperty('fileName'))
    {
         var caller_URL = decodeURIComponent(props['fileName']);
         var caller_split = Lib.splitURLTrue(caller_URL);

        if (props.hasOwnProperty('baseLineNumber'))  // this means it's probably an eval()
        {
            props['path'] = caller_split.path;
            props['line'] = props['baseLineNumber'];
            var hint = decodeURIComponent(props['encodedContent'].substr(0,200)).replace(/\s*$/, "");
            props['name'] =  'eval->'+hint;
        }
        else
        {
            props['name'] = caller_split.name;
            props['path'] = caller_split.path;
        }
    }
    else
    {
        if (!props.hasOwnProperty('path'))
            props['path'] = "data:";
        if (!props.hasOwnProperty('name'))
            props['name'] =  decodeURIComponent(props['encodedContent'].substr(0,200)).replace(/\s*$/, "");
    }

    return props;
};

Lib.splitURLTrue = function(url)
{
    var reSplitFile = /:\/{1,3}(.*?)\/([^\/]*?)\/?($|\?.*)/;
    var m = reSplitFile.exec(url);
    if (!m)
        return {name: url, path: url};
    else if (!m[2])
        return {path: m[1], name: m[1]};
    else
        return {path: m[1], name: m[2]+m[3]};
};

/**
 * Returns value of specified parameter in the current URL.
 * @param {String} name Name of the requested parameter.
 * @return {String} Value of the requested parameter.
 */
Lib.getURLParameter = function(name)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++)
    {
        var pair = vars[i].split("=");
        if (pair[0] == name)
            return unescape(pair[1]);
    }
    return null;
};

/**
 * Supports multiple URL parameters with the same name. Returns array
 * of values.
 * @param {String} name Name of the requested parameter.
 * @return {Array} Array with values.
 */
Lib.getURLParameters = function(name)
{
    var result = [];
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++)
    {
        var pair = vars[i].split("=");
        if (pair[0] == name)
            result.push(unescape(pair[1]));
    }
    return result;
};

Lib.parseURLParams = function(url)
{
    var q = url ? url.indexOf("?") : -1;
    if (q == -1)
        return [];

    var search = url.substr(q+1);
    var h = search.lastIndexOf("#");
    if (h != -1)
        search = search.substr(0, h);

    if (!search)
        return [];

    return Lib.parseURLEncodedText(search);
};

Lib.parseURLEncodedText = function(text, noLimit)
{
    var maxValueLength = 25000;

    var params = [];

    // In case the text is empty just return the empty parameters
    if(text == '')
      return params;

    // Unescape '+' characters that are used to encode a space.
    // See section 2.2.in RFC 3986: http://www.ietf.org/rfc/rfc3986.txt
    text = text.replace(/\+/g, " ");

    // Unescape '&amp;' character
    //xxxHonza: text = Lib.unescapeForURL(text);

    function decodeText(text)
    {
        try
        {
            return decodeURIComponent(text);
        }
        catch (e)
        {
            return decodeURIComponent(unescape(text));
        }
    }

    var args = text.split("&");
    for (var i = 0; i < args.length; ++i)
    {
        try
        {
            var index = args[i].indexOf("=");
            if (index != -1)
            {
                var paramName = args[i].substring(0, index);
                var paramValue = args[i].substring(index + 1);

                if (paramValue.length > maxValueLength && !noLimit)
                    paramValue = Lib.$STR("LargeData");

                params.push({name: decodeText(paramName), value: decodeText(paramValue)});
            }
            else
            {
                var paramName = args[i];
                params.push({name: decodeText(paramName), value: ""});
            }
        }
        catch (e)
        {
        }
    }

    params.sort(function(a, b) { return a.name <= b.name ? -1 : 1; });

    return params;
};

//*************************************************************************************************
// DOM

Lib.getBody = function(doc)
{
    if (doc.body)
        return doc.body;

    var body = doc.getElementsByTagName("body")[0];
    if (body)
        return body;

    // Should never happen.
    return null;
};

Lib.getHead = function(doc)
{
    return doc.getElementsByTagName("head")[0];
};

Lib.getAncestorByClass = function(node, className)
{
    for (var parent = node; parent; parent = parent.parentNode)
    {
        if (Lib.hasClass(parent, className))
            return parent;
    }

    return null;
};

Lib.$ = function()
{
    return Lib.getElementByClass.apply(this, arguments);
};

Lib.getElementByClass = function(node, className)  // className, className, ...
{
    if (!node)
        return null;

    var args = Lib.cloneArray(arguments); args.splice(0, 1);
    for (var child = node.firstChild; child; child = child.nextSibling)
    {
        var args1 = Lib.cloneArray(args); args1.unshift(child);
        if (Lib.hasClass.apply(this, args1))
            return child;
        else
        {
            var found = Lib.getElementByClass.apply(this, args1);
            if (found)
                return found;
        }
    }

    return null;
};

Lib.getElementsByClass = function(node, className)  // className, className, ...
{
    if (node.querySelectorAll)
    {
        var args = Lib.cloneArray(arguments); args.shift();
        var selector = "." + args.join(".");
        return node.querySelectorAll(selector);
    }

    function iteratorHelper(node, classNames, result)
    {
        for (var child = node.firstChild; child; child = child.nextSibling)
        {
            var args1 = Lib.cloneArray(classNames); args1.unshift(child);
            if (Lib.hasClass.apply(null, args1))
                result.push(child);

            iteratorHelper(child, classNames, result);
        }
    }

    var result = [];
    var args = Lib.cloneArray(arguments); args.shift();
    iteratorHelper(node, args, result);
    return result;
}

Lib.getChildByClass = function(node) // ,classname, classname, classname...
{
    for (var i = 1; i < arguments.length; ++i)
    {
        var className = arguments[i];
        var child = node.firstChild;
        node = null;
        for (; child; child = child.nextSibling)
        {
            if (Lib.hasClass(child, className))
            {
                node = child;
                break;
            }
        }
    }

    return node;
};

Lib.eraseNode = function(node)
{
    while (node.lastChild)
        node.removeChild(node.lastChild);
};

Lib.clearNode = function(node)
{
    node.innerHTML = "";
};

//***********************************************************************************************//
// CSS

Lib.hasClass = function(node, name) // className, className, ...
{
    if (!node || node.nodeType != 1)
        return false;
    else
    {
        for (var i=1; i<arguments.length; ++i)
        {
            var name = arguments[i];
            //var re = new RegExp("(^|\\s)"+name+"($|\\s)");
            //if (!re.exec(node.getAttribute("class")))
            //    return false;
            var className = node.className;//node.getAttribute("class");
            if (!className || className.indexOf(name + " ") == -1)
                return false;
        }

        return true;
    }
};

Lib.setClass = function(node, name)
{
    if (node && !Lib.hasClass(node, name))
        node.className += " " + name + " ";
};

Lib.removeClass = function(node, name)
{
    if (node && node.className)
    {
        var index = node.className.indexOf(name);
        if (index >= 0)
        {
            var size = name.length;
            node.className = node.className.substr(0,index-1) + node.className.substr(index+size);
        }
    }
};

Lib.toggleClass = function(elt, name)
{
    if (Lib.hasClass(elt, name))
    {
        Lib.removeClass(elt, name);
        return false;
    }
    else
    {
        Lib.setClass(elt, name);
        return true;
    }
};

Lib.setClassTimed = function(elt, name, timeout)
{
    if (!timeout)
        timeout = 1300;

    if (elt.__setClassTimeout)  // then we are already waiting to remove the class mark
        clearTimeout(elt.__setClassTimeout);  // reset the timer
    else                        // then we are not waiting to remove the mark
        Lib.setClass(elt, name);

    elt.__setClassTimeout = setTimeout(function()
    {
        delete elt.__setClassTimeout;
        Lib.removeClass(elt, name);
    }, timeout);
};

//*************************************************************************************************
// Text

Lib.trim = function(text)
{
    return text.replace(/^\s*|\s*$/g, "");
};

Lib.wrapText = function(text, noEscapeHTML)
{
    var reNonAlphaNumeric = /[^A-Za-z_$0-9'"-]/;

    var html = [];
    var wrapWidth = 100;

    // Split long text into lines and put every line into an <pre> element (only in case
    // if noEscapeHTML is false). This is useful for automatic scrolling when searching
    // within response body (in order to scroll we need an element).
    var lines = Lib.splitLines(text);
    for (var i = 0; i < lines.length; ++i)
    {
        var line = lines[i];
        while (line.length > wrapWidth)
        {
            var m = reNonAlphaNumeric.exec(line.substr(wrapWidth, 100));
            var wrapIndex = wrapWidth+ (m ? m.index : 0);
            var subLine = line.substr(0, wrapIndex);
            line = line.substr(wrapIndex);

            if (!noEscapeHTML) html.push("<pre>");
            html.push(noEscapeHTML ? subLine : Lib.escapeHTML(subLine));
            if (!noEscapeHTML) html.push("</pre>");
        }

        if (!noEscapeHTML) html.push("<pre>");
        html.push(noEscapeHTML ? line : Lib.escapeHTML(line));
        if (!noEscapeHTML) html.push("</pre>");
    }

    return html.join(noEscapeHTML ? "\n" : "");
};

Lib.insertWrappedText = function(text, textBox, noEscapeHTML)
{
    textBox.innerHTML = "<pre>" + Lib.wrapText(text, noEscapeHTML) + "</pre>";
};

Lib.splitLines = function(text)
{
    var reSplitLines = /\r\n|\r|\n/;

    if (!text)
        return [];
    else if (text.split)
        return text.split(reSplitLines);

    var str = text + "";
    var theSplit = str.split(reSplitLines);
    return theSplit;
};

Lib.getPrettyDomain = function(url)
{
    var m = /^[^:]+:\/{1,3}(www\.)?([^\/]+)/.exec(url);
    return m ? m[2] : "";
},

Lib.escapeHTML = function(value)
{
    function replaceChars(ch)
    {
        switch (ch)
        {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "'":
                return "&#39;";
            case '"':
                return "&quot;";
        }
        return "?";
    };
    return String(value).replace(/[<>&"']/g, replaceChars);
};

Lib.cropString = function(text, limit)
{
    text = text + "";

    if (!limit)
        var halfLimit = 50;
    else
        var halfLimit = limit / 2;

    if (text.length > limit)
        return Lib.escapeNewLines(text.substr(0, halfLimit) + "..." + text.substr(text.length-halfLimit));
    else
        return Lib.escapeNewLines(text);
};

Lib.escapeNewLines = function(value)
{
    return value.replace(/\r/g, "\\r").replace(/\n/g, "\\n");
};

//***********************************************************************************************//
// JSON

Lib.cloneJSON = function(obj)
{
    if (obj == null || typeof(obj) != "object")
        return obj;

    try
    {
        var temp = obj.constructor();
        for (var key in obj)
            temp[key] = this.cloneJSON(obj[key]);
        return temp;
    }
    catch (err)
    {
        Trace.exception(err);
    }

    return null;
};

//***********************************************************************************************//
// Layout

Lib.getOverflowParent = function(element)
{
    for (var scrollParent = element.parentNode; scrollParent;
        scrollParent = scrollParent.offsetParent)
    {
        if (scrollParent.scrollHeight > scrollParent.offsetHeight)
            return scrollParent;
    }
};

Lib.getElementBox = function(el)
{
    var result = {};

    if (el.getBoundingClientRect)
    {
        var rect = el.getBoundingClientRect();

        // fix IE problem with offset when not in fullscreen mode
        var offset = Lib.isIE ? document.body.clientTop || document.documentElement.clientTop: 0;
        var scroll = Lib.getWindowScrollPosition();

        result.top = Math.round(rect.top - offset + scroll.top);
        result.left = Math.round(rect.left - offset + scroll.left);
        result.height = Math.round(rect.bottom - rect.top);
        result.width = Math.round(rect.right - rect.left);
    }
    else
    {
        var position = Lib.getElementPosition(el);

        result.top = position.top;
        result.left = position.left;
        result.height = el.offsetHeight;
        result.width = el.offsetWidth;
    }

    return result;
};

Lib.getElementPosition = function(el)
{
    var left = 0
    var top = 0;

    do
    {
        left += el.offsetLeft;
        top += el.offsetTop;
    }
    while (el = el.offsetParent);

    return {left:left, top:top};
};

Lib.getWindowSize = function()
{
    var width=0, height=0, el;
    
    if (typeof window.innerWidth == "number")
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

Lib.getWindowScrollSize = function()
{
    var width=0, height=0, el;

    // first try the document.documentElement scroll size
    if (!Lib.isIEQuiksMode && (el=document.documentElement) && 
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

Lib.getWindowScrollPosition = function()
{
    var top=0, left=0, el;

    if(typeof window.pageYOffset == "number")
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

Lib.scrollIntoCenterView = function(element, scrollBox, notX, notY)
{
    if (!element)
        return;

    if (!scrollBox)
        scrollBox = Lib.getOverflowParent(element);

    if (!scrollBox)
        return;

    var offset = Lib.getClientOffset(element);

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

Lib.getClientOffset = function(elt)
{
    function addOffset(elt, coords, view)
    {
        var p = elt.offsetParent;

        var style = view.getComputedStyle(elt, "");

        if (elt.offsetLeft)
            coords.x += elt.offsetLeft + parseInt(style.borderLeftWidth);
        if (elt.offsetTop)
            coords.y += elt.offsetTop + parseInt(style.borderTopWidth);

        if (p)
        {
            if (p.nodeType == 1)
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
// Stylesheets

/**
 * Load stylesheet into the specified document. The method doesn't wait till the stylesheet
 * is loaded and so, not suitable for cases when you do not care when the file is loaded.
 * @param {Object} doc The document to load the stylesheet into.
 * @param {Object} url URL of the target stylesheet.
 */
Lib.addStyleSheet = function(doc, url)
{
    if (doc.getElementById(url))
        return;

    var link = doc.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    link.setAttribute("id", url);

    var head = Lib.getHead(doc);
    head.appendChild(link);
}

// ********************************************************************************************* //
// Selection

Lib.selectElementText = function(textNode, startOffset, endOffset)
{
    var win = window;
    var doc = win.document;
    if (win.getSelection && doc.createRange)
    {
        var sel = win.getSelection();
        var range = doc.createRange();
        //range.selectNodeContents(el);

        range.setStart(textNode, startOffset);
        range.setEnd(textNode, endOffset);
        sel.removeAllRanges();
        sel.addRange(range);
    }
    else if (doc.body.createTextRange)
    {
        range = doc.body.createTextRange();
        range.moveToElementText(textNode);
        range.select();
    }
}

// ********************************************************************************************* //

return Lib;

// ********************************************************************************************* //
})
, {"filename":"../webapp/scripts/core/lib.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/core/trace.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"3d84302dc73ad91f3bb53e7af2525a4ab1cbb6a9-core/trace.js"}
require.memoize("3d84302dc73ad91f3bb53e7af2525a4ab1cbb6a9-core/trace.js", 
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
    if (typeof(console.error) == "function")
        console.error.apply(console, arguments);
};

Trace.exception = function()
{
    if (typeof(console.error) == "function")
        console.error.apply(console, arguments);
};

Trace.time = function()
{
    if (typeof(console.time) == "function")
        console.time.apply(console, arguments);
};

Trace.timeEnd = function(name, message)
{
    if (typeof(console.timeEnd) == "function")
        console.timeEnd.apply(console, arguments);
};
// #endif

return Trace;

//*************************************************************************************************
})
, {"filename":"../webapp/scripts/core/trace.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/tabs/homeTab.js","mtime":1421119798,"wrapper":"amd","format":"amd","id":"9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/homeTab.js"}
require.memoize("9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/homeTab.js", 
/* See license.txt for terms of usage */

require.def("tabs/homeTab", [
    "jquery/jquery",
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "core/cookies",
    "core/trace",
    "i18n!nls/homeTab",
    "text!tabs/homeTab.html",
    "preview/harModel",
    "examples/loader"
],

function($, Domplate, TabView, Lib, Cookies, Trace, Strings, HomeTabHtml, HarModel, ExamplesLoader) { with (Domplate) {

//*************************************************************************************************
// Home Tab

function HomeTab() {}
HomeTab.prototype = Lib.extend(TabView.Tab.prototype,
/** @lends HomeTab */
{
    id: "Home",
    label: Strings.homeTabLabel,

    bodyTag:
        DIV({"class": "homeBody"}),

    onUpdateBody: function(tabView, body)
    {
        body = this.bodyTag.replace({}, body);

        // Content of this tab is loaded by default (required above) since it's
        // the first thing displayed to the user anyway.
        // Also let's search and replace some constants in the template.
        body.innerHTML = HomeTabHtml.replace("@HAR_SPEC_URL@", tabView.harSpecURL, "g");

        // Register click handlers.
        $("#appendPreview").click(Lib.bindFixed(this.onAppendPreview, this));
        $(".linkAbout").click(Lib.bind(this.onAbout, this));

        // Registers drag-and-drop event handlers. These will be responsible for
        // auto-loading all dropped HAR files.
        var content = $("#content");
        content.bind("dragenter", Lib.bind(Lib.cancelEvent, Lib));
        content.bind("dragover", Lib.bind(Lib.cancelEvent, Lib));
        content.bind("drop", Lib.bind(this.onDrop, this));

        // Update validate checkbox and register event handler.
        this.validateNode = $("#validate");
        var validate = Cookies.getCookie("validate");
        if (validate)
            this.validateNode.attr("checked", (validate == "false") ? false : true);
        this.validateNode.change(Lib.bind(this.onValidationChange, this))

        // Load examples
        $(".example").click(Lib.bind(this.onLoadExample, this));
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Events

    onAppendPreview: function(jsonString)
    {
        if (!jsonString)
            jsonString = $("#sourceEditor").val();

        if (jsonString)
            this.tabView.appendPreview(jsonString);
    },

    onAbout: function()
    {
        this.tabView.selectTabByName("About");
    },

    onValidationChange: function()
    {
        var validate = this.validateNode.attr("checked");
        Cookies.setCookie("validate", validate);
    },

    onLoadExample: function(event)
    {
        var e = Lib.fixEvent(event);
        var path = e.target.getAttribute("path");

        ExamplesLoader.load(path);

        // Show timeline and stats by default if an example is displayed.
        Cookies.setCookie("timeline", true);
        Cookies.setCookie("stats", true);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    onDrop: function(event)
    {
        var e = Lib.fixEvent(event);
        Lib.cancelEvent(e);

        try
        {
            this.handleDrop(event.originalEvent.dataTransfer);
        }
        catch (err)
        {
            Trace.exception("HomeTab.onDrop EXCEPTION", err);
        }
    },

    handleDrop: function(dataTransfer)
    {
        if (!dataTransfer)
            return false;

        var files = dataTransfer.files;
        if (!files)
            return;

        for (var i=0; i<files.length; i++)
        {
            var file = files[i];
            var ext = Lib.getFileExtension(file.name);
            if (ext.toLowerCase() != "har")
                continue;

            var self = this;
            var reader = this.getFileReader(file, function(text)
            {
                if (text)
                    self.onAppendPreview(text);
            });
            reader();
        }
    },

    getFileReader: function(file, callback)
    {
        return function fileReader()
        {
            if (typeof(file.getAsText) != "undefined")
            {
                callback(file.getAsText(""));
                return;
            }

            if (typeof(FileReader) != "undefined")
            {
                var fileReader = new FileReader();
                fileReader.onloadend = function() {
                    callback(fileReader.result);
                };
                fileReader.readAsText(file);
            }
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    loadInProgress: function(show, msg)
    {
        $("#sourceEditor").val(show ? (msg ? msg : Strings.loadingHar) : "");
    }
});

return HomeTab;

//*************************************************************************************************
}})
, {"filename":"../webapp/scripts/tabs/homeTab.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/core/cookies.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"3d84302dc73ad91f3bb53e7af2525a4ab1cbb6a9-core/cookies.js"}
require.memoize("3d84302dc73ad91f3bb53e7af2525a4ab1cbb6a9-core/cookies.js", 
/* See license.txt for terms of usage */

require.def("core/cookies", [
    "core/lib"
],

function(Lib) {

//*************************************************************************************************

var Cookies =
{
    getCookie: function(name)
    {
        var cookies = document.cookie.split(";");
        for (var i= 0; i<cookies.length; i++)
        {
            var cookie = cookies[i].split("=");
            if (Lib.trim(cookie[0]) == name)
                return cookie[1].length ? unescape(Lib.trim(cookie[1])) : null;
        }
    },

    setCookie: function(name, value, expires, path, domain, secure)
    {
        var today = new Date();
        today.setTime(today.getTime());

        if (expires)
            expires = expires * 1000 * 60 * 60 * 24;

        var expiresDate = new Date(today.getTime() + expires);
        document.cookie = name + "=" + escape(value) +
            (expires ? ";expires=" + expiresDate.toGMTString() : "") +
            (path ? ";path=" + path : "") + 
            (domain ? ";domain=" + domain : "") +
            (secure ? ";secure" : "");
    },

    removeCookie: function(name, path, domain)
    {
        if (this.getCookie(name))
        {
            document.cookie = name + "=" +
                (path ? ";path=" + path : "") +
                (domain ? ";domain=" + domain : "") +
                ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
        }
    },

    toggleCookie: function(name)
    {
        var value = this.getBooleanCookie(name);
        this.setCookie(name, !value);
    },

    getBooleanCookie: function(name)
    {
        var value = this.getCookie(name);
        return (!value || value == "false") ? false : true;
    },

    setBooleanCookie: function(name, value)
    {
        this.setCookie(name, value ? "true" : "false");
    }
};

return Cookies;

//*************************************************************************************************
})
, {"filename":"../webapp/scripts/core/cookies.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/nls/homeTab.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/homeTab.js"}
require.memoize("69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/homeTab.js", 
/* See license.txt for terms of usage */

define(
{
    "root": {
        "homeTabLabel": "Home",
        "loadingHar": "Loading..."
    }
})
, {"filename":"../webapp/scripts/nls/homeTab.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/tabs/homeTab.html","mtime":1420355852,"wrapper":"url-encoded","format":"utf8","id":"9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/homeTab.html"}
require.memoize("9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/homeTab.html", 
'%3Cdiv%3E%0D%0A%3Cul%20style%3D%22padding-left%3A%2020px%3B%20line-height%3A%2020px%3B%20margin-top%3A%200px%22%3E%0D%0A%3Cli%3EPaste%20%3Ca%20href%3D%22%40HAR_SPEC_URL%40%22%3EHAR%3C%2Fa%3E%0D%0Alog%20into%20the%20text%20box%20below%20and%0D%0Apress%20the%20%3Cb%3EPreview%3C%2Fb%3E%20button.%3C%2Fli%3E%0D%0A%3Cli%3EOr%20drop%20%3Cspan%20class%3D%22red%22%3E*.har%3C%2Fspan%3E%20file(s)%20anywhere%20on%20the%20page%20(if%20your%20browser%20supports%20that).%3C%2Fli%3E%0D%0A%3C%2Ful%3E%0D%0A%3Ctable%20cellpadding%3D%220%22%20cellspacing%3D%224%22%3E%0D%0A%20%20%20%20%3Ctr%3E%0D%0A%20%20%20%20%20%20%20%20%3Ctd%3E%3Cinput%20type%3D%22checkbox%22%20id%3D%22validate%22%20checked%3D%22true%22%3E%3C%2Finput%3E%3C%2Ftd%3E%0D%0A%20%20%20%20%20%20%20%20%3Ctd%20style%3D%22vertical-align%3Amiddle%3Bpadding-bottom%3A%201px%3B%22%3EValidate%20data%20before%20processing%3F%3C%2Ftd%3E%0D%0A%20%20%20%20%3C%2Ftr%3E%0D%0A%3C%2Ftable%3E%0D%0A%3Ctextarea%20id%3D%22sourceEditor%22%20class%3D%22sourceEditor%22%20cols%3D%2280%22%20rows%3D%225%22%3E%3C%2Ftextarea%3E%0D%0A%3Cp%3E%3Ctable%20cellpadding%3D%220%22%20cellspacing%3D%220%22%3E%0D%0A%20%20%20%20%3Ctr%3E%0D%0A%20%20%20%20%20%20%20%20%3Ctd%3E%3Cbutton%20id%3D%22appendPreview%22%3EPreview%3C%2Fbutton%3E%3C%2Ftd%3E%0D%0A%20%20%20%20%3C%2Ftr%3E%0D%0A%3C%2Ftable%3E%3C%2Fp%3E%0D%0A%3Cbr%2F%3E%0D%0A%3Ch3%3EHAR%20Log%20Examples%3C%2Fh3%3E%0D%0A%3Cul%20style%3D%22line-height%3A20px%3B%22%3E%0D%0A%3Cli%3E%3Cspan%20id%3D%22example1%22%20class%3D%22link%20example%22%20path%3D%22examples%2Finline-scripts-block.har%22%3E%0D%0AInline%20scripts%20block%3C%2Fspan%3E%20-%20Inline%20scripts%20block%20the%20page%20load.%3C%2Fli%3E%0D%0A%3Cli%3E%3Cspan%20id%3D%22example2%22%20class%3D%22link%20example%22%20path%3D%22examples%2Fbrowser-blocking-time.har%22%3E%0D%0ABlocking%20time%3C%2Fspan%3E%20-%20Impact%20of%20a%20limit%20of%20max%20number%20of%20parallel%20connections.%3C%2Fli%3E%0D%0A%3Cli%3E%3Cspan%20id%3D%22example3%22%20class%3D%22link%20example%22%20path%3D%22examples%2Fsoftwareishard.com.har%22%3E%0D%0ABrowser%20cache%3C%2Fspan%3E%20-%20Impact%20of%20the%20browser%20cache%20on%20page%20load%20(the%20same%20page%20loaded%20three%20times).%3C%2Fli%3E%0D%0A%3Cli%3E%3Cspan%20id%3D%22example4%22%20class%3D%22link%20example%22%20path%3D%22examples%2Fgoogle.com.har%22%3E%0D%0ASingle%20page%3C%2Fspan%3E%20-%20Single%20page%20load%20(empty%20cache).%3C%2Fli%3E%0D%0A%3C%2Ful%3E%0D%0A%3Ch3%3EHAR%20Logs%20Online%20%3C%2Fh3%3E%0D%0A%3Ci%3EYou%20can%20also%20preview%20any%20HAR%20file%20(in%20JSONP%20format)%20that%20is%20available%20online%20by%20using%0D%0A%3Cb%3EinputUrl%3C%2Fb%3E%20parameter%3Cbr%2F%3E%0D%0A(see%20more%20in%20the%20%3Cspan%20class%3D%22linkAbout%20link%22%3EAbout%3C%2Fspan%3E%20tab)%3A%3C%2Fi%3E%3Cbr%2F%3E%0D%0A%3Cp%3E%3Ccode%3E%3Ca%20href%3D%22%3FinputUrl%3Dhttp%3A%2F%2Fwww.janodvarko.cz%2Fhar%2Fviewer%2Fexamples%2Finline-scripts-block.harp%22%3E%0D%0A%20%20%20%20http%3A%2F%2Fwww.softwareishard.com%2Fhar%2Fviewer%3FinputUrl%3Dhttp%3A%2F%2Fwww.janodvarko.cz%2Fhar%2Fviewer%2Fexamples%2Finline-scripts-block.harp%3C%2Fa%3E%3C%2Fcode%3E%3C%2Fp%3E%0D%0A%0D%0A%3Cbr%2F%3E%0D%0A%3Cp%3E%3Ci%3EThis%20viewer%20supports%20HAR%201.2%20(see%20the%20%3Cspan%20class%3D%22linkAbout%20link%22%3EAbout%3C%2Fspan%3E%20tab).%3Cbr%2F%3E%3C%2Fi%3E%3C%2Fp%3E%0D%0A%3C%2Fdiv%3E%0D%0A'
, {"filename":"../webapp/scripts/tabs/homeTab.html"});
// @pinf-bundle-module: {"file":"../webapp/scripts/preview/harModel.js","mtime":1420434087,"wrapper":"amd","format":"amd","id":"f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/harModel.js"}
require.memoize("f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/harModel.js", 
/* See license.txt for terms of usage */

require.def("preview/harModel", [
    "jquery/jquery",
    "core/lib",
    "preview/jsonSchema",
    "preview/ref",
    "preview/harSchema",
    "core/cookies",
    "core/trace",
    "i18n!nls/harModel",
    "jquery-plugins/jquery.json"
],

function($, Lib, JSONSchema, Ref, HarSchema, Cookies, Trace, Strings) {

//*************************************************************************************************
// Statistics

function HarModel()
{
    this.input = null;
}

HarModel.prototype =
{
    append: function(input)
    {
        if (!input)
        {
            Trace.error("HarModel.append; Trying to append null input!");
            return;
        }

        // Sort all requests according to the start time.
        input.log.entries.sort(function(a, b)
        {
            var timeA = Lib.parseISO8601(a.startedDateTime);
            var timeB = Lib.parseISO8601(b.startedDateTime);

            if (timeA < timeB)
                return -1;
            else if (timeA > timeB)
                return 1;

            return 0;
        })

        if (this.input)
        {
            if (input.log.pages)
            {
                for (var i=0; i<input.log.pages.length; i++)
                    this.importPage(input.log.pages[i], input.log.entries);
            }
            else
            {
                Trace.error("Import of additional data without a page is not yet supported.");
                //xxxHonza: how to properly import data with no page?
                //for (var i=0; i<input.log.entries.length; i++)
                //    this.input.log.entries.push(input.log.entries[i]);
                return null;
            }
        }
        else
        {
            this.input = Lib.cloneJSON(input);
        }

        return this.input;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Pages

    getPages: function()
    {
        if (!this.input)
            return [];

        return this.input.log.pages ? this.input.log.pages : [];
    },

    getFirstPage: function()
    {
        var pages = this.getPages();
        return pages.length > 0 ? pages[0] : null;
    },

    getPageEntries: function(page)
    {
        return HarModel.getPageEntries(this.input, page);
    },

    getAllEntries: function(page)
    {
        return this.input ? this.input.log.entries : [];
    },

    getParentPage: function(file)
    {
        return HarModel.getParentPage(this.input, file);
    },

    importPage: function(page, entries)
    {
        var pageId = this.getUniquePageID(page.id);
        var prevPageId = page.id;
        page.id = pageId;

        this.input.log.pages.push(page);
        for (var i=0; i<entries.length; i++)
        {
            var entry = entries[i];
            if (entry.pageref == prevPageId)
            {
                entry.pageref = pageId;
                this.input.log.entries.push(entry);
            }
        }
    },

    getUniquePageID: function(defaultId)
    {
        var pages = this.input.log.pages;
        var hashTable = {};
        for (var i=0; i<pages.length; i++)
            hashTable[pages[i].id] = true;

        if (!hashTable[defaultId])
            return defaultId;

        var counter = 1;
        while (true)
        {
            var pageId = defaultId + counter;
            if (!hashTable[pageId])
                return pageId;
            counter++;
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // JSON

    toJSON : function(input)
    {
        if (!input)
            input = this.input;

        if (!input)
            return "";

        // xxxHonza: we don't have to iterate all entries again if it did already.
        var entries = this.input.log.entries;
        for (var i=0; i<entries.length; i++) {
            var entry = entries[i];
            if (entry.response.content.text)
                entry.response.content.toJSON = contentToUnicode;
        }

        var jsonString = $.jSONToString(this.input, null, "\t");
        var result = jsonString.replace(/\\\\u/g, "\\u");
        return result;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Statistics

    getSize: function(input)
    {
        if (!input)
            input = this.input;

        if (!input)
            return 0;

        var jsonString = dojo.toJson(input, true);
        return jsonString.length;
    }
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
// Static methods (no instance of the model, no |this| )

HarModel.parse = function(jsonString, validate)
{
    var input = jsonString;

    try
    {
        if (typeof(jsonString) === "string")
            input = $.parseJSON(jsonString);
    }
    catch (err)
    {
        console.exception("HarModel.parse; EXCEPTION", err);

        throw {
            errors: [{
                "message": "Failed to parse JSON",
                "property": "JSON evaluation"
            }]
        };
    }

    if (!validate)
        return input;

    //xxxHonza: the schema doesn't have to be resolved repeatedly.
    var resolvedSchema = Ref.resolveJson(HarSchema);
    var result = JSONSchema.validate(input, resolvedSchema.logType);
    if (result.valid)
    {
        this.validateRequestTimings(input);
        return input;
    }


    throw result;
};

// xxxHonza: optimalization using a map?
HarModel.getPageEntries = function(input, page)
{
    var result = [];

    var entries = input.log.entries;
    if (!entries)
        return result;

    for (var i=0; i<entries.length; i++)
    {
        var entry = entries[i];

        // Return all requests that doesn't have a parent page.
        if (!entry.pageref && !page)
            result.push(entry);

        // Return all requests for the specified page.
        if (page && entry.pageref == page.id)
            result.push(entry);
    }

    return result;
};

// xxxHonza: optimize using a map?
HarModel.getParentPage = function(input, file)
{
    var pages = input.log.pages;
    if (!pages)
        return null;

    for (var i=0; i<pages.length; i++)
    {
        if (pages[i].id == file.pageref)
            return pages[i];
    }

    return null;
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
// Validation

HarModel.validateRequestTimings = function(input)
{
    var errors = [];

    // Iterate all request timings and check the total time.
    var entries = input.log.entries;
    for (var i=0; i<entries.length; i++)
    {
        var entry = entries[i];
        var timings = entry.timings;

        /* http://code.google.com/p/chromium/issues/detail?id=339551
        var total = 0;
        for (var p in timings)
        {
            var time = parseInt(timings[p], 10);

            // According to the spec, the ssl time is alrady included in "connect".
            if (p != "ssl" && time > 0)
                total += time;
        }

        if (total != entry.time)
        {
            var message = Lib.formatString(Strings.validationSumTimeError,
                entry.request.url, entry.time, total, i, entry.pageref);

            errors.push({
                input: input,
                file: entry,
                "message": message,
                "property": Strings.validationType
            });
        }*/

        if (timings.blocked < -1 ||
            timings.connect < -1 ||
            timings.dns < -1 ||
            timings.receive < -1 ||
            timings.send < -1 ||
            timings.wait < -1)
        {
            var message = Lib.formatString(Strings.validationNegativeTimeError,
                entry.request.url, i, entry.pageref);

            errors.push({
                input: input,
                file: entry,
                "message": message,
                "property": Strings.validationType
            });
        }
    }

    if (errors.length)
        throw {errors: errors, input: input};
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

HarModel.Loader =
{
    run: function(callback, errorCallback)
    {
        var baseUrl = Lib.getURLParameter("baseUrl");

        // Append traling slahs if missing.
        if (baseUrl && baseUrl[baseUrl.length-1] != "/")
            baseUrl += "/";

        var paths = Lib.getURLParameters("path");
        var callbackName = Lib.getURLParameter("callback");
        var inputUrls = Lib.getURLParameters("inputUrl");

        //for (var p in inputUrls)
        //    inputUrls[p] = inputUrls[p].replace(/%/g,'%25');

        var urls = [];
        for (var p in paths)
            urls.push(baseUrl ? baseUrl + paths[p] : paths[p]);

        // Load input data (using JSONP) from remote location.
        // http://domain/har/viewer?inputUrl=<remote-file-url>&callback=<name-of-the-callback>
        for (var p in inputUrls)
            urls.push(inputUrls[p]);

        if ((baseUrl || inputUrls.length > 0) && urls.length > 0)
            return this.loadRemoteArchive(urls, callbackName, callback, errorCallback);

        // The URL can specify also a locale file (with the same domain).
        // http://domain/har/viewer?path=<local-file-path>
        var filePath = Lib.getURLParameter("path");
        if (filePath)
            return this.loadLocalArchive(filePath, callback, errorCallback);
    },

    loadExample: function(path, callback)
    {
        var href = document.location.href;
        var index = href.indexOf("?");
        document.location = href.substr(0, index) + "?path=" + path;

        // Show timeline and stats by default if an example is displayed.
        Cookies.setCookie("timeline", true);
        Cookies.setCookie("stats", true);
    },

    loadLocalArchive: function(filePath, callback, errorCallback)
    {
        // Execute XHR to get a local file (the same domain).
        $.ajax({
            url: filePath,
            context: this,

            success: function(response)
            {
                callback(response);
            },

            error: function(response, ioArgs)
            {
                errorCallback(response, ioArgs);
            }
        });

        return true;
    },

    loadRemoteArchive: function(urls, callbackName, callback, errorCallback)
    {
        if (!urls.length)
            return false;

        // Get the first URL in the queue.
        var url = urls.shift();

        if (!callbackName)
            callbackName = "onInputData";

        $.ajax({
            url: url,
            context: this,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: callbackName,

            success: function(response)
            {
                if (callback)
                    callback(response);

                // Asynchronously load other HAR files (jQuery doesn't like is synchronously).
                // The timeout specifies how much the browser UI cane be frozen.
                if (urls.length)
                {
                    var self = this;
                    setTimeout(function() {
                        self.loadRemoteArchive(urls, callbackName, callback, errorCallback);
                    }, 300);
                }
            },

            error: function(response, ioArgs)
            {
                if (errorCallback)
                    errorCallback(response, ioArgs);
            }
        });

        return true;
    },

    load: function(scope, url, crossDomain, callbackName, callback, errorCallback)
    {
        function onLoaded(input)
        {
            if (scope.appendPreview)
                scope.appendPreview(input);

            if (callback)
                callback.call(scope, input);
        }

        function onError(response, args)
        {
            if (scope.onLoadError)
                scope.onLoadError(response, args);

            if (errorCallback)
                errorCallback.call(scope, response, args);
        }

        if (crossDomain)
            return this.loadRemoteArchive([url], callbackName, onLoaded, onError);
        else
            return this.loadLocalArchive(url, onLoaded, onError);
    }
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// Make sure the response (it can be binary) is converted to Unicode.
function contentToUnicode()
{
    var newContent = {};
    for (var prop in this) {
        if (prop != "toJSON")
            newContent[prop] = this[prop];
    }

    if (!this.text)
        return newContent;

    newContent.text = Array.map(this.text, function(x) {
        var charCode = x.charCodeAt(0);
        if ((charCode >= 0x20 && charCode < 0x7F) ||
             charCode == 0xA || charCode == 0xD)
            return x.charAt(0);

        var unicode = charCode.toString(16).toUpperCase();
        while (unicode.length < 4)
            unicode = "0" + unicode;
        return "\\u" + unicode;
    }).join("");

    return newContent;
}

return HarModel;

//*************************************************************************************************
})
, {"filename":"../webapp/scripts/preview/harModel.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/preview/jsonSchema.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/jsonSchema.js"}
require.memoize("f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/jsonSchema.js", 
require.def("preview/jsonSchema", [], function() {

//*************************************************************************************************

/** 
 * JSONSchema Validator - Validates JavaScript objects using JSON Schemas 
 *	(http://www.json.com/json-schema-proposal/)
 *
 * Copyright (c) 2007 Kris Zyp SitePen (www.sitepen.com)
 * Licensed under the MIT (MIT-LICENSE.txt) license.
To use the validator call JSONSchema.validate with an instance object and an optional schema object.
If a schema is provided, it will be used to validate. If the instance object refers to a schema (self-validating), 
that schema will be used to validate and the schema parameter is not necessary (if both exist, 
both validations will occur). 
The validate method will return an array of validation errors. If there are no errors, then an 
empty list will be returned. A validation error will have two properties: 
"property" which indicates which property had the error
"message" which indicates what the error was
 */

var JSONSchema = {
	validate : function(/*Any*/instance,/*Object*/schema) {
		// Summary:
		//  	To use the validator call JSONSchema.validate with an instance object and an optional schema object.
		// 		If a schema is provided, it will be used to validate. If the instance object refers to a schema (self-validating), 
		// 		that schema will be used to validate and the schema parameter is not necessary (if both exist, 
		// 		both validations will occur). 
		// 		The validate method will return an object with two properties:
		// 			valid: A boolean indicating if the instance is valid by the schema
		// 			errors: An array of validation errors. If there are no errors, then an 
		// 					empty list will be returned. A validation error will have two properties: 
		// 						property: which indicates which property had the error
		// 						message: which indicates what the error was
		//
		return this._validate(instance,schema,false);
	},
	checkPropertyChange : function(/*Any*/value,/*Object*/schema, /*String*/ property) {
		// Summary:
		// 		The checkPropertyChange method will check to see if an value can legally be in property with the given schema
		// 		This is slightly different than the validate method in that it will fail if the schema is readonly and it will
		// 		not check for self-validation, it is assumed that the passed in value is already internally valid.  
		// 		The checkPropertyChange method will return the same object type as validate, see JSONSchema.validate for 
		// 		information.
		//
		return this._validate(value,schema, property || "property");
	},
	_validate : function(/*Any*/instance,/*Object*/schema,/*Boolean*/ _changing) {
	
	var errors = [];
		// validate a value against a property definition
	function checkProp(value, schema, path,i){
		var l;
		path += path ? typeof i == 'number' ? '[' + i + ']' : typeof i == 'undefined' ? '' : '.' + i : i;
		function addError(message){
			errors.push({property:path,message:message});
		}
		
		if((typeof schema != 'object' || schema instanceof Array) && (path || typeof schema != 'function')){
			if(typeof schema == 'function'){
				if(!(value instanceof schema)){
					addError("is not an instance of the class/constructor " + schema.name);
				}
			}else if(schema){
				addError("Invalid schema/property definition " + schema);
			}
			return null;
		}
		if(_changing && schema.readonly){
			addError("is a readonly field, it can not be changed");
		}
		if(schema['extends']){ // if it extends another schema, it must pass that schema as well
			checkProp(value,schema['extends'],path,i);
		}
		// validate a value against a type definition
		function checkType(type,value){
			if(type){
				if(typeof type == 'string' && type != 'any' && 
						(type == 'null' ? value !== null : typeof value != type) && 
						!(value instanceof Array && type == 'array') &&
						!(type == 'integer' && value%1===0)){
					return [{property:path,message:(typeof value) + " value found, but a " + type + " is required"}];
				}
				if(type instanceof Array){
					var unionErrors=[];
					for(var j = 0; j < type.length; j++){ // a union type 
						if(!(unionErrors=checkType(type[j],value)).length){
							break;
						}
					}
					if(unionErrors.length){
						return unionErrors;
					}
				}else if(typeof type == 'object'){
					var priorErrors = errors;
					errors = []; 
					checkProp(value,type,path);
					var theseErrors = errors;
					errors = priorErrors;
					return theseErrors; 
				} 
			}
			return [];
		}
		if(value === undefined){
			if(!schema.optional){  
				addError("is missing and it is not optional");
			}
		}else{
			errors = errors.concat(checkType(schema.type,value));
			if(schema.disallow && !checkType(schema.disallow,value).length){
				addError(" disallowed value was matched");
			}
			if(value !== null){
				if(value instanceof Array){
					if(schema.items){
						if(schema.items instanceof Array){
							for(i=0,l=value.length; i<l; i++){
								errors.concat(checkProp(value[i],schema.items[i],path,i));
							}
						}else{
							for(i=0,l=value.length; i<l; i++){
								errors.concat(checkProp(value[i],schema.items,path,i));
							}
						}							
					}
					if(schema.minItems && value.length < schema.minItems){
						addError("There must be a minimum of " + schema.minItems + " in the array");
					}
					if(schema.maxItems && value.length > schema.maxItems){
						addError("There must be a maximum of " + schema.maxItems + " in the array");
					}
				}else if(schema.properties){
					errors.concat(checkObj(value,schema.properties,path,schema.additionalProperties));
				}
				if(schema.pattern && typeof value == 'string' && !value.match(schema.pattern)){
					addError("does not match the regex pattern " + schema.pattern);
				}
				if(schema.maxLength && typeof value == 'string' && value.length > schema.maxLength){
					addError("may only be " + schema.maxLength + " characters long");
				}
				if(schema.minLength && typeof value == 'string' && value.length < schema.minLength){
					addError("must be at least " + schema.minLength + " characters long");
				}
				if(typeof schema.minimum !== undefined && typeof value == typeof schema.minimum && 
						schema.minimum > value){
					addError("must have a minimum value of " + schema.minimum);
				}
				if(typeof schema.maximum !== undefined && typeof value == typeof schema.maximum && 
						schema.maximum < value){
					addError("must have a maximum value of " + schema.maximum);
				}
				if(schema['enum']){
					var enumer = schema['enum'];
					l = enumer.length;
					var found;
					for(var j = 0; j < l; j++){
						if(enumer[j]===value){
							found=1;
							break;
						}
					}
					if(!found){
						addError("does not have a value in the enumeration " + enumer.join(", "));
					}
				}
				if(typeof schema.maxDecimal == 'number' && 
					(value.toString().match(new RegExp("\\.[0-9]{" + (schema.maxDecimal + 1) + ",}")))){
					addError("may only have " + schema.maxDecimal + " digits of decimal places");
				}
			}
		}
		return null;
	}
	// validate an object against a schema
	function checkObj(instance,objTypeDef,path,additionalProp){
	
		if(typeof objTypeDef =='object'){
			if(typeof instance != 'object' || instance instanceof Array){
				errors.push({property:path,message:"an object is required"});
			}
			
			for(var i in objTypeDef){ 
				if(objTypeDef.hasOwnProperty(i) && !(i.charAt(0) == '_' && i.charAt(1) == '_')){
					var value = instance[i];
					var propDef = objTypeDef[i];
					checkProp(value,propDef,path,i);
				}
			}
		}
		for(i in instance){
			if(instance.hasOwnProperty(i) && !(i.charAt(0) == '_' && i.charAt(1) == '_') && objTypeDef && !objTypeDef[i] && additionalProp===false){
				errors.push({property:path,message:(typeof value) + "The property " + i +
						" is not defined in the schema and the schema does not allow additional properties"});
			}
			var requires = objTypeDef && objTypeDef[i] && objTypeDef[i].requires;
			if(requires && !(requires in instance)){
				errors.push({property:path,message:"the presence of the property " + i + " requires that " + requires + " also be present"});
			}
			value = instance[i];
			if(objTypeDef && typeof objTypeDef == 'object' && !(i in objTypeDef)){
				checkProp(value,additionalProp,path,i); 
			}
			if(!_changing && value && value.$schema){
				errors = errors.concat(checkProp(value,value.$schema,path,i));
			}
		}
		return errors;
	}
	if(schema){
		checkProp(instance,schema,'',_changing || '');
	}
	if(!_changing && instance && instance.$schema){
		checkProp(instance,instance.$schema,'','');
	}
	return {valid:!errors.length,errors:errors};
	}
	/* will add this later
	newFromSchema : function() {
	}
*/
}

return JSONSchema;

//*************************************************************************************************
})
, {"filename":"../webapp/scripts/preview/jsonSchema.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/preview/ref.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/ref.js"}
require.memoize("f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/ref.js", 
/* This file comes from DOJO (adapted for requirejs): dojox/json/ref.js */

require.def("preview/ref", [
    "core/lib"
],

function(Lib) {

//*************************************************************************************************

// summary:
// Adds advanced JSON {de}serialization capabilities to the base json library.
// This enhances the capabilities of dojo.toJson and dojo.fromJson,
// adding referencing support, date handling, and other extra format handling.
// On parsing, references are resolved. When references are made to
// ids/objects that have been loaded yet, the loader function will be set to
// _loadObject to denote a lazy loading (not loaded yet) object. 

var ref =
{
	resolveJson: function(/*Object*/ root,/*Object?*/ args){
		// summary:
		// 		Indexes and resolves references in the JSON object.
		// description:
		// 		A JSON Schema object that can be used to advise the handling of the JSON (defining ids, date properties, urls, etc)
		//
		// root:
		//		The root object of the object graph to be processed
		// args:
		//		Object with additional arguments:
		//
		// The *index* parameter.
		//		This is the index object (map) to use to store an index of all the objects. 
		// 		If you are using inter-message referencing, you must provide the same object for each call.
		// The *defaultId* parameter.
		//		This is the default id to use for the root object (if it doesn't define it's own id)
		//	The *idPrefix* parameter.
		//		This the prefix to use for the ids as they enter the index. This allows multiple tables 
		// 		to use ids (that might otherwise collide) that enter the same global index. 
		// 		idPrefix should be in the form "/Service/".  For example,
		//		if the idPrefix is "/Table/", and object is encountered {id:"4",...}, this would go in the
		//		index as "/Table/4".
		//	The *idAttribute* parameter.
		//		This indicates what property is the identity property. This defaults to "id"
		//	The *assignAbsoluteIds* parameter.
		//		This indicates that the resolveJson should assign absolute ids (__id) as the objects are being parsed.
		//  
		// The *schemas* parameter
		//		This provides a map of schemas, from which prototypes can be retrieved
		// The *loader* parameter
		//		This is a function that is called added to the reference objects that can't be resolved (lazy objects)
		// return:
		//		An object, the result of the processing
		args = args || {};
		var idAttribute = args.idAttribute || 'id';
		var prefix = args.idPrefix || ''; 
		var assignAbsoluteIds = args.assignAbsoluteIds;
		var index = args.index || {}; // create an index if one doesn't exist
		var timeStamps = args.timeStamps;
		var ref,reWalk=[];
		var pathResolveRegex = /^(.*\/)?(\w+:\/\/)|[^\/\.]+\/\.\.\/|^.*\/(\/)/;
		var addProp = this._addProp;
		var F = function(){};
		function walk(it, stop, defaultId, schema, defaultObject){
			// this walks the new graph, resolving references and making other changes
		 	var update, val, id = idAttribute in it ? it[idAttribute] : defaultId;
		 	if(id !== undefined){
		 		id = (prefix + id).replace(pathResolveRegex,'$2$3');
		 	}
		 	var target = defaultObject || it;
			if(id !== undefined){ // if there is an id available...
				if(assignAbsoluteIds){
					it.__id = id;
				}
				if(args.schemas && (!(it instanceof Array)) && // won't try on arrays to do prototypes, plus it messes with queries 
		 					(val = id.match(/^(.+\/)[^\.\[]*$/))){ // if it has a direct table id (no paths)
		 			schema = args.schemas[val[1]];
				} 
				// if the id already exists in the system, we should use the existing object, and just 
				// update it... as long as the object is compatible
				if(index[id] && ((it instanceof Array) == (index[id] instanceof Array))){ 
					target = index[id];
					delete target.$ref; // remove this artifact
					update = true;
				}else{
				 	var proto = schema && schema.prototype; // and if has a prototype
					if(proto){
						// if the schema defines a prototype, that needs to be the prototype of the object
						F.prototype = proto;
						target = new F();
					}
				}
				index[id] = target; // add the prefix, set _id, and index it
				if(timeStamps){
					timeStamps[id] = args.time;
				}
			}
			var properties = schema && schema.properties; 
			var length = it.length;
			for(var i in it){
				if(i==length){
					break;		
				}
				if(it.hasOwnProperty(i)){
					val=it[i];
					var propertyDefinition = properties && properties[i];
					if(propertyDefinition && propertyDefinition.format == 'date-time' && typeof val == 'string'){
						val = Lib.fromISOString(val);
					}else if((typeof val =='object') && val && !(val instanceof Date)){
						ref=val.$ref;
						if(ref){ // a reference was found
							// make sure it is a safe reference
							delete it[i];// remove the property so it doesn't resolve to itself in the case of id.propertyName lazy values
							var path = ref.replace(/(#)([^\.\[])/,'$1.$2').match(/(^([^\[]*\/)?[^#\.\[]*)#?([\.\[].*)?/); // divide along the path
							if((ref = (path[1]=='$' || path[1]=='this' || path[1]=='') ? root : index[(prefix + path[1]).replace(pathResolveRegex,'$2$3')])){  // a $ indicates to start with the root, otherwise start with an id
								// if there is a path, we will iterate through the path references
								if(path[3]){
									path[3].replace(/(\[([^\]]+)\])|(\.?([^\.\[]+))/g,function(t,a,b,c,d){
										ref = ref && ref[b ? b.replace(/[\"\'\\]/,'') : d];
									});
								}
							}
							if(ref){
								// otherwise, no starting point was found (id not found), if stop is set, it does not exist, we have
								// unloaded reference, if stop is not set, it may be in a part of the graph not walked yet,
								// we will wait for the second loop
								val = ref;
							}else{
								if(!stop){
									var rewalking;
									if(!rewalking){
										reWalk.push(target); // we need to rewalk it to resolve references
									}
									rewalking = true; // we only want to add it once
								}else{
									val = walk(val, false, val.$ref, propertyDefinition);
									// create a lazy loaded object
									val._loadObject = args.loader;
								}
							}
						}else{
							if(!stop){ // if we are in stop, that means we are in the second loop, and we only need to check this current one,
								// further walking may lead down circular loops
								val = walk(
									val,
									reWalk==it,
									id && addProp(id, i), // the default id to use
									propertyDefinition, 
									// if we have an existing object child, we want to 
									// maintain it's identity, so we pass it as the default object
									target != it && typeof target[i] == 'object' && target[i] 
								);
							}
						}
					}
					it[i] = val;
					if(target!=it && !target.__isDirty){// do updates if we are updating an existing object and it's not dirty				
						var old = target[i];
						target[i] = val; // only update if it changed
						if(update && val !== old && // see if it is different 
								!target._loadObject && // no updates if we are just lazy loading 
								!(val instanceof Date && old instanceof Date && val.getTime() == old.getTime()) && // make sure it isn't an identical date
								!(typeof val == 'function' && typeof old == 'function' && val.toString() == old.toString()) && // make sure it isn't an indentical function
								index.onUpdate){
							index.onUpdate(target,i,old,val); // call the listener for each update
						}
					}
				}
			}
	
			if(update){
				// this means we are updating, we need to remove deleted
				for(i in target){
					if(!target.__isDirty && target.hasOwnProperty(i) && !it.hasOwnProperty(i) && i != '__id' && i != '__clientId' && !(target instanceof Array && isNaN(i))){
						if(index.onUpdate && i != "_loadObject" && i != "_idAttr"){
							index.onUpdate(target,i,target[i],undefined); // call the listener for each update
						}
						delete target[i];
						while(target instanceof Array && target.length && target[target.length-1] === undefined){
							// shorten the target if necessary
							target.length--;
						}
					}
				}
			}else{
				if(index.onLoad){
					index.onLoad(target);
				}
			}
			return target;
		}
		if(root && typeof root == 'object'){
			root = walk(root,false,args.defaultId); // do the main walk through
			walk(reWalk,false); // re walk any parts that were not able to resolve references on the first round
		}
		return root;
	},
	
	_addProp: function(id, prop){
		return id + (id.match(/#/) ? id.length == 1 ? '' : '.' : '#') + prop;
	}
}

return ref;

//*************************************************************************************************
})
, {"filename":"../webapp/scripts/preview/ref.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/preview/harSchema.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/harSchema.js"}
require.memoize("f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/harSchema.js", 
/* See license.txt for terms of usage */

require.def("preview/harSchema", [], function() {

// ************************************************************************************************
// HAR Schema Definition

// Date time fields use ISO8601 (YYYY-MM-DDThh:mm:ss.sTZD, e.g. 2009-07-24T19:20:30.45+01:00)
var dateTimePattern = /^(\d{4})(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;

/**
 * Root HTML Archive type.
 */
var logType = {
    "logType": {
        "id": "logType",
        "description": "HTTP Archive structure.",
        "type": "object",
        "properties": {
            "log": {
                "type": "object",
                "properties": {
                    "version": {"type": "string"},
                    "creator": {"$ref": "creatorType"},
                    "browser": {"$ref": "browserType"},
                    "pages": {"type": "array", "optional": true, "items": {"$ref": "pageType"}},
                    "entries": {"type": "array", "items": {"$ref": "entryType"}},
                    "comment": {"type": "string", "optional": true}
                }
            }
        }
    }
};

var creatorType = {
    "creatorType": {
        "id": "creatorType",
        "description": "Name and version info of the log creator app.",
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "version": {"type": "string"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var browserType = {
    "browserType": {
        "id": "browserType",
        "description": "Name and version info of used browser.",
        "type": "object",
        "optional": true,
        "properties": {
            "name": {"type": "string"},
            "version": {"type": "string"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var pageType = {
    "pageType": {
        "id": "pageType",
        "description": "Exported web page",
        "optional": true,
        "properties": {
            "startedDateTime": {"type": "string", "format": "date-time", "pattern": dateTimePattern},
            "id": {"type": "string", "unique": true},
            "title": {"type": "string"},
            "pageTimings": {"$ref": "pageTimingsType"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var pageTimingsType = {
    "pageTimingsType": {
        "id": "pageTimingsType",
        "description": "Timing info about page load",
        "properties": {
            "onContentLoad": {"type": "number", "optional": true, "min": -1},
            "onLoad": {"type": "number", "optional": true, "min": -1},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var entryType = {
    "entryType": {
        "id": "entryType",
        "description": "Request and Response related info",
        "optional": true,
        "properties": {
            "pageref": {"type": "string", "optional": true},
            "startedDateTime": {"type": "string", "format": "date-time", "pattern": dateTimePattern},
            "time": {"type": "number", "min": 0},
            "request" : {"$ref": "requestType"},
            "response" : {"$ref": "responseType"},
            "cache" : {"$ref": "cacheType"},
            "timings" : {"$ref": "timingsType"},
            "serverIPAddress" : {"type": "string", "optional": true},
            "connection" : {"type": "string", "optional": true},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var requestType = {
    "requestType": {
        "id": "requestType",
        "description": "Monitored request",
        "properties": {
            "method": {"type": "string"},
            "url": {"type": "string"},
            "httpVersion": {"type" : "string"},
            "cookies" : {"type": "array", "items": {"$ref": "cookieType"}},
            "headers" : {"type": "array", "items": {"$ref": "recordType"}},
            "queryString" : {"type": "array", "items": {"$ref": "recordType"}},
            "postData" : {"$ref": "postDataType"},
            "headersSize" : {"type": "integer"},
            "bodySize" : {"type": "integer"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var recordType = {
    "recordType": {
        "id": "recordType",
        "description": "Helper name-value pair structure.",
        "properties": {
            "name": {"type": "string"},
            "value": {"type": "string"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var responseType = {
    "responseType": {
        "id": "responseType",
        "description": "Monitored Response.",
        "properties": {
            "status": {"type": "integer"},
            "statusText": {"type": "string"},
            "httpVersion": {"type": "string"},
            "cookies" : {"type": "array", "items": {"$ref": "cookieType"}},
            "headers" : {"type": "array", "items": {"$ref": "recordType"}},
            "content" : {"$ref": "contentType"},
            "redirectURL" : {"type": "string"},
            "headersSize" : {"type": "integer"},
            "bodySize" : {"type": "integer"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var cookieType = {
    "cookieType": {
        "id": "cookieType",
        "description": "Cookie description.",
        "properties": {
            "name": {"type": "string"},
            "value": {"type": "string"},
            "path": {"type": "string", "optional": true},
            "domain" : {"type": "string", "optional": true},
            "expires" : {"type": "string", "optional": true},
            "httpOnly" : {"type": "boolean", "optional": true},
            "secure" : {"type": "boolean", "optional": true},
            "comment": {"type": "string", "optional": true}
        }
    }
}

var postDataType = {
    "postDataType": {
        "id": "postDataType",
        "description": "Posted data info.",
        "optional": true,
        "properties": {
            "mimeType": {"type": "string"},
            "text": {"type": "string", "optional": true},
            "params": {
                "type": "array",
                "optional": true,
                "properties": {
                    "name": {"type": "string"},
                    "value": {"type": "string", "optional": true},
                    "fileName": {"type": "string", "optional": true},
                    "contentType": {"type": "string", "optional": true},
                    "comment": {"type": "string", "optional": true}
                }
            },
            "comment": {"type": "string", "optional": true}
        }
    }
};

var contentType = {
    "contentType": {
        "id": "contentType",
        "description": "Response content",
        "properties": {
            "size": {"type": "integer"},
            "compression": {"type": "integer", "optional": true},
            "mimeType": {"type": "string"},
            "text": {"type": "string", "optional": true},
            "encoding": {"type": "string", "optional": true},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var cacheType = {
    "cacheType": {
        "id": "cacheType",
        "description": "Info about a response coming from the cache.",
        "properties": {
            "beforeRequest": {"$ref": "cacheEntryType"},
            "afterRequest": {"$ref": "cacheEntryType"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var cacheEntryType = {
    "cacheEntryType": {
        "id": "cacheEntryType",
        "optional": true,
        "description": "Info about cache entry.",
        "properties": {
            "expires": {"type": "string", optional: "true"},
            "lastAccess": {"type": "string"},
            "eTag": {"type": "string"},
            "hitCount": {"type": "integer"},
            "comment": {"type": "string", "optional": true}
        }
    }
};

var timingsType = {
    "timingsType": {
        "id": "timingsType",
        "description": "Info about request-response timing.",
        "properties": {
            "dns": {"type": "number", "optional": true, "min": -1},
            "connect": {"type": "number", "optional": true, "min": -1},
            "blocked": {"type": "number", "optional": true, "min": -1},
            "send": {"type": "number", "min": -1},
            "wait": {"type": "number", "min": -1},
            "receive": {"type": "number", "min": -1},
            "ssl": {"type": "number", "optional": true, "min": -1},
            "comment": {"type": "string", "optional": true}
        }
    }
};

// ************************************************************************************************
// Helper schema object

function Schema() {}
Schema.prototype =
{
    registerType: function()
    {
        var doIt = function(my, obj){
            for (var name in obj) {
                if (obj.hasOwnProperty(name) && name != "prototype") {
                    my[name] = obj[name];
                }
            }
        }
        var that = this;
        for(i=0; i < arguments.length; i +=1) {
            doIt(that, arguments[i]);
        };
    }
};

// ************************************************************************************************
// Registration

// Register all defined types into the final schema object.
var schema = new Schema();
schema.registerType(
    logType,
    creatorType,
    browserType,
    pageType,
    pageTimingsType,
    entryType,
    requestType,
    recordType,
    responseType,
    postDataType,
    contentType,
    cacheType,
    cacheEntryType,
    timingsType
);

// ************************************************************************************************

return schema;

// ************************************************************************************************
})
, {"filename":"../webapp/scripts/preview/harSchema.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/nls/harModel.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/harModel.js"}
require.memoize("69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/harModel.js", 
/* See license.txt for terms of usage */

define(
{
    "root": {
        "validationType": "HAR Validation",
        "validationSumTimeError": "Sum of request timings doesn't correspond to the total value: " +
            "%S (request.time: %S vs. sum: %S), request#: %S, parent page: %S",
        "validationNegativeTimeError": "Negative time is not allowed: " +
            "%S, request#: %S, parent page: %S"
    }
})
, {"filename":"../webapp/scripts/nls/harModel.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/jquery-plugins/jquery.json.js","mtime":1420423937,"wrapper":"amd","format":"amd","id":"a3b2c147b43b15fb1276a0ace35b2d7e9b82e952-jquery-plugins/jquery.json"}
require.memoize("a3b2c147b43b15fb1276a0ace35b2d7e9b82e952-jquery-plugins/jquery.json", 
/*
    based on
    http://www.JSON.org/json2.js
    2008-11-19
    
    jQuery plugin info:
    @author  Jim Dalton (jim.dalton@furrybrains.com)
    @date    1/15/2009
    @version 1.0
    
    Comments below were modified to reflect usage in the context of jQuery. Otherwise
    these comments are identical to the source library.

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: jQuery.jSONToString
    and jQuery.toJSON.

        jQuery.jSONToString(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.
            
            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the object holding the key.

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = jQuery.jSONToString(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = jQuery.jSONToString(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = jQuery.jSONToString([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        jQuery.toJSON(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = jQuery.toJSON(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = jQuery.toJSON('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

define([
    "jquery/jquery"
], function (jQuery) {

;(function($) {
    if (!JSON) {
        var JSON = {};
    }
    (function () {

        function f(n) {
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        if (typeof Date.prototype.toJSON !== 'function') {

            Date.prototype.toJSON = function (key) {

                return this.getUTCFullYear()   + '-' +
                     f(this.getUTCMonth() + 1) + '-' +
                     f(this.getUTCDate())      + 'T' +
                     f(this.getUTCHours())     + ':' +
                     f(this.getUTCMinutes())   + ':' +
                     f(this.getUTCSeconds())   + 'Z';
            };

            String.prototype.toJSON =
            Number.prototype.toJSON =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
        }

        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap,
            indent,
            meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
            },
            rep;


        function quote(string) {

    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.

            escapable.lastIndex = 0;
            return escapable.test(string) ?
                '"' + string.replace(escapable, function (a) {
                    var c = meta[a];
                    return typeof c === 'string' ? c :
                        '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                }) + '"' :
                '"' + string + '"';
        }


        function str(key, holder) {

    // Produce a string from holder[key].

            var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];

    // If the value has a toJSON method, call it to obtain a replacement value.

            if (value && typeof value === 'object' &&
                    typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.

            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }

    // What happens next depends on the value's type.

            switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

    // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

    // If the value is a boolean or null, convert it to a string. Note:
    // typeof null does not produce 'null'. The case is included here in
    // the remote chance that this gets fixed someday.

                return String(value);

    // If the type is 'object', we might be dealing with an object or an array or
    // null.

            case 'object':

    // Due to a specification blunder in ECMAScript, typeof null is 'object',
    // so watch out for that case.

                if (!value) {
                    return 'null';
                }

    // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

    // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

    // The value is an array. Stringify every element. Use null as a placeholder
    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

    // Join all of the elements together, separated with commas, and wrap them in
    // brackets.

                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                                partial.join(',\n' + gap) + '\n' +
                                    mind + ']' :
                              '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

    // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

    // Join all of the member texts together, separated with commas,
    // and wrap them in braces.

                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                            mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
            }
        }

    // If the JSON object does not yet have a stringify method, give it one.

        if (typeof JSON.stringify !== 'function') {
            JSON.stringify = function (value, replacer, space) {

    // The stringify method takes a value and an optional replacer, and an optional
    // space parameter, and returns a JSON text. The replacer can be a function
    // that can replace values, or an array of strings that will select the keys.
    // A default replacer method can be provided. Use of the space parameter can
    // produce text that is more easily readable.

                var i;
                gap = '';
                indent = '';

    // If the space parameter is a number, make an indent string containing that
    // many spaces.

                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }

    // If the space parameter is a string, it will be used as the indent string.

                } else if (typeof space === 'string') {
                    indent = space;
                }

    // If there is a replacer, it must be a function or an array.
    // Otherwise, throw an error.

                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                         typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }

    // Make a fake root object containing our value under the key of ''.
    // Return the result of stringifying the value.

                return str('', {'': value});
            };
        }


    // If the JSON object does not yet have a parse method, give it one.

        if (typeof JSON.parse !== 'function') {
            JSON.parse = function (text, reviver) {

    // The parse method takes a text and an optional reviver function, and returns
    // a JavaScript value if the text is a valid JSON text.

                var j;

                function walk(holder, key) {

    // The walk method is used to recursively walk the resulting structure so
    // that modifications can be made.

                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }


    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.

                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }

    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with '()' and 'new'
    // because they can cause invocation, and '=' because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.

    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
    // replace all simple value tokens with ']' characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or ']' or
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

                if (/^[\],:{}\s]*$/.
    test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    // In the third stage we use the eval function to compile the text into a
    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
    // in JavaScript: it can begin a block or an object literal. We wrap the text
    // in parens to eliminate the ambiguity.

                    j = eval('(' + text + ')');

    // In the optional fourth stage, we recursively walk the new structure, passing
    // each name/value pair to a reviver function for possible transformation.

                    return typeof reviver === 'function' ?
                        walk({'': j}, '') : j;
                }

    // If the text is not JSON parseable, then a SyntaxError is thrown.

                throw new SyntaxError('JSON.parse');
            };
        }
    })();
    $.toJSON = function(text, reviver) {
        if (typeof reviver == "undefined") {
            reviver = null;
        }
        return JSON.parse(text, reviver);
    };
    $.jSONToString = function(value, replacer, space) {
        if (typeof replacer == "undefined") {
            replacer = null;
        }
        if (typeof space == "undefined") {
            space = null;
        }
        return JSON.stringify(value, replacer, space);
    };
    
})(jQuery);

})
, {"filename":"../webapp/scripts/jquery-plugins/jquery.json.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/tabs/aboutTab.js","mtime":1420521580,"wrapper":"amd","format":"amd","id":"9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/aboutTab.js"}
require.memoize("9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/aboutTab.js", 
/* See license.txt for terms of usage */

require.def("tabs/aboutTab", [
    "jquery/jquery",
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/harViewer",
    "require"
],

function($, Domplate, TabView, Lib, Strings, require) { with (Domplate) {
//*************************************************************************************************
// Home Tab

function AboutTab() {}
AboutTab.prototype =
{
    id: "About",
    label: Strings.aboutTabLabel,

    tabHeaderTag:
        A({"class": "$tab.id\\Tab tab", view: "$tab.id", _repObject: "$tab"},
            "$tab.label",
            SPAN("&nbsp;"),
            SPAN({"class": "version"},
                "$tab.tabView.version"
            )
        ),

    bodyTag:
        DIV({"class": "aboutBody"}),

    onUpdateBody: function(tabView, body)
    {
        var self = this;
        body = this.bodyTag.replace({}, body);
        require(["text!tabs/aboutTab.html"], function(html)
        {
            html = html.replace("@VERSION@", tabView.version, "g");
            html = html.replace("@HAR_SPEC_URL@", tabView.harSpecURL, "g");
            body.innerHTML = html;

            $(".linkSchema").click(Lib.bind(self.onSchema, self));
        });
    },

    onSchema: function()
    {
        this.tabView.selectTabByName("Schema");
    }
};

return AboutTab;

//*************************************************************************************************
}})
, {"filename":"../webapp/scripts/tabs/aboutTab.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/nls/harViewer.js","mtime":1421119638,"wrapper":"amd","format":"amd","id":"69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/harViewer.js"}
require.memoize("69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/harViewer.js", 
/* See license.txt for terms of usage */

define(
{
    "root": {
        "aboutTabLabel": "About",
        "schemaTabLabel": "Schema",
        "embedTabLabel": "Embed"
    }
})
, {"filename":"../webapp/scripts/nls/harViewer.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/tabs/previewTab.js","mtime":1421118591,"wrapper":"amd","format":"amd","id":"9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/previewTab.js"}
require.memoize("9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/previewTab.js", 
/* See license.txt for terms of usage */

require.def("tabs/previewTab", [
    "jquery/jquery",
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/previewTab",
    "domplate/toolbar",
    "tabs/pageTimeline",
    "tabs/pageStats",
    "preview/pageList",
    "core/cookies",
    "preview/validationError",
    "downloadify/js/swfobject",
    "downloadify/src/downloadify"
],

function($, Domplate, TabView, Lib, Strings, Toolbar, Timeline, Stats, PageList, Cookies,
    ValidationError) {

with (Domplate) {

//*************************************************************************************************
// Home Tab

function PreviewTab(model)
{
    this.model = model;

    this.toolbar = new Toolbar();
    this.timeline = new Timeline();
    this.stats = new Stats(model, this.timeline);

    // Initialize toolbar.
    this.toolbar.addButtons(this.getToolbarButtons());

    // Context menu listener.
    ValidationError.addListener(this);
}

PreviewTab.prototype = Lib.extend(TabView.Tab.prototype,
{
    id: "Preview",
    label: Strings.previewTabLabel,

    // Use tabBodyTag so, the basic content layout is rendered immediately
    // and not as soon as the tab is actually selected. This is useful when
    // new data are appended while the tab hasn't been selected yet.
    tabBodyTag:
        DIV({"class": "tab$tab.id\\Body tabBody", _repObject: "$tab"},
            DIV({"class": "previewToolbar"}),
            DIV({"class": "previewTimeline"}),
            DIV({"class": "previewStats"}),
            DIV({"class": "previewList"})
        ),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Tab

    onUpdateBody: function(tabView, body)
    {
        // Render all UI components except of the page list. The page list is rendered
        // as soon as HAR data are loaded into the page.
        this.toolbar.render(Lib.$(body, "previewToolbar"));
        this.stats.render(Lib.$(body, "previewStats"));
        this.timeline.render(Lib.$(body, "previewTimeline"));

        // Show timeline & stats by default if the cookie says so (no animation)
        // But there should be an input.
        var input = this.model.input;
        if (input && Cookies.getCookie("timeline") == "true")
            this.onTimeline(false);

        if (input && Cookies.getCookie("stats") == "true")
            this.onStats(false);

        this.updateDownloadifyButton();
    },

    updateDownloadifyButton: function()
    {
        // Create download button (using Downloadify)
        var model = this.model;
        $(".harDownloadButton").downloadify(
        {
            filename: function() {
                return "netData.har";
            },
            data: function() {
                return model ? model.toJSON() : "";
            },
            onComplete: function() {},
            onCancel: function() {},
            onError: function() {
                alert(Strings.downloadError);
            },
            swf: "scripts/downloadify/media/downloadify.swf",
            downloadImage: "css/images/download-sprites.png",
            width: 16,
            height: 16,
            transparent: true,
            append: false
        });
    },

    getToolbarButtons: function()
    {
        var buttons = [
            {
                id: "showTimeline",
                label: Strings.showTimelineButton,
                tooltiptext: Strings.showTimelineTooltip,
                command: Lib.bindFixed(this.onTimeline, this, true)
            },
            {
                id: "showStats",
                label: Strings.showStatsButton,
                tooltiptext: Strings.showStatsTooltip,
                command: Lib.bindFixed(this.onStats, this, true)
            },
            {
                id: "clear",
                label: Strings.clearButton,
                tooltiptext: Strings.clearTooltip,
                command: Lib.bindFixed(this.onClear, this)
            }
        ];

        if ($.browser.mozilla)
        {
            buttons.push({
                id: "download",
                tooltiptext: Strings.downloadTooltip,
                className: "harDownloadButton"
            });
        }

        return buttons;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Toolbar commands

    onTimeline: function(animation)
    {
        // Update showTimeline button label.
        var button = this.toolbar.getButton("showTimeline");
        if (!button)
            return;

        this.timeline.toggle(animation);

        var visible = this.timeline.isVisible();
        button.label = Strings[visible ? "hideTimelineButton" : "showTimelineButton"];

        // Re-render toolbar to update label.
        this.toolbar.render();
        this.updateDownloadifyButton();

        Cookies.setCookie("timeline", visible);
    },

    onStats: function(animation)
    {
        // Update showStats button label.
        var button = this.toolbar.getButton("showStats");
        if (!button)
            return;

        this.stats.toggle(animation);

        var visible = this.stats.isVisible();
        button.label = Strings[visible ? "hideStatsButton" : "showStatsButton"];

        // Re-render toolbar to update label.
        this.toolbar.render();
        this.updateDownloadifyButton();

        Cookies.setCookie("stats", visible);
    },

    onClear: function()
    {
        var href = document.location.href;
        var index = href.indexOf("?");
        document.location = href.substr(0, index);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Public

    showStats: function(show)
    {
        Cookies.setCookie("stats", show);
    },

    showTimeline: function(show)
    {
        Cookies.setCookie("timeline", show);
    },

    append: function(input)
    {
        // The page list is responsible for rendering expandable list of pages and requests.
        // xxxHonza: There should probable be a list of all pageLists. Inside the pageList?
        var pageList = new PageList(input);
        pageList.append(Lib.$(this._body, "previewList"));

        // Append new pages into the timeline.
        this.timeline.append(input);

        // Register context menu listener (provids additional commands for the context menu).
        pageList.addListener(this);
    },

    appendError: function(err)
    {
        ValidationError.appendError(err, Lib.$(this._body, "previewList"));
    },

    addPageTiming: function(timing)
    {
        PageList.prototype.pageTimings.push(timing);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Request List Commands

    getMenuItems: function(items, input, file)
    {
        if (!file)
            return;

        items.push("-");
        items.push(
        {
            label: Strings.menuShowHARSource,
            command: Lib.bind(this.showHARSource, this, input, file)
        });
    },

    showHARSource: function(menu, input, file)
    {
        var domTab = this.tabView.getTab("DOM");
        if (!domTab)
            return;

        domTab.select("DOM");
        domTab.highlightFile(input, file);
    }
});

//*************************************************************************************************

return PreviewTab;

//*************************************************************************************************
}})
, {"filename":"../webapp/scripts/tabs/previewTab.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/nls/previewTab.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/previewTab.js"}
require.memoize("69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/previewTab.js", 
/* See license.txt for terms of usage */

define(
{
    "root": {
        "previewTabLabel": "Preview",
        "showTimelineButton": "Show Page Timeline",
        "hideTimelineButton": "Hide Page Timeline",
        "showTimelineTooltip": "Show/hide statistic preview for selected pages in the timeline.",
        "showStatsButton": "Show Statistics",
        "hideStatsButton": "Hide Statistics",
        "showStatsTooltip": "Show/hide page timeline.",
        "clearButton": "Clear",
        "clearTooltip": "Remove all HAR logs from the viewer",
        "downloadTooltip": "Download all current data in one HAR file.",
        "downloadError": "Failed to save HAR data",
        "menuShowHARSource": "Show HAR Source"
    }
})
, {"filename":"../webapp/scripts/nls/previewTab.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/domplate/toolbar.js","mtime":1420493090,"wrapper":"amd","format":"amd","id":"bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/toolbar.js"}
require.memoize("bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/toolbar.js", 
/* See license.txt for terms of usage */

require.def("domplate/toolbar", [
    "jquery/jquery",
    "domplate/domplate",
    "core/lib",
    "core/trace",
    "domplate/popupMenu"
],

function($, Domplate, Lib, Trace, Menu) { with (Domplate) {

//*************************************************************************************************

/**
 * @domplate Represents a toolbar widget.
 */
var ToolbarTempl = domplate(
/** @lends ToolbarTempl */
{
    tag:
        DIV({"class": "toolbar", onclick: "$onClick"}),

    buttonTag:
        SPAN({"class": "$button|getClassName toolbarButton", title: "$button.tooltiptext",
            $text: "$button|hasLabel", onclick: "$button|getCommand"},
            "$button|getLabel"
        ),

    dropDownTag:
        SPAN({"class": "$button|getClassName toolbarButton dropDown",
            _repObject: "$button",
            title: "$button.tooltiptext",
            $text: "$button|hasLabel", onclick: "$onDropDown"},
            "$button|getLabel",
            SPAN({"class": "arrow"})
        ),

    separatorTag:
        SPAN({"class": "toolbarSeparator", style: "color: gray;"}, "|"),

    hasLabel: function(button)
    {
        return button.label ? true : false;
    },

    getLabel: function(button)
    {
        return button.label ? button.label : "";
    },

    getClassName: function(button)
    {
        return button.className ? button.className : "";
    },

    getCommand: function(button)
    {
        return button.command ? button.command : function() {};
    },

    onClick: function(event)
    {
        var e = $.event.fix(event || window.event);

        // Cancel button clicks so they are not propagated further.
        Lib.cancelEvent(e);
    },

    onDropDown: function(event)
    {
        var e = $.event.fix(event || window.event);

        var target = e.target;
        var button = Lib.getAncestorByClass(target, "toolbarButton");
        var items = button.repObject.items;

        var menu = new Menu({id: "toolbarContextMenu", items: items});
        menu.showPopup(button);
    }
});

// ********************************************************************************************* //

/**
 * Toolbat widget.
 */
function Toolbar()
{
    this.buttons = [];
}

Toolbar.prototype =
/** @lends Toolbar */
{
    addButton: function(button)
    {
        if (!button.tooltiptext)
            tooltiptext = "";
        this.buttons.push(button);
    },

    removeButton: function(buttonId)
    {
        for (var i=0; i<this.buttons.length; i++)
        {
            if (this.buttons[i].id == buttonId)
            {
                this.buttons.splice(i, 1);
                break;
            }
        }
    },

    addButtons: function(buttons)
    {
        for (var i=0; i<buttons.length; i++)
            this.addButton(buttons[i]);
    },

    getButton: function(buttonId)
    {
        for (var i=0; i<this.buttons.length; i++)
        {
            if (this.buttons[i].id == buttonId)
                return this.buttons[i];
        }
    },

    render: function(parentNode)
    {
        // Don't render if there are no buttons. Note that buttons can be removed
        // as part of viewer customization.
        if (!this.buttons.length)
            return;

        // Use the same parent as before if just re-rendering.
        if (this.element)
            parentNode = this.element.parentNode;

        this.element = ToolbarTempl.tag.replace({}, parentNode);
        for (var i=0; i<this.buttons.length; i++)
        {
            var button = this.buttons[i];
            var defaultTag = button.items ? ToolbarTempl.dropDownTag : ToolbarTempl.buttonTag;
            var tag = button.tag ? button.tag : defaultTag;

            var element = tag.append({button: button}, this.element);

            if (button.initialize)
                button.initialize(element);

            if (i<this.buttons.length-1)
                ToolbarTempl.separatorTag.append({}, this.element);
        }

        return this.element;
    }
};

return Toolbar;

// ************************************************************************************************
}})
, {"filename":"../webapp/scripts/domplate/toolbar.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/domplate/popupMenu.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/popupMenu.js"}
require.memoize("bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/popupMenu.js", 
/* See license.txt for terms of usage */

require.def("domplate/popupMenu", [
    "domplate/domplate",
    "core/lib",
    "core/trace"
],

function(Domplate, Lib, Trace) { with (Domplate) {

// ************************************************************************************************
// Controller

var Controller =
{
    controllers: [],
    controllerContext: {label: "controller context"},

    initialize: function(context)
    {
        this.controllers = [];
        this.controllerContext = context || this.controllerContext;
    },

    shutdown: function()
    {
        this.removeControllers();
    },

    addController: function()
    {
        for (var i=0, arg; arg=arguments[i]; i++)
        {
            // If the first argument is a string, make a selector query 
            // within the controller node context
            if (typeof arg[0] == "string")
            {
                arg[0] = $$(arg[0], this.controllerContext);
            }

            // bind the handler to the proper context
            var handler = arg[2];
            arg[2] = Lib.bind(handler, this);
            // save the original handler as an extra-argument, so we can
            // look for it later, when removing a particular controller
            arg[3] = handler;

            this.controllers.push(arg);
            Lib.addEventListener.apply(this, arg);
        }
    },

    removeController: function()
    {
        for (var i=0, arg; arg=arguments[i]; i++)
        {
            for (var j=0, c; c=this.controllers[j]; j++)
            {
                if (arg[0] == c[0] && arg[1] == c[1] && arg[2] == c[3])
                    Lib.removeEventListener.apply(this, c);
            }
        }
    },

    removeControllers: function()
    {
        for (var i=0, c; c=this.controllers[i]; i++)
        {
            Lib.removeEventListener.apply(this, c);
        }
    }
};

//***********************************************************************************************//
// Menu

var menuItemProps = {
    "class": "$item.className",
    type: "$item.type",
    value: "$item.value",
    _command: "$item.command"
};

if (Lib.isIE6)
    menuItemProps.href = "javascript:void(0)";

var MenuPlate = domplate(
{
    tag:
        DIV({"class": "popupMenu popupMenuShadow"},
            DIV({"class": "popupMenuContent popupMenuShadowContent"},
                FOR("item", "$object.items|memberIterator",
                    TAG("$item.tag", {item: "$item"})
                )
            )
        ),

    itemTag:
        A(menuItemProps,
            "$item.label"
        ),

    checkBoxTag:
        A(Lib.extend(menuItemProps, {checked : "$item.checked"}),
            "$item.label"
        ),

    radioButtonTag:
        A(Lib.extend(menuItemProps, {selected : "$item.selected"}),
            "$item.label"
        ),

    groupTag:
        A(Lib.extend(menuItemProps, {child: "$item.child"}),
            "$item.label"
        ),

    shortcutTag:
        A(menuItemProps,
            "$item.label",
            SPAN({"class": "popupMenuShortcutKey"},
                "$item.key"
            )
        ),

    separatorTag:
        SPAN({"class": "popupMenuSeparator"}),

    memberIterator: function(items)
    {
        var result = [];
        for (var i=0, length=items.length; i<length; i++)
        {
            var item = items[i];

            // separator representation
            if (typeof item == "string" && item.indexOf("-") == 0)
            {
                result.push({tag: this.separatorTag});
                continue;
            }

            item = Lib.extend(item, {});
            item.type = item.type || "";
            item.value = item.value || "";

            var type = item.type;

            // default item representation
            item.tag = this.itemTag;

            var className = item.className || "";
            className += "popupMenuOption ";

            // specific representations
            if (type == "checkbox")
            {
                className += "popupMenuCheckBox ";
                item.tag = this.checkBoxTag;
            }
            else if (type == "radio")
            {
                className += "popupMenuRadioButton ";
                item.tag = this.radioButtonTag;
            }
            else if (type == "group")
            {
                className += "popupMenuGroup ";
                item.tag = this.groupTag;
            }
            else if (type == "shortcut")
            {
                className += "popupMenuShortcut ";
                item.tag = this.shortcutTag;
            }

            if (item.checked)
                className += "popupMenuChecked ";
            else if (item.selected)
                className += "popupMenuRadioSelected ";

            if (item.disabled)
                className += "popupMenuDisabled ";

            item.className = className;
            item.label = item.label;
            result.push(item);
        }

        return result;
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function Menu(options)
{
    // if element is not pre-rendered, we must render it now
    if (!options.element)
    {
        if (options.getItems)
            options.items = options.getItems();

        // Trim separators
        if (options.items[0] == "-")
            options.items.shift();
        if (options.items[options.items.length - 1] == "-")
            options.items.pop();

        var body = Lib.getBody(document);
        options.element = MenuPlate.tag.append({object: options}, body, MenuPlate);
    }

    // extend itself with the provided options
    Lib.append(this, options);

    if (typeof this.element == "string")
    {
        this.id = this.element;
        this.element = $(this.id);
    }
    else if (this.id)
    {
        this.element.id = this.id;
    }

    this.elementStyle = this.element.style;
    this.isVisible = false;

    this.handleMouseDown = Lib.bind(this.handleMouseDown, this);
    this.handleMouseOver = Lib.bind(this.handleMouseOver, this);
    this.handleMouseOut = Lib.bind(this.handleMouseOut, this);
    this.handleWindowMouseDown = Lib.bind(this.handleWindowMouseDown, this);
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

var menuMap = {};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

Menu.prototype = Lib.extend(Controller,
{
    initialize: function()
    {
        Controller.initialize.call(this);

        this.addController(
            [this.element, "mousedown", this.handleMouseDown],
            [this.element, "mouseover", this.handleMouseOver]
        );
    },

    destroy: function()
    {
        this.hide();

        // if it is a childMenu, remove its reference from the parentMenu
        if (this.parentMenu)
            this.parentMenu.childMenu = null;

        // remove the element from the document
        this.element.parentNode.removeChild(this.element);

        // clear references
        this.element = null;
        this.elementStyle = null;
        this.parentMenu = null;
        this.parentTarget = null;
    },

    shutdown: function()
    {
        Controller.shutdown.call(this);
    },

    showPopup: function(target)
    {
        var offsetLeft = Lib.isIE6 ? 1 : -4;  // IE6 problem with fixed position
        var box = Lib.getElementBox(target);
        var offset = {top: 0, left: 0};

        this.show(
            box.left + offsetLeft - offset.left,
            box.top + box.height - 5 - offset.top
        );
    },

    show: function(x, y)
    {
        this.initialize();

        if (this.isVisible)
            return;

        x = x || 0;
        y = y || 0;

        if (this.parentMenu)
        {
            var oldChildMenu = this.parentMenu.childMenu;
            if (oldChildMenu && oldChildMenu != this)
            {
                oldChildMenu.destroy();
            }

            this.parentMenu.childMenu = this;
        }
        else
        {
            Lib.addEventListener(document, "mousedown", this.handleWindowMouseDown);
        }

        this.elementStyle.display = "block";
        this.elementStyle.visibility = "hidden";

        var size = Lib.getWindowSize();

        x = Math.min(x, size.width - this.element.clientWidth - 10);
        x = Math.max(x, 0);

        y = Math.min(y, size.height - this.element.clientHeight - 10);
        y = Math.max(y, 0);

        this.elementStyle.left = x + "px";
        this.elementStyle.top = y + "px";
        this.elementStyle.visibility = "visible";
        this.isVisible = true;

        if (Lib.isFunction(this.onShow))
            this.onShow.apply(this, arguments);
    },

    hide: function()
    {
        this.clearHideTimeout();
        this.clearShowChildTimeout();

        if (!this.isVisible)
            return;

        this.elementStyle.display = "none";

        if (this.childMenu)
        {
            this.childMenu.destroy();
            this.childMenu = null;
        }

        if (this.parentTarget)
            Lib.removeClass(this.parentTarget, "popupMenuGroupSelected");

        this.isVisible = false;
        this.shutdown();

        if (Lib.isFunction(this.onHide))
            this.onHide.apply(this, arguments);
    },

    showChildMenu: function(target)
    {
        var id = target.getAttribute("child");
        var parent = this;
        var target = target;

        this.showChildTimeout = window.setTimeout(function()
        {
            //if (!parent.isVisible) return;
            var box = Lib.getElementBox(target);
            var childMenuObject = menuMap.hasOwnProperty(id) ? menuMap[id] : {element: $(id)};

            var childMenu = new Menu(Lib.extend(childMenuObject,
            {
                parentMenu: parent,
                parentTarget: target
            }));

            var offsetLeft = Lib.isIE6 ? -1 : -6; // IE6 problem with fixed position
            childMenu.show(box.left + box.width + offsetLeft, box.top -6);
            Lib.setClass(target, "popupMenuGroupSelected");
        },350);
    },

    clearHideTimeout: function()
    {
        if (this.hideTimeout)
        {
            window.clearTimeout(this.hideTimeout);
            delete this.hideTimeout;
        }
    },

    clearShowChildTimeout: function()
    {
        if(this.showChildTimeout)
        {
            window.clearTimeout(this.showChildTimeout);
            this.showChildTimeout = null;
        }
    },

    handleMouseDown: function(event)
    {
        Lib.cancelEvent(event, true);

        var topParent = this;
        while (topParent.parentMenu)
            topParent = topParent.parentMenu;

        var target = event.target || event.srcElement;

        target = Lib.getAncestorByClass(target, "popupMenuOption");

        if(!target || Lib.hasClass(target, "popupMenuGroup"))
            return false;

        if (target && !Lib.hasClass(target, "popupMenuDisabled"))
        {
            var type = target.getAttribute("type");
            
            if (type == "checkbox")
            {
                var checked = target.getAttribute("checked");
                var value = target.getAttribute("value");
                var wasChecked = Lib.hasClass(target, "popupMenuChecked");

                if (wasChecked)
                {
                    Lib.removeClass(target, "popupMenuChecked");
                    target.setAttribute("checked", "");
                }
                else
                {
                    Lib.setClass(target, "popupMenuChecked");
                    target.setAttribute("checked", "true");
                }

                if (Lib.isFunction(this.onCheck))
                    this.onCheck.call(this, target, value, !wasChecked)
            }

            if (type == "radiobutton")
            {
                var selectedRadios = Lib.getElementsByClass(target.parentNode, "popupMenuRadioSelected");
                var group = target.getAttribute("group");

                for (var i = 0, length = selectedRadios.length; i < length; i++)
                {
                    radio = selectedRadios[i];

                    if (radio.getAttribute("group") == group)
                    {
                        Lib.removeClass(radio, "popupMenuRadioSelected");
                        radio.setAttribute("selected", "");
                    }
                }

                Lib.setClass(target, "popupMenuRadioSelected");
                target.setAttribute("selected", "true");
            }

            var handler = null;

            // target.command can be a function or a string. 
            var cmd = target.command;

            // If it is a function it will be used as the handler
            // If it is a string, tha handler is the property of the current menu object 
            // will be used as the handler
            if (Lib.isFunction(cmd))
                handler = cmd;
            else if (typeof cmd == "string")
                handler = this[cmd];

            var closeMenu = true;
            if (handler)
                closeMenu = handler.call(this, target) !== false;

            if (closeMenu)
                topParent.hide();
        }

        return false;
    },

    handleWindowMouseDown: function(event)
    {
        var target = event.target || event.srcElement;
        target = Lib.getAncestorByClass(target, "popupMenu");
        if (!target)
        {
            Lib.removeEventListener(document, "mousedown", this.handleWindowMouseDown);
            this.destroy();
        }
    },

    handleMouseOver: function(event)
    {
        this.clearHideTimeout();
        this.clearShowChildTimeout();

        var target = event.target || event.srcElement;

        target = Lib.getAncestorByClass(target, "popupMenuOption");

        if (!target)
            return;

        var childMenu = this.childMenu;
        if (childMenu) 
        {
            Lib.removeClass(childMenu.parentTarget, "popupMenuGroupSelected");
            
            if (childMenu.parentTarget != target && childMenu.isVisible)
            {
                childMenu.clearHideTimeout(); 
                childMenu.hideTimeout = window.setTimeout(function(){
                    childMenu.destroy();
                },300);
            }
        }

        if (Lib.hasClass(target, "popupMenuGroup"))
        {
            this.showChildMenu(target);
        }
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Lib.append(Menu,
{
    register: function(object)
    {
        menuMap[object.id] = object;
    },

    check: function(element)
    {
        Lib.setClass(element, "popupMenuChecked");
        element.setAttribute("checked", "true");
    },

    uncheck: function(element)
    {
        Lib.removeClass(element, "popupMenuChecked");
        element.setAttribute("checked", "");
    },

    disable: function(element)
    {
        Lib.setClass(element, "popupMenuDisabled");
    },

    enable: function(element)
    {
        Lib.removeClass(element, "popupMenuDisabled");
    }
});

// **********************************************************************************************//

return Menu;

// **********************************************************************************************//
}})
, {"filename":"../webapp/scripts/domplate/popupMenu.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/tabs/pageTimeline.js","mtime":1420493078,"wrapper":"amd","format":"amd","id":"9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/pageTimeline.js"}
require.memoize("9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/pageTimeline.js", 
/* See license.txt for terms of usage */

require.def("tabs/pageTimeline", [
    "jquery/jquery",
    "domplate/domplate",
    "core/lib",
    "core/trace",
    "i18n!nls/pageTimeline",
    "preview/harModel"
],

function($, Domplate, Lib, Trace, Strings, HarModel) { with (Domplate) {

//*************************************************************************************************
// Timeline

/**
 * Represents a list of pages displayed as a list of vertical graphs. this object
 * is implemented as a template so, it can render itself.
 */
function Timeline()
{
    this.listeners = [];
    this.element = null;
    this.maxElapsedTime = -1;

    // List of all selected bars.
    this.lastSelectedBar = null;
}

Timeline.prototype = domplate(
{
    graphCols:
        FOR("page", "$input|getPages",
            TD({"class": "pageTimelineCol"},
                DIV({"class": "pageBar", _input: "$input", _page: "$page",
                    title: Strings.pageBarTooltip,
                    style: "height: $page|getHeight\\px",
                    onmousemove: "$onMouseMove",
                    onclick: "$onClick"})
            )
        ),

    pageGraph:
        TABLE({"class": "pageTimelineTable", cellpadding: 0, cellspacing: 0},
            TBODY(
                TR({"class": "pageTimelineRow"},
                    TAG("$graphCols", {input: "$input"})
                )
            )
        ),

    tag:
        DIV({"class": "pageTimelineBody", style: "height: auto; display: none"},
            TABLE({style: "margin: 7px;", cellpadding: 0, cellspacing: 0},
                TBODY(
                    TR(
                        TD(
                            TAG("$pageGraph", {input: "$input"})
                        )
                    ),
                    TR(
                        TD({"class": "pageDescContainer", colspan: 2})
                    )
                )
            )
        ),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    getHeight: function(page)
    {
        var height = 1;
        var onLoad = page.pageTimings.onLoad;
        if (onLoad > 0 && this.maxElapsedTime > 0)
            height = Math.round((onLoad / this.maxElapsedTime) * 100);

        return Math.max(1, height);
    },

    onClick: function(event)
    {
        var e = Lib.fixEvent(event);

        var bar = e.target;
        if (!Lib.hasClass(bar, "pageBar"))
            return;

        var control = Lib.isControlClick(e);
        var shift = Lib.isShiftClick(e);

        var row = Lib.getAncestorByClass(bar, "pageTimelineRow");

        // If no modifier is active remove the current selection.
        if (!control && !shift)
            Selection.unselectAll(row, bar);

        // Clicked bar toggles its selection state
        Selection.toggle(bar);

        this.selectionChanged();
    },

    onMouseMove: function(event)
    {
        var e = Lib.fixEvent(event);

        // If the mouse moves over a bar, update a description displayed below and
        // notify all registered listeners.
        var bar = e.target;
        if (!Lib.hasClass(bar, "pageBar"))
            return;

        if (this.highlightedPage == bar.page)
            return;

        this.highlightedPage = bar.page;

        var parentNode = Lib.getElementByClass(this.element, "pageDescContainer");
        Timeline.Desc.render(parentNode, bar);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    getPages: function(input)
    {
        return input.log.pages ? input.log.pages : [];
    },

    getPageBar: function(page)
    {
        if (!this.element)
            return;

        // Iterate over all columns and find the one that represents the page.
        var table = Lib.getElementByClass(this.element, "pageTimelineTable");
        var col = table.firstChild.firstChild.firstChild;
        while (col)
        {
            if (col.firstChild.page == page)
                return col.firstChild;
            col = col.nextSibling;
        }
    },

    recalcLayout: function()
    {
        this.maxElapsedTime = 0;
        var prevMaxElapsedTime = this.maxElapsedTime; 

        // Iterate over all pages and find the max load-time so, the vertical
        // graph extent can be set.
        var bars = Lib.getElementsByClass(this.element, "pageBar");
        for (var i=0; i<bars.length; i++)
        {
            var page = bars[i].page;
            var onLoadTime = page.pageTimings.onLoad;
            if (onLoadTime > 0 && this.maxElapsedTime < onLoadTime)
                this.maxElapsedTime = onLoadTime;
        }

        // Recalculate height of all pages only if there is a new maximum.
        if (prevMaxElapsedTime != this.maxElapsedTime)
        {
            for (var i=0; i<bars.length; i++)
                bars[i].style.height = this.getHeight(bars[i].page) + "px";
        } 
    },

    updateDesc: function()
    {
        if (!this.isVisible())
            return;

        // Make sure the description (tooltip) is displayed for the first
        // page automatically.
        if (!this.highlightedPage)
        {
            var firstBar = Lib.getElementByClass(this.element, "pageBar");
            if (firstBar)
                Lib.fireEvent(firstBar, "mousemove");
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Listeners

    addListener: function(listener)
    {
        this.listeners.push(listener);
    },

    removeListener: function(listener)
    {
        remove(this.listeners, listener);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Selection

    selectionChanged: function()
    {
        // Notify listeners such as the statistics preview
        var pages = this.getSelection();
        Lib.dispatch(this.listeners, "onSelectionChange", [pages]);
    },

    removeSelection: function()
    {
        if (!this.element)
            return;

        var row = Lib.getElementByClass(this.element, "pageTimelineRow");
        Selection.unselectAll(row);

        this.selectionChanged();
    },

    getSelection: function()
    {
        if (!this.isVisible())
            return [];

        var row = Lib.getElementByClass(this.element, "pageTimelineRow");
        return Selection.getSelection(row);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Public

    show: function(animation)
    {
        if (this.isVisible())
            return;

        if (!animation || $.browser.msie)
            this.element.style.display = "block";
        else
            $(this.element).slideDown();

        Lib.setClass(this.element, "opened");
        this.updateDesc();
    },

    hide: function(animation)
    {
        if (!this.isVisible())
            return;

        if (!animation || $.browser.msie)
            this.element.style.display = "none";
        else
            $(this.element).slideUp();

        Lib.removeClass(this.element, "opened");

        // Remove all selecteed page and so, the stats can update.
        this.removeSelection();
    },

    isVisible: function()
    {
        return Lib.hasClass(this.element, "opened");
    },

    toggle: function(animation)
    {
        if (this.isVisible())
            this.hide(animation);
        else
            this.show(animation);
    },

    render: function(parentNode)
    {
        // Render basic structure. Some pages could be rendered now, but let's
        // do it in the append method.
        this.element = this.tag.replace({input: {log: {pages: []}}}, parentNode, this);
        this.recalcLayout();
        return this.element;
    },

    append: function(input, parentNode)
    {
        // If it's not rendered yet, bail out.
        if (!this.element)
            return;

        // Otherwise just append a new columns to the existing graph.
        var timelineRow = Lib.getElementByClass(this.element, "pageTimelineRow");
        this.graphCols.insertCols({input: input}, timelineRow, this);

        this.recalcLayout();
        this.updateDesc();
    }
});

//*************************************************************************************************
// Timeline Description

Timeline.Desc = domplate(
{
    tag:
        DIV({"class": "pageDescBox"},
            DIV({"class": "connector"}),
            DIV({"class": "desc"},
                SPAN({"class": "summary"}, "$object|getSummary"),
                SPAN({"class": "time"}, "$object.page|getTime"),
                SPAN({"class": "title"}, "$object.page|getTitle"),
                PRE({"class": "comment"}, "$object.page|getComment")
            )
        ),

    getSummary: function(object)
    {
        var summary = "";
        var onLoad = object.page.pageTimings.onLoad;
        if (onLoad > 0)
            summary += Strings.pageLoad + ": " + Lib.formatTime(onLoad) + ", ";

        var requests = HarModel.getPageEntries(object.input, object.page);
        var count = requests.length;
        summary += count + " " + (count == 1 ? Strings.request : Strings.requests);

        return summary;
    },

    getTime: function(page)
    {
        var pageStart = Lib.parseISO8601(page.startedDateTime);
        var date = new Date(pageStart);
        return date.toLocaleString();
    },

    getTitle: function(page)
    {
        return page.title;
    },

    getComment: function(page)
    {
        return page.comment ? page.comment : "";
    },

    render: function(parentNode, bar)
    {
        var object = {
            input: bar.input,
            page: bar.page
        };

        var element = this.tag.replace({object: object}, parentNode);
        var conn = Lib.$(element, "connector");
        conn.style.marginLeft = bar.parentNode.offsetLeft + "px";
        return element;
    }
});

//*************************************************************************************************

var Selection =
{
    isSelected: function(bar)
    {
        return Lib.hasClass(bar, "selected");
    },

    toggle: function(bar)
    {
        Lib.toggleClass(bar, "selected");
    },

    select: function(bar)
    {
        if (!this.isSelected(bar))
            Lib.setClass(bar, "selected");
    },

    unselect: function(bar)
    {
        if (this.isSelected(bar))
            Lib.removeClass(bar, "selected");
    },

    getSelection: function(row)
    {
        var pages = [];
        var bars = Lib.getElementsByClass(row, "pageBar");
        for (var i=0; i<bars.length; i++)
        {
            var bar = bars[i];
            if (this.isSelected(bar))
                pages.push(bar.page);
        }
        return pages;
    },

    unselectAll: function(row, except)
    {
        var bars = Lib.getElementsByClass(row, "pageBar");
        for (var i=0; i<bars.length; i++)
        {
            if (except != bars[i])
                this.unselect(bars[i]);
        }
    }
}

//*************************************************************************************************

return Timeline;

//*************************************************************************************************
}})
, {"filename":"../webapp/scripts/tabs/pageTimeline.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/nls/pageTimeline.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/pageTimeline.js"}
require.memoize("69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/pageTimeline.js", 
/* See license.txt for terms of usage */

define(
{
    "root": {
        "pageLoad": "Page Load",
        "request": "Request",
        "requests": "Requests",
        "pageBarTooltip": "Click to select and include in statistics preview."
    }
})
, {"filename":"../webapp/scripts/nls/pageTimeline.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/tabs/pageStats.js","mtime":1420493143,"wrapper":"amd","format":"amd","id":"9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/pageStats.js"}
require.memoize("9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/pageStats.js", 
/* See license.txt for terms of usage */

require.def("tabs/pageStats", [
    "jquery/jquery",
    "domplate/domplate",
    "core/lib",
    "i18n!nls/pageStats",
    "preview/harSchema",
    "preview/harModel",
    "core/cookies",
    "domplate/infoTip",
    "core/trace"
],

function($, Domplate, Lib, Strings, HarSchema, HarModel, Cookies, InfoTip, Trace) { with (Domplate) {

//*************************************************************************************************
// Page Load Statistics

function Pie() {}
Pie.prototype =
{
    data: [],
    title: "",

    getLabelTooltipText: function(item)
    {
        return item.label + ": " + Lib.formatSize(item.value);
    },

    cleanUp: function()
    {
        for (var i=0; i<this.data.length; i++)
        {
            this.data[i].value = 0;
            this.data[i].count = 0;
        }
    }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function TimingPie() {};
TimingPie.prototype = Lib.extend(Pie.prototype,
{
    title: "Summary of request times.",

    data: [
        {value: 0, label: Strings.pieLabelBlocked, color: "rgb(228, 214, 193)"},
        {value: 0, label: Strings.pieLabelDNS,     color: "rgb(119, 192, 203)"},
        {value: 0, label: Strings.pieLabelSSL,     color: "rgb(168, 196, 173)"},
        {value: 0, label: Strings.pieLabelConnect, color: "rgb(179, 222, 93)"},
        {value: 0, label: Strings.pieLabelSend,    color: "rgb(224, 171, 157)"},
        {value: 0, label: Strings.pieLabelWait,    color: "rgb(163, 150, 190)"},
        {value: 0, label: Strings.pieLabelReceive, color: "rgb(194, 194, 194)"}
    ],

    getLabelTooltipText: function(item)
    {
        return item.label + ": " + Lib.formatTime(item.value);
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function ContentPie() {};
ContentPie.prototype = Lib.extend(Pie.prototype,
{
    title: "Summary of content types.",

    data: [
        {value: 0, label: Strings.pieLabelHTMLText, color: "rgb(174, 234, 218)"},
        {value: 0, label: Strings.pieLabelJavaScript, color: "rgb(245, 230, 186)"},
        {value: 0, label: Strings.pieLabelCSS, color: "rgb(212, 204, 219)"},
        {value: 0, label: Strings.pieLabelImage, color: "rgb(220, 171, 181)"},
        {value: 0, label: Strings.pieLabelFlash, color: "rgb(166, 156, 222)"},
        {value: 0, label: Strings.pieLabelOthers, color: "rgb(229, 171, 255)"}
    ],

    getLabelTooltipText: function(item)
    {
        return item.count + "x" + " " + item.label + ": " + Lib.formatSize(item.value);
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function TrafficPie() {};
TrafficPie.prototype = Lib.extend(Pie.prototype,
{
    title: "Summary of sent and received bodies & headers.",

    data: [
        {value: 0, label: Strings.pieLabelHeadersSent, color: "rgb(247, 179, 227)"},
        {value: 0, label: Strings.pieLabelBodiesSent, color: "rgb(226, 160, 241)"},
        {value: 0, label: Strings.pieLabelHeadersReceived, color: "rgb(166, 232, 166)"},
        {value: 0, label: Strings.pieLabelBodiesReceived, color: "rgb(168, 196, 173)"}
    ]
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function CachePie() {};
CachePie.prototype = Lib.extend(Pie.prototype,
{
    title: "Comparison of downloaded data from the server and browser cache.",

    data: [
        {value: 0, label: Strings.pieLabelDownloaded, color: "rgb(182, 182, 182)"},
        {value: 0, label: Strings.pieLabelPartial, color: "rgb(218, 218, 218)"},
        {value: 0, label: Strings.pieLabelFromCache, color: "rgb(239, 239, 239)"}
    ],

    getLabelTooltipText: function(item)
    {
        return item.count + "x" + " " + item.label + ": " + Lib.formatSize(item.value);
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var timingPie = new TimingPie();
var contentPie = new ContentPie();
var trafficPie = new TrafficPie();
var cachePie = new CachePie();

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var jsTypes = {
    "text/javascript": 1,
    "text/jscript": 1,
    "application/javascript": 1,
    "application/x-javascript": 1,
    "text/js": 1
}

var htmlTypes = {
    "text/plain": 1,
    "text/html": 1
}

var cssTypes = {
    "text/css": 1
}

var imageTypes = {
    "image/png": 1,
    "image/jpeg": 1,
    "image/gif": 1
}

var flashTypes = {
    "application/x-shockwave-flash": 1
}

var jsonTypes = {
    "text/x-json": 1,
    "text/x-js": 1,
    "application/json": 1,
    "application/x-js": 1
}

var xmlTypes = {
    "application/xml": 1,
    "application/xhtml+xml": 1,
    "application/vnd.mozilla.xul+xml": 1,
    "text/xml": 1,
    "text/xul": 1,
    "application/rdf+xml": 1
}

var unknownTypes = {
    "text/xsl": 1,
    "text/sgml": 1,
    "text/rtf": 1,
    "text/x-setext": 1,
    "text/richtext": 1,
    "text/tab-separated-values": 1,
    "text/rdf": 1,
    "text/xif": 1,
    "text/ecmascript": 1,
    "text/vnd.curl": 1,
    "text/vbscript": 1,
    "view-source": 1,
    "view-fragment": 1,
    "application/x-httpd-php": 1,
    "application/ecmascript": 1,
    "application/http-index-format": 1
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function Stats(model, timeline)
{
    this.model = model;
    this.timeline = timeline;
    this.timeline.addListener(this);
}

/**
 * @domplate Template for statistics section (pie graphs)
 */
Stats.prototype = domplate(
/** @lends Stats */
{
    element: null,

    tag:
        DIV({"class": "pageStatsBody", style: "height: auto; display: none"}),

    update: function(pages)
    {
        if (!this.isVisible())
            return;

        this.cleanUp();

        // Get schema type for timings.
        var phases = HarSchema.timingsType.properties;

        // If there is no selection, display stats for all pages/files.
        if (!pages.length)
            pages.push(null);

        // Iterate over all selected pages
        for (var j=0; j<pages.length; j++)
        {
            var page = pages[j];

            // Iterate over all requests and compute stats.
            var entries = page? this.model.getPageEntries(page) : this.model.getAllEntries();
            for (var i=0; i<entries.length; i++)
            {
                var entry = entries[i];
                if (!entry.timings)
                    continue;

                // Get timing info (SSL is new in HAR 1.2)
                timingPie.data[0].value += entry.timings.blocked;
                timingPie.data[1].value += entry.timings.dns;
                timingPie.data[2].value += entry.timings.ssl > 0 ? entry.timings.ssl : 0;
                timingPie.data[3].value += entry.timings.connect;
                timingPie.data[4].value += entry.timings.send;
                timingPie.data[5].value += entry.timings.wait;
                timingPie.data[6].value += entry.timings.receive;

                // The ssl time is also included in the connect field, see HAR 1.2 spec
                // (to ensure backward compatibility with HAR 1.1).
                if (entry.timings.ssl > 0)
                    timingPie.data[3].value -= entry.timings.ssl;

                var response = entry.response;
                var resBodySize = response.bodySize > 0 ? response.bodySize : 0;

                // Get Content type info. Make sure we read the right content type
                // even if there is also a charset specified.
                var mimeType = response.content.mimeType;
                var contentType = mimeType ? mimeType.match(/^([^;]+)/)[1] : null;
                var mimeType = contentType ? contentType : response.content.mimeType;

                // Collect response sizes according to the mimeType.
                if (htmlTypes[mimeType]) {
                    contentPie.data[0].value += resBodySize;
                    contentPie.data[0].count++;
                }
                else if (jsTypes[mimeType]) {
                    contentPie.data[1].value += resBodySize;
                    contentPie.data[1].count++;
                }
                else if (cssTypes[mimeType]) {
                    contentPie.data[2].value += resBodySize;
                    contentPie.data[2].count++;
                }
                else if (imageTypes[mimeType]) {
                    contentPie.data[3].value += resBodySize;
                    contentPie.data[3].count++;
                }
                else if (flashTypes[mimeType]) {
                    contentPie.data[4].value += resBodySize;
                    contentPie.data[4].count++;
                }
                else {
                    contentPie.data[5].value += resBodySize;
                    contentPie.data[5].count++;
                }

                // Get traffic info
                trafficPie.data[0].value += entry.request.headersSize > 0 ? entry.request.headersSize : 0;
                trafficPie.data[1].value += entry.request.bodySize > 0 ? entry.request.bodySize : 0;
                trafficPie.data[2].value += entry.response.headersSize > 0 ? entry.response.headersSize : 0;
                trafficPie.data[3].value += resBodySize;

                // Get Cache info
                if (entry.response.status == 206) { // Partial content
                    cachePie.data[1].value += resBodySize;
                    cachePie.data[1].count++;
                }
                else if (entry.response.status == 304) { // From cache
                    cachePie.data[2].value += resBodySize;
                    cachePie.data[2].count++;
                }
                else if (resBodySize > 0){ // Downloaded
                    cachePie.data[0].value += resBodySize;
                    cachePie.data[0].count++;
                }
            }
        }

        // Draw all graphs.
        Pie.draw(Lib.$(this.timingPie, "pieGraph"), timingPie);
        Pie.draw(Lib.$(this.contentPie, "pieGraph"), contentPie);
        Pie.draw(Lib.$(this.trafficPie, "pieGraph"), trafficPie);
        Pie.draw(Lib.$(this.cachePie, "pieGraph"), cachePie);
    },

    cleanUp: function()
    {
        timingPie.cleanUp();
        contentPie.cleanUp();
        trafficPie.cleanUp();
        cachePie.cleanUp();
    },

    showInfoTip: function(infoTip, target, x, y)
    {
        return Pie.showInfoTip(infoTip, target, x, y);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Timeline Listener

    onSelectionChange: function(pages)
    {
        this.update(pages);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Public

    show: function(animation)
    {
        if (this.isVisible())
            return;

        InfoTip.addListener(this);
        Lib.setClass(this.element, "opened");

        if (!animation || $.browser.msie)
            this.element.style.display = "block";
        else
            $(this.element).slideDown();

        var pages = this.timeline.getSelection();
        this.update(pages);
    },

    hide: function(animation)
    {
        if (!this.isVisible())
            return;

        InfoTip.removeListener(this);
        Lib.removeClass(this.element, "opened");

        if (!animation || $.browser.msie)
            this.element.style.display = "none";
        else
            $(this.element).slideUp();
    },

    isVisible: function()
    {
        return Lib.hasClass(this.element, "opened");
    },

    toggle: function(animation)
    {
        if (this.isVisible())
            this.hide(animation);
        else
            this.show(animation);
    },

    render: function(parentNode)
    {
        this.element = this.tag.replace({}, parentNode);

        // Generate HTML for pie graphs.
        this.timingPie = Pie.render(timingPie, this.element);
        this.contentPie = Pie.render(contentPie, this.element);
        this.trafficPie = Pie.render(trafficPie, this.element);
        this.cachePie = Pie.render(cachePie, this.element);

        // This graph is the last one so remove the separator right border
        this.cachePie.style.borderRight = 0;

        return this.element;
    }
});

//*************************************************************************************************

var Pie = domplate(
{
    tag:
        TABLE({"class": "pagePieTable", cellpadding: 0, cellspacing: 0,
            _repObject: "$pie"},
            TBODY(
                TR(
                    TD({"class": "pieBox", title: "$pie.title"}),
                    TD(
                        FOR("item", "$pie.data",
                            DIV({"class": "pieLabel", _repObject: "$item"},
                                SPAN({"class": "box", style: "background-color: $item.color"}, "&nbsp;"),
                                SPAN({"class": "label"}, "$item.label")
                            )
                        )
                    )
                )
            )
        ),

    render: function(pie, parentNode)
    {
        var root = this.tag.append({pie: pie}, parentNode);

        // Excanvas doesn't support creating CANVAS elements dynamically using
        // HTML injection (and so domplate can't be used). So, create the element
        // using DOM API.
        var pieBox = Lib.$(root, "pieBox");
        var el = document.createElement("canvas");

        //xxxHonza: the class name requires a space at the end in order to hasClass
        // to work. This is terrible hack. Please fix me!
        el.setAttribute("class", "pieGraph ");
        el.setAttribute("height", "100");
        el.setAttribute("width", "100");
        pieBox.appendChild(el);

        if (typeof(G_vmlCanvasManager) != "undefined")
            G_vmlCanvasManager.initElement(el);

        return root;
    },

    draw: function(canvas, pie)
    {
        if (!canvas || !canvas.getContext)
            return;

        var ctx = canvas.getContext("2d");
        var radius = Math.min(canvas.width, canvas.height) / 2;
        var center = [canvas.width/2, canvas.height/2];
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var sofar = 0; // keep track of progress

        var data = pie.data;
        var total = 0;
        for (var i in data)
            total += data[i].value;

        if (!total)
        {
            ctx.beginPath();
            ctx.moveTo(center[0], center[1]); // center of the pie
            ctx.arc(center[0], center[1], radius, 0, Math.PI * 2, false)
            ctx.closePath();
            ctx.fillStyle = "rgb(229,236,238)";
            ctx.lineStyle = "lightgray";
            ctx.fill();
            return;
        }

        for (var i=0; i<data.length; i++)
        {
            var thisvalue = data[i].value / total;

            ctx.beginPath();
            ctx.moveTo(center[0], center[1]);
            ctx.arc(center[0], center[1], radius,
                Math.PI * (- 0.5 + 2 * sofar), // -0.5 sets set the start to be top
                Math.PI * (- 0.5 + 2 * (sofar + thisvalue)),
                false);

            // line back to the center
            ctx.lineTo(center[0], center[1]);
            ctx.closePath();
            ctx.fillStyle = data[i].color;
            ctx.fill();

            sofar += thisvalue; // increment progress tracker
        }
    },

    showInfoTip: function(infoTip, target, x, y)
    {
        var pieTable = Lib.getAncestorByClass(target, "pagePieTable");
        if (!pieTable)
            return false;

        var label = Lib.getAncestorByClass(target, "pieLabel");
        if (label)
        {
            PieInfoTip.render(pieTable.repObject, label.repObject, infoTip);
            return true;
        }
    }
});

//*************************************************************************************************

var PieInfoTip = domplate(
{
    tag:
        DIV({"class": "pieLabelInfoTip"},
            "$text"
        ),

    getText: function(item)
    {
        return item.label + ": " + formatTime(item.value);
    },

    render: function(pie, item, parentNode)
    {
        var text = pie.getLabelTooltipText(item);
        this.tag.replace({text: text}, parentNode);
    }
});

//*************************************************************************************************

return Stats;

//*************************************************************************************************
}})
, {"filename":"../webapp/scripts/tabs/pageStats.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/nls/pageStats.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/pageStats.js"}
require.memoize("69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/pageStats.js", 
/* See license.txt for terms of usage */

define(
{
    "root": {
        "pieLabelDNS": "DNS",
        "pieLabelSSL": "SSL/TLS",
        "pieLabelConnect": "Connect",
        "pieLabelBlocked": "Blocked",
        "pieLabelSend": "Send",
        "pieLabelWait": "Wait",
        "pieLabelReceive": "Receive",

        "pieLabelHTMLText": "HTML/Text",
        "pieLabelJavaScript": "JavaScript",
        "pieLabelCSS": "CSS",
        "pieLabelImage": "Image",
        "pieLabelFlash": "Flash",
        "pieLabelOthers": "Others",

        "pieLabelHeadersSent": "Headers Sent",
        "pieLabelBodiesSent": "Bodies Sent",
        "pieLabelHeadersReceived": "Headers Received",
        "pieLabelBodiesReceived": "Bodies Received",

        "pieLabelDownloaded": "Downloaded",
        "pieLabelPartial": "Partial",
        "pieLabelFromCache": "From Cache"
    }
})
, {"filename":"../webapp/scripts/nls/pageStats.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/domplate/infoTip.js","mtime":1420432910,"wrapper":"amd","format":"amd","id":"bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/infoTip.js"}
require.memoize("bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/infoTip.js", 
/* See license.txt for terms of usage */

require.def("domplate/infoTip", [
    "jquery/jquery",
    "domplate/domplate",
    "core/lib",
    "core/trace"
],

function($, Domplate, Lib, Trace) { with (Domplate) {

//***********************************************************************************************//

var InfoTip = Lib.extend(
{
    listeners: [],
    maxWidth: 100,
    maxHeight: 80,
    infoTipMargin: 10,
    infoTipWindowPadding: 25,

    tags: domplate(
    {
        infoTipTag: DIV({"class": "infoTip"})
    }),

    initialize: function()
    {
        // xxxHonza: The info tip doesn't properly work in IE.
        if ($.browser.msie)
            return;

        var body = $("body");
        body.bind("mouseover", Lib.bind(this.onMouseMove, this));
        body.bind("mouseout", Lib.bind(this.onMouseOut, this));
        body.bind("mousemove", Lib.bind(this.onMouseMove, this));

        return this.infoTip = this.tags.infoTipTag.append({}, Lib.getBody(document));
    },

    showInfoTip: function(infoTip, target, x, y, rangeParent, rangeOffset)
    {
        var scrollParent = Lib.getOverflowParent(target);
        var scrollX = x + (scrollParent ? scrollParent.scrollLeft : 0);

        // Distribute event to all registered listeners and show the info tip if
        // any of them return true.
        var result = Lib.dispatch2(this.listeners, "showInfoTip",
            [infoTip, target, scrollX, y, rangeParent, rangeOffset])

        if (result)
        {
            var htmlElt = infoTip.ownerDocument.documentElement;
            var panelWidth = htmlElt.clientWidth;
            var panelHeight = htmlElt.clientHeight;

            if (x+infoTip.offsetWidth + this.infoTipMargin >
                panelWidth - this.infoTipWindowPadding)
            {
                infoTip.style.left = "auto";
                infoTip.style.right = ((panelWidth-x) + this.infoTipMargin) + "px";
            }
            else
            {
                infoTip.style.left = (x + this.infoTipMargin) + "px";
                infoTip.style.right = "auto";
            }

            if (y + infoTip.offsetHeight + this.infoTipMargin > panelHeight)
            {
                infoTip.style.top = Math.max(0,
                    panelHeight - (infoTip.offsetHeight + this.infoTipMargin)) + "px";
                infoTip.style.bottom = "auto";
            }
            else
            {
                infoTip.style.top = (y + this.infoTipMargin) + "px";
                infoTip.style.bottom = "auto";
            }

            infoTip.setAttribute("active", "true");
        }
        else
        {
            this.hideInfoTip(infoTip);
        }
    },

    hideInfoTip: function(infoTip)
    {
        if (infoTip)
            infoTip.removeAttribute("active");
    },

    onMouseOut: function(event)
    {
        if (!event.relatedTarget)
            this.hideInfoTip(this.infoTip);
    },

    onMouseMove: function(event)
    {
        // There is no background image for mulitline tooltips.
        this.infoTip.setAttribute("multiline", false);

        var x = event.clientX, y = event.clientY;
        this.showInfoTip(this.infoTip, event.target, x, y, event.rangeParent, event.rangeOffset);
    },

    populateTimingInfoTip: function(infoTip, color)
    {
        this.tags.colorTag.replace({rgbValue: color}, infoTip);
        return true;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Listeners

    addListener: function(listener)
    {
        this.listeners.push(listener);
    },

    removeListener: function(listener)
    {
        Lib.remove(this.listeners, listener);
    }
});

InfoTip.initialize();

// **********************************************************************************************//

return InfoTip;

// **********************************************************************************************//
}})
, {"filename":"../webapp/scripts/domplate/infoTip.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/preview/pageList.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/pageList.js"}
require.memoize("f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/pageList.js", 
/* See license.txt for terms of usage */

require.def("preview/pageList", [
    "domplate/domplate",
    "core/lib",
    "core/trace",
    "core/cookies",
    "preview/requestList",
    "i18n!nls/pageList",
    "domplate/popupMenu"
],

function(Domplate, Lib, Trace, Cookies, RequestList, Strings, Menu) {
with (Domplate) {

// ********************************************************************************************* //
// Page List

function PageList(input)
{
    this.input = input;
    this.listeners = [];
}

/**
 * @domplate This object represents a template for list of pages.
 * This list is displayed within the Preview tab. 
 */
PageList.prototype = domplate(
/** @lends PageList */
{
    tableTag:
        TABLE({"class": "pageTable", cellpadding: 0, cellspacing: 0,
            onclick: "$onClick", _repObject: "$input"},
            TBODY(
                TAG("$rowTag", {groups: "$input.log.pages"})
            )
        ),

    rowTag:
        FOR("group", "$groups",
            TR({"class": "pageRow", _repObject: "$group"},
                TD({"class": "groupName pageCol", width: "1%"},
                    SPAN({"class": "pageName"}, "$group|getPageTitle")
                ),
                TD({"class": "netOptionsCol netCol", width: "15px"},
                    DIV({"class": "netOptionsLabel netLabel", onclick: "$onOpenOptions"})
                )
            )
        ),

    bodyTag:
        TR({"class": "pageInfoRow", style: "height:auto;"},
            TD({"class": "pageInfoCol", colspan: 2})
        ),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Events & Callbacks

    getPageTitle: function(page)
    {
        return Lib.cropString(page.title, 100);
    },

    getPageID: function(page)
    {
        return "[" + page.id + "]";
    },

    onClick: function(event)
    {
        var e = Lib.fixEvent(event);
        if (Lib.isLeftClick(event)) 
        {
            var row = Lib.getAncestorByClass(e.target, "pageRow");
            if (row) 
            {
                this.toggleRow(row);
                Lib.cancelEvent(event);
            }
        }
    },

    toggleRow: function(row, forceOpen)
    {
        var opened = Lib.hasClass(row, "opened");
        if (opened && forceOpen)
            return;

        Lib.toggleClass(row, "opened");
        if (Lib.hasClass(row, "opened"))
        {
            var infoBodyRow = this.bodyTag.insertRows({}, row)[0];

            // Build request list for the expanded page.
            var requestList = this.createRequestList();

            // Dynamically append custom registered page timings.
            var pageTimings = PageList.prototype.pageTimings;
            for (var i=0; i<pageTimings.length; i++)
                requestList.addPageTiming(pageTimings[i]);

            requestList.render(infoBodyRow.firstChild, row.repObject);
        }
        else
        {
            var infoBodyRow = row.nextSibling;
            row.parentNode.removeChild(infoBodyRow);
        }
    },

    expandAll: function(pageList)
    {
        var row = pageList.firstChild.firstChild;
        while (row)
        {
            if (Lib.hasClass(row, "pageRow"))
                this.toggleRow(row, true);
            row = row.nextSibling;
        }
    },

    getPageRow: function(page)
    {
        var pageList = this.element.parentNode;
        var rows = Lib.getElementsByClass(pageList, "pageRow");
        for (var i=0; i<rows.length; i++)
        {
            var row = rows[i];
            if (row.repObject == page)
                return row;
        }
    },

    togglePage: function(page)
    {
        var row = this.getPageRow(page);
        this.toggleRow(row);
    },

    expandPage: function(page)
    {
        var row = this.getPageRow(page);
        this.toggleRow(row, true);
    },

    collapsePage: function(page)
    {
        var row = this.getPageRow(page);
        if (Lib.hasClass(row, "opened"))
            this.toggleRow(row);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Customize Columns

    onOpenOptions: function(event)
    {
        var e = Lib.fixEvent(event);
        Lib.cancelEvent(event);

        if (!Lib.isLeftClick(event))
            return;

        var target = e.target;

        // Collect all menu items.
        var row = Lib.getAncestorByClass(target, "pageRow");
        var items = this.getMenuItems(row.repObject);

        // Finally, display the the popup menu.
        // xxxHonza: the old <DIV> can be still visible.
        var menu = new Menu({id: "requestContextMenu", items: items});
        menu.showPopup(target);
    },

    getMenuItems: function(row)
    {
        // Get list of columns as string for quick search.
        var cols = RequestList.getVisibleColumns().join();

        // You can't hide the last visible column.
        var lastVisibleIndex;
        var visibleColCount = 0;

        var items = []
        for (var i=0; i<RequestList.columns.length; i++)
        {
            var colName = RequestList.columns[i];
            var visible = (cols.indexOf(colName) > -1);

            items.push({
                label: Strings["column.label." + colName],
                type: "checkbox",
                checked: visible,
                command: Lib.bindFixed(this.onToggleColumn, this, colName)
            });

            if (visible)
            {
                lastVisibleIndex = i;
                visibleColCount++;
            }
        }

        // If the last column is visible, disable its menu item.
        if (visibleColCount == 1)
            items[lastVisibleIndex].disabled = true;

        items.push("-");
        items.push({
            label: Strings["action.label.Reset"],
            command: Lib.bindFixed(this.updateColumns, this)
        });

        return items;
    },

    onToggleColumn: function(name)
    {
        // Try to remove the column from the array, if not presented append it.
        var cols = RequestList.getVisibleColumns();
        if (!Lib.remove(cols, name))
            cols.push(name);

        // Update Cookies and UI
        this.updateColumns(cols);
    },

    updateColumns: function(cols)
    {
        if (!cols)
            cols = RequestList.defaultColumns;

        RequestList.setVisibleColumns(cols);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Helpers 

    createRequestList: function()
    {
        var requestList = new RequestList(this.input);
        requestList.listeners = this.listeners;
        return requestList;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Public

    append: function(parentNode)
    {
        // According to the spec, network requests doesn't have to be 
        // associated with the parent page. This is to support even
        // tools that can't get this info.
        // Also if log files are merged there can be some requests not
        // associated with any page. Make sure these are displayed too. 
        var requestList = this.createRequestList();
        requestList.render(parentNode, null);

        // If there are any pages, build regular page list.
        var pages = this.input.log.pages;
        if (pages && pages.length)
        {
            // Build the page list.
            var table = this.tableTag.append({input: this.input}, parentNode, this);

            // List of pages within one HAR log
            var pageRows = Lib.getElementsByClass(table, "pageRow");

            // List of HAR logs
            var pageTables = Lib.getElementsByClass(parentNode, "pageTable");

            // Expand appended page by default only if there is only one page.
            // Note that there can be more page-lists (pageTable elements)
            if (pageRows.length == 1 && pageTables.length == 1)
                this.toggleRow(pageRows[0]);

            // If 'expand' parameter is specified expand all by default.
            var expand = Lib.getURLParameter("expand");
            if (expand)
                this.expandAll(table);
        }
    },

    render: function(parentNode)
    {
        this.append(parentNode);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Listeners

    addListener: function(listener)
    {
        this.listeners.push(listener);
    },

    removeListener: function(listener)
    {
        Lib.remove(this.listeners, listener);
    }
});

// ********************************************************************************************* //

// Custom registered page timings, displayed as vertical lines over individual requests
// in the first phase.
PageList.prototype.pageTimings = [];

// ********************************************************************************************* //

return PageList;

// ********************************************************************************************* //
}})
, {"filename":"../webapp/scripts/preview/pageList.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/preview/requestList.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/requestList.js"}
require.memoize("f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/requestList.js", 
/* See license.txt for terms of usage */

require.def("preview/requestList", [
    "domplate/domplate",
    "core/lib",
    "i18n!nls/requestList",
    "preview/harModel",
    "core/cookies",
    "preview/requestBody",
    "domplate/infoTip",
    "domplate/popupMenu"
],

function(Domplate, Lib, Strings, HarModel, Cookies, RequestBody, InfoTip, Menu) {
with (Domplate) {

// ********************************************************************************************* //
// Request List

function RequestList(input)
{
    this.input = input;
    this.pageTimings = [];

    // List of pageTimings fields (see HAR 1.2 spec) that should be displayed
    // in the waterfall graph as vertical lines. The HAR spec defines two timings:
    // onContentLoad: DOMContentLoad event fired
    // onLoad: load event fired
    // New custom page timing fields can be appended using RequestList.addPageTiming method.
    this.addPageTiming({
        name: "onContentLoad",
        classes: "netContentLoadBar",
        description: Strings["ContentLoad"]
    });

    this.addPageTiming({
        name: "onLoad",
        classes: "netWindowLoadBar",
        description: Strings["WindowLoad"]
    });

    InfoTip.addListener(this);
}

// ********************************************************************************************* //
// Columns 

/**
 * List of all available columns for the request table, see also RequestList.prototype.tableTag
 */
RequestList.columns = [
    "url",
    "status",
    "type",
    "domain",
    "size",
    "timeline"
];

/**
 * List of columns that are visible by default.
 */
RequestList.defaultColumns = [
    "url",
    "status",
    "size",
    "timeline"
];

/**
 * Use this method to get a list of currently visible columns.
 */
RequestList.getVisibleColumns = function()
{
    var cols = Cookies.getCookie("previewCols");
    if (cols)
    {
        // Columns names are separated by a space so, make sure to properly process
        // spaces in the cookie value.
        cols = cols.replace(/\+/g, " ");
        cols = unescape(cols);
        return cols.split(" ");
    }

    if (!cols)
    {
        var content = document.getElementById("content");
        if (content)
        {
            cols = content.getAttribute("previewCols");
            if (cols)
                return cols.split(" ");
        }
    }

    return Lib.cloneArray(RequestList.defaultColumns);
}

RequestList.setVisibleColumns = function(cols, avoidCookies)
{
    if (!cols)
        cols = RequestList.getVisibleColumns();

    // If the parameter is an array, convert it to string.
    if (cols.join)
        cols = cols.join(" ");

    var content = document.getElementById("content");
    if (content)
        content.setAttribute("previewCols", cols);

    // Update cookie
    if (!avoidCookies)
        Cookies.setCookie("previewCols", cols);
}

// Initialize UI. List of columns is specified on the content element (used by CSS).
RequestList.setVisibleColumns();

// ********************************************************************************************* //

/**
 * @domplate This object represents a template for list of entries (requests).
 * This list is displayed when a page is expanded by the user. 
 */
RequestList.prototype = domplate(
/** @lends RequestList */
{
    tableTag:
        TABLE({"class": "netTable", cellpadding: 0, cellspacing: 0, onclick: "$onClick",
            _repObject: "$requestList"},
            TBODY(
                TR({"class" : "netSizerRow"},
                    TD({"class": "netHrefCol netCol", width: "20%"}),
                    TD({"class": "netStatusCol netCol", width: "7%"}),
                    TD({"class": "netTypeCol netCol", width: "7%"}),
                    TD({"class": "netDomainCol netCol", width: "7%"}),
                    TD({"class": "netSizeCol netCol", width: "7%"}),
                    TD({"class": "netTimeCol netCol", width: "100%"}),
                    TD({"class": "netOptionsCol netCol", width: "15px"}) // Options
                )
            )
        ),

    fileTag:
        FOR("file", "$files",
            TR({"class": "netRow loaded",
                $isExpandable: "$file|isExpandable",
                $responseError: "$file|isError",
                $responseRedirect: "$file|isRedirect",
                $fromCache: "$file|isFromCache"},
                TD({"class": "netHrefCol netCol"},
                    DIV({"class": "netHrefLabel netLabel",
                         style: "margin-left: $file|getIndent\\px"},
                        "$file|getHref"
                    ),
                    DIV({"class": "netFullHrefLabel netHrefLabel netLabel",
                         style: "margin-left: $file|getIndent\\px"},
                        "$file|getFullHref"
                    )
                ),
                TD({"class": "netStatusCol netCol"},
                    DIV({"class": "netStatusLabel netLabel"}, "$file|getStatus")
                ),
                TD({"class": "netTypeCol netCol"},
                    DIV({"class": "netTypeLabel netLabel"}, "$file|getType")
                ),
                TD({"class": "netDomainCol netCol"},
                    DIV({"class": "netDomainLabel netLabel"}, "$file|getDomain")
                ),
                TD({"class": "netSizeCol netCol"},
                    DIV({"class": "netSizeLabel netLabel"}, "$file|getSize")
                ),
                TD({"class": "netTimeCol netCol"},
                    DIV({"class": "netTimelineBar"},
                        "&nbsp;",
                        DIV({"class": "netBlockingBar netBar"}),
                        DIV({"class": "netResolvingBar netBar"}),
                        DIV({"class": "netConnectingBar netBar"}),
                        DIV({"class": "netSendingBar netBar"}),
                        DIV({"class": "netWaitingBar netBar"}),
                        DIV({"class": "netReceivingBar netBar"},
                            SPAN({"class": "netTimeLabel"}, "$file|getElapsedTime")
                        )
                        // Page timings (vertical lines) are dynamically appended here.
                    )
                ),
                TD({"class": "netOptionsCol netCol"},
                    DIV({"class": "netOptionsLabel netLabel", onclick: "$onOpenOptions"})
                )
            )
        ),

    headTag:
        TR({"class": "netHeadRow"},
            TD({"class": "netHeadCol", colspan: 7},
                DIV({"class": "netHeadLabel"}, "$doc.rootFile.href")
            )
        ),

    netInfoTag:
        TR({"class": "netInfoRow"},
            TD({"class": "netInfoCol", colspan: 7})
        ),

    summaryTag:
        TR({"class": "netRow netSummaryRow"},
            TD({"class": "netHrefCol netCol"},
                DIV({"class": "netCountLabel netSummaryLabel"}, "-")
            ),
            TD({"class": "netStatusCol netCol"}),
            TD({"class": "netTypeCol netCol"}),
            TD({"class": "netDomainCol netCol"}),
            TD({"class": "netTotalSizeCol netSizeCol netCol"},
                DIV({"class": "netTotalSizeLabel netSummaryLabel"}, "0KB")
            ),
            TD({"class": "netTotalTimeCol netTimeCol netCol"},
                DIV({"class": "", style: "width: 100%"},
                    DIV({"class": "netCacheSizeLabel netSummaryLabel"},
                        "(",
                        SPAN("0KB"),
                        SPAN(" " + Strings.fromCache),
                        ")"
                    ),
                    DIV({"class": "netTimeBar"},
                        SPAN({"class": "netTotalTimeLabel netSummaryLabel"}, "0ms")
                    )
                )
            ),
            TD({"class": "netOptionsCol netCol"})
        ),

    getIndent: function(file)
    {
        return 0;
    },

    isError: function(file)
    {
        var errorRange = Math.floor(file.response.status/100);
        return errorRange == 4 || errorRange == 5;
    },

    isRedirect: function(file)
    {
        // xxxHonza: 304?
        //var errorRange = Math.floor(file.response.status/100);
        //return errorRange == 3;
        return false;
    },

    isFromCache: function(file)
    {
        return file.cache && file.cache.afterRequest;
    },

    getHref: function(file)
    {
        var fileName = Lib.getFileName(this.getFullHref(file));
        return unescape(file.request.method + " " + fileName);
    },

    getFullHref: function(file)
    {
        return unescape(file.request.url);
    },

    getStatus: function(file)
    {
        var status = file.response.status > 0 ? (file.response.status + " ") : "";
        return status + file.response.statusText;
    },

    getType: function(file)
    {
        return file.response.content.mimeType;
    },

    getDomain: function(file)
    {
        return Lib.getPrettyDomain(file.request.url);
    },

    getSize: function(file)
    {
        var bodySize = file.response.bodySize;
        var size = (bodySize && bodySize != -1) ? bodySize :
            file.response.content.size;

        return this.formatSize(size);
    },

    isExpandable: function(file)
    {
        var hasHeaders = file.response.headers.length > 0;
        var hasDataURL = file.request.url.indexOf("data:") == 0;
        return hasHeaders || hasDataURL;
    },

    formatSize: function(bytes)
    {
        return Lib.formatSize(bytes);
    },

    getElapsedTime: function(file)
    {
        // Total request time doesn't include the time spent in queue.
        //var elapsed = file.time - file.timings.blocked;
        var time = Math.round(file.time * 10) / 10;
        return Lib.formatTime(time);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    onClick: function(event)
    {
        var e = Lib.fixEvent(event);
        if (Lib.isLeftClick(event))
        {
            var row = Lib.getAncestorByClass(e.target, "netRow");
            if (row)
            {
                this.toggleHeadersRow(row);
                Lib.cancelEvent(event);
            }
        }
        else if (Lib.isControlClick(event))
        {
            window.open(event.target.innerText || event.target.textContent);
        }
    },

    toggleHeadersRow: function(row)
    {
        if (!Lib.hasClass(row, "isExpandable"))
            return;

        var file = row.repObject;

        Lib.toggleClass(row, "opened");
        if (Lib.hasClass(row, "opened"))
        {
            var netInfoRow = this.netInfoTag.insertRows({}, row)[0];
            netInfoRow.repObject = file;

            var requestBody = new RequestBody();
            requestBody.render(netInfoRow.firstChild, file);
        }
        else
        {
            var netInfoRow = row.nextSibling;
            var netInfoBox = Lib.getElementByClass(netInfoRow, "netInfoBody");
            row.parentNode.removeChild(netInfoRow);
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Options

    onOpenOptions: function(event)
    {
        var e = Lib.fixEvent(event);
        Lib.cancelEvent(event);

        if (!Lib.isLeftClick(event))
            return;

        var target = e.target;

        // Collect all menu items.
        var row = Lib.getAncestorByClass(target, "netRow");
        var items = this.getMenuItems(row);
        if (!items.length)
            return;

        // Finally, display the the popup menu.
        // xxxHonza: the old <DIV> can be still visible.
        var menu = new Menu({id: "requestContextMenu", items: items});
        menu.showPopup(target);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Menu Definition

    getMenuItems: function(row)
    {
        var file = row.repObject;
        var phase = row.phase;

        // Disable the 'break layout' command for the first file in the first phase.
        var disableBreakLayout = (phase.files[0] == file && this.phases[0] == phase);

        var items = [
            {
                label: Strings.menuBreakTimeline,
                type: "checkbox",
                disabled: disableBreakLayout,
                checked: phase.files[0] == file && !disableBreakLayout,
                command: Lib.bind(this.breakLayout, this, row)
            },
            "-",
            {
                label: Strings.menuOpenRequest,
                command: Lib.bind(this.openRequest, this, file)
            },
            {
                label: Strings.menuOpenResponse,
                disabled: !file.response.content.text,
                command: Lib.bind(this.openResponse, this, file)
            }
        ];

        // Distribute to all listeners to allow registering custom commands.
        // Listeneres are set by the parent page-list.
        Lib.dispatch(this.listeners, "getMenuItems", [items, this.input, file]);

        return items;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Command Handlers

    openRequest: function(event, file)
    {
        window.open(file.request.url);
    },

    openResponse: function(event, file)
    {
        var response = file.response.content.text;
        var mimeType = file.response.content.mimeType;
        var encoding = file.response.content.encoding;
        var url = "data:" + (mimeType ? mimeType: "") + ";" +
            (encoding ? encoding : "") + "," + response;

        window.open(url);
    },

    breakLayout: function(event, row)
    {
        var file = row.repObject;
        var phase = row.phase;
        var layoutBroken = phase.files[0] == file;
        row.breakLayout = !layoutBroken;

        // For CSS (visual separator between two phases).
        row.setAttribute("breakLayout", row.breakLayout ? "true" : "false");

        var netTable = Lib.getAncestorByClass(row, "netTable");
        var page = HarModel.getParentPage(this.input, file);
        this.updateLayout(netTable, page);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Layout

    updateLayout: function(table, page)
    {
        var requests = HarModel.getPageEntries(this.input, page);

        this.table = table;
        var tbody = this.table.firstChild;
        var row = this.firstRow = tbody.firstChild.nextSibling;

        this.phases = [];

        // The phase interval is customizable through a cookie.
        var phaseInterval = Cookies.getCookie("phaseInterval");
        if (!phaseInterval)
            phaseInterval = 4000;

        var phase = null;

        var pageStartedDateTime = page ? Lib.parseISO8601(page.startedDateTime) : null;

        // The onLoad time stamp is used for proper initialization of the first phase. The first
        // phase contains all requests till onLoad is fired (even if there are time gaps).
        // Don't worry if it
        var onLoadTime = (page && page.pageTimings) ? page.pageTimings["onLoad"] : -1;

        // The timing could be NaN or -1. In such case keep the value otherwise
        // make the time absolute.
        if (onLoadTime > 0)
            onLoadTime += pageStartedDateTime;

        // Iterate over all requests and create phases.
        for (var i=0; i<requests.length; i++)
        {
            var file = requests[i];

            if (Lib.hasClass(row, "netInfoRow"))
                row = row.nextSibling;

            row.repObject = file;

            // If the parent page doesn't exists get startedDateTime of the
            // first request.
            if (!pageStartedDateTime)
                pageStartedDateTime = Lib.parseISO8601(file.startedDateTime);

            var startedDateTime = Lib.parseISO8601(file.startedDateTime);
            var phaseLastStartTime = phase ? Lib.parseISO8601(phase.getLastStartTime()) : 0;
            var phaseEndTime = phase ? phase.endTime : 0;

            // New phase is started if:
            // 1) There is no phase yet.
            // 2) There is a gap between this request and the last one.
            // 3) The new request is not started during the page load.
            var newPhase = false;
            if (phaseInterval >= 0)
            {
                newPhase = (startedDateTime > onLoadTime) &&
                    ((startedDateTime - phaseLastStartTime) >= phaseInterval) &&
                    (startedDateTime + file.time >= phaseEndTime + phaseInterval);
            }

            // 4) The file can be also marked with breakLayout
            if (typeof(row.breakLayout) == "boolean")
            {
                if (!phase || row.breakLayout)
                    phase = this.startPhase(file);
                else
                    phase.addFile(file);
            }
            else
            {
                if (!phase || newPhase)
                    phase = this.startPhase(file);
                else
                    phase.addFile(file);
            }

            // For CSS (visual separator between two phases). Except of the first file
            // in the first phase.
            if (this.phases[0] != phase)
                row.setAttribute("breakLayout", (phase.files[0] == file) ? "true" : "false");

            if (phase.startTime == undefined || phase.startTime > startedDateTime)
                phase.startTime = startedDateTime;

            // file.time represents total elapsed time of the request.
            if (phase.endTime == undefined || phase.endTime < startedDateTime + file.time)
                phase.endTime = startedDateTime + file.time;

            row = row.nextSibling;
        }

        this.updateTimeStamps(page);
        this.updateTimeline(page);
        this.updateSummaries(page);
    },

    startPhase: function(file)
    {
        var phase = new Phase(file);
        this.phases.push(phase);
        return phase;
    },

    calculateFileTimes: function(page, file, phase)
    {
        if (phase != file.phase)
        {
            phase = file.phase;
            this.phaseStartTime = phase.startTime;
            this.phaseEndTime = phase.endTime;
            this.phaseElapsed = this.phaseEndTime - phase.startTime;
        }

        if (!file.timings)
            return phase;

        // Individual phases of a request:
        //
        // 1) Blocking          HTTP-ON-MODIFY-REQUEST -> (STATUS_RESOLVING || STATUS_CONNECTING_TO)
        // 2) DNS               STATUS_RESOLVING -> STATUS_CONNECTING_TO
        // 3) Connecting        STATUS_CONNECTING_TO -> (STATUS_CONNECTED_TO || STATUS_SENDING_TO)
        // 4) Sending           STATUS_SENDING_TO -> STATUS_WAITING_FOR
        // 5) Waiting           STATUS_WAITING_FOR -> STATUS_RECEIVING_FROM
        // 6) Receiving         STATUS_RECEIVING_FROM -> ACTIVITY_SUBTYPE_RESPONSE_COMPLETE
        //
        // Note that HTTP-ON-EXAMINE-RESPONSE should not be used since the time isn't passed
        // along with this event and so, it could break the timing. Only the HTTP-ON-MODIFY-REQUEST
        // is used to get begining of the request and compute the blocking time. Hopefully this
        // will work or there is better mechanism.
        //
        // If the response comes directly from the browser cache, there is only one state.
        // HTTP-ON-MODIFY-REQUEST -> HTTP-ON-EXAMINE-CACHED-RESPONSE

        // Compute end of each phase since the request start.
        var blocking = ((file.timings.blocked < 0) ? 0 : file.timings.blocked);
        var resolving = blocking + ((file.timings.dns < 0) ? 0 : file.timings.dns);
        var connecting = resolving + ((file.timings.connect < 0) ? 0 : file.timings.connect);
        var sending = connecting + ((file.timings.send < 0) ? 0 : file.timings.send);
        var waiting = sending + ((file.timings.wait < 0) ? 0 : file.timings.wait);
        var receiving = waiting + ((file.timings.receive < 0) ? 0 : file.timings.receive);

        var elapsed = file.time;
        var startedDateTime = Lib.parseISO8601(file.startedDateTime);
        this.barOffset = (((startedDateTime-this.phaseStartTime)/this.phaseElapsed) * 100).toFixed(3);

        // Compute size of each bar. Left side of each bar starts at the 
        // beginning. The first bar is on top of all and the last one is
        // at the bottom (z-index). 
        this.barBlockingWidth = ((blocking/this.phaseElapsed) * 100).toFixed(3);
        this.barResolvingWidth = ((resolving/this.phaseElapsed) * 100).toFixed(3);
        this.barConnectingWidth = ((connecting/this.phaseElapsed) * 100).toFixed(3);
        this.barSendingWidth = ((sending/this.phaseElapsed) * 100).toFixed(3);
        this.barWaitingWidth = ((waiting/this.phaseElapsed) * 100).toFixed(3);
        this.barReceivingWidth = ((receiving/this.phaseElapsed) * 100).toFixed(3);

        // Compute also offset for page timings, e.g.: contentLoadBar and windowLoadBar,
        // which are displayed for the first phase. This is done only if a page exists.
        this.calculatePageTimings(page, file, phase);

        return phase;
    },

    calculatePageTimings: function(page, file, phase)
    {
        // Obviously we need a page object for page timings.
        if (!page)
            return;

        var pageStart = Lib.parseISO8601(page.startedDateTime);

        // Iterate all timings in this phase and generate offsets (px position in the timeline).
        for (var i=0; i<phase.pageTimings.length; i++)
        {
            var time = phase.pageTimings[i].time;
            if (time > 0)
            {
                var timeOffset = pageStart + time - phase.startTime;
                var barOffset = ((timeOffset/this.phaseElapsed) * 100).toFixed(3);
                phase.pageTimings[i].offset = barOffset;
            }
        }
    },

    updateTimeline: function(page)
    {
        var tbody = this.table.firstChild;

        var phase;

        // Iterate over all existing entries. Some rows aren't associated with a file 
        // (e.g. header, sumarry) so, skip them.
        for (var row = this.firstRow; row; row = row.nextSibling)
        {
            var file = row.repObject;
            if (!file)
                continue;

            // Skip expanded rows.
            if (Lib.hasClass(row, "netInfoRow"))
                continue;

            phase = this.calculateFileTimes(page, file, phase);

            // Remember the phase it's utilized by the time info-tip.
            row.phase = file.phase;

            // Remove the phase from the file object so, it's not displayed
            // in the DOM tab.
            delete file.phase;

            // Parent for all timing bars.
            var timelineBar = Lib.getElementByClass(row, "netTimelineBar");

            // Get bar nodes. Every node represents one part of the graph-timeline.
            var blockingBar = timelineBar.children[0];
            var resolvingBar = blockingBar.nextSibling;
            var connectingBar = resolvingBar.nextSibling;
            var sendingBar = connectingBar.nextSibling;
            var waitingBar = sendingBar.nextSibling;
            var receivingBar = waitingBar.nextSibling;

            // All bars starts at the beginning of the appropriate request graph. 
            blockingBar.style.left = 
                connectingBar.style.left =
                resolvingBar.style.left =
                sendingBar.style.left = 
                waitingBar.style.left =
                receivingBar.style.left = this.barOffset + "%";

            // Sets width of all bars (using style). The width is computed according to measured timing.
            blockingBar.style.width = this.barBlockingWidth + "%";
            resolvingBar.style.width = this.barResolvingWidth + "%";
            connectingBar.style.width = this.barConnectingWidth + "%";
            sendingBar.style.width = this.barSendingWidth + "%";
            waitingBar.style.width = this.barWaitingWidth + "%";
            receivingBar.style.width = this.barReceivingWidth + "%";

            // Remove all existing timing bars first. The UI can be relayouting at this moment
            // (can happen if break layout is executed).
            var bars = Lib.getElementsByClass(timelineBar, "netPageTimingBar");
            for (var i=0; i<bars.length; i++)
                bars[i].parentNode.removeChild(bars[i]);

            // Generate UI for page timings (vertical lines displayed for the first phase)
            for (var i=0; i<phase.pageTimings.length; i++)
            {
                var timing = phase.pageTimings[i];
                if (!timing.offset)
                    continue;

                var bar = timelineBar.ownerDocument.createElement("DIV");
                timelineBar.appendChild(bar);

                if (timing.classes)
                    Lib.setClass(bar, timing.classes);

                Lib.setClass(bar, "netPageTimingBar netBar");

                bar.style.left = timing.offset + "%";
                bar.style.display = "block";

                // The offset will be calculated for the next row (request entry) again
                // within calculatePageTimings in the next row (outer) cycle.
                timing.offset = null;
            }
        }
    },

    updateTimeStamps: function(page)
    {
        if (!page)
            return;

        // Convert registered page timings (e.g. onLoad, DOMContentLoaded) into structures
        // with label information.
        var pageTimings = [];
        for (var i=0; page.pageTimings && i<this.pageTimings.length; i++)
        {
            var timing = this.pageTimings[i];
            var eventTime = page.pageTimings[timing.name];
            if (eventTime > 0)
            {
                pageTimings.push({
                    label: timing.name,
                    time: eventTime,
                    classes: timing.classes,
                    comment: timing.description
                });
            }
        }

        // Get time-stamps generated from console.timeStamp() method (this method has been
        // introduced in Firebug 1.8b3).
        // See Firebug documentation: http://getfirebug.com/wiki/index.php/Console_API
        var timeStamps = page.pageTimings ? page.pageTimings._timeStamps : [];

        // Put together all timing info.
        if (timeStamps)
            pageTimings.push.apply(pageTimings, timeStamps);

        // Iterate all existing phases.
        var phases = this.phases;
        for (var i=0; i<phases.length; i++)
        {
            var phase = phases[i];
            var nextPhase = phases[i+1];

            // Iterate all timings and divide them into phases. This process can extend
            // the end of a phase.
            for (var j=0; j<pageTimings.length; j++)
            {
                var stamp = pageTimings[j];
                var time = stamp.time;
                if (!time)
                    continue;

                // We need the absolute time.
                var startedDateTime = Lib.parseISO8601(page.startedDateTime);
                time += startedDateTime;

                // The time stamp belongs to the current phase if:
                // 1) It occurs before the next phase started or there is no next phase.
                if (!nextPhase || time < nextPhase.startTime)
                {
                    // 2) It occurs after the current phase started, or this is the first phase.
                    if (i == 0 || time >= phase.startTime)
                    {
                        // This is the case where the time stamp occurs before the first phase
                        // started (shouldn't actually happen since there can't be a stamp made
                        // before the first document request).
                        if (phase.startTime > time)
                            phase.startTime = time;

                        // This is the case where the time stamp occurs after the phase end time,
                        // but still before the next phase start time.
                        if (phase.endTime < time)
                            phase.endTime = time;

                        phase.pageTimings.push({
                            classes: stamp.classes ? stamp.classes : "netTimeStampBar",
                            name: stamp.label,
                            description: stamp.comment,
                            time: stamp.time
                        });
                    }
                }
            }
        }
    },

    updateSummaries: function(page)
    {
        var phases = this.phases;
        var fileCount = 0, totalSize = 0, cachedSize = 0, totalTime = 0;
        for (var i = 0; i < phases.length; ++i)
        {
            var phase = phases[i];
            phase.invalidPhase = false;

            var summary = this.summarizePhase(phase);
            fileCount += summary.fileCount;
            totalSize += summary.totalSize;
            cachedSize += summary.cachedSize;
            totalTime += summary.totalTime;
        }

        var row = this.summaryRow;
        if (!row)
            return;

        var countLabel = Lib.getElementByClass(row, "netCountLabel");
        countLabel.firstChild.nodeValue = this.formatRequestCount(fileCount);

        var sizeLabel = Lib.getElementByClass(row, "netTotalSizeLabel");
        sizeLabel.setAttribute("totalSize", totalSize);
        sizeLabel.firstChild.nodeValue = Lib.formatSize(totalSize);

        var cacheSizeLabel = Lib.getElementByClass(row, "netCacheSizeLabel");
        cacheSizeLabel.setAttribute("collapsed", cachedSize == 0);
        cacheSizeLabel.childNodes[1].firstChild.nodeValue = Lib.formatSize(cachedSize);

        var timeLabel = Lib.getElementByClass(row, "netTotalTimeLabel");
        var timeText = Lib.formatTime(totalTime);

        // xxxHonza: localization?
        if (page && page.pageTimings.onLoad > 0)
            timeText += " (onload: " + Lib.formatTime(page.pageTimings.onLoad) + ")";

        timeLabel.innerHTML = timeText;
    },

    formatRequestCount: function(count)
    {
        return count + " " + (count == 1 ? Strings.request : Strings.requests);
    },

    summarizePhase: function(phase)
    {
        var cachedSize = 0, totalSize = 0;

        var category = "all";
        if (category == "all")
            category = null;

        var fileCount = 0;
        var minTime = 0, maxTime = 0;

        for (var i=0; i<phase.files.length; i++)
        {
            var file = phase.files[i];
            var startedDateTime = Lib.parseISO8601(file.startedDateTime);

            if (!category || file.category == category)
            {
                ++fileCount;

                var bodySize = file.response.bodySize;
                var size = (bodySize && bodySize != -1) ? bodySize : file.response.content.size;

                totalSize += size;
                if (file.response.status == 304)
                    cachedSize += size;

                if (!minTime || startedDateTime < minTime)
                    minTime = startedDateTime;

                var fileEndTime = startedDateTime + file.time;
                if (fileEndTime > maxTime)
                    maxTime = fileEndTime;
            }
        }

        var totalTime = maxTime - minTime;
        return {cachedSize: cachedSize, totalSize: totalSize, totalTime: totalTime,
            fileCount: fileCount}
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // InfoTip

    showInfoTip: function(infoTip, target, x, y)
    {
        // There is more instances of RequestList object registered as info-tips listener
        // so make sure the one that is associated with the target is used.
        var table = Lib.getAncestorByClass(target, "netTable");
        if (!table || table.repObject != this)
            return;

        var row = Lib.getAncestorByClass(target, "netRow");
        if (row)
        {
            if (Lib.getAncestorByClass(target, "netBar"))
            {
                // There is no background image for multiline tooltips.
                infoTip.setAttribute("multiline", true);
                var infoTipURL = row.repObject.startedDateTime + "-nettime"; //xxxHonza the ID should be URL.
                // xxxHonza: there can be requests to the same URLs with different timings.
                //if (infoTipURL == this.infoTipURL)
                //    return true;

                this.infoTipURL = infoTipURL;
                return this.populateTimeInfoTip(infoTip, row);
            }
            else if (Lib.hasClass(target, "netSizeLabel"))
            {
                var infoTipURL = row.repObject.startedDateTime + "-netsize"; //xxxHonza the ID should be URL.
                // xxxHonza: there can be requests to the same URLs with different response sizes.
                //if (infoTipURL == this.infoTipURL)
                //    return true;

                this.infoTipURL = infoTipURL;
                return this.populateSizeInfoTip(infoTip, row);
            }
        }
    },

    populateTimeInfoTip: function(infoTip, row)
    {
        EntryTimeInfoTip.render(this, row, infoTip);
        return true;
    },

    populateSizeInfoTip: function(infoTip, row)
    {
        EntrySizeInfoTip.render(this, row, infoTip);
        return true;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Public

    render: function(parentNode, page)
    {
        var entries = HarModel.getPageEntries(this.input, page);
        if (!entries.length)
            return null;

        return this.append(parentNode, page, entries);
    },

    append: function(parentNode, page, entries)
    {
        if (!this.table)
            this.table = this.tableTag.replace({requestList: this}, parentNode, this);

        if (!this.summaryRow)
            this.summaryRow = this.summaryTag.insertRows({}, this.table.firstChild)[0];

        var tbody = this.table.firstChild;
        var lastRow = tbody.lastChild.previousSibling;

        var result = this.fileTag.insertRows({files: entries}, lastRow, this);
        this.updateLayout(this.table, page);

        return result[0];
    },

    addPageTiming: function(timing)
    {
        this.pageTimings.push(timing);
    }
});

// ********************************************************************************************* //

/**
 * @object This object represents a phase that joins related requests into groups (phases).
 */
function Phase(file)
{
    this.files = [];
    this.pageTimings = [];

    this.addFile(file);
};

Phase.prototype =
{
    addFile: function(file)
    {
        this.files.push(file);
        file.phase = this;
    },

    getLastStartTime: function()
    {
        // The last request start time.
        return this.files[this.files.length - 1].startedDateTime;
    }
};

//***********************************************************************************************//

/**
 * @domplate This object represents a popup info tip with detailed timing info for an
 * entry (request).
 */
var EntryTimeInfoTip = domplate(
{
    tableTag:
        TABLE({"class": "timeInfoTip"},
            TBODY()
        ),

    timingsTag:
        FOR("time", "$timings",
            TR({"class": "timeInfoTipRow", $collapsed: "$time|hideBar"},
                TD({"class": "$time|getBarClass timeInfoTipBar",
                    $loaded: "$time.loaded",
                    $fromCache: "$time.fromCache"
                }),
                TD({"class": "timeInfoTipCell startTime"},
                    "$time.start|formatStartTime"
                ),
                TD({"class": "timeInfoTipCell elapsedTime"},
                    "$time.elapsed|formatTime"
                ),
                TD("$time|getLabel")
            )
        ),

    startTimeTag:
        TR(
            TD(),
            TD("$startTime.time|formatStartTime"),
            TD({"class": "timeInfoTipStartLabel", "colspan": 2},
                "$startTime|getLabel"
            )
        ),

    separatorTag:
        TR({},
            TD({"class": "timeInfoTipSeparator", "colspan": 4, "height": "10px"},
                SPAN("$label")
            )
        ),

    eventsTag:
        FOR("event", "$events",
            TR({"class": "timeInfoTipEventRow"},
                TD({"class": "timeInfoTipBar", align: "center"},
                    DIV({"class": "$event|getPageTimingClass timeInfoTipEventBar"})
                ),
                TD("$event.start|formatStartTime"),
                TD({"colspan": 2},
                    "$event|getTimingLabel"
                )
            )
        ),

    hideBar: function(obj)
    {
        return !obj.elapsed && obj.bar == "request.phase.Blocking";
    },

    getBarClass: function(obj)
    {
        var className = obj.bar.substr(obj.bar.lastIndexOf(".") + 1);
        return "net" + className + "Bar";
    },

    getPageTimingClass: function(timing)
    {
        return timing.classes ? timing.classes : "";
    },

    formatTime: function(time)
    {
        return Lib.formatTime(time);
    },

    formatStartTime: function(time)
    {
        var positive = time > 0;
        var label = Lib.formatTime(Math.abs(time));
        if (!time)
            return label;

        return (positive > 0 ? "+" : "-") + label;
    },

    getLabel: function(obj)
    {
        return Strings[obj.bar];
    },

    getTimingLabel: function(obj)
    {
        return obj.bar;
    },

    render: function(requestList, row, parentNode)
    {
        var input = requestList.input;
        var file = row.repObject;
        var page = HarModel.getParentPage(input, file);
        var pageStart = page ? Lib.parseISO8601(page.startedDateTime) : null;
        var requestStart = Lib.parseISO8601(file.startedDateTime);
        var infoTip = EntryTimeInfoTip.tableTag.replace({}, parentNode);

        // Insert start request time.
        var startTimeObj = {};

        //xxxHonza: the request start-time should be since the page start-time
        // but what to do if there was no parent page and the parent phase
        // is not the first one?
        //xxxHonza: the request start-time is since the page start-time
        // but the other case isw not tested yet.
        if (pageStart)
            startTimeObj.time = requestStart - pageStart;
        else
            startTimeObj.time = requestStart - row.phase.startTime;

        startTimeObj.bar = "request.Started";
        this.startTimeTag.insertRows({startTime: startTimeObj}, infoTip.firstChild);

        // Insert separator.
        this.separatorTag.insertRows({label: Strings["request.phases.label"]},
            infoTip.firstChild);

        var startTime = 0;
        var timings = [];

        // Helper shortcuts
        var blocked = file.timings.blocked;
        var dns = file.timings.dns;
        var ssl = file.timings.ssl; // new in HAR 1.2 xxxHonza: TODO
        var connect = file.timings.connect;
        var send = file.timings.send;
        var wait = file.timings.wait;
        var receive = file.timings.receive;

        if (blocked >= 0)
        {
            timings.push({bar: "request.phase.Blocking",
                elapsed: blocked,
                start: startTime});
        }

        if (dns >= 0)
        {
            timings.push({bar: "request.phase.Resolving",
                elapsed: dns,
                start: startTime += (blocked < 0) ? 0 : blocked});
        }

        if (connect >= 0)
        {
            timings.push({bar: "request.phase.Connecting",
                elapsed: connect,
                start: startTime += (dns < 0) ? 0 : dns});
        }

        if (send >= 0)
        {
            timings.push({bar: "request.phase.Sending",
                elapsed: send,
                start: startTime += (connect < 0) ? 0 : connect});
        }

        if (wait >= 0)
        {
            timings.push({bar: "request.phase.Waiting",
                elapsed: wait,
                start: startTime += (send < 0) ? 0 : send});
        }

        if (receive >= 0)
        {
            timings.push({bar: "request.phase.Receiving",
                elapsed: receive,
                start: startTime += (wait < 0) ? 0 : wait,
                loaded: file.loaded, fromCache: file.fromCache});
        }

        // Insert request timing info.
        this.timingsTag.insertRows({timings: timings}, infoTip.firstChild);

        if (!page)
            return true;

        // Get page event timing info (if the page exists).
        var events = [];
        for (var i=0; i<row.phase.pageTimings.length; i++)
        {
            var timing = row.phase.pageTimings[i];
            events.push({
                bar: timing.description ? timing.description : timing.name,
                start: pageStart + timing.time - requestStart,
                classes: timing.classes,
                time: timing.time
            });
        }

        if (events.length)
        {
            events.sort(function(a, b) {
                return (a.time < b.time) ? -1 : 1;
            });

            // Insert separator and timing info.
            this.separatorTag.insertRows({label: Strings["request.timings.label"]},
                infoTip.firstChild);
            this.eventsTag.insertRows({events: events}, infoTip.firstChild);
        }

        return true;
    }
});

// ********************************************************************************************* //

var EntrySizeInfoTip = domplate(
{
    tag:
        DIV({"class": "sizeInfoTip"}, "$file|getSize"),

    zippedTag:
        DIV(
            DIV({"class": "sizeInfoTip"}, "$file|getBodySize"),
            DIV({"class": "sizeInfoTip"}, "$file|getContentSize")
        ),

    getSize: function(file)
    {
        var bodySize = file.response.bodySize;
        if (bodySize < 0)
            return Strings.unknownSize;

        return Lib.formatString(Strings.tooltipSize,
            Lib.formatSize(bodySize),
            Lib.formatNumber(bodySize));
    },

    getBodySize: function(file)
    {
        var bodySize = file.response.bodySize;
        if (bodySize < 0)
            return Strings.unknownSize;

        return Lib.formatString(Strings.tooltipZippedSize,
            Lib.formatSize(bodySize),
            Lib.formatNumber(bodySize));
    },

    getContentSize: function(file)
    {
        var contentSize = file.response.content.size;
        if (contentSize < 0)
            return Strings.unknownSize;

        return Lib.formatString(Strings.tooltipUnzippedSize,
            Lib.formatSize(contentSize),
            Lib.formatNumber(contentSize));
    },

    render: function(requestList, row, parentNode)
    {
        var input = requestList.input;
        var file = row.repObject;
        if (file.response.bodySize == file.response.content.size)
            return this.tag.replace({file: file}, parentNode);

        return this.zippedTag.replace({file: file}, parentNode);
    }
});

// ********************************************************************************************* //

return RequestList;

// ********************************************************************************************* //
}})
, {"filename":"../webapp/scripts/preview/requestList.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/nls/requestList.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/requestList.js"}
require.memoize("69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/requestList.js", 
/* See license.txt for terms of usage */

define(
{
    "root": {
        "fromCache": "From Cache",
        "menuBreakLayout": "Break Timeline Layout",
        "menuOpenRequestInWindow": "Open Request in New Window",
        "menuOpenResponseInWindow": "Open Response in New Window",
        "request": "Request",
        "requests": "Requests",

        "tooltipSize": "%S (%S bytes)",
        "tooltipZippedSize": "%S (%S bytes) - compressed",
        "tooltipUnzippedSize": "%S (%S bytes) - uncompressed",
        "unknownSize": "Unknown size",

        "request.Started": "Request start time since the beginning",
        "request.phases.label": "Request phases start and elapsed time relative to the request start:",
        "request.phase.Resolving": "DNS Lookup",
        "request.phase.Connecting": "Connecting",
        "request.phase.Blocking": "Blocking",
        "request.phase.Sending": "Sending",
        "request.phase.Waiting": "Waiting",
        "request.phase.Receiving": "Receiving",

        "request.timings.label": "Event timing relative to the request start:",
        "ContentLoad": "DOM Loaded",
        "WindowLoad": "Page Loaded",
        "page.event.Load": "Page Loaded",

        "menuBreakTimeline": "Break Timeline Layout",
        "menuOpenRequest": "Open Request in New Window",
        "menuOpenResponse": "Open Response in New Window"
    }
})
, {"filename":"../webapp/scripts/nls/requestList.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/preview/requestBody.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/requestBody.js"}
require.memoize("f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/requestBody.js", 
/* See license.txt for terms of usage */

require.def("preview/requestBody", [
    "domplate/domplate",
    "i18n!nls/requestBody",
    "core/lib",
    "core/cookies",
    "domplate/tabView",
    "core/dragdrop",
    "syntax-highlighter/shCore"
],

function(Domplate, Strings, Lib, Cookies, TabView, DragDrop, dp) { with (Domplate) {

//*************************************************************************************************
// Request Body

/**
 * @domplate This object represents a template for request body that is displayed if a request
 * is expanded within the UI. It's content is composed from set of tabs that are dynamically
 * appended as necessary (depends on actual data).
 *
 * TODO: There should be an APIs allowing to register a new tab from other modules. The same
 * approach as within the Firebug Net panel should be used.
 *
 * There are currently following tabs built-in:
 * {@link HeadersTab}: request and response headers
 * {@link ParamsTab}: URL parameters
 * {@link SentDataTab}: posted data
 * {@link ResponseTab}: request response body
 * {@link CacheTab}: browser cache entry meta-data
 * {@link HtmlTab}: Preview for HTML responses
 * {@link DataURLTab}: Data URLs
 */
function RequestBody() {}
RequestBody.prototype = domplate(
/** @lends RequestBody */
{
    render: function(parentNode, file)
    {
        // Crete tabView and append all necessary tabs.
        var tabView = new TabView("requestBody");
        if (file.response.headers.length > 0)
            tabView.appendTab(new HeadersTab(file));

        if (file.request.queryString && file.request.queryString.length)
            tabView.appendTab(new ParamsTab(file));

        if (file.request.postData)
            tabView.appendTab(new SentDataTab(file, file.request.method));

        if (file.response.content.text && file.response.content.text.length > 0)
            tabView.appendTab(new ResponseTab(file));

        //xxxHonza
        //if (file.request.cookies || file.response.cookies)
        //    tabView.appendTab(new CookiesTab(file));

        if (this.showCache(file))
            tabView.appendTab(new CacheTab(file));

        if (this.showHtml(file))
            tabView.appendTab(new HtmlTab(file));

        if (this.showDataURL(file))
            tabView.appendTab(new DataURLTab(file));

        // Finally, render the tabView and select the first tab by default
        var element = tabView.render(parentNode);
        if (tabView.tabs.length > 0)
            tabView.selectTabByName(tabView.tabs[0].id);

        return element;
    },

    showCache: function(file)
    {
        if (!file.cache)
            return false;

        if (!file.cache.afterRequest)
            return false;

        // Don't show cache tab for images 
        // xxxHonza: the tab could display the image. 
        if (file.category == "image")
            return false;

        return true;
    },

    showHtml: function(file)
    {
        return (file.response.content.mimeType == "text/html") ||
            (file.mimeType == "application/xhtml+xml");
    },

    showDataURL: function(file)
    {
        return file.request.url.indexOf("data:") == 0;
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function HeadersTab(file)
{
    this.file = file;
}

HeadersTab.prototype = domplate(TabView.Tab.prototype,
{
    id: "Headers",
    label: Strings.Headers,

    bodyTag:
        TABLE({"class": "netInfoHeadersText netInfoText netInfoHeadersTable",
                cellpadding: 0, cellspacing: 0},
            TBODY(
                TR({"class": "netInfoResponseHeadersTitle"},
                    TD({colspan: 2},
                        DIV({"class": "netInfoHeadersGroup"}, Strings.ResponseHeaders)
                    )
                ),
                TR({"class": "netInfoRequestHeadersTitle"},
                    TD({colspan: 2},
                        DIV({"class": "netInfoHeadersGroup"}, Strings.RequestHeaders)
                    )
                )
            )
        ),

    headerDataTag:
        FOR("param", "$headers",
            TR(
                TD({"class": "netInfoParamName"}, "$param.name"),
                TD({"class": "netInfoParamValue"},
                    PRE("$param|getParamValue")
                )
            )
        ),

    getParamValue: function(param)
    {
        // This value is inserted into PRE element and so, make sure the HTML isn't escaped (1210).
        // This is why the second parameter is true.
        // The PRE element preserves whitespaces so they are displayed the same, as they come from
        // the server (1194).
        return Lib.wrapText(param.value, true);
    },

    onUpdateBody: function(tabView, body)
    {
        if (this.file.response.headers)
            this.insertHeaderRows(body, this.file.response.headers, "Headers", "ResponseHeaders");

        if (this.file.request.headers)
            this.insertHeaderRows(body, this.file.request.headers, "Headers", "RequestHeaders");
    },

    insertHeaderRows: function(parentNode, headers, tableName, rowName)
    {
        var headersTable = Lib.getElementByClass(parentNode, "netInfo"+tableName+"Table");
        var titleRow = Lib.getElementByClass(headersTable, "netInfo" + rowName + "Title");

        if (headers.length)
        {
            this.headerDataTag.insertRows({headers: headers}, titleRow ? titleRow : parentNode);
            Lib.removeClass(titleRow, "collapsed");
        }
        else
        {
            Lib.setClass(titleRow, "collapsed");
        }
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function ResponseTab(file)
{
    this.file = file;
}

ResponseTab.prototype = domplate(TabView.Tab.prototype,
{
    id: "Response",
    label: Strings.Response,

    bodyTag:
        DIV({"class": "netInfoResponseText netInfoText"},
            PRE({"class": "javascript:nocontrols:nogutter:", name: "code"})
        ),

    onUpdateBody: function(tabView, body)
    {
        var responseTextBox = Lib.getElementByClass(body, "netInfoResponseText");

        if (this.file.category == "image")
        {
            Lib.clearNode(responseTextBox);

            var responseImage = body.ownerDocument.createElement("img");
            responseImage.src = this.file.href;
            responseTextBox.appendChild(responseImage, responseTextBox);
        }
        else
        {
            Lib.clearNode(responseTextBox.firstChild);

            var text = this.file.response.content.text;
            var mimeType = this.file.response.content.mimeType;

            // Highlight the syntax if the response is Javascript.
            if (mimeType == "application/javascript" || mimeType == "text/javascript" ||
                mimeType == "application/x-javascript" || mimeType == "text/ecmascript" ||
                mimeType == "application/ecmascript")
            {
                responseTextBox.firstChild.innerHTML = text;
                dp.SyntaxHighlighter.HighlightAll(responseTextBox.firstChild);
            }
            else
            {
                Lib.insertWrappedText(text, responseTextBox.firstChild);
            }
        }
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function ParamsTab(file)
{
    this.file = file;
}

ParamsTab.prototype = domplate(HeadersTab.prototype,
{
    id: "Params",
    label: Strings.URLParameters,

    bodyTag:
        TABLE({"class": "netInfoParamsText netInfoText netInfoParamsTable",
            cellpadding: 0, cellspacing: 0}, TBODY()
        ),

    onUpdateBody: function(tabView, body)
    {
        if (this.file.request.queryString)
        {
            var textBox = Lib.getElementByClass(body, "netInfoParamsText");
            this.insertHeaderRows(textBox, this.file.request.queryString, "Params");
        }
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function SentDataTab(file, method)
{
    // Convert to lower case and capitalize the first letter.
    method = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();

    this.file = file;
    this.id =  method;
    this.label = Strings[method];
}

SentDataTab.prototype = domplate(HeadersTab.prototype,
{
    bodyTag:
        DIV({"class": "netInfo$tab.id\\Text netInfoText"},
            TABLE({"class": "netInfo$tab.id\\Table", cellpadding: 0, cellspacing: 0},
                TBODY()
            )
        ),

    onUpdateBody: function(tabView, body)
    {
        var postData = this.file.request.postData;
        if (!postData)
            return;

        var textBox = Lib.getElementByClass(body, "netInfo" + this.id + "Text");
        if (postData.mimeType == "application/x-www-form-urlencoded")
            this.insertHeaderRows(textBox, postData.params, this.id);
        else
            Lib.insertWrappedText(postData.text, textBox);
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function CookiesTab(file)
{
    this.file = file;
}

CookiesTab.prototype = domplate(HeadersTab.prototype,
{
    id: "Cookies",
    label: Strings.Cookies,

    bodyTag:
        DIV({"class": "netInfoCookiesText netInfoText"},
            TABLE({"class": "netInfoCookiesTable", cellpadding: 0, cellspacing: 0},
                TBODY(
                    TR({"class": "netInfoResponseCookiesTitle"},
                        TD({colspan: 2},
                            DIV({"class": "netInfoCookiesGroup"}, Strings.ResponseCookies)
                        )
                    ),
                    TR({"class": "netInfoRequestCookiesTitle"},
                        TD({colspan: 2},
                            DIV({"class": "netInfoCookiesGroup"}, Strings.RequestCookies)
                        )
                    )
                )
            )
        ),

    onUpdateBody: function(tabView, body)
    {
        if (file.response.cookies)
        {
            var textBox = Lib.getElementByClass(body, "netInfoParamsText");
            this.insertHeaderRows(textBox, file.response.cookies, "Cookies", "ResponseCookies");
        }

        if (file.request.cookies)
        {
            var textBox = Lib.getElementByClass(body, "netInfoParamsText");
            this.insertHeaderRows(textBox, file.request.cookies, "Cookies", "RequestCookies");
        }
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

function CacheTab(file)
{
    this.file = file;
}

CacheTab.prototype = domplate(HeadersTab.prototype,
{
    id: "Cache",
    label: Strings.Cache,

    bodyTag:
        DIV({"class": "netInfoCacheText netInfoText"},
            TABLE({"class": "netInfoCacheTable", cellpadding: 0, cellspacing: 0},
                TBODY()
            )
        ),

    onUpdateBody: function(tabView, body)
    {
        if (this.file.cache && this.file.cache.afterRequest)
        {
            var cacheEntry = this.file.cache.afterRequest;

            var values = [];
            for (var prop in cacheEntry)
                values.push({name: prop, value: cacheEntry[prop]});

            this.insertHeaderRows(body, values, "Cache");
        }
    }
});

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

/**
 * @domplate Represents an HTML preview for network responses using 'text/html' or 
 * 'application/xhtml+xml' mime type.
 */
function HtmlTab(file)
/** @lends HtmlTab */
{
    this.file = file;
}

HtmlTab.prototype = domplate(HeadersTab.prototype,
{
    id: "HTML",
    label: Strings.HTML,

    bodyTag:
        DIV({"class": "netInfoHtmlText netInfoText"},
            IFRAME({"class": "netInfoHtmlPreview", onload: "$onLoad"}),
            DIV({"class": "htmlPreviewResizer"})
        ),

    onUpdateBody: function(tabView, body)
    {
        this.preview = Lib.getElementByClass(body, "netInfoHtmlPreview");

        var height = parseInt(Cookies.getCookie("htmlPreviewHeight"));
        if (!isNaN(height))
            this.preview.style.height = height + "px";

        var handler = Lib.getElementByClass(body, "htmlPreviewResizer");
        this.resizer = new DragDrop.Tracker(handler, {
            onDragStart: Lib.bind(this.onDragStart, this),
            onDragOver: Lib.bind(this.onDragOver, this),
            onDrop: Lib.bind(this.onDrop, this)
        });
    },

    onLoad: function(event)
    {
        var e = Lib.fixEvent(event);
        var self = Lib.getAncestorByClass(e.target, "tabHTMLBody").repObject;
        self.preview.contentWindow.document.body.innerHTML = self.file.response.content.text;
    },

    onDragStart: function(tracker)
    {
        var body = Lib.getBody(this.preview.ownerDocument);
        body.setAttribute("hResizing", "true");
        this.startHeight = this.preview.clientHeight;
    },

    onDragOver: function(newPos, tracker)
    {
        var newHeight = (this.startHeight + newPos.y);
        this.preview.style.height = newHeight + "px";
        Cookies.setCookie("htmlPreviewHeight", newHeight);
    },

    onDrop: function(tracker)
    {
        var body = Lib.getBody(this.preview.ownerDocument);
        body.removeAttribute("hResizing");
    }
});

/**
 * @domplate Represents a request body tab displaying unescaped data: URLs.
 */
function DataURLTab(file)
/** @lends DataURLTab */
{
    this.file = file;
}

DataURLTab.prototype = domplate(HeadersTab.prototype,
{
    id: "DataURL",
    label: Strings.DataURL,

    bodyTag:
        DIV({"class": "netInfoDataURLText netInfoText"}),

    onUpdateBody: function(tabView, body)
    {
        var textBox = Lib.getElementByClass(body, "netInfoDataURLText");
        var data = this.file.request.url;

        if (data.indexOf("data:image") == 0)
        {
            var image = body.ownerDocument.createElement("img");
            image.src = data;
            textBox.appendChild(image);
        }
        else
        {
            Lib.insertWrappedText(unescape(data), textBox);
        }
    }
});

//*************************************************************************************************

return RequestBody;

//*************************************************************************************************
}})
, {"filename":"../webapp/scripts/preview/requestBody.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/nls/requestBody.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/requestBody.js"}
require.memoize("69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/requestBody.js", 
/* See license.txt for terms of usage */

define(
{
    "root": {
        "RequestHeaders": "Request Headers",
        "ResponseHeaders": "Response Headers",
        "RequestCookies": "Request Cookies",
        "ResponseCookies": "Response Cookies",
        "URLParameters": "Params",
        "Headers": "Headers",
        "Post": "Post",
        "Put": "Put",
        "Cookies": "Cookies",
        "Response": "Response",
        "Cache": "Cache",
        "HTML": "HTML",
        "DataURL": "Data URL"
    }
})
, {"filename":"../webapp/scripts/nls/requestBody.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/core/dragdrop.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"3d84302dc73ad91f3bb53e7af2525a4ab1cbb6a9-core/dragdrop.js"}
require.memoize("3d84302dc73ad91f3bb53e7af2525a4ab1cbb6a9-core/dragdrop.js", 
/* See license.txt for terms of usage */

require.def("core/dragdrop", [
    "core/lib"
],

function(Lib) {

// ********************************************************************************************* //

/**
 * 
 * @param {Object} element
 * @param {Object} handle
 * @param {Object} callbacks: onDragStart, onDragOver, onDragLeave, onDrop
 */
function Tracker(handle, callbacks)
{
    this.element = handle;
    this.handle = handle;
    this.callbacks = callbacks;

    this.cursorStartPos = null;
    this.cursorLastPos = null;
    //this.elementStartPos = null;
    this.dragging = false;

    // Start listening
    this.onDragStart = Lib.bind(this.onDragStart, this);
    this.onDragOver = Lib.bind(this.onDragOver, this);
    this.onDrop = Lib.bind(this.onDrop, this);

    Lib.addEventListener(this.element, "mousedown", this.onDragStart, false);
    this.active = true;
}

Tracker.prototype =
{
    onDragStart: function(event)
    {
        var e = Lib.fixEvent(event);

        if (this.dragging)
            return;

        if (this.callbacks.onDragStart)
            this.callbacks.onDragStart(this);

        this.dragging = true;
        this.cursorStartPos = absoluteCursorPosition(e);
        this.cursorLastPos = this.cursorStartPos;
        //this.elementStartPos = new Position(
        //    parseInt(this.element.style.left),
        //    parseInt(this.element.style.top));

        Lib.addEventListener(this.element.ownerDocument, "mousemove", this.onDragOver, false);
        Lib.addEventListener(this.element.ownerDocument, "mouseup", this.onDrop, false);

        Lib.cancelEvent(e);
    },

    onDragOver: function(event)
    {
        if (!this.dragging)
            return;

        var e = Lib.fixEvent(event);
        Lib.cancelEvent(e);

        var newPos = absoluteCursorPosition(e);
        //newPos = newPos.Add(this.elementStartPos);
        var newPos = newPos.Subtract(this.cursorStartPos);
        //newPos = newPos.Bound(lowerBound, upperBound);
        //newPos.Apply(this.element);

        // Only fire event if the position has been changed.
        if (this.cursorLastPos.x == newPos.x && this.cursorLastPos.y == newPos.y)
            return;

        if (this.callbacks.onDragOver != null)
        {
            var result = this.callbacks.onDragOver(newPos, this);
            this.cursorLastPos = newPos;
        }

    },

    onDrop: function(event)
    {
        if (!this.dragging)
            return;

        var e = Lib.fixEvent(event);
        Lib.cancelEvent(e);

        this.dragStop();
    },

    dragStop: function()
    {
        if (!this.dragging)
            return;

        Lib.removeEventListener(this.element.ownerDocument, "mousemove", this.onDragOver, false);
        Lib.removeEventListener(this.element.ownerDocument, "mouseup", this.onDrop, false);

        this.cursorStartPos = null;
        this.cursorLastPos = null;
        //this.elementStartPos = null;

        if (this.callbacks.onDrop != null)
            this.callbacks.onDrop(this);

        this.dragging = false;
    },

    destroy: function()
    {
        Lib.removeEventListener(this.element, "mousedown", this.onDragStart, false);
        this.active = false;

        if (this.dragging)
            this.dragStop();
    }
}

// ********************************************************************************************* //

function Position(x, y)
{
    this.x = x;
    this.y = y;

    this.Add = function(val)
    {
        var newPos = new Position(this.x, this.y);
        if (val != null)
        {
            if(!isNaN(val.x))
                newPos.x += val.x;
            if(!isNaN(val.y))
                newPos.y += val.y
        }
        return newPos;
    }
 
    this.Subtract = function(val)
    {
        var newPos = new Position(this.x, this.y);
        if (val != null)
        {
            if(!isNaN(val.x))
                newPos.x -= val.x;
            if(!isNaN(val.y))
                newPos.y -= val.y
        }
        return newPos;
    }

    this.Bound = function(lower, upper)
    {
        var newPos = this.Max(lower);
        return newPos.Min(upper);
    }

    this.Check = function()
    {
        var newPos = new Position(this.x, this.y);
        if (isNaN(newPos.x))
            newPos.x = 0;

        if (isNaN(newPos.y))
            newPos.y = 0;

        return newPos;
    }

    this.Apply = function(element)
    {
        if (typeof(element) == "string")
            element = document.getElementById(element);

        if (!element)
            return;

        if(!isNaN(this.x))
            element.style.left = this.x + "px";

        if(!isNaN(this.y))
            element.style.top = this.y + "px";
    }
}

// ********************************************************************************************* //

function absoluteCursorPosition(e)
{
    if (isNaN(window.scrollX))
    {
        return new Position(e.clientX + document.documentElement.scrollLeft
            + document.body.scrollLeft, e.clientY + document.documentElement.scrollTop
            + document.body.scrollTop);
    }
    else
    {
        return new Position(e.clientX + window.scrollX, e.clientY + window.scrollY);
    }
}

// ********************************************************************************************* //

var DragDrop = {};
DragDrop.Tracker = Tracker;

return DragDrop;

// ********************************************************************************************* //
})
, {"filename":"../webapp/scripts/core/dragdrop.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/syntax-highlighter/shCore.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"96035c6ff9c9225d2ce6a8e192b7e7d3b4a8550e-syntax-highlighter/shCore.js"}
require.memoize("96035c6ff9c9225d2ce6a8e192b7e7d3b4a8550e-syntax-highlighter/shCore.js", 
require.def("syntax-highlighter/shCore", [], function() {

//*************************************************************************************************

/**
 * Code Syntax Highlighter.
 * Version 1.5.1
 * Copyright (C) 2004-2007 Alex Gorbatchev.
 * http://www.dreamprojections.com/syntaxhighlighter/
 * 
 * This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General 
 * Public License as published by the Free Software Foundation; either version 2.1 of the License, or (at your option) 
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more 
 * details.
 *
 * You should have received a copy of the GNU Lesser General Public License along with this library; if not, write to 
 * the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA 
 */

//
// create namespaces
//
var dp = {
	sh :
	{
		Toolbar : {},
		Utils	: {},
		RegexLib: {},
		Brushes	: {},
		Strings : {
			AboutDialog : '<html><head><title>About...</title></head><body class="dp-about"><table cellspacing="0"><tr><td class="copy"><p class="title">dp.SyntaxHighlighter</div><div class="para">Version: {V}</p><p><a href="http://www.dreamprojections.com/syntaxhighlighter/?ref=about" target="_blank">http://www.dreamprojections.com/syntaxhighlighter</a></p>&copy;2004-2007 Alex Gorbatchev.</td></tr><tr><td class="footer"><input type="button" class="close" value="OK" onClick="window.close()"/></td></tr></table></body></html>'
		},
		ClipboardSwf : null,
		Version : '1.5.1'
	}
};

// make an alias
dp.SyntaxHighlighter = dp.sh;

//
// Toolbar functions
//

dp.sh.Toolbar.Commands = {
	ExpandSource: {
		label: '+ expand source',
		check: function(highlighter) { return highlighter.collapse; },
		func: function(sender, highlighter)
		{
			sender.parentNode.removeChild(sender);
			highlighter.div.className = highlighter.div.className.replace('collapsed', '');
		}
	},
	
	// opens a new windows and puts the original unformatted source code inside.
	ViewSource: {
		label: 'view plain',
		func: function(sender, highlighter)
		{
			var code = dp.sh.Utils.FixForBlogger(highlighter.originalCode).replace(/</g, '&lt;');
			var wnd = window.open('', '_blank', 'width=750, height=400, location=0, resizable=1, menubar=0, scrollbars=0');
			wnd.document.write('<textarea style="width:99%;height:99%">' + code + '</textarea>');
			wnd.document.close();
		}
	},
	
	// Copies the original source code in to the clipboard. Uses either IE only method or Flash object if ClipboardSwf is set
	CopyToClipboard: {
		label: 'copy to clipboard',
		check: function() { return window.clipboardData != null || dp.sh.ClipboardSwf != null; },
		func: function(sender, highlighter)
		{
			var code = dp.sh.Utils.FixForBlogger(highlighter.originalCode)
				.replace(/&lt;/g,'<')
				.replace(/&gt;/g,'>')
				.replace(/&amp;/g,'&')
			;
			
			if(window.clipboardData)
			{
				window.clipboardData.setData('text', code);
			}
			else if(dp.sh.ClipboardSwf != null)
			{
				var flashcopier = highlighter.flashCopier;
				
				if(flashcopier == null)
				{
					flashcopier = document.createElement('div');
					highlighter.flashCopier = flashcopier;
					highlighter.div.appendChild(flashcopier);
				}
				
				flashcopier.innerHTML = '<embed src="' + dp.sh.ClipboardSwf + '" FlashVars="clipboard='+encodeURIComponent(code)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
			}
			
			alert('The code is in your clipboard now');
		}
	},
	
	// creates an invisible iframe, puts the original source code inside and prints it
	PrintSource: {
		label: 'print',
		func: function(sender, highlighter)
		{
			var iframe = document.createElement('IFRAME');
			var doc = null;

			// this hides the iframe
			iframe.style.cssText = 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;';
			
			document.body.appendChild(iframe);
			doc = iframe.contentWindow.document;

			dp.sh.Utils.CopyStyles(doc, window.document);
			doc.write('<div class="' + highlighter.div.className.replace('collapsed', '') + ' printing">' + highlighter.div.innerHTML + '</div>');
			doc.close();

			iframe.contentWindow.focus();
			iframe.contentWindow.print();
			
			alert('Printing...');
			
			document.body.removeChild(iframe);
		}
	},
	
	About: {
		label: '?',
		func: function(highlighter)
		{
			var wnd	= window.open('', '_blank', 'dialog,width=300,height=150,scrollbars=0');
			var doc	= wnd.document;

			dp.sh.Utils.CopyStyles(doc, window.document);
			
			doc.write(dp.sh.Strings.AboutDialog.replace('{V}', dp.sh.Version));
			doc.close();
			wnd.focus();
		}
	}
};

// creates a <div /> with all toolbar links
dp.sh.Toolbar.Create = function(highlighter)
{
	var div = document.createElement('DIV');
	
	div.className = 'tools';
	
	for(var name in dp.sh.Toolbar.Commands)
	{
		var cmd = dp.sh.Toolbar.Commands[name];
		
		if(cmd.check != null && !cmd.check(highlighter))
			continue;
		
		div.innerHTML += '<a href="#" onclick="dp.sh.Toolbar.Command(\'' + name + '\',this);return false;">' + cmd.label + '</a>';
	}
	
	return div;
}

// executes toolbar command by name
dp.sh.Toolbar.Command = function(name, sender)
{
	var n = sender;
	
	while(n != null && n.className.indexOf('dp-highlighter') == -1)
		n = n.parentNode;
	
	if(n != null)
		dp.sh.Toolbar.Commands[name].func(sender, n.highlighter);
}

// copies all <link rel="stylesheet" /> from 'target' window to 'dest'
dp.sh.Utils.CopyStyles = function(destDoc, sourceDoc)
{
	var links = sourceDoc.getElementsByTagName('link');

	for(var i = 0; i < links.length; i++)
		if(links[i].rel.toLowerCase() == 'stylesheet')
			destDoc.write('<link type="text/css" rel="stylesheet" href="' + links[i].href + '"></link>');
}

dp.sh.Utils.FixForBlogger = function(str)
{
	return (dp.sh.isBloggerMode == true) ? str.replace(/<br\s*\/?>|&lt;br\s*\/?&gt;/gi, '\n') : str;
}

//
// Common reusable regular expressions
//
dp.sh.RegexLib = {
	MultiLineCComments : new RegExp('/\\*[\\s\\S]*?\\*/', 'gm'),
	SingleLineCComments : new RegExp('//.*$', 'gm'),
	SingleLinePerlComments : new RegExp('#.*$', 'gm'),
	DoubleQuotedString : new RegExp('"(?:\\.|(\\\\\\")|[^\\""\\n])*"','g'),
	SingleQuotedString : new RegExp("'(?:\\.|(\\\\\\')|[^\\''\\n])*'", 'g')
};

//
// Match object
//
dp.sh.Match = function(value, index, css)
{
	this.value = value;
	this.index = index;
	this.length = value.length;
	this.css = css;
}

//
// Highlighter object
//
dp.sh.Highlighter = function()
{
	this.noGutter = false;
	this.addControls = true;
	this.collapse = false;
	this.tabsToSpaces = true;
	this.wrapColumn = 80;
	this.showColumns = true;
}

// static callback for the match sorting
dp.sh.Highlighter.SortCallback = function(m1, m2)
{
	// sort matches by index first
	if(m1.index < m2.index)
		return -1;
	else if(m1.index > m2.index)
		return 1;
	else
	{
		// if index is the same, sort by length
		if(m1.length < m2.length)
			return -1;
		else if(m1.length > m2.length)
			return 1;
	}
	return 0;
}

dp.sh.Highlighter.prototype.CreateElement = function(name)
{
	var result = document.createElement(name);
	result.highlighter = this;
	return result;
}

// gets a list of all matches for a given regular expression
dp.sh.Highlighter.prototype.GetMatches = function(regex, css)
{
	var index = 0;
	var match = null;

	while((match = regex.exec(this.code)) != null)
		this.matches[this.matches.length] = new dp.sh.Match(match[0], match.index, css);
}

dp.sh.Highlighter.prototype.AddBit = function(str, css)
{
	if(str == null || str.length == 0)
		return;

	var span = this.CreateElement('SPAN');
	
//	str = str.replace(/&/g, '&amp;');
	str = str.replace(/ /g, '&nbsp;');
	str = str.replace(/</g, '&lt;');
//	str = str.replace(/&lt;/g, '<');
//	str = str.replace(/>/g, '&gt;');
	str = str.replace(/\n/gm, '&nbsp;<br>');

	// when adding a piece of code, check to see if it has line breaks in it 
	// and if it does, wrap individual line breaks with span tags
	if(css != null)
	{
		if((/br/gi).test(str))
		{
			var lines = str.split('&nbsp;<br>');
			
			for(var i = 0; i < lines.length; i++)
			{
				span = this.CreateElement('SPAN');
				span.className = css;
				span.innerHTML = lines[i];
				
				this.div.appendChild(span);
				
				// don't add a <BR> for the last line
				if(i + 1 < lines.length)
					this.div.appendChild(this.CreateElement('BR'));
			}
		}
		else
		{
			span.className = css;
			span.innerHTML = str;
			this.div.appendChild(span);
		}
	}
	else
	{
		span.innerHTML = str;
		this.div.appendChild(span);
	}
}

// checks if one match is inside any other match
dp.sh.Highlighter.prototype.IsInside = function(match)
{
	if(match == null || match.length == 0)
		return false;
	
	for(var i = 0; i < this.matches.length; i++)
	{
		var c = this.matches[i];
		
		if(c == null)
			continue;

		if((match.index > c.index) && (match.index < c.index + c.length))
			return true;
	}
	
	return false;
}

dp.sh.Highlighter.prototype.ProcessRegexList = function()
{
	for(var i = 0; i < this.regexList.length; i++)
		this.GetMatches(this.regexList[i].regex, this.regexList[i].css);
}

dp.sh.Highlighter.prototype.ProcessSmartTabs = function(code)
{
	var lines	= code.split('\n');
	var result	= '';
	var tabSize	= 4;
	var tab		= '\t';

	// This function inserts specified amount of spaces in the string
	// where a tab is while removing that given tab. 
	function InsertSpaces(line, pos, count)
	{
		var left	= line.substr(0, pos);
		var right	= line.substr(pos + 1, line.length);	// pos + 1 will get rid of the tab
		var spaces	= '';
		
		for(var i = 0; i < count; i++)
			spaces += ' ';
		
		return left + spaces + right;
	}

	// This function process one line for 'smart tabs'
	function ProcessLine(line, tabSize)
	{
		if(line.indexOf(tab) == -1)
			return line;

		var pos = 0;

		while((pos = line.indexOf(tab)) != -1)
		{
			// This is pretty much all there is to the 'smart tabs' logic.
			// Based on the position within the line and size of a tab, 
			// calculate the amount of spaces we need to insert.
			var spaces = tabSize - pos % tabSize;
			
			line = InsertSpaces(line, pos, spaces);
		}
		
		return line;
	}

	// Go through all the lines and do the 'smart tabs' magic.
	for(var i = 0; i < lines.length; i++)
		result += ProcessLine(lines[i], tabSize) + '\n';
	
	return result;
}

dp.sh.Highlighter.prototype.SwitchToList = function()
{
	// thanks to Lachlan Donald from SitePoint.com for this <br/> tag fix.
	var html = this.div.innerHTML.replace(/<(br)\/?>/gi, '\n');
	var lines = html.split('\n');
	
	if(this.addControls == true)
		this.bar.appendChild(dp.sh.Toolbar.Create(this));

	// add columns ruler
	if(this.showColumns)
	{
		var div = this.CreateElement('div');
		var columns = this.CreateElement('div');
		var showEvery = 10;
		var i = 1;
		
		while(i <= 150)
		{
			if(i % showEvery == 0)
			{
				div.innerHTML += i;
				i += (i + '').length;
			}
			else
			{
				div.innerHTML += '&middot;';
				i++;
			}
		}
		
		columns.className = 'columns';
		columns.appendChild(div);
		this.bar.appendChild(columns);
	}

	for(var i = 0, lineIndex = this.firstLine; i < lines.length - 1; i++, lineIndex++)
	{
		var li = this.CreateElement('LI');
		var span = this.CreateElement('SPAN');
		
		// uses .line1 and .line2 css styles for alternating lines
		li.className = (i % 2 == 0) ? 'alt' : '';
		span.innerHTML = lines[i] + '&nbsp;';

		li.appendChild(span);
		this.ol.appendChild(li);
	}
	
	this.div.innerHTML	= '';
}

dp.sh.Highlighter.prototype.Highlight = function(code)
{
	function Trim(str)
	{
		return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
	}
	
	function Chop(str)
	{
		return str.replace(/\n*$/, '').replace(/^\n*/, '');
	}

	function Unindent(str)
	{
		var lines = dp.sh.Utils.FixForBlogger(str).split('\n');
		var indents = new Array();
		var regex = new RegExp('^\\s*', 'g');
		var min = 1000;

		// go through every line and check for common number of indents
		for(var i = 0; i < lines.length && min > 0; i++)
		{
			if(Trim(lines[i]).length == 0)
				continue;
				
			var matches = regex.exec(lines[i]);

			if(matches != null && matches.length > 0)
				min = Math.min(matches[0].length, min);
		}

		// trim minimum common number of white space from the begining of every line
		if(min > 0)
			for(var i = 0; i < lines.length; i++)
				lines[i] = lines[i].substr(min);

		return lines.join('\n');
	}
	
	// This function returns a portions of the string from pos1 to pos2 inclusive
	function Copy(string, pos1, pos2)
	{
		return string.substr(pos1, pos2 - pos1);
	}

	var pos	= 0;
	
	if(code == null)
		code = '';
	
	this.originalCode = code;
	this.code = Chop(Unindent(code));
	this.div = this.CreateElement('DIV');
	this.bar = this.CreateElement('DIV');
	this.ol = this.CreateElement('OL');
	this.matches = new Array();

	this.div.className = 'dp-highlighter';
	this.div.highlighter = this;
	
	this.bar.className = 'bar';
	
	// set the first line
	this.ol.start = this.firstLine;

	if(this.CssClass != null)
		this.ol.className = this.CssClass;

	if(this.collapse)
		this.div.className += ' collapsed';
	
	if(this.noGutter)
		this.div.className += ' nogutter';

	// replace tabs with spaces
	if(this.tabsToSpaces == true)
		this.code = this.ProcessSmartTabs(this.code);

	this.ProcessRegexList();	

	// if no matches found, add entire code as plain text
	if(this.matches.length == 0)
	{
		this.AddBit(this.code, null);
		this.SwitchToList();
		this.div.appendChild(this.bar);
		this.div.appendChild(this.ol);
		return;
	}

	// sort the matches
	this.matches = this.matches.sort(dp.sh.Highlighter.SortCallback);

	// The following loop checks to see if any of the matches are inside
	// of other matches. This process would get rid of highligted strings
	// inside comments, keywords inside strings and so on.
	for(var i = 0; i < this.matches.length; i++)
		if(this.IsInside(this.matches[i]))
			this.matches[i] = null;

	// Finally, go through the final list of matches and pull the all
	// together adding everything in between that isn't a match.
	for(var i = 0; i < this.matches.length; i++)
	{
		var match = this.matches[i];

		if(match == null || match.length == 0)
			continue;

		this.AddBit(Copy(this.code, pos, match.index), null);
		this.AddBit(match.value, match.css);

		pos = match.index + match.length;
	}
	
	this.AddBit(this.code.substr(pos), null);

	this.SwitchToList();
	this.div.appendChild(this.bar);
	this.div.appendChild(this.ol);
}

dp.sh.Highlighter.prototype.GetKeywords = function(str) 
{
	return '\\b' + str.replace(/ /g, '\\b|\\b') + '\\b';
}

dp.sh.BloggerMode = function()
{
	dp.sh.isBloggerMode = true;
}

// highlightes all elements identified by name and gets source code from specified property
dp.sh.HighlightAll = function(name, showGutter /* optional */, showControls /* optional */, collapseAll /* optional */, firstLine /* optional */, showColumns /* optional */)
{
	function FindValue()
	{
		var a = arguments;
		
		for(var i = 0; i < a.length; i++)
		{
			if(a[i] == null)
				continue;
				
			if(typeof(a[i]) == 'string' && a[i] != '')
				return a[i] + '';
		
			if(typeof(a[i]) == 'object' && a[i].value != '')
				return a[i].value + '';
		}
		
		return null;
	}
	
	function IsOptionSet(value, list)
	{
		for(var i = 0; i < list.length; i++)
			if(list[i] == value)
				return true;
		
		return false;
	}
	
	function GetOptionValue(name, list, defaultValue)
	{
		var regex = new RegExp('^' + name + '\\[(\\w+)\\]$', 'gi');
		var matches = null;

		for(var i = 0; i < list.length; i++)
			if((matches = regex.exec(list[i])) != null)
				return matches[1];
		
		return defaultValue;
	}
	
	function FindTagsByName(list, name, tagName)
	{
		var tags = document.getElementsByTagName(tagName);

		for(var i = 0; i < tags.length; i++)
			if(tags[i].getAttribute('name') == name)
				list.push(tags[i]);
	}

	var elements = [];
	var highlighter = null;
	var registered = {};
	var propertyName = 'innerHTML';

	// for some reason IE doesn't find <pre/> by name, however it does see them just fine by tag name...
    if (typeof(name) == "string")
    {
        FindTagsByName(elements, name, 'pre');
        FindTagsByName(elements, name, 'textarea');
    }
    else
    {
        elements.push(name);
    }

	if(elements.length == 0)
		return;

	// register all brushes
	for(var brush in dp.sh.Brushes)
	{
		var aliases = dp.sh.Brushes[brush].Aliases;

		if(aliases == null)
			continue;
		
		for(var i = 0; i < aliases.length; i++)
			registered[aliases[i]] = brush;
	}

	for(var i = 0; i < elements.length; i++)
	{
		var element = elements[i];
		var options = FindValue(
				element.attributes['class'], element.className, 
				element.attributes['language'], element.language
				);
		var language = '';
		
		if(options == null)
			continue;
		
		options = options.split(':');
		
		language = options[0].toLowerCase();

		if(registered[language] == null)
			continue;
		
		// instantiate a brush
		highlighter = new dp.sh.Brushes[registered[language]]();
		
		// hide the original element
		element.style.display = 'none';

		highlighter.noGutter = (showGutter == null) ? IsOptionSet('nogutter', options) : !showGutter;
		highlighter.addControls = (showControls == null) ? !IsOptionSet('nocontrols', options) : showControls;
		highlighter.collapse = (collapseAll == null) ? IsOptionSet('collapse', options) : collapseAll;
		highlighter.showColumns = (showColumns == null) ? IsOptionSet('showcolumns', options) : showColumns;

		// write out custom brush style
		var headNode = document.getElementsByTagName('head')[0];
		if(highlighter.Style && headNode)
		{
			var styleNode = document.createElement('style');
			styleNode.setAttribute('type', 'text/css');

			if(styleNode.styleSheet) // for IE
			{
				styleNode.styleSheet.cssText = highlighter.Style;
			}
			else // for everyone else
			{
				var textNode = document.createTextNode(highlighter.Style);
				styleNode.appendChild(textNode);
			}

			headNode.appendChild(styleNode);
		}
		
		// first line idea comes from Andrew Collington, thanks!
		highlighter.firstLine = (firstLine == null) ? parseInt(GetOptionValue('firstline', options, 1)) : firstLine;

		highlighter.Highlight(element[propertyName]);
		
		highlighter.source = element;

		element.parentNode.insertBefore(highlighter.div, element);
	}	
}

//*************************************************************************************************

dp.sh.Brushes.JScript = function()
{
    var keywords =  'abstract boolean break byte case catch char class const continue debugger ' +
                    'default delete do double else enum export extends false final finally float ' +
                    'for function goto if implements import in instanceof int interface long native ' +
                    'new null package private protected public return short static super switch ' +
                    'synchronized this throw throws transient true try typeof var void volatile while with';

    this.regexList = [
        { regex: dp.sh.RegexLib.SingleLineCComments,                css: 'comment' },           // one line comments
        { regex: dp.sh.RegexLib.MultiLineCComments,                 css: 'comment' },           // multiline comments
        { regex: dp.sh.RegexLib.DoubleQuotedString,                 css: 'string' },            // double quoted strings
        { regex: dp.sh.RegexLib.SingleQuotedString,                 css: 'string' },            // single quoted strings
        { regex: new RegExp('^\\s*#.*', 'gm'),                      css: 'preprocessor' },      // preprocessor tags like #region and #endregion
        { regex: new RegExp(this.GetKeywords(keywords), 'gm'),      css: 'keyword' }            // keywords
        ];

    this.CssClass = 'dp-c';
}

dp.sh.Brushes.JScript.prototype = new dp.sh.Highlighter();
dp.sh.Brushes.JScript.Aliases   = ['js', 'jscript', 'javascript'];

return dp;

//*************************************************************************************************
})
, {"filename":"../webapp/scripts/syntax-highlighter/shCore.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/nls/pageList.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/pageList.js"}
require.memoize("69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/pageList.js", 
/* See license.txt for terms of usage */

define(
{
    "root": {
        "column.label.url": "URL",
        "column.label.status": "Status",
        "column.label.type": "Type",
        "column.label.domain": "Domain",
        "column.label.size": "Size",
        "column.label.timeline": "Timeline",
        "action.label.Reset": "Reset"
    }
})
, {"filename":"../webapp/scripts/nls/pageList.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/preview/validationError.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/validationError.js"}
require.memoize("f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/validationError.js", 
/* See license.txt for terms of usage */

require.def("preview/validationError", [
    "domplate/domplate",
    "core/lib",
    "core/trace",
    "domplate/popupMenu"
],

function(Domplate, Lib, Trace, Menu) { with (Domplate) {

// ********************************************************************************************* //
// Template for displaying validation errors

var ValidationError = domplate(
{
    // Used in case of parsing or validation errors.
    errorTable:
        TABLE({"class": "errorTable", cellpadding: 3, cellspacing: 0},
            TBODY(
                FOR("error", "$errors",
                    TR({"class": "errorRow", _repObject: "$error"},
                        TD({"class": "errorProperty"},
                            SPAN("$error.property")
                        ),
                        TD({"class": "errorOptions", $hasTarget: "$error|hasTarget"},
                            DIV({"class": "errorOptionsTarget", onclick: "$onOpenOptions"},
                                "&nbsp;"
                            )
                        ),
                        TD("&nbsp;"),
                        TD({"class": "errorMessage"},
                            SPAN("$error.message"
                            )
                        )
                    )
                )
            )
        ),

    hasTarget: function(error)
    {
        return error.input && error.file;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Events

    onOpenOptions: function(event)
    {
        var e = Lib.fixEvent(event);
        Lib.cancelEvent(event);

        if (!Lib.isLeftClick(event))
            return;

        var target = e.target;

        // Collect all menu items.
        var row = Lib.getAncestorByClass(target, "errorRow");
        var error = row.repObject;
        if (!error || !error.input || !error.file)
            return;

        var items = this.getMenuItems(error.input, error.file);
        if (!items.length)
            return;

        // Finally, display the the popup menu.
        // xxxHonza: the old <DIV> can be still visible.
        var menu = new Menu({id: "requestContextMenu", items: items});
        menu.showPopup(target);
    },

    getMenuItems: function(input, file)
    {
        var items = [];
        Lib.dispatch(this.listeners, "getMenuItems", [items, input, file]);
        return items;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Listeners

    listeners: [],

    addListener: function(listener)
    {
        this.listeners.push(listener);
    },

    removeListener: function(listener)
    {
        Lib.remove(this.listeners, listener);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Tab

    appendError: function(err, parentNode)
    {
        if (err.errors)
            this.errorTable.append(err, parentNode);
    }
});

// ********************************************************************************************* //

return ValidationError;

// ********************************************************************************************* //
}})
, {"filename":"../webapp/scripts/preview/validationError.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/downloadify/js/swfobject.js","mtime":1421118649,"wrapper":"commonjs/leaky","format":"leaky","id":"c30b6689ef7c41935eb1ccfc56f2e9e66b000881-downloadify/js/swfobject.js"}
require.memoize("c30b6689ef7c41935eb1ccfc56f2e9e66b000881-downloadify/js/swfobject.js", 
function(require, exports, module) {var __dirname = '../webapp/scripts/downloadify/js';
/* SWFObject v2.1 <http://code.google.com/p/swfobject/>
	Copyright (c) 2007-2008 Geoff Stearns, Michael Williams, and Bobby van der Sluis
	This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/
var swfobject=function(){var b="undefined",Q="object",n="Shockwave Flash",p="ShockwaveFlash.ShockwaveFlash",P="application/x-shockwave-flash",m="SWFObjectExprInst",j=window,K=document,T=navigator,o=[],N=[],i=[],d=[],J,Z=null,M=null,l=null,e=false,A=false;var h=function(){var v=typeof K.getElementById!=b&&typeof K.getElementsByTagName!=b&&typeof K.createElement!=b,AC=[0,0,0],x=null;if(typeof T.plugins!=b&&typeof T.plugins[n]==Q){x=T.plugins[n].description;if(x&&!(typeof T.mimeTypes!=b&&T.mimeTypes[P]&&!T.mimeTypes[P].enabledPlugin)){x=x.replace(/^.*\s+(\S+\s+\S+$)/,"$1");AC[0]=parseInt(x.replace(/^(.*)\..*$/,"$1"),10);AC[1]=parseInt(x.replace(/^.*\.(.*)\s.*$/,"$1"),10);AC[2]=/r/.test(x)?parseInt(x.replace(/^.*r(.*)$/,"$1"),10):0}}else{if(typeof j.ActiveXObject!=b){var y=null,AB=false;try{y=new ActiveXObject(p+".7")}catch(t){try{y=new ActiveXObject(p+".6");AC=[6,0,21];y.AllowScriptAccess="always"}catch(t){if(AC[0]==6){AB=true}}if(!AB){try{y=new ActiveXObject(p)}catch(t){}}}if(!AB&&y){try{x=y.GetVariable("$version");if(x){x=x.split(" ")[1].split(",");AC=[parseInt(x[0],10),parseInt(x[1],10),parseInt(x[2],10)]}}catch(t){}}}}var AD=T.userAgent.toLowerCase(),r=T.platform.toLowerCase(),AA=/webkit/.test(AD)?parseFloat(AD.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,q=false,z=r?/win/.test(r):/win/.test(AD),w=r?/mac/.test(r):/mac/.test(AD);/*@cc_on q=true;@if(@_win32)z=true;@elif(@_mac)w=true;@end@*/return{w3cdom:v,pv:AC,webkit:AA,ie:q,win:z,mac:w}}();var L=function(){if(!h.w3cdom){return }f(H);if(h.ie&&h.win){try{K.write("<script id=__ie_ondomload defer=true src=//:><\/script>");J=C("__ie_ondomload");if(J){I(J,"onreadystatechange",S)}}catch(q){}}if(h.webkit&&typeof K.readyState!=b){Z=setInterval(function(){if(/loaded|complete/.test(K.readyState)){E()}},10)}if(typeof K.addEventListener!=b){K.addEventListener("DOMContentLoaded",E,null)}R(E)}();function S(){if(J.readyState=="complete"){J.parentNode.removeChild(J);E()}}function E(){if(e){return }if(h.ie&&h.win){var v=a("span");try{var u=K.getElementsByTagName("body")[0].appendChild(v);u.parentNode.removeChild(u)}catch(w){return }}e=true;if(Z){clearInterval(Z);Z=null}var q=o.length;for(var r=0;r<q;r++){o[r]()}}function f(q){if(e){q()}else{o[o.length]=q}}function R(r){if(typeof j.addEventListener!=b){j.addEventListener("load",r,false)}else{if(typeof K.addEventListener!=b){K.addEventListener("load",r,false)}else{if(typeof j.attachEvent!=b){I(j,"onload",r)}else{if(typeof j.onload=="function"){var q=j.onload;j.onload=function(){q();r()}}else{j.onload=r}}}}}function H(){var t=N.length;for(var q=0;q<t;q++){var u=N[q].id;if(h.pv[0]>0){var r=C(u);if(r){N[q].width=r.getAttribute("width")?r.getAttribute("width"):"0";N[q].height=r.getAttribute("height")?r.getAttribute("height"):"0";if(c(N[q].swfVersion)){if(h.webkit&&h.webkit<312){Y(r)}W(u,true)}else{if(N[q].expressInstall&&!A&&c("6.0.65")&&(h.win||h.mac)){k(N[q])}else{O(r)}}}}else{W(u,true)}}}function Y(t){var q=t.getElementsByTagName(Q)[0];if(q){var w=a("embed"),y=q.attributes;if(y){var v=y.length;for(var u=0;u<v;u++){if(y[u].nodeName=="DATA"){w.setAttribute("src",y[u].nodeValue)}else{w.setAttribute(y[u].nodeName,y[u].nodeValue)}}}var x=q.childNodes;if(x){var z=x.length;for(var r=0;r<z;r++){if(x[r].nodeType==1&&x[r].nodeName=="PARAM"){w.setAttribute(x[r].getAttribute("name"),x[r].getAttribute("value"))}}}t.parentNode.replaceChild(w,t)}}function k(w){A=true;var u=C(w.id);if(u){if(w.altContentId){var y=C(w.altContentId);if(y){M=y;l=w.altContentId}}else{M=G(u)}if(!(/%$/.test(w.width))&&parseInt(w.width,10)<310){w.width="310"}if(!(/%$/.test(w.height))&&parseInt(w.height,10)<137){w.height="137"}K.title=K.title.slice(0,47)+" - Flash Player Installation";var z=h.ie&&h.win?"ActiveX":"PlugIn",q=K.title,r="MMredirectURL="+j.location+"&MMplayerType="+z+"&MMdoctitle="+q,x=w.id;if(h.ie&&h.win&&u.readyState!=4){var t=a("div");x+="SWFObjectNew";t.setAttribute("id",x);u.parentNode.insertBefore(t,u);u.style.display="none";var v=function(){u.parentNode.removeChild(u)};I(j,"onload",v)}U({data:w.expressInstall,id:m,width:w.width,height:w.height},{flashvars:r},x)}}function O(t){if(h.ie&&h.win&&t.readyState!=4){var r=a("div");t.parentNode.insertBefore(r,t);r.parentNode.replaceChild(G(t),r);t.style.display="none";var q=function(){t.parentNode.removeChild(t)};I(j,"onload",q)}else{t.parentNode.replaceChild(G(t),t)}}function G(v){var u=a("div");if(h.win&&h.ie){u.innerHTML=v.innerHTML}else{var r=v.getElementsByTagName(Q)[0];if(r){var w=r.childNodes;if(w){var q=w.length;for(var t=0;t<q;t++){if(!(w[t].nodeType==1&&w[t].nodeName=="PARAM")&&!(w[t].nodeType==8)){u.appendChild(w[t].cloneNode(true))}}}}}return u}function U(AG,AE,t){var q,v=C(t);if(v){if(typeof AG.id==b){AG.id=t}if(h.ie&&h.win){var AF="";for(var AB in AG){if(AG[AB]!=Object.prototype[AB]){if(AB.toLowerCase()=="data"){AE.movie=AG[AB]}else{if(AB.toLowerCase()=="styleclass"){AF+=' class="'+AG[AB]+'"'}else{if(AB.toLowerCase()!="classid"){AF+=" "+AB+'="'+AG[AB]+'"'}}}}}var AD="";for(var AA in AE){if(AE[AA]!=Object.prototype[AA]){AD+='<param name="'+AA+'" value="'+AE[AA]+'" />'}}v.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+AF+">"+AD+"</object>";i[i.length]=AG.id;q=C(AG.id)}else{if(h.webkit&&h.webkit<312){var AC=a("embed");AC.setAttribute("type",P);for(var z in AG){if(AG[z]!=Object.prototype[z]){if(z.toLowerCase()=="data"){AC.setAttribute("src",AG[z])}else{if(z.toLowerCase()=="styleclass"){AC.setAttribute("class",AG[z])}else{if(z.toLowerCase()!="classid"){AC.setAttribute(z,AG[z])}}}}}for(var y in AE){if(AE[y]!=Object.prototype[y]){if(y.toLowerCase()!="movie"){AC.setAttribute(y,AE[y])}}}v.parentNode.replaceChild(AC,v);q=AC}else{var u=a(Q);u.setAttribute("type",P);for(var x in AG){if(AG[x]!=Object.prototype[x]){if(x.toLowerCase()=="styleclass"){u.setAttribute("class",AG[x])}else{if(x.toLowerCase()!="classid"){u.setAttribute(x,AG[x])}}}}for(var w in AE){if(AE[w]!=Object.prototype[w]&&w.toLowerCase()!="movie"){F(u,w,AE[w])}}v.parentNode.replaceChild(u,v);q=u}}}return q}function F(t,q,r){var u=a("param");u.setAttribute("name",q);u.setAttribute("value",r);t.appendChild(u)}function X(r){var q=C(r);if(q&&(q.nodeName=="OBJECT"||q.nodeName=="EMBED")){if(h.ie&&h.win){if(q.readyState==4){B(r)}else{j.attachEvent("onload",function(){B(r)})}}else{q.parentNode.removeChild(q)}}}function B(t){var r=C(t);if(r){for(var q in r){if(typeof r[q]=="function"){r[q]=null}}r.parentNode.removeChild(r)}}function C(t){var q=null;try{q=K.getElementById(t)}catch(r){}return q}function a(q){return K.createElement(q)}function I(t,q,r){t.attachEvent(q,r);d[d.length]=[t,q,r]}function c(t){var r=h.pv,q=t.split(".");q[0]=parseInt(q[0],10);q[1]=parseInt(q[1],10)||0;q[2]=parseInt(q[2],10)||0;return(r[0]>q[0]||(r[0]==q[0]&&r[1]>q[1])||(r[0]==q[0]&&r[1]==q[1]&&r[2]>=q[2]))?true:false}function V(v,r){if(h.ie&&h.mac){return }var u=K.getElementsByTagName("head")[0],t=a("style");t.setAttribute("type","text/css");t.setAttribute("media","screen");if(!(h.ie&&h.win)&&typeof K.createTextNode!=b){t.appendChild(K.createTextNode(v+" {"+r+"}"))}u.appendChild(t);if(h.ie&&h.win&&typeof K.styleSheets!=b&&K.styleSheets.length>0){var q=K.styleSheets[K.styleSheets.length-1];if(typeof q.addRule==Q){q.addRule(v,r)}}}function W(t,q){var r=q?"visible":"hidden";if(e&&C(t)){C(t).style.visibility=r}else{V("#"+t,"visibility:"+r)}}function g(s){var r=/[\\\"<>\.;]/;var q=r.exec(s)!=null;return q?encodeURIComponent(s):s}var D=function(){if(h.ie&&h.win){window.attachEvent("onunload",function(){var w=d.length;for(var v=0;v<w;v++){d[v][0].detachEvent(d[v][1],d[v][2])}var t=i.length;for(var u=0;u<t;u++){X(i[u])}for(var r in h){h[r]=null}h=null;for(var q in swfobject){swfobject[q]=null}swfobject=null})}}();return{registerObject:function(u,q,t){if(!h.w3cdom||!u||!q){return }var r={};r.id=u;r.swfVersion=q;r.expressInstall=t?t:false;N[N.length]=r;W(u,false)},getObjectById:function(v){var q=null;if(h.w3cdom){var t=C(v);if(t){var u=t.getElementsByTagName(Q)[0];if(!u||(u&&typeof t.SetVariable!=b)){q=t}else{if(typeof u.SetVariable!=b){q=u}}}}return q},embedSWF:function(x,AE,AB,AD,q,w,r,z,AC){if(!h.w3cdom||!x||!AE||!AB||!AD||!q){return }AB+="";AD+="";if(c(q)){W(AE,false);var AA={};if(AC&&typeof AC===Q){for(var v in AC){if(AC[v]!=Object.prototype[v]){AA[v]=AC[v]}}}AA.data=x;AA.width=AB;AA.height=AD;var y={};if(z&&typeof z===Q){for(var u in z){if(z[u]!=Object.prototype[u]){y[u]=z[u]}}}if(r&&typeof r===Q){for(var t in r){if(r[t]!=Object.prototype[t]){if(typeof y.flashvars!=b){y.flashvars+="&"+t+"="+r[t]}else{y.flashvars=t+"="+r[t]}}}}f(function(){U(AA,y,AE);if(AA.id==AE){W(AE,true)}})}else{if(w&&!A&&c("6.0.65")&&(h.win||h.mac)){A=true;W(AE,false);f(function(){var AF={};AF.id=AF.altContentId=AE;AF.width=AB;AF.height=AD;AF.expressInstall=w;k(AF)})}}},getFlashPlayerVersion:function(){return{major:h.pv[0],minor:h.pv[1],release:h.pv[2]}},hasFlashPlayerVersion:c,createSWF:function(t,r,q){if(h.w3cdom){return U(t,r,q)}else{return undefined}},removeSWF:function(q){if(h.w3cdom){X(q)}},createCSS:function(r,q){if(h.w3cdom){V(r,q)}},addDomLoadEvent:f,addLoadEvent:R,getQueryParamValue:function(v){var u=K.location.search||K.location.hash;if(v==null){return g(u)}if(u){var t=u.substring(1).split("&");for(var r=0;r<t.length;r++){if(t[r].substring(0,t[r].indexOf("="))==v){return g(t[r].substring((t[r].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(A&&M){var q=C(m);if(q){q.parentNode.replaceChild(M,q);if(l){W(l,true);if(h.ie&&h.win){M.style.display="block"}}M=null;l=null;A=false}}}}}();
window.swfobject = swfobject;
return {
    swfobject: (typeof swfobject !== "undefined") ? swfobject : null,
    parseInt: (typeof parseInt !== "undefined") ? parseInt : null,
    parseFloat: (typeof parseFloat !== "undefined") ? parseFloat : null,
    setInterval: (typeof setInterval !== "undefined") ? setInterval : null,
    clearInterval: (typeof clearInterval !== "undefined") ? clearInterval : null,
    Object: (typeof Object !== "undefined") ? Object : null,
    encodeURIComponent: (typeof encodeURIComponent !== "undefined") ? encodeURIComponent : null,
    window: (typeof window !== "undefined") ? window : null
};
}
, {"filename":"../webapp/scripts/downloadify/js/swfobject.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/downloadify/src/downloadify.js","mtime":1421118649,"wrapper":"amd","format":"amd","id":"c30b6689ef7c41935eb1ccfc56f2e9e66b000881-downloadify/src/downloadify.js"}
require.memoize("c30b6689ef7c41935eb1ccfc56f2e9e66b000881-downloadify/src/downloadify.js", 
/*
	Downloadify: Client Side File Creation
	JavaScript + Flash Library
	
	Version: 0.1

	Copyright (c) 2009 Douglas C. Neiner

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

define([
	"jquery/jquery"
], function (jQuery) {

(function(){
	Downloadify = window.Downloadify = {
		queue: {},
		uid: new Date().getTime(), 
		getTextForSave: function(queue){
			var obj = Downloadify.queue[queue];
			if(obj) return obj.getData();
			return "";
		},
		getFileNameForSave: function(queue){
			var obj = Downloadify.queue[queue];
			if(obj) return obj.getFilename();
			return "";
		},
		saveComplete: function(queue){
			var obj = Downloadify.queue[queue];
			if(obj) obj.complete();
			return true;
		},
		saveCancel: function(queue){
			var obj = Downloadify.queue[queue];
			if(obj) obj.cancel();
			return true;
		},
		saveError: function(queue){
			var obj = Downloadify.queue[queue];
			if(obj) obj.error();
			return true;
		},
		addToQueue: function(container){
			Downloadify.queue[container.queue_name] = container;
		},
		// Concept adapted from: http://tinyurl.com/yzsyfto
		// SWF object runs off of ID's, so this is the good way to get a unique ID
		getUID: function(el){
			if(el.id == "") el.id = 'downloadify_' + Downloadify.uid++;
			return el.id;
		}
	};
 
	Downloadify.create = function( idOrDOM, options ){
		var el = (typeof(idOrDOM) == "string" ? document.getElementById(idOrDOM) : idOrDOM );
		return new Downloadify.Container(el, options);
	};
 
	Downloadify.Container = function(el, options){
		var base = this;
 
		base.el = el;
		base.enabled = true;
		base.dataCallback = null;
		base.filenameCallback = null;
		base.data = null;
		base.filename = null;
 
 		var init = function(){
 			base.options = options;

			if( !base.options.append ) base.el.innerHTML = "";
			
			base.flashContainer = document.createElement('span');
			base.el.appendChild(base.flashContainer);
				
			base.queue_name = Downloadify.getUID( base.flashContainer );
 
 			if( typeof(base.options.filename) === "function" )
 				base.filenameCallback = base.options.filename;
 			else if (base.options.filename)
				base.filename = base.options.filename;

			if( typeof(base.options.data) === "function" )
				base.dataCallback = base.options.data;
			else if (base.options.data)
				base.data = base.options.data;
				
				
			var flashVars = {
				queue_name: base.queue_name,
				width: base.options.width,
				height: base.options.height
			};
			
			var params = {
				allowScriptAccess: 'always'
			};
			
			var attributes = {
				id: base.flashContainer.id,
				name: base.flashContainer.id
			};
			
			if(base.options.enabled === false) base.enabled = false;
			
			if(base.options.transparent === true) params.wmode = "transparent";
			
			if(base.options.downloadImage) flashVars.downloadImage = base.options.downloadImage;
			
			window.swfobject.embedSWF(base.options.swf, base.flashContainer.id, base.options.width, base.options.height, "10", null, flashVars, params, attributes );

			Downloadify.addToQueue( base );
 		};

		base.enable = function(){
			var swf = document.getElementById(base.flashContainer.id);
			swf.setEnabled(true);
			base.enabled = true;
		};
		
		base.disable = function(){
			var swf = document.getElementById(base.flashContainer.id);
			swf.setEnabled(false);
			base.enabled = false;
		};
 
		base.getData = function(){
			if( !base.enabled ) return "";
			if( base.dataCallback ) return base.dataCallback();
			else if (base.data) return base.data;
			else return "";
		};
 
		base.getFilename = function(){
			if( base.filenameCallback ) return base.filenameCallback();
			else if (base.filename) return base.filename;
			else return "";
		};
		
		base.complete = function(){
			if( typeof(base.options.onComplete) === "function" ) base.options.onComplete();
		};
		
		base.cancel = function(){
			if( typeof(base.options.onCancel) === "function" ) base.options.onCancel();
		};
		
		base.error = function(){
			if( typeof(base.options.onError) === "function" ) base.options.onError();
		};
	
		init();
	};
	
	Downloadify.defaultOptions = {
		swf: 'media/downloadify.swf',
		downloadImage: 'images/download.png',
		width: 100,
		height: 30,
		transparent: true,
		append: false 
	};
})();
// Support for jQuery
if(typeof(jQuery) != "undefined"){
	(function($){
		$.fn.downloadify = function(options){
			return this.each(function(){
				options = $.extend({}, Downloadify.defaultOptions, options);
				var dl = Downloadify.create( this, options);
				$(this).data('Downloadify', dl);	
			});
		};
	})(jQuery);
};

})
, {"filename":"../webapp/scripts/downloadify/src/downloadify.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/tabs/schemaTab.js","mtime":1420521913,"wrapper":"amd","format":"amd","id":"9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/schemaTab.js"}
require.memoize("9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/schemaTab.js", 
/* See license.txt for terms of usage */

require.def("tabs/schemaTab", [
    "jquery/jquery",
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/harViewer",
    "syntax-highlighter/shCore",
    "core/trace",
    "require"
],

function($, Domplate, TabView, Lib, Strings, dp, Trace, require) { with (Domplate) {

//*************************************************************************************************
// Home Tab

function SchemaTab() {}
SchemaTab.prototype =
{
    id: "Schema",
    label: Strings.schemaTabLabel,

    bodyTag:
        PRE({"class": "javascript:nocontrols:", name: "code"}),

    onUpdateBody: function(tabView, body)
    {
        require(["text!preview/harSchema.js"], function(source)
        {
            var code = body.firstChild;
            code.innerHTML = (typeof source === "string") ? source : JSON.stringify(source, null, 4);
            dp.SyntaxHighlighter.HighlightAll(code);
        });
    }
};

return SchemaTab;

//*************************************************************************************************
}})
, {"filename":"../webapp/scripts/tabs/schemaTab.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/tabs/domTab.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/domTab.js"}
require.memoize("9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/domTab.js", 
/* See license.txt for terms of usage */

require.def("tabs/domTab", [
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/domTab",
    "domplate/toolbar",
    "tabs/search",
    "core/dragdrop",
    "domplate/domTree",
    "core/cookies",
    "domplate/tableView",
    "core/trace",
    "json-query/JSONQuery"
],

function(Domplate, TabView, Lib, Strings, Toolbar, Search, DragDrop, DomTree, Cookies,
    TableView, Trace) {

with (Domplate) {

// ********************************************************************************************* //
// Home Tab

// Search options
var jsonQueryOption = "searchJsonQuery";

function DomTab()
{
    this.toolbar = new Toolbar();
    this.toolbar.addButtons(this.getToolbarButtons());

    // Display jsonQuery results as a tree by default.
    this.tableView = false;
}

DomTab.prototype = domplate(TabView.Tab.prototype,
{
    id: "DOM",
    label: Strings.domTabLabel,

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Domplates

    separator:
        DIV({"class": "separator"}),

    tabBodyTag:
        DIV({"class": "tab$tab.id\\Body tabBody", _repObject: "$tab"},
            DIV({"class": "domToolbar"}),
            DIV({"class": "domContent"})
        ),

    domBox:
        TABLE({"class": "domBox", cellpadding: 0, cellspacing: 0},
            TBODY(
                TR(
                    TD({"class": "content"},
                        DIV({"class": "title"}, "$title")
                    ),
                    TD({"class": "splitter"}),
                    TD({"class": "results"},
                        DIV({"class": "resultsDefaultContent"},
                            Strings.searchResultsDefaultText
                        )
                    )
                )
            )
        ),

    queryResultsViewType:
        DIV({"class": "queryResultsViewType"},
            INPUT({"class": "type", type: "checkbox", onclick: "$onTableView"}),
                SPAN({"class": "label"},
                Strings.queryResultsTableView
            )
        ),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Tab

    onUpdateBody: function(tabView, body)
    {
        this.toolbar.render(Lib.$(body, "domToolbar"));

        // Lib.selectElementText doesn't support IE.
        if (Lib.isIE)
        {
            var searchBox = Lib.getElementByClass(body, "searchBox");

            var searchInput = Lib.getElementByClass(searchBox, "searchInput");
            searchInput.setAttribute("disabled", "true");
            searchInput.setAttribute("title", Strings.searchDisabledForIE);

            var searchOptions = Lib.getElementByClass(searchBox, "arrow");
            searchOptions.setAttribute("disabled", "true");
        }

        this.updateSearchResultsUI();

        // TODO: Re-render the entire tab content here
    },

    getToolbarButtons: function()
    {
        var buttons = [];

        /*buttons.push({
            id: "tableView",
            tag: this.tableBtn
        });*/

        buttons.push({
            id: "search",
            tag: Search.Box.tag,
            initialize: Search.Box.initialize
        });

        return buttons;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Search

    createSearchObject: function(text)
    {
        // There can be more HAR files/logs displayed.
        var tables = Lib.getElementsByClass(this._body, "domTable");
        tables = Lib.cloneArray(tables);

        // Get all inputs (ie. HAR log files).
        var inputs = tables.map(function(a) { return a.repObject.input; });

        // Instantiate search object for this panel.
        return new Search.ObjectSearch(text, inputs, false, false);
    },

    getSearchOptions: function()
    {
        var options = [];

        // JSON Query
        options.push({
            label: Strings.searchOptionJsonQuery,
            checked: Cookies.getBooleanCookie(jsonQueryOption),
            command: Lib.bindFixed(this.onOption, this, jsonQueryOption)
        });

        return options;
    },

    onOption: function(name)
    {
        Search.Box.onOption(name);

        this.updateSearchResultsUI();
    },

    updateSearchResultsUI: function()
    {
        var value = Cookies.getBooleanCookie(jsonQueryOption);

        // There can be more HAR files/logs displayed.
        var boxes = Lib.getElementsByClass(this._body, "domBox");
        for (var i = 0; i < boxes.length; i++)
        {
            var box = boxes[i];
            var results = Lib.getElementByClass(box, "results");
            var splitter = Lib.getElementByClass(box, "splitter");

            if (value)
            {
                Lib.setClass(results, "visible");
                Lib.setClass(splitter, "visible");
            }
            else
            {
                Lib.removeClass(results, "visible");
                Lib.removeClass(splitter, "visible");
            }

        }

        var searchInput = Lib.getElementByClass(this._body, "searchInput");
        if (searchInput)
        {
            var placeholder = value ? Strings.jsonQueryPlaceholder : Strings.searchPlaceholder;
            searchInput.setAttribute("placeholder", placeholder);
        }

        var searchInput = Lib.getElementByClass(this._body, "searchInput");
    },

    onSearch: function(text, keyCode)
    {
        var jsonQuery = Cookies.getBooleanCookie(jsonQueryOption);
        if (jsonQuery)
            return this.evalJsonQuery(text, keyCode);

        // Avoid searches for short texts.
        if (text.length < 3)
            return true;

        // Clear previous search if the text has changed.
        if (this.currSearch && this.currSearch.text != text)
            this.currSearch = null;

        // Create new search object if necessary. This objects holds current search
        // position and other meta data.
        if (!this.currSearch)
            this.currSearch = this.createSearchObject(text);

        // Search (or continue to search) through the JSON structure. The method returns
        // true if a match is found.
        if (this.currSearch.findNext(text))
        {
            // The root of search data is the list of inputs, the second is the
            // current input (where match has been found).
            var currentInput = this.currSearch.stack[1].object;
            var tree = this.getDomTree(currentInput);

            // Let's expand the tree so, the found value is displayed to the user.
            // Iterate over all current parents.
            for (var i=0; i<this.currSearch.stack.length; i++)
                tree.expandRow(this.currSearch.stack[i].object);

            // A match corresponds to a node-value in the HAR log.
            var match = this.currSearch.getCurrentMatch();
            var row = tree.getRow(match.value);
            if (row)
            {
                var valueText = row.querySelector(".memberValueCell .objectBox");
                this.currSearch.selectText(valueText.firstChild);
                Lib.scrollIntoCenterView(valueText);
            }

            return true;
        }
        else
        {
            // Nothing has been found or we have reached the end. Reset the search object so,
            // the search starts from the begginging again.
            if (this.currSearch.matches.length > 0)
                this.currSearch = this.createSearchObject(text);

            return false;
        }
    },

    evalJsonQuery: function(expr, keyCode)
    {
        // JSON Path is executed when enter key is pressed.
        if (keyCode != 13)
            return true;

        // Eval the expression for all logs.
        var boxes = Lib.getElementsByClass(this._body, "domBox");
        for (var i=0; i<boxes.length; i++)
        {
            var box = boxes[i];
            var table = Lib.getElementByClass(box, "domTable");
            var input = table.repObject.input;

            var parentNode = box.querySelector(".domBox .results");
            Lib.clearNode(parentNode);

            try
            {
                var viewType = this.queryResultsViewType.append({}, parentNode);
                if (this.tableView)
                {
                    var type = Lib.getElementByClass(viewType, "type");
                    type.setAttribute("checked", "true");
                }

                var result = JSONQuery(expr, input);
                parentNode.repObject = result;

                if (this.tableView)
                {
                    TableView.render(parentNode, result);
                }
                else
                {
                    var domTree = new DomTree(result);
                    domTree.append(parentNode);
                }
            }
            catch (err)
            {
                Trace.exception(err);
            }
        }

        return true;
    },

    onTableView: function(event)
    {
        var e = Lib.fixEvent(event);
        var target = e.target;

        var tab = Lib.getAncestorByClass(target, "tabBody");
        var tableView = $(target).attr("checked");
        tab.repObject.tableView = tableView;

        var resultBox = Lib.getAncestorByClass(target, "results");
        var result = resultBox.repObject;

        // Clean up
        var tree = Lib.getElementByClass(resultBox, "domTable");
        if (tree)
            tree.parentNode.removeChild(tree);

        var table = Lib.getElementByClass(resultBox, "dataTableSizer");
        if (table)
            table.parentNode.removeChild(table);

        if (tableView)
        {
            TableView.render(resultBox, result);
        }
        else
        {
            var domTree = new DomTree(result);
            domTree.append(resultBox);
        }
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Public

    append: function(input)
    {
        var content = Lib.$(this._body, "domContent");

        // Iterate all pages and get titles.
        var titles = [];
        for (var i=0; i<input.log.pages.length; i++)
        {
            var page = input.log.pages[i];
            titles.push(page.title);
        }

        // Create box for DOM tree + render list of titles for this log.
        var box = this.domBox.append({title: titles.join(", ")}, content);
        var domContent = Lib.getElementByClass(box, "content");

        // Initialize splitter for JSON path query results area.
        var element = Lib.getElementByClass(box, "splitter");
        this.splitter = new DragDrop.Tracker(element, {
            onDragStart: Lib.bind(this.onDragStart, this),
            onDragOver: Lib.bind(this.onDragOver, this),
            onDrop: Lib.bind(this.onDrop, this)
        });

        this.updateSearchResultsUI();

        // Render log structure as an expandable tree.
        var domTree = new DomTree(input);
        domTree.append(domContent);

        // Separate the next HAR log (e.g. dropped as a local file).
        this.separator.append({}, content);
    },

    getDomTree: function(input)
    {
        // Iterate all existing dom-trees. There can be more if more logs
        // is currently displayed. 
        var tables = Lib.getElementsByClass(this._body, "domTable");
        for (var i=0; i<tables.length; i++)
        {
            var tree = tables[i].repObject;
            if (tree.input == input) 
                return tree;
        }
        return null;
    },

    highlightFile: function(input, file)
    {
        // Iterate all input HAR logs.
        var tree = this.getDomTree(input);
        if (!tree)
            return;

        // Expand the root and 'entries' node.
        tree.expandRow(input.log);
        tree.expandRow(input.log.entries);

        // Now expand the file node and highlight it.
        var row = tree.expandRow(file);
        if (row)
            Lib.setClassTimed(row, "jumpHighlight");

        // Scroll the tree so, the highlighted entry is visible.
        //xxxHonza: a little hacky
        var content = Lib.$(this._body, "domContent");
        content.scrollTop = row.offsetTop;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Splitter

    onDragStart: function(tracker)
    {
        var body = Lib.getBody(this._body.ownerDocument);
        body.setAttribute("vResizing", "true");

        var box = Lib.getAncestorByClass(tracker.element, "domBox");
        var element = Lib.getElementByClass(box, "content");
        this.startWidth = element.clientWidth;
    },

    onDragOver: function(newPos, tracker)
    {
        var box = Lib.getAncestorByClass(tracker.element, "domBox");
        var content = Lib.getElementByClass(box, "content");
        var newWidth = (this.startWidth + newPos.x);
        content.style.width = newWidth + "px";
    },

    onDrop: function(tracker)
    {
        var body = Lib.getBody(this._body.ownerDocument);
        body.removeAttribute("vResizing");
    }
});

// ********************************************************************************************* //

return DomTab;

// ********************************************************************************************* //
}})
, {"filename":"../webapp/scripts/tabs/domTab.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/nls/domTab.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/domTab.js"}
require.memoize("69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/domTab.js", 
/* See license.txt for terms of usage */

define(
{
    "root": {
        "domTabLabel": "HAR",
        "searchDisabledForIE": "You need Mozilla or WebKit based browser to search in HAR",
        "searchOptionJsonQuery": "JSON Query",
        "tableView": "Table View",
        "searchResultsDefaultText": "JSON Query Results",
        "searchPlaceholder": "Search",
        "jsonQueryPlaceholder": "JSON Query",
        "queryResultsTableView": "Table View"
    }
})
, {"filename":"../webapp/scripts/nls/domTab.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/tabs/search.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/search.js"}
require.memoize("9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/search.js", 
/* See license.txt for terms of usage */

require.def("tabs/search", [
    "domplate/domplate",
    "core/lib",
    "i18n!nls/search",
    "domplate/toolbar",
    "domplate/popupMenu",
    "core/cookies",
    "core/dragdrop"
],

function(Domplate, Lib, Strings, Toolbar, Menu, Cookies, DragDrop) { with (Domplate) {

// ********************************************************************************************* //
// Search

// Module object
var Search = {};

// Default options
var caseSensitiveOption = "searchCaseSensitive";

// ********************************************************************************************* //
// Search Box

/**
 * Domplate template for search input box. Should be inserted into a {@Toolbar}.
 */
Search.Box = domplate(
{
    tag:
        SPAN({"class": "searchBox"},
            SPAN({"class": "toolbarSeparator resizer"},
                "&nbsp;"
            ),
            SPAN({"class": "searchTextBox"},
                INPUT({"class": "searchInput", type: "text", placeholder: Strings.search,
                    onkeydown: "$onKeyDown"}
                ),
                SPAN({"class": "arrow", onclick: "$onOpenOptions"},
                    "&nbsp;"
                )
            )
        ),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Events

    onKeyDown: function(event)
    {
        var e = $.event.fix(event || window.event);
        var tab = Lib.getAncestorByClass(e.target, "tabBody");

        var searchInput = Lib.getElementByClass(tab, "searchInput");
        setTimeout(Lib.bindFixed(this.search, this, tab, e.keyCode, searchInput.value));
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Implementation

    initialize: function(element)
    {
        var searchInput = Lib.getElementByClass(element, "searchInput");
        var resizer = Lib.getElementByClass(element, "resizer");
        Search.Resizer.initialize(searchInput, resizer);
    },

    search: function(tab, keyCode, prevText)
    {
        var searchBox = Lib.getElementByClass(tab, "searchBox");
        var searchInput = Lib.getElementByClass(tab, "searchInput");
        searchInput.removeAttribute("status");

        var text = searchInput.value;

        // Support for incremental search, changing the text also causes search.
        if (text == prevText && keyCode != 13)
            return;

        // The search input box looses focus if something is selected on the page
        // So, switch off the incremental search for webkit (works only on Enter)
        if (keyCode != 13 && Lib.isWebkit)
            return;

        var result = tab.repObject.onSearch(text, keyCode);

        // Red background if there is no match.
        if (!result)
            searchInput.setAttribute("status", "notfound");
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Options

    onOpenOptions: function(event)
    {
        var e = Lib.fixEvent(event);
        Lib.cancelEvent(event);

        if (!Lib.isLeftClick(event))
            return;

        var target = e.target;
        var items = this.getMenuItems(target);

        // Finally, display the the popup menu.
        // xxxHonza: the old <DIV> can be still visible.
        var menu = new Menu({id: "searchOptions", items: items});
        menu.showPopup(target);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Menu Definition

    getMenuItems: function(target)
    {
        var tab = Lib.getAncestorByClass(target, "tabBody");
        var items = tab.repObject.getSearchOptions();

        items.push("-");
        items.push({
            label: Strings.caseSensitive,
            checked: Cookies.getBooleanCookie(caseSensitiveOption),
            command: Lib.bindFixed(this.onOption, this, caseSensitiveOption)
        });

        return items;
    },

    onOption: function(name)
    {
        Cookies.toggleCookie(name);

        var searchInput = Lib.getElementByClass(document.documentElement, "searchInput");
        searchInput.removeAttribute("status");
    }
});

// ********************************************************************************************* //
// Object Search

/**
 * Implements search over object properties and children objects. There should be no
 * cycles in the scanned object hierarchy.
 * 
 * @param {Object} text Text to search for.
 * @param {Object} object The input object to search.
 * @param {Object} reverse If true search is made backwards.
 * @param {Object} caseSensitive If true the search is case sensitive.
 */
Search.ObjectSearch = function(text, object, reverse, caseSensitive)
{
    this.text = text;
    this.reverse = reverse;
    this.caseSensitive = caseSensitive;

    // Helper stack as an alternative for recursive tree iteration.
    this.stack = [];

    // The search can't use recursive approach to iterate the tree of objects.
    // Instad we have a helper persistent stack that holds the current position
    // in the tree. This way the user can see individual matches step by step.
    //
    // object: current object in the tree.
    // propIndex: index of the last found property with matched value.
    // startOffset: index of the match within the value (there can be more matches in it)
    this.stack.push({
        object: object,
        propIndex: 0,
        startOffset: -1
    });

    // Array of matched values.
    this.matches = [];
}

Search.ObjectSearch.prototype =
{
    findNext: function(text)
    {
        // All children objects of the passed object are pushed on to the stack
        // for further scan.
        while (this.stack.length > 0)
        {
            var scope = this.getCurrentScope();
            var result = this.find(scope);
            if (result)
                return result;
        }

        // No match
        return false;
    },

    find: function(scope)
    {
        var propIndex = 0;
        for (var p in scope.object)
        {
            propIndex++;

            // Ignore properties that have been already scaned and also ignore the
            // last property if its value has been searched till the end (startOffset == -1).
            if (scope.propIndex >= propIndex)
                continue;

            // Ignore empty values.
            var value = scope.object[p];
            if (!value)
                continue;

            scope.propIndex = propIndex;

            // Any children object are pushed on the stack and scaned in the next call.
            if (typeof(value) == "object")
            {
                // Put child on the stack (alternative for recursion).
                this.stack.push({
                    propIndex: 0,
                    object: value,
                    startOffset: -1
                });

                // And iterate the child in the next cycle.
                return false;
            }

            // Convert to lower case in case of non case sensitive search.
            var tempText = this.text;
            var tempValue = value + "";

            if (!Cookies.getBooleanCookie(caseSensitiveOption))
            {
                tempValue = tempValue.toLowerCase();
                tempText = tempText.toLowerCase();
            }

            // Search for occurence of the text. Start searching since the beggingin
            // if this is the first time we are scanning the value. Otherwise continue
            // from the last position.
            var startOffset = (scope.startOffset < 0) ? 0 : scope.startOffset;
            var offset = tempValue.indexOf(tempText, startOffset);
            if (offset >= 0)
            {
                // Make sure that the value will be yet scanned for more occurences
                // in the next cycle.
                scope.propIndex += -1;
                scope.startOffset = offset + tempText.length;

                // Remember the match.
                this.matches.push({
                    value: value,
                    startOffset: offset
                })

                // One occurence found.
                return true;
            }
        }

        // Entire object in this scope scanned so remove it from the stack.
        this.stack.pop();

        return false;
    },

    getCurrentScope: function()
    {
        return this.stack[this.stack.length - 1];
    },

    getCurrentMatch: function()
    {
        return this.matches[this.matches.length - 1];
    },

    selectText: function(textNode)
    {
        var match = this.getCurrentMatch();
        Lib.selectElementText(textNode, match.startOffset, match.startOffset + this.text.length);
    }
}

// ********************************************************************************************* //

Search.Resizer = domplate(
{
    initialize: function(searchInput, resizer)
    {
        this.searchInput = searchInput;
        this.tracker = new DragDrop.Tracker(resizer, {
            onDragStart: Lib.bind(this.onDragStart, this),
            onDragOver: Lib.bind(this.onDragOver, this),
            onDrop: Lib.bind(this.onDrop, this)
        });
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Splitter

    onDragStart: function(tracker)
    {
        var body = Lib.getBody(this.searchInput.ownerDocument);
        body.setAttribute("vResizing", "true");

        //xxxHonza: the padding (20) should not be hardcoded.
        this.startWidth = this.searchInput.clientWidth - 20;
    },

    onDragOver: function(newPos, tracker)
    {
        var newWidth = (this.startWidth - newPos.x);
        var toolbar = Lib.getAncestorByClass(this.searchInput, "toolbar");
        if (newWidth > toolbar.clientWidth - 40)
            return;

        this.searchInput.style.width = newWidth + "px";
    },

    onDrop: function(tracker)
    {
        var body = Lib.getBody(this.searchInput.ownerDocument);
        body.removeAttribute("vResizing");
    }
});

// ********************************************************************************************* //

return Search;

// ********************************************************************************************* //
}})
, {"filename":"../webapp/scripts/tabs/search.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/nls/search.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/search.js"}
require.memoize("69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/search.js", 
/* See license.txt for terms of usage */

define(
{
    "root": {
        "search": "Search",
        "caseSensitive": "Case Sensitive"
    }
})
, {"filename":"../webapp/scripts/nls/search.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/domplate/domTree.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/domTree.js"}
require.memoize("bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/domTree.js", 
/* See license.txt for terms of usage */

require.def("domplate/domTree", [
    "domplate/domplate",
    "core/lib",
    "core/trace"
],

function(Domplate, Lib, Trace) { with (Domplate) {

// ********************************************************************************************* //

function DomTree(input)
{
    this.input = input;
}

/**
 * @domplate Represents a tree of properties/objects
 */
DomTree.prototype = domplate(
{
    tag:
        TABLE({"class": "domTable", cellpadding: 0, cellspacing: 0, onclick: "$onClick"},
            TBODY(
                FOR("member", "$object|memberIterator", 
                    TAG("$member|getRowTag", {member: "$member"}))
            )
        ),

    rowTag:
        TR({"class": "memberRow $member.open $member.type\\Row $member|hasChildren", 
            $hasChildren: "$member|hasChildren",
            _repObject: "$member", level: "$member.level"},
            TD({"class": "memberLabelCell", style: "padding-left: $member.indent\\px"},
                SPAN({"class": "memberLabel $member.type\\Label"}, "$member.name")
            ),
            TD({"class": "memberValueCell"},
                TAG("$member.tag", {object: "$member|getValue"})
            )
        ),

    loop:
        FOR("member", "$members", 
            TAG("$member|getRowTag", {member: "$member"})),

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    hasChildren: function(object)
    {
        return object.hasChildren ? "hasChildren" : "";
    },

    memberIterator: function(object)
    {
        return this.getMembers(object);
    },

    getValue: function(member)
    {
        return member.value;
    },

    getRowTag: function(member)
    {
        return this.rowTag;
    },

    onClick: function(event)
    {
        var e = Lib.fixEvent(event);
        if (!Lib.isLeftClick(e))
            return;

        var row = Lib.getAncestorByClass(e.target, "memberRow");
        var label = Lib.getAncestorByClass(e.target, "memberLabel");
        if (label && Lib.hasClass(row, "hasChildren"))
            this.toggleRow(row);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //

    toggleRow: function(row, forceOpen)
    {
        if (!row)
            return;

        var level = parseInt(row.getAttribute("level"));
        if (forceOpen && Lib.hasClass(row, "opened"))
            return;

        if (Lib.hasClass(row, "opened"))
        {
            Lib.removeClass(row, "opened");

            var tbody = row.parentNode;
            for (var firstRow = row.nextSibling; firstRow; firstRow = row.nextSibling)
            {
                if (parseInt(firstRow.getAttribute("level")) <= level)
                    break;
                tbody.removeChild(firstRow);
            }
        }
        else
        {
            Lib.setClass(row, "opened");

            var repObject = row.repObject;
            if (repObject)
            {
                if (!repObject.hasChildren)
                    return;

                var members = this.getMembers(repObject.value, level+1);
                if (members)
                    this.loop.insertRows({members: members}, row);
            }
        }
    },

    getMembers: function(object, level)
    {
        if (!level)
            level = 0;

        var members = [];
        for (var p in object)
        {
            var propObj = object[p];
            if (typeof(propObj) != "function"/* && typeof(propObj) != "number"*/)
                members.push(this.createMember("dom", p, propObj, level));
        }

        return members;
    },

    createMember: function(type, name, value, level)
    {
        var valueType = typeof(value);
        var hasChildren = this.hasProperties(value) && (valueType == "object");

        var valueTag = DomTree.Reps.getRep(value);

        return {
            name: name,
            value: value,
            type: type,
            rowClass: "memberRow-" + type,
            open: "",
            level: level,
            indent: level*16,
            hasChildren: hasChildren,
            tag: valueTag.tag
        };
    },

    hasProperties: function(ob)
    {
        if (typeof(ob) == "string")
            return false;

        try {
            for (var name in ob)
                return true;
        } catch (exc) {}
        return false;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Public

    append: function(parentNode)
    {
        this.element = this.tag.append({object: this.input}, parentNode);
        this.element.repObject = this;

        // Expand the first node (root) by default
        // Do not expand if the root is an array with more than one element.
        var value = Lib.isArray(this.input) && this.input.length > 2;
        var firstRow = this.element.firstChild.firstChild;
        if (firstRow && !value)
            this.toggleRow(firstRow);
    },

    expandRow: function(object)
    {
        var row = this.getRow(object);
        this.toggleRow(row, true);
        return row;
    },

    getRow: function(object)
    {
        // If not rendered yet, bail out.
        if (!this.element)
            return;

        // Iterate all existing rows and expand the one associated with specified object.
        // The repObject is a "member" object created in createMember method.
        var rows = Lib.getElementsByClass(this.element, "memberRow");
        for (var i=0; i<rows.length; i++)
        {
            var row = rows[i];
            if (row.repObject.value == object)
                return row;
        }

        return null;
    }
});

function safeToString(ob)
{
    try
    {
        return ob.toString();
    }
    catch (exc)
    {
        return "";
    }
}

// ********************************************************************************************* //
// Value Templates

var OBJECTBOX =
    DIV({"class": "objectBox objectBox-$className"});

// ********************************************************************************************* //

DomTree.Reps =
{
    reps: [],

    registerRep: function()
    {
        this.reps.push.apply(this.reps, arguments);
    },

    getRep: function(object)
    {
        var type = typeof(object);
        if (type == "object" && object instanceof String)
            type = "string";

        for (var i=0; i<this.reps.length; ++i)
        {
            var rep = this.reps[i];
            try
            {
                if (rep.supportsObject(object, type))
                    return rep;
            }
            catch (exc)
            {
                Trace.exception("domTree.getRep; ", exc);
            }
        }

        return DomTree.Rep;
    }
}

// ********************************************************************************************* //

DomTree.Rep = domplate(
{
    tag:
        OBJECTBOX("$object|getTitle"),

    className: "object",

    getTitle: function(object)
    {
        var label = safeToString(object);
        var re = /\[object (.*?)\]/;
        var m = re.exec(label);
        return m ? m[1] : label;
    },

    getTooltip: function(object)
    {
        return null;
    },

    supportsObject: function(object, type)
    {
        return false;
    }
});

// ********************************************************************************************* //

DomTree.Reps.Null = domplate(DomTree.Rep,
{
    tag:
        OBJECTBOX("null"),

    className: "null",

    supportsObject: function(object, type)
    {
        return object == null;
    }
});

// ********************************************************************************************* //

DomTree.Reps.Number = domplate(DomTree.Rep,
{
    tag:
        OBJECTBOX("$object"),

    className: "number",

    supportsObject: function(object, type)
    {
        return type == "boolean" || type == "number";
    }
});

// ********************************************************************************************* //

DomTree.Reps.String = domplate(DomTree.Rep,
{
    tag:
        //OBJECTBOX("&quot;$object&quot;"),
        OBJECTBOX("$object"),

    className: "string",

    supportsObject: function(object, type)
    {
        return type == "string";
    }
});

// ********************************************************************************************* //

DomTree.Reps.Arr = domplate(DomTree.Rep,
{
    tag:
        OBJECTBOX("$object|getTitle"),

    className: "array",

    supportsObject: function(object, type)
    {
        return Lib.isArray(object);
    },

    getTitle: function(object)
    {
        return "Array [" + object.length + "]";
    }
});

// ********************************************************************************************* //

DomTree.Reps.Tree = domplate(DomTree.Rep,
{
    tag:
        OBJECTBOX(
            TAG("$object|getTag", {object: "$object|getRoot"})
        ),

    className: "tree",

    getTag: function(object)
    {
        return Tree.tag;
    },

    getRoot: function(object)
    {
        // Create fake root for embedded object-tree.
        return [object];
    },

    supportsObject: function(object, type)
    {
        return type == "object";
    }
});

//xxxHonza: Domplate inheritance doesn't work. Modifications are propagated
// into the base object (see: http://code.google.com/p/fbug/issues/detail?id=4425)
var Tree = domplate(DomTree.prototype,
{
    createMember: function(type, name, value, level)
    {
        var member = DomTree.prototype.createMember(type, name, value, level);
        if (level == 0)
        {
            member.name = "";
            member.type = "tableCell";
        }
        return member;
    }
});

// ********************************************************************************************* //

// Registration
DomTree.Reps.registerRep(
    DomTree.Reps.Null,
    DomTree.Reps.Number,
    DomTree.Reps.String,
    DomTree.Reps.Arr
)

// ********************************************************************************************* //

return DomTree;

// ********************************************************************************************* //
}})
, {"filename":"../webapp/scripts/domplate/domTree.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/domplate/tableView.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/tableView.js"}
require.memoize("bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/tableView.js", 
/* See license.txt for terms of usage */

require.def("domplate/tableView", [
    "domplate/domplate",
    "core/lib",
    "i18n!nls/tableView",
    "domplate/domTree", //xxxHonza: hack, registered reps should be a separate module
    "core/trace"
],

function(Domplate, Lib, Strings, DomTree, Trace) { with (Domplate) {

// ********************************************************************************************* //

var TableView = domplate(
{
    className: "table",

    tag:
        DIV({"class": "dataTableSizer", "tabindex": "-1" },
            TABLE({"class": "dataTable", cellspacing: 0, cellpadding: 0, width: "100%",
                "role": "grid"},
                THEAD({"class": "dataTableThead", "role": "presentation"},
                    TR({"class": "headerRow focusRow dataTableRow subFocusRow", "role": "row",
                        onclick: "$onClickHeader"},
                        FOR("column", "$object.columns",
                            TH({"class": "headerCell a11yFocus", "role": "columnheader",
                                $alphaValue: "$column.alphaValue"},
                                DIV({"class": "headerCellBox"},
                                    "$column.label"
                                )
                            )
                        )
                    )
                ),
                TBODY({"class": "dataTableTbody", "role": "presentation"},
                    FOR("row", "$object.data|getRows",
                        TR({"class": "focusRow dataTableRow subFocusRow", "role": "row"},
                            FOR("column", "$row|getColumns",
                                TD({"class": "a11yFocus dataTableCell", "role": "gridcell"},
                                    TAG("$column|getValueTag", {object: "$column"})
                                )
                            )
                        )
                    )
                )
            )
        ),

    getValueTag: function(object)
    {
        var type = typeof(object);

        // Display embedded tree for object in table-cells
        if (type == "object")
            return DomTree.Reps.Tree.tag;

        var rep = DomTree.Reps.getRep(object);
        return rep.shortTag || rep.tag;
    },

    getRows: function(data)
    {
        var props = this.getProps(data);
        if (!props.length)
            return [];
        return props;
    },

    getColumns: function(row)
    {
        if (typeof(row) != "object")
            return [row];

        var cols = [];
        for (var i=0; i<this.columns.length; i++)
        {
            var prop = this.columns[i].property;

            if (!prop)
            {
                value = row;
            }
            else if (typeof row[prop] === "undefined")
            {
                var props = (typeof(prop) == "string") ? prop.split(".") : [prop];

                var value = row;
                for (var p in props)
                    value = (value && value[props[p]]) || undefined;
            }
            else
            {
                value = row[prop];
            }

            cols.push(value);
        }
        return cols;
    },

    getProps: function(obj)
    {
        if (typeof(obj) != "object")
            return [obj];

        if (obj.length)
            return Lib.cloneArray(obj);

        var arr = [];
        for (var p in obj)
        {
            var value = obj[p];
            if (this.domFilter(value, p))
                arr.push(value);
        }
        return arr;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Sorting

    onClickHeader: function(event)
    {
        var table = Lib.getAncestorByClass(event.target, "dataTable");
        var header = Lib.getAncestorByClass(event.target, "headerCell");
        if (!header)
            return;

        var numerical = !Lib.hasClass(header, "alphaValue");

        var colIndex = 0;
        for (header = header.previousSibling; header; header = header.previousSibling)
            ++colIndex;

        this.sort(table, colIndex, numerical);
    },

    sort: function(table, colIndex, numerical)
    {
        var tbody = Lib.getChildByClass(table, "dataTableTbody");
        var thead = Lib.getChildByClass(table, "dataTableThead");

        var values = [];
        for (var row = tbody.childNodes[0]; row; row = row.nextSibling)
        {
            var cell = row.childNodes[colIndex];
            var value = numerical ? parseFloat(cell.textContent) : cell.textContent;
            values.push({row: row, value: value});
        }

        values.sort(function(a, b) { return a.value < b.value ? -1 : 1; });

        var headerRow = thead.firstChild;
        var headerSorted = Lib.getChildByClass(headerRow, "headerSorted");
        Lib.removeClass(headerSorted, "headerSorted");
        if (headerSorted)
            headerSorted.removeAttribute('aria-sort');

        var header = headerRow.childNodes[colIndex];
        Lib.setClass(header, "headerSorted");

        if (!header.sorted || header.sorted == 1)
        {
            Lib.removeClass(header, "sortedDescending");
            Lib.setClass(header, "sortedAscending");
            header.setAttribute("aria-sort", "ascending");

            header.sorted = -1;

            for (var i = 0; i < values.length; ++i)
                tbody.appendChild(values[i].row);
        }
        else
        {
            Lib.removeClass(header, "sortedAscending");
            Lib.setClass(header, "sortedDescending");
            header.setAttribute("aria-sort", "descending")

            header.sorted = 1;

            for (var i = values.length-1; i >= 0; --i)
                tbody.appendChild(values[i].row);
        }
    },

    /**
     * Analyse data and return dynamically created list of columns.
     * @param {Object} data
     */
    getHeaderColumns: function(data)
    {
        // Get the first row in the object.
        var firstRow;
        for (var p in data)
        {
            firstRow = data[p];
            break;
        }

        if (typeof(firstRow) != "object")
            return [{label: Strings.objectProperties}];

        // Put together a column property, label and type (type for default sorting logic).
        var header = [];
        for (var p in firstRow)
        {
            var value = firstRow[p];
            if (!this.domFilter(value, p))
                continue;

            header.push({
                property: p,
                label: p,
                alphaValue: (typeof(value) != "number")
            });
        }

        return header;
    },

    /**
     * Filtering based on options set in the DOM panel.
     * @param {Object} value - a property value under inspection.
     * @param {String} name - name of the property.
     * @returns true if the value should be displayed, otherwise false.
     */
    domFilter: function(object, name)
    {
        return true;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Public

    render: function(parentNode, data, cols)
    {
        // No arguments passed into console.table method, bail out for now,
        // but some error message could be displayed in the future.
        if (!data)
            return;

        // Get header info from passed argument (can be null).
        var columns = [];
        for (var i=0; cols && i<cols.length; i++)
        {
            var col = cols[i];
            var prop = (typeof(col.property) != "undefined") ? col.property : col;
            var label = (typeof(col.label) != "undefined") ? col.label : prop;

            columns.push({
                property: prop,
                label: label,
                alphaValue: true
            });
        }

        // Generate header info from the data dynamically.
        if (!columns.length)
            columns = this.getHeaderColumns(data);

        try
        {
            this.columns = columns;
            var object = {data: data, columns: columns};
            var element = this.tag.append({object: object, columns: columns}, parentNode);

            // Set vertical height for scroll bar.
            var tBody = Lib.getElementByClass(element, "dataTableTbody");
            var maxHeight = 200; // xxxHonza: a pref?
            if (maxHeight > 0 && tBody.clientHeight > maxHeight)
                tBody.style.height = maxHeight + "px";
        }
        catch (err)
        {
            Trace.exception("tableView.render; EXCEPTION " + err, err);
        }
        finally
        {
            delete this.columns;
        }
    }
});

// ********************************************************************************************* //

return TableView;

// ********************************************************************************************* //
}})
, {"filename":"../webapp/scripts/domplate/tableView.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/nls/tableView.js","mtime":1420355852,"wrapper":"amd","format":"amd","id":"69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/tableView.js"}
require.memoize("69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/tableView.js", 
/* See license.txt for terms of usage */

define(
{
    "root": {
        "objectProperties": "Object Properties"
    }
})
, {"filename":"../webapp/scripts/nls/tableView.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/json-query/JSONQuery.js","mtime":1420355852,"wrapper":"commonjs/leaky","format":"leaky","id":"bac7a4129c8389201033886a32e85a91be2d3ac6-json-query/JSONQuery.js"}
require.memoize("bac7a4129c8389201033886a32e85a91be2d3ac6-json-query/JSONQuery.js", 
function(require, exports, module) {var __dirname = '../webapp/scripts/json-query';
/*
Copyright Jason E. Smith 2008 Licensed under the Apache License, Version 2.0 (the "License");
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
*/
 
 
/*
* CREDITS:
* Thanks to Kris Zyp from SitePen for contributing his source for
* a standalone port of JSONQuery (from the dojox.json.query module).
*
* OVERVIEW:
* JSONQuery.js is a standalone port of the dojox.json.query module. It is intended as
* a dropin solution with zero dependencies. JSONQuery is intended to succeed and improve upon
* the JSONPath api (http://goessner.net/articles/JsonPath/) which offers rich powerful
* querying capabilities similar to those of XQuery.
*
* EXAMPLES / USAGE:
* see http://www.sitepen.com/blog/2008/07/16/jsonquery-data-querying-beyond-jsonpath/
*
*     *Ripped from original source.
*         JSONQuery(queryString,object)
        and
        JSONQuery(queryString)(object)
        always return identical results. The first one immediately evaluates, the second one returns a
        function that then evaluates the object.
      
      example:
        JSONQuery("foo",{foo:"bar"})
        This will return "bar".
    
      example:
        evaluator = JSONQuery("?foo='bar'&rating>3");
        This creates a function that finds all the objects in an array with a property
        foo that is equals to "bar" and with a rating property with a value greater
        than 3.
        evaluator([{foo:"bar",rating:4},{foo:"baz",rating:2}])
        This returns:
        {foo:"bar",rating:4}
      
      example:
        evaluator = JSONQuery("$[?price<15.00][\rating][0:10]");
        This finds objects in array with a price less than 15.00 and sorts then
        by rating, highest rated first, and returns the first ten items in from this
        filtered and sorted list.
        
        
	example:      
		var data = {customers:[
			{name:"Susan", purchases:29},
			{name:"Kim", purchases:150}, 
			{name:"Jake", purchases:27}
		]};
		
		var results = json.JSONQuery("$.customers[?purchases > 21 & name='Jake'][\\purchases]",data);
		results 
		
		returns customers sorted by higest number of purchases to lowest.

*/

(function(){
    function map(arr, fun /*, thisp*/){
        var len = arr.length;
        if (typeof fun != "function")
            throw new TypeError();
        
        var res = new Array(len);
        var thisp = arguments[2];
        for (var i = 0; i < len; i++) {
            if (i in arr)
                res[i] = fun.call(thisp, arr[i], i, arr);
        }
        
        return res;
    }
 
   function filter(arr, fun /*, thisp*/){
        var len = arr.length;
        if (typeof fun != "function")
            throw new TypeError();
        
        var res = new Array();
        var thisp = arguments[2];
        for (var i = 0; i < len; i++) {
            if (i in arr) {
                var val = arr[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, arr))
                    res.push(val);
            }
        }
        
        return res;
    };
 
 
  function slice(obj,start,end,step){
    // handles slice operations: [3:6:2]
    var len=obj.length,results = [];
    end = end || len;
    start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
    end = (end < 0) ? Math.max(0,end+len) : Math.min(len,end);
     for(var i=start; i<end; i+=step){
       results.push(obj[i]);
     }
    return results;
  }
  function expand(obj,name){
    // handles ..name, .*, [*], [val1,val2], [val]
    // name can be a property to search for, undefined for full recursive, or an array for picking by index
    var results = [];
    function walk(obj){
      if(name){
        if(name===true && !(obj instanceof Array)){
          //recursive object search
          results.push(obj);
        }else if(obj[name]){
          // found the name, add to our results
          results.push(obj[name]);
        }
      }
      for(var i in obj){
        var val = obj[i];
        if(!name){
          // if we don't have a name we are just getting all the properties values (.* or [*])
          results.push(val);
        }else if(val && typeof val == 'object'){
          
          walk(val);
        }
      }
    }
    if(name instanceof Array){
      // this is called when multiple items are in the brackets: [3,4,5]
      if(name.length==1){
        // this can happen as a result of the parser becoming confused about commas
        // in the brackets like [@.func(4,2)]. Fixing the parser would require recursive
        // analsys, very expensive, but this fixes the problem nicely.
        return obj[name[0]];
      }
      for(var i = 0; i < name.length; i++){
        results.push(obj[name[i]]);
      }
    }else{
      // otherwise we expanding
      walk(obj);
    }
    return results;
  }
  
  function distinctFilter(array, callback){
    // does the filter with removal of duplicates in O(n)
    var outArr = [];
    var primitives = {};
    for(var i=0,l=array.length; i<l; ++i){
      var value = array[i];
      if(callback(value, i, array)){
        if((typeof value == 'object') && value){
          // with objects we prevent duplicates with a marker property
          if(!value.__included){
            value.__included = true;
            outArr.push(value);
          }
        }else if(!primitives[value + typeof value]){
          // with primitives we prevent duplicates by putting it in a map
          primitives[value + typeof value] = true;
          outArr.push(value);
        }
      }
    }
    for(i=0,l=outArr.length; i<l; ++i){
      // cleanup the marker properties
      if(outArr[i]){
        delete outArr[i].__included;
      }
    }
    return outArr;
  }
  var JSONQuery = function(/*String*/query,/*Object?*/obj){
    // summary:
    //     Performs a JSONQuery on the provided object and returns the results.
    //     If no object is provided (just a query), it returns a "compiled" function that evaluates objects
    //     according to the provided query.
    // query:
    //     Query string
    //   obj:
    //     Target of the JSONQuery
    //
    //  description:
    //    JSONQuery provides a comprehensive set of data querying tools including filtering,
    //    recursive search, sorting, mapping, range selection, and powerful expressions with
    //    wildcard string comparisons and various operators. JSONQuery generally supersets
    //     JSONPath and provides syntax that matches and behaves like JavaScript where
    //     possible.
    //
    //    JSONQuery evaluations begin with the provided object, which can referenced with
    //     $. From
    //     the starting object, various operators can be successively applied, each operating
    //     on the result of the last operation.
    //
    //     Supported Operators:
    //     --------------------
    //    * .property - This will return the provided property of the object, behaving exactly
    //     like JavaScript.
    //     * [expression] - This returns the property name/index defined by the evaluation of
    //     the provided expression, behaving exactly like JavaScript.
    //    * [?expression] - This will perform a filter operation on an array, returning all the
    //     items in an array that match the provided expression. This operator does not
    //    need to be in brackets, you can simply use ?expression, but since it does not
    //    have any containment, no operators can be used afterwards when used
    //     without brackets.
    //    * [^?expression] - This will perform a distinct filter operation on an array. This behaves
    //    as [?expression] except that it will remove any duplicate values/objects from the
    //    result set.
    //     * [/expression], [\expression], [/expression, /expression] - This performs a sort
    //     operation on an array, with sort based on the provide expression. Multiple comma delimited sort
    //     expressions can be provided for multiple sort orders (first being highest priority). /
    //    indicates ascending order and \ indicates descending order
    //     * [=expression] - This performs a map operation on an array, creating a new array
    //    with each item being the evaluation of the expression for each item in the source array.
    //    * [start:end:step] - This performs an array slice/range operation, returning the elements
    //    from the optional start index to the optional end index, stepping by the optional step number.
    //     * [expr,expr] - This a union operator, returning an array of all the property/index values from
    //     the evaluation of the comma delimited expressions.
    //     * .* or [*] - This returns the values of all the properties of the current object.
    //     * $ - This is the root object, If a JSONQuery expression does not being with a $,
    //     it will be auto-inserted at the beginning.
    //     * @ - This is the current object in filter, sort, and map expressions. This is generally
    //     not necessary, names are auto-converted to property references of the current object
    //     in expressions.
    //     *  ..property - Performs a recursive search for the given property name, returning
    //     an array of all values with such a property name in the current object and any subobjects
    //     * expr = expr - Performs a comparison (like JS's ==). When comparing to
    //     a string, the comparison string may contain wildcards * (matches any number of
    //     characters) and ? (matches any single character).
    //     * expr ~ expr - Performs a string comparison with case insensitivity.
    //    * ..[?expression] - This will perform a deep search filter operation on all the objects and
    //     subobjects of the current data. Rather than only searching an array, this will search
    //     property values, arrays, and their children.
    //    * $1,$2,$3, etc. - These are references to extra parameters passed to the query
    //    function or the evaluator function.
    //    * +, -, /, *, &, |, %, (, ), <, >, <=, >=, != - These operators behave just as they do
    //     in JavaScript.
    //    
    //  
    //  
    //   |  dojox.json.query(queryString,object)
    //     and
    //   |  dojox.json.query(queryString)(object)
    //     always return identical results. The first one immediately evaluates, the second one returns a
    //     function that then evaluates the object.
    //
    //   example:
    //   |  dojox.json.query("foo",{foo:"bar"})
    //     This will return "bar".
    //
    //  example:
    //  |  evaluator = dojox.json.query("?foo='bar'&rating>3");
    //    This creates a function that finds all the objects in an array with a property
    //    foo that is equals to "bar" and with a rating property with a value greater
    //    than 3.
    //  |  evaluator([{foo:"bar",rating:4},{foo:"baz",rating:2}])
    //     This returns:
    //   |  {foo:"bar",rating:4}
    //
    //  example:
    //   |  evaluator = dojox.json.query("$[?price<15.00][\rating][0:10]");
    //      This finds objects in array with a price less than 15.00 and sorts then
    //     by rating, highest rated first, and returns the first ten items in from this
    //     filtered and sorted list.
    tokens = [];
    var depth = 0;  
    var str = [];
    query = query.replace(/"(\\.|[^"\\])*"|'(\\.|[^'\\])*'|[\[\]]/g,function(t){
      depth += t == '[' ? 1 : t == ']' ? -1 : 0; // keep track of bracket depth
      return (t == ']' && depth > 0) ? '`]' : // we mark all the inner brackets as skippable
          (t.charAt(0) == '"' || t.charAt(0) == "'") ? "`" + (str.push(t) - 1) :// and replace all the strings
            t;
    });
    var prefix = '';
    function call(name){
      // creates a function call and puts the expression so far in a parameter for a call
      prefix = name + "(" + prefix;
    }
    function makeRegex(t,a,b,c,d){
      // creates a regular expression matcher for when wildcards and ignore case is used
      return str[d].match(/[\*\?]/) || c == '~' ?
          "/^" + str[d].substring(1,str[d].length-1).replace(/\\([btnfr\\"'])|([^\w\*\?])/g,"\\$1$2").replace(/([\*\?])/g,".$1") + (c == '~' ? '$/i' : '$/') + ".test(" + a + ")" :
          t;
    }
    query.replace(/(\]|\)|push|pop|shift|splice|sort|reverse)\s*\(/,function(){
      throw new Error("Unsafe function call");
    });
    
    query = query.replace(/([^=]=)([^=])/g,"$1=$2"). // change the equals to comparisons
      replace(/@|(\.\s*)?[a-zA-Z\$_]+(\s*:)?/g,function(t){
        return t.charAt(0) == '.' ? t : // leave .prop alone
          t == '@' ? "$obj" :// the reference to the current object
          (t.match(/:|^(\$|Math|true|false|null)$/) ? "" : "$obj.") + t; // plain names should be properties of root... unless they are a label in object initializer
      }).
      replace(/\.?\.?\[(`\]|[^\]])*\]|\?.*|\.\.([\w\$_]+)|\.\*/g,function(t,a,b){
        var oper = t.match(/^\.?\.?(\[\s*\^?\?|\^?\?|\[\s*==)(.*?)\]?$/); // [?expr] and ?expr and [=expr and =expr
        if(oper){
          var prefix = '';
          if(t.match(/^\./)){
            // recursive object search
            call("expand");
            prefix = ",true)";
          }
          call(oper[1].match(/\=/) ? "map" : oper[1].match(/\^/) ? "distinctFilter" : "filter");
          return prefix + ",function($obj){return " + oper[2] + "})";
        }
        oper = t.match(/^\[\s*([\/\\].*)\]/); // [/sortexpr,\sortexpr]
        if(oper){
          // make a copy of the array and then sort it using the sorting expression
          return ".concat().sort(function(a,b){" + oper[1].replace(/\s*,?\s*([\/\\])\s*([^,\\\/]+)/g,function(t,a,b){
              return "var av= " + b.replace(/\$obj/,"a") + ",bv= " + b.replace(/\$obj/,"b") + // FIXME: Should check to make sure the $obj token isn't followed by characters
                  ";if(av>bv||bv==null){return " + (a== "/" ? 1 : -1) +";}\n" +
                  "if(bv>av||av==null){return " + (a== "/" ? -1 : 1) +";}\n";
          }) + "})";
        }
        oper = t.match(/^\[(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)\]/); // slice [0:3]
        if(oper){
          call("slice");
          return "," + (oper[1] || 0) + "," + (oper[2] || 0) + "," + (oper[3] || 1) + ")";
        }
        if(t.match(/^\.\.|\.\*|\[\s*\*\s*\]|,/)){ // ..prop and [*]
          call("expand");
          return (t.charAt(1) == '.' ?
              ",'" + b + "'" : // ..prop
                t.match(/,/) ?
                  "," + t : // [prop1,prop2]
                  "") + ")"; // [*]
        }
        return t;
      }).
      replace(/(\$obj\s*(\.\s*[\w_$]+\s*)*)(==|~)\s*`([0-9]+)/g,makeRegex). // create regex matching
      replace(/`([0-9]+)\s*(==|~)\s*(\$obj(\s*\.\s*[\w_$]+)*)/g,function(t,a,b,c,d){ // and do it for reverse =
        return makeRegex(t,c,d,b,a);
      });
    query = prefix + (query.charAt(0) == '$' ? "" : "$") + query.replace(/`([0-9]+|\])/g,function(t,a){
      //restore the strings
      return a == ']' ? ']' : str[a];
    });
    // create a function within this scope (so it can use expand and slice)
    
    var executor = eval("1&&function($,$1,$2,$3,$4,$5,$6,$7,$8,$9){var $obj=$;return " + query + "}");
    for(var i = 0;i<arguments.length-1;i++){
      arguments[i] = arguments[i+1];
    }
    return obj ? executor.apply(this,arguments) : executor;
  };
  
  
  if(typeof namespace == "function"){
  	namespace("json::JSONQuery", JSONQuery);
  }
  else {
  	window["JSONQuery"] = JSONQuery;
  }
})();
return {
    i: (typeof i !== "undefined") ? i : null,
    Math: (typeof Math !== "undefined") ? Math : null,
    tokens: (typeof tokens !== "undefined") ? tokens : null,
    eval: (typeof eval !== "undefined") ? eval : null,
    namespace: (typeof namespace !== "undefined") ? namespace : null,
    window: (typeof window !== "undefined") ? window : null
};
}
, {"filename":"../webapp/scripts/json-query/JSONQuery.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/css/loader.js","mtime":1421026613,"wrapper":"amd","format":"amd","id":"492587a071e52c3a961697458a3896cc895f99cf-css/loader.js"}
require.memoize("492587a071e52c3a961697458a3896cc895f99cf-css/loader.js", 
/* See license.txt for terms of usage */

define([
    "jquery/jquery",
    "text!./harViewer.css",
    "require"
],

function($, HarviewerCss, require) {
    return {
        initialize: function () {

/*
			var url = null;
			if (typeof require.sandbox !== "undefined") {
				url = require.sandbox.id + require.id("./harViewer.css");
			} else {
				url = require.toUrl("./harViewer.css");
			}
            $('<link rel="stylesheet" href="' + url + '"/>').appendTo("HEAD");
*/

            $('<style></style>').appendTo("HEAD").html(HarviewerCss);

        }
    };
})
, {"filename":"../webapp/scripts/css/loader.js"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/plugin.js",
    "mappings": {
        "jquery": "45d7de3498542e1f7118e3db47ee8e06dbc24163-jquery",
        "harviewer": "b89a1ab93a03eeb31412b4efe36b98e48e3e40d2-scripts"
    },
    "dirpath": "."
}
, {"filename":"./package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"45d7de3498542e1f7118e3db47ee8e06dbc24163-jquery/package.json"}
require.memoize("45d7de3498542e1f7118e3db47ee8e06dbc24163-jquery/package.json", 
{
    "dirpath": "../webapp/scripts/jquery"
}
, {"filename":"../webapp/scripts/jquery/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"b89a1ab93a03eeb31412b4efe36b98e48e3e40d2-scripts/package.json"}
require.memoize("b89a1ab93a03eeb31412b4efe36b98e48e3e40d2-scripts/package.json", 
{
    "main": "b89a1ab93a03eeb31412b4efe36b98e48e3e40d2-scripts/harViewer.js",
    "mappings": {
        "jquery": "45d7de3498542e1f7118e3db47ee8e06dbc24163-jquery",
        "domplate": "bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate",
        "tabs": "9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs",
        "preview": "f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview",
        "nls": "69f0f9607243132b9a15743eeb168dddabaaa0cb-nls",
        "css": "492587a071e52c3a961697458a3896cc895f99cf-css",
        "core": "3d84302dc73ad91f3bb53e7af2525a4ab1cbb6a9-core"
    },
    "dirpath": "../webapp/scripts"
}
, {"filename":"../webapp/scripts/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/package.json"}
require.memoize("bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate/package.json", 
{
    "directories": {
        "lib": "."
    },
    "mappings": {
        "domplate": "bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate",
        "jquery": "45d7de3498542e1f7118e3db47ee8e06dbc24163-jquery",
        "core": "3d84302dc73ad91f3bb53e7af2525a4ab1cbb6a9-core",
        "nls": "69f0f9607243132b9a15743eeb168dddabaaa0cb-nls"
    },
    "dirpath": "../webapp/scripts/domplate"
}
, {"filename":"../webapp/scripts/domplate/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"3d84302dc73ad91f3bb53e7af2525a4ab1cbb6a9-core/package.json"}
require.memoize("3d84302dc73ad91f3bb53e7af2525a4ab1cbb6a9-core/package.json", 
{
    "directories": {
        "lib": "."
    },
    "mappings": {
        "jquery": "45d7de3498542e1f7118e3db47ee8e06dbc24163-jquery",
        "core": "3d84302dc73ad91f3bb53e7af2525a4ab1cbb6a9-core"
    },
    "dirpath": "../webapp/scripts/core"
}
, {"filename":"../webapp/scripts/core/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/package.json"}
require.memoize("9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/package.json", 
{
    "directories": {
        "lib": "."
    },
    "mappings": {
        "jquery": "45d7de3498542e1f7118e3db47ee8e06dbc24163-jquery",
        "domplate": "bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate",
        "core": "3d84302dc73ad91f3bb53e7af2525a4ab1cbb6a9-core",
        "nls": "69f0f9607243132b9a15743eeb168dddabaaa0cb-nls",
        "tabs": "9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs",
        "preview": "f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview",
        "examples": "0b41211316606213cabe711a8c8236d551066e67-examples",
        "downloadify": "c30b6689ef7c41935eb1ccfc56f2e9e66b000881-downloadify",
        "syntax-highlighter": "96035c6ff9c9225d2ce6a8e192b7e7d3b4a8550e-syntax-highlighter",
        "json-query": "bac7a4129c8389201033886a32e85a91be2d3ac6-json-query"
    },
    "dirpath": "../webapp/scripts/tabs"
}
, {"filename":"../webapp/scripts/tabs/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/package.json"}
require.memoize("69f0f9607243132b9a15743eeb168dddabaaa0cb-nls/package.json", 
{
    "dirpath": "../webapp/scripts/nls"
}
, {"filename":"../webapp/scripts/nls/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/package.json"}
require.memoize("f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview/package.json", 
{
    "directories": {
        "lib": "."
    },
    "mappings": {
        "jquery": "45d7de3498542e1f7118e3db47ee8e06dbc24163-jquery",
        "core": "3d84302dc73ad91f3bb53e7af2525a4ab1cbb6a9-core",
        "preview": "f3cf4ec2d6f950de562d3cbcc8fbe9c0c9dda26f-preview",
        "nls": "69f0f9607243132b9a15743eeb168dddabaaa0cb-nls",
        "jquery-plugins": "a3b2c147b43b15fb1276a0ace35b2d7e9b82e952-jquery-plugins",
        "domplate": "bf08ee465e65c02830e1415fc1163c5abf9a8297-domplate",
        "syntax-highlighter": "96035c6ff9c9225d2ce6a8e192b7e7d3b4a8550e-syntax-highlighter"
    },
    "dirpath": "../webapp/scripts/preview"
}
, {"filename":"../webapp/scripts/preview/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"a3b2c147b43b15fb1276a0ace35b2d7e9b82e952-jquery-plugins/package.json"}
require.memoize("a3b2c147b43b15fb1276a0ace35b2d7e9b82e952-jquery-plugins/package.json", 
{
    "directories": {
        "lib": "."
    },
    "mappings": {
        "jquery": "45d7de3498542e1f7118e3db47ee8e06dbc24163-jquery"
    },
    "dirpath": "../webapp/scripts/jquery-plugins"
}
, {"filename":"../webapp/scripts/jquery-plugins/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"96035c6ff9c9225d2ce6a8e192b7e7d3b4a8550e-syntax-highlighter/package.json"}
require.memoize("96035c6ff9c9225d2ce6a8e192b7e7d3b4a8550e-syntax-highlighter/package.json", 
{
    "dirpath": "../webapp/scripts/syntax-highlighter"
}
, {"filename":"../webapp/scripts/syntax-highlighter/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"c30b6689ef7c41935eb1ccfc56f2e9e66b000881-downloadify/package.json"}
require.memoize("c30b6689ef7c41935eb1ccfc56f2e9e66b000881-downloadify/package.json", 
{
    "directories": {
        "lib": "."
    },
    "mappings": {
        "jquery": "45d7de3498542e1f7118e3db47ee8e06dbc24163-jquery"
    },
    "dirpath": "../webapp/scripts/downloadify"
}
, {"filename":"../webapp/scripts/downloadify/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"bac7a4129c8389201033886a32e85a91be2d3ac6-json-query/package.json"}
require.memoize("bac7a4129c8389201033886a32e85a91be2d3ac6-json-query/package.json", 
{
    "dirpath": "../webapp/scripts/json-query"
}
, {"filename":"../webapp/scripts/json-query/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"492587a071e52c3a961697458a3896cc895f99cf-css/package.json"}
require.memoize("492587a071e52c3a961697458a3896cc895f99cf-css/package.json", 
{
    "directories": {
        "lib": "."
    },
    "mappings": {
        "jquery": "45d7de3498542e1f7118e3db47ee8e06dbc24163-jquery"
    },
    "dirpath": "../webapp/scripts/css"
}
, {"filename":"../webapp/scripts/css/package.json"});
// @pinf-bundle-module: {"file":"../webapp/scripts/examples/loader.js","mtime":1421031308,"wrapper":"amd","format":"amd","id":"0b41211316606213cabe711a8c8236d551066e67-examples/loader.js"}
require.memoize("0b41211316606213cabe711a8c8236d551066e67-examples/loader.js", 
/* See license.txt for terms of usage */

define([
    "require"
],

function(require) {
    return {
        load: function (path) {

            var href = document.location.href;
            var index = href.indexOf("?");
            var url = href.substr(0, index) + "?path=";

            if (typeof require.sandbox !== "undefined") {
                url += require.sandbox.id + require.id(path.replace(/^examples\//, "./"));
            } else {
                url += path;
            }

            document.location = url;
        }
    };
})
, {"filename":"../webapp/scripts/examples/loader.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/css/harViewer.css","mtime":1421119962,"wrapper":"url-encoded","format":"utf8","id":"492587a071e52c3a961697458a3896cc895f99cf-css/harViewer.css"}
require.memoize("492587a071e52c3a961697458a3896cc895f99cf-css/harViewer.css", 
'%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.harBody%20%7B%0A%20%20margin%3A%200%3B%0A%20%20font-family%3A%20Lucida%20Grande%2C%20Tahoma%2C%20sans-serif%3B%0A%20%20font-size%3A%2013px%3B%0A%7D%0A%0A%23content%20a%20%7B%0A%20%20text-decoration%3A%20none%3B%0A%7D%0A%0A%23content%20h1%20%7B%0A%20%20font-size%3A%2017px%3B%0A%20%20border-bottom%3A%201px%20solid%20threedlightshadow%3B%0A%7D%0A%0A%23content%20h2%20%7B%0A%20%20color%3A%20%23DD467B%3B%0A%20%20font-size%3A%2022.8px%3B%0A%20%20font-weight%3A%20lighter%3B%0A%7D%0A%0A%23content%20h3%20%7B%0A%20%20color%3A%20%23DD467B%3B%0A%20%20font-weight%3A%20bold%3B%0A%7D%0A%0A%23content%20pre%20%7B%0A%20%20margin%3A%200%3B%0A%20%20font%3A%20inherit%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A.collapsed%2C%0A%5Bcollapsed%3D%22true%22%5D%20%7B%0A%20%20display%3A%20none%20!important%3B%0A%7D%0A%0A.link%20%7B%0A%20%20color%3A%20blue%3B%0A%7D%0A%0A.link%3Ahover%20%7B%0A%20%20cursor%3A%20pointer%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A.harViewBodies%20%7B%0A%20%20position%3A%20absolute%3B%0A%20%20top%3A%2033px%3B%0A%20%20bottom%3A%200px%3B%0A%7D%0A%0A.harViewBar%20%3E%20.tab%20%7B%0A%20%20font-size%3A%2017px%3B%0A%20%20font-family%3A%20Lucida%20Grande%2C%20Tahoma%2C%20sans-serif%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Support%20for%20hiding%20the%20tabBar%20*%2F%0A%0A.harView%5BhideTabBar%3D%22true%22%5D%20.harViewBar%20%7B%0A%20%20display%3A%20none%3B%0A%7D%0A%0A.harView%5BhideTabBar%3D%22true%22%5D%20.harViewBodies%20%7B%0A%20%20position%3A%20inherit%3B%0A%7D%0A%0A%2F*%20Domplate%20Widgets%20*%2F%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.tabView%20%7B%0A%20%20width%3A%20100%25%3B%0A%20%20background-color%3A%20%23FFFFFF%3B%0A%20%20color%3A%20%23000000%3B%0A%7D%0A%0A.tabViewCol%20%7B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAEAAACRCAIAAACNEUWdAAAABGdBTUEAALGPC%2FxhBQAAAeZJREFUKFMdzktPEwEYheH3f7kxrly4JDGaGBfGuGJjYlypiSFeggaRgEIkDVYMgSBNW6ctZWgZyqU0g3XQsdN2ekEqlBZ6oYXemDozi2f3feccSnmF41ycYnaXIz1mO0xtU0hEOFDX2P8lkleC5OJ%2Bsj8EMrtemy67SceW%2BLyXwqEkmYwnGJNV3u7s8WLrJ08lmcfhGA%2FFKIPBLR74N7j3fZ27Xonb7jA3XSEGvonIxXFiR6NsHw6z8W8I6eAJq%2FuPCOQGEbL38WTu4ErfYjE1wHzyBnPadWYT13D%2BucqMeoXjDZHi%2BjJHYYFD0U3Bv8hf7xz7S05yC9Nk56bQv0yQnhkj7XhH6tMbtMnXaB9fkhg3%2B5Z%2FE%2FbtseKJE1jaxTu%2Fg2t2mwVHhK9TazgnVnG8X2F6ZJmpYT8fXgmMDXkYfe5m5JmLTCZDMplEVVUURUGWZaLRKJubm0QiESRJIhQKIYoiwWCQQCCAz%2BdDEARbv9%2FHMAx6vR6dTodWq8X5%2BTmNRoNarUalUqFcLlMsFikUCuTzeXRdR9M0u%2FO4VLKVLOadpXxyQvn0lBPTqflvqVSrVM28Wr1O%2FazOmZnfaDZoNpt234XlomX2t2m127TNLd1Ol263a2%2B7vLQYGBZzb9%2Fo29tN%2FwFM%2BFqRGQdzIwAAAABJRU5ErkJggg%3D%3D%22)%20repeat-x%20scroll%200%20-112px%20%23FFFFFF%3B%0A%20%20vertical-align%3A%20top%3B%0A%7D%0A%0A.tabViewBody%20%7B%0A%20%20margin%3A%202px%200px%200px%200px%3B%0A%7D%0A%0A.tabBar%20%7B%0A%20%20padding-left%3A%2014px%3B%0A%20%20border-bottom%3A%201px%20solid%20%23D7D7D7%3B%0A%20%20white-space%3A%20nowrap%3B%0A%7D%0A%0A.tab%20%7B%0A%20%20position%3A%20relative%3B%0A%20%20top%3A%201px%3B%0A%20%20padding%3A%204px%208px%3B%0A%20%20border%3A%201px%20solid%20transparent%3B%0A%20%20border-bottom%3A%20none%3B%0A%20%20color%3A%20%23565656%3B%0A%20%20font-weight%3A%20bold%3B%0A%20%20white-space%3A%20nowrap%3B%0A%20%20-moz-user-select%3A%20none%3B%0A%20%20display%3A%20inline-block%3B%0A%7D%0A%0A.tab%3Ahover%20%7B%0A%20%20cursor%3A%20pointer%3B%0A%20%20border-color%3A%20%23D7D7D7%3B%0A%20%20-moz-border-radius%3A%204px%204px%200%200%3B%0A%20%20-webkit-border-top-left-radius%3A%204px%3B%0A%20%20-webkit-border-top-right-radius%3A%204px%3B%0A%20%20border-radius%3A%204px%204px%200%200%3B%0A%7D%0A%0A.tab%5Bselected%3D%22true%22%5D%2C%0A.tab%20.selected%20%7B%0A%20%20cursor%3A%20default%20!important%3B%0A%20%20border-color%3A%20%23D7D7D7%3B%0A%20%20background-color%3A%20%23FFFFFF%3B%0A%20%20-moz-border-radius%3A%204px%204px%200%200%3B%0A%20%20-webkit-border-top-left-radius%3A%204px%3B%0A%20%20-webkit-border-top-right-radius%3A%204px%3B%0A%20%20border-radius%3A%204px%204px%200%200%3B%0A%7D%0A%0A%2F*%0A%20*%20If%20fixed%20height%20is%20specified%2C%20the%20overflow%20works%2C%20otherwise%20the%20position%20must%20be%20%0A%20*%20absolute%20with%20top%3A%2033px%20(height%20of%20the%20tab-header%20and%20bottom%3A%200px%20to%20get%20available%0A%20*%20vertical%20space%0A%20*%2F%0A%0A.tabBodies%20%7B%0A%20%20width%3A%20100%25%3B%0A%20%20overflow%3A%20auto%3B%0A%7D%0A%0A.tabBody%20%7B%0A%20%20display%3A%20none%3B%0A%20%20margin%3A%200%3B%0A%7D%0A%0A.tabBody%5Bselected%3D%22true%22%5D%2C%0A.tabBody.selected%20%7B%0A%20%20display%3A%20block%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Print%20support%20*%2F%0A%0A%40media%20print%20%7B%0A%20%20%2F*%20This%20is%20what%20prevents%20the%20browser\'s%20print%20featurs%20to%20print%20more%20pages.%20*%2F%0A%0A%20%20.tabBodies%20%7B%0A%20%20%20%20overflow%3A%20visible%3B%0A%20%20%7D%0A%0A%20%20.tabViewCol%20%7B%0A%20%20%20%20background%3A%20none%3B%0A%20%20%7D%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.toolbar%20%7B%0A%20%20font-family%3A%20Verdana%2CGeneva%2CArial%2CHelvetica%2Csans-serif%3B%0A%20%20font-size%3A%2011px%3B%0A%20%20font-weight%3A%20400%3B%0A%20%20font-style%3A%20normal%3B%0A%20%20border-bottom%3A%201px%20solid%20%23EEEEEE%3B%0A%20%20padding%3A%200%203px%200%203px%3B%0A%7D%0A%0A.toolbarButton%2C%0A.toolbarSeparator%20%7B%0A%20%20display%3A%20inline-block%3B%0A%20%20vertical-align%3A%20middle%3B%0A%20%20cursor%3A%20pointer%3B%0A%20%20color%3A%20%23000000%3B%0A%20%20-moz-user-select%3A%20none%3B%0A%20%20-moz-box-sizing%3A%20padding-box%3B%0A%7D%0A%0A.toolbarButton.dropDown%20.arrow%20%7B%0A%20%20width%3A%2011px%3B%0A%20%20height%3A%2010px%3B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAsAAAAKCAIAAADtkjPUAAAABGdBTUEAAAAAiyVgTQAAAAZ0Uk5TAP8AAAD%2FicAvkAAAADNJREFUGJVj%2FM%2FwnwEvYMIvTZQKFgjFyMCIKQdxABMyB1MaxRZkRchsFHdAJNDMY6SLbwFAWBIF485wzQAAAABJRU5ErkJggg%3D%3D%22)%20no-repeat%3B%0A%20%20display%3A%20inline-block%3B%0A%20%20margin-left%3A%203px%3B%0A%20%20position%3A%20relative%3B%0A%20%20right%3A%200%3B%0A%20%20top%3A%201px%3B%0A%7D%0A%0A.toolbarButton.image%20%7B%0A%20%20padding%3A%200%3B%0A%20%20height%3A%2016px%3B%0A%20%20width%3A%2016px%3B%0A%7D%0A%0A.toolbarButton.text%2C%0A.toolbarSeparator%20%7B%0A%20%20margin%3A%203px%200%203px%200%3B%0A%20%20padding%3A%203px%3B%0A%20%20border%3A%201px%20solid%20transparent%3B%0A%7D%0A%0A.toolbarButton.text%3Ahover%20%7B%0A%20%20background%3A%20url(%22data%3Aimage%2Fgif%3Bbase64%2CR0lGODlhBQCkAdU3AP%2F%2F%2F97e3u7u7uLi4vf39%2Fz8%2FOfn5%2BXl5fX19fLy8fn5%2Bf79%2FuPj493d3enq6ezs7Ovr7P7%2B%2FvDw8Pv7%2B%2Bvs6%2BHh4t%2Fg4N%2Ff3%2FLz8%2BDf3%2F39%2FeHh4fr5%2BfPy8%2Fv6%2B%2FX19PPz8%2Brp6eXl5Pz8%2FfLy8urq6eDf4P3%2B%2Furp6vn6%2BfDx8Onp6ejn5%2BLh4d%2Ff4N%2Fg3%2Brq6uDg3%2Fr7%2Buzr7Pn5%2BvDw8fz9%2FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAADcALAAAAAAFAKQBAAa3QIBwSFwYjYWkUqloOglQKGI6TVivCYFVwOU%2BKA8IxEEmG87ng1o9aLvfFksmEwvY7%2Fibfs%2Fv%2B%2F%2BAgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq%2BwsbKztLWBDbi4eAEXLy4mFy0bGxUVDMfHByJrBixoJSswIShhM2BdXBI1EhIqHRgYICQIH1RRUAopCjQcMhMeExMjGhoFNicR%2BQtE%2FABBADs%3D%22)%20repeat-x%20scroll%200%200%20%23FFFFFF%3B%0A%20%20border-top%3A%201px%20solid%20%23bbb%3B%0A%20%20border-bottom%3A%201px%20solid%20%23aaa%3B%0A%20%20border-left%3A%201px%20solid%20%23bbb%3B%0A%20%20border-right%3A%201px%20solid%20%23aaa%3B%0A%20%20-moz-border-radius%3A%203px%3B%0A%20%20-webkit-border-radius%3A%203px%3B%0A%20%20border-radius%3A%203px%3B%0A%7D%0A%0A.toolbarButton.text%3Aactive%20%7B%0A%20%20background-position%3A%200%20-400px%3B%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.memberLabelCell%20%7B%0A%20%20padding%3A%202px%2050px%202px%200%3B%0A%20%20vertical-align%3A%20top%3B%0A%7D%0A%0A.memberValueCell%20%7B%0A%20%20padding%3A%201px%200%201px%205px%3B%0A%20%20display%3A%20block%3B%0A%20%20overflow%3A%20hidden%3B%0A%7D%0A%0A.memberLabel%20%7B%0A%20%20cursor%3A%20default%3B%0A%20%20-moz-user-select%3A%20none%3B%0A%20%20overflow%3A%20hidden%3B%0A%20%20%2F*position%3A%20absolute%3B*%2F%0A%20%20padding-left%3A%2018px%3B%0A%20%20%2F*max-width%3A%2030%25%3B*%2F%0A%20%20white-space%3A%20nowrap%3B%0A%20%20%2F*%20background-color%3A%20%23FFFFFF%3B%20breaks%20row%20highlighting%20*%2F%0A%7D%0A%0A.memberRow.hasChildren.opened%20%3E%20.memberLabelCell%20%3E%20.memberLabel%20%7B%0A%20%20background-image%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAkAAAAcCAMAAACEVGUKAAAAbFBMVEX%2F%2F%2F94mLUAAACwwtP9%2Ffv8%2FPv39%2FXBuKf39%2FT%2F%2F%2F%2F39vPx8Ov29vT19fHf29L8%2FPrw8Ozt7efq6ePj4Nnb1szk4dnc2M%2FY08nW0cbSzMDPyLvSzL%2FGvq7CuKjl4drAt6bDuqry8u7s6%2BbX0semetVPAAAAAXRSTlMAQObYZgAAAFhJREFUeF69jjcOgDAQwHKXSu29l%2F%2F%2FkUORIgay4smTZcbBwhkEFmAghUCZhWRKGYyjlSzBh5TsyAssq5qsaTvsh5Fsmhettx1evR%2Fw3gt3bz7uT3d%2F%2Be5v0RsFrMjXLGkAAAAASUVORK5CYII%3D%22)%3B%0A%20%20background-position%3A%203px%20-16px%3B%0A%20%20background-color%3A%20transparent%3B%0A%7D%0A%0A.memberRow.hasChildren%20%3E%20.memberLabelCell%20%3E%20.memberLabel%3Ahover%20%7B%0A%20%20cursor%3A%20pointer%3B%0A%20%20color%3A%20blue%3B%0A%20%20text-decoration%3A%20underline%3B%0A%7D%0A%0A.memberRow.hasChildren%20%3E%20.memberLabelCell%20%3E%20.memberLabel%20%7B%0A%20%20background-image%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAkAAAAcCAMAAACEVGUKAAAAbFBMVEX%2F%2F%2F94mLUAAACwwtP9%2Ffv8%2FPv39%2FXBuKf39%2FT%2F%2F%2F%2F39vPx8Ov29vT19fHf29L8%2FPrw8Ozt7efq6ePj4Nnb1szk4dnc2M%2FY08nW0cbSzMDPyLvSzL%2FGvq7CuKjl4drAt6bDuqry8u7s6%2BbX0semetVPAAAAAXRSTlMAQObYZgAAAFhJREFUeF69jjcOgDAQwHKXSu29l%2F%2F%2FkUORIgay4smTZcbBwhkEFmAghUCZhWRKGYyjlSzBh5TsyAssq5qsaTvsh5Fsmhettx1evR%2Fw3gt3bz7uT3d%2F%2Be5v0RsFrMjXLGkAAAAASUVORK5CYII%3D%22)%3B%0A%20%20background-repeat%3A%20no-repeat%3B%0A%20%20background-position%3A%203px%203px%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A.jumpHighlight%20%7B%0A%20%20background-color%3A%20%23C4F4FF%20!important%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A.objectBox-object%20%7B%0A%20%20color%3A%20gray%3B%0A%7D%0A%0A.objectBox-number%20%7B%0A%20%20color%3A%20%23000088%3B%0A%7D%0A%0A.objectBox-string%20%7B%0A%20%20color%3A%20%23FF0000%3B%0A%20%20white-space%3A%20pre-wrap%3B%0A%7D%0A%0A.objectBox-null%2C%0A.objectBox-undefined%20%7B%0A%20%20font-style%3A%20italic%3B%0A%20%20color%3A%20%23787878%3B%0A%7D%0A%0A.objectBox-array%20%7B%0A%20%20color%3A%20gray%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.infoTip%20%7B%0A%20%20z-index%3A%202147483647%3B%0A%20%20position%3A%20fixed%3B%0A%20%20padding%3A%202px%204px%203px%204px%3B%0A%20%20background%3A%20LightYellow%3B%0A%20%20font-family%3A%20Lucida%20Grande%2C%20Tahoma%2C%20sans-serif%3B%0A%20%20color%3A%20%23000000%3B%0A%20%20display%3A%20none%3B%0A%20%20white-space%3A%20nowrap%3B%0A%20%20font-size%3A%2011px%3B%0A%20%20border%3A%201px%20solid%20rgb(126%2C%20171%2C%20205)%3B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAEAAAAoCAIAAACw1AcgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBJREFUeNpi%2Bv%2F%2FPxMMMzAwMCHzkfG%2Ff%2F%2FgNDaMrAZmFiMjIxiDADMzM1iMRAwQYAAtFD8P6pQkpAAAAABJRU5ErkJggg%3D%3D%22)%20repeat-x%20scroll%200px%200px%20rgb(249%2C%20249%2C%20249)%3B%0A%20%20background-position-x%3A%200%3B%0A%20%20background-position-y%3A%20100%25%3B%0A%20%20background-repeat%3A%20repeat-x%3B%0A%20%20-moz-border-radius%3A%203px%3B%0A%20%20-webkit-border-radius%3A%203px%3B%0A%20%20border-radius%3A%203px%3B%0A%20%20-moz-box-shadow%3A%20gray%202px%202px%203px%3B%0A%20%20-webkit-box-shadow%3A%20gray%202px%202px%203px%3B%0A%20%20box-shadow%3A%20gray%202px%202px%203px%3B%0A%20%20%2F*%20IE%20*%2F%0A%20%20filter%3A%20progid%3ADXImageTransform.Microsoft.dropshadow(OffX%3D2%2C%20OffY%3D2%2C%20Color%3D\'gray\')%3B%0A%20%20%2F*%20slightly%20different%20syntax%20for%20IE8%20*%2F%0A%20%20-ms-filter%3A%20%22progid%3ADXImageTransform.Microsoft.dropshadow(OffX%3D2%2C%20OffY%3D2%2C%20Color%3D\'gray\')%22%3B%0A%7D%0A%0A.infoTip%5Bactive%3D%22true%22%5D%20%7B%0A%20%20display%3A%20block%3B%0A%7D%0A%0A.infoTip%5Bmultiline%3D%22true%22%5D%20%7B%0A%20%20background-image%3A%20none%3B%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.popupMenu%20%7B%0A%20%20display%3A%20none%3B%0A%20%20position%3A%20absolute%3B%0A%20%20font-size%3A%2011px%3B%0A%20%20z-index%3A%202147483647%3B%0A%20%20font-family%3A%20Lucida%20Grande%2C%20Tahoma%2C%20sans-serif%3B%0A%7D%0A%0A.popupMenuContent%20%7B%0A%20%20padding%3A%202px%3B%0A%7D%0A%0A.popupMenuSeparator%20%7B%0A%20%20display%3A%20block%3B%0A%20%20position%3A%20relative%3B%0A%20%20padding%3A%201px%2018px%200%3B%0A%20%20text-decoration%3A%20none%3B%0A%20%20color%3A%20%23000%3B%0A%20%20cursor%3A%20default%3B%0A%20%20background%3A%20%23ACA899%3B%0A%20%20margin%3A%202px%200%3B%0A%7D%0A%0A.popupMenuOption%20%7B%0A%20%20display%3A%20block%3B%0A%20%20position%3A%20relative%3B%0A%20%20padding%3A%202px%2018px%3B%0A%20%20text-decoration%3A%20none%3B%0A%20%20color%3A%20%23000%3B%0A%20%20cursor%3A%20default%3B%0A%7D%0A%0A.popupMenuOption%3Ahover%20%7B%0A%20%20color%3A%20%23fff%3B%0A%20%20background%3A%20%23316AC5%3B%0A%7D%0A%0A.popupMenuGroup%20%7B%0A%20%20background%3A%20transparent%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAoAAAAiCAIAAADpr9%2BxAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAGJJREFUOMtj%2FP%2F%2FPwNuwMSAF1AuzcjISEA3LhUIw7GqQLEbUwWKNGYYMOGRQ0jjCjvGAQ5U8qUZDbOODqTTzk21IqAblwqE4VhVoNiNqQJF2ij7GE5pTDmENFa5QRCo5EsDAHQ4HJt1T1mPAAAAAElFTkSuQmCC%22)%20no-repeat%20right%200%3B%0A%7D%0A%0A.popupMenuGroup%3Ahover%20%7B%0A%20%20background%3A%20%23316AC5%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAoAAAAiCAIAAADpr9%2BxAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAGJJREFUOMtj%2FP%2F%2FPwNuwMSAF1AuzcjISEA3LhUIw7GqQLEbUwWKNGYYMOGRQ0jjCjvGAQ5U8qUZDbOODqTTzk21IqAblwqE4VhVoNiNqQJF2ij7GE5pTDmENFa5QRCo5EsDAHQ4HJt1T1mPAAAAAElFTkSuQmCC%22)%20no-repeat%20right%20-17px%3B%0A%7D%0A%0A.popupMenuGroupSelected%20%7B%0A%20%20color%3A%20%23fff%3B%0A%20%20background%3A%20%23316AC5%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAoAAAAiCAIAAADpr9%2BxAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAGJJREFUOMtj%2FP%2F%2FPwNuwMSAF1AuzcjISEA3LhUIw7GqQLEbUwWKNGYYMOGRQ0jjCjvGAQ5U8qUZDbOODqTTzk21IqAblwqE4VhVoNiNqQJF2ij7GE5pTDmENFa5QRCo5EsDAHQ4HJt1T1mPAAAAAElFTkSuQmCC%22)%20no-repeat%20right%20-17px%3B%0A%7D%0A%0A.popupMenuChecked%20%7B%0A%20%20background%3A%20transparent%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAkAAAAiCAYAAACN%2BvPlAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAG9JREFUOMvlksENgFAIQz%2FdSI%2BOpPM4kh5dCU%2BQBhG9qZFb2xd%2BQr%2BoqraLQbsxn4NEpIYMcIiNTCMGDNidcbaBi0A0Mo0YZFWi2vBQLdKNy08%2F3TYPNWSAQ2xkGjFgoJ%2FW43MZ4BAbmUYMIvDWgnfGLTGZLoim1wAAAABJRU5ErkJggg%3D%3D%22)%20no-repeat%204px%200%3B%0A%7D%0A%0A.popupMenuChecked%3Ahover%20%7B%0A%20%20background%3A%20%23316AC5%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAkAAAAiCAYAAACN%2BvPlAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAG9JREFUOMvlksENgFAIQz%2FdSI%2BOpPM4kh5dCU%2BQBhG9qZFb2xd%2BQr%2BoqraLQbsxn4NEpIYMcIiNTCMGDNidcbaBi0A0Mo0YZFWi2vBQLdKNy08%2F3TYPNWSAQ2xkGjFgoJ%2FW43MZ4BAbmUYMIvDWgnfGLTGZLoim1wAAAABJRU5ErkJggg%3D%3D%22)%20no-repeat%204px%20-17px%3B%0A%7D%0A%0A.popupMenuRadioSelected%20%7B%0A%20%20background%3A%20transparent%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAgAAAAiCAIAAADtWg%2BMAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFNJREFUKM9j%2FP%2F%2FPwM2wMSAA1BRggVCMTIywoWgzsHqqv%2F%2F%2F1PZVWjWQLiMAxkkOCUYDbOODnREnZtqBRcyyj4G1YEsCudS2VUQ29AsH9AgwSkBAJC3IPGiQXlHAAAAAElFTkSuQmCC%22)%20no-repeat%204px%200%3B%0A%7D%0A%0A.popupMenuRadioSelected%3Ahover%20%7B%0A%20%20background%3A%20%23316AC5%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAgAAAAiCAIAAADtWg%2BMAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A%2FwD%2FoL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFNJREFUKM9j%2FP%2F%2FPwM2wMSAA1BRggVCMTIywoWgzsHqqv%2F%2F%2F1PZVWjWQLiMAxkkOCUYDbOODnREnZtqBRcyyj4G1YEsCudS2VUQ29AsH9AgwSkBAJC3IPGiQXlHAAAAAElFTkSuQmCC%22)%20no-repeat%204px%20-17px%3B%0A%7D%0A%0A.popupMenuShortcut%20%7B%0A%20%20padding-right%3A%2085px%3B%0A%7D%0A%0A.popupMenuShortcutKey%20%7B%0A%20%20position%3A%20absolute%3B%0A%20%20right%3A%200%3B%0A%20%20top%3A%202px%3B%0A%20%20width%3A%2077px%3B%0A%7D%0A%0A.popupMenuDisabled%20%7B%0A%20%20color%3A%20%23ACA899%20!important%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Shadow%20*%2F%0A%0A.popupMenuShadow%20%7B%0A%20%20float%3A%20left%3B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAzwAAANFCAQAAAAU0jFsAAAAK3RFWHRDcmVhdGlvbiBUaW1lAFRodSA1IEZlYiAyMDA0IDExOjIxOjIyIC0wNjAwcmo8ZgAAAAd0SU1FB9QCBREVH688dW0AAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAEZ0FNQQAAsY8L%2FGEFAAAMo0lEQVR42u3aUWrbQBRA0efYhEIIdP87DU7sjmRDNxDdQHvOoEH2l%2F4ub5jzAMDRznNa6%2FkKAEf7NS9rzYrPXXgAON7vuezhuc16AYCjvc%2FnfMwWnrvwAHC8t7mu%2FbrtwgPA8V5nK85%2BxeDlp78FgP%2FAdrXgea9NeAA43unvdWrhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeABICQ8AKeEBICU8AKSEB4CU8ACQEh4AUsIDQEp4AEgJDwAp4QEgJTwApIQHgJTwAJASHgBSwgNASngASAkPACnhASAlPACkhAeAlPAAkBIeAFLCA0BKeAA43n1fu8uc53Xe5n09rytDp5%2F%2BNgD%2BOfe5rfVMz2V%2F%2BZrPuc4IDwAH2MJzXaX52ppzWX%2Fc1o%2BP2SJ0Eh4Avt024myl%2BVzF2Seer33auc557cIDwHfbjtgeZ2tr5tlCsx2wndfjogEAR7ntg859bo8J53HEZtoB4Cj3eRy5zR%2F5xT6s%2BFAtrQAAAABJRU5ErkJggg%3D%3D%22)%20no-repeat%20bottom%20right%20!important%3B%0A%20%20margin%3A%2010px%200%200%2010px%20!important%3B%0A%20%20margin%3A%2010px%200%200%205px%3B%0A%7D%0A%0A.popupMenuShadowContent%20%7B%0A%20%20display%3A%20block%3B%0A%20%20position%3A%20relative%3B%0A%20%20background-color%3A%20%23fff%3B%0A%20%20border%3A%201px%20solid%20%23a9a9a9%3B%0A%20%20top%3A%20-6px%3B%0A%20%20left%3A%20-6px%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%23optionsMenu%20%7B%0A%20%20%2F*xxxHonza*%2F%0A%20%20top%3A%2022px%3B%0A%20%20left%3A%200%3B%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Console%20Panel%20*%2F%0A%0A.dataTableSizer%20%7B%0A%20%20margin%3A%207px%3B%0A%20%20border%3A%201px%20solid%20%23EEEEEE%3B%0A%7D%0A%0A.dataTableSizer%3Afocus%20%7B%0A%20%20outline%3A%20none%3B%0A%7D%0A%0A%2F*%20If%20the%20table%20is%20displayed%20within%20a%20group%20the%20border%20is%20provided%20by%20that%20group.%20*%2F%0A%0A.logGroup%20.dataTable%20%7B%0A%20%20border%3A%20none%3B%0A%7D%0A%0A.dataTable%20TBODY%20%7B%0A%20%20overflow-x%3A%20hidden%3B%0A%20%20overflow-y%3A%20scroll%3B%0A%7D%0A%0A.dataTable%20%3E%20.dataTableTbody%20%3E%20tr%3Anth-child(even)%20%7B%0A%20%20background-color%3A%20%23EFEFEF%3B%0A%7D%0A%0A.dataTable%20a%20%7B%0A%20%20vertical-align%3A%20middle%3B%0A%7D%0A%0A.dataTableTbody%20%3E%20tr%20%3E%20td%20%7B%0A%20%20padding%3A%201px%204px%200%204px%3B%0A%7D%0A%0A%2F*%20The%20last%20column%20needs%20more%20horizontal%20space%20since%20part%20of%20it%20is%20overlapped%20by%0A%20%20%20the%20vertical%20scroll%20bar%20*%2F%0A%0A.dataTableTbody%20%3E%20tr%20%3E%20td%3Alast-child%20%7B%0A%20%20padding-right%3A%2020px%3B%0A%7D%0A%0A.useA11y%20.dataTable%20*%3Afocus%20%7B%0A%20%20outline-offset%3A%20-2px%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Console%20panel%20filter%20*%2F%0A%0A.panelNode.hideType-table%20.logRow-table%20%7B%0A%20%20display%3A%20none%20!important%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Header%20for%20Net%20panel%20table%20*%2F%0A%0A.headerCell%20%7B%0A%20%20cursor%3A%20pointer%3B%0A%20%20-moz-user-select%3A%20none%3B%0A%20%20border-bottom%3A%201px%20solid%20%239C9C9C%3B%0A%20%20padding%3A%200%20!important%3B%0A%20%20font-weight%3A%20bold%3B%0A%20%20background%3A%20%23C8C8C8%20-moz-linear-gradient(top%2C%20rgba(255%2C%20255%2C%20255%2C%200.3)%2C%20rgba(0%2C%200%2C%200%2C%200.2))%3B%0A%20%20background%3A%20%23C8C8C8%20-webkit-gradient(linear%2C%20left%20top%2C%20left%20bottom%2C%20from(rgba(255%2C%20255%2C%20255%2C%200.3))%2C%20to(rgba(0%2C%200%2C%200%2C%200.2)))%3B%0A%7D%0A%0A.headerCellBox%20%7B%0A%20%20padding%3A%202px%2013px%202px%204px%3B%0A%20%20border-left%3A%201px%20solid%20%23D9D9D9%3B%0A%20%20border-right%3A%201px%20solid%20%239C9C9C%3B%0A%20%20white-space%3A%20nowrap%3B%0A%7D%0A%0A.headerCell%3Ahover%3Aactive%20%7B%0A%20%20background-color%3A%20%23B4B4B4%3B%0A%7D%0A%0A.headerSorted%20%7B%0A%20%20background-color%3A%20%238CA0BE%3B%0A%7D%0A%0A.headerSorted%20%3E%20.headerCellBox%20%7B%0A%20%20border-right-color%3A%20%236B7C93%3B%0A%20%20background%3A%20url(chrome%3A%2F%2Ffirebug%2Fskin%2FarrowDown.png)%20no-repeat%20right%3B%0A%7D%0A%0A.headerSorted.sortedAscending%20%3E%20.headerCellBox%20%7B%0A%20%20background-image%3A%20url(chrome%3A%2F%2Ffirebug%2Fskin%2FarrowUp.png)%3B%0A%7D%0A%0A.headerSorted%3Ahover%3Aactive%20%7B%0A%20%20background-color%3A%20%236E87AA%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Tree%20within%20a%20table%20cell%20*%2F%0A%0A%2F*%20Rules%20for%20the%20(fake)%20root%20object%20that%20represents%20an%20expandable%20tree%20within%20a%20table-cell%20*%2F%0A%0A.memberRow.tableCellRow%20.memberLabelCell%2C%0A.memberRow.tableCellRow%20.memberValueCell%20%7B%0A%20%20padding%3A%200%3B%0A%20%20color%3A%20Gray%3B%0A%7D%0A%0A%2F*%20So%20the%20height%20of%20the%20row%20is%20the%20same%20as%20if%20there%20would%20be%20an%20embedded%20tree%20object%20*%2F%0A%0A.dataTableCell%20%3E%20.objectBox-number%2C%0A.dataTableCell%20%3E%20.objectBox-string%2C%0A.dataTableCell%20%3E%20.objectBox-null%2C%0A.dataTableCell%20%3E%20.objectBox-undefined%2C%0A.dataTableCell%20%3E%20.objectBox-array%20%7B%0A%20%20padding%3A%205px%3B%0A%7D%0A%0A%2F*%20HAR%20Preview%20*%2F%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.pageList%20%7B%0A%20%20width%3A%20100%25%3B%0A%7D%0A%0A.pageTable%20%7B%0A%20%20width%3A%20100%25%3B%0A%20%20font-family%3A%20Lucida%20Grande%2C%20Tahoma%2C%20sans-serif%3B%0A%20%20font-size%3A%2011px%3B%0A%7D%0A%0A.pageCol%20%7B%0A%20%20white-space%3A%20nowrap%3B%0A%20%20border-bottom%3A%201px%20solid%20%23EEEEEE%3B%0A%7D%0A%0A.pageRow%20%7B%0A%20%20font-weight%3A%20bold%3B%0A%20%20height%3A%2017px%3B%0A%20%20background-color%3A%20white%3B%0A%7D%0A%0A.pageRow%3Ahover%20%7B%0A%20%20background%3A%20%23EFEFEF%3B%0A%7D%0A%0A.opened%20%3E%20.pageCol%20%3E%20.pageName%20%7B%0A%20%20background-image%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAkAAAAcCAMAAACEVGUKAAAAbFBMVEX%2F%2F%2F94mLUAAACwwtP9%2Ffv8%2FPv39%2FXBuKf39%2FT%2F%2F%2F%2F39vPx8Ov29vT19fHf29L8%2FPrw8Ozt7efq6ePj4Nnb1szk4dnc2M%2FY08nW0cbSzMDPyLvSzL%2FGvq7CuKjl4drAt6bDuqry8u7s6%2BbX0semetVPAAAAAXRSTlMAQObYZgAAAFhJREFUeF69jjcOgDAQwHKXSu29l%2F%2F%2FkUORIgay4smTZcbBwhkEFmAghUCZhWRKGYyjlSzBh5TsyAssq5qsaTvsh5Fsmhettx1evR%2Fw3gt3bz7uT3d%2F%2Be5v0RsFrMjXLGkAAAAASUVORK5CYII%3D%22)%3B%0A%20%20background-position%3A%203px%20-17px%3B%0A%7D%0A%0A.pageName%20%7B%0A%20%20background-image%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAkAAAAcCAMAAACEVGUKAAAAbFBMVEX%2F%2F%2F94mLUAAACwwtP9%2Ffv8%2FPv39%2FXBuKf39%2FT%2F%2F%2F%2F39vPx8Ov29vT19fHf29L8%2FPrw8Ozt7efq6ePj4Nnb1szk4dnc2M%2FY08nW0cbSzMDPyLvSzL%2FGvq7CuKjl4drAt6bDuqry8u7s6%2BbX0semetVPAAAAAXRSTlMAQObYZgAAAFhJREFUeF69jjcOgDAQwHKXSu29l%2F%2F%2FkUORIgay4smTZcbBwhkEFmAghUCZhWRKGYyjlSzBh5TsyAssq5qsaTvsh5Fsmhettx1evR%2Fw3gt3bz7uT3d%2F%2Be5v0RsFrMjXLGkAAAAASUVORK5CYII%3D%22)%3B%0A%20%20background-repeat%3A%20no-repeat%3B%0A%20%20background-position%3A%203px%202px%3B%0A%20%20padding-left%3A%2018px%3B%0A%20%20font-weight%3A%20bold%3B%0A%20%20cursor%3A%20pointer%3B%0A%7D%0A%0A.pageID%20%7B%0A%20%20color%3A%20gray%3B%0A%7D%0A%0A.pageInfoCol%20%7B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAEAAACRCAIAAACNEUWdAAAABGdBTUEAALGPC%2FxhBQAAAeZJREFUKFMdzktPEwEYheH3f7kxrly4JDGaGBfGuGJjYlypiSFeggaRgEIkDVYMgSBNW6ctZWgZyqU0g3XQsdN2ekEqlBZ6oYXemDozi2f3feccSnmF41ycYnaXIz1mO0xtU0hEOFDX2P8lkleC5OJ%2Bsj8EMrtemy67SceW%2BLyXwqEkmYwnGJNV3u7s8WLrJ08lmcfhGA%2FFKIPBLR74N7j3fZ27Xonb7jA3XSEGvonIxXFiR6NsHw6z8W8I6eAJq%2FuPCOQGEbL38WTu4ErfYjE1wHzyBnPadWYT13D%2BucqMeoXjDZHi%2BjJHYYFD0U3Bv8hf7xz7S05yC9Nk56bQv0yQnhkj7XhH6tMbtMnXaB9fkhg3%2B5Z%2FE%2FbtseKJE1jaxTu%2Fg2t2mwVHhK9TazgnVnG8X2F6ZJmpYT8fXgmMDXkYfe5m5JmLTCZDMplEVVUURUGWZaLRKJubm0QiESRJIhQKIYoiwWCQQCCAz%2BdDEARbv9%2FHMAx6vR6dTodWq8X5%2BTmNRoNarUalUqFcLlMsFikUCuTzeXRdR9M0u%2FO4VLKVLOadpXxyQvn0lBPTqflvqVSrVM28Wr1O%2FazOmZnfaDZoNpt234XlomX2t2m127TNLd1Ol263a2%2B7vLQYGBZzb9%2Fo29tN%2FwFM%2BFqRGQdzIwAAAABJRU5ErkJggg%3D%3D%22)%20repeat-x%20scroll%200%20-112px%20%23FFFFFF%3B%0A%20%20padding%3A%200px%200px%204px%2017px%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Column%20Customization%20*%2F%0A%0A.pageRow%3Ahover%20%3E%20.netOptionsCol%20%3E%20.netOptionsLabel%20%7B%0A%20%20display%3A%20block%3B%0A%7D%0A%0A.pageRow%20%3E%20.netOptionsCol%20%7B%0A%20%20padding-right%3A%202px%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Print%20support%20*%2F%0A%0A%40media%20print%20%7B%0A%20%20.pageInfoCol%20%7B%0A%20%20%20%20background%3A%20none%3B%0A%20%20%7D%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.netTable%20%7B%0A%20%20width%3A%20100%25%3B%0A%20%20border-left%3A%201px%20solid%20%23EFEFEF%3B%0A%20%20font-family%3A%20Lucida%20Grande%2C%20Tahoma%2C%20sans-serif%3B%0A%20%20font-size%3A%2011px%3B%0A%20%20table-layout%3A%20fixed%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A.netRow%20%7B%0A%20%20background%3A%20white%3B%0A%7D%0A%0A.netRow.loaded%20%7B%0A%20%20background%3A%20%23FFFFFF%3B%0A%7D%0A%0A.netHrefCol%3Ahover%20%7B%0A%20%20%2F*background%3A%20white%3B%20the%20summary%20bar%20shouldn\'t%20have%20this%20*%2F%0A%7D%0A%0A.netRow.loaded%3Ahover%20%7B%0A%20%20background%3A%20%23EFEFEF%3B%0A%7D%0A%0A.netCol%20%7B%0A%20%20padding%3A%200%3B%0A%20%20vertical-align%3A%20top%3B%0A%20%20border-bottom%3A%201px%20solid%20%23EFEFEF%3B%0A%20%20white-space%3A%20nowrap%3B%0A%20%20text-overflow%3A%20clip%3B%0A%20%20overflow%3A%20hidden%3B%0A%7D%0A%0A%2F*%20Visual%20separator%20between%20phases%20*%2F%0A%0A.netRow%5BbreakLayout%3D%22true%22%5D%20.netCol%20%7B%0A%20%20border-top%3A%201px%20solid%20rgb(207%2C207%2C207)%3B%0A%7D%0A%0A.netTypeCol%2C%0A.netStatusCol%20%7B%0A%20%20color%3A%20rgb(128%2C%20128%2C%20128)%3B%0A%7D%0A%0A.responseError%20%3E%20.netStatusCol%20%7B%0A%20%20color%3A%20red%3B%0A%7D%0A%0A.responseRedirect%20%3E%20td%20%7B%0A%20%20color%3A%20%23f93%3B%0A%7D%0A%0A.netStatusCol%2C%0A.netTypeCol%2C%0A.netDomainCol%2C%0A.netSizeCol%2C%0A.netTimeCol%20%7B%0A%20%20padding-left%3A%208px%3B%0A%7D%0A%0A.netTimeCol%20%7B%0A%20%20overflow%3A%20visible%3B%0A%7D%0A%0A.netSizeCol%20%7B%0A%20%20text-align%3A%20right%3B%0A%7D%0A%0A.netHrefLabel%20%7B%0A%20%20-moz-box-sizing%3A%20padding-box%3B%0A%20%20overflow%3A%20hidden%3B%0A%20%20z-index%3A%20100%3B%0A%20%20position%3A%20relative%3B%0A%20%20padding-left%3A%2018px%3B%0A%20%20padding-top%3A%201px%3B%0A%20%20font-weight%3A%20bold%3B%0A%7D%0A%0A.netFullHrefLabel%20%7B%0A%20%20position%3A%20absolute%3B%0A%20%20display%3A%20none%3B%0A%20%20-moz-user-select%3A%20none%3B%0A%20%20padding-right%3A%2010px%3B%0A%20%20padding-bottom%3A%203px%3B%0A%20%20background%3A%20%23FFFFFF%3B%0A%7D%0A%0A.netHrefCol%3Ahover%20%3E%20.netStatusLabel%2C%0A.netHrefCol%3Ahover%20%3E%20.netDomainLabel%2C%0A.netHrefCol%3Ahover%20%3E%20.netHrefLabel%20%7B%0A%20%20display%3A%20none%3B%0A%7D%0A%0A.netHrefCol%3Ahover%20%3E%20.netFullHrefLabel%20%7B%0A%20%20display%3A%20block%3B%0A%7D%0A%0A.netRow.loaded%3Ahover%20%3E%20.netCol%20%3E%20.netFullHrefLabel%20%7B%0A%20%20background-color%3A%20%23EFEFEF%3B%0A%7D%0A%0A%2F*.netSizeLabel%20%7B%0D%0A%20%20%20%20padding-left%3A%206px%3B%0D%0A%7D*%2F%0A%0A.netStatusLabel%2C%0A.netTypeLabel%2C%0A.netDomainLabel%2C%0A.netSizeLabel%2C%0A.netTimelineBar%20%7B%0A%20%20padding%3A%201px%200%202px%200%20!important%3B%0A%7D%0A%0A.responseError%20%7B%0A%20%20color%3A%20red%3B%0A%7D%0A%0A%2F*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%2F%0A%0A%2F*%20Net%20Request%20Options%20*%2F%0A%0A.netOptionsCol%20%7B%0A%20%20padding-left%3A%202px%3B%0A%20%20padding-top%3A%203px%3B%0A%7D%0A%0A.netOptionsLabel%20%7B%0A%20%20width%3A%2011px%3B%0A%20%20height%3A%2010px%3B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAsAAAAKCAIAAADtkjPUAAAABGdBTUEAAAAAiyVgTQAAAAZ0Uk5TAP8AAAD%2FicAvkAAAADNJREFUGJVj%2FM%2FwnwEvYMIvTZQKFgjFyMCIKQdxABMyB1MaxRZkRchsFHdAJNDMY6SLbwFAWBIF485wzQAAAABJRU5ErkJggg%3D%3D%22)%20no-repeat%3B%0A%20%20display%3A%20none%3B%0A%7D%0A%0A.netRow%3Ahover%20%3E%20.netOptionsCol%20%3E%20.netOptionsLabel%20%7B%0A%20%20display%3A%20block%3B%0A%7D%0A%0A.netOptionsLabel%3Ahover%20%7B%0A%20%20background-image%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAsAAAAKCAIAAADtkjPUAAAABGdBTUEAAAAAiyVgTQAAAAZ0Uk5TAP8AAAD%2FicAvkAAAADlJREFUGJVjbGhoYMALmPBLE6WCBULV19djyjU2NiLMgHAwpVFsQVaEzEZxB0QCzTx0l2JaRw3fAgCKkA8r8vOI6AAAAABJRU5ErkJggg%3D%3D%22)%3B%0A%7D%0A%0A%2F*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%20*%2F%0A%0A.netHrefLabel%3Ahover%20%7B%0A%20%20cursor%3A%20pointer%3B%0A%7D%0A%0A.isExpandable%20.netHrefLabel%3Ahover%20%7B%0A%20%20cursor%3A%20pointer%3B%0A%20%20color%3A%20blue%3B%0A%20%20text-decoration%3A%20underline%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A.netTimelineBar%20%7B%0A%20%20position%3A%20relative%3B%0A%20%20border-right%3A%2050px%20solid%20transparent%3B%0A%7D%0A%0A.netBlockingBar%20%7B%0A%20%20position%3A%20absolute%3B%0A%20%20left%3A%200%3B%0A%20%20top%3A%200%3B%0A%20%20bottom%3A%200%3B%0A%20%20background%3A%20%23FFFFFF%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAEAAACRCAIAAACNEUWdAAAABGdBTUEAALGPC%2FxhBQAAAeZJREFUKFMdzktPEwEYheH3f7kxrly4JDGaGBfGuGJjYlypiSFeggaRgEIkDVYMgSBNW6ctZWgZyqU0g3XQsdN2ekEqlBZ6oYXemDozi2f3feccSnmF41ycYnaXIz1mO0xtU0hEOFDX2P8lkleC5OJ%2Bsj8EMrtemy67SceW%2BLyXwqEkmYwnGJNV3u7s8WLrJ08lmcfhGA%2FFKIPBLR74N7j3fZ27Xonb7jA3XSEGvonIxXFiR6NsHw6z8W8I6eAJq%2FuPCOQGEbL38WTu4ErfYjE1wHzyBnPadWYT13D%2BucqMeoXjDZHi%2BjJHYYFD0U3Bv8hf7xz7S05yC9Nk56bQv0yQnhkj7XhH6tMbtMnXaB9fkhg3%2B5Z%2FE%2FbtseKJE1jaxTu%2Fg2t2mwVHhK9TazgnVnG8X2F6ZJmpYT8fXgmMDXkYfe5m5JmLTCZDMplEVVUURUGWZaLRKJubm0QiESRJIhQKIYoiwWCQQCCAz%2BdDEARbv9%2FHMAx6vR6dTodWq8X5%2BTmNRoNarUalUqFcLlMsFikUCuTzeXRdR9M0u%2FO4VLKVLOadpXxyQvn0lBPTqflvqVSrVM28Wr1O%2FazOmZnfaDZoNpt234XlomX2t2m127TNLd1Ol263a2%2B7vLQYGBZzb9%2Fo29tN%2FwFM%2BFqRGQdzIwAAAABJRU5ErkJggg%3D%3D%22)%20repeat-x%3B%0A%20%20min-width%3A%200px%3B%0A%20%20z-index%3A%2070%3B%0A%20%20height%3A%2016px%3B%0A%7D%0A%0A.netResolvingBar%20%7B%0A%20%20position%3A%20absolute%3B%0A%20%20left%3A%200%3B%0A%20%20top%3A%200%3B%0A%20%20bottom%3A%200%3B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAEAAACRCAIAAACNEUWdAAAABGdBTUEAALGPC%2FxhBQAAAeZJREFUKFMdzktPEwEYheH3f7kxrly4JDGaGBfGuGJjYlypiSFeggaRgEIkDVYMgSBNW6ctZWgZyqU0g3XQsdN2ekEqlBZ6oYXemDozi2f3feccSnmF41ycYnaXIz1mO0xtU0hEOFDX2P8lkleC5OJ%2Bsj8EMrtemy67SceW%2BLyXwqEkmYwnGJNV3u7s8WLrJ08lmcfhGA%2FFKIPBLR74N7j3fZ27Xonb7jA3XSEGvonIxXFiR6NsHw6z8W8I6eAJq%2FuPCOQGEbL38WTu4ErfYjE1wHzyBnPadWYT13D%2BucqMeoXjDZHi%2BjJHYYFD0U3Bv8hf7xz7S05yC9Nk56bQv0yQnhkj7XhH6tMbtMnXaB9fkhg3%2B5Z%2FE%2FbtseKJE1jaxTu%2Fg2t2mwVHhK9TazgnVnG8X2F6ZJmpYT8fXgmMDXkYfe5m5JmLTCZDMplEVVUURUGWZaLRKJubm0QiESRJIhQKIYoiwWCQQCCAz%2BdDEARbv9%2FHMAx6vR6dTodWq8X5%2BTmNRoNarUalUqFcLlMsFikUCuTzeXRdR9M0u%2FO4VLKVLOadpXxyQvn0lBPTqflvqVSrVM28Wr1O%2FazOmZnfaDZoNpt234XlomX2t2m127TNLd1Ol263a2%2B7vLQYGBZzb9%2Fo29tN%2FwFM%2BFqRGQdzIwAAAABJRU5ErkJggg%3D%3D%22)%20repeat-x%20scroll%200%20-16px%20%23FFFFFF%3B%0A%20%20min-width%3A%200px%3B%0A%20%20z-index%3A%2060%3B%0A%20%20height%3A%2016px%3B%0A%7D%0A%0A.netConnectingBar%20%7B%0A%20%20position%3A%20absolute%3B%0A%20%20left%3A%200%3B%0A%20%20top%3A%200%3B%0A%20%20bottom%3A%200%3B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAEAAACRCAIAAACNEUWdAAAABGdBTUEAALGPC%2FxhBQAAAeZJREFUKFMdzktPEwEYheH3f7kxrly4JDGaGBfGuGJjYlypiSFeggaRgEIkDVYMgSBNW6ctZWgZyqU0g3XQsdN2ekEqlBZ6oYXemDozi2f3feccSnmF41ycYnaXIz1mO0xtU0hEOFDX2P8lkleC5OJ%2Bsj8EMrtemy67SceW%2BLyXwqEkmYwnGJNV3u7s8WLrJ08lmcfhGA%2FFKIPBLR74N7j3fZ27Xonb7jA3XSEGvonIxXFiR6NsHw6z8W8I6eAJq%2FuPCOQGEbL38WTu4ErfYjE1wHzyBnPadWYT13D%2BucqMeoXjDZHi%2BjJHYYFD0U3Bv8hf7xz7S05yC9Nk56bQv0yQnhkj7XhH6tMbtMnXaB9fkhg3%2B5Z%2FE%2FbtseKJE1jaxTu%2Fg2t2mwVHhK9TazgnVnG8X2F6ZJmpYT8fXgmMDXkYfe5m5JmLTCZDMplEVVUURUGWZaLRKJubm0QiESRJIhQKIYoiwWCQQCCAz%2BdDEARbv9%2FHMAx6vR6dTodWq8X5%2BTmNRoNarUalUqFcLlMsFikUCuTzeXRdR9M0u%2FO4VLKVLOadpXxyQvn0lBPTqflvqVSrVM28Wr1O%2FazOmZnfaDZoNpt234XlomX2t2m127TNLd1Ol263a2%2B7vLQYGBZzb9%2Fo29tN%2FwFM%2BFqRGQdzIwAAAABJRU5ErkJggg%3D%3D%22)%20repeat-x%20scroll%200%20-32px%20%23FFFFFF%3B%0A%20%20min-width%3A%200px%3B%0A%20%20z-index%3A%2050%3B%0A%20%20height%3A%2016px%3B%0A%7D%0A%0A.netSendingBar%20%7B%0A%20%20position%3A%20absolute%3B%0A%20%20left%3A%200%3B%0A%20%20top%3A%200%3B%0A%20%20bottom%3A%200%3B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAEAAACRCAIAAACNEUWdAAAABGdBTUEAALGPC%2FxhBQAAAeZJREFUKFMdzktPEwEYheH3f7kxrly4JDGaGBfGuGJjYlypiSFeggaRgEIkDVYMgSBNW6ctZWgZyqU0g3XQsdN2ekEqlBZ6oYXemDozi2f3feccSnmF41ycYnaXIz1mO0xtU0hEOFDX2P8lkleC5OJ%2Bsj8EMrtemy67SceW%2BLyXwqEkmYwnGJNV3u7s8WLrJ08lmcfhGA%2FFKIPBLR74N7j3fZ27Xonb7jA3XSEGvonIxXFiR6NsHw6z8W8I6eAJq%2FuPCOQGEbL38WTu4ErfYjE1wHzyBnPadWYT13D%2BucqMeoXjDZHi%2BjJHYYFD0U3Bv8hf7xz7S05yC9Nk56bQv0yQnhkj7XhH6tMbtMnXaB9fkhg3%2B5Z%2FE%2FbtseKJE1jaxTu%2Fg2t2mwVHhK9TazgnVnG8X2F6ZJmpYT8fXgmMDXkYfe5m5JmLTCZDMplEVVUURUGWZaLRKJubm0QiESRJIhQKIYoiwWCQQCCAz%2BdDEARbv9%2FHMAx6vR6dTodWq8X5%2BTmNRoNarUalUqFcLlMsFikUCuTzeXRdR9M0u%2FO4VLKVLOadpXxyQvn0lBPTqflvqVSrVM28Wr1O%2FazOmZnfaDZoNpt234XlomX2t2m127TNLd1Ol263a2%2B7vLQYGBZzb9%2Fo29tN%2FwFM%2BFqRGQdzIwAAAABJRU5ErkJggg%3D%3D%22)%20repeat-x%20scroll%200%20-48px%20%23FFFFFF%3B%0A%20%20min-width%3A%200px%3B%0A%20%20z-index%3A%2040%3B%0A%20%20height%3A%2016px%3B%0A%7D%0A%0A.netWaitingBar%20%7B%0A%20%20position%3A%20absolute%3B%0A%20%20left%3A%200%3B%0A%20%20top%3A%200%3B%0A%20%20bottom%3A%200%3B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAEAAACRCAIAAACNEUWdAAAABGdBTUEAALGPC%2FxhBQAAAeZJREFUKFMdzktPEwEYheH3f7kxrly4JDGaGBfGuGJjYlypiSFeggaRgEIkDVYMgSBNW6ctZWgZyqU0g3XQsdN2ekEqlBZ6oYXemDozi2f3feccSnmF41ycYnaXIz1mO0xtU0hEOFDX2P8lkleC5OJ%2Bsj8EMrtemy67SceW%2BLyXwqEkmYwnGJNV3u7s8WLrJ08lmcfhGA%2FFKIPBLR74N7j3fZ27Xonb7jA3XSEGvonIxXFiR6NsHw6z8W8I6eAJq%2FuPCOQGEbL38WTu4ErfYjE1wHzyBnPadWYT13D%2BucqMeoXjDZHi%2BjJHYYFD0U3Bv8hf7xz7S05yC9Nk56bQv0yQnhkj7XhH6tMbtMnXaB9fkhg3%2B5Z%2FE%2FbtseKJE1jaxTu%2Fg2t2mwVHhK9TazgnVnG8X2F6ZJmpYT8fXgmMDXkYfe5m5JmLTCZDMplEVVUURUGWZaLRKJubm0QiESRJIhQKIYoiwWCQQCCAz%2BdDEARbv9%2FHMAx6vR6dTodWq8X5%2BTmNRoNarUalUqFcLlMsFikUCuTzeXRdR9M0u%2FO4VLKVLOadpXxyQvn0lBPTqflvqVSrVM28Wr1O%2FazOmZnfaDZoNpt234XlomX2t2m127TNLd1Ol263a2%2B7vLQYGBZzb9%2Fo29tN%2FwFM%2BFqRGQdzIwAAAABJRU5ErkJggg%3D%3D%22)%20repeat-x%20scroll%200%20-64px%20%23FFFFFF%3B%0A%20%20min-width%3A%201px%3B%0A%20%20%2F*%20So%2C%20at%20least%20something%20is%20always%20visible%20*%2F%0A%20%20z-index%3A%2030%3B%0A%20%20height%3A%2016px%3B%0A%7D%0A%0A.netReceivingBar%20%7B%0A%20%20position%3A%20absolute%3B%0A%20%20left%3A%200%3B%0A%20%20top%3A%200%3B%0A%20%20bottom%3A%200%3B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAEAAACRCAIAAACNEUWdAAAABGdBTUEAALGPC%2FxhBQAAAeZJREFUKFMdzktPEwEYheH3f7kxrly4JDGaGBfGuGJjYlypiSFeggaRgEIkDVYMgSBNW6ctZWgZyqU0g3XQsdN2ekEqlBZ6oYXemDozi2f3feccSnmF41ycYnaXIz1mO0xtU0hEOFDX2P8lkleC5OJ%2Bsj8EMrtemy67SceW%2BLyXwqEkmYwnGJNV3u7s8WLrJ08lmcfhGA%2FFKIPBLR74N7j3fZ27Xonb7jA3XSEGvonIxXFiR6NsHw6z8W8I6eAJq%2FuPCOQGEbL38WTu4ErfYjE1wHzyBnPadWYT13D%2BucqMeoXjDZHi%2BjJHYYFD0U3Bv8hf7xz7S05yC9Nk56bQv0yQnhkj7XhH6tMbtMnXaB9fkhg3%2B5Z%2FE%2FbtseKJE1jaxTu%2Fg2t2mwVHhK9TazgnVnG8X2F6ZJmpYT8fXgmMDXkYfe5m5JmLTCZDMplEVVUURUGWZaLRKJubm0QiESRJIhQKIYoiwWCQQCCAz%2BdDEARbv9%2FHMAx6vR6dTodWq8X5%2BTmNRoNarUalUqFcLlMsFikUCuTzeXRdR9M0u%2FO4VLKVLOadpXxyQvn0lBPTqflvqVSrVM28Wr1O%2FazOmZnfaDZoNpt234XlomX2t2m127TNLd1Ol263a2%2B7vLQYGBZzb9%2Fo29tN%2FwFM%2BFqRGQdzIwAAAABJRU5ErkJggg%3D%3D%22)%20repeat-x%20scroll%200%20-80px%20%23B6B6B6%3B%0A%20%20min-width%3A%200px%3B%0A%20%20z-index%3A%2020%3B%0A%20%20height%3A%2016px%3B%0A%7D%0A%0A.fromCache%20.netReceivingBar%2C%0A.fromCache.netReceivingBar%20%7B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAEAAACRCAIAAACNEUWdAAAABGdBTUEAALGPC%2FxhBQAAAeZJREFUKFMdzktPEwEYheH3f7kxrly4JDGaGBfGuGJjYlypiSFeggaRgEIkDVYMgSBNW6ctZWgZyqU0g3XQsdN2ekEqlBZ6oYXemDozi2f3feccSnmF41ycYnaXIz1mO0xtU0hEOFDX2P8lkleC5OJ%2Bsj8EMrtemy67SceW%2BLyXwqEkmYwnGJNV3u7s8WLrJ08lmcfhGA%2FFKIPBLR74N7j3fZ27Xonb7jA3XSEGvonIxXFiR6NsHw6z8W8I6eAJq%2FuPCOQGEbL38WTu4ErfYjE1wHzyBnPadWYT13D%2BucqMeoXjDZHi%2BjJHYYFD0U3Bv8hf7xz7S05yC9Nk56bQv0yQnhkj7XhH6tMbtMnXaB9fkhg3%2B5Z%2FE%2FbtseKJE1jaxTu%2Fg2t2mwVHhK9TazgnVnG8X2F6ZJmpYT8fXgmMDXkYfe5m5JmLTCZDMplEVVUURUGWZaLRKJubm0QiESRJIhQKIYoiwWCQQCCAz%2BdDEARbv9%2FHMAx6vR6dTodWq8X5%2BTmNRoNarUalUqFcLlMsFikUCuTzeXRdR9M0u%2FO4VLKVLOadpXxyQvn0lBPTqflvqVSrVM28Wr1O%2FazOmZnfaDZoNpt234XlomX2t2m127TNLd1Ol263a2%2B7vLQYGBZzb9%2Fo29tN%2FwFM%2BFqRGQdzIwAAAABJRU5ErkJggg%3D%3D%22)%20repeat-x%20scroll%200%20-96px%20%23D6D6D6%3B%0A%20%20border-color%3A%20%23D6D6D6%3B%0A%20%20height%3A%2016px%3B%0A%7D%0A%0A.netPageTimingBar%20%7B%0A%20%20position%3A%20absolute%3B%0A%20%20left%3A%200%3B%0A%20%20top%3A%200%3B%0A%20%20bottom%3A%200%3B%0A%20%20width%3A%201px%3B%0A%20%20z-index%3A%2090%3B%0A%20%20opacity%3A%200.5%3B%0A%20%20display%3A%20none%3B%0A%20%20background-color%3A%20green%3B%0A%20%20%2F*%20The%20vertical%20line%20crosses%20bottom%20row%20border%20*%2F%0A%20%20margin-bottom%3A%20-1px%3B%0A%20%20%2F*%20To%20make%20the%20width%20of%20the%20vertica%20line%20bigger%20so%2C%20it\'s%20easier%20to%20get%20the%20tooltip%20*%2F%0A%20%20border-left%3A%201px%20solid%20white%3B%0A%20%20border-right%3A%201px%20solid%20white%3B%0A%7D%0A%0A.netWindowLoadBar%20%7B%0A%20%20background-color%3A%20red%3B%0A%7D%0A%0A.netContentLoadBar%20%7B%0A%20%20background-color%3A%20blue%3B%0A%7D%0A%0A.netTimeStampBar%20%7B%0A%20%20background-color%3A%20olive%3B%0A%7D%0A%0A.netTimeLabel%20%7B%0A%20%20-moz-box-sizing%3A%20padding-box%3B%0A%20%20position%3A%20absolute%3B%0A%20%20top%3A%201px%3B%0A%20%20left%3A%20100%25%3B%0A%20%20padding-left%3A%206px%3B%0A%20%20color%3A%20%23444444%3B%0A%20%20min-width%3A%2016px%3B%0A%7D%0A%0A.sizeInfoTip%20%7B%0A%20%20font-size%3A%2011px%3B%0A%7D%0A%0A.timeInfoTip%20%7B%0A%20%20width%3A%20150px%3B%0A%20%20height%3A%2040px%3B%0A%20%20font-size%3A%2011px%3B%0A%7D%0A%0A.timeInfoTipBar%2C%0A.timeInfoTipEventBar%20%7B%0A%20%20position%3A%20relative%3B%0A%20%20display%3A%20block%3B%0A%20%20margin%3A%200%3B%0A%20%20opacity%3A%201%3B%0A%20%20height%3A%2015px%3B%0A%20%20width%3A%204px%3B%0A%7D%0A%0A.timeInfoTipStartLabel%20%7B%0A%20%20color%3A%20gray%3B%0A%7D%0A%0A.timeInfoTipSeparator%20%7B%0A%20%20padding-top%3A%2010px%3B%0A%20%20color%3A%20gray%3B%0A%7D%0A%0A.timeInfoTipSeparator%20SPAN%20%7B%0A%20%20white-space%3A%20pre-wrap%3B%0A%7D%0A%0A.timeInfoTipEventBar%20%7B%0A%20%20width%3A%201px%20!important%3B%0A%7D%0A%0A.netWindowLoadBar.timeInfoTipBar%2C%0A.netContentLoadBar.timeInfoTipBar%20%7B%0A%20%20width%3A%201px%3B%0A%7D%0A%0A.netSummaryRow%20.netTimeLabel%2C%0A.loaded%20.netTimeLabel%20%7B%0A%20%20background%3A%20transparent%3B%0A%7D%0A%0A.loaded%20.netTimeBar%20%7B%0A%20%20background%3A%20%23B6B6B6%20url(%22data%3Aimage%2Fgif%3Bbase64%2CR0lGODlhAQAPALMAALe3t8TExN7e3ru7u9LS0sLCwr%2B%2Fv8nJydbW1rm5ucbGxra2ts3Nzdra2r29vQAAACH5BAAAAAAALAAAAAABAA8AAAQLUDRE2FGhGDcSWBEAOw%3D%3D%22)%20repeat-x%3B%0A%20%20border-color%3A%20%23B6B6B6%3B%0A%7D%0A%0A.fromCache%20.netTimeBar%20%7B%0A%20%20background%3A%20%23D6D6D6%20url(%22data%3Aimage%2Fgif%3Bbase64%2CR0lGODlhAQAPALMAAPHx8f7%2B%2FuHh4fj4%2BOXl5e%2Fv7%2Fz8%2FOzs7Onp6fb29tnZ2dbW1vr6%2Bt3d3fT09AAAACH5BAAAAAAALAAAAAABAA8AAAQLMBg2kgPlICKaWhEAOw%3D%3D%22)%20repeat-x%3B%0A%20%20border-color%3A%20%23D6D6D6%3B%0A%7D%0A%0A.netSummaryRow%20.netTimeBar%20%7B%0A%20%20background%3A%20%23BBBBBB%3B%0A%20%20border%3A%20none%3B%0A%20%20display%3A%20inline-block%3B%0A%7D%0A%0A.timeInfoTipCell.startTime%20%7B%0A%20%20padding-right%3A%2025px%3B%0A%7D%0A%0A.timeInfoTipCell.elapsedTime%20%7B%0A%20%20text-align%3A%20right%3B%0A%20%20padding-right%3A%208px%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A.netSummaryLabel%20%7B%0A%20%20color%3A%20%23222222%3B%0A%7D%0A%0A.netSummaryRow%20%7B%0A%20%20background%3A%20%23BBBBBB%20!important%3B%0A%20%20font-weight%3A%20bold%3B%0A%7D%0A%0A.netSummaryRow%20TD%20%7B%0A%20%20padding%3A%201px%200%202px%200%20!important%3B%0A%7D%0A%0A.netSummaryRow%20%3E%20.netCol%20%7B%0A%20%20border-top%3A%201px%20solid%20%23999999%3B%0A%20%20border-bottom%3A%201px%20solid%3B%0A%20%20border-bottom-color%3A%20%23999999%3B%0A%20%20padding-top%3A%201px%3B%0A%7D%0A%0A.netSummaryRow%20%3E%20.netCol%3Afirst-child%20%7B%0A%20%20border-left%3A%201px%20solid%20%23999999%3B%0A%7D%0A%0A.netSummaryRow%20%3E%20.netCol%3Alast-child%20%7B%0A%20%20border-right%3A%201px%20solid%20%23999999%3B%0A%7D%0A%0A.netCountLabel%20%7B%0A%20%20padding-left%3A%2018px%3B%0A%7D%0A%0A.netTotalSizeCol%20%7B%0A%20%20text-align%3A%20right%3B%0A%7D%0A%0A.netTotalTimeCol%20%7B%0A%20%20text-align%3A%20right%3B%0A%7D%0A%0A.netCacheSizeLabel%20%7B%0A%20%20display%3A%20inline-block%3B%0A%20%20float%3A%20left%3B%0A%20%20padding-left%3A%206px%3B%0A%7D%0A%0A.netTotalTimeLabel%20%7B%0A%20%20padding-right%3A%206px%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A.netInfoCol%20%7B%0A%20%20border-top%3A%201px%20solid%20%23EEEEEE%3B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAEAAACRCAIAAACNEUWdAAAABGdBTUEAALGPC%2FxhBQAAAeZJREFUKFMdzktPEwEYheH3f7kxrly4JDGaGBfGuGJjYlypiSFeggaRgEIkDVYMgSBNW6ctZWgZyqU0g3XQsdN2ekEqlBZ6oYXemDozi2f3feccSnmF41ycYnaXIz1mO0xtU0hEOFDX2P8lkleC5OJ%2Bsj8EMrtemy67SceW%2BLyXwqEkmYwnGJNV3u7s8WLrJ08lmcfhGA%2FFKIPBLR74N7j3fZ27Xonb7jA3XSEGvonIxXFiR6NsHw6z8W8I6eAJq%2FuPCOQGEbL38WTu4ErfYjE1wHzyBnPadWYT13D%2BucqMeoXjDZHi%2BjJHYYFD0U3Bv8hf7xz7S05yC9Nk56bQv0yQnhkj7XhH6tMbtMnXaB9fkhg3%2B5Z%2FE%2FbtseKJE1jaxTu%2Fg2t2mwVHhK9TazgnVnG8X2F6ZJmpYT8fXgmMDXkYfe5m5JmLTCZDMplEVVUURUGWZaLRKJubm0QiESRJIhQKIYoiwWCQQCCAz%2BdDEARbv9%2FHMAx6vR6dTodWq8X5%2BTmNRoNarUalUqFcLlMsFikUCuTzeXRdR9M0u%2FO4VLKVLOadpXxyQvn0lBPTqflvqVSrVM28Wr1O%2FazOmZnfaDZoNpt234XlomX2t2m127TNLd1Ol263a2%2B7vLQYGBZzb9%2Fo29tN%2FwFM%2BFqRGQdzIwAAAABJRU5ErkJggg%3D%3D%22)%20repeat-x%20scroll%200%20-112px%20%23FFFFFF%3B%0A%20%20padding-left%3A%2010px%3B%0A%20%20padding-bottom%3A%204px%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A.isExpandable%20.netHrefLabel%20%7B%0A%20%20background-image%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAkAAAAcCAMAAACEVGUKAAAAbFBMVEX%2F%2F%2F94mLUAAACwwtP9%2Ffv8%2FPv39%2FXBuKf39%2FT%2F%2F%2F%2F39vPx8Ov29vT19fHf29L8%2FPrw8Ozt7efq6ePj4Nnb1szk4dnc2M%2FY08nW0cbSzMDPyLvSzL%2FGvq7CuKjl4drAt6bDuqry8u7s6%2BbX0semetVPAAAAAXRSTlMAQObYZgAAAFhJREFUeF69jjcOgDAQwHKXSu29l%2F%2F%2FkUORIgay4smTZcbBwhkEFmAghUCZhWRKGYyjlSzBh5TsyAssq5qsaTvsh5Fsmhettx1evR%2Fw3gt3bz7uT3d%2F%2Be5v0RsFrMjXLGkAAAAASUVORK5CYII%3D%22)%3B%0A%20%20background-repeat%3A%20no-repeat%3B%0A%20%20background-position%3A%203px%203px%3B%0A%7D%0A%0A.netRow.opened%20%3E%20.netCol%20%3E%20.netHrefLabel%20%7B%0A%20%20background-image%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAkAAAAcCAMAAACEVGUKAAAAbFBMVEX%2F%2F%2F94mLUAAACwwtP9%2Ffv8%2FPv39%2FXBuKf39%2FT%2F%2F%2F%2F39vPx8Ov29vT19fHf29L8%2FPrw8Ozt7efq6ePj4Nnb1szk4dnc2M%2FY08nW0cbSzMDPyLvSzL%2FGvq7CuKjl4drAt6bDuqry8u7s6%2BbX0semetVPAAAAAXRSTlMAQObYZgAAAFhJREFUeF69jjcOgDAQwHKXSu29l%2F%2F%2FkUORIgay4smTZcbBwhkEFmAghUCZhWRKGYyjlSzBh5TsyAssq5qsaTvsh5Fsmhettx1evR%2Fw3gt3bz7uT3d%2F%2Be5v0RsFrMjXLGkAAAAASUVORK5CYII%3D%22)%3B%0A%20%20background-position%3A%203px%20-16px%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A.netSizerRow%2C%0A.netSizerRow%20%3E%20.netCol%20%7B%0A%20%20border%3A%200%3B%0A%20%20padding%3A%200%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Column%20Customization%20*%2F%0A%0A.netCol%20%7B%0A%20%20display%3A%20none%3B%0A%7D%0A%0A%2F*%20The%20options%20column%20is%20always%20visible%20*%2F%0A%0A.netCol.netOptionsCol%20%7B%0A%20%20display%3A%20table-cell%3B%0A%7D%0A%0A%23content%5BpreviewCols~%3Durl%5D%20TD.netHrefCol%2C%0A%23content%5BpreviewCols~%3Dstatus%5D%20TD.netStatusCol%2C%0A%23content%5BpreviewCols~%3Ddomain%5D%20TD.netDomainCol%2C%0A%23content%5BpreviewCols~%3Dsize%5D%20TD.netSizeCol%2C%0A%23content%5BpreviewCols~%3Dtimeline%5D%20TD.netTimeCol%2C%0A%23content%5BpreviewCols~%3Dtype%5D%20TD.netTypeCol%20%7B%0A%20%20display%3A%20table-cell%3B%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.requestBodyBodies%20%7B%0A%20%20border-left%3A%201px%20solid%20%23D7D7D7%3B%0A%20%20border-right%3A%201px%20solid%20%23D7D7D7%3B%0A%20%20border-bottom%3A%201px%20solid%20%23D7D7D7%3B%0A%7D%0A%0A.netInfoRow%20.tabView%20%7B%0A%20%20width%3A%2099%25%3B%0A%20%20%2F*%20avoid%201px%20horizontal%20scrollbar%20when%20a%20requst%20is%20expanded%20and%20tabView%20visible%20*%2F%0A%7D%0A%0A.netInfoText%20%7B%0A%20%20padding%3A%208px%3B%0A%20%20background-color%3A%20%23FFFFFF%3B%0A%20%20font-family%3A%20Monaco%2C%20monospace%3B%0A%20%20%2F*overflow-x%3A%20auto%3B%20HTML%20is%20damaged%20in%20case%20of%20big%20(2-3MB)%20responses%20*%2F%0A%7D%0A%0A.netInfoText%5Bselected%3D%22true%22%5D%20%7B%0A%20%20display%3A%20block%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A.netInfoParamName%20%7B%0A%20%20padding%3A%200%2010px%200%200%3B%0A%20%20font-family%3A%20Lucida%20Grande%2C%20Tahoma%2C%20sans-serif%3B%0A%20%20font-weight%3A%20bold%3B%0A%20%20vertical-align%3A%20top%3B%0A%20%20text-align%3A%20right%3B%0A%20%20white-space%3A%20nowrap%3B%0A%7D%0A%0A.netInfoParamValue%20%3E%20PRE%20%7B%0A%20%20margin%3A%200%3B%0A%7D%0A%0A.netInfoHeadersText%2C%0A.netInfoCookiesText%20%7B%0A%20%20padding-top%3A%200%3B%0A%20%20width%3A%20100%25%3B%0A%7D%0A%0A.netInfoParamValue%20%7B%0A%20%20width%3A%20100%25%3B%0A%7D%0A%0A.netInfoHeadersGroup%2C%0A.netInfoCookiesGroup%20%7B%0A%20%20margin-bottom%3A%204px%3B%0A%20%20border-bottom%3A%201px%20solid%20%23D7D7D7%3B%0A%20%20padding-top%3A%208px%3B%0A%20%20padding-bottom%3A%202px%3B%0A%20%20font-family%3A%20Lucida%20Grande%2C%20Tahoma%2C%20sans-serif%3B%0A%20%20font-weight%3A%20bold%3B%0A%20%20color%3A%20%23565656%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20HTML%20Tab%20*%2F%0A%0A.netInfoHtmlPreview%20%7B%0A%20%20border%3A%200%3B%0A%20%20width%3A%20100%25%3B%0A%20%20height%3A%20100px%3B%0A%7D%0A%0A.netInfoHtmlText%20%7B%0A%20%20padding%3A%200%3B%0A%7D%0A%0A%2F*%20Preview%20resizer%20*%2F%0A%0A.htmlPreviewResizer%20%7B%0A%20%20width%3A%20100%25%3B%0A%20%20height%3A%204px%3B%0A%20%20background-image%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAEAAAAFCAIAAAAL5hHIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAB9JREFUGFcBFADr%2FwDp6ekA0tLSAMXFxQC%2Bvr4A1dXVfR4MOg3KYgIAAAAASUVORK5CYII%3D%22)%3B%0A%20%20background-repeat%3A%20repeat-x%3B%0A%20%20cursor%3A%20s-resize%3B%0A%7D%0A%0A%2F*%20When%20HTML%20preview%20resizing%20is%20in%20progress%20mouse%20messages%20are%20not%20sent%20to%0D%0A%20%20%20the%20iframe%20document.%20*%2F%0A%0Abody%5BhResizing%3D%22true%22%5D%20.netInfoHtmlPreview%20%7B%0A%20%20pointer-events%3A%20none%20!important%3B%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.pageStatsBody%5Bclass~%3Dopened%5D%20%7B%0A%20%20border-bottom%3A%201px%20solid%20%23EEEEEE%3B%0A%7D%0A%0A%2F************************************************************************************************%2F%0A%0A.pagePieTable%20%7B%0A%20%20margin%3A%207px%3B%0A%20%20border-right%3A%201px%20solid%20%23EEEEEE%3B%0A%20%20padding-right%3A%207px%3B%0A%20%20display%3A%20inline-table%3B%0A%7D%0A%0A.pieGraph%20%7B%0A%20%20width%3A%20100px%3B%0A%20%20height%3A%20100px%3B%0A%20%20display%3A%20block%3B%0A%7D%0A%0A.pieLabel%20%7B%0A%20%20font-size%3A%2011px%3B%0A%20%20padding-left%3A%2010px%3B%0A%20%20cursor%3A%20default%3B%0A%7D%0A%0A.pieLabel%20SPAN%20%7B%0A%20%20vertical-align%3A%20middle%3B%0A%7D%0A%0A.pieLabel%20.box%20%7B%0A%20%20display%3A%20inline-block%3B%0A%20%20width%3A%2010px%3B%0A%20%20height%3A%2010px%3B%0A%20%20margin-top%3A%201px%3B%0A%7D%0A%0A.pieLabel%20.label%20%7B%0A%20%20padding-left%3A%205px%3B%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.pageTimeline%20%7B%0A%20%20background-color%3A%20%23FFFFFF%3B%0A%20%20color%3A%20%23000000%3B%0A%7D%0A%0A.pageTimelineBody%20%7B%0A%20%20width%3A%20100%25%3B%0A%7D%0A%0A%2F*%20If%20the%20page%20timeline%20is%20displayed%20there%20is%20a%20bottom%20line%20to%20separate%0D%0A%20*%20the%20list%20of%20pages%2Frequests.%20*%2F%0A%0A.pageTimelineBody%5Bclass~%3Dopened%5D%20%7B%0A%20%20border-bottom%3A%201px%20solid%20%23EEEEEE%3B%0A%7D%0A%0A.pageTimelineTable%20%7B%0A%20%20height%3A%20100px%3B%0A%20%20padding-left%3A%205px%3B%0A%7D%0A%0A.pageTimelineCol%20%7B%0A%20%20vertical-align%3A%20bottom%3B%0A%20%20padding-left%3A%204px%3B%0A%20%20outline%3A%20none%3B%0A%20%20-moz-outline-style%3A%20none%3B%0A%20%20-moz-user-focus%3A%20ignore%3B%0A%7D%0A%0A.pageBar%20%7B%0A%20%20width%3A%209px%3B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABEAAAABCAIAAAC32dI2AAAABGdBTUEAAAAAiyVgTQAAACtJREFUCJk1wrENwDAAwzD0%2FVzVsT%2FZkjuF4POez%2Bl01N6plNTGMGoYCPID8zAxh7oeMsoAAAAASUVORK5CYII%3D%22)%20repeat-y%20scroll%200px%200px%20%23FFFFFF%3B%0A%20%20cursor%3A%20pointer%3B%0A%7D%0A%0A.pageBar.selected%20%7B%0A%20%20opacity%3A%200.5%3B%0A%20%20%2F*%20Safari%2C%20Opera%20*%2F%0A%20%20-moz-opacity%3A%200.50%3A%20%0D%0A%20%20%20%20filter%3A%20alpha(opacity%3D50)%3B%0A%20%20%2F*%20IE%20*%2F%0A%7D%0A%0A.pageTimelineCol%3Ahover%20.pageBar%20%7B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABEAAAABCAIAAAC32dI2AAAABGdBTUEAAAAAiyVgTQAAACtJREFUCJk1wrENwDAAwzD0%2FVzVsT%2FZkjuF4POez%2Bl01N6plNTGMGoYCPID8zAxh7oeMsoAAAAASUVORK5CYII%3D%22)%20repeat-y%20scroll%20-8px%200px%20%23FFFFFF%3B%0A%7D%0A%0A.pageTimelineBody%20.connector%20%7B%0A%20%20margin-left%3A%2016px%3B%0A%20%20display%3A%20block%3B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAAABGdBTUEAAAAAiyVgTQAAASVJREFUKJFjYMAHZl9hzp17OASfEiZ8ktmMH43%2B%2FWeYkTX3cCBZBjAzM0xPcVFnZWZk6I6dfZiTJANy5xxJEOXhUDWQF%2BVTFufnFWBkLMJnGQoomH2cJ2%2F%2B0bdvPn77%2F%2F%2F%2F%2F%2F8fv%2F74nzfv6PuC2QcliHLBX6Y%2FjUYKQjzCfBBX83GxM9hribP%2FZmLuJWhA7uwj6qzMTGnB5kpsyOJB5sqcnCzMHlnzDpvhdwEjwwQ3XSlOHk42DKlcD20Bxn8M03AakDv3iB8fF5ulo440MzavyYnxMonycUhmzzmajGFAwexdbP8YGHqDzGQ42dhYselnYGBgYMj30BVjYPzfUjD7OA%2BKAX8ZuBQZGBi2GilLYrodCQjwsrOkOKsf%2Bsnwj5OBgYEBADPFSbwtc5JXAAAAAElFTkSuQmCC%22)%20no-repeat%3B%0A%20%20width%3A%2016px%3B%0A%20%20height%3A%2011px%3B%0A%20%20position%3A%20relative%3B%0A%20%20margin-bottom%3A%20-1px%3B%0A%7D%0A%0A%2F************************************************************************************************%2F%0A%0A.pageDescBox%20.desc%20%7B%0A%20%20font-size%3A%2011px%3B%0A%20%20border%3A%201px%20solid%20rgb(126%2C%20171%2C%20205)%3B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAEAAAAoCAIAAACw1AcgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBJREFUeNpi%2Bv%2F%2FPxMMMzAwMCHzkfG%2Ff%2F%2FgNDaMrAZmFiMjIxiDADMzM1iMRAwQYAAtFD8P6pQkpAAAAABJRU5ErkJggg%3D%3D%22)%20repeat-x%20scroll%200px%200px%20rgb(234%2C%20234%2C%20234)%3B%0A%20%20padding%3A%203px%3B%0A%20%20-moz-border-radius%3A%203px%3B%0A%20%20-webkit-border-radius%3A%203px%3B%0A%20%20border-radius%3A%203px%3B%0A%7D%0A%0A.pageDescBox%20.desc%20.summary%20%7B%0A%20%20font-weight%3A%20bold%3B%0A%7D%0A%0A.pageDescBox%20.desc%20.time%20%7B%0A%20%20padding-left%3A%2010px%3B%0A%7D%0A%0A.pageDescBox%20.desc%20.title%20%7B%0A%20%20color%3A%20black%3B%0A%20%20padding-left%3A%2010px%3B%0A%7D%0A%0A.pageDescBox%20.desc%20.comment%20%7B%0A%20%20color%3A%20gray%3B%0A%20%20padding-top%3A%201px%3B%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Errors%20*%2F%0A%0A.errorTable%20%7B%0A%20%20margin%3A%208px%3B%0A%20%20font-size%3A%2013px%3B%0A%7D%0A%0A.errorProperty%20%7B%0A%20%20color%3A%20gray%3B%0A%20%20font-style%3A%20italic%3B%0A%7D%0A%0A.errorMessage%20%7B%0A%20%20color%3A%20red%3B%0A%7D%0A%0A.errorRow%3Ahover%20%7B%0A%20%20background%3A%20%23EFEFEF%3B%0A%20%20cursor%3A%20pointer%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Context%20Menu%20*%2F%0A%0A.errorOptionsTarget%20%7B%0A%20%20width%3A%2011px%3B%0A%20%20height%3A%2010px%3B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAsAAAAKCAIAAADtkjPUAAAABGdBTUEAAAAAiyVgTQAAAAZ0Uk5TAP8AAAD%2FicAvkAAAADNJREFUGJVj%2FM%2FwnwEvYMIvTZQKFgjFyMCIKQdxABMyB1MaxRZkRchsFHdAJNDMY6SLbwFAWBIF485wzQAAAABJRU5ErkJggg%3D%3D%22)%20no-repeat%3B%0A%20%20visibility%3A%20collapse%3B%0A%7D%0A%0A.errorOptionsTarget%3Ahover%20%7B%0A%20%20background-image%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAsAAAAKCAIAAADtkjPUAAAABGdBTUEAAAAAiyVgTQAAAAZ0Uk5TAP8AAAD%2FicAvkAAAADlJREFUGJVjbGhoYMALmPBLE6WCBULV19djyjU2NiLMgHAwpVFsQVaEzEZxB0QCzTx0l2JaRw3fAgCKkA8r8vOI6AAAAABJRU5ErkJggg%3D%3D%22)%3B%0A%7D%0A%0A%2F**%0A%20*%20The%20context%20menu%20target%20is%20visible%20only%20if%20the%20user%20is%20hovering%20mouse%20over%0A%20*%20the%20error%20entry%20and%20if%20the%20error%20is%20associated%20with%20a%20target%20HAR%20object%0A%20*%2F%0A%0A.errorRow%3Ahover%20%3E%20.errorOptions.hasTarget%20%3E%20.errorOptionsTarget%20%7B%0A%20%20visibility%3A%20visible%3B%0A%7D%0A%0A%2F*%20Application%20Tabs%20*%2F%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.AboutTab%20%7B%0A%20%20margin-left%3A%20100px%3B%0A%7D%0A%0A.AboutTab%20.version%20%7B%0A%20%20font-size%3A%2011px%3B%0A%20%20color%3A%20%23DD467B%3B%0A%7D%0A%0A.tabAboutBody%20%7B%0A%20%20font-family%3A%20Verdana%2CGeneva%2CArial%2CHelvetica%2Csans-serif%3B%0A%20%20font-size%3A%2011.7px%3B%0A%20%20font-style%3A%20normal%3B%0A%20%20font-weight%3A%20400%3B%0A%7D%0A%0A.aboutBody%20%7B%0A%20%20padding%3A%208px%3B%0A%7D%0A%0A.tabAboutBody%20code%20%7B%0A%20%20color%3A%20green%3B%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.tabHomeBody%20%7B%0A%20%20font-family%3A%20Verdana%2CGeneva%2CArial%2CHelvetica%2Csans-serif%3B%0A%20%20font-size%3A%2011.7px%3B%0A%20%20font-style%3A%20normal%3B%0A%20%20font-weight%3A%20400%3B%0A%7D%0A%0A.homeBody%20%7B%0A%20%20padding%3A%208px%3B%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.tabDOMBody%20%7B%0A%20%20font-family%3A%20Lucida%20Grande%2CTahoma%2Csans-serif%3B%0A%20%20font-size%3A%2011px%3B%0A%7D%0A%0A.tabDOMBody%20.domContent%20%7B%0A%20%20position%3A%20absolute%3B%0A%20%20top%3A%2028px%3B%0A%20%20%2F*%20tab%20view%20bar%20%2B%20toolbar%20*%2F%0A%20%20bottom%3A%200px%3B%0A%20%20overflow%3A%20auto%3B%0A%20%20width%3A%20100%25%3B%0A%7D%0A%0A.tabDOMBody%20.domContent%20.domBox%20%7B%0A%20%20width%3A%20100%25%3B%0A%7D%0A%0A.tabDOMBody%20.domContent%20.domBox%20.title%20%7B%0A%20%20color%3A%20gray%3B%0A%20%20padding%3A%208px%200%200%208px%3B%0A%7D%0A%0A.tabDOMBody%20.separator%20%7B%0A%20%20border-bottom%3A%201px%20solid%20%23D7D7D7%3B%0A%7D%0A%0A.tabDOMBody%20.domTable%20%7B%0A%20%20padding%3A%205px%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Toolbar%20*%2F%0A%0A.domToolbar%20%3E%20.toolbar%20%7B%0A%20%20text-align%3A%20right%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Search%20Results%20*%2F%0A%0A.tabDOMBody%20.domContent%20.domBox%20.content%2C%0A.tabDOMBody%20.domContent%20.domBox%20.results%20%7B%0A%20%20vertical-align%3A%20top%3B%0A%7D%0A%0A.resultsDefaultContent%20%7B%0A%20%20color%3A%20%23D7D7D7%3B%0A%20%20font-size%3A%2012px%3B%0A%20%20font-family%3A%20Lucida%20Grande%2CTahoma%2Csans-serif%3B%0A%20%20margin%3A%2060px%3B%0A%20%20text-align%3A%20center%3B%0A%7D%0A%0A.queryResultsViewType%20%7B%0A%20%20border-bottom%3A%201px%20solid%20%23EEEEEE%3B%0A%20%20display%3A%20block%3B%0A%20%20padding%3A%205px%3B%0A%7D%0A%0A.queryResultsViewType%20.type%20%7B%0A%20%20width%3A%2013px%3B%0A%20%20height%3A%2013px%3B%0A%20%20padding%3A%200%3B%0A%20%20margin%3A%200%3B%0A%20%20vertical-align%3A%20bottom%3B%0A%7D%0A%0A.queryResultsViewType%20.label%20%7B%0A%20%20padding-left%3A%205px%3B%0A%7D%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Splitter%20*%2F%0A%0A.domBox%20.splitter%20%7B%0A%20%20width%3A%204px%3B%0A%20%20cursor%3A%20e-resize%3B%0A%20%20background-color%3A%20%23D7D7D7%3B%0A%7D%0A%0A.domBox%20.splitter%2C%0A.domBox%20.results%20%7B%0A%20%20visibility%3A%20collapse%3B%0A%7D%0A%0A.domBox%20.splitter.visible%2C%0A.domBox%20.results.visible%20%7B%0A%20%20visibility%3A%20visible%3B%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.tabSchemaBody%20%7B%0A%20%20font-family%3A%20Monaco%2Cmonospace%3B%0A%20%20font-size%3A%2012px%3B%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A.EmbedTab%20%7B%0A%20%20margin-left%3A%20100px%3B%0A%7D%0A%0A.tabEmbedBody%20%7B%0A%20%20font-family%3A%20Verdana%2CGeneva%2CArial%2CHelvetica%2Csans-serif%3B%0A%20%20font-size%3A%2011.7px%3B%0A%20%20font-style%3A%20normal%3B%0A%20%20font-weight%3A%20400%3B%0A%7D%0A%0A.embedBody%20%7B%0A%20%20padding%3A%208px%3B%0A%7D%0A%0A.tabEmbedBody%20code%20%7B%0A%20%20color%3A%20green%3B%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Preview%20*%2F%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Toolbar%20*%2F%0A%0A%2F*%20Remove%20the%20dotted%20outline%20when%20focused%20*%2F%0A%0A.harDownloadButton%20OBJECT%20%7B%0A%20%20outline%3A%20none%3B%0A%20%20-moz-user-focus%3A%20ignore%3B%0A%7D%0A%0A.harSaveButton%20%7B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAC9UlEQVR42q2TW0zTdxTH%2F2rcaGM7E82MMYqZRs0Ss6hZfNHIRcnMHrYlI2MzLAam0EhIjfGGGEysqaBbnNeJIobC6JJCWy4GhbZQBFvpDQEJCirQVmoLhKoR22Wf%2Fe0DND5zkm%2Fy%2Bz2cz%2Fmec3IEYS4iId%2BjEn60Rk9X2ujv78PT8zgmh7sb20MH7R0PaDa3YTKZOHHZiJBhjUp%2FqFfNABbuvR8RNlzi9zIzH2LU68Pl9uD2dON0uelyOHnU08vUeIDzmrss%2Fa4E%2BffGyAzgk6wOhE2llJRZYoBoNMrExASTk5MEAgG8Xm9M46%2F8FN9uZKXSiuybf5gBfJrVibD1FiU3W2KAp4NDtLZZsbbfj%2BnD2%2BF0EXzppbisnsSjTuQ7K2cBCfseIGyr4MyNe2J6hKmpKUKhEMFgkLGxsVj14eFhAr4Rzt6oY%2FVxJ7KdVbMAyT4bC1K1qK438e%2F7Nzzq7aPFZMZsacXS2ibKiv1hF%2F7R52IRI18UukXARw4k3%2BoovtlINOzn9biXtxN%2B3oz7mQwME%2FIN4X3Wh3%2Bwm5LSGtYVeZDvigNIcm0sTTewRWEk5aCeHcpakg%2FpSTok%2Fo8YSD5aR2pBA2knG0g%2BZWKjqht52t%2BzAGmOnRWZjSzLvMNne5pIyLiHNNOMPMvK4pwOlihsfJ5vZ%2B0xF1%2BK1TcX94gO4mYgVdhJzG5ieVYL6UUGTJY2tDoD5%2F78C9Uf4nqvaSivriUx4wJrcqpJufIE2a44B4sUXazJbWb5fgv5FxrYW1iPsFvPr%2BpGnJ0WRl48i6038bcq0X4veQYvkvghynLtbFC2siqvnQPqan4prEUitpFX2onv%2BQDT09Ni%2BjQrszVsVPeh0PuQpsW1sDC9o3xZtpn14n6V6lv8rL6LTOmiQD8oJv5HJBLh1cgAa5U1fH15iMPmENLUqnez11RUNF%2BSUndR2K71b%2F9JHdLptGFdQ3O4s8sRdjudYaPR%2BFZbcZ15X50KLtim8S9O0ozO33xVOSeX%2FD%2Bh4R5PXdq20AAAAABJRU5ErkJggg%3D%3D%22)%20no-repeat%3B%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0A%2F*************************************************************************************************%2F%0A%0A%2F*%20Search%20*%2F%0A%0A.searchTextBox%20%7B%0A%20%20vertical-align%3A%20sub%3B%0A%20%20margin-right%3A%203px%3B%0A%7D%0A%0A.searchInput%20%7B%0A%20%20outline%3A%20none%3B%0A%20%20%2F*%20Remove%20webkit%20focus%20border%20*%2F%0A%20%20border%3A%201px%20solid%20%23EEEEEE%3B%0A%20%20padding%3A%201px%2017px%201px%203px%3B%0A%20%20width%3A%20300px%3B%0A%7D%0A%0A.searchInput%5Bstatus%3Dnotfound%5D%20%7B%0A%20%20background%3A%20rgb(255%2C%20102%2C%20102)%3B%0A%20%20color%3A%20white%3B%0A%7D%0A%0A.searchBox%20.arrow%20%7B%0A%20%20width%3A%2011px%3B%0A%20%20height%3A%2010px%3B%0A%20%20background%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAsAAAAKCAIAAADtkjPUAAAABGdBTUEAAAAAiyVgTQAAAAZ0Uk5TAP8AAAD%2FicAvkAAAADNJREFUGJVj%2FM%2FwnwEvYMIvTZQKFgjFyMCIKQdxABMyB1MaxRZkRchsFHdAJNDMY6SLbwFAWBIF485wzQAAAABJRU5ErkJggg%3D%3D%22)%20no-repeat%3B%0A%20%20display%3A%20inline-block%3B%0A%20%20position%3A%20relative%3B%0A%20%20margin-left%3A%20-15px%3B%0A%20%20top%3A%201px%3B%0A%20%20cursor%3A%20pointer%3B%0A%7D%0A%0A.searchBox%20.arrow%3Ahover%20%7B%0A%20%20background-image%3A%20url(%22data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAAsAAAAKCAIAAADtkjPUAAAABGdBTUEAAAAAiyVgTQAAAAZ0Uk5TAP8AAAD%2FicAvkAAAADlJREFUGJVjbGhoYMALmPBLE6WCBULV19djyjU2NiLMgHAwpVFsQVaEzEZxB0QCzTx0l2JaRw3fAgCKkA8r8vOI6AAAAABJRU5ErkJggg%3D%3D%22)%3B%0A%7D%0A%0A%2F*%20Disabled%20for%20IE%20*%2F%0A%0A.searchBox%20.arrow%5Bdisabled%3Dtrue%5D%20%7B%0A%20%20display%3A%20none%3B%0A%7D%0A%0A.searchBox%20.resizer%20%7B%0A%20%20cursor%3A%20e-resize%3B%0A%7D%0A%0A%2F*%20Syntax%20Highlighter%20*%2F%0A%0A.dp-highlighter%20%7B%0A%20%20font-family%3A%20%22Consolas%22%2C%20%22Courier%20New%22%2C%20Courier%2C%20mono%2C%20serif%3B%0A%20%20font-size%3A%2012px%3B%0A%20%20%2F*%20background-color%3A%20rgb(238%2C%20238%2C%20238)%3B%20Honza*%2F%0A%20%20width%3A%20100%25%3B%0A%20%20%2F*Honza*%2F%0A%20%20overflow%3A%20auto%3B%0A%20%20%2F*%20Honza%3A%20no%20padding%20margin%3A%2018px%200%2018px%200%20!important%3B*%2F%0A%20%20%2F*%20Honza%3A%20there%20is%20a%20tab%20padding-top%3A%201px%3B%20%20adds%20a%20little%20border%20on%20top%20when%20controls%20are%20hidden%20*%2F%0A%7D%0A%0A%2F*%20clear%20styles%20*%2F%0A%0A.dp-highlighter%20ol%2C%0A.dp-highlighter%20ol%20li%2C%0A.dp-highlighter%20ol%20li%20span%20%7B%0A%20%20margin%3A%200%3B%0A%20%20padding%3A%200%3B%0A%20%20border%3A%20none%3B%0A%7D%0A%0A.dp-highlighter%20a%2C%0A.dp-highlighter%20a%3Ahover%20%7B%0A%20%20background%3A%20none%3B%0A%20%20border%3A%20none%3B%0A%20%20padding%3A%200%3B%0A%20%20margin%3A%200%3B%0A%7D%0A%0A.dp-highlighter%20.bar%20%7B%0A%20%20padding-left%3A%2045px%3B%0A%7D%0A%0A.dp-highlighter.collapsed%20.bar%2C%0A.dp-highlighter.nogutter%20.bar%20%7B%0A%20%20padding-left%3A%200px%3B%0A%7D%0A%0A.dp-highlighter%20ol%20%7B%0A%20%20list-style%3A%20decimal%3B%0A%20%20%2F*%20for%20ie%20*%2F%0A%20%20background-color%3A%20%23fff%3B%0A%20%20margin%3A%200px%200px%201px%2045px%20!important%3B%0A%20%20%2F*%201px%20bottom%20margin%20seems%20to%20fix%20occasional%20Firefox%20scrolling%20*%2F%0A%20%20padding%3A%200px%3B%0A%20%20color%3A%20%235C5C5C%3B%0A%7D%0A%0A.dp-highlighter.nogutter%20ol%2C%0A.dp-highlighter.nogutter%20ol%20li%20%7B%0A%20%20list-style%3A%20none%20!important%3B%0A%20%20margin-left%3A%200px%20!important%3B%0A%7D%0A%0A.dp-highlighter%20ol%20li%2C%0A.dp-highlighter%20.columns%20div%20%7B%0A%20%20list-style%3A%20decimal-leading-zero%3B%0A%20%20%2F*%20better%20look%20for%20others%2C%20override%20cascade%20from%20OL%20*%2F%0A%20%20list-style-position%3A%20outside%20!important%3B%0A%20%20border-left%3A%201px%20solid%20rgb(204%2C204%2C204)%3B%0A%20%20%2F*Honza*%2F%0A%20%20background-color%3A%20%23F8F8F8%3B%0A%20%20color%3A%20%235C5C5C%3B%0A%20%20padding%3A%200%203px%200%2010px%20!important%3B%0A%20%20margin%3A%200%20!important%3B%0A%20%20line-height%3A%2014px%3B%0A%7D%0A%0A.dp-highlighter.nogutter%20ol%20li%2C%0A.dp-highlighter.nogutter%20.columns%20div%20%7B%0A%20%20border%3A%200%3B%0A%7D%0A%0A.dp-highlighter%20.columns%20%7B%0A%20%20background-color%3A%20%23F8F8F8%3B%0A%20%20color%3A%20gray%3B%0A%20%20overflow%3A%20hidden%3B%0A%20%20width%3A%20100%25%3B%0A%7D%0A%0A.dp-highlighter%20.columns%20div%20%7B%0A%20%20padding-bottom%3A%205px%3B%0A%7D%0A%0A.dp-highlighter%20ol%20li.alt%20%7B%0A%20%20background-color%3A%20%23FFF%3B%0A%20%20color%3A%20inherit%3B%0A%7D%0A%0A.dp-highlighter%20ol%20li%20span%20%7B%0A%20%20color%3A%20black%3B%0A%20%20background-color%3A%20inherit%3B%0A%7D%0A%0A%2F*%20Adjust%20some%20properties%20when%20collapsed%20*%2F%0A%0A.dp-highlighter.collapsed%20ol%20%7B%0A%20%20margin%3A%200px%3B%0A%7D%0A%0A.dp-highlighter.collapsed%20ol%20li%20%7B%0A%20%20display%3A%20none%3B%0A%7D%0A%0A%2F*%20Additional%20modifications%20when%20in%20print-view%20*%2F%0A%0A.dp-highlighter.printing%20%7B%0A%20%20border%3A%20none%3B%0A%7D%0A%0A.dp-highlighter.printing%20.tools%20%7B%0A%20%20display%3A%20none%20!important%3B%0A%7D%0A%0A.dp-highlighter.printing%20li%20%7B%0A%20%20display%3A%20list-item%20!important%3B%0A%7D%0A%0A%2F*%20Styles%20for%20the%20tools%20*%2F%0A%0A.dp-highlighter%20.tools%20%7B%0A%20%20padding%3A%203px%208px%203px%2010px%3B%0A%20%20font%3A%209px%20Verdana%2C%20Geneva%2C%20Arial%2C%20Helvetica%2C%20sans-serif%3B%0A%20%20color%3A%20silver%3B%0A%20%20background-color%3A%20%23f8f8f8%3B%0A%20%20padding-bottom%3A%2010px%3B%0A%20%20border-left%3A%203px%20solid%20%236CE26C%3B%0A%7D%0A%0A.dp-highlighter.nogutter%20.tools%20%7B%0A%20%20border-left%3A%200%3B%0A%7D%0A%0A.dp-highlighter.collapsed%20.tools%20%7B%0A%20%20border-bottom%3A%200%3B%0A%7D%0A%0A.dp-highlighter%20.tools%20a%20%7B%0A%20%20font-size%3A%209px%3B%0A%20%20color%3A%20%23a0a0a0%3B%0A%20%20background-color%3A%20inherit%3B%0A%20%20text-decoration%3A%20none%3B%0A%20%20margin-right%3A%2010px%3B%0A%7D%0A%0A.dp-highlighter%20.tools%20a%3Ahover%20%7B%0A%20%20color%3A%20red%3B%0A%20%20background-color%3A%20inherit%3B%0A%20%20text-decoration%3A%20underline%3B%0A%7D%0A%0A%2F*%20About%20dialog%20styles%20*%2F%0A%0A.dp-about%20%7B%0A%20%20background-color%3A%20%23fff%3B%0A%20%20color%3A%20%23333%3B%0A%20%20margin%3A%200px%3B%0A%20%20padding%3A%200px%3B%0A%7D%0A%0A.dp-about%20table%20%7B%0A%20%20width%3A%20100%25%3B%0A%20%20height%3A%20100%25%3B%0A%20%20font-size%3A%2011px%3B%0A%20%20font-family%3A%20Tahoma%2C%20Verdana%2C%20Arial%2C%20sans-serif%20!important%3B%0A%7D%0A%0A.dp-about%20td%20%7B%0A%20%20padding%3A%2010px%3B%0A%20%20vertical-align%3A%20top%3B%0A%7D%0A%0A.dp-about%20.copy%20%7B%0A%20%20border-bottom%3A%201px%20solid%20%23ACA899%3B%0A%20%20height%3A%2095%25%3B%0A%7D%0A%0A.dp-about%20.title%20%7B%0A%20%20color%3A%20red%3B%0A%20%20background-color%3A%20inherit%3B%0A%20%20font-weight%3A%20bold%3B%0A%7D%0A%0A.dp-about%20.para%20%7B%0A%20%20margin%3A%200%200%204px%200%3B%0A%7D%0A%0A.dp-about%20.footer%20%7B%0A%20%20background-color%3A%20%23ECEADB%3B%0A%20%20color%3A%20%23333%3B%0A%20%20border-top%3A%201px%20solid%20%23fff%3B%0A%20%20text-align%3A%20right%3B%0A%7D%0A%0A.dp-about%20.close%20%7B%0A%20%20font-size%3A%2011px%3B%0A%20%20font-family%3A%20Tahoma%2C%20Verdana%2C%20Arial%2C%20sans-serif%20!important%3B%0A%20%20background-color%3A%20%23ECEADB%3B%0A%20%20color%3A%20%23333%3B%0A%20%20width%3A%2060px%3B%0A%20%20height%3A%2022px%3B%0A%7D%0A%0A%2F*%20Language%20specific%20styles%20*%2F%0A%0A.dp-highlighter%20.comment%2C%0A.dp-highlighter%20.comments%20%7B%0A%20%20color%3A%20%23008200%3B%0A%20%20background-color%3A%20inherit%3B%0A%7D%0A%0A.dp-highlighter%20.string%20%7B%0A%20%20color%3A%20blue%3B%0A%20%20background-color%3A%20inherit%3B%0A%7D%0A%0A.dp-highlighter%20.keyword%20%7B%0A%20%20color%3A%20%23069%3B%0A%20%20font-weight%3A%20bold%3B%0A%20%20background-color%3A%20inherit%3B%0A%7D%0A%0A.dp-highlighter%20.preprocessor%20%7B%0A%20%20color%3A%20gray%3B%0A%20%20background-color%3A%20inherit%3B%0A%7D%0A%0A%2F*%20See%20license.txt%20for%20terms%20of%20usage%20*%2F%0A%0Abody%5BvResizing%3D%22true%22%5D%20*%20%7B%0A%20%20cursor%3A%20e-resize%20!important%3B%0A%7D%0A%0Abody%5BhResizing%3D%22true%22%5D%20*%20%7B%0A%20%20cursor%3A%20s-resize%20!important%3B%0A%7D'
, {"filename":"../webapp/scripts/css/harViewer.css"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"0b41211316606213cabe711a8c8236d551066e67-examples/package.json"}
require.memoize("0b41211316606213cabe711a8c8236d551066e67-examples/package.json", 
{
    "directories": {
        "lib": "."
    },
    "dirpath": "../webapp/scripts/examples"
}
, {"filename":"../webapp/scripts/examples/package.json"});
// @pinf-bundle-module: {"file":"../webapp/scripts/tabs/embedTab.js","mtime":1421119883,"wrapper":"amd","format":"amd","id":"9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/embedTab.js"}
require.memoize("9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/embedTab.js", 
/* See license.txt for terms of usage */

require.def("tabs/embedTab", [
    "jquery/jquery",
    "domplate/domplate",
    "domplate/tabView",
    "core/lib",
    "i18n!nls/harViewer",
    "text!tabs/embedTab.html",
    "require"
],

function($, Domplate, TabView, Lib, Strings, EmbedTabHtml, require) { with (Domplate) {
//*************************************************************************************************
// Home Tab

function EmbedTab() {}
EmbedTab.prototype =
{
    id: "Embed",
    label: Strings.embedTabLabel,

    tabHeaderTag:
        A({"class": "$tab.id\\Tab tab", view: "$tab.id", _repObject: "$tab"},
            "$tab.label"
        ),

    bodyTag:
        DIV({"class": "embedBody"}),

    onUpdateBody: function(tabView, body)
    {
        var self = this;
        body = this.bodyTag.replace({}, body);
        body.innerHTML = EmbedTabHtml;
    }
};

return EmbedTab;

//*************************************************************************************************
}})
, {"filename":"../webapp/scripts/tabs/embedTab.js"});
// @pinf-bundle-module: {"file":"../webapp/scripts/tabs/embedTab.html","mtime":1421124575,"wrapper":"url-encoded","format":"utf8","id":"9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/embedTab.html"}
require.memoize("9615fcf0f34aea6a0223978d72809e9b96ea3ea1-tabs/embedTab.html", 
'%3Cdiv%3E%0A%3Ch2%3EEmbed%20the%20HTTP%20Archive%20Viewer%20in%20your%20own%20tooling%3C%2Fh2%3E%0A%0A%3Ctable%20style%3D%22width%3A600px%3B%22%3E%0A%0A%0A%3Ctr%3E%3Ctd%3E%0A%0A%3Cp%3EYou%20can%20embed%20the%20HTTP%20Archive%20Viewer%20as%20a%20widget%20in%20your%20own%20tooling%20by%20loading%20it%20right%20from%20github%20pages%20or%20serving%20the%20static%20files%20from%20your%20own%20webserver.%3C%2Fp%3E%0A%0A%3C%2Ftd%3E%3C%2Ftr%3E%0A%0A%0A%3Ctr%3E%3Ctd%3E%0A%0A%3Ch3%3ELoad%20from%20github%20pages%3C%2Fh3%3E%0A%0A%3Cpre%3E%0A%09%26lt%3Bscript%20src%3D%22http%3A%2F%2Ffireconsole.github.io%2Fharviewer%2Ffireconsole%2Fbundles%2Floader.js%22%3E%26lt%3B%2Fscript%3E%0A%09%20%0A%09%26lt%3Bdiv%20id%3D%22content%22%20version%3D%22%40VERSION%40%22%3E%26lt%3B%2Fdiv%3E%0A%09%20%0A%09%26lt%3Bscript%3E%0A%09%20%20PINF.sandbox(%22http%3A%2F%2Ffireconsole.github.io%2Fharviewer%2Ffireconsole%2Fbundles%2Fplugin.js%22%2C%20function%20(sandbox)%20%7B%0A%09%20%20%20%20%20%20sandbox.main()%3B%0A%09%20%20%7D%2C%20function%20(err)%20%7B%0A%09%20%20%20%20%20%20console.error(%22Error%20while%20loading%20plugin.js%20bundle\'%3A%22%2C%20err.stack)%3B%0A%09%20%20%7D)%3B%0A%09%26lt%3B%2Fscript%3E%0A%3C%2Fpre%3E%0A%0A%3Cp%3ESee%20it%20in%20action%20on%20JSFiddle%3A%20%3Ca%20target%3D%22_blank%22%20href%3D%22http%3A%2F%2Fjsfiddle.net%2Fcadorn%2Fz9py15jw%2F%22%3Ehttp%3A%2F%2Fjsfiddle.net%2Fcadorn%2Fz9py15jw%2F%3C%2Fa%3E%3C%2Fp%3E%0A%0A%3Cp%3EPaste%20%3Ca%20target%3D%22_blank%22%20href%3D%22https%3A%2F%2Fraw.githubusercontent.com%2Ffireconsole%2Fharviewer%2Fmaster%2Fwebapp%2Fscripts%2Fexamples%2Fsoftwareishard.com.har%22%3Ethis%3C%2Fa%3E%20sample%20HAR%20file%20into%20the%20widget.%3C%2Fp%3E%0A%0A%3C%2Ftd%3E%3C%2Ftr%3E%0A%0A%0A%3Ctr%3E%3Ctd%3E%0A%0A%3Ch3%3EServe%20your%20own%20static%20files%3C%2Fh3%3E%0A%0A%3Cp%3EThe%20widget%20is%20composed%20of%20a%20few%20files%20that%20get%20loaded%20using%20the%20%3Ca%20target%3D%22_blank%22%20href%3D%22http%3A%2F%2Fgithub.com%2Fpinf%2Fpinf-loader-js%22%3EPINF%20JavaScript%20Loader%3C%2Fa%3E.%20You%20can%20find%20the%20widget%20files%20%3Ca%20target%3D%22_blank%22%20href%3D%22https%3A%2F%2Fgithub.com%2Ffireconsole%2Fharviewer%2Ftree%2Fmaster%2Ffireconsole%2Fbundles%22%3Ehere%3C%2Fa%3E%20and%20a%20sample%20bootstrap%20file%20in%20addition%20to%20the%20info%20above%20%3Ca%20target%3D%22_blank%22%20href%3D%22https%3A%2F%2Fgithub.com%2Ffireconsole%2Fharviewer%2Fblob%2Fgh-pages%2Findex.html%22%3Ehere%3C%2Fa%3E.%20It%20is%20recommended%20that%20you%20continuously%20deploy%20updates%20to%20these%20files%20as%20changes%20are%20comitted.%3C%2Fp%3E%0A%0A%3C%2Ftd%3E%3C%2Ftr%3E%0A%0A%0A%3C%2Ftable%3E%0A%3C%2Fdiv%3E%0A'
, {"filename":"../webapp/scripts/tabs/embedTab.html"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}