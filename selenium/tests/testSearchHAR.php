<?php
require_once("HARTestCase.php");

/**
 * Check search feature on the HAR tab.
 */ 
class HAR_TestSearchHAR extends HAR_TestCase
{
    public function testPhases()
    {
        print "\ntestSearchHAR.php";

        $viewer_base = $GLOBALS["harviewer_base"];
        $test_base = $GLOBALS["test_base"];

        $url = $viewer_base."?path=".$test_base."tests/hars/searchHAR.har";
        $this->open($url);

        // Select the DOM tab
        $this->click("css=.DOMTab");
        $this->assertElementExists("css=.DOMTab.selected");

        // Type text into the search field and press enter.
        // From some reason the viewer doesn't receive "keyDown" events so, incremental
        // search isn't tested.
        $this->focus("css=.tabDOMBody .searchInput");
        $this->keyPress("css=.tabDOMBody .searchInput", "f");
        $this->keyPress("css=.tabDOMBody .searchInput", "i");
        $this->keyPress("css=.tabDOMBody .searchInput", "r");
        $this->keyPress("css=.tabDOMBody .searchInput", "e");
        $this->keyDown("css=.tabDOMBody .searchInput", "\\13");

        // Check selection on the page.
        $this->waitForCondition(
            "selenium.browserbot.getCurrentWindow().getSelection().toString() == 'Fire'",
            10000);
   }
}
?>
