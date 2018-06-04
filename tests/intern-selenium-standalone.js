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
  './functional-suites',
  './functional/config',
], function(lang, base, functionalSuites, functionalConfig) {
  var config = {
    // The port on which the instrumenting proxy will listen
    proxyPort: 9000,

    // A fully qualified URL to the Intern proxy
    proxyUrl: 'http://localhost:9000/',

    // Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
    // OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
    // capabilities options specified for an environment will be copied as-is
    environments: [{
      browserName: 'firefox',
      marionette: true,
    }, {
      browserName: 'chrome'
    }, {
      browserName: 'internet explorer'
    }],

    // Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
    maxConcurrency: 4,

    functionalSuites: functionalSuites
  };

  config.harviewer = functionalConfig;

  return lang.mixin({}, base, config);
});
