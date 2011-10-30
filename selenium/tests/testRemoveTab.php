<?php
require_once("HARTestCase.php");

/**
 * Test HAR Viewer API for removing an existing tab.
 */ 
class HAR_TestRemoveTab extends HAR_TestCase
{
    public function testCase()
    {
        print "\ntestRemoveTab.php";

        $this->open($GLOBALS["test_base"]."tests/testRemoveTabIndex.php");
        $this->assertElementExists("css=.HomeTab.selected");
        $this->assertElementExists("css=.PreviewTab");
        $this->assertElementExists("css=.DOMTab");
        $this->assertElementNotExists("css=.AboutTab");
        $this->assertElementNotExists("css=.SchemaTab");
    }
}
?>
