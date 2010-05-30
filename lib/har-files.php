<?php if (substr($buildType, 0, 1) != "@") {?>
    <link rel="stylesheet" href="images/har.css" type="text/css"/>
    <script type="text/javascript" src="lib/har.js"></script>
    <script type="text/javascript" src="lib/schema.js"></script>
<?php } else {?>
    <!-- Dojo -->
    <script type="text/javascript" src="lib/dojo.js"></script>
    <script type="text/javascript" src="lib/har.dojo.js"></script>

    <!-- Downloadify -->
    <script type="text/javascript" src="downloadify/js/swfobject.js"></script>
    <script type="text/javascript" src="downloadify/src/downloadify.js"></script>

    <!-- HAR Viewer JS -->
    <script type="text/javascript" src="lib/strings.js"></script>
    <script type="text/javascript" src="lib/schema.js"></script>
    <script type="text/javascript" src="lib/domplate.js"></script>
    <script type="text/javascript" src="lib/har.core.js"></script>
    <script type="text/javascript" src="lib/har.lib.js"></script>
    <script type="text/javascript" src="lib/har.model.js"></script>
    <script type="text/javascript" src="lib/har.model.loader.js"></script>
    <script type="text/javascript" src="lib/har.infotip.js"></script>
    <script type="text/javascript" src="lib/har.rep.js"></script>
    <script type="text/javascript" src="lib/har.rep.tabview.js"></script>
    <script type="text/javascript" src="lib/har.rep.pagelist.js"></script>
    <script type="text/javascript" src="lib/har.rep.entrylist.js"></script>
    <script type="text/javascript" src="lib/har.rep.entrybody.js"></script>
    <script type="text/javascript" src="lib/har.rep.entryinfotip.js"></script>
    <script type="text/javascript" src="lib/har.page.pie.js"></script>
    <script type="text/javascript" src="lib/har.page.timeline.js"></script>
    <script type="text/javascript" src="lib/har.page.stats.js"></script>
    <script type="text/javascript" src="lib/har.tab.inputview.js"></script>
    <script type="text/javascript" src="lib/har.tab.preview.js"></script>
    <script type="text/javascript" src="lib/har.tab.domview.js"></script>
    <script type="text/javascript" src="lib/har.rep.schema.js"></script>
    <script type="text/javascript" src="lib/har.viewer.js"></script>

    <!-- Only for page list service -->
    <script type="text/javascript" src="lib/pagelist.js"></script>

    <!-- HAR Viewer CSS -->
    <link rel="stylesheet" href="images/tabView.css" type="text/css"/>
    <link rel="stylesheet" href="images/viewer.css" type="text/css"/>
    <link rel="stylesheet" href="images/net.css" type="text/css"/>
    <link rel="stylesheet" href="images/pageRep.css" type="text/css"/>
    <link rel="stylesheet" href="images/domView.css" type="text/css"/>
    <link rel="stylesheet" href="images/schemaRep.css" type="text/css"/>
    <link rel="stylesheet" href="images/highlight.css" type="text/css"/>
    <link rel="stylesheet" href="images/infoTip.css" type="text/css"/>
    <link rel="stylesheet" href="images/har.page.timeline.css" type="text/css"/>
    <link rel="stylesheet" href="images/har.page.stats.css" type="text/css"/>
<?php }?>
