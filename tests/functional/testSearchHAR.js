/**
 * Check search feature on the HAR tab.
 */
define([
  './config',
  './DriverUtils',
  'dojo/node!@theintern/leadfoot',
], function(config, DriverUtils, leadfoot) {
  const { registerSuite } = intern.getInterface("object");
  const { keys, pollUntil } = leadfoot;
  const { harViewerBase, testBase } = config;

  registerSuite('testSearchHAR', {
    'testSearchHAR': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      // HAR file is specified inside the test page.
      var url = harViewerBase + "?path=" + testBase + "tests/hars/searchHAR.har";

      return r
        .setFindTimeout(findTimeout)
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
        .then(pollUntil("return (window.getSelection().toString() == 'Fire') || null;", findTimeout));
    },
  });
});
