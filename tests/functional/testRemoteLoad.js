/**
 * Check loading remote HAR file (using JSONP).
 */
define([
  'intern',
  'intern!object',
  'intern/chai!assert',
  'require',
  './DriverUtils'
], function(intern, registerSuite, assert, require, DriverUtils) {
  var harViewerBase = intern.config.harviewer.harViewerBase;
  var testBase = intern.config.harviewer.testBase;

  registerSuite({
    name: 'testRemoteLoad',

    'testRemoteLoad': function() {
      var url = harViewerBase + "?inputUrl=" + harViewerBase + "examples/inline-scripts-block.harp";

      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = intern.config.harviewer.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);
      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"));
    }
  });
});
