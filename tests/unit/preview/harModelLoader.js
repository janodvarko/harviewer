/**
 * Unit tests for harModelLoader.
 */
define([
    "intern!object",
    "intern/chai!assert",
    "preview/harModelLoader"
], function (registerSuite, assert, Loader) {

    function assign(target, src1, src2, etc) {
        for (var i = 1; i < arguments.length; i++) {
            for (var k in arguments[i]) {
                target[k] = arguments[i][k];
            }
        }
        return target;
    }

    function prefix(prefix, arr) {
        return arr.map(function(it) {
            return ("string" === typeof prefix) ? prefix + it : it;
        });
    }

    function makeUrlFromParams(baseUrl, params) {
        params = params || [];

        var url = "http://harviewer:49001/webapp/";
        if (baseUrl) {
            url += "?baseUrl=" + baseUrl + "&";
        } else {
            url += "?";
        }

        return url + params.join("&");
    }

    function makeUrl(baseUrl, paths, inputUrls, hars, harps) {
        paths = paths || [];
        inputUrls = inputUrls || [];
        hars = hars || [];
        harps = harps || [];

        var params = prefix("path=", paths)
            .concat(prefix("inputUrl=", inputUrls))
            .concat(prefix("har=", hars))
            .concat(prefix("harp=", harps));
        return makeUrlFromParams(baseUrl, params);
    }

    /**
     * Returns the default expectations.
     */
    function makeExpected() {
        return {
            callbackName: null,
            baseUrl: null,
            urls: [],
            inputUrls: [],
            hars: [],
            harps: [],
            filePath: null
        };
    }

    registerSuite({
        name: "preview/harModelLoader",

        'getLoadOptions': {
            'returns empty options when no parameters exist': function() {
                var expected = makeExpected();
                assert.deepEqual(Loader.getLoadOptions(""), expected);
            },

            // Tests for legacy parameters, "path" and "inputUrl"

            'single "path" parameter (with "baseUrl") populates "loadOptions.urls"': function() {
                var baseUrl = "http://harviewer:49001/selenium/tests/hars/";
                var paths = ["path.har"];
                var expected = assign(makeExpected(), {
                    baseUrl: baseUrl,
                    urls: prefix(baseUrl, paths),
                    filePath: paths[0]
                });
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, paths));
                assert.deepEqual(actual, expected);
            },

            'single "path" parameter (without "baseUrl") populates "loadOptions.urls"': function() {
                var baseUrl = null;
                var paths = ["path.har"];
                var expected = assign(makeExpected(), {
                    baseUrl: baseUrl,
                    urls: prefix(baseUrl, paths),
                    filePath: paths[0]
                });
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, paths));
                assert.deepEqual(actual, expected);
            },

            'multiple "path" parameters (with "baseUrl") populates "loadOptions.urls"': function() {
                var baseUrl = "http://harviewer:49001/selenium/tests/hars/";
                var paths = ["path1.har", "path2.har"];
                var expected = assign(makeExpected(), {
                    baseUrl: baseUrl,
                    urls: prefix(baseUrl, paths),
                    filePath: paths[0]
                });
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, paths));
                assert.deepEqual(actual, expected);
            },

            'multiple "path" parameters (without "baseUrl") populates "loadOptions.urls"': function() {
                var baseUrl = null;
                var paths = ["path1.har", "path2.har"];
                var expected = assign(makeExpected(), {
                    baseUrl: baseUrl,
                    urls: prefix(baseUrl, paths),
                    filePath: paths[0]
                });
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, paths));
                assert.deepEqual(actual, expected);
            },

            'single "inputUrl" parameters (with "baseUrl") populates "loadOptions.urls" and "loadOptions.inputUrls"': function() {
                var baseUrl = "http://harviewer:49001/selenium/tests/hars/";
                var inputUrls = ["inputUrl.harp"];
                var expected = assign(makeExpected(), {
                    baseUrl: baseUrl,
                    urls: inputUrls,
                    inputUrls: inputUrls
                });
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, [], inputUrls));
                assert.deepEqual(actual, expected);
            },

            'single "inputUrl" parameters (without "baseUrl") populates "loadOptions.urls" and "loadOptions.inputUrls"': function() {
                var baseUrl = null;
                var inputUrls = ["inputUrl.harp"];
                var expected = assign(makeExpected(), {
                    baseUrl: baseUrl,
                    urls: inputUrls,
                    inputUrls: inputUrls
                });
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, [], inputUrls));
                assert.deepEqual(actual, expected);
            },

            'multiple "inputUrl" parameters (with "baseUrl") populates "loadOptions.urls" and "loadOptions.inputUrls"': function() {
                var baseUrl = "http://harviewer:49001/selenium/tests/hars/";
                var inputUrls = ["inputUrl1.harp", "inputUrl2.harp"];
                var expected = assign(makeExpected(), {
                    baseUrl: baseUrl,
                    urls: inputUrls,
                    inputUrls: inputUrls
                });
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, [], inputUrls));
                assert.deepEqual(actual, expected);
            },

            'multiple "inputUrl" parameters (without "baseUrl") populates "loadOptions.urls" and "loadOptions.inputUrls"': function() {
                var baseUrl = null;
                var inputUrls = ["inputUrl1.harp", "inputUrl2.harp"];
                var expected = assign(makeExpected(), {
                    baseUrl: baseUrl,
                    urls: inputUrls,
                    inputUrls: inputUrls
                });
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, [], inputUrls));
                assert.deepEqual(actual, expected);
            },

            'mixed "path" and "inputUrl" parameters (with "baseUrl") populates "loadOptions.urls" and "loadOptions.inputUrls"': function() {
                var baseUrl = "http://harviewer:49001/selenium/tests/hars/";
                var paths = ["path1.har", "path2.har"];
                var inputUrls = ["inputUrl1.harp", "inputUrl2.harp"];
                var expected = assign(makeExpected(), {
                    baseUrl: baseUrl,
                    urls: prefix(baseUrl, paths).concat(inputUrls),
                    inputUrls: inputUrls,
                    filePath: paths[0]
                });
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, paths, inputUrls));
                assert.deepEqual(actual, expected);
            },

            'mixed "path" and "inputUrl" parameters (without "baseUrl") populates "loadOptions.urls" and "loadOptions.inputUrls"': function() {
                var baseUrl = null;
                var paths = ["path1.har", "path2.har"];
                var inputUrls = ["inputUrl1.harp", "inputUrl2.harp"];
                var expected = assign(makeExpected(), {
                    baseUrl: baseUrl,
                    urls: prefix(baseUrl, paths).concat(inputUrls),
                    inputUrls: inputUrls,
                    filePath: paths[0]
                });
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, paths, inputUrls));
                assert.deepEqual(actual, expected);
            },

            // Tests for new parameters, "har" and "harp"

            'single "har" parameter (without "baseUrl") populates "loadOptions.hars"': function() {
                var baseUrl = null;
                var hars = ["har.har"];
                var expected = assign(makeExpected(), {
                    baseUrl: baseUrl,
                    hars: prefix(baseUrl, hars)
                });
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, [], [], hars));
                assert.deepEqual(actual, expected);
            },

            'single "har" parameter and single "path" parameter (without "baseUrl") populates "loadOptions.hars"': function() {
                // Expect path to be ignored.
                var baseUrl = null;
                var hars = ["har.har"];
                var paths = ["path.har"];
                var expected = assign(makeExpected(), {
                    baseUrl: baseUrl,
                    hars: prefix(baseUrl, hars)
                });
                var actual = Loader.getLoadOptions(makeUrl(baseUrl, [], [], hars));
                assert.deepEqual(actual, expected);
            }
        }
    });
});
