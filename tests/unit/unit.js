/**
 * Simple unit test to sanity check that Intern is working.
 */
define([
    'intern!object',
    'intern/chai!assert'
], function(registerSuite, assert) {
    registerSuite({
        name: 'unit',

        onePlusOne: function() {
            assert.strictEqual(1 + 1, 2);
        }
    });
});
