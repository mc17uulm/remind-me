<?php

namespace WPReminder\api\objects\settings;

use WPReminder\api\templates\ConfirmTemplate;
use WPReminder\api\templates\ReminderTemplate;
use WPReminder\api\templates\SignoutTemplate;
use WPReminder\api\templates\SuccessTemplate;

/**
 * Class Templates
 * @package WPReminder\api\objects\settings
 */
final class Templates
{

    /**
     * @var ConfirmTemplate
     */
    public ConfirmTemplate $confirm;
    /**
     * @var SuccessTemplate
     */
    public SuccessTemplate $success;
    /**
     * @var SignoutTemplate
     */
    public SignoutTemplate $signout;
    /**
     * @var ReminderTemplate
     */
    public ReminderTemplate $reminder;

    /**
     * Templates constructor.
     * @param array $options
     */
    public function __construct(array $options)
    {
        $this->confirm = new ConfirmTemplate($options['confirm']['html'], $options['confirm']['subject']);
        $this->success = new SuccessTemplate($options['success']['html'], $options['success']['subject']);
        $this->signout = new SignoutTemplate($options['signout']['html'], $options['signout']['subject']);
        $this->reminder = new ReminderTemplate($options['reminder']['html'], $options['reminder']['subject']);
    }

    /**
     * @return array
     */
    public function to_json() : array {
        return [
            'confirm' => $this->confirm->to_json(),
            'success' => $this->success->to_json(),
            'signout' => $this->signout->to_json(),
            'reminder' => $this->reminder->to_json()
        ];
    }

    /**
     * @return array
     */
    public function to_db() : array {
        return [
            'confirm' => $this->confirm->to_db(),
            'success' => $this->success->to_db(),
            'signout' => $this->signout->to_db(),
            'reminder' => $this->reminder->to_db()
        ];
    }

    /**
     * @return Templates
     */
    public static function create_default() : Templates {
        return new Templates([
            'confirm' => [
                'html' => ConfirmTemplate::create(),
                'subject' => sprintf(__('Confirm your subscription | %s', 'wp-reminder'), get_bloginfo('name'))
            ],
            'success' => [
                'html' => SuccessTemplate::create(),
                'subject' => sprintf(__('Successfully subscribed | %s', 'wp-reminder'), get_bloginfo('name'))
            ],
            'signout' => [
                'html' => SignoutTemplate::create(),
                'subject' => sprintf(__('Successfully unsubscribed | %s', 'wp-reminder'), get_bloginfo('name'))
            ],
            'reminder' => [
                'html' => ReminderTemplate::create(),
                'subject' => sprintf(__('Reminder | %s', 'wp-reminder'), get_bloginfo('name'))
            ],
        ]);
    }

}