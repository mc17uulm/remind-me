<?php

namespace RemindMe\sites;

use RemindMe\api\objects\Settings;

final class Events
{

    private static ?Events $instance = null;

    protected function __construct() {
        $this->load_sites();
    }

    private function load_sites() : void {
        $submenu = add_submenu_page(
            'remind-me',
            __('Events', 'remind-me'),
            __('Events', 'remind-me'),
            'manage_options',
            'remind-me-events',
            function() { echo '<div id="remind_me_container"></div>'; }
        );
        add_action('load-' . $submenu, fn() => $this->register());
    }

    private function register() : void {
        wp_register_script(
            'remind-me-dashboard.js',
            REMIND_ME_URL . "dist/js/dashboard.js",
            ['wpi18n'],
            REMIND_ME_VERSION,
            true
        );

        wp_register_style(
            'remind-me-dashboard.css',
            REMIND_ME_URL . "dist/css/dashboard.css",
            [],
            REMIND_ME_VERSION
        );
        add_action('admin_enqueue_scripts', fn() => $this->load());
    }

    /**
     * @throws \RemindMe\PluginException
     */
    private function load() : void {
        $settings = Settings::get();
        wp_enqueue_script('remind-me-dashboard.js');
        wp_enqueue_style('remind-me-dashboard.css');
        wp_localize_script(
            'remind-me-dashboard.js',
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
            'remind-me-dashboard.js',
            'remind-me',
            REMIND_ME_PATH . '/languages/'
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