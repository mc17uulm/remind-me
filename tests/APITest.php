<?php

final class APITest extends WP_UnitTestCase
{

    private WP_REST_Server $server;
    private int $user_id;

    public function setUp()
    {
        parent::setUp();
        global $wp_rest_server;
        $this->server = $wp_rest_server = new WP_REST_Server();
        do_action('rest_api_init');
        $this->user_id = $this->factory()->user->create([
            'display_name' => 'test_author',
            'role' => 'administrator'
        ]);
        var_dump(WP_CONTENT_DIR . '/plugins/remind-me');
        $e = activate_plugin(WP_CONTENT_DIR . '/plugins/remind-me');
        var_dump($e);
    }

    public function tearDown()
    {
        //deactivate_plugins('remind-me/remind-me.php');
        wp_delete_user($this->user_id);
        parent::tearDown();
    }

    public function testGetAllEvents() : void {
        $request = new WP_REST_Request('GET', 'index.php?rest_route=/remind-me/v1/events');
        $response = $this->server->dispatch($request);
        $data = $response->get_data();
        var_dump($data);
        $this->assertEquals(true, true);
    }

}