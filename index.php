<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
         "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>HTTP Archive Viewer @VERSION@</title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="Pragma" content="no-cache"></meta>
    <meta HTTP-equiv="Expires" content="-1"></meta>

    <!-- Dojo -->
    <script type="text/javascript" src="dojo.js" ></script>
    <script type="text/javascript" src="har.dojo.js" ></script>

    <!-- HAR Viewer JS -->
    <script type="text/javascript" src="strings.js" ></script>
    <script type="text/javascript" src="schema.js" preserve="true"></script>
    <script type="text/javascript" src="domplate.js" ></script>
    <script type="text/javascript" src="har.core.js" ></script>
    <script type="text/javascript" src="har.lib.js" ></script>
    <script type="text/javascript" src="har.model.js" ></script>
    <script type="text/javascript" src="har.infotip.js" ></script>
    <script type="text/javascript" src="har.rep.js" ></script>
    <script type="text/javascript" src="har.rep.tabview.js" ></script>
    <script type="text/javascript" src="har.rep.pagelist.js" ></script>
    <script type="text/javascript" src="har.rep.entrylist.js" ></script>
    <script type="text/javascript" src="har.rep.entrybody.js" ></script>
    <script type="text/javascript" src="har.rep.entryinfotip.js" ></script>
    <script type="text/javascript" src="har.tab.inputview.js" ></script>
    <script type="text/javascript" src="har.tab.preview.js" ></script>
    <script type="text/javascript" src="har.tab.domview.js" ></script>
    <script type="text/javascript" src="har.rep.schema.js" ></script>
    <script type="text/javascript" src="har.viewer.js" ></script>

    <!-- HAR Viewer CSS -->
    <link rel="stylesheet" href="tabView.css" type="text/css"/>
    <link rel="stylesheet" href="viewer.css" type="text/css"/>
    <link rel="stylesheet" href="net.css" type="text/css"/>
    <link rel="stylesheet" href="pageRep.css" type="text/css"/>
    <link rel="stylesheet" href="domView.css" type="text/css"/>
    <link rel="stylesheet" href="schemaRep.css" type="text/css"/>
    <link rel="stylesheet" href="highlight.css" type="text/css"/>
    <link rel="stylesheet" href="infoTip.css" type="text/css"/>
</head>
<body>
<div id="content" version="@VERSION@"
    ondragenter="HAR.Lib.cancelEvent(event);"
    ondragover="HAR.Lib.cancelEvent(event);"
    ondrop="HAR.Tab.InputView.onDrop(event);"></div>

<!-- Input HAR Tab Template -->
<div id="InputTabTemplate" style="display:none">
<ul style="padding-left: 20px; line-height: 20px; margin-top: 0px">
<li>Paste <a href="http://groups.google.com/group/firebug-working-group/web/http-tracing---export-format">HAR</a>
log into the text box below and
press the <b>Preview</b> button.</li>
<li>Or drop <span class="red">*.har</span> file(s) anywhere on the page (you need Firefox 3.6).</li>
</ul>
<table cellpadding="0" cellspacing="4">
    <tr>
        <td><input type="checkbox" id="validate" checked="true"
            onchange="HAR.Viewer.onValidationChange()"></input></td>
        <td style="vertical-align:middle;padding-bottom: 1px;">Validate data before processing?</td>
    </tr>
</table>
<textarea id="sourceEditor" class="sourceEditor" cols="80" rows="10"></textarea>
<p><table cellpadding="0" cellspacing="0">
    <tr>
        <td><button id="appendPreview" onclick="HAR.Tab.InputView.onAppendPreview();">Preview</button></td>
    </tr>
</table></p>
<br/>
<p><i>This viewer supports HAR 1.1 (see the <b>About</b> tab).<br/></i></p>
<p><i>Click
<span class="link" onclick="HAR.Viewer.loadLocalArchive('examples/netData-1.har');">here</span> or
<span class="link" onclick="HAR.Viewer.loadLocalArchive('examples/netData-2.har');">here</span>
to load an example of existing HAR file.</i></p>

</div>

<!-- Help Tab Template -->
<div id="HelpTabTemplate" style="display:none">
<h2>HTTP Archive Viewer @VERSION@</h2>
<i>Author: Jan Odvarko, odvarko@gmail.com</i>
<br/><br/>
<table style="width:600px;">

<tr><td>
<p>The purpose of this online tool is to visualize
<a href="http://groups.google.com/group/firebug-working-group/web/http-tracing---export-format">
    HTTP Archive 1.1</a>
log files (JSON) created by HTTP tracking tools. These files contain log of HTTP
client/server conversation and can be used for an additional analysis of e.g. 
page load performance.</p>

<p>User interface of this tool is composed from the following tabs:</p>
<ul>
<li><b>Input HAR</b> - Paste content of a log file into the text box in this tab.</li>
<li><b>Preview</b> - Switch to this tab if you want to see visualised HTTP traffic.</li>
<li><b>DOM</b> - Use this tab to see structure of the input JSON data as an expandable tree.</li>
<li><b>Schema</b> - Explore format of the input log in this tab.</li>
</ul>
</td></tr>

<tr><td>
<h3>Discussion Group</h3>
<p>Send feedback to: <a href="http://groups.google.com/group/http-archive-specification">
    http://groups.google.com/group/http-archive-specification</a></p>
</td></tr>

<tr><td>
<h3>Create Logs using Firebug 1.5</h3>
One of the tools you can use to log data transfered over HTTP protocol
is <b>Firebug</b>. To do this you have to also install Firebug extension
called <b>NetExport.</b>

<p>Recommended configurations:</p>
<ul>
    <li><a href="http://getfirebug.com/releases/firebug/1.5X/">
        Firebug 1.5</a> +
    <a href="http://getfirebug.com/releases/export/1.5">NetExport 0.7</a>
    (supports 
    <a href="http://groups.google.com/group/firebug-working-group/web/http-tracing---export-format">
    HAR Spec 1.1</a>) 
    </li>
</ul>
</td></tr>

<tr><td>
<h3>HTTP Archive Specification</h3>
<p>Required
<a href="http://groups.google.com/group/firebug-working-group/web/http-tracing---export-format">
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
automaticaly within the viewer.</p>

<p><i>1. The Content of a *.har file must be enclosed within a callback function:</i></p>
<code>onInputData({ "log": { ... } })</code>

<p><i>2. The link displaying a *.har file (using this viewer) must specify URL of
the file in <b>inputUrl</b> parameter:</i></p>
<code>http://www.softwareishard.com/har/viewer/?inputUrl=http://www.example.com/netData.har</code>

<p><i>3. A custom name of the callback function can be specified in a <b>callback</b> parameter
(by default it's <b>onInputData</b>):</i></p>
<code>http://www.softwareishard.com/har/viewer/?inputUrl=http://www.example.com/netData.har&apm;callback=onInputData</code>
<br/><br/>
</td></tr>

<tr><td>
<h3>Previous Viewers</h3>
<p>Old logs created using HAR spec 1.0 (deprecated) can be previewed
<a href="http://www.softwareishard.com/har/viewer-1.0/">here</a>.</p>
</td></tr>

</table>
</div>

<!-- Google Analytics -->
<script type="text/javascript">
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-3586722-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 
        'http://www') + '.google-analytics.com/ga.js';
    ga.setAttribute('async', 'true');
    document.documentElement.firstChild.appendChild(ga);
})();
</script>
</body>
</html>
