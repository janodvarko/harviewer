/**
 * Test API for showing page timeline and statistics by default.
 */
define([
  './config',
  './DriverUtils',
], function(config, DriverUtils) {
  const { registerSuite } = intern.getInterface("object");
  const { testBase } = config;

  registerSuite('testShowStatsAndTimeline', {
    'testShowStatsAndTimeline': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      var viewerURL = testBase + "tests/testShowStatsAndTimelineIndex.php";
      var harFileURL = testBase + "tests/simple-page-load.har";
      var url = viewerURL + "?path=" + harFileURL;

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
        .findByCssSelector(".pageTimelineBody.opened")
        .end()
        .findByCssSelector(".pageStatsBody.opened");
    },
  });
});
