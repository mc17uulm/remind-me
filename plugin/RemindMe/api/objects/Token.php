<?php

namespace RemindMe\api\objects;

use RemindMe\db\Database;
use RemindMe\db\DatabaseException;
use Exception;
use RemindMe\PluginException;

/**
 * Class Token
 * @package RemindMe\api\objects
 */
final class Token {

    /**
     * @var string
     */
    private string $type;
    /**
     * @var string
     */
    private string $value;
    /**
     * @var int
     */
    private int $subscriber_id;

    /**
     * Token constructor.
     * @param string $type
     * @param string $value
     * @param int $subscriber_id
     */
    protected function __construct(string $type, string $value, int $subscriber_id)
    {
        $this->type = $type;
        $this->value = $value;
        $this->subscriber_id = $subscriber_id;
    }

    /**
     * @return string
     */
    public function get_token() : string {
        return $this->value;
    }

    /**
     * @return int
     */
    public function get_subscriber_id() : int {
        return $this->subscriber_id;
    }

    /**
     * @param string $type
     * @return bool
     */
    public function is_type(string $type) : bool {
        return $this->type === $type;
    }

    /**
     * @return bool
     * @throws DatabaseException
     */
    public function remove() : bool {
        return self::delete($this->value);
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
        return new Token($res[0]["token_type"], $res[0]["token"], $res[0]["subscriber_id"]);
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
        $db->insert(
            "INSERT INTO {$db->get_table_name("tokens")} (token, subscriber_id, token_type, valid_til) VALUES (%s, %d, %s, DATE_ADD(NOW(), INTERVAL %d HOUR))",
            $token,
            $subscriber_id,
            $token_type,
            $hours_valid
        );
        return new Token($token_type, $token, $subscriber_id);
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
     * @param bool $clear_after
     * @return bool
     * @throws DatabaseException
     */
    public static function check(string $token, string $type, bool $clear_after = false) : bool {
        self::clear();
        try {
            $token = self::get($token);
            $val = $token->is_type($type);
            if($val && $clear_after) {
                self::delete($token->get_token());
            }
            return $val;
        } catch(PluginException $e) {
            return false;
        }
    }

}