/**
 * Verify automatic expanding of pages.
 */
define([
  './config',
  './DriverUtils',
], function(config, DriverUtils) {
  const { registerSuite } = intern.getInterface("object");
  const { testBase } = config;

  registerSuite('testPreviewExpand', {
    'testExpandSinglePage': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;

      // HAR file is specified inside the test page.
      var viewerURL = testBase + "tests/testPreviewExpand.html.php";
      var harFileURL = testBase + "tests/hars/preview-expand.har";
      var url = viewerURL + "?path=" + harFileURL;

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .findByCssSelector(".pageRow.opened");
    },

    'testExpandMultiplePages': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      // HAR file is specified inside the test page.
      var viewerURL = testBase + "tests/testPreviewExpand.html.php";
      var harFileURL = testBase + "tests/hars/multiple-pages.har";
      var url = viewerURL + "?path=" + harFileURL;

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .findByCssSelector(".pageTable")
        .then(utils.cbAssertElementsLength(".pageRow", 3))
        .then(utils.cbAssertElementsLength(".pageRow.opened", 0));
    },

    'testExpandByDefault': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      // HAR file is specified inside the test page.
      var viewerURL = testBase + "tests/testPreviewExpand.html.php";
      var harFileURL = testBase + "tests/hars/multiple-pages.har";
      var url = viewerURL + "?path=" + harFileURL + "&expand=true";

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .findByCssSelector(".pageTable")
        .then(utils.cbAssertElementsLength(".pageRow.opened", 3));
    },
  });
});
