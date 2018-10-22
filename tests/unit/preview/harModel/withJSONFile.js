/**
 * Load a JSON file for a JSON-based test.
 */
define([
    "require",
], function(require) {
    return function withJSONFile(jsonPath, callback) {
        return function() {
            var dfd = this.async(1000);
            require(["text!" + jsonPath], function(json) {
                var ob = JSON.parse(json);
                callback(ob);
                dfd.resolve();
            });
        };
    };
});
