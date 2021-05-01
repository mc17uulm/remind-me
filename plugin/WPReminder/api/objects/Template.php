<?php

namespace WPReminder\api\objects;

use WPReminder\api\APIException;
use WPReminder\db\Database;
use WPReminder\db\DatabaseException;

/**
 * Class Template
 * @package WPReminder\api\objects
 */
final class Template
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
    private string $html;
    /**
     * @var bool
     */
    private bool $active;

    /**
     * Template constructor.
     * @param string $name
     * @param string $html
     * @param bool $active
     * @param int|null $id
     */
    public function __construct(string $name, string $html, bool $active, ?int $id = null) {
        $this->name = $name;
        $this->html = $html;
        $this->active = $active;
        $this->id = $id;
    }

    /**
     * @return array
     */
    public function to_json() : array {
        $object = [
            "name" => $this->name,
            "html" => $this->html,
            "active" => $this->active
        ];
        if(!is_null($this->id)) {
            $object["id"] = $this->id;
        }
        return $object;
    }

    /**
     * @param int $id
     * @return Template
     * @throws APIException
     * @throws DatabaseException
     */
    public static function get(int $id) : Template
    {
        $db = Database::get_database();
        $db_res = $db->select("SELECT * FROM {$db->get_table_name("templates")} WHERE id = %d", $id);
        if(count($db_res) !== 1) throw new APIException("no dataset with given id in db");
        return new Template($db_res[0]["name"], $db_res[0]["html"], $db_res[0]["active"], $db_res[0]["id"]);
    }

    /**
     * @return Template[]
     * @throws DatabaseException
     */
    public static function get_all() : array {
        $db = Database::get_database();
        $db_res = $db->select("SELECT * FROM {$db->get_table_name("templates")}");
        return array_map(function(array $entry) {
            return new Template($entry["name"], $entry["html"], $entry["active"], $entry["id"]);
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
            "INSERT INTO {$db->get_table_name("templates")} (name, html, active) VALUES (%s, %s, %d)",
            $resource["name"],
            $resource["html"],
            $resource["active"]
        );
        if($resource["active"]) {
            self::check_active($id);
        }
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
        $success = $db->update(
            "UPDATE {$db->get_table_name("templates")} SET name = %s, html = %s, active = %d WHERE id = %d",
            $resource["name"],
            $resource["html"],
            $resource["active"],
            $id
        );
        if($resource["active"]) {
            return self::check_active($id) && $success;
        }
        return $success;
    }

    /**
     * @param int $id
     * @return bool
     * @throws DatabaseException
     */
    public static function delete(int $id) : bool {
        $db = Database::get_database();
        return $db->delete("DELETE FROM {$db->get_table_name("templates")} WHERE id = %d", $id);
    }

    private static function check_active(int $id) : bool {
        $db = Database::get_database();
        return $db->update(
            "UPDATE {$db->get_table_name("templates")} SET active = 0 WHERE id != %d",
            $id
        );
    }

}