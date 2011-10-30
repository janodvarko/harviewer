<?php
require_once("HARTestCase.php");

/**
 * Test HAR Viewer API for removing an existing tab.
 */ 
class HAR_TestRemoveToolbarButton extends HAR_TestCase
{
    public function testCase()
    {
        print "\ntestRemoveToolbarButton.php";

        $this->open($GLOBALS["test_base"]."tests/testRemoveToolbarButtonIndex.php");
    }
}
?>
