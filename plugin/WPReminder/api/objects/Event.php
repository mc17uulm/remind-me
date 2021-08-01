<?php

namespace WPReminder\api\objects;

use WPReminder\api\APIException;
use WPReminder\db\Database;
use WPReminder\db\DatabaseException;
use WPReminder\PluginException;

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
     * @var string
     */
    private string $description;
    /**
     * @var int
     */
    private int $clocking;
    /**
     * @var Date
     */
    private Date $start;
    /**
     * @var Date
     */
    private Date $next;
    /**
     * @var int
     */
    private int $last;
    /**
     * @var bool
     */
    private bool $active;

    /**
     * Event constructor.
     * @param string $name
     * @param string $description
     * @param int $clocking
     * @param Date $start
     * @param Date $next
     * @param int $last
     * @param bool $active
     * @param int|null $id
     */
    public function __construct(string $name, string $description, int $clocking, Date $start, Date $next, int $last, bool $active, ?int $id = null)
    {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->clocking = $clocking;
        $this->start = $start;
        $this->next = $next;
        $this->last = $last;
        $this->active = $active;
    }

    /**
     * @return int
     */
    public function get_id() : int {
        return $this->id;
    }

    /**
     * @return string
     */
    public function get_name() : string {
        return $this->name;
    }

    /**
     * @return string
     */
    public function get_description() : string {
        return $this->description;
    }

    /**
     * @return Date
     */
    public function get_next() : Date {
        return $this->next;
    }

    /**
     * Check if event is today and should be executed
     *
     * @return bool
     */
    public function should_execute_now() : bool {
        return $this->next->in_past();
    }

    /**
     * @return array
     */
    public function to_json() : array {
        $object = [
            "name" => esc_html($this->name),
            "description" => esc_html($this->description),
            "clocking" => $this->clocking,
            "start" => esc_html($this->start->to_string()),
            "next" => esc_html($this->next->to_string()),
            "last" => $this->last * 1000,
            "active" => $this->active
        ];
        if(!is_null($this->id)) {
            $object["id"] = $this->id;
        }
        return $object;
    }

    /**
     * @return bool
     * @throws DatabaseException
     */
    public function update_execution() : bool {
        $db = Database::get_database();
        return $db->update(
            "UPDATE {$db->get_table_name("events")} SET last = UNIX_TIMESTAMP(), next = %s WHERE id = %d",
            $this->next->get_next($this->clocking)->to_string(),
            $this->id
        );
    }

    /**
     * @param int $id
     * @return Event
     * @throws APIException
     * @throws DatabaseException|PluginException
     */
    public static function get(int $id) : Event {
        $db = Database::get_database();
        $db_res = $db->select("SELECT * FROM {$db->get_table_name("events")} WHERE id = %d", $id);
        if(count($db_res) !== 1) throw new APIException("no dataset for given id in db");
        return new Event($db_res[0]["name"], $db_res[0]["description"], $db_res[0]["clocking"], Date::create_by_string($db_res[0]["start"]), Date::create_by_string($db_res[0]["next"]), $db_res[0]["last"], $db_res[0]["active"], $db_res[0]["id"]);
    }

    /**
     * @return array
     * @throws DatabaseException|PluginException
     */
    public static function get_all() : array {
        $db = Database::get_database();
        $db_res = $db->select("SELECT * FROM {$db->get_table_name("events")}");
        return array_map(function(array $entry) {
            return new Event($entry["name"], $entry["description"], $entry["clocking"], Date::create_by_string($entry["start"]), Date::create_by_string($entry["next"]), $entry["last"], $entry["active"], $entry["id"]);
        }, $db_res);
    }

    /**
     * @param array $resource
     * @return int
     * @throws DatabaseException
     * @throws PluginException
     */
    public static function set(array $resource) : int {
        $db = Database::get_database();
        return $db->insert(
            "INSERT INTO {$db->get_table_name("events")} (name, description, clocking, start, next, last, active) VALUES (%s, %s, %d, %s, %s, 0, 1)",
            sanitize_text_field($resource["name"]),
            sanitize_text_field($resource["description"]),
            $resource["clocking"],
            $resource["start"],
            $resource["next"]
        );
    }

    /**
     * @param int $id
     * @param array $resource
     * @return bool
     * @throws DatabaseException
     * @throws PluginException
     */
    public static function update(int $id, array $resource) : bool {
        $db = Database::get_database();
        $res = $db->select("SELECT next FROM {$db->get_table_name('events')} WHERE id = %d", $id);
        if(count($res) !== 1) throw new APIException('Event not in database');
        $next = $res[0]['next'];
        if($next < date('Y-m-d')) {
            $next = Date::create_next($next, $resource['clocking']);
        }
        return $db->update(
            "UPDATE {$db->get_table_name("events")} SET name = %s, description = %s, clocking = %d, start = %s, next = %s WHERE id = %d",
            sanitize_text_field($resource["name"]),
            sanitize_text_field($resource["description"]),
            $resource["clocking"],
            $resource["start"],
            $next,
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
        array_map(fn(Subscriber $subscriber) => $subscriber->remove_event($id),
            array_filter(Subscriber::get_all(), fn(Subscriber $subscriber) => $subscriber->has_event($id))
        );
        return $db->delete(
            "DELETE FROM {$db->get_table_name("events")} WHERE id = %d",
            $id
        );
    }

}