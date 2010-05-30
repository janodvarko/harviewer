<?php
require_once("HARTestCase.php");

/**
 * Check loading remote HAR file (using JSONP).
 */
class HAR_TestRemoteLoad extends HAR_TestCase
{
    public function testRemoteLoad()
    {
        $this->open($GLOBALS["harviewer_base"]);
    }
}
?>
