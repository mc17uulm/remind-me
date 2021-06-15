<?php

namespace WPReminder\api;

use WP_REST_Request as Request;
use WPReminder\api\handler\EventHandler;
use WPReminder\api\handler\SettingsHandler;
use WPReminder\api\handler\SubscriberHandler;

/**
 * Class APIHandler
 * @package WPReminder\api
 */
final class APIHandler
{

    /**
     *
     */
    public static function run() : void {

        $api = new API();

        $api->get("/event/(?P<id>\d+)", function (Request $request, Response $response) {
            EventHandler::get($request, $response);
        }, [], false);

        $api->get("/events", function (Request $request, Response $response) {
            EventHandler::get_all($request, $response);
        }, [], false);

        $api->post("/event", function (Request $request, Response $response) {
            EventHandler::set($request, $response);
        });

        $api->put("/event/(?P<id>\d+)", function (Request $request, Response $response) {
            EventHandler::update($request, $response);
        });

        $api->delete("/event/(?P<id>\d+)", function (Request $request, Response $response) {
            EventHandler::delete($request, $response);
        });

        $api->get("/subscriber/token/(?P<token>[a-zA-Z0-9-]+)", function (Request $request, Response $response) {
            SubscriberHandler::get($request, $response);
        }, [], false);

        $api->post('/subscribe', function(Request $request, Response $response) {
            SubscriberHandler::set($request, $response);
        }, [], false);

        $api->get("/subscribers/", function (Request $request, Response $response) {
            SubscriberHandler::get_all($request, $response);
        });

        $api->post("/subscriber/", function (Request $request, Response $response) {
            SubscriberHandler::set($request, $response);
        });

        $api->put("/subscriber/(?P<id>\d+)", function (Request $request, Response $response) {
            SubscriberHandler::update($request, $response);
        });

        $api->put("/subscriber/token/(?P<token>[a-zA-Z0-9-]+)", function(Request $request, Response $response) {
            SubscriberHandler::edit($request, $response);
        }, [], false);

        $api->delete("/subscriber/(?P<id>\d+)", function (Request $request, Response $response) {
            SubscriberHandler::delete($request, $response);
        });

        $api->delete("/subscriber/token/(?P<token>[a-zA-Z0-9-]+)", function (Request $request, Response $response) {
            SubscriberHandler::unsubscribe($request, $response);
        }, [], false);

        $api->get("/settings/", function (Request $request, Response $response) {
            SettingsHandler::get($request, $response);
        });

        $api->put("/settings/", function (Request $request, Response $response) {
            SettingsHandler::update($request, $response);
        });

        $api->delete('/license', function(Request $request, Response $response) {
            SettingsHandler::delete($request, $response);
        });

    }

}