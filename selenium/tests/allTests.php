<?php
require_once("test1.php");
require_once("testExamples.php");
require_once("testPageListService.php");
require_once("testPreviewSource.php");
require_once("testRemoteLoad.php");
require_once("testLoadMultipleFiles.php");
require_once("testNoPageLog.php");
require_once("testPageTimings.php");
require_once("testSchemaTab.php");
require_once("testRequestBody.php");
require_once("testRemoveTab.php");
require_once("testHideTabBar.php");
require_once("testShowStatsAndTimeline.php");
require_once("testCustomPageTiming.php");
require_once("testRemoveToolbarButton.php");
require_once("testTimeStamps.php");
require_once("testPhases.php");
require_once("testLoadHarAPI.php");

class AllTests extends PHPUnit_Framework_TestSuite
{
    public static function suite()
    {
        $suite = new AllTests();

        // Append all HAR Viewer tests into the suite.
        $suite->addTestSuite("HAR_Test1");
        $suite->addTestSuite("HAR_TestExamples");
        $suite->addTestSuite("HAR_TestPageListService");
        $suite->addTestSuite("HAR_TestPreviewSource");
        $suite->addTestSuite("HAR_TestRemoteLoad");
        $suite->addTestSuite("HAR_TestLoadMultipleFiles");
        $suite->addTestSuite("HAR_TestNoPageLog");
        $suite->addTestSuite("HAR_TestPageTimings");
        $suite->addTestSuite("HAR_TestSchemaTab");
        $suite->addTestSuite("HAR_TestRequestBody");
        $suite->addTestSuite("HAR_TestRemoveTab");
        $suite->addTestSuite("HAR_TestHideTabBar");
        $suite->addTestSuite("HAR_TestShowStatsAndTimeline");
        $suite->addTestSuite("HAR_TestCustomPageTiming");
        $suite->addTestSuite("HAR_TestRemoveToolbarButton");
        $suite->addTestSuite("HAR_TestTimeStamps");
        $suite->addTestSuite("HAR_TestPhases");
        $suite->addTestSuite("HAR_TestLoadHarAPI");

        return $suite;
    }

    protected function setUp()
    {
        print "\nHAR Tests::setUp()";
    }

    protected function tearDown()
    {
        print "\nHAR Tests::tearDown()";
    }
}?>
