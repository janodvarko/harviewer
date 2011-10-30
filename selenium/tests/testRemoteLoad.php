<?php
require_once("HARTestCase.php");

/**
 * Check loading remote HAR file (using JSONP).
 */
class HAR_TestRemoteLoad extends HAR_TestCase
{
    public function testRemoteLoad()
    {
        print "\ntestRemoteLoad.php";

        $base = $GLOBALS["harviewer_base"];
        $this->open($base."?inputUrl=".$base."examples/inline-scripts-block.harp");

        $this->assertElementContainsText("css=.PreviewTab.selected", "Preview");
    }
}
?>
