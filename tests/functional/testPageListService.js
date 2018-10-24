define([
  './config',
  './DriverUtils',
], function(config, DriverUtils) {
  const { registerSuite } = intern.getInterface("object");
  const { testBase } = config;

  registerSuite('testPageListService', {
    'testPageListService': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);
      return r
        .setFindTimeout(findTimeout)
        .get(testBase + "tests/testPageListService.html")
        .findByCssSelector("#pageList")
        .then(function(iframe) { return this.parent.switchToFrame(iframe); })
        .end(Infinity)
        .findById("loadButton")
        .click()
        .then(utils.cbAssertElementContainsText("css=.pageName", "Simple Page"))
        .then(utils.cbAssertElementContainsText("css=.netRow", "GET Issue601.htm"));
    },
  });
});
