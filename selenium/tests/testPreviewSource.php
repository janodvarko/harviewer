<?php
require_once("HARTestCase.php");

/**
 * Preview HAR source provided usin a text area.
 */
class HAR_TestPreviewSource extends HAR_TestCase
{
    public function testPreview()
    {
        print "\ntestPreviewSource.php";

        $this->open($GLOBALS["harviewer_base"]);

        $har = "{ \"log\":{ \"version\":\"1.1\", \"creator\":{ \"name\":\"Firebug\", \"version\":\"1.6X.0a11\" }, \"browser\":{ \"name\":\"Firefox\", \"version\":\"3.6.3\" }, \"pages\":[{ \"startedDateTime\":\"2010-05-26T00:08:58.245+02:00\", \"id\":\"page_33141\", \"title\":\"http://legoas/har/viewer/selenium/tests/test.txt\", \"pageTimings\":{ \"onContentLoad\":87, \"onLoad\":102 } } ], \"entries\":[{ \"pageref\":\"page_33141\", \"startedDateTime\":\"2010-05-26T00:08:58.245+02:00\", \"time\":5, \"request\":{ \"method\":\"GET\", \"url\":\"http://legoas/har/viewer/selenium/tests/test.txt\", \"httpVersion\":\"HTTP/1.1\", \"cookies\":[], \"headers\":[{ \"name\":\"Host\", \"value\":\"legoas\" }, { \"name\":\"User-Agent\", \"value\":\"Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.2.3) Gecko/20100401 Firefox/3.6.3 (.NET CLR 3.5.30729)\" }, { \"name\":\"Accept\", \"value\":\"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\" }, { \"name\":\"Accept-Language\", \"value\":\"en-us,en;q=0.5\" }, { \"name\":\"Accept-Encoding\", \"value\":\"gzip,deflate\" }, { \"name\":\"Accept-Charset\", \"value\":\"ISO-8859-1,utf-8;q=0.7,*;q=0.7\" }, { \"name\":\"Keep-Alive\", \"value\":\"115\" }, { \"name\":\"Connection\", \"value\":\"keep-alive\" } ], \"queryString\":[], \"headersSize\":415, \"bodySize\":-1 }, \"response\":{ \"status\":200, \"statusText\":\"OK\",\"httpVersion\":\"HTTP/1.1\", \"cookies\":[], \"headers\":[{ \"name\":\"Date\", \"value\":\"Tue, 25 May 2010 22:09:38 GMT\" }, { \"name\":\"Server\", \"value\":\"Apache/2.2.11 (Win32) PHP/5.2.8\" }, { \"name\":\"Last-Modified\", \"value\":\"Tue, 25 May 2010 22:08:46 GMT\" }, { \"name\":\"Etag\", \"value\":\"none\" }, { \"name\":\"Accept-Ranges\", \"value\":\"bytes\" }, { \"name\":\"Content-Length\", \"value\":\"8\" }, { \"name\":\"Keep-Alive\", \"value\":\"timeout=5, max=100\" }, { \"name\":\"Connection\", \"value\":\"Keep-Alive\" }, { \"name\":\"Content-Type\", \"value\":\"text/plain\" } ], \"content\":{ \"size\":8, \"mimeType\":\"text/plain\", \"text\":\"Response\" }, \"redirectURL\":\"\", \"headersSize\":306, \"bodySize\":8}, \"cache\":{}, \"timings\":{ \"dns\":1, \"connect\":2, \"blocked\":0, \"send\":0, \"wait\":2, \"receive\":0 } } ] }}";
        $this->type("id=sourceEditor", $har);

        // Click on the example link
        $this->click("id=appendPreview");

        // The Preview tab must be selected and example HAR file loaded.
        $this->assertElementContainsText("css=.PreviewTab.selected", "Preview");
        $this->assertElementContainsText("css=.pageName", "http://legoas/har/viewer/selenium/tests/test.txt");
        $this->assertElementContainsText("css=.netHrefLabel", "GET test.txt");
    }
}
?>
