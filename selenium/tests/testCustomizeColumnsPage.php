<?php
require_once("config.php");

$scriptsURL = $harviewer_base."scripts/";
$cssURL = $harviewer_base."css/";

// Customize request-columns visibility
setcookie("previewCols", "url type timeline");
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
</body>
</html>
