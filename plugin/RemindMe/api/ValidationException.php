<?php

namespace RemindMe\api;

use RemindMe\PluginException;

/**
 * Class ValidationExceptions
 * @package RemindMe\api
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