<?php

namespace WPReminder\api\objects;

use WPReminder\api\Template;
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
     * @var string
     */
    public string $text_privacy;
    /**
     * @var string
     */
    public string $template_check;
    /**
     * @var string
     */
    public string $subject_check;
    /**
     * Template for accept email after successful double-opt-in
     * @var string
     */
    public string $template_accept;
    /**
     * @var string
     */
    public string $subject_accept;
    /**
     * Template for info email after list signout
     * @var string
     */
    public string $template_signout;
    /**
     * @var string
     */
    public string $subject_signout;
    /**
     * @var string
     */
    public string $template_email;
    /**
     * @var string
     */
    public string $subject_email;
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
     * @var string
     */
    public string $settings_page;

    /**
     * Settings constructor.
     * @param string $text_privacy
     * @param string $template_check
     * @param string $subject_check
     * @param string $template_accept
     * @param string $subject_accept
     * @param string $template_signout
     * @param string $subject_signout
     * @param string $template_email
     * @param string $subject_email
     * @param string $signin_msg
     * @param string $double_opt_in_msg
     * @param string $signout_msg
     * @param string $settings_page
     */
    public function __construct(
        string $text_privacy,
        string $template_check,
        string $subject_check,
        string $template_accept,
        string $subject_accept,
        string $template_signout,
        string $subject_signout,
        string $template_email,
        string $subject_email,
        string $signin_msg,
        string $double_opt_in_msg,
        string $signout_msg,
        string $settings_page
    )
    {
        $this->text_privacy = $text_privacy;
        $this->template_check = $template_check;
        $this->subject_check = $subject_check;
        $this->template_accept = $template_accept;
        $this->subject_accept = $subject_accept;
        $this->template_signout = $template_signout;
        $this->subject_signout = $subject_signout;
        $this->template_email = $template_email;
        $this->subject_email = $subject_email;
        $this->signin_msg = $signin_msg;
        $this->double_opt_in_msg = $double_opt_in_msg;
        $this->signout_msg = $signout_msg;
        $this->settings_page = $settings_page;
    }

    /**
     * @return array
     */
    public function to_json() : array {
        return [
            'text_privacy' => $this->text_privacy,
            'template_check' => $this->template_check,
            'subject_check' => $this->subject_check,
            'template_accept' => $this->template_accept,
            'subject_accept' => $this->subject_accept,
            'template_signout' => $this->template_signout,
            'subject_signout' => $this->subject_signout,
            'template_email' => $this->template_email,
            'subject_email' => $this->subject_email,
            'signin_msg' => $this->signin_msg,
            'double_opt_in_msg' => $this->double_opt_in_msg,
            'signout_msg' => $this->signout_msg,
            'settings_page' => $this->settings_page
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
                $options['subject_check'],
                $options['template_accept'],
                $options['subject_accept'],
                $options['template_signout'],
                $options['subject_signout'],
                $options['template_email'],
                $options['subject_email'],
                $options['signin_msg'],
                $options['double_opt_in_msg'],
                $options['signout_msg'],
                $options['settings_page']
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
            sprintf(__('Confirm your subscription | %s', 'wp-reminder'), get_bloginfo('name')),
            self::load_template('accept'),
            sprintf(__('Successfully subscribed | %s', 'wp-reminder'), get_bloginfo('name')),
            self::load_template('signout'),
            sprintf(__('Successfully unsubscribed | %s', 'wp-reminder'), get_bloginfo('name')),
            self::load_template('email'),
            sprintf(__('Reminder | %s', 'wp-reminder'), get_bloginfo('name')),
            __('You signed in successful. We send you an email to confirm your subscription', 'wp-reminder'),
            __('You confirmed your subscription successful.', 'wp-reminder'),
            __('You signed out from the subscriptions', 'wp-reminder'),
            Site::load('guid')
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