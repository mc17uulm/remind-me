<?php
/**
 * Plugin Name: WP Reminder
 * Description: Plugin for reminder handling
 * Author: CodeLeaf
 * Author URI: https://code-leaf.de
 * Version: 0.1.0
 * Text Domain: wp-reminder
 * Domain Path: /lang/
 * License:
 * License URI:
 * Tags:
 * Requires PHP: 7.4
 *
 * === Plugin Information ===
 *
 * Version: 0.1.0
 * Date: 26.03.2021
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU
 * General Public License version 2, as published by the Free Software Foundation. You may NOT assume
 * that you can use any other version of the GPL.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * If there are problems, bugs or errors, please report on github: https://github.com/mc17uulm/wp-reminder
 */

if(!defined('ABSPATH')) die("Invalid Request");
if(!defined('PHP_VERSION_ID')) {
    define(PHP_VERSION_ID, 0);
}

if(PHP_VERSION_ID < 70400) {
    die("Plugin requires php version >= 7.4");
}

if(!defined("WP_REMINDER_VERSION")) {
    define("WP_REMINDER_VERSION", "0.1.0");
}

if(!defined("WP_REMINDER_BASE_URL")) {
    define("WP_REMINDER_BASE_URL", plugin_dir_url(__FILE__));
}

if(!defined("WP_REMINDER_BASE_DIR")) {
    define("WP_REMINDER_BASE_DIR", __DIR__);
}

if(!defined("WP_REMINDER_DEBUG")) {
    define("WP_REMINDER_DEBUG", true);
}

if(!defined("WP_REMINDER_SCHEMA_DIR")) {
    define("WP_REMINDER_SCHEMA_DIR", __DIR__ . "/schemas/");
}

require_once __DIR__ . "/vendor/autoload.php";

use WPReminder\Loader;

$loader = new Loader();
$loader->run(__FILE__);