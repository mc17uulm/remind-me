<?php

namespace RemindMe\api;

use WP_REST_Request as Request;
use RemindMe\api\handler\EventHandler;
use RemindMe\api\handler\SettingsHandler;
use RemindMe\api\handler\SubscriberHandler;
use RemindMe\api\handler\TemplatesHandler;

/**
 * Class APIHandler
 * @package RemindMe\api
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

        $api->get("/events/count", function(Request $request, Response $response){
            EventHandler::count($request, $response);
        });

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

        $api->get('/templates/', function(Request $request, Response $response) {
            TemplatesHandler::get($request, $response);
        });

        $api->put('/templates/', function(Request $request, Response $response) {
            TemplatesHandler::update($request, $response);
        });

        $api->get('/public/settings/', function(Request $request, Response $response) {
            SettingsHandler::get_public($request, $response);
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