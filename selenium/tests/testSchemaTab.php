<?php
require_once("HARTestCase.php");

/**
 * Test content of the Schema tab.
 */ 
class HAR_TestSchemaTab extends HAR_TestCase
{
    public function testTab()
    {
        print "\ntestSchemaTab.php";

        $this->open($GLOBALS["harviewer_base"]);
        $this->assertElementContainsText("css=.SchemaTab", "Schema");

        $this->click("css=.SchemaTab");

        // Wait till the schema JS file is loaded.
        $this->waitForCondition(
            "selenium.browserbot.getCurrentWindow().document.querySelectorAll('.dp-highlighter').length > 0",
            10000);
    }
}
?>
