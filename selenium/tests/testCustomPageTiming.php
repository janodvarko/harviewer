<?php
require_once("HARTestCase.php");

/**
 * Test HAR Viewer API for custom page timings.
 */ 
class HAR_TestCustomPageTiming extends HAR_TestCase
{
    public function testCase()
    {
        print "\ntestCustomPageTiming.php";

        $viewerURL = $GLOBALS["test_base"]."tests/testCustomPageTimingIndex.php";
        $harFileURL = $GLOBALS["test_base"]."tests/testCustomPageTiming.har";
        $this->open($viewerURL."?path=".$harFileURL);

        $this->waitForCondition(
            "selenium.browserbot.getCurrentWindow().document.querySelectorAll('.onMyEventBar.netPageTimingBar.netBar').length == 4",
            10000);

        // xxxHonza: remove the trailing and begin space in the class attribute (domplate).
        $this->assertEquals(4, $this->getXpathCount("//div[@class=' onMyEventBar  netPageTimingBar netBar ']"));
    }
}
?>
