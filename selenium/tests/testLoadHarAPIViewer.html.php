<?php
require_once("config.php");
?>

<!doctype html>
<html>
<head>
    <title>HAR Viewer Test Case</title>
    <base href="<?php echo $harviewer_base ?>" />
    <link rel="stylesheet" href="css/harViewer.css" type="text/css">
</head>
<body class="harBody">
    <div id="content" version="test"></div>
    <!--[if IE]><script type="text/javascript" src="scripts/excanvas/excanvas.js"></script><![endif]-->
    <script src="scripts/jquery.js"></script>
    <script data-main="scripts/harViewer" src="scripts/require.js"></script>
    <script>
    $("#content").bind("onViewerInit", function(event)
    {
        // Get application object
        var viewer = event.target.repObject;
        viewer.loadHar("<?php echo $test_base.'tests/hars/testLoad1.harp' ?>", { jsonp: true, jsonpCallback: 'callback_testLoad1' });
        viewer.loadHar("<?php echo $test_base.'tests/hars/testLoad2.harp' ?>", { jsonp: true, jsonpCallback: 'callback_testLoad2' });
        viewer.loadHar("<?php echo $test_base.'tests/hars/testLoad3.har' ?>");
    });
    </script>
</body>
</html>
