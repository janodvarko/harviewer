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

  registerSuite({
    name: 'testRequestBody',

    'testUrlParams': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = intern.config.harviewer.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      var url = harViewerBase + "?path=" + testBase + "tests/hars/url-params.har";

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        // The Preview tab must be selected
        .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
        // There must be one page (expanded).
        .then(utils.cbAssertElementContainsText("css=.pageRow.opened",
          "Test Case for encoded ampersand in URL"))
        // Expand the only request entry.
        .findByCssSelector(".netFullHrefLabel.netHrefLabel.netLabel")
        // NOTE - gitgrimbo
        // The element selected above (".netFullHrefLabel.netHrefLabel.netLabel")
        // is hidden, so click does not work. Therefore, click the parent.
        .findByXpath("..")
        .click()
        // NOTE - gitgrimbo
        // The next findByCssSelector() call will fail unless we reset the active Element two times.
        .end(2)
        .findByCssSelector(".netInfoRow")
        .findByCssSelector(".ParamsTab.tab")
        .click()
        // NOTE - gitgrimbo
        // Leadfoot returns the next Element's text with line breaks, so they have been added here.
        .then(utils.cbAssertElementContainsText("css=.tabParamsBody.tabBody.selected ",
          "value1\n1\nvalue2\n2\nvalue3\n3"));
    },

    'testDataURL': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = intern.config.harviewer.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      var url = harViewerBase + "?path=" + testBase + "tests/hars/data-url.har";

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        // The Preview tab must be selected
        .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
        // There must be one page (expanded).
        .then(utils.cbAssertElementContainsText("css=.pageRow.opened", "http://www.test.com/"))
        // Expand the only request entry.
        .findByCssSelector(".netFullHrefLabel.netHrefLabel.netLabel")
        // NOTE - gitgrimbo
        // The element selected above (".netFullHrefLabel.netHrefLabel.netLabel")
        // is hidden, so click does not work. Therefore, click the parent.
        .findByXpath("..")
        .click()
        // NOTE - gitgrimbo
        // The next findByCssSelector() call will fail unless we reset the active Element two times.
        .end(2)
        .findByCssSelector(".netInfoRow")
        .findByCssSelector(".DataURLTab.tab")
        .click()
        .then(utils.cbAssertElementContainsText("css=.tabDataURLBody.tabBody.selected ",
          "data:text/css;charset=utf-8,body{text-align:center;}"));
    }
  });
});
