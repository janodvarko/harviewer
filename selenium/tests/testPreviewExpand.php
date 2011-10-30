<?php
require_once("HARTestCase.php");

/**
 * Verify automatic expanding of pages.
 */ 
class HAR_TestPreviewExpand extends HAR_TestCase
{
    public function testExpandSinglePage()
    {
        print "\ntestPreviewExpand.php (1)";

        // HAR file is specified inside the test page.
        $viewerURL = $GLOBALS["test_base"]."tests/testPreviewExpand.html";
        $harFileURL = $GLOBALS["test_base"]."tests/hars/preview-expand.har";
        $this->open($viewerURL."?path=".$harFileURL);

        $this->waitForElement(".pageRow.opened");
    }

    public function testExpandMultiplePages()
    {
        print "\ntestPreviewExpand.php (2)";

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
        print "\ntestPreviewExpand.php (3)";

        // HAR file is specified inside the test page.
        $viewerURL = $GLOBALS["test_base"]."tests/testPreviewExpand.html";
        $harFileURL = $GLOBALS["test_base"]."tests/hars/multiple-pages.har";
        $this->open($viewerURL."?path=".$harFileURL."&expand=true");

        $this->waitForElement(".pageTable");

        $this->assertEquals(3, $this->getCssCount(".pageRow.opened"));
    }
}
?>
