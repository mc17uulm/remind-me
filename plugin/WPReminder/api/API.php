<?php

namespace WPReminder\api;

use WP_REST_Request;
use Throwable;
use WPReminder\PluginException;

/**
 * Class API
 * @package WPReminder\api
 */
final class API
{

    /**
     * @var string
     */
    private string $plugin_slug;

    /**
     * API constructor.
     * @param string $slug
     * @param string $version
     */
    public function __construct(string $slug = 'wp-reminder', string $version = "1") {
        $this->plugin_slug = "$slug/v$version";
    }

    /**
     * @param string $path
     * @param callable $callback
     * @param array $args
     * @param string $permission
     */
    public function get(string $path, callable $callback, array $args = [], string $permission = 'edit_posts') : void {
        $this->handle_request("GET", $path, $callback, $args, $permission);
    }

    /**
     * @param string $path
     * @param callable $callback
     * @param array $args
     * @param string $permission
     */
    public function post(string $path, callable $callback, array $args = [], string $permission = 'edit_posts') : void {
        $this->handle_request("POST", $path, $callback, $args, $permission);
    }

    /**
     * @param string $path
     * @param callable $callback
     * @param array $args
     * @param string $permission
     */
    public function put(string $path, callable $callback, array $args = [], string $permission = 'edit_posts') : void {
        $this->handle_request("PUT", $path, $callback, $args, $permission);
    }

    /**
     * @param string $path
     * @param callable $callback
     * @param array $args
     * @param string $permission
     */
    public function delete(string $path, callable $callback, array $args = [], string $permission = 'edit_posts') : void {
        $this->handle_request("DELETE", $path, $callback, $args, $permission);
    }

    /**
     * @param string $type
     * @param string $path
     * @param callable $callback
     * @param array $args
     * @param string $permission
     */
    private function handle_request(string $type, string $path, callable $callback, array $args, string $permission) : void {
        if(in_array(strtoupper($type), ["GET", "POST", "PUT", "DELETE"])) {
            register_rest_route($this->plugin_slug, $path, [
                'methods' => strtoupper($type),
                'callback' => function(WP_REST_Request $req) use ($callback) {
                    $res = new Response();
                    try {
                        $callback($req, $res);
                    } catch (PluginException $e) {
                        $res->exception($e);
                    } catch (Throwable $e) {
                        $res->error("Internal Server Error", $e->getMessage());
                    }
                    return $res->build();
                },
                'args' => $args,
                'permission_callback' => function() use($permission) {
                    return current_user_can($permission);
                }
            ]);
        }
    }

}
