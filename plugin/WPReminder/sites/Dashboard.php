<?php

namespace WPReminder\sites;

use WPReminder\api\objects\Settings;

final class Dashboard
{

    private static ?Dashboard $instance = null;
    
    protected function __construct() {
        $this->load_sites();
    }

    private function load_sites() : void {
        $menu = add_menu_page(
            'Dashboard',
            'Reminder',
            'manage_options',
            'wp-reminder',
            function() { echo '<div id="wp_reminder_container"></div>'; },
            'dashicons-megaphone'
        );

        $submenu = add_submenu_page(
            'wp-reminder',
            __('Dashboard', 'wp-reminder'),
            __('Dashboard', 'wp-reminder'),
            'manage_options',
            'wp-reminder'
        );

        add_action('load-' . $menu, fn() => $this->register());
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

    public static function get() : Dashboard
    {
        if(self::$instance === null) {
            self::$instance = new Dashboard();
        }
        return self::$instance;
    }

}