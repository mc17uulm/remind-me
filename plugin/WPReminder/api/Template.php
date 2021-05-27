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
        $file = WP_REMINDER_DIR . "/templates/$key.html";
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
     * @param Subscriber $subscriber
     * @param string $url
     * @return string
     * @throws APIException
     * @throws DatabaseException
     * @throws PluginException
     */
    public function render_events (Subscriber $subscriber, string $url) : string {
        $list = "<li>" . implode("</li><li>", array_map(fn(int $id) => Event::get($id)->get_name(), $subscriber->events)) . "</li>";
        $message = str_replace('${event_list}', "<ul>$list</ul>", $this->content);
        $message = str_replace('${confirm_link}', "<a href='$url'>" . __('Confirm your subscription', 'wp-reminder') . "</a>", $message);
        $settings = Settings::get();
        $edit_url = self::parse_url($settings->settings_page, [
            'wp-reminder-action=edit',
            'wp-reminder-token=' . $subscriber->get_token()
        ]);
        return str_replace('${unsubscribe_link}', "<a href='$edit_url'>" . __('Unsubscribe or edit subscription', 'wp-reminder') . "</a>", $message);
    }

    /**
     * @param Subscriber $subscriber
     * @return string
     * @throws PluginException
     */
    public function render_success (Subscriber $subscriber) : string {
        $settings = Settings::get();
        $edit_url = self::parse_url($settings->settings_page, [
            'wp-reminder-action=edit',
            'wp-reminder-token=' . $subscriber->get_token()
        ]);
        return str_replace('${unsubscribe_link}', "<a href='$edit_url'>" . __('Unsubscribe or edit subscription', 'wp-reminder') . "</a>", $this->content);
    }

    /**
     * @return string
     */
    public function render_unsubscription () : string {
        return $this->content;
    }

    /**
     * @param Subscriber $subscriber
     * @return string
     * @throws PluginException
     */
    public function render_reminder (Subscriber $subscriber) : string {
        $settings = Settings::get();
        $edit_url = self::parse_url($settings->settings_page, [
            'wp-reminder-action=edit',
            'wp-reminder-token=' . $subscriber->get_token()
        ]);
        $list = "<li>" . implode("</li><li>", array_map(fn(int $id) => Event::get($id)->get_name(), $subscriber->events)) . "</li>";
        $message = str_replace('${events_list}', "<ul>$list</ul>", $this->content);
        return str_replace('${unsubscribe_link}', "<a href='$edit_url'>" . __('Unsubscribe or edit subscription', 'wp-reminder') . "</a>", $message);
    }

    /**
     * @param string $url
     * @param array $params
     * @return string
     */
    public static function parse_url(string $url, array $params) : string {
        $parsed = parse_url($url);
        if(!isset($parsed['path'])) {
            $url .= '/';
        }
        $separator = isset($parsed['query']) ? '&' : '?';
        $query = join('&', $params);
        $url .= $separator . $query;
        return $url;
    }



}