<?php

namespace WPReminder\api\templates;

use WPReminder\api\handler\LinkHandler;
use WPReminder\api\objects\Event;
use WPReminder\api\objects\Settings;
use WPReminder\api\objects\Subscriber;
use WPReminder\PluginException;
use WPReminder\api\APIException;
use WPReminder\db\DatabaseException;

/**
 * Class ReminderTemplate
 * @package WPReminder\api\templates
 */
final class ReminderTemplate extends Template
{

    /**
     * ReminderTemplate constructor.
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
        $edit_url = add_query_arg([
            'wp-reminder-action' => 'edit',
            'wp-reminder-token' => $subscriber->get_token()
        ], LinkHandler::get_site());
        $list = "<li>" . implode("</li><li>", array_map(fn(int $id) => Event::get($id)->get_name(), $subscriber->events)) . "</li>";
        $message = str_replace('${event_list}', "<ul>$list</ul>", $this->html);
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
            <p class="ql-align-center"><?= __('We remind you for the following events:', 'wp-reminder') ?></p>
            <p class="ql-align-center">${event_list}.</p>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center">--</p>
            <p class="ql-align-center"><?= __('Company name | Street 1 | 12345 City', 'wp-reminder') ?></p>
            <p class="ql-align-center"><?= __('Unsubscribe or edit subscription: ${unsubscribe_link}') ?></p>
            <?php
        });
    }

}