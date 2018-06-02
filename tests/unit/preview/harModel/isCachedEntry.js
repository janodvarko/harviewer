/**
 * Unit tests for harModel.
 */
define([
    "require",
    "preview/harModel",
], function(require, HarModel) {
    var registerSuite = intern.getInterface("object").registerSuite;
    var assert = intern.getPlugin("chai").assert;

    function withJSONFile(jsonPath, callback) {
        return function() {
            var dfd = this.async(1000);
            require(["text!" + jsonPath], function(json) {
                var ob = JSON.parse(json);
                callback(ob);
                dfd.resolve();
            });
        };
    }

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
