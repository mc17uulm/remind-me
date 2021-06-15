<?php

namespace WPReminder\api\objects;

use WPReminder\api\objects\settings\License;
use WPReminder\api\objects\settings\Messages;
use WPReminder\api\objects\settings\Templates;
use WPReminder\PluginException;
use WPReminder\Site;

/**
 * Class Settings
 * @package WPReminder\api\objects
 */
final class Settings {

    /**
     * WP options key
     */
    public const KEY = "wp_reminder_settings";

    /**
     * @var Templates
     */
    public Templates $templates;
    /**
     * @var Messages
     */
    public Messages $messages;
    /**
     * @var License
     */
    public License $license;
    /**
     * @var string
     */
    public string $settings_page;
    /**
     * @var string
     */
    public string $privacy_text;

    /**
     * Settings constructor.
     * @param Templates $templates
     * @param Messages $messages
     * @param License $license
     * @param string $settings_page
     * @param string $privacy_text
     */
    public function __construct(
        Templates $templates,
        Messages $messages,
        License $license,
        string $settings_page,
        string $privacy_text
    )
    {
        $this->templates = $templates;
        $this->messages = $messages;
        $this->license = $license;
        $this->settings_page = $settings_page;
        $this->privacy_text = $privacy_text;
    }

    /**
     * @return array
     */
    public function to_json() : array {
        return [
            'templates' => $this->templates->to_json(),
            'messages' => $this->messages->to_json(),
            'license' => $this->license->to_json(),
            'settings_page' => esc_url($this->settings_page),
            'privacy_text' => esc_html($this->privacy_text)
        ];
    }

    /**
     * @return array
     */
    private function to_db() : array {
        return [
            'templates' => $this->templates->to_db(),
            'messages' => $this->messages->to_db(),
            'license' => $this->license->to_db(),
            'settings_page' => esc_url_raw($this->settings_page),
            'privacy_text' => sanitize_text_field($this->privacy_text)
        ];
    }

    /**
     * @return Settings
     * @throws PluginException
     */
    public static function get() : Settings {
        $options = get_option(self::KEY);
        if($options) {
            return new Settings(
                new Templates($options['templates']),
                new Messages($options['messages']),
                new License($options['license']),
                $options['settings_page'],
                $options['privacy_text']
            );
        }
        throw new PluginException("No options found");
    }

    /**
     * @return bool
     * @throws PluginException
     */
    public static function create_default() : bool {

        return self::set(new Settings(
            Templates::create_default(),
            Messages::create_default(),
            License::create_default(),
            Site::load('guid'),
            __('I accept the privacy settings. By checking this field you accept the transport and processing of your data by the provider of this webpage.', 'wp-reminder')
        ));
    }

    /**
     * @param Settings $settings
     * @return bool
     * @throws PluginException
     */
    public static function set(Settings $settings) : bool {
        return self::update($settings);
    }

    /**
     * @param Settings $settings
     * @return bool
     * @throws PluginException
     */
    public static function update(Settings $settings) : bool {
        if($settings->license->code !== '') {
            $settings->license->check();
        }
        return update_option(
            self::KEY, $settings->to_db()
        );
    }

    /**
     * @return bool
     */
    public static function delete() : bool {
        return delete_option(self::KEY);
    }

}