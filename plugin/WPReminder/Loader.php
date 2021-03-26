<?php

namespace WPReminder;

/**
 * Class Loader
 * @package WPReminder
 */
final class Loader {

    /**
     * @param string $file
     */
    public function run(string $file) : void {

        if(defined("WP_REMINDER_DEBUG") && WP_REMINDER_DEBUG) {
            define( 'WP_DEBUG', true );
            define( 'WP_DEBUG_DISPLAY', true );
            define( 'WP_DEBUG_LOG', true );
        }

    }

}