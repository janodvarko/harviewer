define([
  'intern',
  'intern!object',
  'intern/chai!assert',
  'require',
  './DriverUtils',
  'intern/dojo/node!leadfoot/helpers/pollUntil'
], function(intern, registerSuite, assert, require, DriverUtils, pollUntil) {
  var harViewerBase = intern.config.harviewer.harViewerBase;
  var testBase = intern.config.harviewer.testBase;

  registerSuite({
    name: 'testValidateCheckbox',

    /**
     * "Validate data before processing" and "Table View" checkbox bug
     * https://github.com/janodvarko/harviewer/issues/44
     */
    'testValidateCheckbox': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = intern.config.harviewer.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

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
        })
    }
  });
});
