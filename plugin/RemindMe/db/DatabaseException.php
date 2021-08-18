<?php

namespace RemindMe\db;

use RemindMe\PluginException;

/**
 * Class DatabaseException
 * @package RemindMe\db
 */
final class DatabaseException extends PluginException
{

    /**
     * @return string
     */
    public function get_name(): string
    {
        return "DatabaseException";
    }

}