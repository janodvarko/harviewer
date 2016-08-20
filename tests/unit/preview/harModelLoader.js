/**
 * Unit tests for harModelLoader.
 */
define([
    "intern!object",
    "intern/chai!assert",
    "preview/harModelLoader"
], function (registerSuite, assert, Loader) {

    function prefix(prefix, arr) {
        return arr.map(function(it) {
            return ("string" === typeof prefix) ? prefix + it : it;
        });
    }

    function makeUrlFromParams(baseUrl, params) {
        params = params || [];

        // Create the URL to test using the baseUrl and the paths and inputUrls
        var url = "http://harviewer:49001/webapp/";
        if (baseUrl) {
            url += "?baseUrl=" + baseUrl + "&";
        } else {
            url += "?";
        }

        return url + params.join("&");
    }

    function makeUrl(baseUrl, paths, inputUrls) {
        paths = paths || [];
        inputUrls = inputUrls || [];

        var params = prefix("path=", paths).concat(prefix("inputUrl=", inputUrls));
        return makeUrlFromParams(baseUrl, params);
    }

    registerSuite({
        name: "preview/harModelLoader",

        'getLoadOptions': {
            'returns empty options when no parameters exist': function() {
                var expected = {
                    callbackName: null,
                    baseUrl: null,
                    urls: [],
                    inputUrls: [],
                    filePath: null
                };
                assert.deepEqual(Loader.getLoadOptions(""), expected);
            },

            'single "path" parameter (with "baseUrl") populates "loadOptions.urls"': function() {
                var baseUrl = "http://harviewer:49001/selenium/tests/hars/";
                var paths = ["path.har"];
                var expected = {
                    callbackName: null,
                    baseUrl: baseUrl,
                    urls: prefix(baseUrl, paths),
                    inputUrls: [],
                    filePath: paths[0]
                };
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, paths));
                assert.deepEqual(actual, expected);
            },

            'single "path" parameter (without "baseUrl") populates "loadOptions.urls"': function() {
                var baseUrl = null;
                var paths = ["path.har"];
                var expected = {
                    callbackName: null,
                    baseUrl: baseUrl,
                    urls: prefix(baseUrl, paths),
                    inputUrls: [],
                    filePath: paths[0]
                };
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, paths));
                assert.deepEqual(actual, expected);
            },

            'multiple "path" parameters (with "baseUrl") populates "loadOptions.urls"': function() {
                var baseUrl = "http://harviewer:49001/selenium/tests/hars/";
                var paths = ["path1.har", "path2.har"];
                var expected = {
                    callbackName: null,
                    baseUrl: baseUrl,
                    urls: prefix(baseUrl, paths),
                    inputUrls: [],
                    filePath: paths[0]
                };
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, paths));
                assert.deepEqual(actual, expected);
            },

            'multiple "path" parameters (without "baseUrl") populates "loadOptions.urls"': function() {
                var baseUrl = null;
                var paths = ["path1.har", "path2.har"];
                var expected = {
                    callbackName: null,
                    baseUrl: baseUrl,
                    urls: prefix(baseUrl, paths),
                    inputUrls: [],
                    filePath: paths[0]
                };
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, paths));
                assert.deepEqual(actual, expected);
            },

            'single "inputUrl" parameters (with "baseUrl") populates "loadOptions.urls" and "loadOptions.inputUrls"': function() {
                var baseUrl = "http://harviewer:49001/selenium/tests/hars/";
                var inputUrls = ["inputUrl.harp"];
                var expected = {
                    callbackName: null,
                    baseUrl: baseUrl,
                    urls: inputUrls,
                    inputUrls: inputUrls,
                    filePath: null
                };
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, [], inputUrls));
                assert.deepEqual(actual, expected);
            },

            'single "inputUrl" parameters (without "baseUrl") populates "loadOptions.urls" and "loadOptions.inputUrls"': function() {
                var baseUrl = null;
                var inputUrls = ["inputUrl.harp"];
                var expected = {
                    callbackName: null,
                    baseUrl: baseUrl,
                    urls: inputUrls,
                    inputUrls: inputUrls,
                    filePath: null
                };
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, [], inputUrls));
                assert.deepEqual(actual, expected);
            },

            'multiple "inputUrl" parameters (with "baseUrl") populates "loadOptions.urls" and "loadOptions.inputUrls"': function() {
                var baseUrl = "http://harviewer:49001/selenium/tests/hars/";
                var inputUrls = ["inputUrl1.harp", "inputUrl2.harp"];
                var expected = {
                    callbackName: null,
                    baseUrl: baseUrl,
                    urls: inputUrls,
                    inputUrls: inputUrls,
                    filePath: null
                };
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, [], inputUrls));
                assert.deepEqual(actual, expected);
            },

            'multiple "inputUrl" parameters (without "baseUrl") populates "loadOptions.urls" and "loadOptions.inputUrls"': function() {
                var baseUrl = null;
                var inputUrls = ["inputUrl1.harp", "inputUrl2.harp"];
                var expected = {
                    callbackName: null,
                    baseUrl: baseUrl,
                    urls: inputUrls,
                    inputUrls: inputUrls,
                    filePath: null
                };
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, [], inputUrls));
                assert.deepEqual(actual, expected);
            },

            'mixed "path" and "inputUrl" parameters (with "baseUrl") populates "loadOptions.urls" and "loadOptions.inputUrls"': function() {
                var baseUrl = "http://harviewer:49001/selenium/tests/hars/";
                var paths = ["path1.har", "path2.har"];
                var inputUrls = ["inputUrl1.harp", "inputUrl2.harp"];
                var expected = {
                    callbackName: null,
                    baseUrl: baseUrl,
                    urls: prefix(baseUrl, paths).concat(inputUrls),
                    inputUrls: inputUrls,
                    filePath: paths[0]
                };
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, paths, inputUrls));
                assert.deepEqual(actual, expected);
            },

            'mixed "path" and "inputUrl" parameters (without "baseUrl") populates "loadOptions.urls" and "loadOptions.inputUrls"': function() {
                var baseUrl = null;
                var paths = ["path1.har", "path2.har"];
                var inputUrls = ["inputUrl1.harp", "inputUrl2.harp"];
                var expected = {
                    callbackName: null,
                    baseUrl: baseUrl,
                    urls: prefix(baseUrl, paths).concat(inputUrls),
                    inputUrls: inputUrls,
                    filePath: paths[0]
                };
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, paths, inputUrls));
                assert.deepEqual(actual, expected);
            }
        }
    });
});
