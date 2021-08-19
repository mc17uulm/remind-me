<?php

namespace RemindMe\api\objects;

use RemindMe\api\APIException;
use RemindMe\db\Database;
use RemindMe\db\DatabaseException;
use Exception;
use RemindMe\mail\MailHandler;
use RemindMe\PluginException;

/**
 * Class Subscriber
 * @package RemindMe\api\objects
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
     * @return int
     */
    public function get_id() : int {
        if($this->id === null) return -1;
        return $this->id;
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
     * @param int $event_id
     * @return bool
     */
    public function has_event(int $event_id) : bool {
        return in_array($event_id, $this->events);
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
     * @param int $event_id
     * @throws DatabaseException
     */
    public function remove_event(int $event_id) : void {
        if($this->has_event($event_id)) {
            $db = Database::get_database();
            $events = array_filter($this->events, fn(int $id) => $id !== $event_id);
            $db->update(
                "UPDATE {$db->get_table_name("subscribers")} SET events = %s WHERE token = %s AND id = %d",
                json_encode($events),
                $this->token,
                $this->id
            );
        }
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
        return new Subscriber($db_res[0]["token"], $db_res[0]["email"], json_decode($db_res[0]["events"], true), $db_res[0]["id"], $db_res[0]["registered"], $db_res[0]["active"]);
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
        return new Subscriber($db_res[0]["token"], $db_res[0]["email"], json_decode($db_res[0]["events"], true), $db_res[0]["id"], $db_res[0]["registered"], $db_res[0]["active"]);

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
            return new Subscriber($entry["token"], $entry["email"], json_decode($entry["events"], true), $entry["id"], $entry["registered"], $entry["active"]);
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
            "UPDATE {$db->get_table_name("subscribers")} SET email = %s, events = %s WHERE id = %d",
            sanitize_email($resource["email"]),
            json_encode($resource["events"]),
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
        if($result && $subscriber->active) {
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