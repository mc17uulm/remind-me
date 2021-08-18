<?php

namespace RemindMe\cron;

use RemindMe\api\objects\Event;
use RemindMe\api\objects\Subscriber;
use RemindMe\mail\MailHandler;
use RemindMe\db\DatabaseException;
use RemindMe\PluginException;

/**
 * Class CronJob
 * @package RemindMe\cron
 */
final class CronJob {

    public static function activate() : void {
        if(!wp_next_scheduled('remind_me_cron_job')) {
            wp_schedule_event(time(), 'daily', 'remind_me_cron_job');
        }
    }

    public static function remove() : void {
        wp_clear_scheduled_hook('remind_me_cron_job');
    }

    /**
     * @throws DatabaseException
     * @throws PluginException
     */
    public static function run() : void {

        $events = array_filter(
            Event::get_all(),
            function (Event $event) {
                return $event->should_execute_now();
            }
        );

        // all subscribers that are active and have executable events subscribed
        $subscribers = array_filter(
            array_map(
                function (Subscriber $subscriber) use ($events) {
                    $subscriber->set_executable_events($events);
                    return $subscriber;
                },
                array_filter(
                    Subscriber::get_all(),
                    fn(Subscriber $subscriber) => $subscriber->is_active()
                )
            ),
            function (Subscriber $subscriber) {
                return $subscriber->has_executable_events();
            }
        );

        // loop through subscribers and send mail for given events
        foreach($subscribers as $subscriber) {
            assert($subscriber instanceof Subscriber);
            MailHandler::send_to_subscriber($subscriber);
        }

        // loop through events and update last execution
        foreach($events as $event) {
            assert($event instanceof Event);
            $event->update_execution();
        }
    }

    /**
     * @param string $file
     * @param mixed $data
     * @param bool $append
     */
    private static function print_log(string $file, $data, bool $append = false) : void {
        file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT), $append ? FILE_APPEND : 0);
    }

}