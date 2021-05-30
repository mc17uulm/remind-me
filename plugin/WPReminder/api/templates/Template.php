<?php

namespace WPReminder\api\templates;

use WPReminder\api\objects\Subscriber;

/**
 * Class Template
 * @package WPReminder\api\templates
 */
class Template {

    /**
     * @var string
     */
    public string $html;
    public string $subject;

    /**
     * Template constructor.
     * @param string $html
     * @param string $subject
     */
    protected function __construct(string $html, string $subject) {
        $this->html = $html;
        $this->subject = $subject;
    }

    /**
     * @param Subscriber $subscriber
     * @return string
     */
    public function render(Subscriber $subscriber) : string {
        return $this->html;
    }

    /**
     * @return array
     */
    public function to_json() : array {
        return [
            'html' => $this->html,
            'subject' => $this->subject
        ];
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

    /**
     * @param callable|null $build
     * @return string
     */
    public static function create(callable $build = null) : string {
        ob_start();
        if($build !== null) {
            $build();
        }
        $content = ob_get_contents();
        ob_clean();
        return $content;
    }

}