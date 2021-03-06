<?php

namespace RemindMe\api;

use WP_REST_Request;
use Throwable;
use RemindMe\PluginException;

/**
 * Class API
 * @package RemindMe\api
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
    public function __construct(string $slug = 'remind-me', string $version = "1") {
        $this->plugin_slug = "$slug/v$version";
    }

    /**
     * @param string $path
     * @param callable $callback
     * @param array $args
     * @param bool $needs_permission
     */
    public function get(string $path, callable $callback, array $args = [], bool $needs_permission = true) : void {
        $this->handle_request("GET", $path, $callback, $args, $needs_permission);
    }

    /**
     * @param string $path
     * @param callable $callback
     * @param array $args
     * @param bool $needs_permission
     */
    public function post(string $path, callable $callback, array $args = [], bool $needs_permission = true) : void {
        $this->handle_request("POST", $path, $callback, $args, $needs_permission);
    }

    /**
     * @param string $path
     * @param callable $callback
     * @param array $args
     * @param bool $needs_permission
     */
    public function put(string $path, callable $callback, array $args = [], bool $needs_permission = true) : void {
        $this->handle_request("PUT", $path, $callback, $args, $needs_permission);
    }

    /**
     * @param string $path
     * @param callable $callback
     * @param array $args
     * @param bool $needs_permission
     */
    public function delete(string $path, callable $callback, array $args = [], bool $needs_permission = true) : void {
        $this->handle_request("DELETE", $path, $callback, $args, $needs_permission);
    }

    /**
     * @param string $type
     * @param string $path
     * @param callable $callback
     * @param array $args
     * @param bool $needs_permission
     */
    private function handle_request(string $type, string $path, callable $callback, array $args, bool $needs_permission) : void {
        if(in_array(strtoupper($type), ["GET", "POST", "PUT", "DELETE"])) {
            $route = [
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
                'permission_callback' => $needs_permission ?
                    fn() => current_user_can('edit_posts') :
                    fn() => true
            ];
            register_rest_route($this->plugin_slug, $path, $route);
        }
    }

}
