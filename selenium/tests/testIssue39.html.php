<!doctype html>
<?php
require_once("config.php");
?>
<html>
<head>
  <title>testIssue39.html.php</title>
</head>
<body>

<!-- Test local (relative) HAR -->
<div id="previewLocalWithQueryString" class="har" height="100" data-har="/selenium/tests/hars/simple.har?action=show_me_har_file"></div>

<!-- Test remote (JSONP) HAR -->
<div id="previewNonLocalWithQueryString" class="har" height="100" data-har="<?php echo $test_base.'tests/hars/testLoad1.harp?action=show_me_har_file' ?>" data-callback="callback_testLoad1"></div>

<script>
(function() {
    var har = document.createElement("script");
    har.src = "<?php echo $harviewer_base ?>har.js";
    har.setAttribute("id", "har");
    har.setAttribute("async", "true");
    document.documentElement.firstChild.appendChild(har);
})();
</script>

</body>
</html>
