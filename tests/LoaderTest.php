<?php

use RemindMe\api\APIHandler;
use RemindMe\Loader;

final class LoaderTest extends WP_UnitTestCase
{

    public function test_actions() : void {
        $this->assertTrue(
            has_action('rest_api_init', [APIHandler::class, 'run'])
        );
    }

}