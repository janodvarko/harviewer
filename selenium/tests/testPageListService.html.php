<?php
require_once("config.php");

// Compute URL for an iframe used in this test.
$url = $harviewer_base."loader.php?service=pagelist&amp;path=".
    $test_base."tests/simple-page-load.har&amp;expand=false";
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
  <title>Test Case for HAR Viewer</title>
</head>
<body>

<script type="text/javascript">
function test()
{
    // Just to make sure the Firebug console is loaded. In case of 1.6
    // it loads only if there is a <script> tag on the page.
}
</script>

<!-- HAR log embedded in the page -->
<iframe id="pageList" name="pageList" width="518px" height="220px" frameborder="0" border="0"
    style="border: 1px solid rgb(225, 225, 211);"
    src="<?php echo $url; ?>"></iframe>

</body>
</html>

