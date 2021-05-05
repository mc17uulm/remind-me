<?php

namespace WPReminder\api\handler;

use WPReminder\api\objects\Token;
use WPReminder\db\DatabaseException;

/**
 * Class LinkHandler
 * @package WPReminder\api\handler
 */
final class LinkHandler {

    /**
     * @throws DatabaseException
     */
    public static function check() : void {
        if(!$token = filter_input(INPUT_GET, 'wp-reminder-token')) return;
        if(!$type = filter_input(INPUT_GET, 'type')) return;
        if(!Token::check($token, $type)) {
            wp_redirect(remove_query_arg('wp-reminder-token'));
            exit;
        }

        // TODO: display result
        echo $token;
        exit;

    }

}