# Pre-requisites

Install the following software:

- [Node.js](https://docs.npmjs.com/getting-started/installing-node)
- [npm](https://docs.npmjs.com/getting-started/installing-node)
- [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) - **not JRE!**

All of the tests within the `/tests` folder require [Intern](https://github.com/theintern/intern/).

After Node.js and npm have been installed, run the following from the harviewer project root.

    npm install


# Unit tests

Start a web server from the project root, and browse to Intern's "client.html" page. E.g.:

- http://localhost:9999/node_modules/intern/client.html?config=tests/intern-client


# Selenium Tests

The Selenium tests require [Selenium](http://www.seleniumhq.org/download/) and Intern to be installed.

Download Selenium (and the IE/Chrome/Gecko drivers) by running the following command from the project root.

    npm run selenium:install


## Selenium Standalone

1) Set your HAR Viewer server base path in `tests/intern-selenium-standalone.js`.  This is where your harviewer app is running.  E.g.:

```
    harviewer: {
      harViewerBase: 'http://localhost:49001/webapp/',
      testBase: 'http://localhost:49001/selenium/'
    },
```

2a) From the project root run the command:

    npm run selenium:start

or

2b) Go to the selenium directory and run Selenium Standalone using:

    start-server.bat

This command has placeholders for the locations of:

- A specific version of Firefox to use (for compatibility with Selenium).
- The location of IEDriverServer.exe.
- The location of chromedriver.exe.
- The location of phantomjs.exe.

You should change these to match your own file paths, but only `FIREFOX_EXE` and `PHANTOMJS_EXE` should need to change as the driver paths are relative to the `start-server.bat` script.

3) Now go to the harviewer project root directory and run Intern tests (using the **standalone** configuration file):

    npm run test-standalone


## Selenium Grid

1) Set your HAR Viewer server base path in `tests/intern-selenium-grid.js`.  This is where your harviewer app is running.  E.g.:

```
    harviewer: {
      harViewerBase: 'http://harviewer:49001/webapp/',
      testBase: 'http://harviewer:49001/selenium/'
    },
```

2) Go to the selenium directory and start Selenium as a hub using:

    start-server-hub.bat

3) Start your Selenium nodes and have them connect to the Selenium hub.

4) Now go to the harviewer project root directory and run Intern tests (using the **grid** configuration file):

    npm run test-grid


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
