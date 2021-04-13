<?php

namespace WPReminder\api\handler;

use WP_REST_Request as Request;
use WPReminder\api\APIException;
use WPReminder\api\schemas\TemplateSchema;
use WPReminder\db\DatabaseException;
use WPReminder\api\ValidationException;
use WPReminder\api\objects\Template;
use WPReminder\api\Response;

final class TemplateHandler implements RestHandler
{

    /**
     * @param Request $req
     * @param Response $res
     * @throws APIException
     * @throws DatabaseException
     */
    public static function get(Request $req, Response $res): void
    {
        $id = $req->get_param("id");
        if(!is_numeric($id)) throw new APIException("'id' isn't set or not numeric");

        $template = Template::get($id);
        $res->success($template->to_json());
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws DatabaseException
     */
    public static function get_all(Request $req, Response $res) : void
    {
        $templates = Template::get_all();
        $res->success(array_map(function(Template $template) {
            return $template->to_json();
        }, $templates));
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws DatabaseException
     * @throws ValidationException
     */
    public static function set(Request $req, Response $res): void
    {
        $res->success(Template::set((new TemplateSchema())->validate($req)->get_result()));
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws APIException
     * @throws DatabaseException
     * @throws ValidationException
     */
    public static function update(Request $req, Response $res): void
    {
        $template = (new TemplateSchema())->validate($req)->get_result();
        $id = $req->get_param("id");

        if(!is_numeric($id)) throw new APIException("'id' is not set or not numeric");

        $res->success(Template::update($id, $template));
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws APIException
     * @throws DatabaseException
     */
    public static function delete(Request $req, Response $res): void
    {
        $id = $req->get_param("id");

        if(!is_numeric($id)) throw new APIException("'id' is not set or not numeric");

        $res->success(Template::delete($id));
    }

}