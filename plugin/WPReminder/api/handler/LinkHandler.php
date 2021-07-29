<?php

namespace WPReminder\api\handler;

use WPReminder\api\APIException;
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
        $url = ($_SERVER['https'] ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        // If not => do nothing
        if(strpos($url, $settings->settings_page) !== 0) return;

        // check if token is available
        if(!$token = filter_input(INPUT_GET, 'wp-reminder-token')) self::redirect();
        // check if type is available
        if(!$type = filter_input(INPUT_GET, 'wp-reminder-action')) self::redirect();
        // check if type has correct identifier
        if(!in_array($type, ['activate', 'edit'])) self::redirect();
        // if edit
        if($type === 'edit') {
            try {
                // if token is for valid subscriber => let frontend handle
                Subscriber::get_by_token($token);
                return;
            } catch(APIException $e) {
                // token is no valid subscriber => redirect
                self::redirect();
            }
        }
        // Check if token is valid => if not: redirect
        if(!Token::check($token, 'activate')) self::redirect();
        // activate subscriber
        $valid_token = Token::get($token);
        $subscriber = Subscriber::get_by_id($valid_token->get_subscriber_id());
        $params = [
            'wp-reminder-token' => $subscriber->get_token(),
            'wp-reminder-action' => 'edit'
        ];
        if(!$subscriber->is_active()) {
            $subscriber->activate();
            // send success mail to subscriber
            MailHandler::send_success($subscriber);
            $valid_token->remove();
            $params['wp-reminder-success'] = 'true';
        }
        // redirect to edit page
        wp_redirect(
            add_query_arg($params, $settings->settings_page)
        );
        exit;
    }

    private static function redirect() : void {
        wp_redirect(remove_query_arg(['wp-reminder-token', 'wp-reminder-action', 'wp-reminder-success']));
        exit;
    }

}