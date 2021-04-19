<?php

namespace WPReminder\api\objects;

use WPReminder\api\APIException;
use WPReminder\db\Database;
use WPReminder\db\DatabaseException;

/**
 * Class Event
 * @package WPReminder\api\objects
 */
final class Event
{

    /**
     * @var int|null
     */
    private ?int $id;
    /**
     * @var string
     */
    private string $name;
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
     * Event constructor.
     * @param string $name
     * @param int $clocking
     * @param int $day
     * @param int $start
     * @param int $end
     * @param int|null $id
     */
    public function __construct(string $name, int $clocking, int $day, int $start, int $end, ?int $id = null)
    {
        $this->id = $id;
        $this->name = $name;
        $this->clocking = $clocking;
        $this->day = $day;
        $this->start = $start;
        $this->end = $end;
    }

    /**
     * @return int
     */
    public function get_id() : int {
        return $this->id;
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
     * @return array
     */
    public function to_json() : array {
        $object = [
            "name" => $this->name,
            "clocking" => $this->clocking,
            "day" => $this->day,
            "start" => $this->start,
            "end" => $this->end
        ];
        if(!is_null($this->id)) {
            $object["id"] = $this->id;
        }
        return $object;
    }

    /**
     * @param int $id
     * @return Event
     * @throws APIException
     * @throws DatabaseException
     */
    public static function get(int $id) : Event {
        $db = Database::get_database();
        $db_res = $db->select("SELECT * FROM {$db->get_table_name("events")} WHERE id = %d", $id);
        if(count($db_res) !== 1) throw new APIException("no dataset for given id in db");
        return new Event($db_res[0]["name"], $db_res[0]["clocking"], $db_res[0]["day"], $db_res[0]["start"], $db_res[0]["end"], $db_res[0]["id"]);
    }

    /**
     * @return array
     * @throws DatabaseException
     */
    public static function get_all() : array {
        $db = Database::get_database();
        $db_res = $db->select("SELECT * FROM {$db->get_table_name("events")}");
        return array_map(function(array $entry) {
            return new Event($entry["name"], $entry["clocking"], $entry["day"], $entry["start"], $entry["end"], $entry["id"]);
        }, $db_res);
    }

    /**
     * @param array $resource
     * @return int
     * @throws DatabaseException
     */
    public static function set(array $resource) : int {
        $db = Database::get_database();
        return $db->insert(
            "INSERT INTO {$db->get_table_name("events")} (name, clocking, day, start, end) VALUES (%s, %d, %d, %d, %d)",
            $resource["name"],
            $resource["clocking"],
            $resource["day"],
            $resource["start"],
            $resource["end"]
        );
    }

    /**
     * @param int $id
     * @param array $resource
     * @return bool
     * @throws DatabaseException
     */
    public static function update(int $id, array $resource) : bool {
        $db = Database::get_database();
        return $db->update(
            "UPDATE {$db->get_table_name("events")} SET name = %s, clocking = %d, day = %d, start = %d, end = %d WHERE id = %d",
            $resource["name"],
            $resource["clocking"],
            $resource["day"],
            $resource["start"],
            $resource["end"],
            $id
        );
    }

    /**
     * @param int $id
     * @return bool
     * @throws DatabaseException
     */
    public static function delete(int $id) : bool {
        $db = Database::get_database();
        return $db->delete(
            "DELETE FROM {$db->get_table_name("events")} WHERE id = %d",
            $id
        );
    }

}