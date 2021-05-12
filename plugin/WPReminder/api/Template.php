<?php

namespace WPReminder\api;

use WPReminder\api\objects\Event;
use WPReminder\api\objects\Settings;
use WPReminder\api\objects\Subscriber;
use WPReminder\PluginException;
use WPReminder\db\DatabaseException;

final class Template
{

    /**
     * @var string
     */
    private string $content;

    /**
     * Template constructor.
     * @param string $key
     * @throws PluginException
     */
    public function __construct(string $key) {
        $file = WP_REMINDER_BASE_DIR . "/templates/$key.html";
        if(!file_exists($file)) throw new PluginException("Cannot find template file for key '$key'");
        if(!is_readable($file)) throw new PluginException("Cannot read template file for key '$key'");

        $content = file_get_contents($file);
        if(!$content) throw new PluginException("No content in template file for key '$key'");
        $this->content = $content;
    }

    /**
     * @return string
     */
    public function get_content() : string {
        return $this->content;
    }

    /**
     * @throws APIException
     * @throws DatabaseException
     * @throws PluginException
     */
    public function render_events (Subscriber $subscriber, string $url) : string {
        $list = "<li>" . implode("</li><li>", array_map(fn(int $id) => Event::get($id)->get_name(), $subscriber->events)) . "</li>";
        $message = str_replace('${event_list}', "<ul>$list</ul>", $this->content);
        $message = str_replace('${confirm_link}', "<a href='$url'>" . __('Confirm your subscription', 'wp-reminder') . "</a>", $message);
        $settings = Settings::get();
        $edit_url = $settings->settings_page . '?wp-reminder-action=edit&wp-reminder-token=' . $subscriber->get_token();
        return str_replace('${unsubscribe_link}', "<a href='$edit_url'>" . __('Unsubscribe or edit subscription', 'wp-reminder') . "</a>", $message);
    }

    /**
     * @throws PluginException
     */
    public function render_success (Subscriber $subscriber) : string {
        $settings = Settings::get();
        $edit_url = $settings->settings_page . '?wp-reminder-subscriber-token=' . $subscriber->get_token();
        return str_replace('${unsubscribe_link}', "<a href='$edit_url'>" . __('Unsubscribe or edit subscription', 'wp-reminder') . "</a>", $this->content);
    }

}