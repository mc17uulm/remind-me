<?php

namespace WPReminder\mail;

use WPReminder\api\objects\Event;
use WPReminder\api\objects\Settings;
use WPReminder\api\objects\Subscriber;
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

    public static function send_confirm(string $email, array $events, string $url) : bool {

        $template = new Template('check');
        $headers = [
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . get_bloginfo('name') . '<' . get_bloginfo('admin_email') . '>'
        ];

        return wp_mail(
            $email,
            sprintf(__('Confirm your subscription | %s', 'wp-reminder'), get_bloginfo('name')),
            $template->render_events($events, $url),
            $headers
        );
        // TODO: email send not working
    }

}