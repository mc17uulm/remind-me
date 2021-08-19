<?php

namespace RemindMe\api\templates;

use RemindMe\api\handler\LinkHandler;
use RemindMe\api\objects\Event;
use RemindMe\api\objects\Subscriber;
use RemindMe\api\objects\Token;
use RemindMe\PluginException;
use RemindMe\api\APIException;
use RemindMe\db\DatabaseException;

/**
 * Class ConfirmTemplate
 * @package RemindMe\api\templates
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
        $token = Token::create($subscriber->get_id(), "activate");
        $url = add_query_arg([
            'remind-me-action' => 'activate',
            'remind-me-token' => $token->get_token()
        ], LinkHandler::get_site());
        $list = "<li>" . implode("</li><li>", array_map(fn(int $id) => Event::get($id)->get_name(), $subscriber->events)) . "</li>";
        $message = str_replace('${event_list}', "<ul>$list</ul>", $this->html);
        return str_replace('${confirm_link}', "<a href='$url'>" . __('Confirm your subscription', 'remind-me') . "</a>", $message);
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
            <p class="ql-align-center"><?php echo __('Thank you for subscribing our reminders:', 'remind-me') ?></p>
            <p class="ql-align-center">${event_list}.</p>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center"><?php echo __('To finish you subscription, please click this link: ${confirm_link}.', 'remind-me') ?></p>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center">
                <em><?php echo __("If you haven't subscribed to our service, you can delete this email. Your subscription is only activated after clicking the above link.", 'remind-me') ?></em>
            </p>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center">--</p>
            <p class="ql-align-center"><?php echo __('Company name | Street 1 | 12345 City', 'remind-me') ?></p>
            <?php
        });
    }

}