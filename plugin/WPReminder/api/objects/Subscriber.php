<?php

namespace WPReminder\api\objects;

use WPReminder\api\APIException;
use WPReminder\db\Database;
use WPReminder\db\DatabaseException;
use Exception;
use WPReminder\mail\MailHandler;

/**
 * Class Subscriber
 * @package WPReminder\api\objects
 */
final class Subscriber
{

    /**
     * @var int|null
     */
    private ?int $id;
    /**
     * @var string
     */
    private string $token;
    /**
     * @var string
     */
    private string $email;
    /**
     * @var int|null
     */
    private ?int $registered;
    /**
     * @var bool|null
     */
    private ?bool $active;
    /**
     * @var array<int | Event>
     */
    private array $events;

    /**
     * Subscriber constructor.
     * @param string $token
     * @param string $email
     * @param array $events
     * @param int|null $id
     * @param int|null $registered
     * @param bool|null $active
     */
    public function __construct(string $token, string $email, array $events, ?int $id = null, ?int $registered = null, ?bool $active = null) {
        $this->token = $token;
        $this->email = $email;
        $this->events = $events;
        $this->id = $id;
        $this->registered = $registered;
        $this->active = $active;
    }

    /**
     * @param array<Event> $events
     */
    public function set_events(array $events) : void {
        $this->events = $events;
    }

    /**
     * @return array<Event | int>
     */
    public function get_events() : array {
        return $this->events;
    }

    /**
     * @return string
     */
    public function get_token() : string {
        return $this->token;
    }

    /**
     * @return array
     */
    public function to_json() : array {
        $object = [
            "token" => $this->token,
            "email" => $this->email,
            "events" => $this->events
        ];
        if(!is_null($this->id)) {
            $object["id"] = $this->id;
        }
        if(!is_null($this->registered)) {
            $object["registered"] = $this->registered * 1000;
        }
        if(!is_null($this->active)) {
            $object["active"] = $this->active;
        }
        return $object;
    }

    /**
     * @param int $id
     * @return Subscriber
     * @throws DatabaseException
     * @throws Exception
     */
    public static function get(int $id) : Subscriber
    {
        $db = Database::get_database();
        $db_res = $db->select("SELECT * FROM {$db->get_table_name("subscribers")} WHERE id = %d", $id);
        if(count($db_res) !== 1) throw new APIException("no dataset with given id in db");
        return new Subscriber($db_res[0]["token"], $db_res[0]["email"], json_decode($db_res[0]["events"]), $db_res[0]["id"], $db_res[0]["registered"], $db_res[0]["active"]);
    }

    /**
     * @return array
     * @throws DatabaseException
     * @throws Exception
     */
    public static function get_all() : array
    {
        $db = Database::get_database();
        $db_res = $db->select("SELECT * FROM {$db->get_table_name("subscribers")}");
        return array_map(function(array $entry) {
            return new Subscriber($entry["token"], $entry["email"], json_decode($entry["events"]), $entry["id"], $entry["registered"], $entry["active"]);
        }, $db_res);
    }

    /**
     * @param array $resource
     * @return int
     * @throws DatabaseException
     */
    public static function set(array $resource) : int {
        $db = Database::get_database();
        $sub_token = bin2hex(random_bytes(16));
        $id = $db->insert(
            "INSERT INTO {$db->get_table_name("subscribers")} (token, email, events, registered, active) VALUES (%s, %s, %s, UNIX_TIMESTAMP(), false)",
            $sub_token,
            $resource["email"],
            json_encode($resource["events"])
        );
        $token = Token::create($id, "activate");
        $url = get_site_url() . "?wp-reminder-token=" . $token->get_token();
        MailHandler::send_confirm($resource["email"], $resource["events"], $url);
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
        return $db->update(
            "UPDATE {$db->get_table_name("subscribers")} SET email = %s, events = %s WHERE token = %s AND id = %d",
            $resource["email"],
            json_encode($resource["events"]),
            $resource["token"],
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
            "DELETE FROM {$db->get_table_name("subscribers")} WHERE id = %d",
            $id
        );
    }

}