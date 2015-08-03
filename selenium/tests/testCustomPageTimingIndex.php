<?php
require_once("config.php");

// Compute proper URLs for includes resources (depends on config.php).
// Don't forget on trailinig slash.
$scriptsURL = $harviewer_base."scripts/";
$cssURL = $harviewer_base."css/";
?>

<!doctype html>
<html>
<head>
    <title>HTTP Archive Viewer Test</title>
    <link rel="stylesheet" href="<?php echo $cssURL; ?>harViewer.css" type="text/css">
</head>
<body class="harBody">
    <div id="content" version="Test"></div>
    <script src="<?php echo $scriptsURL; ?>jquery.js"></script>
    <script data-main="<?php echo $scriptsURL; ?>harViewer" src="<?php echo $scriptsURL; ?>require.js"></script>
    <script type="text/javascript">
    $("#content").bind("onViewerPreInit", function(event)
    {
        var viewer = event.target.repObject;
        var preview = viewer.getTab("Preview");
        preview.addPageTiming({
            name: "_onMyEvent",
            classes: "onMyEventBar",
            description: "A custom page timing"
        });
    });
    </script>
</body>
</html>
