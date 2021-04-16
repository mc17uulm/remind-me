<?php

namespace WPReminder\cron;

use WPReminder\api\objects\Event;
use WPReminder\api\objects\Subscriber;

final class CronJob {

    public static function activate() : void {
        if(!wp_next_scheduled('wp_reminder_cron_job')) {
            wp_schedule_event(time(), 'daily', 'wp_reminder_cron_job');
        }
    }

    public static function run() : void {
        $subscribers = Subscriber::get_all();
        $events = Event::get_all();
        $subscribers = array_map(function (Subscriber $subscriber) use($events) {
            $subscriber->set_events(array_filter($events, function (Event $event) use($subscriber) {
                return in_array($event->get_id(), $subscriber->get_events());
            }));
            return $subscriber;
        }, $subscribers);
        // TODO: is one of the events now?
        // TODO: if so: send email to subscriber
    }

}