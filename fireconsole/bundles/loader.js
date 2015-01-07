/**
 * Author: Christoph Dorn <christoph@christophdorn.com>
 * [UNLICENSE](http://unlicense.org/)
 */

// NOTE: Remove lines marked /*DEBUG*/ when compiling loader for 'min' release!

// Combat pollution when used via <script> tag.
// Don't touch any globals except for `exports` and `PINF`.
;(function (global) {

	// If `PINF` gloabl already exists, don't do anything to change it.
	if (typeof global.PINF !== "undefined") {
		return;
	}

	var loadedBundles = [],
		// @see https://github.com/unscriptable/curl/blob/62caf808a8fd358ec782693399670be6806f1845/src/curl.js#L69
		readyStates = { 'loaded': 1, 'interactive': 1, 'complete': 1 },
		lastModule = null;

	// For older browsers that don't have `Object.keys()` (Firefox 3.6)
	function keys(obj) {
		var keys = [];
		for (var key in obj) {
			keys.push(key);
		}
		return keys;
	}

	function normalizeSandboxArguments(implementation) {
		return function(programIdentifier, options, loadedCallback, errorCallback) {
			/*DEBUG*/ if (typeof options === "function" && typeof loadedCallback === "object") {
			/*DEBUG*/     throw new Error("Callback before options for `require.sandbox(programIdentifier, options, loadedCallback)`");
			/*DEBUG*/ }
			if (typeof options === "function" && !loadedCallback && !errorCallback) {
				loadedCallback = options;
				options = {};
			} else
			if (typeof options === "function" && typeof loadedCallback === "function" && !errorCallback) {
				errorCallback = loadedCallback;
				loadedCallback = options;
				options = {};
			} else {
				options = options || {};
			}
			implementation(programIdentifier, options, loadedCallback, errorCallback);
		};
	}

	// A set of modules working together.
	var Sandbox = function(sandboxIdentifier, sandboxOptions, loadedCallback) {

		var moduleInitializers = {},
			initializedModules = {},
			/*DEBUG*/ bundleIdentifiers = {},
			packages = {},
			headTag,
			loadingBundles = {};

		var sandbox = {
				id: sandboxIdentifier
			};

		/*DEBUG*/ function logDebug() {
		/*DEBUG*/ 	if (sandboxOptions.debug !== true) return;
		/*DEBUG*/ 	// NOTRE: This does not work in google chrome.
		/*DEBUG*/ 	//console.log.apply(null, arguments);
		/*DEBUG*/ 	if (arguments.length === 1) {
		/*DEBUG*/ 		console.log(arguments[0]);
		/*DEBUG*/ 	} else
		/*DEBUG*/ 	if (arguments.length === 2) {
		/*DEBUG*/ 		console.log(arguments[0], arguments[1]);
		/*DEBUG*/ 	} else
		/*DEBUG*/ 	if (arguments.length === 3) {
		/*DEBUG*/ 		console.log(arguments[0], arguments[1], arguments[2]);
		/*DEBUG*/ 	} else
		/*DEBUG*/ 	if (arguments.length === 4) {
		/*DEBUG*/ 		console.log(arguments[0], arguments[1], arguments[2], arguments[3]);
		/*DEBUG*/ 	}
		/*DEBUG*/ }

		// @credit https://github.com/unscriptable/curl/blob/62caf808a8fd358ec782693399670be6806f1845/src/curl.js#L319-360
		function loadInBrowser(uri, loadedCallback) {
			try {
				/*DEBUG*/ logDebug("[pinf-loader]", 'loadInBrowser("' + uri + '")"');
			    // See if we are in a web worker.
			    if (typeof importScripts !== "undefined") {
			        importScripts(uri.replace(/^\/?\{host\}/, ""));
			        return loadedCallback(null);
			    }
			    var document = global.document;
			    var location = document.location;
	            if (/^\/?\{host\}\//.test(uri)) {
	                uri = location.protocol + "//" + location.host + uri.replace(/^\/?\{host\}/, "");
	            } else
	            if (/^\/\//.test(uri)) {
	                uri = location.protocol + "/" + uri;
	            }
				if (!headTag) {
					headTag = document.getElementsByTagName("head")[0];
				}
				var element = document.createElement("script");
				element.type = "text/javascript";
				element.onload = element.onreadystatechange = function(ev) {
					ev = ev || global.event;
					if (ev.type === "load" || readyStates[this.readyState]) {
						this.onload = this.onreadystatechange = this.onerror = null;
						loadedCallback(null, function() {
							element.parentNode.removeChild(element);
						});
					}
				}
				element.onerror = function(err) {
					/*DEBUG*/ console.error(err);
					return loadedCallback(new Error("Error loading '" + uri + "'"));
				}
				element.charset = "utf-8";
				element.async = true;
				element.src = uri;
				element = headTag.insertBefore(element, headTag.firstChild);
			} catch(err) {
				loadedCallback(err);
			}
		}

		function load(bundleIdentifier, packageIdentifier, bundleSubPath, loadedCallback) {
			try {
	            if (packageIdentifier !== "") {
	                bundleIdentifier = ("/" + packageIdentifier + "/" + bundleIdentifier).replace(/\/+/g, "/");
	            }
				if (initializedModules[bundleIdentifier]) {
					// Module is already loaded and initialized.
					loadedCallback(null, sandbox);
				} else {
					// Module is not initialized.
					if (loadingBundles[bundleIdentifier]) {
						// Module is already loading.
						loadingBundles[bundleIdentifier].push(loadedCallback);
					} else {
						// Module is not already loading.
						loadingBundles[bundleIdentifier] = [];
						bundleIdentifier = sandboxIdentifier + bundleSubPath + bundleIdentifier;
						// Default to our script-injection browser loader.
						(sandboxOptions.rootBundleLoader || sandboxOptions.load || loadInBrowser)(bundleIdentifier, function(err, cleanupCallback) {
							if (err) return loadedCallback(err);
						    // The rootBundleLoader is only applicable for the first load.
	                        delete sandboxOptions.rootBundleLoader;
							finalizeLoad(bundleIdentifier);
							loadedCallback(null, sandbox);
							if (cleanupCallback) {
								cleanupCallback();
							}
						});
					}
				}
			} catch(err) {
				loadedCallback(err);
			}
		}

		// Called after a bundle has been loaded. Takes the top bundle off the *loading* stack
		// and makes the new modules available to the sandbox.
		function finalizeLoad(bundleIdentifier)
		{
			// Assume a consistent statically linked set of modules has been memoized.
			/*DEBUG*/ bundleIdentifiers[bundleIdentifier] = loadedBundles[0][0];
			var key;
			for (key in loadedBundles[0][1]) {
				// If we have a package descriptor add it or merge it on top.
				if (/^[^\/]*\/package.json$/.test(key)) {
					// NOTE: Not quite sure if we should allow agumenting package descriptors.
					//       When doing nested requires using same package we can either add all
					//		 mappings (included mappings not needed until further down the tree) to
					//       the first encounter of the package descriptor or add more mappings as
					//       needed down the road. We currently support both.
					if (moduleInitializers[key]) {
						// TODO: Keep array of bundle identifiers instead of overwriting existing one?
						//		 Overwriting may change subsequent bundeling behaviour?
						moduleInitializers[key][0] = bundleIdentifier;
						// Only augment (instead of replace existing values).
						if (typeof moduleInitializers[key][1].main === "undefined") {
							moduleInitializers[key][1].main = loadedBundles[0][1][key][0].main;
						}
						if (loadedBundles[0][1][key][0].mappings) {
							if (!moduleInitializers[key][1].mappings) {
								moduleInitializers[key][1].mappings = {};
							}
							for (var alias in loadedBundles[0][1][key][0].mappings) {
								if (typeof moduleInitializers[key][1].mappings[alias] === "undefined") {
									moduleInitializers[key][1].mappings[alias] = loadedBundles[0][1][key][0].mappings[alias];
								}
							}
						}
					} else {
						moduleInitializers[key] = [bundleIdentifier, loadedBundles[0][1][key][0], loadedBundles[0][1][key][1]];
					}
					// Now that we have a [updated] package descriptor, re-initialize it if we have it already in cache.
					var packageIdentifier = key.split("/").shift();
					if (packages[packageIdentifier]) {
						packages[packageIdentifier].init();
					}
				}
				// Only add modules that don't already exist!
				// TODO: Log warning in debug mode if module already exists.
				if (typeof moduleInitializers[key] === "undefined") {
					moduleInitializers[key] = [bundleIdentifier, loadedBundles[0][1][key][0], loadedBundles[0][1][key][1]];
				}
			}
			loadedBundles.shift();
		}

		var Package = function(packageIdentifier) {
			if (packages[packageIdentifier]) {
				return packages[packageIdentifier];
			}

			var pkg = {
				id: packageIdentifier,
				descriptor: {},
				main: "/main.js",
				mappings: {},
				directories: {},
				libPath: ""
			};

			var parentModule = lastModule;

			pkg.init = function() {
				var descriptor = (moduleInitializers[packageIdentifier + "/package.json"] && moduleInitializers[packageIdentifier + "/package.json"][1]) || {};
				if (descriptor) {
					pkg.descriptor = descriptor;
					if (typeof descriptor.main === "string") {
						pkg.main = descriptor.main;
					}
					pkg.mappings = descriptor.mappings || pkg.mappings;
					pkg.directories = descriptor.directories || pkg.directories;
					// NOTE: We need `lib` directory support so that the source directory structure can be mapped
					//       into the bundle structure without modification. If this is not done, a module doing a relative require
					//       for a resource outside of the lib directory will not find the file.
					pkg.libPath = (typeof pkg.directories.lib !== "undefined" && pkg.directories.lib != "") ? pkg.directories.lib + "/" : pkg.libPath;
				}
			}
			pkg.init();

			function normalizeIdentifier(identifier) {
			    // If we have a period (".") in the basename we want an absolute path from
			    // the root of the package. Otherwise a relative path to the "lib" directory.
			    if (identifier.split("/").pop().indexOf(".") === -1) {
			        // We have a module relative to the "lib" directory of the package.
			        identifier = identifier + ".js";
			    } else
			    if (!/^\//.test(identifier)) {
			        // We want an absolute path for the module from the root of the package.
			        identifier = "/" + identifier;
			    }
                return identifier;
			}

			var Module = function(moduleIdentifier, parentModule) {

				var moduleIdentifierSegment = moduleIdentifier.replace(/\/[^\/]*$/, "").split("/"),
					module = {
						id: moduleIdentifier,
						exports: {},
						parentModule: parentModule,
						bundle: null,
						pkg: packageIdentifier
					};

				function resolveIdentifier(identifier) {
					lastModule = module;
					// Check for plugin prefix.
					var plugin = null;
					if (/^[^!]*!/.test(identifier)) {
						var m = identifier.match(/^([^!]*)!(.+)$/);
						identifier = m[2];
						plugin = m[1];
					}
					function pluginify (id) {
						if (!plugin) return id;
						id = new String(id);
						id.plugin = plugin;
						return id;
					}
					// Check for relative module path to module within same package.
					if (/^\./.test(identifier)) {
						var segments = identifier.replace(/^\.\//, "").split("../");
						identifier = "/" + moduleIdentifierSegment.slice(1, moduleIdentifierSegment.length-segments.length+1).concat(segments[segments.length-1]).join("/");
						if (identifier === "/.") {
							return [pkg, pluginify("")];
						}
						return [pkg, pluginify(normalizeIdentifier(identifier.replace(/\/\.$/, "/")))];
					}
					var splitIdentifier = identifier.split("/");
					// Check for mapped module path to module within mapped package.
					if (typeof pkg.mappings[splitIdentifier[0]] !== "undefined") {
						return [Package(pkg.mappings[splitIdentifier[0]]), pluginify((splitIdentifier.length > 1)?normalizeIdentifier(splitIdentifier.slice(1).join("/")):"")];
					}
					/*DEBUG*/ if (!moduleInitializers["/" + normalizeIdentifier(identifier)]) {
					/*DEBUG*/     throw new Error("Descriptor for package '" + pkg.id + "' in sandbox '" + sandbox.id + "' does not declare 'mappings[\"" + splitIdentifier[0] + "\"]' property nor does sandbox have module memoized at '" + "/" + normalizeIdentifier(identifier) + "' needed to satisfy module path '" + identifier + "' in module '" + moduleIdentifier + "'!");
					/*DEBUG*/ }
					return [Package(""), pluginify("/" + normalizeIdentifier(identifier))];
				}

				// Statically link a module and its dependencies
				module.require = function(identifier) {
					identifier = resolveIdentifier(identifier);
					return identifier[0].require(identifier[1]).exports;
				};

				module.require._module_ = module;

				module.require.supports = [
		            "ucjs-pinf-0"
		        ];

				module.require.id = function(identifier) {
					identifier = resolveIdentifier(identifier);
					return identifier[0].require.id(identifier[1]);
				};

				module.require.async = function(identifier, loadedCallback, errorCallback) {
					identifier = resolveIdentifier(identifier);
					identifier[0].load(identifier[1], moduleInitializers[moduleIdentifier][0], function(err, moduleAPI) {
						if (err) {
							if (errorCallback) return errorCallback(err);
							throw err;
						}
						loadedCallback(moduleAPI);
					});
				};

				module.require.sandbox = normalizeSandboxArguments(function(programIdentifier, options, loadedCallback, errorCallback) {
					options.load = options.load || sandboxOptions.load;
	                // If the `programIdentifier` is relative it is resolved against the URI of the owning sandbox (not the owning page).
					if (/^\./.test(programIdentifier))
					{
					    programIdentifier = sandboxIdentifier + "/" + programIdentifier;
					    // HACK: Temporary hack as zombie (https://github.com/assaf/zombie) does not normalize path before sending to server.
					    programIdentifier = programIdentifier.replace(/\/\.\//g, "/");
					}
					return PINF.sandbox(programIdentifier, options, loadedCallback, errorCallback);
				});
				module.require.sandbox.id = sandboxIdentifier;

				module.load = function() {
					module.bundle = moduleInitializers[moduleIdentifier][0];
					if (typeof moduleInitializers[moduleIdentifier][1] === "function") {

						var moduleInterface = {
							id: module.id,
							filename: 
								// The `filename` from the meta info attached to the module.
								// This is typically where the module was originally found on the filesystem.
								moduleInitializers[moduleIdentifier][2].filename ||
								// Fall back to the virtual path of the module in the bundle.
								// TODO: Insert a delimiter between bundle and module id.
								(module.bundle.replace(/\.js$/, "") + "/" + module.id).replace(/\/+/g, "/"),
							exports: {}
						}

				        if (packageIdentifier === "" && pkg.main === moduleIdentifier) {
				        	module.require.main = moduleInterface;
				        }

						if (sandboxOptions.onInitModule) {
							sandboxOptions.onInitModule(moduleInterface, module, pkg, sandbox, {
								normalizeIdentifier: normalizeIdentifier,
								resolveIdentifier: resolveIdentifier,
								finalizeLoad: finalizeLoad,
								moduleInitializers: moduleInitializers,
								initializedModules: initializedModules
							});
						}

						var exports = moduleInitializers[moduleIdentifier][1](module.require, module.exports, moduleInterface);
						if (
							typeof moduleInterface.exports !== "undefined" &&
							(
								typeof moduleInterface.exports !== "object" ||
								keys(moduleInterface.exports).length !== 0
							)
						) {
							module.exports = moduleInterface.exports;
						} else
						if (typeof exports !== "undefined") {
							module.exports = exports;
						}
					} else
					if (typeof moduleInitializers[moduleIdentifier][1] === "string") {
						// TODO: Use more optimal string encoding algorythm to reduce payload size?
						module.exports = decodeURIComponent(moduleInitializers[moduleIdentifier][1]);
					} else {
						module.exports = moduleInitializers[moduleIdentifier][1];
					}
				};

				/*DEBUG*/ module.getReport = function() {
				/*DEBUG*/ 	var exportsCount = 0,
				/*DEBUG*/ 		key;
				/*DEBUG*/ 	for (key in module.exports) {
				/*DEBUG*/ 		exportsCount++;
				/*DEBUG*/ 	}
				/*DEBUG*/ 	return {
				/*DEBUG*/ 		exports: exportsCount
				/*DEBUG*/ 	};
				/*DEBUG*/ };

				return module;
			};

			pkg.load = function(moduleIdentifier, bundleIdentifier, loadedCallback) {
				// If module/bundle to be loaded asynchronously is already memoized we skip the load.
				if (moduleInitializers[packageIdentifier + moduleIdentifier]) {
					return loadedCallback(null, pkg.require(moduleIdentifier).exports);
				}
				var bundleSubPath = bundleIdentifier.substring(sandboxIdentifier.length);
                load(
                	((!/^\//.test(moduleIdentifier))?"/"+pkg.libPath:"") + moduleIdentifier,
                	packageIdentifier,
                	bundleSubPath.replace(/\.js$/g, ""),
                	function(err) {
	                	if (err) return loadedCallback(err);
	                    loadedCallback(null, pkg.require(moduleIdentifier).exports);
	                }
	            );
			}

			pkg.require = function(moduleIdentifier) {

				var plugin = moduleIdentifier.plugin;

				if (moduleIdentifier) {
	                if (!/^\//.test(moduleIdentifier)) {
	                    moduleIdentifier = ("/" + ((moduleIdentifier.substring(0, pkg.libPath.length)===pkg.libPath)?"":pkg.libPath)).replace(/\/\.\//, "/") + moduleIdentifier;
	                }
					moduleIdentifier = packageIdentifier + moduleIdentifier;
				} else {
					moduleIdentifier = pkg.main;
				}

				if (!initializedModules[moduleIdentifier]) {
					/*DEBUG*/ if (!moduleInitializers[moduleIdentifier]) {
					/*DEBUG*/ 	console.error("[pinf-loader-js]", "moduleInitializers", moduleInitializers);
					/*DEBUG*/ 	throw new Error("Module '" + moduleIdentifier + "' not found in sandbox '" + sandbox.id + "'!");
					/*DEBUG*/ }
					(initializedModules[moduleIdentifier] = Module(moduleIdentifier, lastModule)).load();
				}

				var loadingBundlesCallbacks;
				if (loadingBundles[moduleIdentifier]) {
					loadingBundlesCallbacks = loadingBundles[moduleIdentifier];
					delete loadingBundles[moduleIdentifier];
					for (var i=0 ; i<loadingBundlesCallbacks.length ; i++) {
						loadingBundlesCallbacks[i](null, sandbox);
					}
				}

				// TODO: Do this via plugins registered using sandbox options.
				// TODO: Cache response so we only process files once.
				var moduleInfo = Object.create(initializedModules[moduleIdentifier]);
				// RequireJS/AMD international strings plugin using root by default.
				if (plugin === "i18n") {
					moduleInfo.exports = moduleInfo.exports.root;
				}

				return moduleInfo;
			}

            pkg.require.id = function(moduleIdentifier) {
                if (!/^\//.test(moduleIdentifier)) {
                    moduleIdentifier = "/" + pkg.libPath + moduleIdentifier;
                }
                return (((packageIdentifier !== "")?"/"+packageIdentifier+"/":"") + moduleIdentifier).replace(/\/+/g, "/");
            }

			/*DEBUG*/ pkg.getReport = function() {
			/*DEBUG*/ 	return {
			/*DEBUG*/ 		main: pkg.main,
			/*DEBUG*/ 		mappings: pkg.mappings,
			/*DEBUG*/ 		directories: pkg.directories,
			/*DEBUG*/ 		libPath: pkg.libPath
			/*DEBUG*/ 	};
			/*DEBUG*/ }

			if (sandboxOptions.onInitPackage) {
				sandboxOptions.onInitPackage(pkg, sandbox, {
					normalizeIdentifier: normalizeIdentifier,
					finalizeLoad: finalizeLoad,
					moduleInitializers: moduleInitializers,
					initializedModules: initializedModules
				});
			}

			packages[packageIdentifier] = pkg;

			return pkg;
		}

		// Get a module and initialize it (statically link its dependencies) if it is not already so
		sandbox.require = function(moduleIdentifier) {
			return Package("").require(moduleIdentifier).exports;
		}

		// Call the 'main' module of the program
		sandbox.boot = function() {
			/*DEBUG*/ if (typeof Package("").main !== "string") {
			/*DEBUG*/ 	throw new Error("No 'main' property declared in '/package.json' in sandbox '" + sandbox.id + "'!");
			/*DEBUG*/ }
			return sandbox.require(Package("").main);
		};

		// Call the 'main' exported function of the main' module of the program
		sandbox.main = function() {
			var exports = sandbox.boot();
			return ((exports.main)?exports.main.apply(null, arguments):exports);
		};

		/*DEBUG*/ sandbox.getReport = function() {
		/*DEBUG*/ 	var report = {
		/*DEBUG*/ 			bundles: {},
		/*DEBUG*/ 			packages: {},
		/*DEBUG*/ 			modules: {}
		/*DEBUG*/ 		},
		/*DEBUG*/ 		key;
		/*DEBUG*/ 	for (key in bundleIdentifiers) {
		/*DEBUG*/ 		report.bundles[key] = bundleIdentifiers[key];
		/*DEBUG*/ 	}
		/*DEBUG*/ 	for (key in packages) {
		/*DEBUG*/ 		report.packages[key] = packages[key].getReport();
		/*DEBUG*/ 	}
		/*DEBUG*/ 	for (key in moduleInitializers) {
		/*DEBUG*/ 		if (initializedModules[key]) {
		/*DEBUG*/ 			report.modules[key] = initializedModules[key].getReport();
		/*DEBUG*/ 		} else {
		/*DEBUG*/ 			report.modules[key] = {};
		/*DEBUG*/ 		}
		/*DEBUG*/ 	}
		/*DEBUG*/ 	return report;
		/*DEBUG*/ }
		/*DEBUG*/ sandbox.reset = function() {
		/*DEBUG*/   moduleInitializers = {};
		/*DEBUG*/   initializedModules = {};
		/*DEBUG*/   bundleIdentifiers = {};
		/*DEBUG*/   packages = {};
		/*DEBUG*/   loadingBundles = {};
		/*DEBUG*/ }

		load(".js", "", "", loadedCallback);

		return sandbox;
	};


	// The global `require` for the 'external' (to the loader) environment.
	var Loader = function() {

		var 
			/*DEBUG*/ bundleIdentifiers = {},
			sandboxes = {};

		var Require = function(bundle) {

			// Address a specific sandbox or currently loading sandbox if initial load.
			var bundleHandler = function(uid, callback) {
				/*DEBUG*/ if (uid && bundleIdentifiers[uid]) {
				/*DEBUG*/ 	throw new Error("You cannot split require.bundle(UID) calls where UID is constant!");
				/*DEBUG*/ }
				/*DEBUG*/ bundleIdentifiers[uid] = true;
				var moduleInitializers = {},
					req = new Require(uid);
				delete req.bundle;
				// Store raw module in loading bundle
				req.memoize = function(moduleIdentifier, moduleInitializer, moduleMeta) {
					moduleInitializers[moduleIdentifier] = [moduleInitializer, moduleMeta || {}];
				}
				callback(req);
				loadedBundles.push([uid, moduleInitializers]);
			}
			var activeBundleHandler = bundleHandler;
			this.bundle = function () {
				return activeBundleHandler.apply(null, arguments);
			}
			this.setActiveBundleHandler = function (handler) {
				var oldHandler = activeBundleHandler;
				activeBundleHandler = handler;
				return oldHandler;
			}
		}

		var require = new Require();

		// TODO: @see URL_TO_SPEC
		require.supports = [
			"ucjs-pinf-0"
		];

		// Create a new environment to memoize modules to.
		// If relative, the `programIdentifier` is resolved against the URI of the owning page (this is only for the global require).
		require.sandbox = normalizeSandboxArguments(function(programIdentifier, options, loadedCallback, errorCallback) {
			var sandboxIdentifier = programIdentifier.replace(/\.js$/, "");
			return sandboxes[sandboxIdentifier] = Sandbox(sandboxIdentifier, options, function(err, sandbox) {
				if (err) {
					if (errorCallback) return errorCallback(err);
					throw err;
				}
				loadedCallback(sandbox);
			});
		});
		
		/*DEBUG*/ require.getReport = function() {
		/*DEBUG*/ 	var report = {
		/*DEBUG*/ 			sandboxes: {}
		/*DEBUG*/ 		},
		/*DEBUG*/ 		key;
		/*DEBUG*/ 	for (key in sandboxes) {
		/*DEBUG*/ 		report.sandboxes[key] = sandboxes[key].getReport();
		/*DEBUG*/ 	}
		/*DEBUG*/ 	return report;
		/*DEBUG*/ }
		/*DEBUG*/ require.reset = function() {
		/*DEBUG*/ 	for (key in sandboxes) {
		/*DEBUG*/ 		sandboxes[key].reset();
		/*DEBUG*/ 	}
		/*DEBUG*/ 	sandboxes = {};
		/*DEBUG*/ 	bundleIdentifiers = {};
		/*DEBUG*/ 	loadedBundles = [];
		/*DEBUG*/ }

		return require;
	}

	// Set `PINF` gloabl.
	global.PINF = PINF = Loader();

	// Export `require` for CommonJS if `module` and `exports` globals exists.
	if (typeof module === "object" && typeof exports === "object") {
		module.exports = PINF;
	}

}(this));
