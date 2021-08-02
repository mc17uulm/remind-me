<?php

namespace WPReminder\mail;

use PHPMailer\PHPMailer\PHPMailer;
use WPReminder\api\APIException;
use WPReminder\api\objects\Event;
use WPReminder\api\objects\settings\Templates;
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

        $templates = Templates::get();

        self::send_mail(
            ['email' => $subscriber->email],
            sprintf('%s | %s', $templates->reminder->subject, get_bloginfo('name')),
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
            sprintf('%s | %s', $templates->confirm->subject, get_bloginfo('name')),
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
            sprintf('%s | %s', $templates->success->subject, get_bloginfo('name')),
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
            sprintf('%s | %s', $templates->signout->subject, get_bloginfo('name')),
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
        if(!defined('WP_REMINDER_DEBUG')) die('invalid request');
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

	        if($_SERVER['REMOTE_ADDR'] === '127.0.0.1'){
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
        $mailer->FromName = get_bloginfo('name');
        $mailer->From = 'test@code-leaf.de';
    }

}
