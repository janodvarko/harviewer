/**
 * Check pageTimings fields. Both these fields (onLoad, onContentLoad)
 * are optional and can be omitted.
 */
define([
  './config',
  './DriverUtils',
  'dojo/node!@theintern/leadfoot',
], function(config, DriverUtils, leadfoot) {
  const { registerSuite } = intern.getInterface("object");
  const { pollUntil } = leadfoot;
  const { testBase } = config;

  function testViewerLoadsThreeHars(remote, page) {
    // Some of these tests need a larger timeout for finding DOM elements
    // because we need the HAR to parse/display fully before we query the DOM.
    var findTimeout = config.findTimeout;
    var utils = new DriverUtils(remote);

    var url = testBase + page;

    return remote
      .setFindTimeout(findTimeout)
      // Open customized viewer.
      .get(url)
      // Wait for 10 sec to load HAR files.
      .then(pollUntil("return (document.querySelectorAll('.pageTable').length == 3) || null", findTimeout))
      .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
      .then(utils.cbAssertElementsLength(".pageTable", 3));
  }

  registerSuite('testLoadHarAPI', {
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
      // This test loads a page that will use the harViewer.loadHar() API.
      return testViewerLoadsThreeHars(this.remote, "tests/testLoadHarAPIViewer.html.php");
    },

    'testViewer loadArchives': function() {
      // This test loads a page that will use the harViewer.loadArchives() API.
      return testViewerLoadsThreeHars(this.remote, "tests/testLoadArchives.html.php");
    },

    'testPreview': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      var url = testBase + "tests/testLoadHarAPIPreview.html.php";

      return r
        .setFindTimeout(findTimeout)
        // Open customized preview.
        .get(url)
        // Wait for 10 sec to load HAR files.
        .then(pollUntil("return (document.querySelectorAll('.pageTable').length == 3) || null", findTimeout))
        .then(utils.cbAssertElementsLength(".pageTable", 3));
    },
  });
});
