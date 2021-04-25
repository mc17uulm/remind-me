<?php

namespace WPReminder\api;

use WP_REST_Request as Request;
use WPReminder\api\handler\EventHandler;
use WPReminder\api\handler\SubscriberHandler;
use WPReminder\api\handler\TemplateHandler;

final class APIHandler
{

    public static function run() : void {

        $api = new API();

        $api->get("/health", function (Request $request, Response $response) {
            $response->success();
        });

        $api->get("/event/(?P<id>\d+)", function (Request $request, Response $response) {
            EventHandler::get($request, $response);
        }, [], false);

        $api->get("/events", function (Request $request, Response $response) {
            EventHandler::get_all($request, $response);
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

        $api->get("/template/(?P<id>\d+)", function (Request $request, Response $response) {
            TemplateHandler::get($request, $response);
        });

        $api->get("/templates/", function (Request $request, Response $response) {
            TemplateHandler::get_all($request, $response);
        });

        $api->post("/template", function (Request $request, Response $response) {
            TemplateHandler::set($request, $response);
        });

        $api->put("/template/(?P<id>\d+)", function (Request $request, Response $response) {
            TemplateHandler::update($request, $response);
        });

        $api->delete("/template/(?P<id>\d+)", function (Request $request, Response $response) {
            TemplateHandler::delete($request, $response);
        });

        $api->get("/subscriber/(?P<id>\d+)", function (Request $request, Response $response) {
            SubscriberHandler::get($request, $response);
        });

        $api->get("/subscribers/", function (Request $request, Response $response) {
            SubscriberHandler::get_all($request, $response);
        });

        $api->post("/subscriber/", function (Request $request, Response $response) {
            SubscriberHandler::set($request, $response);
        });

        $api->put("/subscriber/(?P<id>\d+)", function (Request $request, Response $response) {
            SubscriberHandler::update($request, $response);
        });

        $api->delete("/subscriber/(?P<id>\d+)", function (Request $request, Response $response) {
            SubscriberHandler::delete($request, $response);
        });

    }

}