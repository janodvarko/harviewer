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
      var timeout = 10 * 1000;
      var r = this.remote;
      var utils = new DriverUtils(r);

      var url = testBase + "tests/testRemoveToolbarButtonIndex.php";

      return r
        .setFindTimeout(timeout)
        .get(url);
        // gitgrimbo
        // Are we missing some assertions here?
    }
  });
});
