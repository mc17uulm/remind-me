<?php

namespace WPReminder;

/**
 * Class Shortcode
 * @package WPReminder
 */
final class Shortcode
{

    /**
     * @var string
     */
    private string $name;
    /**
     * @var array<int>
     */
    private array $events;

    /**
     * Shortcode constructor.
     * @param string $name
     * @param array<int> $events
     */
    public function __construct(string $name, array $events)
    {
        $this->name = $name;
        $this->events = $events;

        wp_enqueue_script('wp-reminder-frontend.js');
        wp_enqueue_style('wp-reminder-frontend.css');
    }

    public function render() : string {
        $list = implode(',', $this->events);
        return "
            <div>
                <h4>{$this->name}</h4>
                <div id='wp-reminder-frontend-form' datalist-events='$list'></div>
            </div>
        ";
    }


}