/**
 * This is sample Intern config to use with a Selenium grid.
 *
 * There is config for three Selenium nodes that must have already been
 * registered with the Selenium grid.
 *
 * The nodes need to be able to access the Intern proxy and a HAR Viewer
 * server.  Both the proxy and HAR Viewer server are declared here to be
 * available on a host called "harviewer". This host name can be changed to
 * an IP address if preferred.
 *
 * This config will not start the Selenium grid, or the Selenium nodes, or
 * the Intern proxy. The grid and nodes need to be started separately, and the
 * Intern proxy will be started when the tests are run.
 *
 * The "harviewer.harViewerBase" and "harviewer.testBase" URLs also need to be
 * set in "selenium/tests/config.php".
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
    proxyUrl: 'http://harviewer:9000/',

    // Location of the Selenium grid.
    tunnelOptions: {
      hostname: 'harviewer',
      port: 4444
    },

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
    environments: [],

    // Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
    maxConcurrency: 4,

    functionalSuites: functionalSuites
  };

  var node1 = [{
    browserName: 'firefox',
    version: '45'
  }, {
    browserName: 'internet explorer',
    version: '9'
  }, {
    browserName: 'phantomjs',
    version: '2.0.0'
  }];

  var node2 = [{
    browserName: 'chrome',
    version: '51'
  }, {
    browserName: 'firefox',
    version: '46'
  }, {
    browserName: 'internet explorer',
    version: '11'
  }, {
    browserName: 'phantomjs',
    version: '2.1.1'
  }];


  config.environments = config.environments.concat(node1);
  config.environments = config.environments.concat(node2);

  return lang.mixin({}, base, config);
});
