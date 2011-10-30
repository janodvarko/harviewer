<?php
require_once("HARTestCase.php");

/**
 * Check pageTimings fields. Both these fields (onLoad, onContentLoad)
 * are optional and can be omitted.
 */ 
class HAR_TestPageTimings extends HAR_TestCase
{
    public function testPageTimings()
    {
        print "\ntestPageTimings.php";

        $viewer_base = $GLOBALS["harviewer_base"];
        $test_base = $GLOBALS["test_base"];

        // Put together URL that specifies a test HAR file to load.
        // Example of the result URL:
        // http://legoas/har/viewer/?path=http://legoas/har/viewer/selenium/tests/hars/noPageTimings.har
        $url = $viewer_base."?path=".$test_base."tests/hars/noPageTimings.har";
        $this->open($url);

        // The Preview tab must be selected and example HAR file loaded.
        $this->assertElementContainsText("css=.PreviewTab.selected", "Preview");
        $this->assertElementContainsText("css=.pageName", "http://127.0.0.1:1235/slow-css.html");
    }
}
?>
