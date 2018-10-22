/**
 * Unit tests for harModel.
 */
define([
    "preview/harModel",
    "./withJSONFile",
], function(HarModel, withJSONFile) {
    var registerSuite = intern.getInterface("object").registerSuite;
    var assert = intern.getPlugin("chai").assert;

    function makeFixture(jsonPath, entrySize, uncompressedSize, transferredSize, description) {
        return {
          jsonPath: jsonPath,
          entrySize: entrySize,
          uncompressedSize: uncompressedSize,
          transferredSize: transferredSize,
          description: description,
        };
    }

    var fixture = [
        makeFixture("./chr70.sw.entry1.json", 0, 17536, 0, "First request - intercepted by service worker."),
        makeFixture("./chr70.sw.entry2.json", 6690, 17536, 6690, "Second request - made by service worker to the network."),
        makeFixture("./chr70.sw.entry3.json", 0, 17536, 0, "Third request - After pressing enter in address bar - from memory cache."),
        makeFixture("./chr70.sw.entry4.json", 0, 17536, 0, "Fourth request - Satisfied by service-worker-cache."),
        makeFixture("./chr70.sw.entry5.json", 0, 17536, 0, "Fifth request - Offline in devtools - Satisfied by service-worker-cache."),
    ];

    var suite = fixture.reduce(function(tests, fixtureData) {
        tests[fixtureData.jsonPath] = withJSONFile(fixtureData.jsonPath, function(entry) {
            assert.equal(HarModel.getEntrySize(entry), fixtureData.entrySize, fixtureData.description);
            assert.equal(HarModel.getEntryUncompressedSize(entry), fixtureData.uncompressedSize, fixtureData.description);
            assert.equal(HarModel.getEntryTransferredSize(entry), fixtureData.transferredSize, fixtureData.description);
        });
        return tests;
    }, {});

    registerSuite("preview/harModel/getEntrySize", suite);
});
