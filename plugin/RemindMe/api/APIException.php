<?php

namespace RemindMe\api;

use RemindMe\PluginException;

/**
 * Class APIException
 * @package RemindMe\api
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