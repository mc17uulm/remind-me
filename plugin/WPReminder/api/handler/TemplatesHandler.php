<?php

namespace WPReminder\api\handler;

use WP_REST_Request as Request;
use WPReminder\api\objects\settings\Templates;
use WPReminder\api\Response;
use WPReminder\api\schemas\TemplatesSchema;
use WPReminder\PluginException;
use WPReminder\api\ValidationException;

/**
 * Class TemplatesHandler
 * @package WPReminder\api\handler
 */
final class TemplatesHandler implements RestHandler {

    /**
     * @param Request $req
     * @param Response $res
     * @throws PluginException
     */
    public static function get(Request $req, Response $res): void
    {
        $res->success(Templates::get()->to_json());
    }

    /**
     * @param Request $req
     * @param Response $res
     */
    public static function set(Request $req, Response $res): void
    {
        $res->error("Not implemented");
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws ValidationException
     */
    public static function update(Request $req, Response $res): void
    {
        $res->success(Templates::update((new TemplatesSchema())->validate($req)->cast()));
    }

    /**
     * @param Request $req
     * @param Response $res
     */
    public static function delete(Request $req, Response $res): void
    {
        $res->error("Not implemented");
    }

}