<?php

namespace WPReminder;

use WPReminder\api\APIHandler;
use WPReminder\api\handler\LinkHandler;
use WPReminder\api\objects\Settings;
use WPReminder\cron\CronJob;
use WPReminder\db\Database;

/**
 * Class Loader
 * @package WPReminder
 */
final class Loader {

    /**
     * @param string $file
     * @throws db\DatabaseException
     */
    public function run(string $file) : void {

        load_plugin_textdomain('wp-reminder', false, dirname(plugin_basename($file)) . "/languages/");

        register_activation_hook($file, fn() => $this->activate());
        register_deactivation_hook($file, fn() => $this->deactivate());

        add_action('rest_api_init', fn() => APIHandler::run());
        add_action('admin_menu', fn() => $this->register_menu());
        add_action('admin_enqueue_scripts', fn() => $this->register_backend_scripts($file));
        add_action('wp_enqueue_scripts', fn() => $this->register_frontend_scripts($file));
        add_action('wp_reminder_cron_job', fn() => CronJob::run());
        add_action('template_redirect', fn() => LinkHandler::check());

        add_shortcode('wp-reminder', fn(array $attr) => $this->handle_shortcode($attr));

    }

    private function activate() : void {
        Database::initialize();
        Settings::create_default();
        CronJob::activate();
    }

    private function deactivate() : void {
        Database::remove();
        Settings::delete();
    }

    /**
     * @param array $attributes
     * @return string
     */
    private function handle_shortcode(array $attributes) : string {
        $attributes = shortcode_atts(['events' => '', 'name' => ''], $attributes);

        $events = explode(',', $attributes['events']);
        $shortcode = new Shortcode($attributes['name'], $events);
        return $shortcode->render();
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
            __('Dashboard', 'wp-reminder'),
            __('Dashboard', 'wp-reminder'),
            'manage_options',
            'wp-reminder'
        );

        add_submenu_page(
            'wp-reminder',
            __('Events', 'wp-reminder'),
            __('Events', 'wp-reminder'),
            'manage_options',
            'wp-reminder-events',
            function() { echo '<div id="wp_reminder_container"></div>'; }
        );

        add_submenu_page(
            'wp-reminder',
            __('Subscribers', 'wp-reminder'),
            __('Subscribers', 'wp-reminder'),
            'manage_options',
            'wp-reminder-subscribers',
            function() { echo '<div id="wp_reminder_container"></div>'; }
        );

        add_submenu_page(
            'wp-reminder',
            __('Settings', 'wp-reminder'),
            __('Settings', 'wp-reminder'),
            'manage_options',
            'wp-reminder-settings',
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

    private function register_backend_scripts(string $file) : void {
        $token = $this->get_token($_GET["page"]);
        if($token !== "") {

            $base = defined("WP_REMINDER_BASE_URL") ? WP_REMINDER_BASE_URL : "";

            wp_enqueue_script(
                'wp_reminder.js',
                "$base/dist/js/wp-reminder-$token-handler.js",
                ['wp-i18n'],
                WP_REMINDER_VERSION,
                true
            );

            wp_enqueue_style(
                'wp_reminder.css',
                "$base/dist/css/wp-reminder-$token-style.css",
                [],
                WP_REMINDER_VERSION
            );

            wp_localize_script(
                'wp_reminder.js',
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

            wp_set_script_translations('wp_reminder.js', 'wp-reminder', plugin_dir_path($file) . "/languages/");
        }
    }

    private function register_frontend_scripts(string $file) : void {
        $base = defined("WP_REMINDER_BASE_URL") ? WP_REMINDER_BASE_URL : "";

        wp_register_script(
            'wp-reminder-frontend.js',
            "$base/dist/js/wp-reminder-frontend-handler.js",
            ['wp-i18n'],
            WP_REMINDER_VERSION,
            true
        );

        wp_register_style(
            'wp-reminder-frontend.css',
            "$base/dist/css/wp-reminder-frontend-style.css",
            [],
            WP_REMINDER_VERSION
        );

        wp_localize_script(
            'wp-reminder-frontend.js',
            'wp_reminder_definitions',
            [
                'root' => esc_url_raw(rest_url()),
                'nonce' => wp_create_nonce('wp_rest'),
                'slug' => 'wp-reminder',
                'version' => 'v1'
            ]
        );

        wp_set_script_translations(
            'wp_reminder-frontend.js',
            'wp-reminder',
            plugin_dir_path($file) . "/languages/"
        );

    }

}