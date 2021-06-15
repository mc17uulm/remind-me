<?php

namespace WPReminder\mail;

use PHPMailer\PHPMailer\PHPMailer;
use WPReminder\api\APIException;
use WPReminder\api\objects\Event;
use WPReminder\api\objects\Settings;
use WPReminder\api\objects\Subscriber;
use WPReminder\PluginException;
use WPReminder\db\DatabaseException;
use Exception;

/**
 * Class MailHandler
 * @package WPReminder\mail
 */
final class MailHandler {

    /**
     * @param Subscriber $subscriber
     * @throws DatabaseException
     * @throws PluginException
     */
    public static function send_to_subscriber(Subscriber $subscriber) : void {

        // Check if events in events list are typeof Event
        $events = array_filter($subscriber->get_executable_events(), function($event) {
            return is_a($event, Event::class);
        });

        // if no events are found, there is nothing to send
        if(count($events) === 0) return;

        $settings = Settings::get();

        self::send_mail(
            ['email' => $subscriber->email],
            ['email' => get_bloginfo('admin_email'), 'name' => get_bloginfo('name')],
            sprintf('%s | %s', $settings->templates->reminder->subject, get_bloginfo('name')),
            $settings->templates->reminder->render($subscriber)
        );
    }

    /**
     * @throws DatabaseException
     * @throws APIException | PluginException
     */
    public static function send_confirm(Subscriber $subscriber) : void {

        $settings = Settings::get();

        self::send_mail(
            ['email' => $subscriber->email],
            ['email' => get_bloginfo('admin_email'), 'name' => get_bloginfo('name')],
            sprintf('%s | %s', $settings->templates->confirm->subject, get_bloginfo('name')),
            $settings->templates->confirm->render($subscriber)
        );
    }

    /**
     * @param Subscriber $subscriber
     * @throws PluginException
     */
    public static function send_success(Subscriber $subscriber) : void {
        $settings = Settings::get();

        self::send_mail(
            ['email' => $subscriber->email],
            ['email' => get_bloginfo('admin_email'), 'name' => get_bloginfo('name')],
            sprintf('%s | %s', $settings->templates->success->subject, get_bloginfo('name')),
            $settings->templates->success->render($subscriber)
        );
    }

    /**
     * @param Subscriber $subscriber
     * @throws PluginException
     */
    public static function send_unsubscribe(Subscriber $subscriber) : void {
        $settings = Settings::get();

        self::send_mail(
            ['email' => $subscriber->email],
            ['email', get_bloginfo('admin_email'), 'name' => get_bloginfo('name')],
            sprintf('%s | %s', $settings->templates->signout->subject, get_bloginfo('name')),
            $settings->templates->signout->render($subscriber)
        );
    }

    /**
     * @param array $to
     * @param array $from
     * @param string $subject
     * @param string $content
     * @throws PluginException
     */
    private static function send_mail(array $to, array $from, string $subject, string $content) : void {
        if(!defined('WP_REMINDER_DEBUG')) die('invalid request');
        $mailer = new PHPMailer(true);
        try {
            $mailer->isHTML(true);
            $mailer->CharSet = 'utf-8';
            $mailer->From = $from['email'];
            $mailer->FromName = $from['name'];
            $mailer->AddAddress($to['email']);
            $mailer->Subject = $subject;
            $mailer->Body = $content;
            $mailer->AltBody = strip_tags($content);

            if(WP_REMINDER_DEBUG) {
                self::dev_send_mail($mailer);
            }

            if(!$mailer->send()) throw new PluginException($mailer->ErrorInfo);

        } catch (Exception $e) {
            throw new PluginException($e->getMessage());
        }
    }

    /**
     * @param PHPMailer $mailer
     */
    private static function dev_send_mail(PHPMailer &$mailer) : void {
        $mailer->SMTPDebug = 0;
        $mailer->isSMTP();
        $mailer->SMTPAuth = true;
        $mailer->Username = "test@code-leaf.de";
        $mailer->Password = "deploy123";
        $mailer->Port = 25;
        $mailer->Host = 'code-leaf.de';
        $mailer->FromName = 'Deploy code-leaf.de';
        $mailer->From = 'test@code-leaf.de';
    }

}