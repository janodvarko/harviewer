/**
 * Check loading remote HAR file (using JSONP).
 */
define([
  './config',
  './DriverUtils',
], function(config, DriverUtils) {
  const { registerSuite } = intern.getInterface("object");
  const { harViewerBase } = config;

  registerSuite('testRemoteLoad', {
    'testRemoteLoad': function() {
      var url = harViewerBase + "?inputUrl=" + harViewerBase + "examples/inline-scripts-block.harp";

      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);
      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"));
    },
  });
});
