/**
 * Test request body tabs.
 */
define([
  "./config",
  "./DriverUtils",
  "./appDriver",
], function(config, DriverUtils, appDriver) {
  const { registerSuite } = intern.getInterface("object");
  const { assert } = intern.getPlugin("chai");
  const { harViewerBase, testBase, findTimeout } = config;

  function testTabBodyContainsText(remote, url, expectedPageTitle, tabName, expectedTabBody) {
    const utils = new DriverUtils(remote);
    return appDriver.openAndClickFirstNetLabel(remote, url, findTimeout, expectedPageTitle)
      .then(appDriver.clickTab(tabName))
      .then(utils.cbAssertElementContainsText("css=.tab" + tabName + "Body.tabBody.selected ", expectedTabBody));
  }

  registerSuite("testRequestBody", {
    "testUrlParams": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/url-params.har";
      const expectedPageTitle = "Test Case for encoded ampersand in URL";
      // NOTE - gitgrimbo
      // Leadfoot returns the next Element"s text with line breaks, so they have been added here.
      const expectedTabBody = "value1\n1\nvalue2\n2\nvalue3\n3";

      return testTabBodyContainsText(this.remote, url, expectedPageTitle, "Params", expectedTabBody);
    },

    "testDataURL": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/data-url.har";
      const expectedPageTitle = "http://www.test.com/";
      const expectedTabBody = "data:text/css;charset=utf-8,body{text-align:center;}";

      return testTabBodyContainsText(this.remote, url, expectedPageTitle, "DataURL", expectedTabBody);
    },

    "testIssue21 - GET with empty postData shows no 'Get'/'undefined' SendDataTab": function() {
      const r = this.remote;

      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-21/get-empty-post-data.har";
      const expectedPageTitle = "Tags and Attributes | React";

      return appDriver.openAndClickFirstNetLabel(r, url, findTimeout, expectedPageTitle)
        .findByCssSelector(".netInfoRow")
        .findAllByCssSelector(".tab")
        .then(appDriver.getVisibleTextForAll)
        // Headers/Response/HTML - No SentDataTab with "undefined" label or "Get" label should be present.
        .then(function(tabLabels) {
          assert.notInclude(tabLabels, "undefined", "No tab should have undefined as label");
          assert.notInclude(tabLabels, "Get", "'Get' tab should not be present");
        });
    },

    "testIssue21 - POST with empty postData shows a Post SendDataTab": function() {
      const r = this.remote;

      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-21/post-empty-post-data.har";
      const expectedPageTitle = "Tags and Attributes | React";

      return appDriver.openAndClickFirstNetLabel(r, url, findTimeout, expectedPageTitle)
        .findByCssSelector(".netInfoRow")
        .findAllByCssSelector(".tab")
        .then(appDriver.getVisibleTextForAll)
        .then(function(tabLabels) {
          assert.include(tabLabels, "Post", "'Post' tab should be present");
        });
    },

    "testIssue56": {
      afterEach: function() {
        // Clear cookies to return to clean state for other tests
        const dfd = this.async();
        this.remote
          // clearCookies not currently working for edge 42.17134.1.0/17.17134 and driver 17134
          .clearCookies()
          .catch((err) => console.log(err))
          .finally(() => dfd.resolve());
      },

      tests: {
        "testIssue56 - Handle missing response.content.mimetype gracefully": function() {
          const r = this.remote;

          const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-56/missing-content-type.har";
          const expectedPageTitle = "CSS";
          const expectedTabBody = "See license.txt for terms of usage";

          // The HAR is invalid, so browse to base page first, turn off
          // validation and only then do the main test.
          // We"re testing that HAR Viewer handles the lack of
          // response.content.mimeType gracefully.
          return r
            .setFindTimeout(findTimeout)
            .get(harViewerBase)
            .then(appDriver.disableValidation())
            .then(function() {
              return testTabBodyContainsText(r, url, expectedPageTitle, "Response", expectedTabBody);
            });
        },
      },
    },
  });
});
