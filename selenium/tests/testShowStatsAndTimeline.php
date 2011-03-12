<?php
require_once("HARTestCase.php");

/**
 * Test API for showing page timeline and statistics by default.
 */ 
class HAR_TestShowStatsAndTimeline extends HAR_TestCase
{
    public function testCase()
    {
        print "\nShow pagee timeline and statistics by default";

        $viewerURL = $GLOBALS["test_base"]."tests/testShowStatsAndTimelineIndex.php";
        $harFileURL = $GLOBALS["test_base"]."tests/simple-page-load.har";
        $this->open($viewerURL."?path=".$harFileURL);

        $this->assertElementContainsText("css=.PreviewTab.selected", "Preview");
        $this->assertElementExists("css=.pageTimelineBody.opened");
        $this->assertElementExists("css=.pageStatsBody.opened");
    }
}
?>
