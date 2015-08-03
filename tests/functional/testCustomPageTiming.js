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
      var timeout = 10 * 1000;
      var r = this.remote;
      var utils = new DriverUtils(r);

      var viewerURL = testBase + "tests/testCustomPageTimingIndex.php";
      var harFileURL = testBase + "tests/testCustomPageTiming.har";
      var url = viewerURL + "?path=" + harFileURL;

      return r
        .setFindTimeout(timeout)
        .get(url)
        // Return null or undefined to indicate poll not successful (yet).
        // http://theintern.github.io/leadfoot/pollUntil.html
        .then(pollUntil("return (document.querySelectorAll('.onMyEventBar.netPageTimingBar.netBar').length == 4) || null;", 10 * 1000))
        // xxxHonza: remove the trailing and begin space in the class attribute (domplate).
        .findAllByXpath("//div[@class=' onMyEventBar  netPageTimingBar netBar ']")
        .then(function(els) {
          assert.strictEqual(els.length, 4);
        });
    }
  });
});
