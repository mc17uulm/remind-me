<?php

namespace WPReminder\api;

use WP_REST_Request as Request;

final class APIHandler
{

    public static function run() : void {

        $api = new API();

        $api->get("/health", function (Request $request, Response $response) {
            $response->success();
        });

    }

}