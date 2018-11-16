/**
 * Test content of the Schema tab.
 */
define([
  "./config",
  "./DriverUtils",
], function(config, DriverUtils) {
  const { registerSuite } = intern.getInterface("object");
  const { harViewerBase } = config;

  registerSuite("testSchemaTab", {
    "testSchemaTab": function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      return r
        .setFindTimeout(findTimeout)
        .get(harViewerBase)
        .then(utils.cbAssertElementContainsText("css=.SchemaTab", "Schema"))
        .findByCssSelector(".SchemaTab")
        .click()
        .end(Infinity)
        // We assume that finding the following attribute flag means syntax highlighting has worked.
        // We use a generic flag and not an impl-specific class so we can swap out the highlighter library if necessary.
        // @See HighlightedTab in webapp/scripts/preview/requestBody.js
        .findByCssSelector("[highlighted=true]");
    },
  });
});
