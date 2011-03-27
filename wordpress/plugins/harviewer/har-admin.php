<?php

// ********************************************************************************************* //
// Options Page

add_action('admin_menu', 'har_admin_menu');
add_action('admin_init', 'har_admin_init');
add_action('wp_loaded',  'har_default_options_setup');

// ********************************************************************************************* //
// Callbacks

function har_admin_menu()
{
    // Register options page
    add_options_page('HAR Viewer Options', 'HAR Viewer', 'manage_options', 'harviewer',
        'har_options_page');
}

function har_admin_init()
{
    register_setting('harviewer_options', 'harviewer_options', 'harviewer_options_validate');

    add_settings_section('harviewer_main', 'Main Settings', 'harviewer_section_text', 'harviewer');

    // HAR Viewer URL
    add_settings_field('url', 'HAR Viewer URL', 'harviewer_url_input',
        'harviewer', 'harviewer_main');

    // Default preview height
    add_settings_field('height', 'HAR Preview Default Height', 'preview_height_input',
        'harviewer', 'harviewer_main');

    // Expand pages by default
    add_settings_field('expand', 'Expand Page Lists', 'preview_expand_checkbox',
        'harviewer', 'harviewer_main');

    // Display Resizer
    add_settings_field('resizer', 'Display Vertical Resizer', 'preview_resizer_checkbox',
        'harviewer', 'harviewer_main');

    // Use loader to load the HAR file
    add_settings_field('loader', 'Manual Load', 'preview_loader_checkbox',
        'harviewer', 'harviewer_main');
}

// ********************************************************************************************* //
// Options

// Generate content of HAR Viewer options page
function har_options_page()
{
    //if (!current_user_can('manage_options'))
    //    wp_die( __('You do not have sufficient permissions to access this page.'));

    echo '<div class="wrap">';
    echo '<h2>HAR Viewer</h2>';
    echo '<form method="post" action="options.php">';

    settings_fields('harviewer_options');
    do_settings_sections('harviewer');

    echo '<p><input class="button-primary" name="Submit" type="submit" value="Save Changes" /></p>';

    echo '</form>';
    echo '</div>';
}

function harviewer_options_validate($input)
{
    //$newinput['text_string'] = trim($input['text_string']);
    //return $newinput;

    //har_log($input);
    return $input;
}

function harviewer_section_text()
{
    echo '<p>You should use your own online instance of <b>HAR Viewer</b>.</p>';
}

function harviewer_url_input()
{
    $options = get_option('harviewer_options');
    echo "<input id='url' name='harviewer_options[url]' ";
    echo "size='40' type='text' value='".$options['url']."' />";
}

function preview_height_input()
{
    $options = get_option('harviewer_options');
    echo "<input id='height' name='harviewer_options[height]' ";
    echo "size='5' type='text' value='".$options['height']."' />";
}

function preview_expand_checkbox()
{
    $options = get_option('harviewer_options');
    echo '<input id="expand" name="harviewer_options[expand]" type="checkbox" value="1"'.
        checked(1, $options['expand'], false).' />';
}

function preview_resizer_checkbox()
{
    $options = get_option('harviewer_options');
    echo '<input id="resizer" name="harviewer_options[resizer]" type="checkbox" value="1"'.
        checked(1, $options['resizer'], false).' />';
}

function preview_loader_checkbox()
{
    $options = get_option('harviewer_options');
    echo '<input id="loader" name="harviewer_options[loader]" type="checkbox" value="1"'.
        checked(1, $options['loader'], false).' />';
}

// ********************************************************************************************* //
// Defaults

function har_default_options_setup()
{
    $options = get_option('harviewer_options');
    if (!$options)
    {
       $options = har_default_options();
       update_option('harviewer_options', $options);
    }
}

function har_default_options()
{
    $options = array(
        'url' => 'http://www.janodvarko.cz/har/viewer/',
        'height' => 220,
        'expand' => 1,
        'resizer' => 1,
        'loader' => 0,
    );

    return $options;
}

// ********************************************************************************************* //
?>