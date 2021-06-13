<?php

namespace WPReminder\api\objects;

use WPReminder\api\APIException;
use WPReminder\db\Database;
use WPReminder\db\DatabaseException;
use Exception;
use WPReminder\mail\MailHandler;
use WPReminder\PluginException;

/**
 * Class Subscriber
 * @package WPReminder\api\objects
 */
final class Subscriber
{

    /**
     * @var int|null
     */
    public ?int $id;
    /**
     * @var string
     */
    public string $token;
    /**
     * @var string
     */
    public string $email;
    /**
     * @var int|null
     */
    private ?int $registered;
    /**
     * @var bool|null
     */
    private ?bool $active;
    /**
     * @var array<int>
     */
    public array $events;
    /**
     * @var array<Event>
     */
    private array $executable_events;

    /**
     * Subscriber constructor.
     * @param string $token
     * @param string $email
     * @param array<int> $events
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
        $this->executable_events = [];
    }

    /**
     * @return string
     */
    public function get_token() : string {
        return $this->token;
    }

    /**
     * @return bool
     */
    public function is_active() : bool {
        return $this->active ?? false;
    }

    /**
     * @return bool
     * @throws DatabaseException
     */
    public function activate() : bool {
        $db = Database::get_database();
        return $db->update(
            "UPDATE {$db->get_table_name("subscribers")} SET active = 1 WHERE token = %s AND id = %d",
            $this->token,
            $this->id
        );
    }

    /**
     * @param array<Event> $events => all events that should be executed now
     */
    public function set_executable_events(array $events) : void {
        $given_events = $this->events;
        // filter all events, that are subscribed by the given user;
        $this->executable_events = array_filter(
            $events,
            function(Event $event) use ($given_events) {
                return in_array($event->get_id(), $given_events);
            }
        );
    }

    /**
     * @return Event[]
     */
    public function get_executable_events() : array {
        return $this->executable_events;
    }

    /**
     * @return bool
     */
    public function has_executable_events() : bool {
        return count($this->executable_events) > 0;
    }

    /**
     * @return array
     */
    public function to_json() : array {
        $object = [
            "token" => esc_html($this->token),
            "email" => esc_html($this->email),
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
     * @param string $token
     * @return Subscriber
     * @throws DatabaseException
     * @throws APIException
     * @throws Exception
     */
    public static function get_by_token(string $token) : Subscriber
    {
        $db = Database::get_database();
        $db_res = $db->select("SELECT * FROM {$db->get_table_name("subscribers")} WHERE token = %s", $token);
        if(count($db_res) !== 1) throw new APIException("no dataset with given token in db");
        return new Subscriber($db_res[0]["token"], $db_res[0]["email"], json_decode($db_res[0]["events"]), $db_res[0]["id"], $db_res[0]["registered"], $db_res[0]["active"]);
    }

    /**
     * @param int $id
     * @return Subscriber
     * @throws APIException
     * @throws DatabaseException
     */
    public static function get_by_id(int $id) : Subscriber {
        $db = Database::get_database();
        $db_res = $db->select("SELECT * FROM {$db->get_table_name("subscribers")} WHERE id = %d", $id);
        if(count($db_res) !== 1) throw new APIException("no dataset with given token in db");
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
     * @throws Exception
     */
    public static function set(array $resource) : int {
        $db = Database::get_database();
        $db_res = $db->select("SELECT * FROM {$db->get_table_name('subscribers')} WHERE email = %s", $resource["email"]);
        if(count($db_res) > 0) throw new APIException('User with given email address is already registered', 'User with given email address is already registered');
        $token = bin2hex(random_bytes(16));
        $id = $db->insert(
            "INSERT INTO {$db->get_table_name("subscribers")} (token, email, events, registered, active) VALUES (%s, %s, %s, UNIX_TIMESTAMP(), false)",
            $token,
            sanitize_email($resource["email"]),
            json_encode($resource["events"])
        );
        MailHandler::send_confirm(new Subscriber($token, sanitize_email($resource["email"]), $resource["events"], $id));
        return $id;
    }

    /**
     * @param int $id
     * @param array $resource
     * @return bool
     * @throws DatabaseException
     */
    public static function update_by_id(int $id, array $resource) : bool {
        $db = Database::get_database();
        return $db->update(
            "UPDATE {$db->get_table_name("subscribers")} SET email = %s, events = %s WHERE token = %s AND id = %d",
            sanitize_email($resource["email"]),
            json_encode($resource["events"]),
            sanitize_text_field($resource["token"]),
            $id
        );
    }

    /**
     * @param string $token
     * @param array $resource
     * @return bool
     * @throws DatabaseException
     */
    public static function update_by_token(string $token, array $resource) : bool {
        $db = Database::get_database();
        return $db->update(
            "UPDATE {$db->get_table_name('subscribers')} SET events = %s WHERE token = %s",
            json_encode($resource["events"]),
            sanitize_text_field($token)
        );
    }

    /**
     * @param int $id
     * @return bool
     * @throws DatabaseException
     * @throws PluginException
     */
    public static function delete(int $id) : bool {
        $subscriber = self::get_by_id($id);
        $db = Database::get_database();
        $result = $db->delete(
            "DELETE FROM {$db->get_table_name("subscribers")} WHERE id = %d",
            $id
        );
        if($result) {
            MailHandler::send_unsubscribe($subscriber);
        }
        return $result;
    }

    /**
     * @param string $token
     * @return bool
     * @throws DatabaseException
     * @throws PluginException
     */
    public static function unsubscribe(string $token) : bool {
        $subscriber = self::get_by_token($token);
        $db = Database::get_database();
        $result = $db->delete(
            "DELETE FROM {$db->get_table_name('subscribers')} WHERE token = %s",
            $token
        );
        if($result) {
            MailHandler::send_unsubscribe($subscriber);
        }
        return $result;
    }

}