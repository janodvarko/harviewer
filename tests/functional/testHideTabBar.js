/**
 * Test API for hiding the application tab bar.
 */
define([
  './config',
  './DriverUtils',
], function(config, DriverUtils) {
  const { registerSuite } = intern.getInterface("object");
  const { testBase } = config;

  registerSuite('testHideTabBar', {
    'testHideTabBar': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;

      var url = testBase + "tests/testHideTabBarIndex.html";

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .findByCssSelector(".harView[hidetabbar='true']");
    },
  });
});
