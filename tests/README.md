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

The following versions have been tested together.

Windows 7 (11 Jun 2015):

- Node 0.12.4.
- Intern 3.0.0.
- Firefox 27.0.2.
- Chrome 44.0.2403.155 m using chromedriver.exe 2.16.
- PhantomJS 2.0.0.
- IE 11 (32bit) using IEDriverServer.exe 2.47.0 (32bit).
- Java 1.8.0_45.
- Ant 1.9.4.
- Selenium 2.47.1.

Windows 7 (23 May 2016):

- Node 6.0.0.
- Intern 3.2.1.
- Firefox 46.0.1.
- Chrome 50.0.2661.102 m using chromedriver.exe 2.21.
- PhantomJS 2.1.1.
- IE 11 (32bit) using IEDriverServer.exe 2.53.1 (32bit).
- Java 1.8.0_92.
- Ant 1.9.7.
- Selenium 2.53.0.

Windows 10 (14 June 2017)

- Node 7.10.0.
- Intern 3.4.5.
- Firefox 54.
- Chrome 59.0.3071.86 using chromedriver.exe 2.30.
- IE 11 (32bit) using IEDriverServer.exe 3.4.0 (32bit).
- Java 1.8.0_131.
- Selenium 3.4.0.

Windows 10 (28 May 2018)

- Node 10.2.1.
- Intern 3.4.6.
- Firefox 60.0.1 using geckodriver 0.20.1.
- Chrome 66.0.3359.181 using chromedriver.exe 2.37.
- IE 11 (32bit) using IEDriverServer.exe 3.4.0 (32bit).
- Java 1.8.0_151.
- Selenium 3.4.0.

Windows 10 (21 Jun 2018)

- Node 10.3.0.
- Intern 4.2.0.
- Firefox 60.0.2 using geckodriver 0.20.1.
- Chrome 67.0.3396.87 (Official Build) (64-bit) using chromedriver.exe 2.40.
- IE 11 (32bit) using IEDriverServer.exe 3.4.0 (32bit).
- Edge 42.17134.1.0/17.17134 using MicrosoftWebDriver.exe 17134.
- Java 1.8.0_151.
- Selenium 3.12.0.
