<?php

namespace WPReminder\api\objects\settings;

/**
 * Class Messages
 * @package WPReminder\api\objects\settings
 */
final class Messages
{

    /**
     * @var string
     */
    public string $signin;
    /**
     * @var string
     */
    public string $signout;
    /**
     * @var string
     */
    public string $double_opt_in;

    /**
     * Messages constructor.
     * @param array $options
     */
    public function __construct(array $options)
    {
        $this->signin = $options['signin'];
        $this->signout = $options['signout'];
        $this->double_opt_in = $options['double_opt_in'];
    }

    /**
     * @return array
     */
    public function to_json() : array {
        return [
            'signin' => $this->signin,
            'signout' => $this->signout,
            'double_opt_in' => $this->double_opt_in
        ];
    }

    /**
     * @return Messages
     */
    public static function create_default() : Messages {
        return new Messages([
            'signin' => __('You signed in successful. We send you an email to confirm your subscription', 'wp-reminder'),
            'signout' => __('You signed out from the subscriptions', 'wp-reminder'),
            'double_opt_in' => __('You confirmed your subscription successful.', 'wp-reminder')
        ]);
    }

}