/**
 * Check configurable column visibility.
 */
define([
  './config',
  './DriverUtils',
  'dojo/node!@theintern/leadfoot',
], function(config, DriverUtils, leadfoot) {
  const { registerSuite } = intern.getInterface("object");
  const { assert } = intern.getPlugin("chai");
  const { pollUntil } = leadfoot;
  const { testBase } = config;

  function assertColumnIsVisible(locator) {
    return assertColumnVisibility(true, locator);
  }

  function assertColumnIsNotVisible(locator) {
    return assertColumnVisibility(false, locator);
  }

  function assertColumnVisibility(visible, locator) {
    var script = "return document.querySelector('" + locator + "').clientWidth";
    return function() {
      return this.session.execute(script).then(function(clientWidth) {
        var result = visible ? (clientWidth > 0) : (clientWidth === 0);
        assert.ok(result, "Column " + locator + " is wrong, as clientWidth=" + clientWidth + " and visible=" + visible);
      });
    };
  }

  registerSuite('testCustomizeColumns', {
    '1': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      // HAR file is specified inside the test page.
      var viewerURL = testBase + "tests/testCustomizeColumnsPage.html";
      var harFileURL = testBase + "tests/hars/simple.har";
      var url = viewerURL + "?path=" + harFileURL;

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .findByCssSelector(".PreviewTab.selected")
        // Make sure we are in the Preview tab.
        .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
        // Check columns visibility
        // gitgrimbo
        // Add .netRow class to ensure we get a table cell that should have a clientWidth when we want it to.
        // IE11 gives clientWidth as zero in some cases (if the clientHeight is 0?).
        .then(assertColumnIsVisible(".netTable .netRow .netHrefCol"))
        .then(assertColumnIsVisible(".netTable .netRow .netTypeCol"))
        .then(assertColumnIsVisible(".netTable .netRow .netTimeCol"))
        .then(assertColumnIsNotVisible(".netTable .netRow .netSizeCol"))
        .then(assertColumnIsNotVisible(".netTable .netRow .netStatusCol"))
        .then(assertColumnIsNotVisible(".netTable .netRow .netDomainCol"));
    },

    '2': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      // HAR file is specified inside the test page.
      var viewerURL = testBase + "tests/testCustomizeColumnsPage2.html";
      var harFileURL = testBase + "tests/hars/simple.har";
      var url = viewerURL + "?path=" + harFileURL;

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .findByCssSelector(".PreviewTab.selected")
        // Make sure we are in the Preview tab.
        .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
        // Check columns visibility
        // gitgrimbo
        // Add .netRow class to ensure we get a table cell that should have a clientWidth when we want it to.
        // IE11 gives clientWidth as zero in some cases (if the clientHeight is 0?).
        .then(assertColumnIsVisible(".netTable .netRow .netHrefCol"))
        .then(assertColumnIsVisible(".netTable .netRow .netStatusCol"))
        .then(assertColumnIsVisible(".netTable .netRow .netSizeCol"))
        .then(assertColumnIsVisible(".netTable .netRow .netTimeCol"))
        .then(assertColumnIsNotVisible(".netTable .netRow .netTypeCol"))
        .then(assertColumnIsNotVisible(".netTable .netRow .netDomainCol"));
    },

    '3': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;

      // HAR file is specified inside the test page.
      var viewerURL = testBase + "tests/testCustomizeColumnsPage3.html";
      var harFileURL = testBase + "tests/hars/simple.har";
      var url = viewerURL + "?path=" + harFileURL + "&expand=true";

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .then(pollUntil("return document.querySelector('.pageTable .pageRow.opened');", findTimeout))
        // Check columns visibility
        // gitgrimbo
        // Add .netRow class to ensure we get a table cell that should have a clientWidth when we want it to.
        // IE11 gives clientWidth as zero in some cases (if the clientHeight is 0?).
        .then(assertColumnIsVisible(".netTable .netRow .netHrefCol"))
        .then(assertColumnIsVisible(".netTable .netRow .netTimeCol"))
        .then(assertColumnIsNotVisible(".netTable .netRow .netStatusCol"))
        .then(assertColumnIsNotVisible(".netTable .netRow .netSizeCol"))
        .then(assertColumnIsNotVisible(".netTable .netRow .netTypeCol"))
        .then(assertColumnIsNotVisible(".netTable .netRow .netDomainCol"));
    },
  });
});
