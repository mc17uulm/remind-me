<?php

namespace WPReminder\api\objects;

use WPReminder\api\APIException;
use WPReminder\db\Database;
use WPReminder\db\DatabaseException;

/**
 * Class Repeat
 * @package WPReminder\api\objects
 */
final class Repeat
{

    /**
     * @var int
     */
    private int $event;
    /**
     * @var int
     */
    private int $clocking;
    /**
     * @var int
     */
    private int $day;
    /**
     * @var int
     */
    private int $start;
    /**
     * @var int
     */
    private int $end;

    /**
     * Repeat constructor.
     * @param int $event
     * @param int $clocking
     * @param int $day
     * @param int $start
     * @param int $end
     */
    public function __construct(int $event, int $clocking, int $day, int $start, int $end)
    {
        $this->event = $event;
        $this->clocking = $clocking;
        $this->day = $day;
        $this->start = $start;
        $this->end = $end;
    }

    /**
     * @return array
     */
    public function to_json() : array {
        return [
            "event" => $this->event,
            "clocking" => $this->clocking,
            "day" => $this->day,
            "start" => $this->start,
            "end" => $this->end
        ];
    }

    /**
     * Check if event is today and should be executed
     *
     * @return bool
     */
    public function execute_now() : bool {
        $now = time();
        // event hasn't started or ended already
        if(($this->start > $now) || ($this->end < $now)) return false;
        // is now in a repeating month of the event
        if(!$this->is_correct_month($now)) return false;
        $day_now = intval(date('j', $now));
        // is now the same day, as the event day
        return $this->day === $day_now;
    }

    /**
     * Check if todays month is a repeating month of the event
     *
     * @param int $now Timestamp of now
     * @return bool
     */
    public function is_correct_month(int $now) : bool {
        $start = intval(date('n', $this->start));
        $now = intval(date('n', $now));
        $diff = $this->get_month_diff($start, $now);
        return ($diff % $this->clocking) === 0;
    }

    /**
     * Get the difference between two months
     *
     * @param int $start # of Month
     * @param int $now # of Month
     * @return int # of Months difference
     */
    public function get_month_diff(int $start, int $now) : int {
        if($start > $now) {
            $now = $now + 12;
        }
        return $now - $start;

    }

    /**
     * @param int $event_id
     * @return Repeat
     * @throws APIException
     * @throws DatabaseException
     */
    public static function get(int $event_id) : Repeat {
        $db = Database::get_database();
        $db_res = $db->select("SELECT * FROM {$db->get_table_name("repeat")} WHERE event = %d", $event_id);
        if(count($db_res) !== 1) throw new APIException("no dataset with given id found in db");
        return new Repeat($db_res[0]["event"], $db_res[0]["clocking"], $db_res[0]["day"], $db_res[0]["start"], $db_res[0]["end"]);
    }

    /**
     * @param int $event_id
     * @param array $resource
     * @return int
     * @throws DatabaseException
     */
    public static function set(int $event_id, array $resource) : int {
        $db = Database::get_database();
        return $db->insert(
            "INSERT INTO {$db->get_table_name("repeat")} (event, clocking, day, start, end) VALUES (%d, %d, %d, %d, %d)",
            $event_id,
            $resource["clocking"],
            $resource["day"],
            $resource["start"],
            $resource["end"],
        );
    }

    /**
     * @param int $event_id
     * @param array $resource
     * @return bool
     * @throws DatabaseException
     */
    public static function update(int $event_id, array $resource) : bool {
        $db = Database::get_database();
        return $db->update(
            "UPDATE {$db->get_table_name("repeat")} SET clocking = %d, day = %d, start = %d, end = %d WHERE event = %d",
            $resource["clocking"],
            $resource["day"],
            $resource["start"],
            $resource["end"],
            $event_id
        );
    }

    /**
     * @param int $event_id
     * @return bool
     * @throws DatabaseException
     */
    public static function delete(int $event_id) : bool {
        $db = Database::get_database();
        return $db->delete("DELETE FROM {$db->get_table_name("repeat")} WHERE event = %d", $event_id);
    }

}