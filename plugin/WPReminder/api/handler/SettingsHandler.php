<?php

namespace WPReminder\api\handler;

use WP_REST_Request as Request;
use WPReminder\api\objects\Settings;
use WPReminder\api\Response;
use WPReminder\api\schemas\SettingsSchema;
use WPReminder\api\ValidationException;

final class SettingsHandler implements RestHandler
{

    public static function get(Request $req, Response $res): void
    {
        $res->success(Settings::get()->to_json());
    }

    public static function set(Request $req, Response $res): void
    {
        $res->error("Not implemented");
    }

    /**
     * @throws ValidationException
     */
    public static function update(Request $req, Response $res): void
    {
        $res->success(Settings::update((new SettingsSchema())->validate($req)->cast()));
    }

    public static function delete(Request $req, Response $res): void
    {
        $res->error("Not implemented");
    }

}