<?php

namespace WPReminder\mail;

use WPReminder\api\objects\Event;
use WPReminder\api\objects\Subscriber;
use WPReminder\api\objects\Template;
use WPReminder\db\DatabaseException;

final class MailHandler {

    /**
     * @param Subscriber $subscriber
     * @return bool
     * @throws DatabaseException
     */
    public static function send_to_subscriber(Subscriber $subscriber) : bool {

        // Check if events in events list are typeof Event
        $events = array_filter($subscriber->get_events(), function($event) {
            return is_a($event, Event::class);
        });

        // if no events are found, there is nothing to send
        if(count($events) === 0) return true;

        $template = Template::get_all();

        // TODO: how to handle templates
        // TODO: build html by templates
        // TODO: send mail to subscriber with created html

        return false;

    }

}