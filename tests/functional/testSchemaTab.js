/**
 * Test content of the Schema tab.
 */
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
    name: 'testSchemaTab',

    'testSchemaTab': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = intern.config.harviewer.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      return r
        .setFindTimeout(findTimeout)
        .get(harViewerBase)
        .then(utils.cbAssertElementContainsText("css=.SchemaTab", "Schema"))
        .findByCssSelector(".SchemaTab")
        .click()
        // Wait till the schema JS file is loaded.
        // Return null or undefined to indicate poll not successful (yet).
        // http://theintern.github.io/leadfoot/pollUntil.html
        .then(pollUntil("return (document.querySelectorAll('.syntaxhighlighter').length > 0) || null;", 10 * 1000));
    }
  });
});
