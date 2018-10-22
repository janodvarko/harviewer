/**
 * Unit tests for harModel.
 */
define([
    "preview/harModel",
    "./withJSONFile",
], function(HarModel, withJSONFile) {
    var registerSuite = intern.getInterface("object").registerSuite;
    var assert = intern.getPlugin("chai").assert;

    var suite = {
        "isCached": {
            "http2.not-cached is not cached": withJSONFile("./chrome67.http2.not-cached.entry.json", function(entry) {
                assert.isFalse(HarModel.isCachedEntry(entry));
            }),
            "HTTP 304 is cached": function() {
                var entry = {
                    response: {
                        status: 304,
                    },
                };
                assert.isTrue(HarModel.isCachedEntry(entry));
            },
            "Negative bodySize is cached": function() {
                var entry = {
                    response: {
                        status: 200,
                        bodySize: -1,
                        content: {
                            size: 1,
                        },
                    },
                };
                assert.isTrue(HarModel.isCachedEntry(entry));
            },
        },
    };

    registerSuite("preview/harModel/isCachedEntry", suite);
});
