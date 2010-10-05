<?php
require_once("HARTestCase.php");

/**
 * Test HAR file with entries that don't have a parent page.
 */
class HAR_TestNoPageLog extends HAR_TestCase
{
    public function testEntriesWithNoParentPage()
    {
        print "\nTest HAR log without pages";

        $viewer_base = $GLOBALS["harviewer_base"];
        $test_base = $GLOBALS["test_base"];

        // Put together URL with a default file, e.g:
        // http://legoas/har/viewer/?path=http://legoas/har/viewer/selenium/tests/hars/testNoPageLog.har
        $url = $viewer_base."?path=".$test_base."tests/hars/testNoPageLog.har";
        $this->open($url);

        $this->assertElementContainsText("css=.PreviewTab.selected", "Preview");
        $this->assertElementContainsText("css=.previewList", "GET test.txt");
    }
}
?>
