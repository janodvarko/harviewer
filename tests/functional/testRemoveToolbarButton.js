/**
 * Test HAR Viewer API for removing an existing tab.
 */
define([
  './config',
], function(config) {
  const { registerSuite } = intern.getInterface("object");
  const { testBase } = config;

  registerSuite('testRemoveToolbarButton', {
    'testRemoveToolbarButton': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;

      var url = testBase + "tests/testRemoveToolbarButtonIndex.php";

      return r
        .setFindTimeout(findTimeout)
        .get(url);
      // gitgrimbo
      // Are we missing some assertions here?
    },
  });
});
