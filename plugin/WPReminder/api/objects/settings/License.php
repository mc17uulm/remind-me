<?php

namespace WPReminder\api\objects\settings;

use WPReminder\api\objects\Settings;
use WPReminder\PluginException;

/**
 * Class License
 * @package WPReminder\api\objects\settings
 */
final class License
{

    /**
     * @var string
     */
    public string $code;
    /**
     * @var bool
     */
    public bool $active;
    /**
     * @var int
     */
    public int $til;
    /**
     * @var string
     */
    public string $status;

    /**
     * License constructor.
     * @param array $options
     */
    public function __construct(array $options)
    {
        $this->code = $options['code'];
        if(!isset($options['status'])) {
            $this->active = false;
            $this->til = -1;
            $this->status = 'License is not active';
        } else {
            $this->active = $options['active'];
            $this->til = $options['til'];
            $this->status = $options['status'];
        }
    }

    /**
     * @throws PluginException
     */
    public function check() : void {
        $this->active ? $this->doCheck() : $this->doRegister();
    }

    /**
     * @throws PluginException
     */
    private function doCheck() : void {
        $response = $this->send_request('https://plugins.code-leaf.de/license/check');
        $this->active = $response;
        $this->status = $this->active ? 'License is active' : 'License is not active';
    }

    /**
     * @throws PluginException
     */
    private function doRegister() : void {
        $response = $this->send_request('https://plugins.code-leaf.de/license/register');
        if($response === true) {
            $this->active = true;
            $this->status = 'License is activated';
        }
    }

    /**
     * @return mixed
     * @throws PluginException
     */
    private function send_request(string $url) {
        $response = wp_remote_post(
            $url,
            [
                'body' => json_encode([
                    'slug' => 'wp-reminder',
                    'key' => $this->code,
                    'url' => get_site_url()
                ])
            ]
        );
        $body = json_decode(wp_remote_retrieve_body($response), true);
        $code = wp_remote_retrieve_response_code($response);
        if($code !== 200) throw new PluginException($body['debug'] ?? '', __('Invalid license code', 'wp-reminder'));
        return $body;
    }

    public function reset() : void {
        $this->code = '';
        $this->active = false;
        $this->til = -1;
        $this->status = 'License is not active';
    }

    /**
     * @return array
     */
    public function to_json() : array {
        return [
            'code' => esc_html($this->code),
            'active' => $this->active,
            'til' => $this->til,
            'status' => esc_html($this->status)
        ];
    }

    /**
     * @return array
     */
    public function to_db() : array {
        return [
            'code' => sanitize_text_field($this->code),
            'active' => sanitize_text_field($this->active),
            'til' => sanitize_text_field($this->til),
            'status' => sanitize_text_field($this->status)
        ];
    }

    /**
     * @return License
     */
    public static function create_default() : License {
        return new License([
            'code' => '',
            'active' => false,
            'til' => -1,
            'status' => 'not registered'
        ]);
    }

    /**
     * @return bool
     * @throws PluginException
     */
    public static function remove() : bool {
        $settings = Settings::get();
        $settings->license->reset();
        return Settings::update($settings);
    }

}