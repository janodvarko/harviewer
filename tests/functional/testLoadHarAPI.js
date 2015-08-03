/**
 * Check pageTimings fields. Both these fields (onLoad, onContentLoad)
 * are optional and can be omitted.
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
    name: 'testLoadHarAPI',

    // WARNING !

    // This test has race conditions concerning any HAR/HARP file that is loaded via JSONP.
    // If "onInputData" is used as the callback name MORE THAN ONCE per page,
    // then there is a race condition. When the callback is fired, jQuery will restore the
    // previous value of window["onInputData"] (which is undefined) and so the next time the
    // callback ought to fire it is undefined.

    // The browser console error will be something like:
    //   TypeError: onInputData is not a function testLoadHarAPIViewer.html.php:1:0

    // Firefox (37.0.2) seems to get this error more than Chrome (43.0.2357.124),
    // and IE11 does not seem to suffer from it.

    // The solution is to use unique callback names. This will impact the test data which
    // currently uses hard-coded callback names.

    'testViewer': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var timeout = 10 * 1000;
      var r = this.remote;
      var utils = new DriverUtils(r);

      var url = testBase + "tests/testLoadHarAPIViewer.html.php";

      return r
        .setFindTimeout(timeout)
        // Open customized viewer.
        .get(url)
        // Wait for 10 sec to load HAR files.
        .then(pollUntil("return (document.querySelectorAll('.pageTable').length == 3) || null", timeout))
        .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
        .then(utils.cbAssertElementsLength(".pageTable", 3));
      },

      'testPreview': function() {
        // Some of these tests need a larger timeout for finding DOM elements
        // because we need the HAR to parse/display fully before we query the DOM.
        var timeout = 10 * 1000;
        var r = this.remote;
        var utils = new DriverUtils(r);

        var url = testBase + "tests/testLoadHarAPIPreview.html.php";

        return r
          .setFindTimeout(timeout)
          // Open customized preview.
          .get(url)
          // Wait for 10 sec to load HAR files.
          .then(pollUntil("return (document.querySelectorAll('.pageTable').length == 3) || null", timeout))
          .then(utils.cbAssertElementsLength(".pageTable", 3));
        }
  });
});
