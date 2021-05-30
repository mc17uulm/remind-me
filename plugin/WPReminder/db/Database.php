<?php

namespace WPReminder\db;

/**
 * Class Database
 * @package WPReminder\db
 */
final class Database
{

    private const TABLES = [
        "events" => "wp_reminder_events",
        "subscribers" => "wp_reminder_subscribers",
        "tokens" => "wp_reminder_tokens"
    ];

    /**
     * @var Database|null
     */
    private static ?Database $instance = null;

    /**
     * @var string
     */
    private string $base;

    /**
     * Database constructor.
     */
    protected function __construct() {
        global $wpdb;

        $this->base = $wpdb->base_prefix;
    }

    /**
     * @return Database
     */
    public static function get_database() : Database {
        if(self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    /**
     * @param string $key
     * @return string
     * @throws DatabaseException
     */
    public function get_table_name(string $key) : string {
        if(!key_exists($key, self::TABLES)) throw new DatabaseException("Key '$key' not in tables");
        return $this->base . self::TABLES[$key];
    }

    /**
     * @param string $query
     * @param mixed ...$fields
     * @return array
     */
    public function select(string $query, ...$fields) : array {
        global $wpdb;

        return $wpdb->get_results($wpdb->prepare($query, $fields), ARRAY_A);
    }

    /**
     * @param string $query
     * @param mixed ...$fields
     * @return int
     * @throws DatabaseException
     */
    public function insert(string $query, ...$fields) : int {
        global $wpdb;

        $result = $wpdb->query($wpdb->prepare($query, $fields));
        if(!$result) throw new DatabaseException("Error inserting db entry: '{$wpdb->last_error}'");
        return $wpdb->insert_id;
    }

    /**
     * @param string $query
     * @param mixed ...$fields
     * @return bool
     */
    public function update(string $query, ...$fields) : bool {
        global $wpdb;

        $result = $wpdb->query($wpdb->prepare($query, $fields));
        return $result > 0;
    }

    /**
     * @param string $query
     * @param mixed ...$fields
     * @return bool
     */
    public function delete(string $query, ...$fields) : bool {
        return $this->update($query, ...$fields);
    }

    public static function initialize() : void {

        global $wpdb;

        $charset = $wpdb->get_charset_collate();
        $db = self::get_database();

        $sql = "CREATE TABLE `{$db->get_table_name("events")}` (
            id int NOT NULL AUTO_INCREMENT,
            name varchar(155) NOT NULL,
            description TEXT NOT NULL,
            clocking BIT(4) NOT NULL,
            start DATE NOT NULL,
            next DATE NOT NULL,
            last TIMESTAMP NOT NULL,
            active BIT(1) NOT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB $charset;";

        $sql .= "CREATE TABLE `{$db->get_table_name("subscribers")}` (
            id int NOT NULL AUTO_INCREMENT,
            token varchar (255) NOT NULL,
            email varchar(255) NOT NULL,
            registered int NOT NULL,
            active BIT(1) NOT NULL,
            events TEXT NOT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB $charset;";

        $sql .= "CREATE TABLE `{$db->get_table_name("tokens")}` (
            id int NOT NULL AUTO_INCREMENT,
            token varchar(255) NOT NULL,
            token_type varchar(155) NOT NULL,
            subscriber_id int NOT NULL,
            valid_til TIMESTAMP NOT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB $charset;";

        require_once (ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);

    }

    public static function remove() : void {
        global $wpdb;

        $db = self::get_database();

        array_map(function (string $table) use ($wpdb, $db) {
            $wpdb->query("DROP TABLE IF EXISTS {$db->get_table_name($table)}");
        }, array_keys(self::TABLES));
    }

}