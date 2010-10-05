<?php
# Enable Google Analytics (for publicly hosted instances) in ant.properties file
# by setting GOOGLE-ANALYTICS-PROFILE property to ID of your profile.
$googleAnalyticsProfile = "@GOOGLE-ANALYTICS-PROFILE@";
if ($googleAnalyticsProfile && substr($googleAnalyticsProfile, 0, 1) != "@") { ?>

<!-- Google Analytics -->
<script type="text/javascript">
var _gaq = _gaq || [];
_gaq.push(['_setAccount', <?php echo "'".$googleAnalyticsProfile."'"; ?>]);
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
