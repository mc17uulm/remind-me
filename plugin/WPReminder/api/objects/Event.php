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
    private int $start;
    /**
     * @var int
     */
    private int $last_execution;
    /**
     * @var bool
     */
    private bool $active;

    /**
     * Event constructor.
     * @param string $name
     * @param int $clocking
     * @param int $start
     * @param int $last_execution
     * @param bool $active
     * @param int|null $id
     */
    public function __construct(string $name, int $clocking, int $start, int $last_execution, bool $active, ?int $id = null)
    {
        $this->id = $id;
        $this->name = $name;
        $this->clocking = $clocking;
        $this->start = $start;
        $this->last_execution = $last_execution;
        $this->active = $active;
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
        // DEPRECATED: if(($this->start > $now) || ($this->end < $now)) return false;
        // is now in a repeating month of the event
        if(!$this->is_correct_month($now)) return false;
        $day_now = intval(date('j', $now));
        // is now the same day, as the event day
        return false;
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
            "start" => $this->start,
            "last_execution" => $this->last_execution,
            "active" => $this->active
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
        return new Event($db_res[0]["name"], $db_res[0]["clocking"], $db_res[0]["start"], $db_res[0]["last_execution"], $db_res[0]["active"], $db_res[0]["id"]);
    }

    /**
     * @return array
     * @throws DatabaseException
     */
    public static function get_all() : array {
        $db = Database::get_database();
        $db_res = $db->select("SELECT * FROM {$db->get_table_name("events")}");
        return array_map(function(array $entry) {
            return new Event($entry["name"], $entry["clocking"], $entry["start"], $entry["last_execution"], $entry["active"], $entry["id"]);
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
            "INSERT INTO {$db->get_table_name("events")} (name, clocking, start, last_execution, active) VALUES (%s, %d, %d, 0, 1)",
            $resource["name"],
            $resource["clocking"],
            $resource["start"]
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
            "UPDATE {$db->get_table_name("events")} SET name = %s, clocking = %d, start = %d WHERE id = %d",
            $resource["name"],
            $resource["clocking"],
            $resource["start"],
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