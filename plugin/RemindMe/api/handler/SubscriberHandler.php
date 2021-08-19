<?php

namespace RemindMe\api\handler;

use WP_REST_Request as Request;
use RemindMe\api\APIException;
use RemindMe\api\objects\Subscriber;
use RemindMe\api\Response;
use RemindMe\api\schemas\SubscriberSchema;
use RemindMe\db\DatabaseException;
use RemindMe\api\ValidationException;
use RemindMe\PluginException;

/**
 * Class SubscriberHandler
 * @package RemindMe\api\handler
 */
final class SubscriberHandler implements RestHandler
{

    /**
     * @param Request $req
     * @param Response $res
     * @throws DatabaseException
     * @throws APIException
     */
    public static function get(Request $req, Response $res): void
    {
        $res->success(Subscriber::get_by_token($req->get_param("token"))->to_json());
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws DatabaseException
     */
    public static function get_all(Request $req, Response $res) : void
    {
        $res->success(array_map(function(Subscriber $subscriber) {
            return $subscriber->to_json();
        }, Subscriber::get_all()));
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws DatabaseException
     * @throws ValidationException
     */
    public static function set(Request $req, Response $res): void
    {
        $res->success(Subscriber::set((new SubscriberSchema())->validate($req)->get_result()));
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
        $subscriber = (new SubscriberSchema())->validate($req)->get_result();
        $id = $req->get_param("id");

        if(!is_numeric($id)) throw new APIException("'id' is not set or not numeric");

        $res->success(Subscriber::update_by_id((int) $id, $subscriber));
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws DatabaseException
     * @throws ValidationException
     */
    public static function edit(Request $req, Response $res) : void {
        $subscriber = (new SubscriberSchema())->validate($req)->get_result();
        $token = $req->get_param('token');

        $res->success(Subscriber::update_by_token($token, $subscriber));
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws APIException
     * @throws DatabaseException
     * @throws PluginException
     */
    public static function delete(Request $req, Response $res): void
    {
        $id = $req->get_param("id");

        if(!is_numeric($id)) throw new APIException("'id' is not set or not numeric");

        $res->success(Subscriber::delete((int) $id));
    }

    /**
     * @param Request $req
     * @param Response $res
     * @throws DatabaseException
     * @throws PluginException
     */
    public static function unsubscribe(Request $req, Response $res) : void {
        $token = $req->get_param('token');
        $res->success(Subscriber::unsubscribe($token));
    }

}