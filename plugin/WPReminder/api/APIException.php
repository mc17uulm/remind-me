<?php

namespace WPReminder\api;

use WPReminder\PluginException;

/**
 * Class APIException
 * @package WPReminder\api
 */
final class APIException extends PluginException
{

    /**
     * @return string
     */
    public function get_name(): string
    {
        return "APIException";
    }

}