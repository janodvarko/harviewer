Firebug API Reference 
Jan Odvarko <odvarko@gmail.com>

---------------------------------------------------------------------------------------------------

Support for generating API Reference documentation from Firebug source files.

- Result docs (set of HTML Files) is generated using jsdoc-toolkit:
http://code.google.com/p/jsdoc-toolkit/

- Integration with ANT is done using jsdoc-toolkit-ant-task:
http://code.google.com/p/jsdoc-toolkit-ant-task/

---------------------------------------------------------------------------------------------------

Instructions:
- Use build.xml to generate API documentation from Firebug source files.
- Run "ant jsdoc" on the command line (within $svn/branches/firebug1.5/ directory)
- See output HTML files within $svn/jsdoc/out
- You can also use simple-build.xml and run: $ant -f simple-build.xml jsdoc
  In this case the output will be saved into ./release/jsdoc

Development:
- Firebug uses its own template for generating result HTML
See: ./jsdoc-toolkit-2.3.0/templates/firebug
directory 

- Firebug uses its own plugin for customizing the generation process.
See: ./jsdoc-toolkit-2.3.0/app/plugins/firebug.js 

