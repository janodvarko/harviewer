<?php
require_once("test1.php");
require_once("testExamples.php");
require_once("testPageListService.php");
require_once("testPreviewSource.php");
require_once("testRemoteLoad.php");
require_once("testLoadMultipleFiles.php");
require_once("testNoPageLog.php");

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
