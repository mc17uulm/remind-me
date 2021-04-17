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
     * @var int|Template
     */
    private $template;
    /**
     * @var Repeat
     */
    private Repeat $repeat;

    /**
     * Event constructor.
     * @param int|null $id
     * @param string $name
     * @param int|Template $template
     * @param Repeat $repeat
     */
    public function __construct(string $name, $template, Repeat $repeat, ?int $id = null)
    {
        $this->id = $id;
        $this->name = $name;
        $this->template = $template;
        $this->repeat = $repeat;
    }

    /**
     * @return int
     */
    public function get_id() : int {
        return $this->id;
    }

    /**
     * @return Repeat
     */
    public function get_repeat() : Repeat {
        return $this->repeat;
    }

    /**
     * @return array
     */
    public function to_json() : array {
        $object = [
            "name" => $this->name,
            "repeat" => $this->repeat->to_json()
        ];
        if(is_numeric($this->template)) {
            $object["template"] = $this->template;
        } else {
            $object["template"] = $this->template->to_json();
        }
        if(!is_null($this->id)) {
            $object["id"] = $this->id;
        }
        return $object;
    }

    /**
     * @param int $id
     * @param bool $with_template
     * @return Event
     * @throws APIException
     * @throws DatabaseException
     */
    public static function get(int $id, bool $with_template = false) : Event {
        $db = Database::get_database();
        $db_res = $db->select("SELECT * FROM {$db->get_table_name("events")} WHERE id = %d", $id);
        if(count($db_res) !== 1) throw new APIException("no dataset for given id in db");
        $repeat = Repeat::get($id);
        $template = $db_res[0]["template"];
        if($with_template) {
            $template = Template::get($template);
        }
        return new Event($db_res[0]["name"], $template, $repeat, $db_res[0]["id"]);
    }

    /**
     * @param bool $with_template
     * @return array
     * @throws APIException
     * @throws DatabaseException
     */
    public static function get_all(bool $with_template = false) : array {
        $db = Database::get_database();
        $db_res = $db->select("SELECT * FROM {$db->get_table_name("events")}");
        return array_map(function(array $entry) use($with_template) {
            $repeat = Repeat::get($entry["id"]);
            $template = intval($entry["template"]);
            if($with_template) {
                $template = Template::get($template);
            }
            return new Event($entry["name"], $template, $repeat, $entry["id"]);
        }, $db_res);
    }

    /**
     * @param array $resource
     * @return int
     * @throws DatabaseException
     */
    public static function set(array $resource) : int {
        $db = Database::get_database();
        $id = $db->insert(
            "INSERT INTO {$db->get_table_name("events")} (name, template) VALUES (%s, %d)",
            $resource["name"],
            $resource["template"]
        );
        Repeat::set($id, $resource["repeat"]);
        return $id;
    }

    /**
     * @param int $id
     * @param array $resource
     * @return bool
     * @throws DatabaseException
     */
    public static function update(int $id, array $resource) : bool {
        $db = Database::get_database();
        $r = $db->update(
            "UPDATE {$db->get_table_name("events")} SET name = %s, template = %d WHERE id = %d",
            $resource["name"],
            $resource["template"],
            $id
        );
        if(!$r) return false;
        return Repeat::update($id, $resource["repeat"]);
    }

    /**
     * @param int $id
     * @return bool
     * @throws DatabaseException
     */
    public static function delete(int $id) : bool {
        $db = Database::get_database();
        $r = Repeat::delete($id);
        return $db->delete(
            "DELETE FROM {$db->get_table_name("events")} WHERE id = %d",
            $id
        );
    }

}