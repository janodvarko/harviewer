Versions tested for compatibility (11 Jun 2015):

Windows:

- Node v0.12.4.
- Intern 3.0.0.
- Firefox 27.0.2.
- Chrome 44.0.2403.155 m using chromedriver.exe 2.16.
- PhantomJS 2.0.0.
- IE 11 (32bit) using IEDriverServer.exe 2.47.0 (32bit).
- Java 1.8.0_45.
- Selenium 2.47.1.





Run unit tests
--------------

Start a web server from the project root, and browse to the "client.html" page. E.g.:

http://localhost:9999/node_modules/intern/client.html?config=tests/intern





HAR Viewer tests - Selenium Standalone
--------------------------------------
1) Set your HAR Viewer server base path in tests/intern-selenium-standalone.js, e.g.:

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

3) Now go to the harviewer project root directory and run Intern tests:

    node node_modules\intern\bin\intern-runner.js config=tests/intern-selenium-standalone





HAR Viewer tests - Selenium grid
--------------------------------

1) Set your HAR Viewer server base path in tests/intern-selenium-grid.js, e.g.:

    harviewer: {
      harViewerBase: 'http://harviewer:49001/webapp/',
      testBase: 'http://harviewer:49001/selenium/'
    },

2) Go to the selenium directory and run Selenium Hub using:

    start-server-hub.bat

3) Start your Selenium nodes.

4) Now go to the harviewer project root directory and run Intern tests:

    node node_modules\intern\bin\intern-runner.js config=tests/intern-selenium-grid
