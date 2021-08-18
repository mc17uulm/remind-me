<?php

namespace RemindMe\api\handler;

use RemindMe\api\objects\Subscriber;
use RemindMe\api\objects\Token;
use RemindMe\db\DatabaseException;
use RemindMe\mail\MailHandler;
use RemindMe\PluginException;
use stdClass;
use Exception;

/**
 * Class LinkHandler
 * @package RemindMe\api\handler
 */
final class LinkHandler {

    /**
     * @var string
     */
    private static string $slug = 'remind-me';

    /**
     * @return string
     */
    public static function get_site() : string {
        return get_site_url();
    }

    /**
     * @throws DatabaseException
     * @throws PluginException
     */
    public static function check(array $posts) : array {
        // check if link is based on 'remind-me' path
        //if(!self::is_correct_link($posts)) return $posts;
        // check if token is available
        if(!$token = filter_input(INPUT_GET, 'remind-me-token')) return $posts;
        // check if type is available
        if(!$type = filter_input(INPUT_GET, 'remind-me-action')) return $posts;
        // check if type has correct identifier
        if(!in_array($type, ['activate', 'edit'])) return $posts;
        // if edit
        if($type === 'edit') {
            try {
                // if token is for valid subscriber => let frontend handle
                Subscriber::get_by_token($token);
                return self::load_post(__('Subscription settings', 'remind-me'));
            } catch(Exception $e) {
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
            'remind-me-token' => $subscriber->get_token(),
            'remind-me-action' => 'edit'
        ];
        if(!$subscriber->is_active()) {
            $subscriber->activate();
            // send success mail to subscriber
            MailHandler::send_success($subscriber);
            $valid_token->remove();
            $params['remind-me-success'] = 'true';
        }
        // redirect to edit page
        wp_redirect(
            add_query_arg($params, self::get_site())
        );
        exit;
    }

    /**
     * @param string $title
     * @return stdClass[]
     */
    private static function load_post(string $title) : array {
        global $wp_query;

        $post = self::create_post($title, '[remind-me-settings]');

        $wp_query->is_page = true;
        $wp_query->is_singular = true;
        $wp_query->is_home = false;
        $wp_query->is_archive = false;
        $wp_query->is_category = false;
        unset($wp_query->query['error']);
        $wp_query->query_vars['error'] = "";
        $wp_query->is_404 = false;

        return [$post];
    }

    /**
     * @param string $title
     * @param string $content
     * @return stdClass
     */
    private static function create_post(string $title, string $content) : stdClass {
        $post = new stdClass();
        $post->post_author = 1;
        $post->post_name = self::$slug;
        $post->guid = get_bloginfo('wpurl/' . self::$slug);
        $post->post_title  = $title;
        $post->post_content = $content;
        $post->ID = -1;
        $post->post_status = 'static';
        $post->comment_status = 'closed';
        $post->ping_status = 'closed';
        $post->comment_count = 0;
        $post->post_date = current_time('mysql');
        $post->post_date_gmt = current_time('mysql', 1);
        $post->slug = self::$slug;
        return $post;
    }

    private static function redirect() : void {
        wp_redirect(get_site_url());
        exit;
    }

}