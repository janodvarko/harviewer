# Pre-requisites

Install the following software:

- [Node.js](https://docs.npmjs.com/getting-started/installing-node)
- [npm](https://docs.npmjs.com/getting-started/installing-node)
- [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) - **not JRE!**
- [Ant](http://ant.apache.org/)

All of the tests within the `/tests` folder require [Intern](https://github.com/theintern/intern/).

After Node.js and npm have been installed, run the following from the harviewer project root.

    npm install


# Unit tests

Start a web server from the project root, and browse to Intern's "client.html" page. E.g.:

- http://localhost:9999/node_modules/intern/client.html?config=tests/intern-client


# Selenium Tests

The Selenium tests require [Selenium](http://www.seleniumhq.org/download/) and Intern to be installed.

Download Selenium (and the IE/Chrome/Gecko drivers) by running the following Ant command from the project root.

    ant get-selenium


## Selenium Standalone

1) Set your HAR Viewer server base path in `tests/intern-selenium-standalone.js`.  This is where your harviewer app is running.  E.g.:

    harviewer: {
      harViewerBase: 'http://localhost:49001/webapp/',
      testBase: 'http://localhost:49001/selenium/'
    },

2) Go to the selenium directory and run Selenium Standalone using:

    start-server.bat

This command has placeholders for the locations of:

- A specific version of Firefox to use (for compatibility with Selenium).
- The location of IEDriverServer.exe.
- The location of chromedriver.exe.
- The location of phantomjs.exe.

You should change these to match your own file paths, but only `FIREFOX_EXE` and `PHANTOMJS_EXE` should need to change as the driver paths are relative to the `start-server.bat` script.

3) Now go to the harviewer project root directory and run Intern tests (using the **standalone** configuration file):

    node node_modules\intern\bin\intern-runner.js config=tests/intern-selenium-standalone


## Selenium Grid

1) Set your HAR Viewer server base path in `tests/intern-selenium-grid.js`.  This is where your harviewer app is running.  E.g.:

    harviewer: {
      harViewerBase: 'http://harviewer:49001/webapp/',
      testBase: 'http://harviewer:49001/selenium/'
    },

2) Go to the selenium directory and start Selenium as a hub using:

    start-server-hub.bat

3) Start your Selenium nodes and have them connect to the Selenium hub.

4) Now go to the harviewer project root directory and run Intern tests (using the **grid** configuration file):

    node node_modules\intern\bin\intern-runner.js config=tests/intern-selenium-grid


# Compatibility

The following versions have been tested together.

Windows (11 Jun 2015):

- Node 0.12.4.
- Intern 3.0.0.
- Firefox 27.0.2.
- Chrome 44.0.2403.155 m using chromedriver.exe 2.16.
- PhantomJS 2.0.0.
- IE 11 (32bit) using IEDriverServer.exe 2.47.0 (32bit).
- Java 1.8.0_45.
- Ant 1.9.4.
- Selenium 2.47.1.

Windows (23 May 2016):

- Node 6.0.0.
- Intern 3.2.1.
- Firefox 46.0.1.
- Chrome 50.0.2661.102 m using chromedriver.exe 2.21.
- PhantomJS 2.1.1.
- IE 11 (32bit) using IEDriverServer.exe 2.53.1 (32bit).
- Java 1.8.0_92.
- Ant 1.9.7.
- Selenium 2.53.0.
