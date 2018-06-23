define([
  './config',
  './DriverUtils',
], function(config, DriverUtils) {
  const { registerSuite } = intern.getInterface("object");
  const { harViewerBase } = config;

  registerSuite('Test1', {
    'testTabs': function() {
      var r = this.remote;
      var utils = new DriverUtils(r);
      var findTimeout = config.findTimeout;
      return r
        .setFindTimeout(findTimeout)
        .get(harViewerBase)
        .then(utils.cbAssertElementContainsText("css=.HomeTab", "Home"))
        .then(utils.cbAssertElementContainsText("css=.PreviewTab", "Preview"))
        .then(utils.cbAssertElementContainsText("css=.DOMTab", "HAR"))
        .then(utils.cbAssertElementContainsText("css=.SchemaTab", "Schema"));
    },
  });
});
