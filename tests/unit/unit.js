/**
 * Simple unit test to sanity check that Intern is working.
 */
define([], function() {
    var registerSuite = intern.getInterface("object").registerSuite;
    var assert = intern.getPlugin("chai").assert;

    registerSuite("unit", {
        onePlusOne: function() {
            assert.strictEqual(1 + 1, 2);
        },
    });
});
