/**
 * Test the StatsService.
 */
define([
    "intern!object",
    "intern/chai!assert",
    "core/StatsService",
    "preview/harModel",
    "text!../../../webapp/examples/google.com.har"
], function (registerSuite, assert, StatsService, HarModel, googleHar) {

    // Set up the expectations for the test HAR files
    var expectationsForHarFiles = {
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
    function createTest(testName, methodName, har, expected) {
        if (!expected) {
            throw new Error("createTest: expected data parameter is required");
        }
        return function() {
            var model = new HarModel();
            model.append(har);
            var stats = new StatsService(model);

            // pages==[null] means use all entries in the HAR
            var pages = [null];
            var totals = stats[methodName](pages);

            for (var k in expected) {
                assert.deepEqual(totals[k], expected[k], k);
            }
        };
    }

    function registerHarTests(suiteInfo) {
        function _createTest(keyTestData, testData, keyTotals) {
            // E.g. 'Timings'
            var type = keyTotals.substring(0, 1).toUpperCase() + keyTotals.substring(1);

            // E.g. 'calcTimingsTotalsForPages'
            var methodName = "calc" + type + "TotalsForPages";

            // E.g. 'issue61_calcTimingsTotalsForPages'
            var testName = keyTestData + '_' + methodName;

            // E.g. create a test to compare the timings for a particular har.
            suiteInfo[testName] = createTest(testName, methodName, testData.har, testData[keyTotals]);
        }

        // Iterate over the expectations and create tests to compare each expected
        // object to the actual object.
        for (var keyTestData in expectationsForHarFiles) {
            var testData = expectationsForHarFiles[keyTestData];
            _createTest(keyTestData, testData, "timings");
            _createTest(keyTestData, testData, "content");
            _createTest(keyTestData, testData, "traffic");
            _createTest(keyTestData, testData, "cache");
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
            assert.deepEqual(totals, expected);
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
            assert.deepEqual(totals, expected);
        }
    };

    registerHarTests(suiteInfo);
    registerSuite(suiteInfo);
});
