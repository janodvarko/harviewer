/**
 * Test HAR Viewer Search using JSON Query
 */
define([
  "./config",
  "./DriverUtils",
  "dojo/node!@theintern/leadfoot",
], function(config, DriverUtils, leadfoot) {
  const { registerSuite } = intern.getInterface("object");
  const { keys } = leadfoot;
  const { testBase } = config;

  /**
   * Perform the JSON Query search.
   */
  function performSearch() {
    // Some of these tests need a larger timeout for finding DOM elements
    // because we need the HAR to parse/display fully before we query the DOM.
    var findTimeout = config.findTimeout;
    var r = this.remote;
    var utils = new DriverUtils(r);

    var viewerURL = testBase + "tests/testSearchJsonQuery.html";
    var harFileURL = testBase + "tests/hars/searchHAR.har";
    var url = viewerURL + "?path=" + harFileURL;

    return r
      .setFindTimeout(findTimeout)
      .get(url)
      // Wait for the HAR to load by waiting for the Preview tab to be auto-selected
      .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
      .then(utils.cbAssertCookie("regexp:searchJsonQuery"))
      // Select the DOM tab
      .findByCssSelector(".DOMTab")
      .click()
      .end()
      .findByCssSelector(".DOMTab.selected")
      .end()
      // Type JSON Query expression into the search field and press enter.
      .findByCssSelector(".tabDOMBody .searchInput")
      .type("$..request")
      .type(keys.ENTER)
      .end();
  }

  registerSuite("testSearchJsonQuery", {
    "standard search": function() {
      var findTimeout = config.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);
      return performSearch
        .call(this)
        .findByCssSelector(".tabDOMBody .domBox .results.visible")
        .end()
        .then(utils.cbAssertElementsLength(".tabDOMBody .domBox .results .memberRow", 8, findTimeout));
    },

    "table view": function() {
      var findTimeout = config.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);
      return performSearch
        .call(this)
        .findByCssSelector(".tabDOMBody .domBox .results.visible")
        .end()
        .findByCssSelector(".queryResultsViewType input[type=checkbox]")
        .click()
        .end()
        .then(utils.cbAssertElementsLength("[role=gridcell]:first-child", 8, findTimeout));
    },
  });
});
