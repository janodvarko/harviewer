/**
 * Test HAR Viewer API for removing an existing tab.
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
    name: 'testRemoveTab',

    'testRemoveTab': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = intern.config.harviewer.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      var url = testBase + "tests/testRemoveTabIndex.php";

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .findByCssSelector(".HomeTab.selected")
        .end()
        .findByCssSelector(".PreviewTab")
        .end()
        .findByCssSelector(".DOMTab")
        .end()
        // set find timeout to zero so the following assertions are immediate.
        .setFindTimeout(0)
        .then(utils.cbAssertElementsLength(".AboutTab", 0))
        .then(utils.cbAssertElementsLength(".SchemaTab", 0));
    }
  });
});
