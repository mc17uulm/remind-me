<?php

namespace WPReminder\db;

use WPReminder\PluginException;

/**
 * Class DatabaseException
 * @package WPReminder\db
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