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
        'expand' => $options['expand']
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
    $expand = $values ['expand'];

    $options = get_option('harviewer_options');
    $url = $options['url'];
    $previewURL = $url."/preview.php";

    $body = "<div class='harPreviewBox'>";

    $body .= "<iframe class='harPreviewFrame' frameborder='0' ".
        "height='".$height."' border='0' ".
        "src='".$previewURL."?path=".$path;

    if ($expand)
       $body .= "&amp;expand=true";

    $body .= "'></iframe>";

    if ($resizer)
        $body .= "<div class='harPreviewResizer'></div>";

    $body .= "</div>";

    return $body;
}

// ********************************************************************************************* //
?>