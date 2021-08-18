<?php

namespace RemindMe\api;

use WP_REST_Response;
use Exception;
use RemindMe\PluginException;

/**
 * Class Response
 * @package RemindMe\api
 */
final class Response
{

    /**
     * @var WP_REST_Response|null
     */
    private ?WP_REST_Response $res = null;

    /**
     * @return WP_REST_Response
     */
    public function build() : WP_REST_Response {
        if(is_null($this->res)) {
            $this->error("Internal Server Error", "Response not initialized before build");
        }
        return $this->res;
    }

    /**
     * @param mixed $data
     */
    public function success($data = "") : void {
        $this->send($data);
    }

    /**
     * @param string $error
     * @param string $debug
     * @param int $code
     */
    public function error(string $error, string $debug = "", int $code = 400) : void {
        $object = [
            "status" => "error",
            "message" => $error
        ];
        if(defined("REMIND_ME_DEBUG") && REMIND_ME_DEBUG) {
            $object["debug"] = $debug;
        }
        $this->send($object, $code);
    }

    /**
     * @param Exception $exception
     */
    public function exception(Exception $exception) : void {
        if(is_a($exception, PluginException::class)) {
            $this->error($exception->getMessage(), $exception->get_debug_msg());
        } else {
            $this->error("Internal Server Error", $exception->getMessage());
        }
    }

    /**
     * @param mixed $object
     * @param int $status
     */
    private function send($object, int $status = 200) : void {
        $this->res = new WP_REST_Response($object, $status);
    }

}