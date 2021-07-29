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
     * @var array
     */
    private array $events;

    /**
     * Shortcode constructor.
     * @param string $name
     * @param array $events
     */
    public function __construct(string $name, array $events)
    {
        $this->name = $name;
        $this->events = $events;

        wp_enqueue_script('react-js');
        wp_enqueue_script('react-js-dom');
        wp_enqueue_script('wp-reminder-new-form.js');
        wp_enqueue_style('wp-reminder-frontend.css');

    }

    /**
     * @return string
     */
    public function render() : string {
        $list = implode(',', $this->events);
        $title = $this->name;
        return "<div id='wp-reminder-frontend-form' data-title='$title' datalist-events='$list'></div>";
    }


}