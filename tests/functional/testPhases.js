/**
 * Check network phases (request groups)
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
    name: 'testPhases',

    'testPhases': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var timeout = 10 * 1000;
      var r = this.remote;
      var utils = new DriverUtils(r);

      var url = harViewerBase + "?path=" + testBase + "tests/hars/three-phases.har";

      return r
        .setFindTimeout(timeout)
        .get(url)
        // There must be 3 phases in the waterfall graph and so, the layout broken two times.
        .then(DriverUtils.waitForElements(".netRow.loaded[breakLayout=\"true\"]", 2, timeout))
        .then(function(els) {
          assert.lengthOf(els, 2);
        });
    }
  });
});
