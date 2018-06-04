/**
 * Test HAR file with entries that don't have a parent page.
 */
define([
  './config',
  './DriverUtils',
], function(config, DriverUtils) {
  const { registerSuite } = intern.getInterface("object");
  const { harViewerBase, testBase } = config;

  registerSuite('testNoPageLog', {
    'testNoPageLog': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      // Put together URL with a default file, e.g:
      // http://legoas/har/viewer/?path=http://legoas/har/viewer/selenium/tests/hars/testNoPageLog.har
      var url = harViewerBase + "?path=" + testBase + "tests/hars/testNoPageLog.har";

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
        .then(utils.cbAssertElementContainsText("css=.previewList", "GET test.txt"));
    },
  });
});
