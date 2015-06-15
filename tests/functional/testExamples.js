define([
  'intern',
  'intern!object',
  'intern/chai!assert',
  'require',
  './DriverUtils'
], function(intern, registerSuite, assert, require, DriverUtils) {
  var harViewerBase = intern.config.harviewer.harViewerBase;

  function loadAndVerify(driver, exampleId, expected) {
    var utils = new DriverUtils(driver);
    return driver
      .get(harViewerBase)
      .find("id", exampleId)
      .click()
      .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
      .then(utils.cbAssertElementContainsText("css=.previewList", expected));
  }

  function cbLoadAndVerify(driver, exampleId, expected) {
    return function() {
      return loadAndVerify(driver, exampleId, expected);
    };
  }

  registerSuite({
    name: 'testExamples',

    'testTabs': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var timeout = 10 * 1000;
      var r = this.remote;
      return r
        .setFindTimeout(timeout)
        .get(harViewerBase)
        .then(cbLoadAndVerify(r, "example1", "Cuzillion"))
        .then(cbLoadAndVerify(r, "example2", "Cuzillion"))
        .then(cbLoadAndVerify(r, "example3", "Software is hard | Firebug 1.6 beta 1 Released"))
        .then(cbLoadAndVerify(r, "example4", "Google"));
    }
  });
});
