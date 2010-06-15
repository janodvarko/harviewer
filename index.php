<?php 
require_once("lib/global.php");
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>HTTP Archive Viewer @VERSION@</title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="Pragma" content="no-cache"></meta>
    <meta http-equiv="Expires" content="-1"></meta>

    <!--[if IE]><script type="text/javascript" src="excanvas/excanvas.compiled.js"></script><![endif]-->

    <?php include("lib/har-files.php") ?>
</head>
<body>
<div id="content" version="@VERSION@"
    ondragenter="HAR.Lib.cancelEvent(event);"
    ondragover="HAR.Lib.cancelEvent(event);"
    ondrop="HAR.Tab.InputView.onDrop(event);"></div>

<!-- Input HAR Tab Template -->
<div id="InputTabTemplate" style="display:none">
<ul style="padding-left: 20px; line-height: 20px; margin-top: 0px">
<li>Paste <a href="<?php echo $harSpecLink; ?>">HAR</a>
log into the text box below and
press the <b>Preview</b> button.</li>
<li>Or drop <span class="red">*.har</span> file(s) anywhere on the page (if your browser supports that).</li>
</ul>
<table cellpadding="0" cellspacing="4">
    <tr>
        <td><input type="checkbox" id="validate" checked="true"
            onchange="HAR.Viewer.onValidationChange()"></input></td>
        <td style="vertical-align:middle;padding-bottom: 1px;">Validate data before processing?</td>
    </tr>
</table>
<textarea id="sourceEditor" class="sourceEditor" cols="80" rows="5"></textarea>
<p><table cellpadding="0" cellspacing="0">
    <tr>
        <td><button id="appendPreview" onclick="HAR.Tab.InputView.onAppendPreview();">Preview</button></td>
    </tr>
</table></p>
<br/>
<h3>HAR Log Examples</h3>
<ul style="line-height:20px;">
<li><span id="example1" class="link" onclick="HAR.Viewer.loadExample('examples/inline-scripts-block.har');">
Inline scripts block</span> - Inline scripts block the page load.</li>
<li><span id="example2" class="link" onclick="HAR.Viewer.loadExample('examples/browser-blocking-time.har');">
Blocking time</span> - Impact of a limit of max number of parallel connections.</li>
<li><span id="example3" class="link" onclick="HAR.Viewer.loadExample('examples/softwareishard.com.har');">
Browser cache</span> - Impact of the browser cache on page load (the same page loaded three times).</li>
<li><span id="example4" class="link" onclick="HAR.Viewer.loadExample('examples/google.com.har');">
Single page</span> - Single page load (empty cache).</li>
</ul>
<br/>
<p><i>This viewer supports HAR 1.2 (see the <span class="link" onclick="HAR.Tab.InputView.onAbout()">About</span> tab).<br/></i></p>
</div>

<!-- Help Tab Template -->
<div id="HelpTabTemplate" style="display:none">
<h2>HTTP Archive Viewer @VERSION@</h2>
<i>Author: Jan Odvarko, odvarko@gmail.com</i>
<br/><br/>
<table style="width:600px;">

<tr><td>
<p>The purpose of this online tool is to visualize
<a href="<?php echo $harSpecLink; ?>">
    HTTP Archive (HAR)</a>
log files (JSON) created by HTTP tracking tools. These files contain log of HTTP
client/server conversation and can be used for an additional analysis of e.g. 
page load performance.</p>

<p>User interface of this tool is composed from the following tabs:</p>
<ul>
<li><b>Home</b> - Paste content of a log file into the text box in this tab.</li>
<li><b>Preview</b> - Switch to this tab if you want to see visualised HTTP traffic.</li>
<li><b>HAR</b> - Use this tab to see structure of the input JSON data as an expandable tree.</li>
<li><b>Schema</b> - Explore format of the input log in this tab.</li>
</ul>
</td></tr>

<tr><td>
<h3>Discussion Group</h3>
<p>Feedback: <a href="http://groups.google.com/group/http-archive-specification">
    http://groups.google.com/group/http-archive-specification</a></p>
<p>Report issue: <a href="http://code.google.com/p/harviewer/issues/list">
    http://code.google.com/p/harviewer/issues/list</a></p>
</td></tr>

<tr><td>
<h3>Create Logs using Firebug 1.5</h3>
One of the tools you can use to log data transfered over HTTP protocol
is <b>Firebug</b>. To do this you have to also install Firebug extension
called <b>NetExport.</b>

<p>Recommended configurations:</p>
<ul>
    <li><a href="http://getfirebug.com/releases/firebug/1.5/">
        Firebug 1.5</a> +
    <a href="http://getfirebug.com/releases/netexport/">NetExport 0.8</a>
    </li>
</ul>
</td></tr>

<tr><td>
<h3>HTTP Archive Specification</h3>
<p>Required
<a href="<?php echo $harSpecLink; ?>">
structure</a> of the input HTTP Archive file (*.har) is described using
<a href="http://www.json.com/json-schema-proposal/">JSON Schema</a>.
You can explore the current schema definition within the <b>Shema</b>
tab on this page.</p>
</td></tr>

<tr><td>
<h3>Request Timing Fields</h3>
<p>Part of the HTTP log is also a timing info about network request executions.
Here is a description of individual request/response phases:</p>
<ul>
<li><i>Blocking</i> - Time spent in a queue waiting for a network connection.</li>
<li><i>DNS Lookup</i> - DNS resolution time. The time required to resolve a host name.</li>
<li><i>Connecting</i> - Time required to create TCP connection.</li>
<li><i>Sending</i> - Time required to send HTTP request to the server.</li>
<li><i>Waiting</i> - Waiting for a response from the server.</li>
<li><i>Receiving</i> - Time required to read entire response from the server (or cache).</li>
</ul>
</td></tr>

<tr><td>
<h3>Online Log Files</h3>
<p>HAR Viewer also support JSONP and so it's possible to load log files 
from differet domains. This allows to link your online logs and preview them
automaticaly within the viewer. See live
<a href="?inputUrl=http://www.janodvarko.cz/har/viewer/examples/inline-scripts-block.harp">example</a>.
</p>

<p><i>1. The Content of a *.har file must be enclosed within a callback function:</i></p>
<code>onInputData({ "log": { ... } })</code>

<p><i>2. The link displaying a *.har file (using this viewer) must specify URL of
the file in <b>inputUrl</b> parameter:</i></p>
<code>http://www.softwareishard.com/har/viewer/?inputUrl=http://www.example.com/netData.har</code>

<p><i>3. A custom name of the callback function can be specified in a <b>callback</b> parameter
(by default it's <b>onInputData</b>):</i></p>
<code>http://www.softwareishard.com/har/viewer/?inputUrl=http://www.example.com/netData.har&amp;callback=onInputData</code>
<br/><br/>
</td></tr>

</table>
</div>

<?php include("lib/ga.php") ?>

</body>
</html>
