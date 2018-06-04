/**
 * Simple unit test to sanity check that Intern is working.
 */
define([
    "core/object",
], function(Obj) {
    var registerSuite = intern.getInterface("object").registerSuite;
    var assert = intern.getPlugin("chai").assert;

    registerSuite("core/object", {
        "bind": function() {
            var fRan = false;
            var f = function(fixedArg, runtimeArg) {
                assert.equal(fixedArg, "fixed-arg");
                assert.equal(runtimeArg, "runtime-arg");
                fRan = true;
            };
            var bound = Obj.bind(f, null, "fixed-arg");
            bound("runtime-arg");
            assert.isTrue(fRan, "Bound function has run");
        },
    });
});
