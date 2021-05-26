<?php

namespace WPReminder\cron;

use WPReminder\api\objects\Event;
use WPReminder\api\objects\Subscriber;
use WPReminder\mail\MailHandler;
use WPReminder\db\DatabaseException;
use WPReminder\PluginException;

/**
 * Class CronJob
 * @package WPReminder\cron
 */
final class CronJob {

    public static function activate() : void {
        if(!wp_next_scheduled('wp_reminder_cron_job')) {
            wp_schedule_event(time(), 'daily', 'wp_reminder_cron_job');
        }
    }

    /**
     * @throws DatabaseException
     * @throws PluginException
     */
    public static function run() : void {
        $subscribers = Subscriber::get_all();
        $events = Event::get_all();

        $subscribers = array_filter(
            array_map(
                function (Subscriber $subscriber) use($events) {
                    // Set all subscribed events of subscriber, which should be executed now
                    $subscriber->set_events(array_filter($events, function (Event $event) use($subscriber) {
                        // Is the event in the subscribed events of the subscriber? If not => event should not set
                        if(!in_array($event->get_id(), $subscriber->get_events())) return false;
                        // Check if event should be executed now
                        return $event->execute_now();
                    }));
                    return $subscriber;
                },
                $subscribers
            ),
            // Filter all subscribers with executable events
            function(Subscriber $subscriber) {
                return count($subscriber->get_events()) > 0;
            }
        );

        // loop through subscribers and send mail for given events
        foreach($subscribers as $subscriber) {
            MailHandler::send_to_subscriber($subscriber);
        }
    }

}