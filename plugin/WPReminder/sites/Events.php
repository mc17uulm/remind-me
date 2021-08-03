<?php

namespace WPReminder\sites;

use WPReminder\api\objects\Settings;

final class Events
{

    private static ?Events $instance = null;

    protected function __construct() {
        $this->load_sites();
    }

    private function load_sites() : void {
        $submenu = add_submenu_page(
            'wp-reminder',
            __('Events', 'wp-reminder'),
            __('Events', 'wp-reminder'),
            'manage_options',
            'wp-reminder-events',
            function() { echo '<div id="wp_reminder_container"></div>'; }
        );
        add_action('load-' . $submenu, fn() => $this->register());
    }

    private function register() : void {
        wp_register_script(
            'wp-reminder-dashboard.js',
            WP_REMINDER_URL . "dist/js/dashboard.js",
            ['wpi18n'],
            WP_REMINDER_VERSION,
            true
        );

        wp_register_style(
            'wp-reminder-dashboard.css',
            WP_REMINDER_URL . "dist/css/dashboard.css",
            [],
            WP_REMINDER_VERSION
        );
        add_action('admin_enqueue_scripts', fn() => $this->load());
    }

    /**
     * @throws \WPReminder\PluginException
     */
    private function load() : void {
        $settings = Settings::get();
        wp_enqueue_script('wp-reminder-dashboard.js');
        wp_enqueue_style('wp-reminder-dashboard.css');
        wp_localize_script(
            'wp-reminder-dashboard.js',
            'wp_reminder_definitions',
            [
                'root' => esc_url_raw(rest_url()),
                'nonce' => wp_create_nonce('wp_rest'),
                'slug' => 'wp-reminder',
                'version' => 'v1',
                'site' => $_GET["page"],
                'base' => admin_url('admin.php'),
                'active' =>  $settings->license->active ? 'true' : 'false'
            ]
        );
        wp_set_script_translations(
            'wp-reminder-dashboard.js',
            'wp-reminder',
            WP_REMINDER_PATH . '/languages/'
        );
    }

    public static function get() : Events
    {
        if(self::$instance === null) {
            self::$instance = new Events();
        }
        return self::$instance;
    }

}