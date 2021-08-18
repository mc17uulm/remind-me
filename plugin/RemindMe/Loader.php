<?php

namespace RemindMe;

use RemindMe\api\APIHandler;
use RemindMe\api\handler\LinkHandler;
use RemindMe\api\objects\Settings;
use RemindMe\api\objects\settings\Templates;
use RemindMe\cron\CronJob;
use RemindMe\db\Database;
use RemindMe\db\DatabaseException;

/**
 * Class Loader
 * @package RemindMe
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

        load_plugin_textdomain('remind-me', false, dirname(plugin_basename($this->file)) . "/languages/");

        register_activation_hook($this->file, [$this, 'activate']);
        register_deactivation_hook($this->file, [$this, 'deactivate']);

        add_filter('the_posts', [LinkHandler::class, 'check']);
        add_action('rest_api_init', [APIHandler::class, 'run']);
        add_action('admin_menu', [$this, 'register_menu']);
        add_action('admin_enqueue_scripts', [$this, 'register_backend_scripts']);
        add_action('enqueue_block_assets', [$this, 'register_block']);
        add_action('remind_me_cron_job', [CronJob::class, 'run']);

        add_shortcode('remind-me', [$this, 'handle_shortcode']);
        add_shortcode('remind-me-settings', [$this, 'handle_settings_shortcode']);

    }

    /**
     * @throws PluginException
     */
    public function activate() : void {
        if(!defined('REMIND_ME_DIR')) die('invalid request');
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
        $attributes = shortcode_atts(['events' => '', 'name' => __('Subscription', 'remind-me')], $attributes);

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
        return "<div id='remind-me-frontend-form'></div>";
    }

    /**
     *
     */
    public function register_menu() : void {
        add_menu_page(
            'Dashboard',
            'Reminder',
            'manage_options',
            'remind-me',
            function() { echo '<div id="remind_me_container"></div>'; },
            'dashicons-megaphone'
        );

        add_submenu_page(
            'remind-me',
            __('Dashboard', 'remind-me'),
            __('Dashboard', 'remind-me'),
            'manage_options',
            'remind-me'
        );

        add_submenu_page(
            'remind-me',
            __('Events', 'remind-me'),
            __('Events', 'remind-me'),
            'manage_options',
            'remind-me-events',
            function() { echo '<div id="remind_me_container"></div>'; }
        );

        add_submenu_page(
            'remind-me',
            __('Subscribers', 'remind-me'),
            __('Subscribers', 'remind-me'),
            'manage_options',
            'remind-me-subscribers',
            function() { echo '<div id="remind_me_container"></div>'; }
        );

        add_submenu_page(
            'remind-me',
            __('Email templates', 'remind-me'),
            __('Email templates', 'remind-me'),
            'manage_options',
            'remind-me-templates',
            function() { echo '<div id="remind_me_container"></div>'; }
        );

        add_submenu_page(
            'remind-me',
            __('Settings', 'remind-me'),
            __('Settings', 'remind-me'),
            'manage_options',
            'remind-me-settings',
            function() { echo '<div id="remind_me_container"></div>'; }
        );
    }

    /**
     * @param string|null $site
     * @return string
     */
    public function get_token (?string $site) : string {
        if(is_null($site)) return "";
        switch($site) {
            case 'remind-me': return 'dashboard';
            case 'remind-me-events': return 'events';
            case 'remind-me-subscribers': return 'subscribers';
            case 'remind-me-settings': return 'settings';
            case 'remind-me-templates': return 'templates';
            default: return '';
        }
    }

    /**
     * @throws PluginException
     */
    public function register_backend_scripts() : void {
        if(!defined('REMIND_ME_URL') || !defined('REMIND_ME_VERSION')) die('invalid request');
        $token = $this->get_token($_GET["page"]);
        if($token !== "") {

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
                "remind-me-$token-runtime",
                plugin_dir_url($this->file) . "dist/js/remind-me-$token.js",
                ['wp-i18n'],
                REMIND_ME_VERSION,
                true
            );

            wp_enqueue_style(
                'remind-me-style',
                plugin_dir_url($this->file) . "dist/css/remind-me-$token.css",
                [],
                REMIND_ME_VERSION
            );

            wp_localize_script(
                "remind-me-$token-runtime",
                'remind_me_definitions',
                [
                    'root' => esc_url_raw(rest_url()),
                    'nonce' => wp_create_nonce('wp_rest'),
                    'slug' => 'remind-me',
                    'version' => 'v1',
                    'site' => $_GET["page"],
                    'base' => admin_url('admin.php'),
                    'active' =>  $settings->license->active ? 'true' : 'false'
                ]
            );

            wp_set_script_translations(
                "remind-me-$token-runtime",
                'remind-me',
                plugin_dir_path($this->file) . "languages/"
            );
        }
    }

    public function register_frontend_scripts() : void {
        if(!defined('REMIND_ME_URL') || !defined('REMIND_ME_VERSION')) die('invalid request');

        wp_enqueue_script(
            'react-js',
            "https://unpkg.com/react@17/umd/react.production.min.js"
        );
        wp_enqueue_script(
            'react-js-dom',
            "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"
        );

        wp_register_script(
            'remind-me-new-form-runtime',
            plugin_dir_url($this->file) . "dist/js/remind-me-new-form.js",
            ['wp-i18n'],
            REMIND_ME_VERSION,
            true
        );

        wp_register_script(
            'remind-me-edit-form-runtime',
            plugin_dir_url($this->file) . "dist/js/remind-me-edit-form.js",
            ['wp-i18n'],
            REMIND_ME_VERSION,
            true
        );

        wp_enqueue_style(
            'remind-me-frontend-style',
            plugin_dir_url($this->file) . "dist/css/remind-me-new-form.css",
            [],
            REMIND_ME_VERSION
        );

    }

    private function register_new_form() : void {
        $this->register_frontend_scripts();
        wp_enqueue_script('remind-me-new-form-runtime');
        wp_localize_script(
            'remind-me-new-form-runtime',
            'remind_me_definitions',
            [
                'root' => esc_url_raw(rest_url()),
                'nonce' => wp_create_nonce('wp_rest'),
                'slug' => 'remind-me',
                'version' => 'v1',
                'base' => get_site_url()
            ]
        );
        wp_set_script_translations(
            'remind-me-new-form-runtime',
            'remind-me',
            plugin_dir_path($this->file) . "languages/"
        );
    }

    private function register_edit_form() : void {
        $this->register_frontend_scripts();
        wp_enqueue_script('remind-me-edit-form-runtime');
        wp_localize_script(
            'remind-me-edit-form-runtime',
            'remind_me_definitions',
            [
                'root' => esc_url_raw(rest_url()),
                'nonce' => wp_create_nonce('wp_rest'),
                'slug' => 'remind-me',
                'version' => 'v1',
                'base' => get_site_url()
            ]
        );

        wp_set_script_translations(
            'remind-me-edit-form-runtime',
            'remind-me',
            plugin_dir_path($this->file) . "languages/"
        );
    }

    /**
     * @throws PluginException
     */
    public function register_block() : void {
        if(!defined('REMIND_ME_URL') || !defined('REMIND_ME_VERSION')) die('invalid request');
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
        $settings = Settings::get();

        wp_enqueue_style(
            'remind-me-block-style',
            plugin_dir_url($this->file) . "dist/css/remind-me-block.css",
            [],
            REMIND_ME_VERSION
        );

        wp_enqueue_script(
            'remind-me-block-runtime',
            plugin_dir_url($this->file) . "dist/js/remind-me-block.js",
            ['wp-blocks', 'wp-editor', 'wp-i18n', 'wp-element'],
            REMIND_ME_VERSION,
            true
        );


        wp_localize_script(
            "remind-me-block-runtime",
            'remind_me_definitions',
            [
                'root' => esc_url_raw(rest_url()),
                'nonce' => wp_create_nonce('wp_rest'),
                'slug' => 'remind-me',
                'version' => 'v1',
                'site' => $_GET["page"],
                'base' => admin_url('admin.php'),
                'active' =>  $settings->license->active ? 'true' : 'false'
            ]
        );

        wp_set_script_translations(
            'remind-me-block-runtime',
            'remind-me',
            REMIND_ME_PATH . "/languages/"
        );
    }

    private function load_frontend_block_scripts() : void {
        if(has_block('remind-me/block')) {
            $this->register_new_form();
        }
    }

}