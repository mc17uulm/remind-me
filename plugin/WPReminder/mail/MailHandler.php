<?php

namespace WPReminder\mail;

use WPReminder\api\APIException;
use WPReminder\api\objects\Event;
use WPReminder\api\objects\Settings;
use WPReminder\api\objects\Subscriber;
use WPReminder\api\objects\Token;
use WPReminder\api\Template;
use WPReminder\PluginException;
use WPReminder\db\DatabaseException;

final class MailHandler {

    /**
     * @param Subscriber $subscriber
     * @return bool
     * @throws DatabaseException
     * @throws PluginException
     */
    public static function send_to_subscriber(Subscriber $subscriber) : bool {

        // Check if events in events list are typeof Event
        $events = array_filter($subscriber->get_events(), function($event) {
            return is_a($event, Event::class);
        });

        // if no events are found, there is nothing to send
        if(count($events) === 0) return true;

        $settings = Settings::get();


        // TODO: how to handle templates
        // TODO: build html by templates
        // TODO: send mail to subscriber with created html

        return false;

    }

    /**
     * @throws DatabaseException
     * @throws APIException | PluginException
     * @retrun bool
     */
    public static function send_confirm(Subscriber $subscriber) : bool {

        $template = new Template('check');
        $headers = [
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . get_bloginfo('name') . '<' . get_bloginfo('admin_email') . '>'
        ];

        $settings = Settings::get();
        $token = Token::create($subscriber->id, "activate");
        $url = get_site_url() . "?wp-reminder-token=" . $token->get_token();

        return wp_mail(
            $subscriber->email,
            sprintf('%s | %s', $settings->subject_check, get_bloginfo('name')),
            $template->render_events($subscriber, $url),
            $headers
        );
    }

    /**
     * @param Subscriber $subscriber
     * @return bool
     * @throws PluginException
     */
    public static function send_success(Subscriber $subscriber) : bool {
        $template = new Template('accept');
        $headers = [
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . get_bloginfo('name') . '<' . get_bloginfo('admin_email') . '>'
        ];

        $settings = Settings::get();

        return wp_mail(
            $subscriber->email,
            sprintf('%s | %s', $settings->subject_accept, get_bloginfo('name')),
            $template->render_success($subscriber),
            $headers
        );
    }

    public static function send_unsubscribe(Subscriber $subscriber) : bool {
        return false;
    }

}