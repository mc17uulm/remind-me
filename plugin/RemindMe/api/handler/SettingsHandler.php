<?php

namespace RemindMe\api\handler;

use WP_REST_Request as Request;
use RemindMe\api\objects\Settings;
use RemindMe\api\objects\settings\License;
use RemindMe\api\Response;
use RemindMe\api\schemas\SettingsSchema;
use RemindMe\api\ValidationException;
use RemindMe\PluginException;

/**
 * Class SettingsHandler
 * @package RemindMe\api\handler
 */
final class SettingsHandler implements RestHandler
{

    /**
     * @throws PluginException
     */
    public static function get(Request $req, Response $res): void
    {
        $res->success(Settings::get()->to_json());
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws PluginException
     */
    public static function get_public(Request $req, Response $res) : void {
        $res->success(Settings::get()->to_json(true));
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
     * @throws ValidationException
     * @throws PluginException
     */
    public static function update(Request $req, Response $res): void
    {
        $res->success(Settings::update((new SettingsSchema())->validate($req)->cast()));
    }

    /**
     * @throws PluginException
     */
    public static function delete(Request $req, Response $res): void
    {
        $res->success(License::remove());
    }

}