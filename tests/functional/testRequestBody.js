/**
 * Test content of the Schema tab.
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

  function clickFirstNetLabel(remote, url, expectedPageTitle) {
    // Some of these tests need a larger timeout for finding DOM elements
    // because we need the HAR to parse/display fully before we query the DOM.
    var findTimeout = intern.config.harviewer.findTimeout;
    var utils = new DriverUtils(remote);

    return remote
      .setFindTimeout(findTimeout)
      .get(url)
      // The Preview tab must be selected
      .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
      // There must be one page (expanded).
      .then(utils.cbAssertElementContainsText("css=.pageRow.opened", expectedPageTitle))
      // Expand the only request entry.
      .findByCssSelector(".netFullHrefLabel.netHrefLabel.netLabel")
      // NOTE - gitgrimbo
      // The element selected above (".netFullHrefLabel.netHrefLabel.netLabel")
      // is hidden, so click does not work. Therefore, click the parent.
      .findByXpath("..")
      .click()
      // NOTE - gitgrimbo
      // The next findByCssSelector() call will fail unless we reset the active Element two times.
      .end(2);
  }

  function clickTab(tabName) {
    return function() {
      return this.parent
        .findByCssSelector(".netInfoRow")
        .findByCssSelector("." + tabName + "Tab.tab")
        .click();
    };
  }

  function getVisibleTextForAll(els) {
    return Promise.all(els.map(function(el, i) {
      return el.getVisibleText();
    }));
  }

  function testTabBodyContainsText(remote, url, expectedPageTitle, tabName, expectedTabBody) {
    var utils = new DriverUtils(remote);
    return clickFirstNetLabel(remote, url, expectedPageTitle)
      .then(clickTab(tabName))
      .then(utils.cbAssertElementContainsText("css=.tab" + tabName + "Body.tabBody.selected ", expectedTabBody));
  }

  function testSyntaxHighlighting(remote, url, expectedPageTitle) {
      return clickFirstNetLabel(remote, url, expectedPageTitle)
        .then(clickTab("Response"))
        // We assume that finding the following class means syntax highlighter has worked.
        .findByCssSelector(".dp-highlighter")
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

      return clickFirstNetLabel(r, url, expectedPageTitle)
        .findByCssSelector(".netInfoRow")
        .findAllByCssSelector(".tab")
        .then(getVisibleTextForAll)
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

      return clickFirstNetLabel(r, url, expectedPageTitle)
        .findByCssSelector(".netInfoRow")
        .findAllByCssSelector(".tab")
        .then(getVisibleTextForAll)
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
    }
  });
});
