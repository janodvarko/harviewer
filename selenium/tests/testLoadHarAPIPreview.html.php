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
        // Get application object
        var viewer = event.target.repObject;
        var settings = {jsonp: true};
        viewer.loadHar("<?php echo $test_base.'tests/hars/testLoad1.harp' ?>", settings);
        viewer.loadHar("<?php echo $test_base.'tests/hars/testLoad2.harp' ?>", settings);
        viewer.loadHar("<?php echo $test_base.'tests/hars/testLoad3.har' ?>");
    });
    </script>
</body>
</html>
