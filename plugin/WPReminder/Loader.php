<?php

namespace WPReminder;

use WPReminder\api\APIHandler;
use WPReminder\api\handler\LinkHandler;
use WPReminder\api\objects\Event;
use WPReminder\api\objects\Settings;
use WPReminder\cron\CronJob;
use WPReminder\db\Database;
use WPReminder\db\DatabaseException;

/**
 * Class Loader
 * @package WPReminder
 */
final class Loader {

    /**
     * @param string $file
     * @throws DatabaseException|PluginException
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
        add_shortcode('wp-reminder-settings', fn() => $this->handle_settings_shortcode());

        add_shortcode('wp-reminder-test', function() {
            $events = Event::get_all();

            $str = "";
            foreach($events as $event) {
                assert($event instanceof Event);
                $next_execution = $event->get_next_execution();
                $execute_now = $event->should_execute_now() ? 'true' : 'false';
                $date = date('d. F Y', $next_execution);
                $id = $event->get_id();
                $str .= "$id | Date: $date | Execute?: $execute_now<br>";
            }
            return $str;
        });
    }

    /**
     * @throws PluginException
     */
    private function activate() : void {
        if(!current_user_can('activate_plugins')) return;
        Database::initialize();
        Site::add();
        Settings::create_default();
        CronJob::activate();
    }

    private function deactivate() : void {
        if(!current_user_can('activate_plugins')) return;
        Database::remove();
        Settings::delete();
        Site::remove();
    }

    /**
     * @param array $attributes
     * @return string
     */
    private function handle_shortcode(array $attributes) : string {
        $attributes = shortcode_atts(['events' => '', 'name' => __('Subscription', 'wp-reminder')], $attributes);

        $events = explode(',', $attributes['events']);
        $shortcode = new Shortcode($attributes['name'], $events);
        return $shortcode->render();
    }

    /**
     * @return string
     */
    private function handle_settings_shortcode() : string {
        wp_enqueue_script('wp-reminder-edit-form.js');
        wp_enqueue_style('wp-reminder-frontend.css');

        return "
            <div>
                <h4>" . __('Subscription settings', 'wp-reminder') . "</h4>
                <div id='wp-reminder-frontend-form'></div>
            </div>
        ";
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

            $base = defined("WP_REMINDER_URL") ? WP_REMINDER_URL : "";

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
        $base = defined("WP_REMINDER_URL") ? WP_REMINDER_URL : "";

        wp_register_script(
            'wp-reminder-new-form.js',
            "$base/dist/js/wp-reminder-new-form-handler.js",
            ['wp-i18n'],
            WP_REMINDER_VERSION,
            true
        );

        wp_register_script(
            'wp-reminder-edit-form.js',
            "$base/dist/js/wp-reminder-edit-form-handler.js",
            ['wp-i18n'],
            WP_REMINDER_VERSION,
            true
        );

        wp_register_style(
            'wp-reminder-frontend.css',
            "$base/dist/css/wp-reminder-new-form-style.css",
            [],
            WP_REMINDER_VERSION
        );

        wp_localize_script(
            'wp-reminder-new-form.js',
            'wp_reminder_definitions',
            [
                'root' => esc_url_raw(rest_url()),
                'nonce' => wp_create_nonce('wp_rest'),
                'slug' => 'wp-reminder',
                'version' => 'v1',
                'base' => get_site_url()
            ]
        );

        wp_localize_script(
            'wp-reminder-edit-form.js',
            'wp_reminder_definitions',
            [
                'root' => esc_url_raw(rest_url()),
                'nonce' => wp_create_nonce('wp_rest'),
                'slug' => 'wp-reminder',
                'version' => 'v1',
                'base' => get_site_url()
            ]
        );

        wp_set_script_translations(
            'wp_reminder-new-form.js',
            'wp-reminder',
            plugin_dir_path($file) . "/languages/"
        );

        wp_set_script_translations(
            'wp_reminder-edit-form.js',
            'wp-reminder',
            plugin_dir_path($file) . "/languages/"
        );

    }

}