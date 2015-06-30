define([
  'intern',
  'intern!object',
  'intern/chai!assert',
  'require',
  './DriverUtils'
], function(intern, registerSuite, assert, require, DriverUtils) {
  var harViewerBase = intern.config.harviewer.harViewerBase;

  registerSuite({
    name: 'Test1',

    'testTabs': function() {
      var r = this.remote;
      var utils = new DriverUtils(r);
      var timeout = 10 * 1000;
      return r
        .setFindTimeout(timeout)
        .get(harViewerBase)
        .then(utils.cbAssertElementContainsText("css=.HomeTab", "Home"))
        .then(utils.cbAssertElementContainsText("css=.PreviewTab", "Preview"))
        .then(utils.cbAssertElementContainsText("css=.DOMTab", "HAR"))
        .then(utils.cbAssertElementContainsText("css=.SchemaTab", "Schema"));
    }
  });
});
