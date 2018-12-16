# Pre-requisites

Install the following software:

- [Node.js](https://docs.npmjs.com/getting-started/installing-node)
- [npm](https://docs.npmjs.com/getting-started/installing-node)
- [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) - **not JRE!**

All of the tests within the `/tests` folder require [Intern](https://github.com/theintern/intern/).

After Node.js and npm have been installed, run the following from the HAR Viewer project root.

    npm install

Before running the functional tests, you must start the built-in [`express`](https://expressjs.com/) server to serve HAR Viewer and its functional test resources:

    npm start

# Unit tests

The unit tests can be run from the command line or in a browser.

**Command line:**

Run `npm test` or `npm run test:unit` from the command line. Both will run the unit tests.

**Browser:**

Start a web server from the project root, and browse to Intern's client testing home page. E.g.:

- http://localhost:49001/node_modules/intern/


# Functional Tests

The functional tests require [Selenium](http://www.seleniumhq.org/download/) to be installed.

For installing and running Selenium, there are three options:
- Let Intern take care of it - easiest.
- Use [selenium-standalone](https://github.com/vvo/selenium-standalone) - easy.
- Install/run Selenium manually - hardest.

## Let Intern take care of it

If you use the `"tunnel": "selenium"` option in the [intern.json](intern.json) file, then Intern will automatically download Selenium server and browser drivers based on your `"tunnelOptions"` settings. This is the default testing scenario.

## Use selenium-standalone

Download Selenium (and the IE/Chrome/Gecko drivers) by running the following command from the project root.

    npm run selenium:install

This command will use the settings provided in the [selenium-standalone-config.js](selenium-standalone-config.js) file to determine which Selenium server and browser drivers are downloaded. These settings are similar to those used in the `"tunnelOptions"` value mentioned in the previous section.

From the project root run the command:

    npm run selenium:start

In order to prevent Intern from starting a Selenium server, we need to use the `null` tunnel. Either set the `"tunnel"` value to `"null"` in the [intern.json](intern.json) file, or pass the tunnel value at the command line (see below).

Now go to the HAR Viewer project root directory and run Intern tests (using the **standalone** configuration file):

    npm run test:all    (when null tunnel has been set in intern.json)

or

    npm run test:all tunnel=null    (to override tunnel value in intern.json)


## Install/run Selenium manually

Installing and running a Selenkum server manually is outside the scope of this README. But once you have a server set up, ensure Intern is using the `"null"` tunnel when you run the tests, as in the previous section.


# Compatibility

The following versions have been tested together:

- Int - Intern
- FF - Firefox
- GecD - Gecko driver
- Chr - Chrome
- ChrD - Chrome driver
- PhJS - PhantomJS
- IED - IEDriverServer
- MWD - MicrosoftWebDriver
- Sel - Selenium
- 32b/64b - 32 bit/64 bit
- dnt - did not test
- n/a - not applicable (e.g. not/no-longer part of the build/test process, browser/driver deprecated, etc)

Date | O/S | Node | Int | FF | GecD | Chr | ChrD | PhJS | IE | IED | Edge | MWD | Java | Ant | Sel
---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---
11/06 2015 | Win 7 | 0.12.4 | 3.0.0 | 27.0.2 | n/a | 44.0 | 2.16 | 2.0.0 | 11 (32b) | 2.47.0 (32b) | dnt | dnt | 1.8.0_45 | 1.9.4 | 2.47.1 |
23/05 2016 | Win 7 | 6.0.0 | 3.2.1 | 46.0.1 | n/a | 50.0 | 2.21 | 2.1.1 | 11 (32b) | 2.53.1 (32b) | dnt | dnt | 1.8.0_92 | 1.9.7 | 2.53.0
14/06 2017 | Win 10 | 7.10.0 | 3.4.5 | 54 | n/a | 59.0 | 2.30 | dnt | 11 (32b) | 3.4.0 (32b) | dnt | dnt | 1.8.0_131 | n/a | 3.4.0
28/05 2018 | Win 10 | 10.2.1 | 3.4.6 | 60.0.1 | 0.20.1 | 66.0 | 2.37 | dnt | 11 (32b) | 3.4.0 (32b) | dnt | dnt | 1.8.0_151 | n/a | 3.4.0
21/06 2018 | Win 10 | 10.3.0 | 4.2.0 | 60.0.2 | 0.20.1 | 67.0 (64b) | 2.40 | dnt | 11 (32b) | 3.4.0 (32b) | 42.17134 17.17134 | 17134 | 1.8.0_151 | n/a | 3.12.0
16/12 2018 | Win 10 | 11.3.0 | 4.2.4 | 64.0 | 0.21.0 | 71.0 (64b) | 2.45 | dnt | 11 (32b) | 3.4.0 (32b) | dnt | dnt  | 1.8.0_171 | n/a | 3.141.59
