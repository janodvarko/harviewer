<?php 
require_once("global.php");
?>

<?php if ($googleAnalyticsProfile && substr($googleAnalyticsProfile, 0, 1) != "@") { ?>
<!-- Google Analytics -->
<script type="text/javascript">
var gaProfile = <?php echo "'".$googleAnalyticsProfile."'"; ?>;
var _gaq = _gaq || [];
_gaq.push(['_setAccount', gaProfile]);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 
        'http://www') + '.google-analytics.com/ga.js';
    ga.setAttribute('async', 'true');
    document.documentElement.firstChild.appendChild(ga);
})();
</script>
<?php } ?>
