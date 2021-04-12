<?php

namespace WPReminder;

use WPReminder\api\APIHandler;
use WPReminder\db\Database;

/**
 * Class Loader
 * @package WPReminder
 */
final class Loader {

    /**
     * @param string $file
     */
    public function run(string $file) : void {

        if(defined("WP_REMINDER_DEBUG") && WP_REMINDER_DEBUG) {
            define( 'WP_DEBUG', true );
            define( 'WP_DEBUG_DISPLAY', true );
            define( 'WP_DEBUG_LOG', true );
        }

        add_shortcode('wp_reminder', fn(array $attr) => $this->handle_shortcode($attr));

        register_activation_hook($file, fn() => Database::initialize());
        register_deactivation_hook($file, fn() => Database::remove());

        add_action('rest_api_init', fn() => APIHandler::run());
        add_action('admin_menu', fn() => $this->register_menu());
        add_action('admin_enqueue_scripts', fn() => $this->register_backend_scripts());

    }

    /**
     * @param array $attributes
     * @return string
     */
    private function handle_shortcode(array $attributes) : string {
        return "";
    }

    private function register_menu() : void {
        add_menu_page(
            'Dashboard',
            'WP Reminder',
            'manage_options',
            'wp-reminder',
            function() { echo '<div id="wp_reminder_container"></div>'; },
            'dashicons-megaphone'
        );

        add_submenu_page(
            'wp-reminder',
            'Dashboard',
            'Dashboard',
            'manage_options',
            'wp-reminder'
        );

        add_submenu_page(
            'wp-reminder',
            'Events',
            'Events',
            'manage_options',
            'wp-reminder-events',
            function() { echo '<div id="wp_reminder_container"></div>'; }
        );

        add_submenu_page(
            'wp-reminder',
            'Subscribers',
            'Subscribers',
            'manage_options',
            'wp-reminder-subscribers',
            function() { echo '<div id="wp_reminder_container"></div>'; }
        );

        add_submenu_page(
            'wp-reminder',
            'Settings',
            'Settings',
            'manage_options',
            'wp-reminder-subscribers',
            function() { echo '<div id="wp_reminder_container"></div>'; }
        );
    }

    private function get_token (?string $site) : string {
        if(is_null($site)) return "";
        switch($site) {
            case 'wp-reminder': return 'dashboard';
            case 'wp-reminder-events': return 'events';
            case 'wp-reminder-subscribers': return 'subscribers';
            case 'wp-reminder-settings': return 'settings';
            default: return '';
        }
    }

    private function register_backend_scripts() : void {
        $token = $this->get_token($_GET["page"]);
        if($token !== "") {

            $base = defined("WP_REMINDER_BASE_URL") ? WP_REMINDER_BASE_URL : "";

            wp_enqueue_script(
                'wp_reminder_handler.js',
                "$base/dist/js/wp-reminder-$token-handler.js",
                [],
                '0.1.0',
                true
            );

            wp_localize_script(
                'wp_reminder_handler.js',
                'wp_reminder_definitions',
                [
                    'root' => esc_url_raw(rest_url()),
                    'nonce' => wp_create_nonce('wp_rest'),
                    'slug' => 'wp-reminder',
                    'version' => 'v1',
                    'site' => $_GET["page"],
                    'base' => admin_url('admin.php')
                ]
            );

        }
    }

}