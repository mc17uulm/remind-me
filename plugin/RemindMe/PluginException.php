<?php

namespace RemindMe;

use Exception;

/**
 * Class PluginException
 * @package RemindMe
 */
class PluginException extends Exception
{

    /**
     * @var string
     */
    private string $debug_msg;

    /**
     * PluginException constructor.
     * @param string $debug_msg
     * @param string $message
     */
    public function __construct(string $debug_msg, $message = "")
    {
        parent::__construct($message);
        $this->debug_msg = $debug_msg;
    }

    /**
     * @return string
     */
    public function get_debug_msg() : string {
        return $this->debug_msg;
    }

    /**
     * @return string
     */
    public function get_name() : string {
        return "PluginException";
    }

}