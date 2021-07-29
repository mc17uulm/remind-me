<?php

namespace WPReminder;

/**
 * Class Log
 * @package WPReminder
 */
final class Log
{
    /**
     * @var Log|null
     */
    private static ?Log $instance = null;
    /**
     * @var string
     */
    private string $file;

    /**
     * Log constructor.
     */
    protected function __construct()
    {
        if(!defined('WP_REMINDER_DIR')) die('Invalid request');
        $file = WP_REMINDER_DIR . '/log.txt';
        if(!is_file($file)) return;
        if(!is_writable($file)) return;

        $this->file = $file;
    }

    /**
     * @return Log
     */
    public static function get() : Log {
        if(self::$instance === null) {
            self::$instance = new Log();
        }
        return self::$instance;
    }

    /**
     * @param string $dir
     * @param string $filename
     */
    public static function create(string $dir, string $filename) : void {
        if(!is_dir($dir)) return;
        if(!is_writable($dir)) return;

        $file = "$dir/$filename";
        file_put_contents($file, "DATE\t| FILE\t| LINE\t| TYPE\t| MESSAGE");
    }

    /**
     * @param string $message
     */
    public function info(string $message) : void {
        $this->print_log("INFO", $message);
    }

    /**
     * @param string $message
     */
    public function warning(string $message) : void {
        $this->print_log("WARNING", $message);
    }

    /**
     * @param string $message
     */
    public function error(string $message) : void {
        $this->print_log("ERROR", $message);
        error_log("WPReminder | ERROR | $message");
    }

    /**
     * @param string $type
     * @param string $message
     */
    private function print_log(string $type, string $message) : void {
        $date = date('');
        if(!defined('WP_REMINDER_VERSION')) die('Invalid access');
        $version = WP_REMINDER_VERSION;
        $backtrace = debug_backtrace()[0];
        $file = $backtrace['file'];
        $line = $backtrace['line'];
        $line = "$date | $version | $file | $line | $type | $message";
        file_put_contents($this->file, $line, FILE_APPEND);
    }

}