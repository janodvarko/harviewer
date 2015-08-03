Versions tested for compatibility (11 Jun 2015):

Windows:

- Node v0.12.4.
- Intern 2.2.2.
- Firefox 27.0.2.
- Chrome 43.0.2357.124 using chromedriver.exe 2.15.
- PhantomJS 2.0.0.
- IE 11 (32bit) using IEDriverServer.exe 2.45.0 (32bit).
- Java 1.8.0_45.
- Selenium 2.45.0.

Run All Selenium Tests for HAR Viewer:
--------------------------------------
1) Set your HAR viewer server base path in tests/intern.js, e.g.:

    harviewer: {
      harViewerBase: 'http://192.168.59.103:8000/webapp/',
      testBase: 'http://192.168.59.103:8000/selenium/'
    },

2) Go to the selenium directory and run Selenium using:

    start-server.bat

This command has placeholders for the locations of:

- A specific version of Firefox to use (for compatibility with Selenium).
- The location of IEDriverServer.exe.
- The location of chromedriver.exe.

If PhantomJS is also to be used as a target browser, then make sure phantomjs.exe is on the PATH.

3) Now go to the harviewer project root directory and run Intern tests:

    npm test
