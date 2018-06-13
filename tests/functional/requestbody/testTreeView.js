/**
 * Test Tree View request body.
 */
define([
  "../config",
  "../DriverUtils",
  "../appDriver",
], function(config, DriverUtils, appDriver) {
  const { registerSuite } = intern.getInterface("object");
  const { harViewerBase, testBase, findTimeout } = config;

  function testTreeView(remote, url, expectedPageTitle, tabName, firstLabel, firstValue) {
    const utils = new DriverUtils(remote);
    return appDriver.openAndClickFirstNetLabel(remote, url, findTimeout, expectedPageTitle)
      .then(appDriver.clickTab(tabName))
      .then(utils.cbAssertElementContainsText("css=.memberLabelCell", firstLabel))
      .then(utils.cbAssertElementContainsText("css=.memberValueCell", firstValue));
  }

  registerSuite("testTreeView", {
    "RSS as XML": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-62/rss.har";
      return testTreeView(this.remote, url, "npr.org", "XML", "rss", "Element");
    },

    "JSON": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-78/json.har";
      return testTreeView(this.remote, url, "JSON", "JSON", "log", "Object");
    },

    "base64 encoded SVG as XML": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-62/svg.base64.har";
      // TODO - Need a better way of determining if this test should be run or not.
      return this.remote.execute("return typeof atob")
        .then((type) => {
          if (type === "function") {
            return testTreeView(this.remote, url, "SVG", "XML", "svg", "SVGSVGElement");
          }
        });
    },
  });
});
