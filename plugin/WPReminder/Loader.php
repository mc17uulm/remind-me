<?php

namespace WPReminder;

use WPReminder\api\APIHandler;
use WPReminder\api\handler\LinkHandler;
use WPReminder\api\objects\Settings;
use WPReminder\api\objects\settings\Templates;
use WPReminder\cron\CronJob;
use WPReminder\db\Database;
use WPReminder\db\DatabaseException;

/**
 * Class Loader
 * @package WPReminder
 */
final class Loader {

    /**
     * @var string
     */
    private string $file;

    /**
     * @param string $file
     */
    public function __construct(string $file) {
        $this->file = $file;
    }

    /**
     * @throws DatabaseException|PluginException
     */
    public function run() : void {

        load_plugin_textdomain('wp-reminder', false, dirname(plugin_basename($this->file)) . "/languages/");

        register_activation_hook($this->file, [$this, 'activate']);
        register_deactivation_hook($this->file, [$this, 'deactivate']);

        add_filter('the_posts', [LinkHandler::class, 'check']);
        add_action('rest_api_init', [APIHandler::class, 'run']);
        add_action('admin_menu', [$this, 'register_menu']);
        add_action('admin_enqueue_scripts', [$this, 'register_backend_scripts']);
        add_action('enqueue_block_assets', [$this, 'register_block']);
        add_action('wp_reminder_cron_job', [CronJob::class, 'run']);

        add_shortcode('wp-reminder', [$this, 'handle_shortcode']);
        add_shortcode('wp-reminder-settings', [$this, 'handle_settings_shortcode']);

    }

    /**
     * @throws PluginException
     */
    public function activate() : void {
        if(!defined('WP_REMINDER_DIR')) die('invalid request');
        if(!current_user_can('activate_plugins')) return;
        Database::initialize();
        Settings::create_default();
        Templates::create_default();
        CronJob::activate();
    }

    /**
     * @throws DatabaseException
     */
    public function deactivate() : void {
        if(!current_user_can('activate_plugins')) return;
        Database::remove();
        Settings::delete();
        Templates::delete();
        CronJob::remove();
    }

    /**
     * @param array $attributes
     * @return string
     */
    public function handle_shortcode(array $attributes) : string {
        $attributes = shortcode_atts(['events' => '', 'name' => __('Subscription', 'wp-reminder')], $attributes);

        $events = explode(',', $attributes['events']);
        $shortcode = new Shortcode($attributes['name'], $events);
        $this->register_new_form();
        return $shortcode->render();
    }

    /**
     * @return string
     */
    public function handle_settings_shortcode() : string {
        $this->register_edit_form();
        return "<div id='wp-reminder-frontend-form'></div>";
    }

    /**
     *
     */
    public function register_menu() : void {
        add_menu_page(
            'Dashboard',
            'Reminder',
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
            __('Email templates', 'wp-reminder'),
            __('Email templates', 'wp-reminder'),
            'manage_options',
            'wp-reminder-templates',
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

    /**
     * @param string|null $site
     * @return string
     */
    public function get_token (?string $site) : string {
        if(is_null($site)) return "";
        switch($site) {
            case 'wp-reminder': return 'dashboard';
            case 'wp-reminder-events': return 'events';
            case 'wp-reminder-subscribers': return 'subscribers';
            case 'wp-reminder-settings': return 'settings';
            case 'wp-reminder-templates': return 'templates';
            default: return '';
        }
    }

    /**
     * @throws PluginException
     */
    public function register_backend_scripts() : void {
        if(!defined('WP_REMINDER_URL') || !defined('WP_REMINDER_VERSION')) die('invalid request');
        $token = $this->get_token($_GET["page"]);
        if($token !== "") {

            $base = defined("WP_REMINDER_URL") ? WP_REMINDER_URL : "";
            $settings = Settings::get();

            wp_enqueue_script(
                'react-js',
                "https://unpkg.com/react@17/umd/react.production.min.js"
            );
            wp_enqueue_script(
                'react-js-dom',
                "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"
            );

            wp_enqueue_script(
                "wp_reminder-$token.js",
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
                "wp_reminder-$token.js",
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
                "wp_reminder-$token.js",
                'wp-reminder',
                plugin_dir_path($this->file) . "/languages/"
            );
        }
    }

    public function register_frontend_scripts() : void {
        if(!defined('WP_REMINDER_URL') || !defined('WP_REMINDER_VERSION')) die('invalid request');
        $base = defined("WP_REMINDER_URL") ? WP_REMINDER_URL : "";

        wp_enqueue_script(
            'react-js',
            "https://unpkg.com/react@17/umd/react.production.min.js"
        );
        wp_enqueue_script(
            'react-js-dom',
            "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"
        );

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

        wp_enqueue_style(
            'wp-reminder-frontend.css',
            "$base/dist/css/wp-reminder-new-form-style.css",
            [],
            WP_REMINDER_VERSION
        );

    }

    private function register_new_form() : void {
        $this->register_frontend_scripts();
        wp_enqueue_script('wp-reminder-new-form.js');
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
        wp_set_script_translations(
            'wp-reminder-new-form.js',
            'wp-reminder',
            plugin_dir_path($this->file) . "/languages/"
        );
    }

    private function register_edit_form() : void {
        $this->register_frontend_scripts();
        wp_enqueue_script('wp-reminder-edit-form.js');
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
            'wp-reminder-edit-form.js',
            'wp-reminder',
            plugin_dir_path($this->file) . "/languages/"
        );
    }

    /**
     * @throws PluginException
     */
    public function register_block() : void {
        if(!defined('WP_REMINDER_URL') || !defined('WP_REMINDER_VERSION')) die('invalid request');
        if(is_admin()) {
            $this->load_backend_block_script();
        } else {
            $this->load_frontend_block_scripts();
        }
    }

    /**
     * @throws PluginException
     */
    private function load_backend_block_script() : void {
        $base = defined("WP_REMINDER_URL") ? WP_REMINDER_URL : "";
        $settings = Settings::get();

        wp_enqueue_style(
            'wp-reminder-block.css',
            "$base/dist/css/wp-reminder-blocks-style.css",
            [],
            WP_REMINDER_VERSION
        );

        wp_enqueue_script(
            'wp-reminder-block.js',
            "$base/dist/js/wp-reminder-blocks-handler.js",
            ['wp-blocks', 'wp-editor', 'wp-i18n', 'wp-element'],
            WP_REMINDER_VERSION,
            true
        );


        wp_localize_script(
            "wp-reminder-block.js",
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
            'wp-reminder-block.js',
            'wp-reminder',
            WP_REMINDER_PATH . "/languages/"
        );
    }

    private function load_frontend_block_scripts() : void {
        if(has_block('wp-reminder/block')) {
            $this->register_new_form();
        }
    }

}