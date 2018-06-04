/**
 * Test core/mime.
 */
define([
    "core/mime",
], function(Mime) {
    var registerSuite = intern.getInterface("object").registerSuite;
    var assert = intern.getPlugin("chai").assert;

    var extractMimeTypeData = [
        ['of null returns ""', null, Error],
        ['of undefined returns ""', null, Error],
        ['of 0 returns ""', 0, Error],
        ['of 1 returns ""', 1, Error],
        ['of true returns ""', true, Error],
        ['of false returns ""', false, Error],
        ['of "" returns ""', "", ""],
        ['of "text/html" returns "text/html"', "text/html", "text/html"],
        ['of "text/html;charset=UTF-8" returns "text/html"', "text/html;charset=UTF-8", "text/html"],
        ['of "text/html; charset=UTF-8" returns "text/html"', "text/html; charset=UTF-8", "text/html"]
    ];

    var tests = extractMimeTypeData.reduce(function(tests, data) {
        var testName = data[0];
        var mimeType = data[1];
        var expected = data[2];
        var test = function() {
            var actual = Mime.extractMimeType(mimeType);
            assert.strictEqual(actual, expected);
        };
        tests[testName] = test;
        if (expected === Error) {
            // we expect an error, so wrap the test
            tests[testName] = function() {
                assert.throws(test);
            };
        }
        return tests;
    }, {});

    registerSuite("core/mime", {
        "extractMimeType": tests,
    });
});
