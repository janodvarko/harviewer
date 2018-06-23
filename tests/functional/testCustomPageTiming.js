/**
 * Test HAR Viewer API for custom page timings.
 */
define([
  './config',
  'dojo/node!@theintern/leadfoot',
], function(config, leadfoot) {
  const { registerSuite } = intern.getInterface("object");
  const { assert } = intern.getPlugin("chai");
  const { pollUntil } = leadfoot;
  const { testBase } = config;

  registerSuite('testCustomPageTiming', {
    'testCustomPageTiming': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;

      var viewerURL = testBase + "tests/testCustomPageTimingIndex.html";
      var harFileURL = testBase + "tests/hars/testCustomPageTiming.har";
      var url = viewerURL + "?path=" + harFileURL;

      var pollTimeout = findTimeout;

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        // Return null or undefined to indicate poll not successful (yet).
        // http://theintern.github.io/leadfoot/pollUntil.html
        .then(pollUntil("return (document.querySelectorAll('.onMyEventBar.netPageTimingBar.netBar').length == 4) || null;", pollTimeout))
        // class attribute no longer has leading and trailing space since using jQuery css class methods.
        .findAllByXpath("//div[@class='onMyEventBar netPageTimingBar netBar']")
        .then(function(els) {
          assert.strictEqual(els.length, 4);
        });
    },
  });
});
