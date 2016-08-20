/**
 * Units tests for "core/url".
 */
define([
    "intern!object",
    "intern/chai!assert",
    "core/url"
], function (registerSuite, assert, Url) {
    function U(append) {
        return "http://www.example.com/path" + (append || "");
    }

    registerSuite({
        name: "core/url",

        'getQuery': {
            'returns "" when url is ""': function () {
                assert.strictEqual(Url.getQuery(""), "");
            },

            'returns "" when url has no query string': function () {
                assert.strictEqual(Url.getQuery(U()), "");
            },

            'returns query string when query string exists': function () {
                assert.strictEqual(Url.getQuery(U("?qn1=qv1")), "qn1=qv1");
            }
        },

        'getHash': {
            'returns "" when url is ""': function () {
                assert.strictEqual(Url.getHash(""), "");
            },

            'returns "" when url has no hash string': function () {
                assert.strictEqual(Url.getHash(U()), "");
                assert.strictEqual(Url.getHash(U("?qn1=qv1")), "");
            },

            'returns Hash string when hash string exists': function () {
                assert.strictEqual(Url.getHash(U("#hn1=hv1")), "hn1=hv1");
                assert.strictEqual(Url.getHash(U("?qn1=qv1#hn1=hv1")), "hn1=hv1");
            }
        },

        'getURLParameter': {
            'returns null when no parameters exist': function () {
                assert.deepEqual(Url.getURLParameter("a", U()), null);
            },

            'returns null when no matching parameter exists': function () {
                assert.deepEqual(Url.getURLParameter("a", U("?qn1=qv1")), null);
            },

            'returns parameter when parameter exists': function () {
                assert.deepEqual(Url.getURLParameter("qn1", U("?qn1=qv1")), "qv1");
            }
        },

        'getURLParameters': {
            'returns [] when no parameters exist': function () {
                assert.deepEqual(Url.getURLParameters("a", U()), []);
            },

            'returns [] when no matching parameters exist': function () {
                assert.deepEqual(Url.getURLParameters("a", U("?qn1=qv1")), []);
            },

            'returns parameters when parameters exist': function () {
                assert.deepEqual(Url.getURLParameters("qn1", U("?qn1=qv1")), ["qv1"]);
            }
        },

        'getHashParameters': {
            'returns [] when no parameters exist': function () {
                assert.deepEqual(Url.getHashParameters("a", U()), []);
            },

            'returns [] when no matching parameters exist': function () {
                assert.deepEqual(Url.getHashParameters("a", U("#hn1=hv1")), []);
            },

            'returns parameters when parameters exist': function () {
                assert.deepEqual(Url.getHashParameters("hn1", U("#hn1=hv1")), ["hv1"]);
                assert.deepEqual(Url.getHashParameters("hn1", U("?qn1=qv1#hn1=hv1")), ["hv1"]);
            }
        }
    });
});
