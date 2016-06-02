/**
 * This is sample Intern config to use with the Intern client.html runner.
 *
 * This config is used by opening the following URL (replace host/port as
 * appropriate to your environment):
 *
 * http://harviewer:49002/node_modules/intern/client.html?config=tests/intern-client
 */
define([
  './intern',
], function(base) {
  base.reporters = ['Html'];
  return base;
});
