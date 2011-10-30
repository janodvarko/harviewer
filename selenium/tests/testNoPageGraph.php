<?php
require_once("HARTestCase.php");

/**
 * Test HAR file with entries that don't have a parent page.
 */
class HAR_TestNoPageGraph extends HAR_TestCase
{
    public function testCase()
    {
        print "\ntestNoPageGraph.php";

        $viewer_base = $GLOBALS["harviewer_base"];
        $test_base = $GLOBALS["test_base"];

        // Put together URL with a default file, e.g:
        $url = $viewer_base."?path=".$test_base."tests/hars/noPages.har";
        $this->open($url);

        $this->waitForCondition("selenium.browserbot.getCurrentWindow().".
            "document.querySelectorAll('.PreviewTab.selected').length > 0",
            10000);

        // Make sure we are in the Preview tab.
        $this->assertElementContainsText("css=.PreviewTab.selected", "Preview");

        // There must be 87 requests entries.
        $this->assertEquals(87, $this->getCssCount(
            ".netRow.loaded.isExpandable .netReceivingBar"));

        // Check position on the waterfall graph
        $script = "var bars = window.document.querySelectorAll('.netRow.loaded.isExpandable .netReceivingBar');";
        $script .= "(parseInt(bars[0].style.width) > 0) && ";
        $script .= "(parseInt(bars[1].style.width) > 0) && ";
        $script .= "(parseInt(bars[2].style.width) > 0)";

        // Evaluate in the page, must return "true".
        $this->assertEquals("true", $this->getEval($script));
    }
}
?>
