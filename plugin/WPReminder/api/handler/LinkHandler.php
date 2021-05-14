<?php

namespace WPReminder\api\handler;

use WPReminder\api\objects\Settings;
use WPReminder\api\objects\Subscriber;
use WPReminder\api\objects\Token;
use WPReminder\db\DatabaseException;
use WPReminder\mail\MailHandler;
use WPReminder\PluginException;

/**
 * Class LinkHandler
 * @package WPReminder\api\handler
 */
final class LinkHandler {

    /**
     * @throws DatabaseException
     * @throws PluginException
     */
    public static function check() : void {
        // Check if current page is settings page
        $settings = Settings::get();
        $url = ($_SERVER['https'] ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . explode('?', $_SERVER['REQUEST_URI'], 2)[0];
        // If not => do nothing
        if($url !== $settings->settings_page) return;

        // check if token is available
        if(!$token = filter_input(INPUT_GET, 'wp-reminder-token')) self::redirect();
        // check if type is available
        if(!$type = filter_input(INPUT_GET, 'wp-reminder-action')) self::redirect();
        // check if type has correct identifier
        if(!in_array($type, ['activate', 'edit'])) self::redirect();
        // if edit => let frontend handle but stay on site
        if($type === 'edit') return;
        // Check if token is valid => if not: redirect
        if(!Token::check($token, 'activate')) self::redirect();
        // activate subscriber
        $valid_token = Token::get($token);
        $subscriber = Subscriber::get_by_id($valid_token->get_subscriber_id());
        $param = "";
        if(!$subscriber->is_active()) {
            $subscriber->activate();
            // send success mail to subscriber
            MailHandler::send_success($subscriber);
            $valid_token->remove();
            $param = '&wp-reminder-success=true';
        }
        // redirect to edit page
        wp_redirect($settings->settings_page . '?wp-reminder-token=' . $subscriber->token . '&wp-reminder-action=edit' . $param);
        exit;
    }

    private static function redirect() : void {
        wp_redirect(remove_query_arg(['wp-reminder-token', 'wp-reminder-action']));
        exit;
    }

}