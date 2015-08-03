define([
  'intern',
  'intern!object',
  'intern/chai!assert',
  'require',
  './DriverUtils'
], function(intern, registerSuite, assert, require, DriverUtils) {
  var harViewerBase = intern.config.harviewer.harViewerBase;
  var testBase = intern.config.harviewer.testBase;

  registerSuite({
    name: 'testPageListService',

    'testPageListService': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var timeout = 10 * 1000;
      var r = this.remote;
      var utils = new DriverUtils(r);
      return r
        .setFindTimeout(timeout)
        .get(testBase + "tests/testPageListService.html.php")
        .switchToFrame("pageList")
        .findById("loadButton")
        .click()
        .then(utils.cbAssertElementContainsText("css=.pageName", "Simple Page"))
        .then(utils.cbAssertElementContainsText("css=.netRow", "GET Issue601.htm"));
    }
  });
});
