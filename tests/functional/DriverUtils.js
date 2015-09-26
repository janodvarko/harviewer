/**
This module aims to provide a syntax bridge between the old PHPUnit/Selenium1
tests and new Intern/Chai/Selenium2 tests.
*/
define([
  "intern/chai!assert",
  'intern/dojo/node!leadfoot/helpers/pollUntil',
  'intern/dojo/node!leadfoot/Command',
  'intern/dojo/Promise'
], function(assert, pollUntil, Command, Promise) {

  function logThen(msg, formatIt) {
    return function(it) {
      var args = [new Date(), msg];
      if (formatIt !== null) {
        args.push(formatIt ? formatIt(it) : it);
      }
      console.log.apply(console, args);
      return it;
    };
  }

  function pluck(prop) {
    return function(ob) {
      return ob && ob[prop];
    };
  }

  function waitFor(ms) {
    return function() {
      return new Promise(function(resolve, reject) {
        setTimeout(resolve, ms);
      });
    };
  }

  /**
   * Returns a function that can be used as a parameter to a Command's then() method.
   * E.g.
   *     .then(getCookie("validate"))
   *     .then(function(cookie) { ... })
   */
  function getCookie(name) {
    return function() {
      return this.session.getCookies().then(function(cookies) {
        for (var i = 0; i < cookies.length; i++) {
          var webDriverCookie = cookies[i];
          if (name === webDriverCookie.name) {
            return webDriverCookie;
          }
        }
        return null;
      });
    };
  };

  var syntaxBridge = {
    assertElementContainsText: function(driver, locator, text) {
      var elPromise = null;
      // css is the only type of locator that is supported for compatibility with the existing PHPUnit tests.
      var css = /^css=(.*)/.exec(locator);
      css = css && css[1];
      if (css) {
        elPromise = driver.findByCssSelector(css);
      }
      if (!elPromise) {
        throw new Error("Unknown locator format: " + locator);
      }
      return elPromise.getVisibleText().then(function(elText) {
        assert.include(elText, text);
      });
    },

    /**
     * Immediate (findTimeout==0) assertion of the number of elements matching the selector.
     */
    assertElementsLength: function(driver, selector, expected, timeout) {
      function test() {
        return driver
          .findAllByCssSelector(selector)
          .then(function(els) {
            var actual = els.length;
            var msg = "Should be " + expected + " elements matching [" + selector + "]. There were " + actual;
            assert.strictEqual(actual, expected, msg);
          });
      }

      function withTimeout() {
        return driver
          .getFindTimeout()
          .then(function(existingTimeout) {
            return driver
              // set find timeout
              .setFindTimeout(timeout)
              .then(test)
              // restore timeout
              .setFindTimeout(existingTimeout);
          });
      }

      // if timeout is a number, use it, otherwise set to zero for an immediate test of length.
      timeout = ("number" === typeof timeout) ? timeout : 0;
      return withTimeout();
    },

    assertCookie: function(driver, expression) {
      var cookiesPromise = null;
      // regexp is the only type of expression that is supported for compatibility with the existing PHPUnit tests.
      var regexp = /^regexp:(.*)/.exec(expression);
      regexp = regexp && regexp[1];
      if (regexp) {
        cookiesPromise = driver.getCookies();
      }
      if (!cookiesPromise) {
        throw new Error("Unknown expression format: " + expression);
      }
      return cookiesPromise.then(function(cookies) {
        var re = new RegExp(regexp);
        for (var i = 0; i < cookies.length; i++) {
          if (re.exec(cookies[i].name)) {
            return true;
          }
        }
        assert(false, "Cookie not found matching " + expression);
      });
    }
  };

  function DriverUtils(driver) {
    this.driver = driver;
  }

  DriverUtils.logThen = logThen;
  DriverUtils.pluck = pluck;
  DriverUtils.waitFor = waitFor;
  DriverUtils.getCookie = getCookie;

  // For every function in syntaxBridge, we attach TWO functions to DriverUtils,
  // and TWO functions to DriverUtils.prototype.

  // E.g., if FUNCTION_NAME === "assertElementContainsText", then

  // DriverUtils["assertElementContainsText"] === syntaxBridge["assertElementContainsText"]

  // DriverUtils["cbAssertElementContainsText"]
  // returns a function that calls DriverUtils["assertElementContainsText"] with the original parameters.

  // DriverUtils.prototype["assertElementContainsText"]
  // uses this.driver as first parameter to DriverUtils["assertElementContainsText"].

  // DriverUtils.prototype["cbAssertElementContainsText"]
  // returns a function that uses this.driver as first parameter to DriverUtils["cbAssertElementContainsText"].

  // Sample usage in an Intern functional test:

  // var r = this.remote;
  // var utils = new DriverUtils(r);
  // return r
  //   .get(url)
  //   .then(utils.cbAssertElementContainsText("css=.HomeTab", "Home"))
  //   .then(utils.cbAssertElementContainsText("css=.PreviewTab", "Preview"))
  //   .then(utils.cbAssertElementContainsText("css=.DOMTab", "HAR"))
  //   .then(utils.cbAssertElementContainsText("css=.SchemaTab", "Schema"));

  Object.keys(syntaxBridge).forEach(function(functionName) {
    var cbFunctionName = "cb" + functionName.substring(0, 1).toUpperCase() + functionName.substring(1);
    DriverUtils[functionName] = syntaxBridge[functionName];
    DriverUtils[cbFunctionName] = function() {
      return function() {
        return DriverUtils[functionName].apply(null, arguments);
      };
    };
    DriverUtils.prototype[functionName] = function() {
      var args = [this.driver].concat([].slice.apply(arguments));
      return DriverUtils[functionName].apply(null, args);
    };
    DriverUtils.prototype[cbFunctionName] = function() {
      var args = [this.driver].concat([].slice.apply(arguments));
      return function() {
        return DriverUtils[functionName].apply(null, args);
      };
    };
  });

  /**
   * Returns a function that is compatible with Leadfoot/Command then().
   *
   * @param selector {string}
   *    The CSS selector.
   * @param count {number}
   *    The number of elements to wait for. If not provided (or not a number),
   *    then the returned callback will return the first elements matching the
   *    selector (even if there are no matching elements).
   * @param timeout {number}
   *    Time to wait in milliseconds.
   *
   * @return {function} The callback.
   */
  DriverUtils.waitForElements = function waitForElements(selector, count, timeout) {
    var useCount = ("number" === typeof count);
    if (!useCount) {
      count = null;
    }
    return pollUntil(function(selector, count) {
        var useCount = ("number" === typeof count);
        var els = document.querySelectorAll(selector);
        if (!useCount) {
          return els;
        }
        return (els.length === count) ? els : null;
      },
      // Make sure we pass the args for the function to execute on the browser
      [selector, count],
      // timeout
      timeout);
  };

  /**
   * Function to be used by pollUntil, so all the data this function needs must be passed in as arguments.
   * @param frameSelector {string} A CSS selector to select the frame.
   * @param selector {string} A CSS selector to select elements within the frame.
   * @return {number|null} The number of elements found, or null (null satisfies pollUntil's wait semantics).
   */
  DriverUtils.querySelectAllInFrameAndReturnLengthOrNull = function querySelectAllInFrameAndReturnLengthOrNull(frameSelector, selector) {
    var els = document.querySelector(frameSelector).firstChild.contentDocument.querySelectorAll(selector);
    return els.length ? els.length : null;
  };

  return DriverUtils;
});
