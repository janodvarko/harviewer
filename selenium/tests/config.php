<?php 
# don't forget the trailing slash
#$harviewer_base = "http://legoas/src/github.com/janodvarko/harviewer/webapp-build/";
#$test_base = "http://legoas/src/github.com/janodvarko/harviewer/selenium/";

# For Selenium grid testing, the Selenium nodes must be able to access a
# HAR Viewer server called "harviewer.lan" on port "49001".

# This host can be mapped in the node's hosts file.

# Or change "http://harviewer.lan" below to "http://a.b.c.d" where "a.b.c.d" is the
# IP address of the HAR Viewer server.

# Or change "http://harviewer.lan" to "http://localhost" if preferred.

# We use the .lan suffix in this example to appease Microsoft Edge - Edge doesn't like
# browsing to a single-word local hostname. See:
# https://social.technet.microsoft.com/Forums/en-US/246298d8-52c1-4440-8d7f-05329d50e653/edge-browser-hosts-file?forum=win10itprogeneral

$harviewer_base = "http://harviewer.lan:49001/webapp/";
$test_base = "http://harviewer.lan:49001/selenium/";
?>
