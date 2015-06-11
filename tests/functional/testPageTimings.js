/**
 * Check pageTimings fields. Both these fields (onLoad, onContentLoad)
 * are optional and can be omitted.
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
    name: 'testPageTimings',

    'testPageTimings': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var timeout = 10 * 1000;
      var r = this.remote;
      var utils = new DriverUtils(r);

      // Put together URL that specifies a test HAR file to load.
      // Example of the result URL:
      // http://legoas/har/viewer/?path=http://legoas/har/viewer/selenium/tests/hars/noPageTimings.har
      var url = harViewerBase + "?path=" + testBase + "tests/hars/noPageTimings.har";

      return r
        .setFindTimeout(timeout)
        .get(url)
        // The Preview tab must be selected and example HAR file loaded.
        .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
        .then(utils.cbAssertElementContainsText("css=.pageName", "http://127.0.0.1:1235/slow-css.html"));
    }
  });
});
