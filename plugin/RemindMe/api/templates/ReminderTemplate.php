<?php

namespace RemindMe\api\templates;

use RemindMe\api\handler\LinkHandler;
use RemindMe\api\objects\Event;
use RemindMe\api\objects\Settings;
use RemindMe\api\objects\Subscriber;
use RemindMe\PluginException;
use RemindMe\api\APIException;
use RemindMe\db\DatabaseException;

/**
 * Class ReminderTemplate
 * @package RemindMe\api\templates
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
            'remind-me-action' => 'edit',
            'remind-me-token' => $subscriber->get_token()
        ], LinkHandler::get_site());
        $list = "<li>" . implode("</li><li>", array_map(fn(int $id) => Event::get($id)->get_name(), $subscriber->events)) . "</li>";
        $message = str_replace('${event_list}', "<ul>$list</ul>", $this->html);
        return str_replace('${unsubscribe_link}', "<a href='$edit_url'>" . __('Unsubscribe or edit subscription', 'remind-me') . "</a>", $message);
    }

    /**
     * @param callable|null $build
     * @return string
     */
    public static function create(callable $build = null): string
    {
        return parent::create(function() {
            ?>
            <h1 class="ql-align-center"><?php echo __('Company name', 'remind-me') ?></h1>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center"><?php echo __('We remind you for the following events:', 'remind-me') ?></p>
            <p class="ql-align-center">${event_list}.</p>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center">--</p>
            <p class="ql-align-center"><?php echo __('Company name | Street 1 | 12345 City', 'remind-me') ?></p>
            <p class="ql-align-center"><?php echo __('Unsubscribe or edit subscription: ${unsubscribe_link}') ?></p>
            <?php
        });
    }

}