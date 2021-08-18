<?php

namespace RemindMe\api\objects\settings;

/**
 * Class Messages
 * @package RemindMe\api\objects\settings
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
            'signin' => esc_html($this->signin),
            'signout' => esc_html($this->signout),
            'double_opt_in' => esc_html($this->double_opt_in)
        ];
    }

    /**
     * @return array
     */
    public function to_db() : array {
        return [
            'signin' => sanitize_text_field($this->signin),
            'signout' => sanitize_text_field($this->signout),
            'double_opt_in' => sanitize_text_field($this->double_opt_in)
        ];
    }

    /**
     * @return Messages
     */
    public static function create_default() : Messages {
        return new Messages([
            'signin' => __('You signed in successful. We send you an email to confirm your subscription', 'remind-me'),
            'signout' => __('You signed out from the subscriptions', 'remind-me'),
            'double_opt_in' => __('You confirmed your subscription successful.', 'remind-me')
        ]);
    }

}