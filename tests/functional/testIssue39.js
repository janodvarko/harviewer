define([
  "./config",
  "./DriverUtils",
  "dojo/node!@theintern/leadfoot",
], function(config, DriverUtils, leadfoot) {
  const { registerSuite } = intern.getInterface("object");
  const { assert } = intern.getPlugin("chai");
  const { testBase } = config;

  function assertTestIsOk(expectedNetRows) {
    return function() {
      let iframe;
      return this.parent
        .findByCssSelector("iframe")
        .then((_) => {
          iframe = _;
          return iframe.getAttribute("src");
        })
        // search for the action parameter and value.
        // "%3D" === encodeURIComponent("=")
        .then((src) => assert.include(src, "action%3Dshow_me_har_file"))
        .then(() => this.parent.switchToFrame(iframe))
        .end(Infinity)
        .findAllByCssSelector(".pageTable")
        .then((pageTables) => assert.strictEqual(pageTables.length, 1, ".pageTable"))
        .findAllByCssSelector(".netRow")
        .then((netRows) => assert.strictEqual(netRows.length, expectedNetRows, ".netRow"));
    };
  }

  function doTest(testPage, expectedNetRows) {
    // Some of these tests need a larger timeout for finding DOM elements
    // because we need the HAR to parse/display fully before we query the DOM.
    const { findTimeout } = config;
    const url = testBase + testPage;

    return this.remote
      .setFindTimeout(findTimeout)
      .get(url)
      .then(assertTestIsOk(expectedNetRows));
  }

  registerSuite("testIssue39", {
    /**
     * https://github.com/janodvarko/harviewer/issues/39
     * Query param values get dropped from URL when used as "data-har" HTML attribute.
     * E.g.:
     *   <div class="har" height="500" data-har="http://example.com/index.php?action=show_me_har_file"></div>
     * Leads to IFRAME URL of:
     *   http://example.com/index.php?action&callback=onInputData&_=1440704124791
     */
    "har": function() {
      return doTest.call(this, "tests/testIssue39-har.html", 2);
    },
    "harp": function() {
      return doTest.call(this, "tests/testIssue39-harp.html", 11);
    },
  });
});
