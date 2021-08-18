<?php

namespace RemindMe\api\objects;

use RemindMe\PluginException;

/**
 * Class Date
 * @package RemindMe\api\objects
 */
final class Date
{

    /**
     * @var int
     */
    public int $year;
    /**
     * @var int
     */
    public int $month;
    /**
     * @var int
     */
    public int $day;

    /**
     * Date constructor.
     * @param int $year
     * @param int $month
     * @param int $day
     */
    protected function __construct(int $year, int $month, int $day) {
        $this->year = $year;
        $this->month = $month;
        $this->day = $day;
    }

    /**
     * @param int $clocking
     * @return Date
     */
    public function get_next(int $clocking) : Date {
        $comp = $this->month + $clocking;
        $year = $this->year + intval(floor($comp / 12));
        $month = $comp % 12;
        return Date::create_by_date($year, $month, $this->day);
    }

    /**
     * @return bool
     */
    public function in_past() : bool {
        return $this->to_string() <= date('Y-m-d');
    }

    /**
     * @return string
     */
    public function to_string() : string {
        $month = $this->month < 10 ? "0{$this->month}" : $this->month;
        $day = $this->day < 10 ? "0{$this->day}" : $this->day;
        return "{$this->year}-{$month}-{$day}";
    }

    /**
     * @param string $date
     * @return Date
     * @throws PluginException
     */
    public static function create_by_string(string $date) : Date {
        $parts = explode('-', $date);
        if(count($parts) !== 3) throw new PluginException("Invalid date string: '$date'");
        return new Date(intval($parts[0]), intval($parts[1]), intval($parts[2]));
    }

    /**
     * @param int $year
     * @param int $month
     * @param int $day
     * @return Date
     */
    public static function create_by_date(int $year, int $month, int $day) : Date {
        return new Date($year, $month, $day);
    }

    /**
     * @param string $date
     * @param int $clocking
     * @return string
     * @throws PluginException
     */
    public static function create_next(string $date, int $clocking) : string {
        return Date::create_by_string($date)->get_next($clocking)->to_string();
    }

}