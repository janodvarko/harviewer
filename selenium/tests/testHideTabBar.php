<?php
require_once("HARTestCase.php");

/**
 * Test API for hiding the application tab bar.
 */ 
class HAR_TestHideTabBar extends HAR_TestCase
{
    public function testTab()
    {
        print "\nHAR Remove a tab";

        $this->open($GLOBALS["test_base"]."tests/testHideTabBarIndex.php");
        $this->assertElementExists("css=.harView[hideTabBar='true']");
    }
}
?>
