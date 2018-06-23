define([
    "core/lib",
], function(Lib) {
    var registerSuite = intern.getInterface("object").registerSuite;
    var assert = intern.getPlugin("chai").assert;

    registerSuite("core/lib", {
        formatNumber: function() {
            assert.strictEqual(Lib.formatNumber(0), "0", "[] is array");
        },
    });
});
