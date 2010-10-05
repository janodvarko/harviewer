<?php
require_once("PHPUnit/Extensions/SeleniumTestCase.php");
require_once("config.php");

/**
 * Base class for all HAR Viewer tests.
 */ 
class HAR_TestCase extends PHPUnit_Extensions_SeleniumTestCase
{
    protected function setUp()
    {
        $this->setBrowser("*firefox");
        $this->setBrowserUrl($GLOBALS["harviewer_base"]);
    }
 
    protected function tearDown()
    {
    }

    /**
     * Asserts that an element exists on the page.
     * @param object $locator
     * @param object $message [optional]
     */
    public function assertElementExists($locator, $message = '')
    {
        $this->assertTrue($this->isElementPresent($locator), $message);
    }
}
?>
