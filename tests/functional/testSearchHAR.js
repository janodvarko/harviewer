/**
 * Check search feature on the HAR tab.
 */
define([
  'intern',
  'intern!object',
  'intern/chai!assert',
  'require',
  './DriverUtils',
  'intern/dojo/node!leadfoot/helpers/pollUntil',
  'intern/dojo/node!leadfoot/keys'
], function(intern, registerSuite, assert, require, DriverUtils, pollUntil, keys) {
  var harViewerBase = intern.config.harviewer.harViewerBase;
  var testBase = intern.config.harviewer.testBase;

  registerSuite({
    name: 'testSearchHAR',

    'testSearchHAR': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var timeout = 10 * 1000;
      var r = this.remote;
      var utils = new DriverUtils(r);

      // HAR file is specified inside the test page.
      var url = harViewerBase + "?path=" + testBase + "tests/hars/searchHAR.har";

      return r
        .setFindTimeout(timeout)
        .get(url)
        // Wait for the HAR to load by waiting for the Preview tab to be auto-selected
        .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
        // Select the DOM tab
        .findByCssSelector(".DOMTab")
        .click()
        .end()
        .findByCssSelector(".DOMTab.selected")
        .end()
        // Type text into the search field and press enter.
        // From some reason the viewer doesn't receive "keyDown" events so, incremental
        // search isn't tested.
        // HOW TO FOCUS? ".tabDOMBody .searchInput"
        .findByCssSelector(".tabDOMBody .searchInput")
        .type("f")
        .type("i")
        .type("r")
        .type("e")
        .type(keys.ENTER)
        //.type(keys.RETURN)
        //.pressKeys(keys.ENTER)
        //.pressKeys(keys.RETURN)
        // Check selection on the page.
        .then(pollUntil("return (window.getSelection().toString() == 'Fire') || null;", timeout));
    }
  });
});
