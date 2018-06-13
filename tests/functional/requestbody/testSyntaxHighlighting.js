/**
 * Test Syntax Highlighting request body.
 */
define([
  "../config",
  "../appDriver",
], function(config, appDriver) {
  const { registerSuite } = intern.getInterface("object");
  const { harViewerBase, testBase, findTimeout } = config;

  function testSyntaxHighlighting(remote, url, expectedPageTitle) {
    return appDriver.openAndClickFirstNetLabel(remote, url, findTimeout, expectedPageTitle)
      .then(appDriver.clickTab("Highlighted"))
      // We assume that finding the following attribute flag means syntax highlighting has worked.
      // We use a generic flag and not an impl-specific class,
      // so we can swap out the highlighter library if necessary.
      // @See HighlightedTab in webapp/scripts/preview/requestBody.js
      .findByCssSelector("[highlighted=true]");
  }

  registerSuite("testSyntaxHighlighting", {
    "HTML": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-78/html.har";
      return testSyntaxHighlighting(this.remote, url, "HTML");
    },

    "JSON": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-78/json.har";
      return testSyntaxHighlighting(this.remote, url, "JSON");
    },

    "XML": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-78/xml.har";
      return testSyntaxHighlighting(this.remote, url, "XML");
    },

    "CSS": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-78/css.har";
      return testSyntaxHighlighting(this.remote, url, "CSS");
    },

    "RSS": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-62/rss.har";
      return testSyntaxHighlighting(this.remote, url, "npr.org");
    },

    "test no headers": function() {
      // Ensure a lack of headers doesn't prevent other RequestBody tabs from being rendered.
      // Some HAR tools, e.g. BrowserMob, can export HARs without headers.
      const url = harViewerBase + "?path=" + testBase + "tests/hars/no-headers.har";
      return testSyntaxHighlighting(this.remote, url, "CSS");
    },
  });
});
