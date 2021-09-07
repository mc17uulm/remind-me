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
     * @var string|false
     */
    private $version;
    /**
     * @var array
     */
    private array $dependencies;

    /**
     * @param string $file
     */
    public function __construct(string $file) {
        $this->file = $file;
        $this->version = defined("REMIND_ME_VERSION") ? REMIND_ME_VERSION : false;
        $path = plugin_dir_path($this->file) . 'dist/js/remind-me-vendor.asset.php';
        $dependencies = file_exists($path) ? require($path) : [];
        if(array_key_exists('dependencies', $dependencies)) {
            $this->dependencies = $dependencies['dependencies'];
        } else {
            $this->dependencies = [];
        }
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
        // Remove license notice hide cookie if set
        if(isset($_COOKIE['remind-me-license-notice'])) {
            unset($_COOKIE['remind-me-license-notice']);
            setcookie('remind-me-license-notice', '', time() - 3600, '/');
        }
    }

    /**
     * @param array $attributes
     * @return string
     */
    public function handle_shortcode($attributes) : string {
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
            'RemindMe',
            'manage_options',
            'remind-me',
            ReactContainer::render(),
            'dashicons-bell'
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
            ReactContainer::render()
        );

        add_submenu_page(
            'remind-me',
            __('Subscribers', 'remind-me'),
            __('Subscribers', 'remind-me'),
            'manage_options',
            'remind-me-subscribers',
            ReactContainer::render()
        );

        add_submenu_page(
            'remind-me',
            __('Email templates', 'remind-me'),
            __('Email templates', 'remind-me'),
            'manage_options',
            'remind-me-templates',
            ReactContainer::render()
        );

        add_submenu_page(
            'remind-me',
            __('Settings', 'remind-me'),
            __('Settings', 'remind-me'),
            'manage_options',
            'remind-me-settings',
            ReactContainer::render()
        );
    }

    /**
     * @param string $site
     * @return string
     */
    public function get_token (string $site) : string {
        switch($site) {
            case 'remind-me': return 'dashboard';
            case 'remind-me-events': return 'events';
            case 'remind-me-subscribers': return 'subscribers';
            case 'remind-me-settings': return 'settings';
            case 'remind-me-templates': return 'templates';
            default: return '';
        }
    }

    private function load_vendor() : void {
        wp_enqueue_script(
            'remind-me-vendor',
            plugins_url('dist/js/remind-me-vendor.js', $this->file),
            $this->dependencies,
            $this->version,
            true
        );
    }

    /**
     * @throws PluginException
     */
    public function register_backend_scripts() : void {
        $token = $this->get_token(sanitize_text_field($_GET["page"] ?? ""));
        if($token !== "") {

            $settings = Settings::get();

            $this->load_vendor();

            wp_enqueue_script(
                "remind-me-$token-runtime",
                plugins_url("dist/js/remind-me-$token.js", $this->file),
                ['wp-i18n'],
                $this->version,
                true
            );

            wp_enqueue_style(
                'remind-me-style',
                plugins_url("dist/css/remind-me-$token.css", $this->file),
                [],
                $this->version
            );

            wp_localize_script(
                "remind-me-$token-runtime",
                'remind_me_definitions',
                [
                    'root' => esc_url_raw(rest_url()),
                    'nonce' => wp_create_nonce('wp_rest'),
                    'slug' => 'remind-me',
                    'version' => 'v1',
                    'site' => sanitize_text_field($_GET["page"]),
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

        $this->load_vendor();

        wp_register_script(
            'remind-me-new-form-runtime',
            plugin_dir_url($this->file) . "dist/js/remind-me-new-form.js",
            ['wp-i18n'],
            $this->version,
            true
        );

        wp_register_script(
            'remind-me-edit-form-runtime',
            plugin_dir_url($this->file) . "dist/js/remind-me-edit-form.js",
            ['wp-i18n'],
            $this->version,
            true
        );

        wp_enqueue_style(
            'remind-me-frontend-style',
            plugin_dir_url($this->file) . "dist/css/remind-me-new-form.css",
            [],
            $this->version
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

        $this->load_vendor();

        wp_enqueue_style(
            'remind-me-block-style',
            plugin_dir_url($this->file) . "dist/css/remind-me-block.css",
            [],
            $this->version
        );

        wp_enqueue_script(
            'remind-me-block-runtime',
            plugin_dir_url($this->file) . "dist/js/remind-me-block.js",
            ['wp-blocks', 'wp-editor', 'wp-i18n', 'wp-element'],
            $this->version,
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
                'site' => sanitize_text_field($_GET["page"]),
                'base' => admin_url('admin.php'),
                'active' =>  $settings->license->active ? 'true' : 'false'
            ]
        );

        wp_set_script_translations(
            'remind-me-block-runtime',
            'remind-me',
            plugin_dir_path($this->file) . "languages/"
        );
    }

    private function load_frontend_block_scripts() : void {
        if(has_block('remind-me/block')) {
            $this->register_new_form();
        }
    }

}