<?php
require_once("HARTestCase.php");

/**
 * Click on all four HAR log examples and verify they are properly displayed.
 */
class HAR_TestExamples extends HAR_TestCase
{
    public function testExamples()
    {
        $this->loadAndVerify("example1", "CuzillionCuzillion");
        $this->loadAndVerify("example2", "CuzillionCuzillion");
        $this->loadAndVerify("example3", "Software is hard | More musings on software developmentSoftware is hard | More musings on software developmentSoftware is hard | More musings on software development");
        $this->loadAndVerify("example4", "Google");
    }

    protected function loadAndVerify($exampleId, $expected)
    {
        print "\nTestExample1::".$exampleId;

        $this->open($GLOBALS["harviewer_base"]);

        $this->assertElementExists("id=".$exampleId);

        // Click on the example link
        $this->clickAndWait("id=".$exampleId);

        // The Preview tab must be selected and example HAR file loaded.
        $this->assertElementContainsText("css=.PreviewTab.selected", "Preview");
        $this->assertElementContainsText("css=.pageList", $expected);
    }
}
?>
