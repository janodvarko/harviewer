<?php
require_once("test1.php");
require_once("testExamples.php");
require_once("testPageListService.php");
require_once("testPreviewSource.php");
require_once("testRemoteLoad.php");

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
