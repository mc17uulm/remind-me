<?php

namespace WPReminder;

/**
 * Class Log
 * @package WPReminder
 */
final class Log
{

    /**
     * @param string $message
     */
    public static function error(string $message) : void {
        error_log("WPReminder | ERROR | $message");
    }

}