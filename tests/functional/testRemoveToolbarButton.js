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
    name: 'testRemoveToolbarButton',

    'testRemoveToolbarButton': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = intern.config.harviewer.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      var url = testBase + "tests/testRemoveToolbarButtonIndex.php";

      return r
        .setFindTimeout(findTimeout)
        .get(url);
        // gitgrimbo
        // Are we missing some assertions here?
    }
  });
});
