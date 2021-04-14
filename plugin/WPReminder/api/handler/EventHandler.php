<?php

namespace WPReminder\api\handler;

use WP_REST_Request as Request;
use WPReminder\api\APIException;
use WPReminder\api\objects\Event;
use WPReminder\api\Response;
use WPReminder\api\schemas\EventSchema;
use WPReminder\db\DatabaseException;
use WPReminder\api\ValidationException;

final class EventHandler implements RestHandler
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

        $template = false;
        $query = $req->get_query_params();
        if(key_exists("template", $query)) {
            $template = $query["template"] === "true";
        }

        $res->success(Event::get($id, $template));
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws APIException
     * @throws DatabaseException
     */
    public static function get_all(Request $req, Response $res) : void {
        $template = false;
        $query = $req->get_query_params();
        if(key_exists("template", $query)) {
            $template = $query["template"] === "true";
        }

        $res->success(array_map(function(Event $event) {
            return $event->to_json();
        }, Event::get_all($template)));
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws DatabaseException
     * @throws ValidationException
     */
    public static function set(Request $req, Response $res): void
    {
        $res->success(Event::set((new EventSchema())->validate($req)->get_result()));
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
        $event = (new EventSchema())->validate($req)->get_result();
        $id = $req->get_param("id");

        if(!is_numeric($id)) throw new APIException("'id' is not set or not numeric");

        $res->success(Event::update($id, $event));
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

        $res->success(Event::delete($id));
    }

}