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

        // get all events that should be executed now
        $events = array_filter(
            Event::get_all(),
            function(Event $event) {
                return $event->should_execute_now();
            }
        );

        // all subscribers that have executable events subscribed
        $subscribers = array_filter(
            array_map(
                function(Subscriber $subscriber) use($events) {
                    $subscriber->set_executable_events($events);
                    return $subscriber;
                },
                Subscriber::get_all()
            ),
            function(Subscriber $subscriber) {
                return $subscriber->has_executable_events();
            }
        );

        // loop through subscribers and send mail for given events
        foreach($subscribers as $subscriber) {
            MailHandler::send_to_subscriber($subscriber);
        }

        // loop through events and update last execution
        foreach($events as $event) {
            assert($event instanceof Event);
            $event->update_execution();
        }
    }

}