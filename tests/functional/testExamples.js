define([
  'intern',
  'intern!object',
  'intern/chai!assert',
  'require',
  './DriverUtils'
], function(intern, registerSuite, assert, require, DriverUtils) {
  var harViewerBase = intern.config.harviewer.harViewerBase;

  function testExample(remote, exampleId, expected) {
    // Some of these tests need a larger timeout for finding DOM elements
    // because we need the HAR to parse/display fully before we query the DOM.
    var findTimeout = intern.config.harviewer.findTimeout;
    var utils = new DriverUtils(remote);
    return remote
      .setFindTimeout(findTimeout)
      .get(harViewerBase)
      .find("id", exampleId)
      .click()
      .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
      .then(utils.cbAssertElementContainsText("css=.previewList", expected));
  }

  registerSuite({
    name: 'testExamples',

    'example1': function() {
      return testExample(this.remote, "example1", "Cuzillion");
    },

    'example2': function() {
      return testExample(this.remote, "example2", "Cuzillion");
    },

    'example3': function() {
      return testExample(this.remote, "example3", "Software is hard | Firebug 1.6 beta 1 Released");
    },

    'example4': function() {
      return testExample(this.remote, "example4", "Google");
    }
  });
});
