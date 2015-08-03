/**
 * Verify automatic expanding of pages.
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
    name: 'testPreviewExpand',

    'testExpandSinglePage': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var timeout = 10 * 1000;
      var r = this.remote;
      var utils = new DriverUtils(r);

      // HAR file is specified inside the test page.
      var viewerURL = testBase + "tests/testPreviewExpand.html.php";
      var harFileURL = testBase + "tests/hars/preview-expand.har";
      var url = viewerURL + "?path=" + harFileURL;

      return r
        .setFindTimeout(timeout)
        .get(url)
        .findByCssSelector(".pageRow.opened");
    },

    'testExpandMultiplePages': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var timeout = 10 * 1000;
      var r = this.remote;
      var utils = new DriverUtils(r);

      // HAR file is specified inside the test page.
      var viewerURL = testBase + "tests/testPreviewExpand.html.php";
      var harFileURL = testBase + "tests/hars/multiple-pages.har";
      var url = viewerURL + "?path=" + harFileURL;

      return r
        .setFindTimeout(timeout)
        .get(url)
        .findByCssSelector(".pageTable")
        .then(utils.cbAssertElementsLength(".pageRow", 3))
        .then(utils.cbAssertElementsLength(".pageRow.opened", 0));
    },

    'testExpandByDefault': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var timeout = 10 * 1000;
      var r = this.remote;
      var utils = new DriverUtils(r);

      // HAR file is specified inside the test page.
      var viewerURL = testBase + "tests/testPreviewExpand.html.php";
      var harFileURL = testBase + "tests/hars/multiple-pages.har";
      var url = viewerURL + "?path=" + harFileURL + "&expand=true";

      return r
        .setFindTimeout(timeout)
        .get(url)
        .findByCssSelector(".pageTable")
        .then(utils.cbAssertElementsLength(".pageRow.opened", 3));
    }
  });
});
