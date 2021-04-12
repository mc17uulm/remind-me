<?php

namespace WPReminder\api\handler;

use WP_REST_Request as Request;
use WPReminder\api\Response;

interface RestHandler
{

    public static function get(Request $req, Response $res) : void;
    public static function set(Request $req, Response $res) : void;
    public static function update(Request $req, Response $res) : void;
    public static function delete(Request $req, Response $res) : void;

}