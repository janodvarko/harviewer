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
To start a build, go to the project directory and execute the following command:

`ant build`

This default build requires Node.js to be installed (the preferred option).

For a Java-only build (not the preferred option), execute the following command:

`ant -Drjs.runner=java build`
