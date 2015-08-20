<?php 
# don't forget the trailing slash
$harviewer_base = "http://legoas/src/github.com/janodvarko/harviewer/webapp-build/";
$test_base = "http://legoas/src/github.com/janodvarko/harviewer/selenium/";

# For Selenium grid testing, the Selenium nodes must be able to access a
# HAR Viewer server called "harviewer" on port "49001".

# This host can be mapped in the node's hosts file.

# Or change "http://harviewer" below to "http://a.b.c.d" where "a.b.c.d" is the
# IP address of the HAR Viewer server.

# Or change "http://harviewer" to "http://localhost" to run Selenium
# in standalone mode (not grid).

#$harviewer_base = "http://harviewer:49001/webapp/";
#$test_base = "http://harviewer:49001/selenium/";
?>