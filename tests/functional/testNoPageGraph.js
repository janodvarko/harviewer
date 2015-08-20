/**
 * Test HAR file with entries that don't have a parent page.
 */
define([
  'intern',
  'intern!object',
  'intern/chai!assert',
  'require',
  './DriverUtils',
  'intern/dojo/node!leadfoot/helpers/pollUntil'
], function(intern, registerSuite, assert, require, DriverUtils, pollUntil) {
  var harViewerBase = intern.config.harviewer.harViewerBase;
  var testBase = intern.config.harviewer.testBase;

  registerSuite({
    name: 'testNoPageGraph',

    'testNoPageGraph': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = intern.config.harviewer.findTimeout;
      var r = this.remote;
      var utils = new DriverUtils(r);

      // Put together URL with a default file, e.g:
      var url = harViewerBase + "?path=" + testBase + "tests/hars/noPages.har";

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .then(DriverUtils.waitForElements(".PreviewTab.selected", 1, findTimeout))
        // Make sure we are in the Preview tab.
        .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
        // There must be 87 requests entries.
        .then(utils.cbAssertElementsLength(".netRow.loaded.isExpandable .netReceivingBar", 87))
        // Check position on the waterfall graph
        .execute(function() {
          var bars = window.document.querySelectorAll(".netRow.loaded.isExpandable .netReceivingBar");
          return (bars) && (bars.length >= 3) &&
            ([parseInt(bars[0].style.width),
              parseInt(bars[1].style.width),
              parseInt(bars[2].style.width)
            ]);
        })
        .then(function(barWidths) {
          // chai 2.0.0 added assert.isAbove(), but Intern 2.2.2 uses chai 1.9.1.
          // So we have to do the comparison manually.
          // https://github.com/chaijs/chai/pull/311
          // https://github.com/theintern/intern/pull/387
          assert.isArray(barWidths);
          assert.ok(barWidths[0] > 0, "barWidths[0] > 0");
          assert.ok(barWidths[1] > 0, "barWidths[1] > 0");
          assert.ok(barWidths[2] > 0, "barWidths[2] > 0");
        });
    }
  });
});
