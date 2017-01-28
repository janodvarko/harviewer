/**
 * Simple unit test to sanity check that Intern is working.
 */
define([
    'intern!object',
    'intern/chai!assert',
    'core/cookies'
], function(registerSuite, assert, Cookies) {
    registerSuite({
        name: 'cookies'
    });
});
