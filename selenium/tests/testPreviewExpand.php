<?php
require_once("HARTestCase.php");

/**
 * Verify automatic expanding of pages.
 */ 
class HAR_TestPreviewExpand extends HAR_TestCase
{
    public function testExpandSinglePage()
    {
        print "\nTest expand in preview (single page)";

        // HAR file is specified inside the test page.
        $viewerURL = $GLOBALS["test_base"]."tests/testPreviewExpand.html";
        $harFileURL = $GLOBALS["test_base"]."tests/hars/preview-expand.har";
        $this->open($viewerURL."?path=".$harFileURL);

        $this->waitForElement(".pageRow.opened");
    }

    public function testExpandMultiplePages()
    {
        print "\nTest expand in preview (multiple pages)";

        // HAR file is specified inside the test page.
        $viewerURL = $GLOBALS["test_base"]."tests/testPreviewExpand.html";
        $harFileURL = $GLOBALS["test_base"]."tests/hars/multiple-pages.har";
        $this->open($viewerURL."?path=".$harFileURL);

        $this->waitForElement(".pageTable");

        $this->assertEquals(3, $this->getCssCount(".pageRow"));
        $this->assertEquals(0, $this->getCssCount(".pageRow.opened"));
    }

    public function testExpandByDefault()
    {
        print "\nTest default expand in preview (URL expand parameter)";

        // HAR file is specified inside the test page.
        $viewerURL = $GLOBALS["test_base"]."tests/testPreviewExpand.html";
        $harFileURL = $GLOBALS["test_base"]."tests/hars/multiple-pages.har";
        $this->open($viewerURL."?path=".$harFileURL."&expand=true");

        $this->waitForElement(".pageTable");

        $this->assertEquals(3, $this->getCssCount(".pageRow.opened"));
    }
}
?>
