/**
 * Test HAR Viewer API for custom page timings.
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
    name: 'testCustomPageTiming',

    'testCustomPageTiming': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = intern.config.harviewer.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      var viewerURL = testBase + "tests/testCustomPageTimingIndex.php";
      var harFileURL = testBase + "tests/testCustomPageTiming.har";
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
    }
  });
});
