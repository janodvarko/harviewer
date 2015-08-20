/**
 * Simple unit test to sanity check that Intern is working.
 */
define([
    'intern!object',
    'intern/chai!assert',
    'core/lib'
], function (registerSuite, assert, Lib) {
    registerSuite({
        name: 'lib',

        formatNumber: function () {
            assert.strictEqual(Lib.formatNumber(0), '0', '[] is array');
        }
    });
});
