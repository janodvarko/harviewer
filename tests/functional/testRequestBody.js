/**
 * Test content of the Schema tab.
 */
define([
  'intern',
  'intern!object',
  'intern/chai!assert',
  'require',
  './DriverUtils',
  './appDriver',
  'intern/dojo/node!leadfoot/helpers/pollUntil'
], function(intern, registerSuite, assert, require, DriverUtils, appDriver, pollUntil) {
  var harViewerBase = intern.config.harviewer.harViewerBase;
  var testBase = intern.config.harviewer.testBase;

  var findTimeout = intern.config.harviewer.findTimeout;
  var timeoutForExternalImagesToLoad = 5 * 1000;

  function testTabBodyContainsText(remote, url, expectedPageTitle, tabName, expectedTabBody) {
    var utils = new DriverUtils(remote);
    return appDriver.openAndClickFirstNetLabel(remote, url, findTimeout, expectedPageTitle)
      .then(appDriver.clickTab(tabName))
      .then(utils.cbAssertElementContainsText("css=.tab" + tabName + "Body.tabBody.selected ", expectedTabBody));
  }

  function testSyntaxHighlighting(remote, url, expectedPageTitle) {
    return appDriver.openAndClickFirstNetLabel(remote, url, findTimeout, expectedPageTitle)
      .then(appDriver.clickTab("Highlighted"))
      // We assume that finding the following class means syntax highlighter has worked.
      .findByCssSelector(".syntaxhighlighter")
  }

  function testTreeView(remote, url, expectedPageTitle, tabName, firstLabel, firstValue) {
    var utils = new DriverUtils(remote);
    return appDriver.openAndClickFirstNetLabel(remote, url, findTimeout, expectedPageTitle)
      .then(appDriver.clickTab(tabName))
      .then(utils.cbAssertElementContainsText("css=.memberLabelCell", firstLabel))
      .then(utils.cbAssertElementContainsText("css=.memberValueCell", firstValue));
  }

  function testImageDimensions(remote, url, expectedPageTitle, idx, isExternalImage, width, height, delta) {
    delta = delta || 0;

    var tabName = isExternalImage ? "ExternalImage" : "Image";

    return appDriver.openAndClickNetLabel(remote, url, findTimeout, expectedPageTitle, idx)
      .then(appDriver.clickTab(tabName))
      .findByCssSelector(".tabBody.selected")
      .then(function(body) {
        return body.findByCssSelector("img").then(function(img) {
          // return the image for waitForImageToLoad
          return img;
        });
      })
      .then(appDriver.waitForImageToLoad(timeoutForExternalImagesToLoad))
      .then(function(size) {
        // size is NOT from Leadfoot getSize()?
        // img.getSize() seems to be unreliable, with different values coming from the different browser WebDrivers.
        assert.closeTo(size.height, height, delta, "height");
        assert.closeTo(size.width, width, delta, "width");
      });
  }

  registerSuite({
    name: 'testRequestBody',

    'testUrlParams': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/url-params.har";
      var expectedPageTitle = "Test Case for encoded ampersand in URL";
      // NOTE - gitgrimbo
      // Leadfoot returns the next Element's text with line breaks, so they have been added here.
      var expectedTabBody = "value1\n1\nvalue2\n2\nvalue3\n3";

      return testTabBodyContainsText(this.remote, url, expectedPageTitle, "Params", expectedTabBody);
    },

    'testDataURL': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/data-url.har";
      var expectedPageTitle = "http://www.test.com/";
      var expectedTabBody = "data:text/css;charset=utf-8,body{text-align:center;}";

      return testTabBodyContainsText(this.remote, url, expectedPageTitle, "DataURL", expectedTabBody);
    },

    'testIssue21 - GET with empty postData shows no "Get"/"undefined" SendDataTab': function() {
      var r = this.remote;
      var utils = new DriverUtils(r);

      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-21/get-empty-post-data.har";
      var expectedPageTitle = "Tags and Attributes | React";

      return appDriver.openAndClickFirstNetLabel(r, url, findTimeout, expectedPageTitle)
        .findByCssSelector(".netInfoRow")
        .findAllByCssSelector(".tab")
        .then(appDriver.getVisibleTextForAll)
        // Headers/Response/HTML - No SentDataTab with "undefined" label or "Get" label should be present.
        .then(function(tabLabels) {
          assert.notInclude(tabLabels, "undefined", "No tab should have undefined as label");
          assert.notInclude(tabLabels, "Get", '"Get" tab should not be present');
        });
    },

    'testIssue21 - POST with empty postData shows a Post SendDataTab': function() {
      var r = this.remote;
      var utils = new DriverUtils(r);

      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-21/post-empty-post-data.har";
      var expectedPageTitle = "Tags and Attributes | React";

      return appDriver.openAndClickFirstNetLabel(r, url, findTimeout, expectedPageTitle)
        .findByCssSelector(".netInfoRow")
        .findAllByCssSelector(".tab")
        .then(appDriver.getVisibleTextForAll)
        .then(function(tabLabels) {
          assert.include(tabLabels, "Post", '"Post" tab should be present');
        });
    },

    'testIssue78 - HTML': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-78/html.har";
      return testSyntaxHighlighting(this.remote, url, "HTML");
    },

    'testIssue78 - JSON': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-78/json.har";
      return testSyntaxHighlighting(this.remote, url, "JSON");
    },

    'testIssue78 - XML': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-78/xml.har";
      return testSyntaxHighlighting(this.remote, url, "XML");
    },

    'testIssue78 - CSS': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-78/css.har";
      return testSyntaxHighlighting(this.remote, url, "CSS");
    },

    'testIssue78 - RSS': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-62/rss.har";
      return testSyntaxHighlighting(this.remote, url, "npr.org");
    },

    'testIssue62 - RSS as XML': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-62/rss.har";
      return testTreeView(this.remote, url, "npr.org", "XML", "rss", "Element");
    },

    'testIssue62 - JSON': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-78/json.har";
      return testTreeView(this.remote, url, "JSON", "JSON", "log", "Object");
    },

    'testIssue62 - base64 encoded SVG as XML': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-62/svg.base64.har";
      // TODO - Need a better way of determining if this test should be run or not.
      return this.remote.execute("return typeof atob")
        .then((type) => {
          if (type === "function") {
            return testTreeView(this.remote, url, "SVG", "XML", "svg", "SVGSVGElement");
          }
        });
    },

    'testIssue23 - chrome51.har Image': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-23/chrome51.har";
      return testImageDimensions(this.remote, url, "Browser test runner", 1, false, 32, 32);
    },

    'testIssue23 - chrome51.har ExternalImage': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-23/chrome51.har";
      return testImageDimensions(this.remote, url, "Browser test runner", 2, true, 32, 32);
    },

    'testIssue23 - ff47.har Image': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-23/ff47.har";
      return testImageDimensions(this.remote, url, "Browser test runner", 1, false, 32, 32);
    },

    'testIssue23 - ff47.har ExternalImage': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-23/ff47.har";
      return testImageDimensions(this.remote, url, "Browser test runner", 2, true, 32, 32);
    },

    'testIssue23 - images.har PNG Image': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-23/images.har";
      return testImageDimensions(this.remote, url, "issue-23", 0, false, 88, 31);
    },

    'testIssue23 - images.har SVG Image': function() {
      var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-23/images.har";
      var delta = 1;
      // Chrome and FF report the SVG width/height as 515.  IE reports as 514, so need a delta.
      return testImageDimensions(this.remote, url, "issue-23", 1, false, 515, 515, delta);
    },

    'testIssue56': {
      'testIssue56 - Handle missing response.content.mimetype gracefully': function() {
        var r = this.remote;

        var url = harViewerBase + "?path=" + testBase + "tests/hars/issue-56/missing-content-type.har";
        var expectedPageTitle = "CSS";
        var expectedTabBody = "See license.txt for terms of usage";

        // The HAR is invalid, so browse to base page first, turn off
        // validation and only then do the main test.
        // We're testing that HAR Viewer handles the lack of
        // response.content.mimeType gracefully.
        return r
          .setFindTimeout(findTimeout)
          .get(harViewerBase)
          .then(appDriver.disableValidation())
          .then(function() {
            return testTabBodyContainsText(r, url, expectedPageTitle, "Response", expectedTabBody);
          });
      },

      teardown: function() {
        // Clear cookies to return to clean state for other tests
        return this.remote.clearCookies();
      }
    },

    'test no headers': function() {
      // Ensure a lack of headers doesn't prevent other RequestBody tabs from being rendered.
      // Some HAR tools, e.g. BrowserMob, can export HARs without headers.
      var url = harViewerBase + "?path=" + testBase + "tests/hars/no-headers.har";
      return testSyntaxHighlighting(this.remote, url, "CSS");
    }
  });
});
