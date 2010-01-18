<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
         "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>HAR Viewer - Page List</title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="Pragma" content="no-cache"></meta>
    <meta http-equiv="Expires" content="-1"></meta>
    <meta http-Equiv="Cache-Control" Content="no-cache"></meta>

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
    <script type="text/javascript" src="har.page.pie.js" ></script>
    <script type="text/javascript" src="har.page.timeline.js" ></script>
    <script type="text/javascript" src="har.page.stats.js" ></script>
    <script type="text/javascript" src="har.tab.inputview.js" ></script>
    <script type="text/javascript" src="har.tab.preview.js" ></script>
    <script type="text/javascript" src="har.tab.domview.js" ></script>
    <script type="text/javascript" src="har.rep.schema.js" ></script>
    <script type="text/javascript" src="har.viewer.js" ></script>
    <script type="text/javascript" src="har.service.pagelist.js" ></script>

    <!-- HAR Viewer CSS -->
    <link rel="stylesheet" href="tabView.css" type="text/css"/>
    <link rel="stylesheet" href="viewer.css" type="text/css"/>
    <link rel="stylesheet" href="net.css" type="text/css"/>
    <link rel="stylesheet" href="pageRep.css" type="text/css"/>
    <link rel="stylesheet" href="domView.css" type="text/css"/>
    <link rel="stylesheet" href="schemaRep.css" type="text/css"/>
    <link rel="stylesheet" href="highlight.css" type="text/css"/>
    <link rel="stylesheet" href="infoTip.css" type="text/css"/>
    <link rel="stylesheet" href="har.page.timeline.css" type="text/css"/>
    <link rel="stylesheet" href="har.page.stats.css" type="text/css"/>

    <style type="text/css">
    body {
        overflow-y:auto;
        background-color: white;
        margin: 0;
        padding: 0;
    }
    #ajaxLoaderTable {
        width:100%;
    }
    #ajaxLoaderTable td {
        vertical-align:middle;
        text-align:center;
    }
    </style>
</head>
<body>

<div id="pageList" version="@VERSION@">

<!-- Content for page list, there is a loading progress indicator by default. -->
<table id="ajaxLoaderTable" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
    <tr>
        <td style="vertical-align:middle; text-align:center;">
            <img src="images/ajax-loader.gif" />
        </td>
    </tr>
</table>

<script type="text/javascript">
var table = document.getElementById("ajaxLoaderTable");
var height = 0;
if (!window.innerHeight) { //IE
    if (!(document.documentElement.clientHeight == 0)) //strict mode
        height = document.documentElement.clientHeight;
    else //quirks mode
        height = document.body.clientHeight;
} else //w3c
    height = window.innerHeight;
table.style.height = height + "px";
</script>

</div>

<!-- HAR Schema -->
<script type="text/javascript" src="schema.js" preserve="true"></script>

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
