/**
 * Test HAR Viewer API for removing an existing tab.
 */
define([
  './config',
  './DriverUtils',
], function(config, DriverUtils) {
  const { registerSuite } = intern.getInterface("object");
  const { testBase } = config;

  registerSuite('testRemoveTab', {
    'testRemoveTab': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      var url = testBase + "tests/testRemoveTabIndex.html";

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .findByCssSelector(".HomeTab.selected")
        .end()
        .findByCssSelector(".PreviewTab")
        .end()
        .findByCssSelector(".DOMTab")
        .end()
        // set find timeout to zero so the following assertions are immediate.
        .setFindTimeout(0)
        .then(utils.cbAssertElementsLength(".AboutTab", 0))
        .then(utils.cbAssertElementsLength(".SchemaTab", 0));
    },
  });
});
