<?php
/**
 * WP Reminder
 *
 * @package     WPReminder
 * @author      Marco Combosch
 * @copyright   2021 CodeLeaf
 * @license     GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name: WP Reminder
 * Description: Plugin for reminder handling
 * Author: CodeLeaf
 * Author URI: https://plugins.code-leaf.de
 * Version: 0.1.0
 * Text Domain: wp-reminder
 * Domain Path: /languages/
 * License: GNU General Public License v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
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

declare(strict_types=1);

if(!defined('ABSPATH')) die("Invalid Request");
if(!defined('PHP_VERSION_ID')) {
    define(PHP_VERSION_ID, 0);
}

if(PHP_VERSION_ID < 70400) {
    error_log('WPReminder | ERROR | plugin requires php version >= 7.4. Given (' . PHP_VERSION . ')');
    die("Plugin requires php version >= 7.4");
}

define("WP_REMINDER_VERSION", "0.1.0");
define("WP_REMINDER_SLUG", 'wp-reminder');
define('WP_REMINDER_TEXTDOMAIN', 'wp-reminder');
define('WP_REMINDER_FILE', __FILE__);
define("WP_REMINDER_URL", plugin_dir_url(__FILE__));
define('WP_REMINDER_PATH', plugin_dir_path(__FILE__));
define('WP_REMINDER_BASENAME', plugin_basename(__FILE__));
define("WP_REMINDER_DIR", __DIR__);
define("WP_REMINDER_DEBUG", true);
define("WP_REMINDER_LOG_FILE", __DIR__ . "/wp-reminder.log");
define("WP_REMINDER_SCHEMAS", __DIR__ . "/schemas/");

require_once __DIR__ . "/vendor/autoload.php";

use WPReminder\Loader;
use WPReminder\Log;
use WPReminder\PluginException;

try {
    $log = Log::get();
} catch(PluginException $e) {
    error_log("WPReminder | ERROR | " . $e->getMessage() . " | " . $e->get_debug_msg());
    die();
}

$loader = new Loader(__FILE__);

try {
    $loader->run();
} catch(PluginException $e) {
    $log->error($e->getMessage());
    if(WP_REMINDER_DEBUG) {
        $log->error($e->get_debug_msg());
    }
} catch(Exception $e) {
    $log->error($e->getMessage());
}