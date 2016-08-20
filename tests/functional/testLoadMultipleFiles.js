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

  function makeFiles(num) {
    var files = [];
    for (var i = 0; i < num; i++) {
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
      return ("string" === typeof prefix) ? prefix + it : it;
    });
  }

  function testWithParamName(remote, baseUrl, paramName, files, expectedNumberOfPageTables) {
    // Some of these tests need a larger timeout for finding DOM elements
    // because we need the HAR to parse/display fully before we query the DOM.
    var findTimeout = intern.config.harviewer.findTimeout;
    var r = remote;
    var utils = new DriverUtils(r);

    if ("number" !== typeof expectedNumberOfPageTables) {
      // If no explicit "expectedNumberOfPageTables" provided, default to number of files.
      expectedNumberOfPageTables = files.length;
    }

    // Put together URL that specifies multiple HAR files.
    var url = harViewerBase + "?";
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

    var waitForFilesToLoadMs = findTimeout;

    return r
      .setFindTimeout(findTimeout)
      .get(url)
      // Wait for 10 sec to load all HAR files.
      // Return null or undefined to indicate poll not successful (yet).
      // http://theintern.github.io/leadfoot/pollUntil.html
      .then(pollUntil("return (document.querySelectorAll('.pageTable').length === " + expectedNumberOfPageTables + ") || null;", waitForFilesToLoadMs))
      .then(null, function(err) {
        // ignore pollUntil timeout error
        return 0;
      })
      .findAllByCssSelector(".pageTable")
      .then(function(els) {
        assert.strictEqual(els.length, expectedNumberOfPageTables);
      })
      .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"));
  }

  registerSuite({
    name: 'testLoadMulipleFiles',

    'testLoadMulipleFiles using "path" and "baseUrl" parameters': function() {
      // Using both "path" and "baseUrl" means we're loading JSONP/HARP
      return testWithParamName(this.remote, testBase + "tests/hars/", "path", makeFiles(9));
    },

    'testLoadMulipleFiles using "path" parameter': function() {
      // Using only "path" means we're loading HAR
      var files = [
        "browser-blocking-time.har",
        "google.com.har",
        "inline-scripts-block.har"
      ];
      // Without baseUrl, files must point to resolveable URL.
      // In this case, relative to the webapp.
      files = prefix(harViewerBase + "examples/", files);
      // Legacy "path" parameter only loads first "path", so expectedNumberOfPageTables===1.
      return testWithParamName(this.remote, null, "path", files, 1);
    },

    'testLoadMulipleFiles using "harp" and "baseUrl" parameter': function() {
      return testWithParamName(this.remote, testBase + "tests/hars/", "harp", makeFiles(9));
    },

    'testLoadMulipleFiles using "harp" parameter': function() {
      var files = prefix(testBase + "tests/hars/", makeFiles(9));
      return testWithParamName(this.remote, null, "harp", files);
    },

    'testLoadMulipleFiles using "har" and "baseUrl" parameter': function() {
      var files = [
        "browser-blocking-time.har",
        "google.com.har",
        "inline-scripts-block.har"
      ];
      // New "har" parameter loads all "har", so expectedNumberOfPageTables===3
      // (which is the default files.length).
      return testWithParamName(this.remote, harViewerBase + "examples/", "har", files);
    },

    'testLoadMulipleFiles using "har" parameter': function() {
      var files = [
        "browser-blocking-time.har",
        "google.com.har",
        "inline-scripts-block.har"
      ];
      files = prefix(harViewerBase + "examples/", files);
      // New "har" parameter loads all "har", so expectedNumberOfPageTables===3
      // (which is the default files.length).
      return testWithParamName(this.remote, null, "har", files);
    }
  });
});
