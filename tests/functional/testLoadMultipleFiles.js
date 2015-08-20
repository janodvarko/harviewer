/**
 * Load multiple HAR files into the viewer.
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
    name: 'testLoadMulipleFiles',

    'testLoadMulipleFiles': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = intern.config.harviewer.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      // Put together URL that specifies multiple HAR files.
      var url = harViewerBase + "?baseUrl=" + testBase + "tests/hars/&";
      for (var i = 1; i < 10; i++) {
        url = url + "&path=" + i + ".har";
      }

      // Example of the result URL:
      // http://legoas/har/viewer/?
      // baseUrl=http://legoas/har/viewer/selenium/tests/hars/&
      // path=1.har&path=2.har&path=3.har&path=4.har&path=5.har&
      // path=6.har&path=7.har&path=8.har&path=9.har

      var waitForFilesToLoadMs = findTimeout;

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        // Wait for 10 sec to load all 9 HAR files.
        // Return null or undefined to indicate poll not successful (yet).
        // http://theintern.github.io/leadfoot/pollUntil.html
        .then(pollUntil("return (document.querySelectorAll('.pageTable').length == 9) || null;", waitForFilesToLoadMs))
        .then(null, function(err) {
          // ignore pollUntil timeout error
          return 0;
        })
        // xxxHonza: remove the trailing space in the class attribute (domplate).
        .findAllByXpath("//div[@class='pageBar ']")
        .then(function(els) {
          assert.strictEqual(els.length, 9);
        })
        .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"));
    }
  });
});
