HAR Viewer
==========

* Author: Jan Odvarko, odvarko@gmail.com,
* http://www.softwareishard.com/
* Home page: http://www.janodvarko.cz/har/viewer
* Issue list: https://github.com/janodvarko/harviewer/issues
* Project home: https://github.com/janodvarko/harviewer

License
-------
HAR Viewer is free and open source software distributed under the [BSD License](https://github.com/janodvarko/harviewer/blob/master/webapp/license.txt).

Components
----------
* Application Components:
* RequireJS: http://requirejs.org/
* jQuery: http://jquery.com/
* jQuery JSON plugin: Jim Dalton (jim.dalton@furrybrains.com), based on http://www.JSON.org/json2.js
* Domplate + Domplate based templates: http://getfirebug.com
* Downloadify: http://github.com/dcneiner/Downloadify/
* SWFObject 2.0: http://code.google.com/p/swfobject/
* Code Syntax Highlighter: http://www.dreamprojections.com/syntaxhighlighter/
* JSON Query: https://github.com/JasonSmith/jsonquery, http://www.sitepen.com/blog/2008/07/16/jsonquery-data-querying-beyond-jsonpath/

Build Tools
-----------
* Java 8 (for [Nashorn/jjs](http://docs.oracle.com/javase/8/docs/technotes/tools/windows/jjs.html) build)
* Ant: http://ant.apache.org/
* js-build-tools: http://code.google.com/p/js-build-tools/
* js-min (ant task): http://code.google.com/p/jsmin-ant-task/
* JSDoc: http://usejsdoc.org/
* Rhino: http://www.mozilla.org/rhino/
* Node.js: https://nodejs.org/

Testing
-------
* Selenium: http://seleniumhq.org/
* Intern: https://theintern.github.io/ (preferred, see [tests](tests/))
* PHPUnit: http://www.phpunit.de/ (deprecated, see [tests](selenium/tests))

Development
-----------

A build can be performed in one of three ways.

### 1) Node.js

This is the default and preferred method.  Node.js must be installed.
To start a build, go to the project directory and execute the following command:

`ant build`

(*Indicative build time - about 9 seconds.  Node.js v6.0.0*)

### 2) Java 8 / Nashorn

To build using the [jjs](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/jjs.html) command, Java 8 must be installed.
Execute the following command:

`ant -Drjs.runner=nashorn build`

(*Indicative build time - about 1 minute 37 seconds.  nashorn 1.8.0_92*)

### 3) Pre-Java 8 / Rhino

To build using Java 7 or earlier, execute the following command:

`ant -Drjs.runner=java build`

You will have to set the [optimize build configuration value](https://github.com/janodvarko/harviewer/blob/0997957b3ecb9fbdb27df4260d5bc85c653fac81/webapp/scripts/app.build.js#L11) to `"closure"`, for example:

     optimize: "closure",

(*Indicative build time - about 42 seconds*)
