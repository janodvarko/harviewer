/**
 * Test content of the Schema tab.
 */
define([
  './DriverUtils',
  'dojo/node!@theintern/leadfoot',
], function(DriverUtils, leadfoot) {
  const { pollUntil } = leadfoot;

  /**
   * Opens a HAR Viewer url, checks the first page title includes some expected text, and clicks the idx'th net label.
   */
  function openAndClickNetLabel(remote, url, findTimeout, expectedPageTitle, idx) {
    var utils = new DriverUtils(remote);

    return remote
      .setFindTimeout(findTimeout)
      .get(url)
      // The Preview tab must be selected
      .then(utils.cbAssertElementContainsText("css=.PreviewTab.selected", "Preview"))
      // There must be one page (expanded).
      .then(utils.cbAssertElementContainsText("css=.pageRow.opened", expectedPageTitle))
      .then(clickNetLabel(idx));
  }

  /**
   * Clicks a net label.  This should expand the netRow and reveal the Headers, Response tabs, etc.
   *
   * The returned function should be used as a then() callback.
   */
  function clickNetLabel(idx) {
    return function() {
      // Find all .netFullHrefLabel rows
      var context;
      return this.parent
        .findAllByCssSelector(".netFullHrefLabel.netHrefLabel.netLabel")
        .then(function(els, setContext) {
          context = els[idx];
          setContext(context);
        })
        // NOTE - gitgrimbo
        // The element selected above, one of (".netFullHrefLabel.netHrefLabel.netLabel")
        // is hidden, so click does not work. Therefore, click the parent.
        .findByXpath("..")
        .click()
        // Ensure we leave this function with the found element as the context.
        .then(function(_, setContext) {
          setContext(context);
        })
    };
  }

  function openAndClickFirstNetLabel(remote, url, findTimeout, expectedPageTitle) {
    return openAndClickNetLabel(remote, url, findTimeout, expectedPageTitle, 0);
  }

  /**
   * Returns a function to be used in then() callback, that will click a
   * specific tab, e.g. "Headers", "Response".
   *
   * The returned function should be used as a then() callback.
   */
  function clickTab(tabName) {
    return function() {
      return this.parent
        .findByCssSelector(".netInfoRow ." + tabName + "Tab.tab")
        .click();
    };
  }

  /**
   * Returns the visible text for all the elements.
   *
   * Use this function as a then() callback.
   */
  function getVisibleTextForAll(els) {
    return Promise.all(els.map(function(el, i) {
      return el.getVisibleText();
    }));
  }

  /**
   * Waits timeout ms for an image to load.  This function is usually used
   * with images with external src URLs which may take an undetermined time to load.
   *
   * The returned function should be used as a then() callback.
   */
  function waitForImageToLoad(timeout) {
    return function waitForImageToLoad(img) {
      var poller = pollUntil(function(img) {
        // http://stackoverflow.com/a/12687466/319878
        // https://www.w3.org/TR/html5/embedded-content-0.html#dom-img-complete

        // REMEMBER! Return null when you need to keep waiting.

        // Returns the width and height as an object that is serialised by
        // WebDriver back to our test.
        return (img.complete && img.width > 0 && img.height > 0) ? { width: img.width, height: img.height } : null;
      }, [img], timeout);
      return poller.apply(this, arguments);
    };
  }

  function disableValidation() {
    return function() {
      var parent = this.parent;
      return parent
        .findByCssSelector("#validate")
        .then(function(el) {
          // If the checkbox's "checked" property is true, then click to uncheck.
          // Why click() and not set the property directly? Because the cookie
          // in HAR Viewer is only set when a click event occurs.
          // Alternatively, we could set the cookie directly.
          return el.getProperty("checked")
            .then(function(checked) {
              return checked ? el.click() : 1;
            });
        });
    };
  }

  return {
    openAndClickNetLabel: openAndClickNetLabel,
    openAndClickFirstNetLabel: openAndClickFirstNetLabel,
    clickTab: clickTab,
    waitForImageToLoad: waitForImageToLoad,
    getVisibleTextForAll: getVisibleTextForAll,
    disableValidation: disableValidation
  };
});
