<?php
require_once("PHPUnit/Extensions/SeleniumTestCase.php");
require_once("config.php");

/**
 * Run several browsers and check if HAR Viewer is properly initialized.
 */ 
class HAR_Test1 extends PHPUnit_Extensions_SeleniumTestCase
{
    public static $browsers = array(
      array(
        'name'    => 'Firefox on Windows',
        'browser' => '*firefox',
        'port'    => 4444,
        'timeout' => 30000,
      ),
      array(
        'name'    => 'Internet Explorer on Windows XP',
        'browser' => '*iexplore',
        'port'    => 4444,
        'timeout' => 30000,
      )
    );

    protected function setUp()
    {
        print "\nHAR Test1::setUp()";

        $this->setBrowserUrl($GLOBALS["harviewer_base"]);
        //$this->setSleep(5);
    }
 
    protected function tearDown()
    {
        print "\nHAR Test1::tearDown()";
    }

    public function testTabs()
    {
        print "\nHAR Test1::testTabs()";

        $this->open($GLOBALS["harviewer_base"]);
        $this->assertElementContainsText("css=a.InputTab", "Home");
        $this->assertElementContainsText("css=.PreviewTab", "Preview");
        $this->assertElementContainsText("css=.DOMTab", "HAR");
        $this->assertElementContainsText("css=.SchemaTab", "Schema");
    }
}
?>
