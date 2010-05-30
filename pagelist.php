<?php 
require_once("lib/global.php");
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>HAR Viewer - Page List</title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="Pragma" content="no-cache"></meta>
    <meta http-equiv="Expires" content="-1"></meta>
    <meta http-Equiv="Cache-Control" Content="no-cache"></meta>

    <?php include("lib/har-files.php") ?>

    <style type="text/css">
    body {
        overflow-y:auto !important;
        background-color:white;
        margin:0;
        padding:0;
    }
    #ajaxLoaderTable {
        width:100%;
    }
    #ajaxLoaderTable td {
        vertical-align:middle;
        text-align:center;
    }
    </style>
</head>
<body>

<div id="pageList" version="@VERSION@">

<!-- Content for page list, there is a loading progress indicator by default. -->
<table id="ajaxLoaderTable" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
    <tr>
        <td style="vertical-align:middle; text-align:center;">
            <img src="images/ajax-loader.gif" />
        </td>
    </tr>
</table>

<script type="text/javascript">
var table = document.getElementById("ajaxLoaderTable");
var height = 0;
if (!window.innerHeight) { //IE
    if (!(document.documentElement.clientHeight == 0)) //strict mode
        height = document.documentElement.clientHeight;
    else //quirks mode
        height = document.body.clientHeight;
} else //w3c
    height = window.innerHeight;
table.style.height = height + "px";
</script>

</div>

<?php include("lib/ga.php") ?>

</body>
</html>
