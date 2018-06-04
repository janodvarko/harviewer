define([
  './config',
  './DriverUtils',
], function(config, DriverUtils) {
  const { registerSuite } = intern.getInterface("object");
  const { assert } = intern.getPlugin("chai");
  const { harViewerBase } = config;

  registerSuite('testValidateCheckbox', {
    afterEach: function() {
      // Clear cookies to return to clean state for other tests
      const dfd = this.async();
      this.remote
        // clearCookies not currently working for edge 42.17134.1.0/17.17134 and driver 17134
        .clearCookies()
        .catch((err) => console.log(err))
        .finally(() => dfd.resolve());
    },

    tests: {
      /**
       * "Validate data before processing" and "Table View" checkbox bug
       * https://github.com/janodvarko/harviewer/issues/44
       */
      'testValidateCheckbox': function() {
        // Some of these tests need a larger timeout for finding DOM elements
        // because we need the HAR to parse/display fully before we query the DOM.
        var findTimeout = config.findTimeout;
        var r = this.remote;

        return r
          .setFindTimeout(findTimeout)
          .get(harViewerBase)
          .findById("validate")
          .then(DriverUtils.getCookie("validate"))
          .then(function(cookie) {
            assert.isNull(cookie);
          })
          // "Validate" checkbox is already checked (it has a HTML attribute of checked="true"),
          // so clicking it should set to false.
          .click()
          .then(DriverUtils.getCookie("validate"))
          .then(function(cookie) {
            assert.isObject(cookie);
            assert.strictEqual(cookie.name, "validate");
            assert.strictEqual(cookie.value, "false");
          })
          // Clicking again should set to true.
          .click()
          .then(DriverUtils.getCookie("validate"))
          .then(function(cookie) {
            assert.isObject(cookie);
            assert.strictEqual(cookie.name, "validate");
            assert.strictEqual(cookie.value, "true");
          });
      },
    },
  });
});
