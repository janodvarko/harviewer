/**
 * This is sample Intern config to use with a standalone Selenium server.
 *
 * If any of firefox, chrome, internet explorer or phantomjs are not installed
 * on your machine, then remove/comment those browsers out from the
 * "environments" array.
 */
define([
  'intern/dojo/lang',
  './intern',
  './functional-suites'
], function(lang, base, functionalSuites) {
  var config = {
    // The port on which the instrumenting proxy will listen
    proxyPort: 9000,

    // A fully qualified URL to the Intern proxy
    proxyUrl: 'http://localhost:9000/',

    // These are custom properties that the tests can grab.
    // harViewerBase: The root URL to the harviewer app.
    // testBase: The root URL to the harviewer test pages, HARs and HARPs.
    harviewer: {
      harViewerBase: 'http://harviewer:49001/webapp/',
      testBase: 'http://harviewer:49001/selenium/',
      findTimeout: 30 * 1000
    },

    // Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
    // OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
    // capabilities options specified for an environment will be copied as-is
    environments: [{
      browserName: 'firefox'
    }, {
      browserName: 'chrome'
    }, {
      browserName: 'internet explorer'
    }, {
      browserName: 'phantomjs'
    }],

    // Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
    maxConcurrency: 4,

    functionalSuites: functionalSuites
  };

  return lang.mixin({}, base, config);
});
