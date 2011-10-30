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
        //$this->setBrowser("*firefox C:\\mozilla-dev\\firefox\\Firefox 6\\firefox.exe");
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

    /**
     * Asserts that an element does not exists on the page.
     * @param object $locator
     * @param object $message [optional]
     */
    public function assertElementNotExists($locator, $message = '')
    {
        $this->assertFalse($this->isElementPresent($locator), $message);
    }

    /**
     * Returns the number of nodes that match the specified css selector,
     * eg. "table" would give the number of tables.
     * @param string $locator CSS selector
     */
    public function getCssCount($locator)
    {
        $script = "window.document.querySelectorAll('".$locator."').length";
        return $this->getEval($script);
    }

    /**
     * Waits till the element exists on the page.
     */
    public function waitForElement($locator, $timeout = 10000, $message = '')
    {
        $this->waitForCondition(
            "selenium.browserbot.getCurrentWindow().document.querySelector('".$locator."')",
            $timeout);
    }
}
?>
