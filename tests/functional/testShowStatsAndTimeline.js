/**
 * Test API for showing page timeline and statistics by default.
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
    name: 'testShowStatsAndTimeline',

    'testShowStatsAndTimeline': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var timeout = 10 * 1000;
      var r = this.remote;
      var utils = new DriverUtils(r);

      var viewerURL = testBase + "tests/testShowStatsAndTimelineIndex.php";
      var harFileURL = testBase + "tests/simple-page-load.har";
      var url = viewerURL + "?path=" + harFileURL;

      return r
        .setFindTimeout(timeout)
        .get(url)
        .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
        .findByCssSelector(".pageTimelineBody.opened")
        .end()
        .findByCssSelector(".pageStatsBody.opened");
    }
  });
});
