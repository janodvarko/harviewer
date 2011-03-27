<?php
/**
 * @package HAR Viewer
 */
/*
Plugin Name: HAR Viewer
Plugin URI: http://www.softwareishard.com/blog/har-viewer
Description: Embedding HAR files within blog posts.
Version: 0.5.0
Author: Jan Odvarko
Author URI: http://janodvarko.cz/
License: BSD
*/

// ********************************************************************************************* //
// Includes

require_once('har-log.php');
require_once('har-shortcode.php');
require_once('har-admin.php');

// ********************************************************************************************* //
// Registration

$basename = basename(__FILE__);
$dirname = dirname(plugin_basename(__FILE__));

add_action('activate_'.$dirname.'/'.$basename, 'har_activate');
add_action('wp_print_styles', 'har_add_stylesheet');

// ********************************************************************************************* //
// Activation

function har_activate()
{
    require_once('har-activate.php');
}

// ********************************************************************************************* //
// Styles

function har_add_stylesheet()
{
    global $post;
    $content = $post->post_content;

    // Include HAR scripts and styles only if the post contains a HAR tag.
    if (stristr($content, '[har'))
    {
        $plugin_name = dirname(plugin_basename(__FILE__));
        $harviewer_options = get_option('harviewer_options');
        $url = $harviewer_options['url'];

        wp_enqueue_style('style', plugins_url($plugin_name.'/includes/main.css'));
        wp_enqueue_script('jquery', $url.'/scripts/jquery.js');
        wp_enqueue_script('requirejs', $url.'/scripts/require.js');
        wp_enqueue_script('main', plugins_url($plugin_name.'/includes/main.js'));
    }
}

// ********************************************************************************************* //
?>