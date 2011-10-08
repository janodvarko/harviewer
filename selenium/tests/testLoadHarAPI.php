<?php
require_once("HARTestCase.php");

/**
 * Check pageTimings fields. Both these fields (onLoad, onContentLoad)
 * are optional and can be omitted.
 */ 
class HAR_TestLoadHarAPI extends HAR_TestCase
{
    public function testViewer()
    {
        print "\nTest loadHAR API in the Viewer";

        // Open customized viewer.
        $this->open($GLOBALS["test_base"]."tests/testLoadHarAPIViewer.html");

        // Wait for 10 sec to load HAR files.
        $this->waitForCondition(
            "selenium.browserbot.getCurrentWindow().document.querySelectorAll('.pageTable').length == 3",
            30000);

        $this->assertElementContainsText("css=.PreviewTab.selected", "Preview");
        $this->assertEquals(3, $this->getCssCount(".pageTable"));
    }

    public function testPreview()
    {
        print "\nTest loadHAR API in the Preview";

        // Open customized preview.
        $this->open($GLOBALS["test_base"]."tests/testLoadHarAPIPreview.html");

        // Wait for 10 sec to load HAR files.
        $this->waitForCondition(
            "selenium.browserbot.getCurrentWindow().document.querySelectorAll('.pageTable').length == 3",
            30000);

        $this->assertEquals(3, $this->getCssCount(".pageTable"));
    }
}
?>
