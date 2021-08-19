<?php

namespace RemindMe\api\handler;

use WP_REST_Request as Request;
use RemindMe\api\APIException;
use RemindMe\api\objects\Date;
use RemindMe\api\objects\Event;
use RemindMe\api\Response;
use RemindMe\api\schemas\EventSchema;
use RemindMe\db\DatabaseException;
use RemindMe\api\ValidationException;
use RemindMe\PluginException;

/**
 * Class EventHandler
 * @package RemindMe\api\handler
 */
final class EventHandler implements RestHandler
{

    /**
     * @param Request $req
     * @param Response $res
     * @throws APIException
     * @throws DatabaseException
     * @throws PluginException
     */
    public static function get(Request $req, Response $res): void
    {
        $id = $req->get_param("id");
        if(!is_numeric($id)) throw new APIException("'id' isn't set or not numeric");

        $res->success(Event::get((int) $id)->to_json());
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws DatabaseException
     * @throws PluginException
     */
    public static function get_all(Request $req, Response $res) : void {
        $res->success(array_map(function(Event $event) {
            return $event->to_json();
        }, Event::get_all()));
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws DatabaseException
     */
    public static function count(Request $req, Response $res) : void {
        $res->success(Event::count());
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws DatabaseException
     * @throws ValidationException
     * @throws APIException
     * @throws PluginException
     */
    public static function set(Request $req, Response $res): void
    {
        $result = (new EventSchema())->validate($req)->get_result();
        if($result['start'] < date('Y-m-d')) throw new APIException('Given date is in the past');
        $result['next'] = Date::create_next($result['start'], $result['clocking']);
        $res->success(Event::set($result));
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws APIException
     * @throws DatabaseException
     * @throws ValidationException
     * @throws PluginException
     */
    public static function update(Request $req, Response $res): void
    {
        $result = (new EventSchema())->validate($req)->get_result();
        $id = $req->get_param("id");

        if(!is_numeric($id)) throw new APIException("'id' is not set or not numeric");

        if($result['start'] < date('Y-m-d')) throw new APIException('Given date is in the past');

        $res->success(Event::update((int) $id, $result));
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

        $res->success(Event::delete((int) $id));
    }

}