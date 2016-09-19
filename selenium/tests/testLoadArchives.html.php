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
    <script src="scripts/jquery.js"></script>
    <script data-main="scripts/harViewer" src="scripts/require.js"></script>
    <script>
    $("#content").bind("onViewerInit", function(event)
    {
        // Get application object
        var viewer = event.target.repObject;
        var hars = ["<?php echo $test_base.'tests/hars/testLoad3.har' ?>", "<?php echo $test_base.'tests/hars/simple.har' ?>"];
        var harps = ["<?php echo $test_base.'tests/hars/testLoad1.harp' ?>"];

        var callback = function() {};
        var errorCallback = function() {};
        var doneCallback = function() {};

        viewer.loadArchives(hars, harps, 'callback_testLoad1', callback, errorCallback, doneCallback);
    });
    </script>
</body>
</html>
