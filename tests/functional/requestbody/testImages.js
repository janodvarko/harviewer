/**
 * Test Image request body.
 */
define([
  "../config",
  "../appDriver",
], function(config, appDriver) {
  const { registerSuite } = intern.getInterface("object");
  const { assert } = intern.getPlugin("chai");
  const { harViewerBase, testBase, findTimeout } = config;
  const timeoutForExternalImagesToLoad = 5 * 1000;

  function testImageDimensions(remote, url, expectedPageTitle, idx, isExternalImage, width, height, delta) {
    delta = delta || 0;

    const tabName = isExternalImage ? "ExternalImage" : "Image";

    return appDriver.openAndClickNetLabel(remote, url, findTimeout, expectedPageTitle, idx)
      .then(appDriver.clickTab(tabName))
      .findByCssSelector(".tabBody.selected")
      .then(function(body) {
        return body.findByCssSelector("img")
          .then(function(img) {
            // return the image for waitForImageToLoad
            return img;
          });
      })
      .then(appDriver.waitForImageToLoad(timeoutForExternalImagesToLoad))
      .then(function(size) {
        // size is NOT from Leadfoot getSize()?
        // img.getSize() seems to be unreliable,
        // with different values coming from the different browser WebDrivers.
        assert.closeTo(size.height, height, delta, "height");
        assert.closeTo(size.width, width, delta, "width");
      });
  }

  registerSuite("testImages", {
    "chrome51.har Image": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-23/chrome51.har";
      return testImageDimensions(this.remote, url, "Browser test runner", 1, false, 32, 32);
    },

    "chrome51.har ExternalImage": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-23/chrome51.har";
      return testImageDimensions(this.remote, url, "Browser test runner", 2, true, 32, 32);
    },

    "ff47.har Image": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-23/ff47.har";
      return testImageDimensions(this.remote, url, "Browser test runner", 1, false, 32, 32);
    },

    "ff47.har ExternalImage": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-23/ff47.har";
      return testImageDimensions(this.remote, url, "Browser test runner", 2, true, 32, 32);
    },

    "images.har PNG Image": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-23/images.har";
      return testImageDimensions(this.remote, url, "issue-23", 0, false, 88, 31);
    },

    "images.har SVG Image": function() {
      const url = harViewerBase + "?path=" + testBase + "tests/hars/issue-23/images.har";
      const delta = 1;
      // Chrome and FF report the SVG width/height as 515.  IE reports as 514, so need a delta.
      return testImageDimensions(this.remote, url, "issue-23", 1, false, 515, 515, delta);
    },
  });
});
