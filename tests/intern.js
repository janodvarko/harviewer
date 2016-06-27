/**
 * Base Intern config for HAR Viewer.
 *
 * Look at intern-selenium-standalone.js and intern-selenium-grid.js for
 * config for functional testing.
 */
define([
  'intern/dojo/has'
], function(has) {
  var config = {};

  config.defaultTimeout = 60 * 1000;

  config.reporters = [
    'Pretty',
    'Lcov',
    'LcovHtml',
    { 'id': 'JUnit', 'filename': 'report.xml' }
  ];

  // Configuration options for the module loader; any AMD configuration options supported by the Dojo loader can be
  // used here
  config.loaderOptions = {
    paths: {
        'text': 'webapp/scripts/text',
        'i18n': 'webapp/scripts/i18n',
        'jquery': 'webapp/scripts/jquery'
    },
    packages: [{
        name: 'core', location: 'webapp/scripts/core'
    },{
        name: 'preview', location: 'webapp/scripts/preview'
    },{
        name: 'nls', location: 'webapp/scripts/nls'
    },{
        name: 'tabs', location: 'webapp/scripts/tabs'
    }]
  };

  // Non-functional test suite(s) to run in each browser
  config.suites = [];
  if (has('host-browser')) {
    config.suites.push('tests/unit/unit');
  }
  config.suites = config.suites.concat([
    'tests/unit/core/lib',
    'tests/unit/core/cookies',
    'tests/unit/core/mime',
    'tests/unit/core/StatsService'
  ]);

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
  config.excludeInstrumentation = new RegExp([
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
    ].join('|'));

  return config;
});
