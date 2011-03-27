<?php

// ********************************************************************************************* //
// HAR Shortcode

add_shortcode('har', 'har_shortcode');

// ********************************************************************************************* //
// Callbacks

function har_shortcode($params)
{
    wp_enqueue_script('requirejs');
    wp_enqueue_script('dragdrop');

    $options = get_option('harviewer_options');
    har_log($options);

    $values = shortcode_atts(array(
        'path' => '',
        'height' => $options['height'],
        'resizer' => $options['resizer'],
        'expand' => $options['expand'],
        'loader' => $options['loader']
    ), $params);

    // Body of the HAR tag is an IFRAME
    $body = '';
    if ($values['path'] != '')
        return get_preview_body($values);

    return $body;
}

function get_preview_body($values)
{
    $path = $values['path'];
    $height = $values['height'];
    $resizer = $values['resizer'];
    $expand = $values['expand'];
    $loader = $values['loader'];

    $options = get_option('harviewer_options');
    $url = $options['url'];
    $previewURL = $url."/preview.php?";

    if ($loader)
        $previewURL = $url."/loader.php?service=pagelist&amp;";

    if ($expand)
       $previewURL .= "expand=true&amp;";

    $previewURL .= "path=".$path;

    $body = "<div class='harPreviewBox'>";
    $body .= "<iframe class='harPreviewFrame' frameborder='0' ".
        "height='".$height."' border='0' ".
        "src='".$previewURL."'></iframe>";

    if ($resizer)
        $body .= "<div class='harPreviewResizer'></div>";

    $body .= "</div>";

    return $body;
}

// ********************************************************************************************* //
?>