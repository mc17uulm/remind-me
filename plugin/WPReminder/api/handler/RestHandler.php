<?php

namespace WPReminder\api\handler;

use WP_REST_Request as Request;
use WPReminder\api\Response;

/**
 * Interface RestHandler
 * @package WPReminder\api\handler
 */
interface RestHandler
{

    /**
     * @param Request $req
     * @param Response $res
     */
    public static function get(Request $req, Response $res) : void;

    /**
     * @param Request $req
     * @param Response $res
     */
    public static function set(Request $req, Response $res) : void;

    /**
     * @param Request $req
     * @param Response $res
     */
    public static function update(Request $req, Response $res) : void;

    /**
     * @param Request $req
     * @param Response $res
     */
    public static function delete(Request $req, Response $res) : void;

}