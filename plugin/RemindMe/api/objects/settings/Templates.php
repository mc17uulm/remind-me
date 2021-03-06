<?php

namespace RemindMe\api\objects\settings;

use RemindMe\api\templates\ConfirmTemplate;
use RemindMe\api\templates\ReminderTemplate;
use RemindMe\api\templates\SignoutTemplate;
use RemindMe\api\templates\SuccessTemplate;
use RemindMe\PluginException;

/**
 * Class Templates
 * @package RemindMe\api\objects\settings
 */
final class Templates
{

    public const KEY = 'remind_me_templates';

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
     * @return bool
     */
    public static function create_default() : bool {
        return self::set(new Templates([
            'confirm' => [
                'html' => ConfirmTemplate::create(),
                'subject' => sprintf(__('Confirm your subscription | %s', 'remind-me'), get_bloginfo('name'))
            ],
            'success' => [
                'html' => SuccessTemplate::create(),
                'subject' => sprintf(__('Successfully subscribed | %s', 'remind-me'), get_bloginfo('name'))
            ],
            'signout' => [
                'html' => SignoutTemplate::create(),
                'subject' => sprintf(__('Successfully unsubscribed | %s', 'remind-me'), get_bloginfo('name'))
            ],
            'reminder' => [
                'html' => ReminderTemplate::create(),
                'subject' => sprintf(__('Reminder | %s', 'remind-me'), get_bloginfo('name'))
            ],
        ]));
    }

    /**
     * @return Templates
     * @throws PluginException
     */
    public static function get(): Templates {
        $options = get_option(self::KEY);
        if($options) {
            return new Templates($options);
        }
        throw new PluginException('No options for templates found');
    }

    /**
     * @param Templates $templates
     * @return bool
     */
    public static function set(Templates $templates) : bool {
        return self::update($templates);
    }

    /**
     * @param Templates $templates
     * @return bool
     */
    public static function update(Templates $templates) : bool {
        return update_option(self::KEY, $templates->to_db());
    }

    /**
     * @return bool
     */
    public static function delete() : bool {
        return delete_option(self::KEY);
    }

}