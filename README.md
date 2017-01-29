Stable URL (v2.0.17, 21 March 2016) - http://www.softwareishard.com/har/viewer/

Up-to-date master - http://gitgrimbo.github.io/harviewer/master/ (and [https](https://gitgrimbo.github.io/harviewer/master/))

# HAR Viewer

* Author: Jan Odvarko, odvarko@gmail.com
* http://www.softwareishard.com/
* Issue list: https://github.com/janodvarko/harviewer/issues
* Project home: https://github.com/janodvarko/harviewer

## License

HAR Viewer is free and open source software distributed under the [BSD License](https://github.com/janodvarko/harviewer/blob/master/webapp/license.txt).

## Components

* Application Components:
* RequireJS: http://requirejs.org/
* jQuery: http://jquery.com/
* jQuery JSON plugin: Jim Dalton (jim.dalton@furrybrains.com), based on http://www.JSON.org/json2.js
* Domplate + Domplate based templates: http://getfirebug.com
* Downloadify: http://github.com/dcneiner/Downloadify/
* SWFObject 2.0: http://code.google.com/p/swfobject/
* Code Syntax Highlighter: http://alexgorbatchev.com/SyntaxHighlighter/
* JSON Query: https://github.com/JasonSmith/jsonquery, http://www.sitepen.com/blog/2008/07/16/jsonquery-data-querying-beyond-jsonpath/

## Build Tools

* Java 8 (for [Nashorn/jjs](http://docs.oracle.com/javase/8/docs/technotes/tools/windows/jjs.html) build)
* Ant: http://ant.apache.org/
* JSDoc: http://usejsdoc.org/
* Rhino: http://www.mozilla.org/rhino/
* Node.js: https://nodejs.org/
* ESLint: http://eslint.org/

## Testing

* Selenium: http://seleniumhq.org/
* Intern: https://theintern.github.io/ (preferred, see [tests](tests/))
* PHPUnit: http://www.phpunit.de/ (deprecated, see [tests](selenium/tests))

## Development

### Linting

HAR Viewer uses [ESLint](http://eslint.org/) for linting.  It will be installed when you run `npm install` from the project root.

To show lint errors only:

    npm run eslint

To show lint errors and warnings:

    npm run eslint-full

### Build

The HAR Viewer build process uses `Ant`, `Node.js` and `npm` as its build tools.  To see a list of available tasks, use `ant -p` at the command line.

Firstly, run `npm install` from the command line to install the `Node.js`/`npm` dependencies.

Now a build can be performed in one of three ways.

#### 1) Node.js

This is the default and preferred method. To start a build, go to the project directory and execute the following command:

`ant build`

(*Indicative build time - about 9 seconds.  Node.js v6.0.0*)

#### 2) Java 8 with Nashorn

To build using the [jjs](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/jjs.html) command, Java 8 must be installed.
Execute the following command:

`ant -Drjs.runner=nashorn build`

(*Indicative build time - about 1 minute 37 seconds.  nashorn 1.8.0_92*)

#### 3) Pre-Java 8 with Rhino

To build using Java 7 or earlier, execute the following command:

`ant -Drjs.runner=java build`

You will have to set the [optimize build configuration value](https://github.com/janodvarko/harviewer/blob/0997957b3ecb9fbdb27df4260d5bc85c653fac81/webapp/scripts/app.build.js#L11) to `"closure"`, for example:

    optimize: "closure",

(*Indicative build time - about 42 seconds*)

#### Version and Google Analytics

Certain build properties can be overridden at the command line.  For example, to provide the `VERSION` and `GOOGLE-ANALYTICS-PROFILE` values:

`ant build -DVERSION=3.0.0 -DGOOGLE-ANALYTICS-PROFILE=TRACKING_ID_HERE`
