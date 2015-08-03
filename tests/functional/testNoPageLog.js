/**
 * Test HAR file with entries that don't have a parent page.
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
    name: 'testNoPageLog',

    'testNoPageLog': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var timeout = 10 * 1000;
      var r = this.remote;
      var utils = new DriverUtils(r);

      // Put together URL with a default file, e.g:
      // http://legoas/har/viewer/?path=http://legoas/har/viewer/selenium/tests/hars/testNoPageLog.har
      var url = harViewerBase + "?path=" + testBase + "tests/hars/testNoPageLog.har";

      return r
        .setFindTimeout(timeout)
        .get(url)
        .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
        .then(utils.cbAssertElementContainsText("css=.previewList", "GET test.txt"));
    }
  });
});
