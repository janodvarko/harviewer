/**
 * Simple unit test to sanity check that Intern is working.
 */
define([
    "intern!object",
    "intern/chai!assert",
    "core/object"
], function(registerSuite, assert, Obj) {
    registerSuite({
        name: "object",

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
        }
    });
});
