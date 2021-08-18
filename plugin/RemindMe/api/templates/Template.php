<?php

namespace RemindMe\api\templates;

use RemindMe\api\objects\Subscriber;

/**
 * Class Template
 * @package RemindMe\api\templates
 */
class Template {

    /**
     *
     */
    private const TAGS = [
        'a' => [
            'href' => true,
            'title' => true
        ],
        'br' => [],
        'em' => [],
        'strong' => [],
        'b' => [],
        'h1' => [
            'class' => true
        ],
        'h2' => [
            'class' => true
        ],
        'h3' => [
            'class' => true
        ],
        'h4' => [
            'class' => true
        ],
        'h5' => [
            'class' => true
        ],
        'h6' => [
            'class' => true
        ],
        'hr' => [],
        'p' => [
            'class' => true
        ]
    ];

    /**
     * @var string
     */
    public string $html;
    /**
     * @var string
     */
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
            'html' => wp_kses($this->html, self::TAGS),
            'subject' => esc_html($this->subject)
        ];
    }

    /**
     * @return array
     */
    public function to_db() : array {
        return [
            'html' => wp_kses($this->html, self::TAGS),
            'subject' => sanitize_text_field($this->subject)
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