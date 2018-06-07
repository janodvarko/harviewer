<!doctype html>
<html>
<head>
    <title>HTTP Archive Viewer Test</title>
    <link rel="stylesheet" href="<%= harviewer_base %>css/harViewer.css" type="text/css">
</head>
<body class="harBody">
    <div id="content" version="Test"></div>
    <script src="<%= harviewer_base %>scripts/jquery.js"></script>
    <script data-main="<%= harviewer_base %>scripts/harViewer" src="<%= harviewer_base %>scripts/require.js"></script>
    <script type="text/javascript">
    $("#content").bind("onViewerPreInit", function(event)
    {
        var viewer = event.target.repObject;
        viewer.showTabBar(false);
    });
    </script>
</body>
</html>
