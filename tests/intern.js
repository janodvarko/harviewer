/**
 * Base Intern config for HAR Viewer.
 *
 * Look at intern-selenium-standalone.js and intern-selenium-grid.js for
 * config for functional testing.
 */
define([
], function() {
  var config = {

    defaultTimeout: 60 * 1000,

    reporters: [
      'Pretty',
      'Lcov',
      'LcovHtml',
      { 'id': 'JUnit', 'filename': 'report.xml' }
    ],

    // Configuration options for the module loader; any AMD configuration options supported by the Dojo loader can be
    // used here
    loaderOptions: {
      packages: [{name: 'core', location: 'webapp/scripts/core'}]
    },

    // Non-functional test suite(s) to run in each browser
    suites: [
      'intern/node_modules/dojo/has!host-browser?tests/unit/unit',
      'tests/unit/core/lib',
      'tests/unit/core/cookies'
    ],

    // A regular expression matching URLs to files that should not be included
    // in code coverage analysis.

    // Some of the patterns listed here can also be used in a reverse proxy to
    // prevent any files that should not be instrumented from even reaching the
    // Intern proxy.

    // WARNING - PhantomJS does not seem to like [Istanbul code coverage /
    // large JS files] combination.  Thus you may find the PhantomJS tests fail
    // when testing the built "webapp-build" files with instrumentation turned
    // on.  In this case you can set excludeInstrumentation to true, to
    // completely disable instrumentation.
    // See https://theintern.github.io/intern/#option-excludeInstrumentation
    excludeInstrumentation: new RegExp([
        // Exclude Intern's own files
        '^intern/',

        // Exclude test files
        '^tests/',

        // Exclude any 3rd party components installed via package manager
        '^bower_components/',
        '^node_modules/',

        // Exclude any 3rd party components in HAR Viewer's own source
        'scripts/jquery.js$',
        'scripts/require.js$',
        'scripts/text.js$',
        'scripts/i18n.js$',

        // Exclude any 3rd party components in HAR Viewer's own source
        '/downloadify/',
        '/json-query/',
        '/syntax-highlighter/'
      ].join('|'))
  };

  return config;
});
