HAR Viewer
==========

* Author: Jan Odvarko, odvarko@gmail.com,
* http://www.softwareishard.com/
* Home page: http://www.janodvarko.cz/har/viewer
* Issue list: http://code.google.com/p/harviewer/issues/list
* Project home: http://code.google.com/p/harviewer/

Components
----------
* Application Components:
* RequireJS: http://requirejs.org/
* jQuery: http://jquery.com/
* jQuery JSON plugin: Jim Dalton (jim.dalton@furrybrains.com), based on http://www.JSON.org/json2.js
* Domplate + Domplate based templates: http://getfirebug.com
* Excanvas: http://code.google.com/p/explorercanvas/
* Downloadify: http://github.com/dcneiner/Downloadify/
* SWFObject 2.0: http://code.google.com/p/swfobject/
* Code Syntax Highlighter: http://www.dreamprojections.com/syntaxhighlighter/
* JSON Query: https://github.com/JasonSmith/jsonquery, http://www.sitepen.com/blog/2008/07/16/jsonquery-data-querying-beyond-jsonpath/

Build Tools
-----------
* js-build-tools: http://code.google.com/p/js-build-tools/
* js-min (ant task): http://code.google.com/p/jsmin-ant-task/
* jsdoc-toolkit: code.google.com/p/jsdoc-toolkit/
* jsdoc-toolkit-ant-task: http://code.google.com/p/jsdoc-toolkit-ant-task/
* shrink-safe: http://shrinksafe.dojotoolkit.org/
* Rhino: http://www.mozilla.org/rhino/

Testing
-------
* Selenium: http://seleniumhq.org/
* PHPUnit: http://www.phpunit.de/

Development
-----------
* Run from source on NodeJS using RequireJS or PINF JavaScript module loader:

  cd dev
  npm install
  npm start
  open http://localhost:8080

* Run from source (PHP) using RequireJS module loader:
  * Build client to `./webapp-build`:

      cd ./webapp/scripts    
      ../../requirejs/build/build.sh app.build.js

  * Mount document root: `./webapp`
  * Open in web browser
