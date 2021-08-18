<?php

namespace RemindMe\api\objects;

use RemindMe\api\objects\settings\License;
use RemindMe\api\objects\settings\Messages;
use RemindMe\api\objects\settings\Templates;
use RemindMe\PluginException;
use RemindMe\Site;

/**
 * Class Settings
 * @package RemindMe\api\objects
 */
final class Settings {

    /**
     * WP options key
     */
    public const KEY = "remind_me_settings";

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
    public string $privacy_text;

    /**
     * Settings constructor.
     * @param Messages $messages
     * @param License $license
     * @param string $privacy_text
     */
    public function __construct(
        Messages $messages,
        License $license,
        string $privacy_text
    )
    {
        $this->messages = $messages;
        $this->license = $license;
        $this->privacy_text = $privacy_text;
    }

    /**
     * @param bool $public
     * @return array
     */
    public function to_json(bool $public = false) : array {
        $json = [
            'messages' => $this->messages->to_json(),
            'privacy_text' => esc_html($this->privacy_text)
        ];
        if($public) {
            $json['license'] = $this->license->active;
        } else {
            $json['license'] = $this->license->to_json();
        }
        return $json;
    }

    /**
     * @return array
     */
    private function to_db() : array {
        return [
            'messages' => $this->messages->to_db(),
            'license' => $this->license->to_db(),
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
                new Messages($options['messages']),
                new License($options['license']),
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
            Messages::create_default(),
            License::create_default(),
            __('I accept the privacy settings. By checking this field you accept the transport and processing of your data by the provider of this webpage.', 'remind-me')
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