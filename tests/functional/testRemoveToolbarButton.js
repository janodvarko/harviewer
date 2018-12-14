/**
 * Test HAR Viewer API for removing an existing toolbar button.
 */
define([
  './config',
  './DriverUtils',
], function(config, DriverUtils) {
  const { registerSuite } = intern.getInterface("object");
  const { testBase } = config;

  registerSuite('testRemoveToolbarButton', {
    'testRemoveToolbarButton': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      var viewerURL = testBase + "tests/testRemoveToolbarButtonIndex.html";
      var harFileURL = testBase + "tests/hars/simple-page-load.har";
      var url = viewerURL + "?path=" + harFileURL;

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        // Make sure we are in the Preview tab.
        .findByCssSelector(".PreviewTab.selected")
        .end()
        // Make sure the Preview toolbar exists.
        .findByCssSelector(".previewToolbar")
        .end()
        // Check that there are no children of .previewToolbar (we have removed them all)
        .then(utils.cbAssertElementsLength(".previewToolbar > *", 0));
    },
  });
});
