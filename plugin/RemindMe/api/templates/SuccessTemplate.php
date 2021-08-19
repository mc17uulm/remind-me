<?php

namespace RemindMe\api\templates;

use RemindMe\api\handler\LinkHandler;
use RemindMe\api\objects\Settings;
use RemindMe\api\objects\Subscriber;
use RemindMe\PluginException;

/**
 * Class SuccessTemplate
 * @package RemindMe\api\templates
 */
final class SuccessTemplate extends Template
{

    /**
     * SuccessTemplate constructor.
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
     * @throws PluginException
     */
    public function render(Subscriber $subscriber): string
    {
        $edit_url = add_query_arg([
            'remind-me-action' => 'edit',
            'remind-me-token' => $subscriber->get_token()
        ], LinkHandler::get_site());
        return str_replace('${unsubscribe_link}', "<a href='$edit_url'>" . __('Unsubscribe or edit subscription', 'remind-me') . "</a>", $this->html);
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
            <p class="ql-align-center"><?php echo __('Your subscription was activated.', 'remind-me') ?></p>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center"><?php echo __('You can now enjoy our service.', 'remind-me') ?></p>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center"><?php echo __('If you want to change your subscription or unsubscribe, just click here: ${unsubscribe_link}', 'remind-me') ?></p>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center">--</p>
            <p class="ql-align-center"><?php echo __('Company name | Street 1 | 12345 City', 'remind-me') ?></p>
            <p class="ql-align-center"><?php echo __('Unsubscribe or edit subscription: ${unsubscribe_link}') ?></p>
            <?php
        });
    }

}