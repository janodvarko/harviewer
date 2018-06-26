/**
 * Unit tests for harModel.
 */
define([
  "preview/harModel",
], function(HarModel) {
  var registerSuite = intern.getInterface("object").registerSuite;
  var assert = intern.getPlugin("chai").assert;

  function assertOrder(har, propertyName, expectedIds) {
    var model = new HarModel();
    var input2 = model.append(har);
    var ids = input2.log[propertyName].map(function(it) {
      return it.id;
    });
    // check the order
    assert.deepEqual(ids, expectedIds);
}

  var Suite = {
    tests: {
      "pages are ordered by startedDateTime": function() {
        // har has out-of-order pages
        var har = {
          log: {
            pages: [{
              id: "2002",
              startedDateTime: "2002-01-01T00:00:00.000Z",
            }, {
              id: "2001",
              startedDateTime: "2001-01-01T00:00:00.000Z",
            }],
          },
        };
        assertOrder(har, "pages", ["2001", "2002"]);
      },

      "entries are ordered by startedDateTime": function() {
        // har has out-of-order entries
        var har = {
          log: {
            entries: [{
              id: "2002",
              startedDateTime: "2002-01-01T00:00:00.000Z",
            }, {
              id: "2001",
              startedDateTime: "2001-01-01T00:00:00.000Z",
            }],
          },
        };
        assertOrder(har, "entries", ["2001", "2002"]);
      },
    },
  };

  registerSuite("preview/harModel", Suite);
});
