<?php

namespace RemindMe\update;

use stdClass;
use WP_Error;
use JsonException;
use WP_Upgrader;

/**
 * Class Updater
 * @package RemindMe\update
 */
final class Updater {

    /**
     * @param array $meta
     * @param string $file
     * @return array
     */
    public static function add_info(array $meta, string $file): array {
        if(REMIND_ME_BASENAME === $file) {
            foreach($meta as $link) {
                if(strpos($link, 'tab=plugin-information') !== false) {
                    return $meta;
                }
            }

            $meta[] = sprintf(
                '<a href="%s" class="thickbox open-plugin-details-modal" arial-label="%s" data-title="%s">%s</a>',
                esc_url(network_admin_url('plugin-install.php?tab=plugin-information&plugin=remind-me&TB_iframe=true&width=600&height?=500')),
                esc_attr(sprintf(__('More information about %s'), 'RemindMe')),
                esc_attr('RemindMe'),
                __('View details')
            );
        }
        return $meta;
    }

    /**
     * @param mixed $res
     * @param string $action
     * @param stdClass $args
     * @return false|stdClass
     */
    public static function request($res, string $action, stdClass $args) {
        if($action !== 'plugin_information') return false;
        if($args->slug !== 'remind-me') return false;
        if(!self::load_info($json)) return false;

        $res = new stdClass();
        $res->name = $json['name'];
        $res->slug = $json['slug'];
        $res->version = $json['version'];
        $res->tested = $json['tested'];
        $res->requires = $json['requires'];
        $res->author = $json['author'];
        $res->author_profile = $json['author_url'];
        $res->download_link = $json['url'];
        $res->trunk = $json['url'];
        $res->requires_php = $json['php'];
        $res->last_updated = date($json['date']);
        $res->sections = $json['assets']['sections'];
        $res->screenshots = $json['assets']['screenshots'];
        $res->banners = [
            'high' => $json['assets']['banners'][0]['url'],
            'low' => $json['assets']['banners'][1]['url']
        ];
        return $res;
    }

    /**
     * @param $transient
     * @return mixed
     */
    public static function update($transient) {
        if(empty($transient->checked)) return $transient;
        if(
            self::load_info($json) &&
            version_compare(REMIND_ME_VERSION, $json['version'], '<') &&
            version_compare($json['requires'], get_bloginfo('version'), '<')
        ) {
            $res = new stdClass();
            $res->slug = 'remind-me';
            $res->plugin = 'remind-me/remind-me.php';
            $res->new_version = $json['version'];
            $res->tested = $json['tested'];
            $res->package = $json['url'];
            $transient->response[$res->plugin] = $res;
        }
        return $transient;
    }

    /**
     * @param WP_Upgrader $upgrader
     * @param array $options
     */
    public static function clear(WP_Upgrader $upgrader, array $options) : void {
        if(
            $options['action'] === 'update' &&
            $options['type'] === 'plugin'
        ) {
            delete_transient('remind-me_update');
        }
    }

    /**
     * @param array|null $remote
     * @return bool
     */
    private static function load_info(array &$remote = null) : bool {
        if(!($remote = get_transient('remind-me_update'))) {
            $remote = wp_remote_get("https://plugins.code-leaf.de/plugin/remind-me", [
                'timeout' => 10,
                'headers' => [
                    'Accept' => 'application/json'
                ]
            ]);

            if(!self::valid_response($remote)) return false;
            set_transient('remind-me_update', $remote, 43200);
        }
        try {
            $remote = json_decode($remote['body'], true, 512, JSON_THROW_ON_ERROR);
            return true;
        } catch(JsonException $e) {
            return false;
        }
    }

    /**
     * @param array | WP_Error $response
     * @return bool
     */
    private static function valid_response($response) : bool {
        return
        !is_wp_error($response) &&
        isset($response['response']['code']) &&
        $response['response']['code'] === 200 &&
        !empty($response['body']);
    }

}