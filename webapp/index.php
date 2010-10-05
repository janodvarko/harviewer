<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>HTTP Archive Viewer @VERSION@</title>
</head>
<body class="harBody">
    <div id="content" version="@VERSION@"></div>
    <!--[if IE]><script type="text/javascript" src="scripts/excanvas/excanvas.js"></script><![endif]-->
    <script src="scripts/requireplugins-jquery-1.4.2.js"></script>
    <script>require(["harViewer"]);</script>
    <link rel="stylesheet" href="css/harViewer.css" type="text/css"/>
    <?php include("ga.php") ?>
</body>
</html>
