Author: Jan Odvarko, odvarko@gmail.com, http://www.softwareishard.com/
Home page: http://www.janodvarko.cz/har/viewer
Issue list: http://code.google.com/p/harviewer/issues/list

Selenium Requirements
---------------------
* PHPUnit 3.0 http://www.phpunit.de
* Selenium http://pear.php.net/
* Java 5 (1.5.0) is needed for Selenium RC http://java.sun.com
* Selenium Remote Control (RC) http://openqa.org/


Run All Selenium Tests for HAR Viewer
-------------------------------------

1) Set your HAR viewer server base path in config.php, e.g.:
$harviewer_base = "http://legoas/har/viewer/";

HAR Viewer must be installed on your server in /har/viewer/ directory, e.g:
http://<your-domain>/har/viewer/

2) Run Selenium using:
selenium/start-server.bat

3) Run PHP tests:
selenium/tests/phpunit allTests.php
