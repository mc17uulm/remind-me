<?php

namespace RemindMe\mail;

require_once ABSPATH . WPINC . '/class-phpmailer.php';

use PHPMailer\PHPMailer\PHPMailer;
use RemindMe\api\APIException;
use RemindMe\api\objects\Event;
use RemindMe\api\objects\settings\Templates;
use RemindMe\api\objects\Subscriber;
use RemindMe\PluginException;
use RemindMe\db\DatabaseException;
use Exception;

/**
 * Class MailHandler
 * @package RemindMe\mail
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

        $templates = Templates::get();

        self::send_mail(
            ['email' => $subscriber->email],
            $templates->reminder->subject,
            $templates->reminder->render($subscriber)
        );
    }

    /**
     * @throws DatabaseException
     * @throws APIException | PluginException
     */
    public static function send_confirm(Subscriber $subscriber) : void {

        $templates = Templates::get();

        self::send_mail(
            ['email' => $subscriber->email],
            $templates->confirm->subject,
            $templates->confirm->render($subscriber)
        );
    }

    /**
     * @param Subscriber $subscriber
     * @throws PluginException
     */
    public static function send_success(Subscriber $subscriber) : void {
        $templates = Templates::get();

        self::send_mail(
            ['email' => $subscriber->email],
            $templates->success->subject,
            $templates->success->render($subscriber)
        );
    }

    /**
     * @param Subscriber $subscriber
     * @throws PluginException
     */
    public static function send_unsubscribe(Subscriber $subscriber) : void {
        $templates = Templates::get();

        self::send_mail(
            ['email' => $subscriber->email],
            $templates->signout->subject,
            $templates->signout->render($subscriber)
        );
    }

    /**
     * @param array $to
     * @param string $subject
     * @param string $content
     */
    private static function wp_send_mail(array $to, string $subject, string $content) : void {
        $headers[] = 'From: ' . get_bloginfo('name') . ' <noreply@' . get_site_url() . '>';

        wp_mail($to['email'], $subject, $content, $headers);
    }

    /**
     * @param array $to
     * @param string $subject
     * @param string $content
     * @throws PluginException
     */
    private static function send_mail(array $to, string $subject, string $content) : void {
        if(!defined('REMIND_ME_DEBUG')) die('invalid request');
        $mailer = new PHPMailer(true);
        try {
            $mailer->isHTML(true);
            $mailer->CharSet = 'utf-8';
            $mailer->From = 'noreply@' . $_SERVER['SERVER_NAME'];
            $mailer->FromName = get_bloginfo('name');
            $mailer->AddAddress($to['email']);
            $mailer->Subject = $subject;
            $mailer->Body = $content;
            $mailer->AltBody = strip_tags($content);

            // if script is executed in development on a local machine => use smtp settings in dev.mail.php
	        if($_SERVER['REMOTE_ADDR'] === '127.0.0.1'){
	            require_once REMIND_ME_DIR . '/dev.mail.php';
	            send_dev_mail($mailer);
            }

            if(!$mailer->send()) throw new PluginException($mailer->ErrorInfo);

        } catch (Exception $e) {
            throw new PluginException($e->getMessage());
        }
    }

}
