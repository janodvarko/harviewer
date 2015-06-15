// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.
define([
], function() {
  var config = {
    // The port on which the instrumenting proxy will listen
    proxyPort: 9000,

    // A fully qualified URL to the Intern proxy
    proxyUrl: 'http://localhost:9000/',

    // gitgrimbo
    // These are custom properties that the tests can grab.
    // harViewerBase: The root URL to the harviewer app.
    // testBase: The root URL to the harviewer test pages, HARs and HARPs.
    harviewer: {
      harViewerBase: 'http://192.168.59.103:8000/webapp/',
      testBase: 'http://192.168.59.103:8000/selenium/'
    },

    // Default desired capabilities for all environments. Individual capabilities can be overridden by any of the
    // specified browser environments in the `environments` array below as well. See
    // https://code.google.com/p/selenium/wiki/DesiredCapabilities for standard Selenium capabilities and
    // https://saucelabs.com/docs/additional-config#desired-capabilities for Sauce Labs capabilities.
    // Note that the `build` capability will be filled in with the current commit ID from the Travis CI environment
    // automatically
    capabilities: {
      'selenium-version': '2.45.0'
    },

    // Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
    // OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
    // capabilities options specified for an environment will be copied as-is
    environments: [{
      browserName: 'firefox'
    }, {
      browserName: 'chrome'
    }, {
      browserName: 'ie'
    }, {
      browserName: 'phantomjs'
    }],

    // Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
    maxConcurrency: 4,

    //reporters: ['runner'],
    reporters: ['pretty', 'junit'],
    //reporters: ['console', 'junit'],
    //reporters: ['html'],

    // Configuration options for the module loader; any AMD configuration options supported by the Dojo loader can be
    // used here
    loader: {},

    // Non-functional test suite(s) to run in each browser
    suites: [
      'intern/node_modules/dojo/has!host-browser?tests/unit/unit'
    ],

    // Functional test suite(s) to run in each browser once non-functional tests are completed
    functionalSuites: [
      'tests/functional/test1',
      'tests/functional/testExamples',
      'tests/functional/testPageListService',
      'tests/functional/testPreviewSource',
      'tests/functional/testRemoteLoad',
      'tests/functional/testLoadMultipleFiles',
      'tests/functional/testNoPageLog',
      'tests/functional/testPageTimings',
      'tests/functional/testSchemaTab',
      'tests/functional/testRequestBody',
      'tests/functional/testRemoveTab',
      'tests/functional/testHideTabBar',
      'tests/functional/testShowStatsAndTimeline',
      'tests/functional/testCustomPageTiming',
      'tests/functional/testRemoveToolbarButton',
      'tests/functional/testTimeStamps',
      'tests/functional/testPhases',
      'tests/functional/testLoadHarAPI',
      'tests/functional/testNoPageGraph',
      'tests/functional/testEmbeddedPreview',
      'tests/functional/testCustomizeColumns',
      'tests/functional/testSearchHAR',
      'tests/functional/testPreviewExpand',
      'tests/functional/testEmbeddedInvalidPreview',
      'tests/functional/testSearchJsonQuery'
    ],

    // A regular expression matching URLs to files that should not be included in code coverage analysis
    excludeInstrumentation: /^intern|tests|bower_components|node_modules[\\/]/
  };

  return config;
});
