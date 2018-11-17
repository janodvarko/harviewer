/**
 * Load multiple HAR files into the viewer.
 */
define([
  "./config",
  "./DriverUtils",
  "dojo/node!@theintern/leadfoot",
], function(config, DriverUtils, leadfoot) {
  const { registerSuite } = intern.getInterface("object");
  const { assert } = intern.getPlugin("chai");
  const { pollUntil } = leadfoot;
  const { harViewerBase, testBase, findTimeout } = config;

  function makeFiles(num) {
    const files = [];
    for (let i = 0; i < num; i++) {
      // Although these n.har files have .har extension, they are actually HARPs.
      files.push((i + 1) + ".har");
    }
    return files;
  }

  function makeParamsString(paramName, paramValues) {
    return paramValues.map(function(value) {
      return paramName + "=" + value;
    }).join("&");
  }

  function prefix(prefix, arr) {
    return arr.map(function(it) {
      return (typeof prefix === "string") ? prefix + it : it;
    });
  }

  function testWithParamName(remote, baseUrl, paramName, files, expectedNumberOfPageTables, expectedNumberOfErrors) {
    // Some of these tests need a larger timeout for finding DOM elements
    // because we need the HAR to parse/display fully before we query the DOM.
    const r = remote;
    const utils = new DriverUtils(r);

    if (typeof expectedNumberOfPageTables !== "number") {
      // If no explicit "expectedNumberOfPageTables" provided, default to number of files.
      expectedNumberOfPageTables = files.length;
    }

    if (typeof expectedNumberOfErrors !== "number") {
      expectedNumberOfErrors = 0;
    }

    // Put together URL that specifies multiple HAR files.
    let url = harViewerBase + "?";
    if (baseUrl) {
      url += "baseUrl=" + baseUrl + "&";
    }

    // Append the file params to the URL.
    url += makeParamsString(paramName, files);

    // Example of the result URL:
    // http://legoas/har/viewer/?
    // baseUrl=http://legoas/har/viewer/selenium/tests/hars/&
    // path=1.har&path=2.har&path=3.har&path=4.har&path=5.har&
    // path=6.har&path=7.har&path=8.har&path=9.har

    const waitForFilesToLoadMs = findTimeout;
    const assertExpectedNumberOfPageTablesJS = [
      `return (`,
      `  document.querySelectorAll(".pageTable").length === ${expectedNumberOfPageTables}`,
      `) || null;`,
    ].join("");

    return r
      .setFindTimeout(findTimeout)
      .get(url)
      // Wait for 10 sec to load all HAR files.
      // Return null or undefined to indicate poll not successful (yet).
      // http://theintern.github.io/leadfoot/pollUntil.html
      .then(pollUntil(assertExpectedNumberOfPageTablesJS, waitForFilesToLoadMs))
      // ignore pollUntil timeout error because we repeat the .pageTable selector below
      .catch(() => 1)
      // We don't want to wait any longer for .pageTable or .errorTable elements to appear.
      // They should already be there after the above pollUntil has waited.
      .setFindTimeout(0)
      .findAllByCssSelector(".pageTable")
      .then((els) => assert.strictEqual(els.length, expectedNumberOfPageTables, ".pageTable"))
      .end(Infinity)
      .findAllByCssSelector(".errorTable")
      .then((els) => assert.strictEqual(els.length, expectedNumberOfErrors, ".errorTable"))
      .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"));
  }

  registerSuite("testLoadMultipleFiles", {
    "testLoadMultipleFiles using 'path' and 'baseUrl' parameters": function() {
      // Using both "path" and "baseUrl" means we"re loading JSONP/HARP
      return testWithParamName(this.remote, testBase + "tests/hars/", "path", makeFiles(9));
    },

    "testLoadMultipleFiles using 'path' parameter": function() {
      // Using only "path" means we"re loading HAR
      // Without baseUrl, files must point to resolveable URL.
      // In this case, relative to the webapp.
      const files = prefix(harViewerBase + "examples/", [
        "browser-blocking-time.har",
        "google.com.har",
        "inline-scripts-block.har",
      ]);
      // Legacy "path" parameter only loads first "path", so expectedNumberOfPageTables===1.
      return testWithParamName(this.remote, null, "path", files, 1);
    },

    "testLoadMultipleFiles using 'harp' and 'baseUrl' parameter": function() {
      return testWithParamName(this.remote, testBase + "tests/hars/", "harp", makeFiles(9));
    },

    "testLoadMultipleFiles using 'harp' parameter": function() {
      const files = prefix(testBase + "tests/hars/", makeFiles(9));
      return testWithParamName(this.remote, null, "harp", files);
    },

    "testLoadMultipleFiles using 'har' and 'baseUrl' parameter": function() {
      const files = [
        "browser-blocking-time.har",
        "google.com.har",
        "inline-scripts-block.har",
      ];
      // New "har" parameter loads all "har", so expectedNumberOfPageTables===3
      // (which is the default files.length).
      return testWithParamName(this.remote, harViewerBase + "examples/", "har", files);
    },

    "testLoadMultipleFiles using 'har' parameter": function() {
      const files = prefix(harViewerBase + "examples/", [
        "browser-blocking-time.har",
        "google.com.har",
        "inline-scripts-block.har",
      ]);
      // New "har" parameter loads all "har", so expectedNumberOfPageTables===3
      // (which is the default files.length).
      return testWithParamName(this.remote, null, "har", files);
    },

    "testLoadMultipleFiles using 'har' parameter - with missing HAR": function() {
      const files = prefix(harViewerBase + "examples/", [
        "browser-blocking-time.har",
        "MISSING.har",
        "inline-scripts-block.har",
      ]);
      // Only 2 HARs should load properly, and 1 error
      return testWithParamName(this.remote, null, "har", files, 2, 1);
    },

    "testLoadMultipleFiles using 'harp' parameter - with missing HARP": function() {
      const files = prefix(testBase + "tests/hars/", makeFiles(3));
      // change the middle file to be missing
      files[1] = testBase + "MISSING.harp";
      // Only 2 HARPs should load properly, and 1 error
      return testWithParamName(this.remote, null, "harp", files, 2, 1);
    },
  });
});
