/**
 * Test the StatsService.
 */
define([
    "intern!object",
    "intern/chai!assert",
    "core/StatsService",
    "preview/harModel",
    "text!../../../selenium/tests/hars/issue-61/chrome51.har",
    "text!../../../selenium/tests/hars/issue-61/firefox47.har",
    "text!../../../selenium/tests/hars/issue-61/ie11.har",
    "text!../../../webapp/examples/google.com.har"
], function(registerSuite, assert, StatsService, HarModel, issue61ChromeHar, issue61FirefoxHar, issue61IEHar, googleHar) {

    /**
     * Utility function to assert deepEqual for each property before the whole
     * object.  This gives error messages that include the property key for
     * quicker problem resolution at the expense of comparing twice.
     */
    function deepEqual(actual, expected, msg) {
        for (var k in expected) {
            assert.deepEqual(actual[k], expected[k], (msg ? msg + ": " : "") + k);
        }
        assert.deepEqual(actual, expected, msg);
    }

    function timingsCloseTo(actual, expected) {
        // E.g. Chrome51 can count timings as 29.196999988926102, but IE11 and FF47 counts 29.1969999889261.
        // Which seems to be 13 decimal places.
        // Here delta is 6 decimal places, but surely enough to be satisfied?
        var delta = 0.000001;
        assert.closeTo(actual.blocked, expected.blocked, delta, "blocked");
        assert.closeTo(actual.dns, expected.dns, delta, "dns");
        assert.closeTo(actual.ssl, expected.ssl, delta, "ssl");
        assert.closeTo(actual.connect, expected.connect, delta, "connect");
        assert.closeTo(actual.send, expected.send, delta, "send");
        assert.closeTo(actual.wait, expected.wait, delta, "wait");
        assert.closeTo(actual.receive, expected.receive, delta, "receive");
    }

    // Set up the expectations for the test HAR files
    var expectationsForHarFiles = {
        "issue61 chrome51 empty cache": {
            har: JSON.parse(issue61ChromeHar),
            page: "page_3",
            timings: {
                blocked: 20.60499999788589,
                dns: 0,
                ssl: 0,
                connect: 0,
                send: 1.9229999961680797,
                wait:  624.1639999934711,
                receive: 27.315000006637483
            },
            content: {
                html: { resBodySize: 529, count: 1 },
                js: { resBodySize: 103850, count: 5 },
                css: { resBodySize: 6219, count: 1},
                image: { resBodySize: 701, count: 2 },
                flash: { resBodySize: 0, count: 0 },
                other: { resBodySize: 0, count: 0 }
            },
            traffic: {
                request: { headersSize: 3726, bodySize: 0 },
                response: { headersSize: 5204, bodySize: 111299 }
            },
            cache: {
                partial: { resBodySize: 0, count: 0 },
                cached: { resBodySize: 0, count: 0 },
                downloaded: { resBodySize: 111299, count: 9 }
            }
        },
        "issue61 chrome51 ctrl+r": {
            har: JSON.parse(issue61ChromeHar),
            page: "page_4",
            timings: {
                blocked: 14.501000005111559,
                dns: 0,
                ssl: 0,
                connect: 0,
                send:  0.8149999921442932,
                wait: 62.93499999446795,
                receive: 10.181999983615237
            },
            content: {
                html: { resBodySize: 0, count: 1 },
                js: { resBodySize: 0, count: 5 },
                css: { resBodySize: 0, count: 1 },
                image: { resBodySize: 0, count: 2 },
                flash: { resBodySize: 0, count: 0 },
                other: { resBodySize: 0, count: 0 }
            },
            traffic: {
                request: { headersSize: 2079, bodySize: 0 },
                response: { headersSize: 1336, bodySize: 0 }
            },
            cache: {
                partial: { resBodySize: 0, count: 0 },
                cached: { resBodySize: 314594, count: 9 },
                downloaded: { resBodySize: 0, count: 0 }
            }
        },
        "issue61 chrome51 press enter in address bar": {
            har: JSON.parse(issue61ChromeHar),
            page: "page_5",
            timings: {
                blocked: 9.42999999824678,
                dns: 0,
                ssl: 0,
                connect: 0,
                send: 0.24599999596830502,
                wait: 17.969999993510992,
                receive: 7.8520000024582455
            },
            content: {
                html: { resBodySize: 0, count: 1 },
                js: { resBodySize: 0, count: 5 },
                css: { resBodySize: 0, count: 1 },
                image: { resBodySize: 0, count: 2 },
                flash: { resBodySize: 0, count: 0 },
                other: { resBodySize: 0, count: 0 }
            },
            traffic: {
                request: { headersSize: 536, bodySize: 0 },
                response: { headersSize: 334, bodySize: 0 }
            },
            cache: {
                partial: { resBodySize: 0, count: 0 },
                cached: { resBodySize: 314594, count: 9 },
                downloaded: { resBodySize: 0, count: 0 }
            }
        },
        google: {
            har: JSON.parse(googleHar),
            timings: {
                blocked: 0,
                dns: 0,
                ssl: 0,
                connect: 0,
                send: 0,
                wait: 234,
                receive: 47
            },
            content: {
                html: { resBodySize: 3694, count: 2 },
                js: { resBodySize: 8646, count: 1 },
                css: { resBodySize: 0, count: 0 },
                image: { resBodySize: 12983, count: 2 },
                flash: { resBodySize: 0, count: 0 },
                other: { resBodySize: 0, count: 0 }
            },
            traffic: {
                request: { headersSize: 3339, bodySize: 0 },
                response: { headersSize: 1223, bodySize: 25323 }
            },
            cache: {
                partial: { resBodySize: 0, count: 0 },
                cached: { resBodySize: 0, count: 0 },
                downloaded: { count: 4, resBodySize: 25323 }
            }
        }
    };

    // Returns a function that iterates over the expected values and compares them to the actual values
    function createTest(testName, methodName, har, pageId, expected, assertFunction) {
        if (!expected) {
            throw new Error("createTest: expected data parameter is required");
        }
        return function() {
            var model = new HarModel();
            model.append(har);
            var stats = new StatsService(model);

            // pages==[null] means use all entries in the HAR
            var page = null;
            if (pageId) {
                page = har.log.pages.filter(function(p) {
                    return p.id === pageId;
                })[0];
            }
            var totals = stats[methodName]([page]);

            assertFunction(totals, expected);
        };
    }

    function registerHarTests(suiteInfo) {
        function _createTest(keyTestData, testData, keyTotals, assertFunction) {
            // E.g. 'Timings'
            var type = keyTotals.substring(0, 1).toUpperCase() + keyTotals.substring(1);

            // E.g. 'calcTimingsTotalsForPages'
            var methodName = "calc" + type + "TotalsForPages";

            // E.g. 'issue61_calcTimingsTotalsForPages'
            var testName = methodName + " " + keyTestData;

            // E.g. create a test to compare the timings for a particular har.
            suiteInfo[testName] = createTest(testName, methodName, testData.har, testData.page, testData[keyTotals], assertFunction);
        }

        // Iterate over the expectations and create tests to compare each expected
        // object to the actual object.
        for (var keyTestData in expectationsForHarFiles) {
            var testData = expectationsForHarFiles[keyTestData];
            _createTest(keyTestData, testData, "timings", timingsCloseTo);
            _createTest(keyTestData, testData, "content", deepEqual);
            _createTest(keyTestData, testData, "traffic", deepEqual);
            _createTest(keyTestData, testData, "cache", deepEqual);
        }
    }

    var suiteInfo = {
        name: "core/StatsService",

        "calcTimingsTotalsForEntries(null) throws error": function() {
            var model = null;
            var stats = new StatsService(model);
            assert.throws(function() {
                var entries = null;
                stats.calcTimingsTotalsForEntries(entries);
            });
        },

        "calcTimingsTotalsForEntries([]) returns zeros": function() {
            var model = null;
            var stats = new StatsService(model);
            var entries = [];
            var totals = stats.calcTimingsTotalsForEntries(entries);
            var expected = {
                blocked: 0,
                dns: 0,
                ssl: 0,
                connect: 0,
                send: 0,
                wait: 0,
                receive: 0
            };
            deepEqual(totals, expected);
        },

        "calcTimingsTotalsForEntries - negative times are not included in totals": function() {
            var model = null;
            var stats = new StatsService(model);
            var entries = [{
                timings: {
                    blocked: -1,
                    dns: -1,
                    ssl: -1,
                    connect: -1,
                    send: -1,
                    wait: -1,
                    receive: -1
                }
            }];
            var totals = stats.calcTimingsTotalsForEntries(entries);
            var expected = {
                blocked: 0,
                dns: 0,
                ssl: 0,
                connect: 0,
                send: 0,
                wait: 0,
                receive: 0
            };
            deepEqual(totals, expected);
        },

        "calcCacheTotalsForEntries - uncached 200": function() {
            var model = null;
            var stats = new StatsService(model);
            var entries = [{
                response: {
                    status: 200,
                    bodySize: 1
                }
            }];
            var totals = stats.calcCacheTotalsForEntries(entries);
            var expected = {
                partial: { resBodySize: 0, count: 0 },
                cached: { resBodySize: 0, count: 0 },
                downloaded: { resBodySize: 1, count: 1 }
            };
            deepEqual(totals, expected);
        },

        "calcCacheTotalsForEntries - single 304 response": function() {
            var model = null;
            var stats = new StatsService(model);
            var entries = [{
                response: {
                    status: 304,
                    bodySize: 0,
                    content: {
                        size: 1
                    }
                }
            }];
            var totals = stats.calcCacheTotalsForEntries(entries);
            var expected = {
                partial: { resBodySize: 0, count: 0 },
                cached: { resBodySize: 1, count: 1 },
                downloaded: { resBodySize: 0, count: 0 }
            };
            deepEqual(totals, expected);
        },

        "calcCacheTotalsForEntries - cached 200": function() {
            var model = null;
            var stats = new StatsService(model);
            var entries = [{
                response: {
                    status: 200,
                    bodySize: 0,
                    content: {
                        size: 1
                    }
                }
            }];
            var totals = stats.calcCacheTotalsForEntries(entries);
            var expected = {
                partial: { resBodySize: 0, count: 0 },
                cached: { resBodySize: 1, count: 1 },
                downloaded: { resBodySize: 0, count: 0 }
            };
            deepEqual(totals, expected);
        }
    };

    registerHarTests(suiteInfo);
    registerSuite(suiteInfo);
});
