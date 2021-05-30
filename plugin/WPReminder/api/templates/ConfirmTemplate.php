<?php

namespace WPReminder\api\templates;

use WPReminder\api\objects\Event;
use WPReminder\api\objects\Settings;
use WPReminder\api\objects\Subscriber;
use WPReminder\api\objects\Token;
use WPReminder\PluginException;
use WPReminder\api\APIException;
use WPReminder\db\DatabaseException;

/**
 * Class ConfirmTemplate
 * @package WPReminder\api\templates
 */
final class ConfirmTemplate extends Template
{

    /**
     * ConfirmTemplate constructor.
     * @param string $html
     * @param string $subject
     */
    public function __construct(string $html, string $subject)
    {
        parent::__construct($html, $subject);
    }

    /**
     * @param Subscriber $subscriber
     * @return string
     * @throws APIException
     * @throws DatabaseException
     * @throws PluginException
     */
    public function render(Subscriber $subscriber): string
    {
        $settings = Settings::get();
        $token = Token::create($subscriber->id, "activate");
        $url = $settings->settings_page . "?wp-reminder-action=activate&wp-reminder-token=" . $token->get_token();
        $list = "<li>" . implode("</li><li>", array_map(fn(int $id) => Event::get($id)->get_name(), $subscriber->events)) . "</li>";
        $message = str_replace('${event_list}', "<ul>$list</ul>", $this->html);
        $message = str_replace('${confirm_link}', "<a href='$url'>" . __('Confirm your subscription', 'wp-reminder') . "</a>", $message);
        $settings = Settings::get();
        $edit_url = self::parse_url($settings->settings_page, [
            'wp-reminder-action=edit',
            'wp-reminder-token=' . $subscriber->get_token()
        ]);
        return str_replace('${unsubscribe_link}', "<a href='$edit_url'>" . __('Unsubscribe or edit subscription', 'wp-reminder') . "</a>", $message);
    }

    /**
     * @param callable|null $build
     * @return string
     */
    public static function create(callable $build = null): string
    {
        return parent::create(function() {
            ?>
            <h1 class="ql-align-center"><?= __('Company name', 'wp-reminder') ?></h1>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center"><?= __('Thank you for subscribing our reminders:', 'wp-reminder') ?></p>
            <p class="ql-align-center">${event_list}.</p>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center"><?= __('To finish you subscription, please click this link: ${confirm_link}.', 'wp-reminder') ?></p>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center">
                <em><?= __("If you haven't subscribed to our service, you can delete this email. Your subscription is only activated after clicking the above link.", 'wp-reminder') ?></em>
            </p>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center">--</p>
            <p class="ql-align-center"><?= __('Company name | Street 1 | 12345 City', 'wp-reminder') ?></p>
            <p class="ql-align-center"><?= __('Unsubscribe or edit subscription: ${unsubscribe_link}') ?></p>
            <?php
        });
    }

}