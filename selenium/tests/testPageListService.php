<?php
require_once("HARTestCase.php");

/**
 * Check pageList service (embedded within a page).
 */ 
class HAR_TestPageListService extends HAR_TestCase
{
    public function testPageListService()
    {
        print "\nTestPageListService()";

        $this->open($GLOBALS["test_base"]."tests/testPageListService.html");
        $this->assertElementExists("id=pageList");

        // Click on the example link
        $this->clickAndWait("id=loadButton");

        // Check that HAR file is properly loaded.
        $this->assertElementContainsText("css=.pageName", "Simple Page");
        $this->assertElementContainsText("css=.netRow", "GET Issue601.htm");
    }
}
?>
