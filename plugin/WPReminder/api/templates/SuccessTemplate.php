<?php

namespace WPReminder\api\templates;

use WPReminder\api\objects\Settings;
use WPReminder\api\objects\Subscriber;
use WPReminder\PluginException;

/**
 * Class SuccessTemplate
 * @package WPReminder\api\templates
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
        $settings = Settings::get();
        $edit_url = self::parse_url($settings->settings_page, [
            'wp-reminder-action=edit',
            'wp-reminder-token=' . $subscriber->get_token()
        ]);
        return str_replace('${unsubscribe_link}', "<a href='$edit_url'>" . __('Unsubscribe or edit subscription', 'wp-reminder') . "</a>", $this->html);
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
            <p class="ql-align-center"><?= __('Your subscription was activated.', 'wp-reminder') ?></p>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center"><?= __('You can now enjoy our service.', 'wp-reminder') ?></p>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center"><?= __('If you want to change your subscription or unsubscribe, just click here: ${unsubscribe_link}', 'wp-reminder') ?></p>
            <p class="ql-align-center"><br></p>
            <p class="ql-align-center">--</p>
            <p class="ql-align-center"><?= __('Company name | Street 1 | 12345 City', 'wp-reminder') ?></p>
            <p class="ql-align-center"><?= __('Unsubscribe or edit subscription: ${unsubscribe_link}') ?></p>
            <?php
        });
    }

}