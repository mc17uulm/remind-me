<?php

namespace WPReminder\api\objects;

use WPReminder\db\Database;
use WPReminder\db\DatabaseException;
use Exception;
use WPReminder\PluginException;

/**
 * Class Token
 * @package WPReminder\api\objects
 */
final class Token {

    /**
     * @var int
     */
    private int $id;
    /**
     * @var string
     */
    private string $type;
    /**
     * @var string
     */
    private string $value;

    /**
     * Token constructor.
     * @param int $id
     * @param string $type
     * @param string $value
     */
    protected function __construct(int $id, string $type, string $value)
    {
        $this->id = $id;
        $this->type = $type;
        $this->value = $value;
    }

    /**
     * @return string
     */
    public function get_token() : string {
        return $this->value;
    }

    public function is_type(string $type) : bool {
        return $this->type = $type;
    }

    /**
     * @param string $token
     * @return Token
     * @throws DatabaseException
     * @throws PluginException
     */
    public static function get(string $token) : Token {
        $db = Database::get_database();
        $res = $db->select(
            "SELECT * FROM {$db->get_table_name("tokens")} WHERE token = %s",
            $token
        );
        if(count($res) !== 1) throw new PluginException('Could not find token in database');
        return new Token($res[0]["id"], $res[0]["token"], $res[0]["token_type"]);
    }

    /**
     * @param int $subscriber_id
     * @param string $token_type
     * @param int $hours_valid
     * @return Token
     * @throws DatabaseException
     * @throws Exception
     */
    public static function create(int $subscriber_id, string $token_type, int $hours_valid = 48) : Token {
        $db = Database::get_database();
        $token = bin2hex(random_bytes(16));
        $id = $db->insert(
            "INSERT INTO {$db->get_table_name("tokens")} (token, subscriber_id, token_type, valid_til) VALUES (%s, %d, %s, DATE_ADD(NOW(), INTERVAL %d HOUR))",
            $token,
            $subscriber_id,
            $token_type,
            $hours_valid
        );
        return new Token($id, $token, $token_type);
    }

    /**
     * @return bool
     * @throws DatabaseException
     */
    public static function clear() : bool {
        $db = Database::get_database();
        return $db->delete("DELETE FROM {$db->get_table_name("tokens")} WHERE valid_til < NOW()");
    }

    /**
     * @param string $token
     * @return bool
     * @throws DatabaseException
     */
    public static function delete(string $token) : bool
    {
        $db = Database::get_database();
        return $db->delete("DELETE FROM {$db->get_table_name("tokens")} WHERE token = %s", $token);
    }

    /**
     * @param string $token
     * @param string $type
     * @return bool
     * @throws DatabaseException
     */
    public static function check(string $token, string $type) : bool {
        self::clear();
        try {
            $token = self::get($token);
            return $token->is_type($type);
        } catch(PluginException $e) {
            return false;
        }
    }

}