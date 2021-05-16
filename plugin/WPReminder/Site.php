<?php

namespace WPReminder;

/**
 * Class Site
 * @package WPReminder
 */
final class Site {

    /**
     * @var string
     */
    private static string $_PAGE_SLUG = "wp-reminder-user-settings";

    public static function add() : void {

        global $wpdb;

        $result = $wpdb->get_row("SELECT post_name FROM {$wpdb->prefix}posts WHERE post_name = '" . self::$_PAGE_SLUG . "'", 'ARRAY_A');

        if($result === null) {

            $page = [
                'post_title' => __('Subscription settings', 'wp-reminder'),
                'post_status' => 'publish',
                'post_author' => get_current_user_id(),
                'post_type' => 'page',
                'post_content' => '[wp-reminder-settings]',
                'post_name' => self::$_PAGE_SLUG
            ];

            wp_insert_post($page);
        }

    }

    /**
     * @param string $key
     * @return mixed
     * @throws PluginException
     * @retrun mixed
     */
    public static function load(string $key) {
        global $wpdb;

        $result = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}posts WHERE post_name = '" . self::$_PAGE_SLUG . "'", 'ARRAY_A');
        if(!isset($result[$key])) throw new PluginException("Key '$key' not key of post");
        return $result[$key];
    }

    /**
     *
     */
    public static function remove () : void {
        try {
            wp_delete_post(self::load("ID"));
        } catch(PluginException $e) {}
    }

}