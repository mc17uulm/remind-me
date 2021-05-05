<?php

namespace WPReminder\api\objects;

use WPReminder\api\Template;
use WPReminder\PluginException;

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
     * @var string
     */
    public string $text_privacy;
    /**
     * @var string
     */
    public string $template_check;
    /**
     * Template for accept email after successful double-opt-in
     * @var string
     */
    public string $template_accept;
    /**
     * Template for info email after list signout
     * @var string
     */
    public string $template_signout;
    /**
     * @var string
     */
    public string $signin_msg;
    /**
     * @var string
     */
    public string $double_opt_in_msg;
    /**
     * @var string
     */
    public string $signout_msg;

    /**
     * Settings constructor.
     * @param string $text_privacy
     * @param string $template_check
     * @param string $template_accept
     * @param string $template_signout
     * @param string $signin_msg
     * @param string $double_opt_in_msg
     * @param string $signout_msg
     */
    public function __construct(
        string $text_privacy,
        string $template_check,
        string $template_accept,
        string $template_signout,
        string $signin_msg,
        string $double_opt_in_msg,
        string $signout_msg
    )
    {
        $this->text_privacy = $text_privacy;
        $this->template_check = $template_check;
        $this->template_accept = $template_accept;
        $this->template_signout = $template_signout;
        $this->signin_msg = $signin_msg;
        $this->double_opt_in_msg = $double_opt_in_msg;
        $this->signout_msg = $signout_msg;
    }

    /**
     * @return array
     */
    public function to_json() : array {
        return [
            'text_privacy' => $this->text_privacy,
            'template_check' => $this->template_check,
            'template_accept' => $this->template_accept,
            'template_signout' => $this->template_signout,
            'signin_msg' => $this->signin_msg,
            'double_opt_in_msg' => $this->double_opt_in_msg,
            'signout_msg' => $this->signout_msg
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
                $options['text_privacy'],
                $options['template_check'],
                $options['template_accept'],
                $options['template_signout'],
                $options['signin_msg'],
                $options['double_opt_in_msg'],
                $options['signout_msg']
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
            __('I accept the privacy settings. By checking this field you accept the transport and processing of your data by the provider of this webpage.', 'wp-reminder'),
            self::load_template('check'),
            self::load_template('accept'),
            self::load_template('signout'),
            __('You signed in successful. We send you an email to confirm your subscription', 'wp-reminder'),
            __('You confirmed your subscription successful.', 'wp-reminder'),
            __('You signed out from the subscriptions', 'wp-reminder')
        ));
    }

    /**
     * @param Settings $settings
     * @return bool
     */
    public static function set(Settings $settings) : bool {
        return self::update($settings);
    }

    /**
     * @param Settings $settings
     * @return bool
     */
    public static function update(Settings $settings) : bool {
        return update_option(
            self::KEY, $settings->to_json()
        );
    }

    /**
     * @return bool
     */
    public static function delete() : bool {
        return delete_option(self::KEY);
    }

    /**
     * @param string $key
     * @return string
     * @throws PluginException
     */
    public static function load_template(string $key) : string {
        return (new Template($key))->get_content();
    }


}