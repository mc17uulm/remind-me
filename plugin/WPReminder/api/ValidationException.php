<?php

namespace WPReminder\api;

use WPReminder\PluginException;

/**
 * Class ValidationExceptions
 * @package WPReminder\api
 */
final class ValidationException extends PluginException
{

    /**
     * @return string
     */
    public function get_name(): string
    {
        return "ValidationException";
    }

}