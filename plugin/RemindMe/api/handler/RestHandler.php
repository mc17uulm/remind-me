<?php

namespace RemindMe\api\handler;

use WP_REST_Request as Request;
use RemindMe\api\Response;

/**
 * Interface RestHandler
 * @package RemindMe\api\handler
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