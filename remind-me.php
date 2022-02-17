<?php
/**
 * RemindMe
 *
 * @package     RemindMe
 * @author      CodeLeaf
 * @copyright   2021 CodeLeaf
 * @license     GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name: RemindMe
 * Description: Plugin for reminder handling
 * Author: CodeLeaf
 * Author URI: https://code-leaf.de
 * Version: 0.1.0
 * Text Domain: remind-me
 * Domain Path: /languages/
 * License: GNU General Public License v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Tags: reminder, form
 * Requires PHP: 7.4
 *
 * === Plugin Information ===
 *
 * Version: 0.1.0
 * Date: 01.10.2021
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU
 * General Public License version 2, as published by the Free Software Foundation. You may NOT assume
 * that you can use any other version of the GPL.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

declare(strict_types=1);

if(!defined('ABSPATH')) die("Invalid Request");
if(!defined('PHP_VERSION_ID') || PHP_VERSION_ID < 70400) {
    error_log('RemindMe | ERROR | plugin requires php version >= 7.4. Given (' . PHP_VERSION . ')');
    die("Plugin requires php version >= 7.4");
}

define("REMIND_ME_VERSION", "0.1.0");
define("REMIND_ME_SLUG", 'remind-me');
define('REMIND_ME_TEXTDOMAIN', 'remind-me');
define('REMIND_ME_FILE', __FILE__);
define("REMIND_ME_URL", plugin_dir_url(__FILE__));
define('REMIND_ME_PATH', plugin_dir_path(__FILE__));
define('REMIND_ME_BASENAME', plugin_basename(__FILE__));
define("REMIND_ME_DIR", __DIR__);
define("REMIND_ME_DEBUG", WP_DEBUG);
define("REMIND_ME_SCHEMAS", __DIR__ . "/schemas/");

require_once __DIR__ . "/vendor/autoload.php";

use RemindMe\Loader;
use RemindMe\Log;
use RemindMe\PluginException;

$log = Log::get();
$loader = new Loader(__FILE__);

try {
    $loader->run();
} catch(PluginException $e) {
    $log->error($e->getMessage());
    if(REMIND_ME_DEBUG) {
        $log->error($e->get_debug_msg());
    }
} catch(Exception $e) {
    $log->error($e->getMessage());
}