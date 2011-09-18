<?php
require_once("config.php");
?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>HAR Viewer Test Case</title>
    <base href="<?php echo $harviewer_base ?>" />
</head>
<body style="margin:0">
    <div id="content" version="@VERSION@"></div>
    <script src="scripts/jquery.js"></script>
    <script data-main="scripts/harPreview" src="scripts/require.js"></script>
    <link rel="stylesheet" href="css/harPreview.css" type="text/css"/>
    <script>
    $("#content").bind("onPreviewInit", function(event)
    {
        var viewer = event.target.repObject;
        viewer.setPreviewColumns("url timeline", true);
    });
    </script>
</body>
</html>
