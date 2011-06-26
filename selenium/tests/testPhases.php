<?php
require_once("HARTestCase.php");

/**
 * Check network phases (request groups)
 */ 
class HAR_TestPhases extends HAR_TestCase
{
    public function testPhases()
    {
        print "\nTest phases";

        $viewer_base = $GLOBALS["harviewer_base"];
        $test_base = $GLOBALS["test_base"];

        $url = $viewer_base."?path=".$test_base."tests/hars/three-phases.har";
        $this->open($url);

        // There must be 3 phases in the waterfall graph and so, the layour broken two times.
        $this->assertEquals(2, $this->getCssCount(".netRow.loaded[breakLayout=\"true\"]"));
    }
}
?>
