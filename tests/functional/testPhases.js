/**
 * Check network phases (request groups)
 */
define([
  './config',
  './DriverUtils',
], function(config, DriverUtils) {
  const { registerSuite } = intern.getInterface("object");
  const { assert } = intern.getPlugin("chai");
  const { harViewerBase, testBase } = config;

  registerSuite('testPhases', {
    'testPhases': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;

      var url = harViewerBase + "?path=" + testBase + "tests/hars/three-phases.har";

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        // There must be 3 phases in the waterfall graph and so, the layout broken two times.
        .then(DriverUtils.waitForElements(".netRow.loaded[breakLayout=\"true\"]", 2, findTimeout))
        .then(function(els) {
          assert.lengthOf(els, 2);
        });
    },
  });
});
