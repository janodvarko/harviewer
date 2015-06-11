<?php
require_once("config.php");
$url = $harviewer_base;
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
  <title>Test Case for HAR Viewer</title>
</head>
<body>

<script>
(function() {
    var har = document.createElement("script");
    har.src = "<?php echo $harviewer_base ?>har.js";
    har.setAttribute("id", "har");
    har.setAttribute("async", "true");
    document.documentElement.firstChild.appendChild(har);
})();
</script>

<div id="preview" class="har"
    data-har="<?php echo $test_base.'tests/hars/invalid.harp' ?>"
    validate="true"></div>

</body>
</html>

